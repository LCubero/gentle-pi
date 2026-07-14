# Implementation Tasks: Consolidate Review Parity Runtime

> Preserved task-plan history: the prior WU-01/I1–I5, F1, B1, B2, C1, C2, and C3 sections, checkmarks, verification evidence, incident boundaries, and completion gates remain authoritative and unchanged. This C4 section is appended as a bounded revision; no product code is authorized by this task revision.

## Preserved dependencies and final boundary

- Preserve all completed WU-01/I1–I5, F1, B1, B2, C1, C2, and C3 evidence and historical known-red output.
- Preserve escalated review `review-818fa72b8c23668a` and do not rerun its actors or reuse its receipt.
- Final review, SDD verification, lifecycle validation, and delivery remain blocked until the active revision's tasks, verification, reload, fresh lineage, and review gates pass.

## C4 — Compact changed-scope projection before actor dispatch

**Incident boundary:** fresh native lineage `review-d3587ca14ff4f06b` was blocked before any actor executed because the candidate-view `paths`/`modes` projection exposed all 293 candidate-tree entries (approximately 13.9 KB/16.6 KB JSON) instead of the 45 changed paths (approximately 2.45 KB). No lens was consumed and no actor output exists. The C3 parent `tool_call` hook is active after reload.

**Authority boundary:** preserve escalated review `review-818fa72b8c23668a` and its incident evidence unchanged. Abandon `review-d3587ca14ff4f06b` without mutation or FINALIZE because the scope will change and no actor ran. After implementation, reload, abandon the blocked lineage, create a fresh lineage, and run exactly one new high-risk 4R review.

**Finish:** CandidateView integrity-checks every candidate-tree entry, while its public projection and actor context contain only the canonical base-commit-to-candidate-tree changed review scope. Additions, modifications, deletions, renames, mode changes, and supported symlink changes are represented deterministically; genuinely oversized changed scope still fails closed. No product code is changed by this task revision.

**Rollback:** revert only the C4 changed-scope derivation, compact rendering, tests, harness, and documentation work. Do not mutate either review lineage, receipts, escalated evidence, or prior apply-progress hashes.

### C4 Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 250–400 |
| 400-line budget risk | Medium |
| Chained PRs recommended | No |
| Suggested split | Single bounded C4 work unit: scope derivation → compact context → verification/reload/review |
| Delivery strategy | exception-ok |
| Chain strategy | size-exception |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Medium

### C4 RED — strict-TDD false-overflow reproduction

- [x] Add a failing focused regression at the existing candidate-view/controller test targets (discover via `lib/review-candidate-view.ts`, `extensions/gentle-ai.ts`, and the C3 tests) with a 293-entry candidate tree and only 45 changed paths; assert the old full-tree projection exceeds the bounded dispatch context and actor count remains zero.
- [x] Add the fixture/harness assertion for fresh lineage `review-d3587ca14ff4f06b`: `review-d3587ca14ff4f06b` is blocked before actor execution, with no consumed lens, actor output, or FINALIZE mutation.

**Verification:** RED reproduces the false context overflow while proving no actor starts.

### C4 GREEN — canonical changed scope and compact public context

- [x] Keep CandidateView verification over every candidate-tree entry, including unchanged files, hashes, modes, path safety, and tree identity; do not weaken full-tree tamper detection.
- [x] Derive review scope from the canonical base commit to candidate tree using Git at the candidate-view implementation boundary. Include additions, modifications, deletions, renames, mode changes, and supported symlink changes; never derive scope from the full candidate tree or ambient worktree.
- [x] Change the public CandidateView/projection `paths` and `modes` to represent only changed review scope. Deleted paths must be explicit; present paths must carry their exact candidate mode. Preserve deterministic ordering and identity checks.
- [x] Encode actor context compactly without repeating paths, for example by grouping paths by exact mode plus a deleted group. Keep encoded context within the bounded dispatch limit, and fail closed when the genuinely changed scope itself is oversized.

**Verification:** focused tests turn GREEN for compact 45-path context, explicit deletion, exact candidate modes, and fail-closed oversized changed scope.

### C4 TRIANGULATE — scope, integrity, and runtime matrix

- [x] Exercise the 293-entry/45-change fixture through candidate-view creation, single dispatch, and parallel 4R dispatch; assert every actor receives identical compact scope/tree identity and no actor receives full-tree-only entries.
- [x] Cover additions, modifications, deletion, rename, mode change, and symlink cases where supported; verify deleted paths are explicit and renames remain deterministic under the Git-derived representation.
- [x] Prove tampering and live-worktree divergence still fail closed, including unchanged-file tampering in the candidate view despite unchanged files being absent from public review scope.
- [x] Re-run C3 unsafe-path/content/tree/hash/conflict cases and prove parallel 4R context is byte-identical in scope representation.

**Verification:** focused C4, runtime harness, package, and full tests provide evidence for scope parity, integrity preservation, no duplicate dispatch, and zero actors on invalid input.

### C4 REFACTOR — centralized rendering and truthful documentation

- [x] Centralize Git changed-scope derivation and deterministic compact rendering; remove duplicated full-tree path/mode projection logic without changing controller ownership or fail-closed boundaries.
- [x] Update the candidate-view and review-dispatch documentation to state that integrity covers the full candidate tree while public actor scope contains changed paths only; document explicit deletions, exact modes, compact grouping, and oversized-scope closure.

**Verification:** code review and focused tests show one deterministic scope/rendering boundary and truthful context-size behavior.

### C4 verification, lineage abandonment, reload, and final boundary

- [x] Run focused C4 suites, the real pi-subagents harness, package verification, full tests, and `git diff --check`; append evidence to `apply-progress.md` without overwriting C1/C2/C3 or incident evidence.
- [x] Run Pi `/reload` and prove the active parent tool-call hook and candidate-view runtime identity after reload.
- [x] Abandon `review-d3587ca14ff4f06b` without mutating or finalizing it; record that it blocked pre-actor with zero consumed lenses. Do not reuse its scope or receipt.
- [x] Create a fresh native lineage for the changed implementation scope and run exactly one new high-risk 4R review. Preserve escalated `review-818fa72b8c23668a` unchanged and do not rerun its actors.
- [x] Prepare the approved 4R receipt, exact verification commands, and frozen evidence required for independent SDD verification and lifecycle validation.

## C4 completion boundary

Apply is ready for the bounded C4 changed-scope work only. Final review, SDD verification, lifecycle validation, and delivery remain blocked until C4 verification, reload, blocked-lineage abandonment, fresh lineage creation, and the new high-risk 4R gate pass. No product code is edited by this task revision.
