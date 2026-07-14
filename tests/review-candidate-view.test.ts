import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { chmodSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
	CandidateViewRegistry,
	CandidateViewError,
	type CandidateGitExecutor,
	createCandidateView,
	injectReviewCandidateView,
} from "../lib/review-candidate-view.ts";

function git(cwd: string, ...arguments_: string[]): string {
	return execFileSync("git", arguments_, { cwd, encoding: "utf8" }).trim();
}

function repository(t: test.TestContext): string {
	const cwd = mkdtempSync(join(tmpdir(), "gentle-pi-candidate-view-"));
	t.after(() => rmSync(cwd, { recursive: true, force: true }));
	git(cwd, "init", "-b", "main");
	writeFileSync(join(cwd, "tracked.txt"), "base\n");
	git(cwd, "add", "tracked.txt");
	git(cwd, "-c", "user.name=Candidate Test", "-c", "user.email=candidate@example.invalid", "commit", "-m", "base");
	return cwd;
}

test("candidate view Git commands have a finite timeout and block materialization before worktree execution", (t) => {
	const calls: Array<{ arguments: readonly string[]; timeout: number | undefined }> = [];
	const executor: CandidateGitExecutor = (_file, arguments_, options) => { calls.push({ arguments: arguments_, timeout: options.timeout }); throw Object.assign(new Error("timed out"), { code: "ETIMEDOUT", killed: true }); };
	assert.throws(() => new CandidateViewRegistry(executor).create({ contributorRoot: repository(t) }), (error: unknown) => error instanceof CandidateViewError && /timed out/.test(error.message));
	assert.deepEqual(calls, [{ arguments: ["rev-parse", "--git-common-dir"], timeout: 10_000 }]);
	assert.equal(calls.some((call) => call.arguments[0] === "worktree"), false);
});

test("candidate view materializes exact tracked and initially-untracked content while contributor diverges", (t) => {
	const contributorRoot = repository(t);
	writeFileSync(join(contributorRoot, "tracked.txt"), "frozen tracked\n");
	writeFileSync(join(contributorRoot, "new.txt"), "frozen new\n");
	const view = createCandidateView({ contributorRoot });
	t.after(() => view.cleanup());
	assert.equal(readFileSync(join(view.root, "tracked.txt"), "utf8"), "frozen tracked\n");
	assert.equal(readFileSync(join(view.root, "new.txt"), "utf8"), "frozen new\n");
	assert.deepEqual(view.paths, ["new.txt", "tracked.txt"]);
	assert.deepEqual(view.modes, { "new.txt": "100644", "tracked.txt": "100644" });
	assert.equal(lstatSync(view.root).isSymbolicLink(), false);
	writeFileSync(join(contributorRoot, "tracked.txt"), "live divergence\n");
	assert.equal(readFileSync(join(view.root, "tracked.txt"), "utf8"), "frozen tracked\n");
	view.verify();
	view.cleanup();
});

test("candidate view recursively protects nested content and worktree metadata, and rejects injected untracked entries", (t) => {
	const contributorRoot = repository(t);
	mkdirSync(join(contributorRoot, "nested", "deeper"), { recursive: true });
	writeFileSync(join(contributorRoot, "nested", "deeper", "candidate.txt"), "candidate\n");
	const view = createCandidateView({ contributorRoot });
	try {
		assert.equal(lstatSync(join(view.root, "nested")).mode & 0o222, 0);
		assert.equal(lstatSync(join(view.root, "nested", "deeper")).mode & 0o222, 0);
		assert.equal(lstatSync(join(view.root, ".git")).mode & 0o222, 0);
		chmodSync(view.root, 0o755);
		chmodSync(join(view.root, "nested"), 0o755);
		chmodSync(join(view.root, "nested", "deeper"), 0o755);
		writeFileSync(join(view.root, "nested", "deeper", "injected.txt"), "injected\n");
		chmodSync(join(view.root, "nested", "deeper"), 0o555);
		chmodSync(join(view.root, "nested"), 0o555);
		chmodSync(view.root, 0o555);
		assert.throws(() => view.verify(), /untracked/);
	} finally {
		view.cleanup();
	}
});

test("candidate view registry rejects unsafe, moved, writable, stale, and unselected lens contexts before dispatch", (t) => {
	const contributorRoot = repository(t);
	writeFileSync(join(contributorRoot, "tracked.txt"), "candidate\n");
	const registry = new CandidateViewRegistry();
	const view = registry.create({ contributorRoot });
	t.after(() => registry.cleanup(view.token));
	registry.bind({ token: view.token, lineageId: "lineage-1", selectedLenses: ["review-risk"] });
	assert.equal(registry.resolveForLens("lineage-1", "review-risk").root, view.root);
	for (const lens of ["review-resilience", "review-readability", "review-reliability"]) {
		assert.throws(() => registry.resolveForLens("lineage-1", lens), CandidateViewError);
	}
	chmodSync(view.root, 0o755);
	assert.throws(() => registry.resolveForLens("lineage-1", "review-risk"), CandidateViewError);
	chmodSync(view.root, 0o755);
	chmodSync(join(view.root, "tracked.txt"), 0o644);
	writeFileSync(join(view.root, "tracked.txt"), "corrupt\n");
	chmodSync(view.root, 0o555);
	chmodSync(join(view.root, "tracked.txt"), 0o444);
	assert.throws(() => registry.resolveForLens("lineage-1", "review-risk"), CandidateViewError);
	registry.cleanup(view.token);
});

test("review subagent dispatch rejects missing or ambiguous selected candidate views", (t) => {
	const missing = new CandidateViewRegistry();
	assert.throws(
		() => injectReviewCandidateView({ agent: "review-risk", task: "review", mode: "task" }, missing),
		CandidateViewError,
	);
	const contributorRoot = repository(t);
	writeFileSync(join(contributorRoot, "tracked.txt"), "candidate\n");
	const registry = new CandidateViewRegistry();
	const first = registry.create({ contributorRoot });
	registry.bind({ token: first.token, lineageId: "first", selectedLenses: ["review-risk"] });
	writeFileSync(join(contributorRoot, "tracked.txt"), "candidate two\n");
	const second = registry.create({ contributorRoot });
	registry.bind({ token: second.token, lineageId: "second", selectedLenses: ["review-risk"] });
	assert.throws(
		() => injectReviewCandidateView({ agent: "review-risk", task: "review", mode: "task" }, registry),
		CandidateViewError,
	);
	registry.cleanup(first.token);
	registry.cleanup(second.token);
});

test("candidate view rejects control-character paths before prompt construction", (t) => {
	const contributorRoot = repository(t);
	writeFileSync(join(contributorRoot, "unsafe\npath.txt"), "candidate\n");
	assert.throws(() => createCandidateView({ contributorRoot }), CandidateViewError);
});

test("candidate view cleanup is confined and idempotent", (t) => {
	const contributorRoot = repository(t);
	const registry = new CandidateViewRegistry();
	const view = registry.create({ contributorRoot });
	const outside = join(contributorRoot, "outside.txt");
	writeFileSync(outside, "preserve\n");
	registry.cleanup(view.token);
	registry.cleanup(view.token);
	assert.equal(readFileSync(outside, "utf8"), "preserve\n");
	assert.equal(lstatSync(view.root, { throwIfNoEntry: false }), undefined);
});

test("corrected views stay within frozen scope and replace projections only when promoted", (t) => {
	const contributorRoot = repository(t);
	writeFileSync(join(contributorRoot, "tracked.txt"), "reviewed\n");
	const registry = new CandidateViewRegistry();
	const initial = registry.create({ contributorRoot }); registry.bind({ token: initial.token, lineageId: "correction", selectedLenses: ["review-risk"] });
	writeFileSync(join(contributorRoot, "tracked.txt"), "corrected\n");
	const corrected = registry.createCorrected("correction", contributorRoot);
	assert.notEqual(corrected.candidateTree, initial.candidateTree);
	assert.equal(registry.resolveProjection("correction", contributorRoot).candidateTree, initial.candidateTree);
	registry.promoteCorrected("correction", corrected.token);
	assert.equal(registry.resolveProjection("correction", contributorRoot).candidateTree, corrected.candidateTree);
	writeFileSync(join(contributorRoot, "escaped.txt"), "outside scope\n");
	assert.throws(() => registry.createCorrected("correction", contributorRoot), /escapes the frozen genesis paths/);
	registry.cleanupTerminal("correction", "approved");
});

test("candidate view exposes a compact 45-path changed scope for a 293-entry candidate tree", (t) => {
	const contributorRoot = repository(t);
	for (let index = 0; index < 248; index += 1) {
		writeFileSync(join(contributorRoot, `unchanged-${String(index).padStart(3, "0")}.txt`), "base\n");
	}
	git(contributorRoot, "add", ".");
	git(contributorRoot, "-c", "user.name=Candidate Test", "-c", "user.email=candidate@example.invalid", "commit", "-m", "many unchanged entries");
	writeFileSync(join(contributorRoot, "tracked.txt"), "changed\n");
	for (let index = 0; index < 44; index += 1) {
		writeFileSync(join(contributorRoot, `added-${String(index).padStart(3, "0")}.txt`), "candidate\n");
	}
	const registry = new CandidateViewRegistry();
	const view = registry.create({ contributorRoot });
	registry.bind({ token: view.token, lineageId: "compact-scope", selectedLenses: ["review-risk"] });
	assert.equal(view.paths.length, 45);
	assert.equal(Object.keys(view.modes).length, 45);
	assert.equal(view.paths.includes("unchanged-000.txt"), false);
	const dispatch = { agent: "review-risk", task: "review", mode: "task" };
	assert.doesNotThrow(() => injectReviewCandidateView(dispatch, registry));
	assert.ok(dispatch.task.length <= 4_096);
	registry.cleanup(view.token);
});

test("candidate view derives deletion, rename, executable, and symlink scope from the frozen Git trees", (t) => {
	const contributorRoot = repository(t);
	writeFileSync(join(contributorRoot, "deleted.txt"), "delete me\n");
	writeFileSync(join(contributorRoot, "script.sh"), "#!/bin/sh\necho base\n");
	git(contributorRoot, "add", ".");
	git(contributorRoot, "-c", "user.name=Candidate Test", "-c", "user.email=candidate@example.invalid", "commit", "-m", "scope base");
	renameSync(join(contributorRoot, "tracked.txt"), join(contributorRoot, "renamed.txt"));
	rmSync(join(contributorRoot, "deleted.txt"));
	chmodSync(join(contributorRoot, "script.sh"), 0o755);
	try {
		symlinkSync("script.sh", join(contributorRoot, "linked.sh"));
	} catch {
		t.skip("platform does not support symlinks");
		return;
	}
	const registry = new CandidateViewRegistry();
	const view = registry.create({ contributorRoot });
	try {
		assert.deepEqual(view.paths, ["deleted.txt", "linked.sh", "renamed.txt", "script.sh"]);
		assert.deepEqual(view.deletedPaths, ["deleted.txt"]);
		assert.deepEqual(view.modes, { "linked.sh": "120000", "renamed.txt": "100644", "script.sh": "100755" });
		registry.bind({ token: view.token, lineageId: "scope-kinds", selectedLenses: ["review-risk"] });
		const dispatch = { agent: "review-risk", task: "review", mode: "task" };
		injectReviewCandidateView(dispatch, registry);
		assert.match(dispatch.task, /Frozen changed scope by mode: .*"deleted":\["deleted\.txt"\]/);
		assert.doesNotMatch(dispatch.task, /Frozen paths:|Frozen modes:/);
		view.verify();
	} finally {
		registry.cleanup(view.token);
	}
});

test("candidate view verifies unchanged tree entries even when they are absent from changed scope", (t) => {
	const contributorRoot = repository(t);
	writeFileSync(join(contributorRoot, "unchanged.txt"), "base\n");
	git(contributorRoot, "add", ".");
	git(contributorRoot, "-c", "user.name=Candidate Test", "-c", "user.email=candidate@example.invalid", "commit", "-m", "unchanged base");
	writeFileSync(join(contributorRoot, "tracked.txt"), "changed\n");
	const view = createCandidateView({ contributorRoot });
	try {
		assert.deepEqual(view.paths, ["tracked.txt"]);
		chmodSync(view.root, 0o755);
		chmodSync(join(view.root, "unchanged.txt"), 0o644);
		writeFileSync(join(view.root, "unchanged.txt"), "tampered\n");
		chmodSync(join(view.root, "unchanged.txt"), 0o444);
		chmodSync(view.root, 0o555);
		assert.throws(() => view.verify(), CandidateViewError);
	} finally {
		view.cleanup();
	}
});

test("candidate view fails closed before dispatch when the changed scope itself exceeds 4096 bytes", (t) => {
	const contributorRoot = repository(t);
	for (let index = 0; index < 80; index += 1) {
		writeFileSync(join(contributorRoot, `changed-${String(index).padStart(3, "0")}-${"x".repeat(80)}.txt`), "candidate\n");
	}
	const registry = new CandidateViewRegistry();
	const view = registry.create({ contributorRoot });
	try {
		registry.bind({ token: view.token, lineageId: "oversized-scope", selectedLenses: ["review-risk"] });
		assert.throws(
			() => injectReviewCandidateView({ agent: "review-risk", task: "review", mode: "task" }, registry),
			/candidate view context exceeds the bounded dispatch contract/,
		);
	} finally {
		registry.cleanup(view.token);
	}
});

test("candidate view retains a valid dangling symlink through bind and finalize resolution", (t) => {
	const contributorRoot = repository(t);
	try {
		symlinkSync("missing-target", join(contributorRoot, "dangling-link"));
	} catch {
		t.skip("platform does not support symlinks");
		return;
	}
	const registry = new CandidateViewRegistry();
	const view = registry.create({ contributorRoot });
	try {
		registry.bind({ token: view.token, lineageId: "dangling-link", selectedLenses: ["review-reliability"] });
		const finalized = registry.resolveForFinalize("dangling-link");
		const link = join(finalized.root, "dangling-link");
		assert.equal(lstatSync(link).isSymbolicLink(), true);
		finalized.verify();
		chmodSync(finalized.root, 0o755);
		for (const target of ["other-target", "../escape"]) {
			rmSync(link);
			symlinkSync(target, link);
			assert.throws(() => finalized.verify(), CandidateViewError);
		}
		rmSync(link);
		assert.throws(() => finalized.verify(), CandidateViewError);
	} finally {
		registry.cleanup(view.token);
	}
});

test("candidate view represents an all-deletion candidate without requiring a candidate-tree entry", (t) => {
	const contributorRoot = repository(t);
	rmSync(join(contributorRoot, "tracked.txt"));
	const view = createCandidateView({ contributorRoot });
	try {
		assert.deepEqual(view.paths, ["tracked.txt"]);
		assert.deepEqual(view.deletedPaths, ["tracked.txt"]);
		assert.deepEqual(view.modes, {});
		view.verify();
	} finally {
		view.cleanup();
	}
});
