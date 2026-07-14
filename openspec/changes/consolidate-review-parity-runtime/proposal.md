# Proposal: Consolidate Review Parity Runtime

## Intent

End the current review-parity cycle with one coherent Gentle Pi release that addresses issues #96, #113, #119, #122, #123, #124, #128, #129, #133, and #137, while preserving and shipping the package-local Gentle AI binary provisioning already present in the worktree.

The release must make the supported review path truthful and operable: reviewers inspect the controller-frozen candidate, lifecycle validation authorizes the same intended candidate, supported compact FINALIZE input is discoverable, package-local runtime provisioning is reproducible, and cross-platform/runtime behavior is either fixed by this package or explicitly handed off to a named upstream tracker. It must not claim success by bypassing lifecycle gates, fabricating OpenSpec mirrors, inventing policy hashes, or depending on unreleased Gentle AI APIs.

## Product problem and current-state gap

Gentle Pi users currently face a cluster of parity failures and stale reports around the review runtime. The most serious defects can make the security promise differ from actual behavior:

- a 4R reviewer may receive an immutable tree identifier without a resolvable read-only view of that tree and accidentally inspect the live worktree instead (#96);
- compact review START and pre-commit VALIDATE may compare structurally different candidate projections, producing false `scope-changed` results and blocking legitimate commits (#119 and #133);
- compact FINALIZE requires a nested input structure that is only discoverable by reading implementation source or iterating through errors (#123);
- Windows persistence semantics may reject otherwise valid review operations (#128); and
- users cannot tell which reports still require Pi code, which are already fixed, which are duplicates of a root defect, and which require an upstream released contract (#113, #122, #124, #129, and #137).

The package-local Gentle AI installer work is already uncommitted in the worktree. Losing or replacing it would reintroduce runtime-version ambiguity precisely where this change depends on matching Pi behavior to a released Gentle AI contract.

This uncertainty has operational cost: agents cannot safely commit, maintainers repeatedly diagnose the same projection and authority boundaries, Windows users can be blocked, and tracker state does not reliably communicate whether action belongs in Gentle Pi or upstream Gentle AI.

## Target users and user impact

This change primarily serves:

- Pi agents and maintainers performing bounded review before commit, push, PR, or release;
- reviewers who must inspect exactly the frozen candidate rather than mutable workspace content;
- contributors using linked worktrees, fork PR heads, staged initially-untracked files, or Windows;
- package consumers who need a compatible Gentle AI binary without a separate global installation; and
- release/support maintainers who need evidence-based tracker dispositions instead of another parity investigation cycle.

After the release, the supported path should either work against the package-provisioned released runtime or fail closed with a precise, honest upstream dependency. No user should be instructed to bypass the gate, reset valid authority, invent provenance values, or hand-author security-relevant mirrors.

## Product outcome

The release establishes one explainable review-runtime boundary:

1. selected review lenses receive a controller-owned, read-only, resolvable view of the exact frozen review candidate, and dispatch does not begin if that view cannot be established;
2. pre-commit validation derives and validates the same candidate semantics supported by the released review runtime, eliminating Pi-created false projection mismatches while retaining fail-closed authorization;
3. compact FINALIZE documentation shows the supported nested lens-result shape and a minimal valid example;
4. the package provisions and verifies its compatible Gentle AI binary locally without overwriting unrelated user-managed runtime assets;
5. existing fork-head and candidate-identity behavior is protected by regression evidence rather than duplicated; and
6. every issue in this work unit receives a terminal, evidence-linked disposition: fixed by code, proven already fixed, superseded/duplicate with a named root fix, or upstream-blocked with a linked upstream tracker.

A terminal disposition is not synonymous with closing an issue. An upstream-blocked issue must remain truthfully blocked or open according to repository policy and link the actual upstream tracker. The release must not claim the upstream work is delivered.

## Scope

### Included product slice

- Preserve the existing uncommitted package-local installer baseline, including `scripts/install-gentle-ai.mjs`, `scripts/gentle-ai-installer.mjs`, `lib/gentle-ai-binary.ts`, and package-content verification references. Implementation may integrate and test this work but must not discard, silently rewrite, or replace it with a global-install assumption.
- Make the frozen reviewer candidate resolvable through controller-owned context for every selected 4R lens and fail closed before actor dispatch when resolution or content identity cannot be proven (#96).
- Align Pi pre-commit target derivation and gate authorization with the supported released Gentle AI projection/receipt contract, fixing the root cause in #133 and the actionable symptom in #119. The lifecycle gate remains mandatory.
- Document the currently supported compact-v2 FINALIZE input, including `review_result.lens_results[].{lens,findings,evidence}`, selected-lens completeness, paired final evidence/result requirements, and a minimal no-correction example (#123).
- Verify and preserve owner-qualified GitHub fork-head handling (#129) and candidate-identity-filtered lifecycle discovery (#137) with focused regression evidence.
- Resolve Windows durability behavior in active package-local Pi persistence paths where repository tests prove Pi owns the failing operation (#128). If the failing operation is owned by the package-provisioned released Gentle AI binary, record an upstream-blocked disposition and link the real upstream tracker instead of duplicating its persistence implementation.
- Verify the native ordinary START policy-source contract and preserve the explicit native-versus-legacy distinction (#124); do not create a Pi-defined canonical hash.
- Evaluate true `scope-changed` diagnostics only against fields exposed by the installed released runtime (#122). Pi may present released receipt/candidate comparison data, but it must not reconstruct authoritative trees or hashes from private storage.
- Produce one umbrella issue, one PR, one merge, and one release after implementation verification and bounded review. The PR has an explicit unlimited size exception for this consolidation work unit.

### Per-issue outcome contract

| Issue | Planned terminal disposition | Required evidence or named root fix |
| --- | --- | --- |
| #96 | **Fixed by code** | Integration evidence proves every dispatched lens can resolve and read the controller-frozen candidate, cannot silently fall back to live cwd content, and no actor starts when snapshot resolution fails. |
| #113 | **Upstream-blocked** | Link an actual Gentle AI upstream tracker for a released compact-v2-to-OpenSpec projection/reconciliation or native OpenSpec consumption contract. Preserve valid receipts and refuse destructive reset or fabricated mirrors. If a released contract exists by implementation time, consume only that released contract and revise the disposition with evidence. |
| #119 | **Superseded/duplicate** | Name #133's projection-alignment fix as the root correction and attach regression evidence that changed scope creates a new lineage while unchanged intended content no longer receives a Pi-created false mismatch. No force/reset bypass is added. |
| #122 | **Upstream-blocked unless released data is sufficient** | First remove the false mismatch through #133. For genuine mismatches, expose only comparison data available from the released validate contract. If receipt tree/path-diff data is absent, link the actual Gentle AI upstream diagnostics tracker; do not parse private authority stores to fabricate it. |
| #123 | **Fixed by documentation/code metadata** | Tool-definition regression confirms the FINALIZE input description contains the nested lens shape, completeness rules, paired final evidence/result rule, and minimal valid example matching runtime behavior. |
| #124 | **Superseded by the native ordinary START contract** | Name native ordinary START delegation using the released `policyPath`/internally derived policy identity as the root resolution; preserve legacy compact validation only where explicitly supported. Regression evidence proves callers of the supported native path do not invent or hard-code a policy hash. |
| #128 | **Fixed by Pi code when Pi-owned; otherwise upstream-blocked** | Ownership is decided from executable package-local call paths and Windows-focused tests, not issue prose. Fix writable-file and supported-directory durability in Pi-owned paths without weakening publication/lock guarantees; otherwise link the actual Gentle AI upstream portability tracker and make no shadow implementation. |
| #129 | **Proven already fixed** | Focused regressions cover valid `owner:branch`, malformed syntax, ambiguous/missing owner remotes, and divergent advertised commits. No duplicate implementation is added. |
| #133 | **Fixed by code** | End-to-end START/finalize/pre-commit validation proves candidate projection alignment, complete intended-untracked handling, exact staged-tree authorization, scope-change denial, and zero lifecycle-gate bypasses against the package-provisioned released runtime. |
| #137 | **Proven already fixed** | Focused regressions prove implicit discovery filters by live candidate identity, unrelated historical/escalated lineages do not contaminate independent worktrees, corrected candidates remain valid, and multiple true matches still fail closed. Windows fsync work is dispositioned under #128 rather than duplicated here. |

For #113, #122, or #128, an “upstream-blocked” disposition is terminal for this work unit only after a concrete upstream issue URL is linked in the local tracker and release evidence. Placeholder or invented issue numbers are not acceptable.

## Business rules and invariants

- Review and lifecycle authority remains fail closed. A parity fix may correct candidate derivation or context propagation but may not add a bypass, blanket allow, headless destructive reset, or script-wrapping exception.
- Reviewer actor output is untrusted and cannot authorize transitions, gates, delivery, or release.
- A reviewer must inspect the immutable candidate bound by the controller. Ambient worktree access is not an acceptable substitute.
- The released, package-provisioned Gentle AI interface is the compatibility boundary. Unreleased issue comments, private store layouts, and guessed schemas are not APIs.
- Native ordinary and legacy compact contracts remain distinct. Native policy identity must not be replaced with a Pi-invented canonical hash, and legacy-only inputs must not leak into the native path.
- Valid receipts and authority history must not be destroyed merely to unblock OpenSpec or lifecycle status.
- Existing package-local installer changes are protected baseline scope. Integration must preserve user/project overrides and must not claim to rewrite their effective permissions.
- Each tracker disposition must cite tests, source/runtime evidence, a named root fix, or a real upstream tracker. A generic “cannot reproduce” or release-note assertion is insufficient.
- Strict TDD applies during implementation: focused regressions are written or identified before behavior changes, then the full `pnpm test` and package-content verification paths must pass.

## Non-goals

- Implementing compact-v2-to-OpenSpec projection or `gentle-ai.verify-result/v1` without a released upstream contract (#113).
- Hand-authoring OpenSpec review mirrors, receipt hashes, policy hashes, lineage identities, or candidate trees.
- Adding a generic `--force`, headless destructive reset, lifecycle bypass, or “cosmetic mismatch” allowlist.
- Redesigning the bounded-review transaction, review budget, lens-selection policy, or Judgment Day.
- Reopening already solved fork-head or candidate-discovery code merely to increase changed-line count.
- Broadly replacing Gentle AI persistence inside Pi when the active failure belongs upstream.
- Expanding #137's candidate-identity scope into unrelated Windows durability work; that concern belongs to #128.
- Changing package/user agent override precedence or globally refreshing unrelated Gentle AI runtime assets.
- Splitting this release into chained PRs. The approved delivery boundary is one PR with an explicit unlimited size exception.
- Waiting for CodeRabbit after required local tests, bounded review, independent SDD verification, and mandatory CI/repository gates are satisfied.

## Affected areas

Expected affected areas for later phases include:

- review facade/controller dispatch and immutable snapshot context;
- lifecycle target derivation and pre-commit gate integration;
- compact FINALIZE tool-definition documentation;
- package-local Gentle AI binary resolution, installation, package scripts, and package-content verification;
- active package-local persistence/reset paths if #128 ownership is proven;
- focused review, lifecycle, worktree, fork-head, Windows, installer, and runtime-harness tests;
- release notes and evidence-based issue comments; and
- OpenSpec specs, design, tasks, apply progress, verification, and archive artifacts for this change.

Product code is not changed in this proposal phase.

## Compatibility and migration

- Compatibility is defined against the Gentle AI version actually pinned and provisioned by this package at release time. Implementation must inspect that released binary's help/schema/runtime behavior before selecting an adaptation.
- Existing valid review authority remains valid only according to its published contract. This change does not translate stores, rewrite receipts, or promise cross-store compatibility.
- Native ordinary review continues to derive its policy identity through the supported native contract. Legacy compact callers continue to receive explicit legacy validation; they do not gain an invented default.
- Existing fork PR syntax (`branch` and `owner:branch`), linked-worktree behavior, complete candidate identity, and staged initially-untracked semantics must remain compatible where already supported.
- Package-local provisioning must coexist with project/user overrides and avoid requiring a separately installed global `gentle-ai` binary for the package's supported path.
- No data migration is planned. Any upstream projection or persistence migration requires a separately released and documented contract.

## Release boundary and delivery

This is intentionally a single coherent release rather than another partial parity patch:

1. planning covers the complete issue bundle and protected installer baseline;
2. implementation uses work-unit commits, keeping each behavior with its regressions and documentation;
3. the final PR may exceed the normal 400-line review threshold under the pre-approved explicit unlimited `size:exception`;
4. ordinary bounded review still follows the deterministic risk policy and the same content-bound receipt is validated at pre-commit, pre-push, pre-PR, and release gates;
5. independent SDD verification must pass before delivery actions;
6. delivery creates/updates an umbrella issue that links all ten trackers and their evidence-based dispositions, opens one PR, merges it after mandatory gates, and publishes one release; and
7. CodeRabbit is not a release gate for this work unit. Delivery does not wait for it once required tests, CI, review authority, SDD verification, and repository protections pass.

The size exception changes packaging, not correctness: it does not waive tests, bounded review, receipt validation, CI, issue evidence, or fail-closed behavior.

## Risks and tradeoffs

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Pi silently relies on an unreleased or private Gentle AI API | The release works only in a developer checkout or corrupts authority semantics | Pin/provision a released runtime, inspect its real contract, and upstream-block unsupported needs with real tracker links |
| Snapshot context still permits ambient-worktree fallback | Review evidence may be bound to content actors did not inspect | Controller-owned read-only context, pre-dispatch resolution/content checks, adversarial live-worktree divergence tests, fail closed before actor launch |
| Projection alignment over-corrects into a gate bypass | Commits could be authorized for unreviewed content | Bind START, receipt, staged/intended candidate, and command target end to end; retain scope-change denial and lifecycle validation |
| The installer baseline is lost or broadens into global state mutation | Consumers receive inconsistent runtimes or user overrides are damaged | Treat current uncommitted installer work as protected baseline; verify package-local paths and package contents; preserve override precedence |
| “Already fixed” issues regress because no code is changed | Stale behavior ships without proof | Require focused regression evidence and runtime/source references for #129 and #137 before terminal disposition |
| Windows durability fix weakens POSIX or atomic publication guarantees | Review authority could become less durable or race-prone | Change only proven Pi-owned paths, retain strict writable-file fsync and atomic/no-replace semantics, add platform-focused failure tests; otherwise upstream-block |
| Upstream-blocked issues are falsely closed as delivered | Tracker state misleads users and support | Link real upstream trackers, state the missing released contract, keep local issue state truthful, and list blockers in release notes |
| Single PR creates reviewer fatigue | Integration defects may be missed | Use behavior-oriented work-unit commits, focused evidence per issue, deterministic 4R review for the high-risk/large diff, and the explicit size exception without reducing review rigor |
| Release proceeds without CodeRabbit feedback | A late bot comment may arrive after merge | Treat mandatory local/CI/bounded-review/SDD gates as authoritative; record late actionable bot findings as follow-up rather than blocking this approved release policy |

## Rollback and recovery

- The release should be revertible as one coherent version, while behavior-oriented commits permit a targeted revert when one work unit is independently faulty.
- Rollback must never restore a lifecycle bypass or silently reinterpret an existing receipt. If compatibility with the pinned runtime cannot be proven, the affected path fails closed and the release is halted or reverted.
- Reverting package-local provisioning restores the previous package behavior only if package metadata and verification are reverted together; it must not delete user-managed binaries or overrides.
- Snapshot-context or projection rollback must leave review/lifecycle operations blocked rather than fall back to live workspace inspection or authorize a mismatched candidate.
- Documentation-only rollback does not alter authority, but the release should not retain an undocumented public FINALIZE shape.
- Upstream-blocked dispositions are recovered by consuming a later released upstream contract in a separate change, not by fabricating compatibility in this release.

## Acceptance criteria

1. All ten issue numbers and the package-local installer work appear in the umbrella issue, PR, release notes, and final verification matrix.
2. Every tracker has exactly one evidence-based terminal disposition for this work unit: fixed by code, proven already fixed with regression evidence, superseded/duplicate with a named root fix, or upstream-blocked with a real linked upstream tracker.
3. No tracker is reported as fixed or closed when the released behavior and tests do not support that claim; upstream-blocked trackers remain truthfully represented.
4. For #96, every selected reviewer receives a controller-owned immutable candidate view; tests prove frozen content is read even when the live worktree diverges, and dispatch fails before any actor starts when the candidate cannot be resolved.
5. For #133/#119, supported START through FINALIZE through pre-commit VALIDATE authorizes unchanged intended content, includes supported staged initially-untracked content, denies real candidate/path changes, and requires no bypass, reset, direct object writing, or store deletion.
6. For #123, the public tool definition documents the nested lens-result input and minimal successful no-correction FINALIZE example accurately enough for a caller to construct valid input without reading source.
7. For #124, the supported native ordinary path obtains policy identity only through the released native contract; no production code, docs, or examples invent a canonical policy hash.
8. For #129, focused tests prove owner-qualified fork heads bind to the exact intended remote commit and malformed, ambiguous, missing, or divergent cases fail closed.
9. For #137, focused cross-worktree/candidate tests prove unrelated historical lineages do not contaminate discovery, corrected and staged initially-untracked candidates remain valid, and multiple true matches fail closed.
10. For #128, Windows-focused evidence either proves the Pi-owned durability correction while retaining strict authority guarantees or the local issue links a concrete upstream Gentle AI tracker and clearly states the unreleased dependency.
11. For #122, diagnostics for genuine mismatch use only fields from a released runtime contract; absent receipt/path-diff support is represented by a linked upstream blocker, not private-store reconstruction.
12. For #113, no destructive reset, receipt invalidation, fabricated mirror, or guessed verify envelope is introduced; the missing released reconciliation contract is linked to an actual upstream tracker unless it has been released and safely consumed.
13. The existing uncommitted package-local installer work remains present, is integrated without unrelated rewrites, provisions the pinned compatible Gentle AI binary in the package-local location, preserves override precedence, and passes package-content verification.
14. Strict TDD evidence is recorded for changed behavior, focused suites pass, the runtime harness passes, full `pnpm test` passes, and package verification passes on the supported Node.js 24 environment.
15. The large/high-risk implementation receives the required bounded 4R review, produces an approved content-bound receipt, and the same receipt validates at all applicable lifecycle gates.
16. Independent SDD verification reports no critical proposal/spec/runtime gap before delivery.
17. One umbrella issue, one PR with the explicit unlimited size exception, one merge, and one release complete the work unit after mandatory gates; delivery does not wait for CodeRabbit.

## Proposal assumptions

This proposal runs in automatic mode and therefore does not pause for a question round. It adopts the user-provided decisions as binding: exact ten-issue scope plus package-local provisioning, one coherent release, one PR with an explicit unlimited size exception, evidence-based terminal tracker dispositions, no invented unreleased APIs, and delivery without waiting for CodeRabbit after mandatory verification and gates. Any implementation discovery that conflicts with those boundaries must fail closed and be surfaced as a proposal/spec revision rather than silently broadening scope.
