# Apply Progress: Consolidate Review Parity Runtime

> **Provenance recovery (2026-07-13).** This is a reconstructed, cumulative record after the B1 writer overwrote the untracked progress file. It preserves, rather than erases, earlier conclusions that later evidence superseded. Sources are the local Pi transcript named in the recovery request, the current task/state artifacts, and the corroborating files named below.

## Recovery boundary and authority

- Consumed status: OpenSpec artifact store; change `consolidate-review-parity-runtime`; allowed root `/home/gentleman/work/gentle-pi`; strict TDD configuration uses `pnpm test`; delivery exception is `exception-ok` / `size-exception`.
- Before reconstruction, SHA-256 values for every changed or untracked non-OpenSpec path were saved in `recovery-non-openspec-before.sha256`.
- This recovery edits only OpenSpec provenance/state artifacts. It does **not** implement B2, edit product/test/package files, or mutate `.git/gentle-ai/**` authority.
- There is no current review lineage or receipt for this candidate. Existing native authority is not interpreted, altered, reconstructed, or reconciled by this recovery.

## WU-01 — protected installer baseline — complete

**Source:** transcript line 257, message `6f59cd2b`, `2026-07-13T15:58:02.238Z`; corroborated by `installer-baseline.md` and `protected-installer-checklist.md`.

- Captured the installer/package baseline, protected diffs, environment, and SHA-256 values; added the protected-path checklist.
- Focused installer/binary/package suites passed 37/37 and package-resource verification passed (54 files). No product behavior was changed by WU-01.

## Installer-root correction and WU-02 feasibility probe — historical failure (SUPERSEDED)

**Source:** transcript line 257, message `6f59cd2b`, `2026-07-13T15:58:02.238Z`.

- The initial feasibility record correctly stopped when the installer put v2.1.2 under the sibling work directory rather than package-local `.gentle-ai/`.
- A subsequent RED/GREEN correction changed the installer package-root calculation, installed the verified package-local v2.1.2 binary, and added the linked-view runtime probe.
- **SUPERSEDED historical conclusion:** the then-unchanged candidate denial (`receipt-binding/candidate-or-paths-mismatch`) was recorded as a runtime blocker. Later differential fixture evidence identified the polluted fixture as the cause; this is retained as incident history, not a current blocker.

## I1–I3 partial record and correction — complete

**Sources:** transcript line 257/message `6f59cd2b` (`2026-07-13T15:58:02.238Z`) for the partial record; transcript line 259/message `4e59e4ff` (`2026-07-13T16:05:20.309Z`), subtask `subtask_sdd-apply_1783958294856_7149a273`, for the correction; corroborated by completed I1–I3 checkboxes in `tasks.md`.

- Partial record: I1 resolver hardening and I2 FINALIZE documentation were completed; I3 was initially retained pending additional #137 coverage.
- Correction: I1 and I3 correction slice completed, with all eight I1/I3 TDD checkboxes persisted `[x]`; I2 remained complete.
- Evidence from the correction: I1 focused suite 71/71, I3 focused suite 107/107, and package-resource verification passed. The parity fixture was preserved unchanged and unexecuted by that slice.

## I4 — upstream ownership and trackers — complete

**Source:** transcript line 261, message `d39f5d9c`, `2026-07-13T16:10:00.434Z`, subtask `subtask_sdd-apply_1783958740776_2d501529`; corroborated by `upstream-trackers/` and completed I4 checkboxes.

- Created and verified Gentle AI trackers #1247 (#113), #1248 (#122), and #1249 (#128).
- All four I4 checkboxes were completed. No production tests were attributed to this evidence-only tracker slice.

## I5 — verification record — historical known-red (SUPERSEDED)

**Source:** transcript line 269, message `dfc3fd76`, `2026-07-13T16:13:44.430Z`, subtask `subtask_sdd-apply_1783959033003_4077ecb7`; corroborated by completed I5 checkboxes.

- Focused I1/I2/I3 suites, harness, and package verification passed; the historical full suite was 688/689 with only the #1244 fixture probe failing.
- **SUPERSEDED historical conclusion:** the #1244 probe was described as a known-red runtime/projection blocker. It is preserved for forensic continuity only. It is not an accepted future suite state and is superseded by the corrected F1 differential evidence below.

## #1244 false-positive correction and F1 corrected fixture gate — complete

**Sources:** transcript line 318, message `8e181bc3`, `2026-07-13T16:40:49.762Z`, subtask `subtask_sdd-apply_1783960402261_04c89503`; transcript line 328, message `d92d773a`, `2026-07-13T16:45:50.724Z`, subtask `subtask_sdd-apply_1783960897251_be8effdc`; corroborated by completed F1 checkboxes, revised `tasks.md`, `design.md`, and `state.yaml`.

- The parity fixture was corrected to use the absolute package-local v2.1.2 binary and a detached linked candidate view with external result/evidence artifacts and exact reviewed-path staging.
- It proved unchanged allow and changed-byte scope denial. The focused fixture passed repeatedly; `pnpm test` passed 689/689 and `git diff --check` passed.
- The evidence correction covered tree, complete path set, modes, digest source, external artifacts, and platform-guarded mode drift; on this Linux run the mode-drift case executed.
- #1244 is therefore a Gentle Pi fixture false positive. No Gentle AI source change, release, or pin update is required.

## B1 — #96 candidate-view production integration — complete

**Source:** transcript line 330, message `538e6a4e`, `2026-07-13T16:54:54.840Z`, subtask `subtask_sdd-apply_1783961171488_b3419930`; corroborated by the current B1 evidence retained in this recovery, B1 `[x]` task checkboxes, and the listed source/test paths.

- RED: new candidate-view test initially failed because the production module was absent.
- GREEN: added the Pi-owned candidate-view registry/controller integration and reviewer launch context; native START/FINALIZE use the bound view and actor output remains external/untrusted.
- TRIANGULATE: covered tracked/untracked materialization, live-worktree divergence, modes/path identity, unsafe/writable/corrupt/unselected contexts, lens selection, and idempotent confined cleanup.
- REFACTOR: preserved explicit ownership boundaries between ephemeral Pi views and native authority.
- Verification: candidate-view focused tests 3/3; candidate-view plus native-routing 83/83; `pnpm test` passed 692/692 plus harness; package-resource verification passed; `git diff --check` passed.
- B1 completion was initially reported `blocked` solely because its writer overwrote prior apply-progress provenance. This recovery resolves that provenance defect; it does not revise B1 behavior or evidence.

## TDD cycle evidence

| Slice | RED | GREEN | TRIANGULATE | REFACTOR | Result |
| --- | --- | --- | --- | --- | --- |
| WU-01 | Baseline captured | No product edit | Protected hashes/suites | Checklist | Complete |
| WU-02 | Real probe | Installer-root correction | Linked view | Fail closed | Historical failure, superseded |
| I1–I3 | Resolver/docs/regression gaps | Focused corrections | 71/71 and 107/107 correction evidence | Ownership boundaries | Complete |
| I4 | Tracker need identified | Trackers created | Tracker artifacts verified | No production change | Complete |
| I5 | Historical fixture red | Focused/harness/package green | Full-suite evidence captured | Known-red retained as history | Superseded |
| F1 | Polluted fixture reproduced | Clean linked-view fixture | Allow/deny/mode evidence | Shared fixture handling | Complete |
| B1 | Missing module test failure | Candidate view integration | Divergence and safety cases | Registry/controller separation | Complete |

## Recovery verification and unchanged targets

- Pre-recovery non-OpenSpec manifest: `recovery-non-openspec-before.sha256`.
- Post-recovery manifest: `recovery-non-openspec-after.sha256`.
- The manifests must compare byte-for-byte equal; no tests are rerun because this recovery changes no product/test/package byte.
- `git diff --check` is required after the OpenSpec-only edit.

## Files changed by this recovery

- `openspec/changes/consolidate-review-parity-runtime/apply-progress.md`
- `openspec/changes/consolidate-review-parity-runtime/state.yaml`
- `openspec/changes/consolidate-review-parity-runtime/recovery-non-openspec-before.sha256`
- `openspec/changes/consolidate-review-parity-runtime/recovery-non-openspec-after.sha256`

## Remaining tasks and delivery boundary

- `- [ ] **RED:** add failing focused tests for exact reviewed-path staging, tree/path/mode preconditions, initially-untracked files, byte/path/mode drift, and prevention of harness-artifact staging or \`git add -A\`.`
- `- [ ] **GREEN:** implement #119/#133 projection and pre-commit integration at concrete discovery targets (controller staging/routing and native pre-commit call path). Preserve the native gate, one-shot authorization, and fail-closed behavior; Pi checks are diagnostics/preconditions only.`
- `- [ ] **TRIANGULATE:** run focused and integration evidence for unchanged allow and changed deny, including linked/original worktree projection and live divergence. Confirm no authority translation, private-store access, reset, force option, or fabricated identity.`
- `- [ ] **REFACTOR:** consolidate exact projection helpers and truthful documentation without weakening native rederivation.`

B2 is the next ordered work-unit slice. Final verification, 4R review, lifecycle gates, delivery, commit, push, PR, and release remain out of scope. No task checkbox was changed by this recovery.

## B2 — #119/#133 exact projection and pre-commit authorization — complete

- **RED:** Added focused controller-routing coverage that initially proved a changed staged tree could reach a fake native allow after B1 finalized. The failing test required zero native validation calls for an unproven projection.
- **GREEN:** Retained only the B1 frozen candidate projection in the Pi-owned in-memory candidate-view registry after linked-view cleanup. Native pre-commit validation now first proves the original contributor root's `git write-tree` exactly equals that frozen candidate tree. `git commit -a`/`--all`, pathspec commits, and unprovable tree options fail closed; Pi never simulates broad staging. Native `review validate --gate pre-commit` remains the sole authorization decision.
- **TRIANGULATE:** Focused tests cover tracked plus initially-untracked exact staging, byte and extra-path/harness-artifact drift, one-shot bash-time rederivation, and unsupported commit shapes. The package-local v2.1.2 integration passed unchanged allow plus byte/path/mode denial using the linked view and original worktree, with external harness artifacts only.
- **REFACTOR:** Centralized the local precondition in `assertFrozenPreCommitProjection`; authorization stores the intended tree and re-proves it before and after bash-time native validation. Candidate-view cleanup remains confined; no native authority, receipt, private store, reset, force option, or fabricated allow is used.

### B2 files changed

- `extensions/gentle-ai.ts`
- `lib/review-candidate-view.ts`
- `tests/review-controller-native-routing.test.ts`
- `tests/review-controller.test.ts`
- `openspec/changes/consolidate-review-parity-runtime/tasks.md`
- `openspec/changes/consolidate-review-parity-runtime/apply-progress.md`

### B2 verification

- `node --experimental-strip-types --test tests/review-controller-native-routing.test.ts` — 82 passing
- `node --experimental-strip-types --test tests/native-review-parity-runtime.test.ts` — 1 passing; real package-local v2.1.2 linked-view START/FINALIZE and original-worktree pre-commit allow/deny flow
- `node --experimental-strip-types --test tests/review-candidate-view.test.ts tests/review-controller-native-routing.test.ts` — 85 passing
- `node --experimental-strip-types --test tests/review-controller.test.ts` — 37 passing
- `pnpm run test:harness` — passed
- `node scripts/verify-package-files.mjs` — passed (54 files)
- `git diff --check` — passed
- `pnpm test` — passed (694/694), then runtime harness passed

### TDD Cycle Evidence

| Slice | Safety net | RED | GREEN | TRIANGULATE | REFACTOR | Result |
| --- | --- | --- | --- | --- | --- | --- |
| B2 exact projection | `review-controller-native-routing` 80/80 | Changed staging reached fake native allow (expected block) | Frozen-tree precondition blocks before native validation | Exact tracked/untracked allow; byte, extra path/harness, mode (v2.1.2 integration), and unprovable command shapes deny | Shared frozen-projection assertion with bash-time rederivation | Complete |

### Remaining tasks and boundary

All B2 checkboxes are persisted `[x]`. The remaining unchecked implementation-owned tasks are the four **Final verification and delivery gates** rows in `tasks.md`; they are intentionally out of scope for this B2-only apply. No final review, lifecycle delivery, commit, push, PR, merge, or release was performed.

- Workload / PR boundary: assigned B2 slice only under the pre-recorded `exception-ok` / `size-exception`; no delivery action was taken.
- Structured status consumed: native OpenSpec status reported `applyState: ready`, `nextRecommended: apply`, repo-local `/home/gentleman/work/gentle-pi`, with that root in `allowedEditRoots`. No action-context warnings.
- CodeGraph fallback: `.codegraph/` existed, but the session exposed no CodeGraph MCP server (only an uninitialized non-CodeGraph MCP); targeted filesystem reads were used after that unavailable-tool fallback.

## Final verification and delivery gates — pre-review RED/GREEN — complete

**Scope boundary:** This entry completes only the pre-review Final verification RED and GREEN rows. No 4R actor, SDD verification, review/lifecycle gate, commit, push, PR, merge, release, issue closure, or issue comment was started.

### Environment and runtime identity

- Date: 2026-07-13
- Repository: `/home/gentleman/work/gentle-pi`
- Node.js: `v24.18.0`; pnpm: `11.1.1`; platform: `linux/x64`
- Verified runtime: `/home/gentleman/work/gentle-pi/.gentle-ai/v2.1.2/gentle-ai`; `gentle-ai 2.1.2`
- The focused parity fixture used the verified absolute package-local binary and reported its disposable linked view/artifacts under `/tmp/gentle-pi-v212-parity-*`; it did not use an ambient/global binary.

### RED evidence

The complete focused issue/regression matrix was run before declaring GREEN:

```sh
node --experimental-strip-types --test \
  tests/gentle-ai-binary.test.ts \
  tests/gentle-ai-installer.test.ts \
  tests/package-manifest.test.ts \
  tests/native-review-cli.test.ts \
  tests/review-facade.test.ts \
  tests/review-controller.test.ts \
  tests/review-controller-native-routing.test.ts \
  tests/review-candidate-view.test.ts \
  tests/native-review-parity-runtime.test.ts
```

Result: **208 passing, 0 failing**. The package-local v2.1.2 fixture passed unchanged allow and changed-tree denial. Its reported frozen candidate was `ae92eb1a97e763b98c66b99b017f6f6463d00d43`, with reviewed paths `tracked.txt` and `initially-untracked.txt`, modes `100644`/`100644`, and released digest `sha256:5d91d7650fcbd1165e9cd88c144bf28d82913e3537abd7b4fdc8ad0adb9eab9c`.

### GREEN evidence

All required commands exited zero:

| Command | Result |
| --- | --- |
| `pnpm run test:harness` | Passed (runtime harness) |
| `node scripts/verify-package-files.mjs` | Passed; package resource check: 54 files |
| `pnpm test` | Passed: 694 tests, 0 failures; then runtime harness passed |
| `git diff --check` | Passed; no whitespace errors |
| `pnpm pack --dry-run` | Passed; package dry-run listed `gentle-pi-1.0.2.tgz` as its prospective artifact only |

The pre- and post-dry-run checks `find . -maxdepth 1 -type f -name '*.tgz' -printf '%f\\n'` were empty: no tarball was created. `pnpm pack --dry-run` also exercised the package `prepack` convention (`pnpm test && node scripts/verify-package-files.mjs`) successfully.

### Draft issue disposition matrix (no local issue operation performed)

| Issue | Draft work-unit disposition | Evidence / boundary |
| --- | --- | --- |
| #96 | Fixed by code | B1 candidate-view focused coverage and this green regression matrix prove frozen linked-view use, live-worktree divergence protection, and fail-closed dispatch. |
| #113 | Upstream-blocked | Gentle AI [#1247](https://github.com/Gentleman-Programming/gentle-ai/issues/1247): no released compact-v2/OpenSpec reconciliation/consumption contract; no Pi mirror or reset is authorized. |
| #119 | Superseded by #133 | B2 exact pre-commit projection and unchanged-allow/changed-deny regression evidence address the root projection mismatch without a bypass. |
| #122 | Upstream-blocked | Gentle AI [#1248](https://github.com/Gentleman-Programming/gentle-ai/issues/1248): v2.1.2 exposes actual mismatch data but not expected receipt/path-difference diagnostics. |
| #123 | Fixed by documentation/code metadata | FINALIZE contract and package-manifest/native regression coverage passed in the focused matrix. |
| #124 | Superseded by supported native ordinary START contract | Native policy identity remains native-derived; focused native/controller coverage preserves the native-versus-legacy boundary without a Pi-created policy hash. |
| #128 | Upstream-blocked | Gentle AI [#1249](https://github.com/Gentleman-Programming/gentle-ai/issues/1249): Windows durability belongs to the verified native ordinary authority executable; Pi does not shadow persistence. |
| #129 | Proven already fixed | Focused controller/native-routing regression coverage passed for owner-qualified publication identity and fail-closed invalid cases. |
| #133 | Fixed by code | B2 pre-commit frozen-tree checks plus the real package-local v2.1.2 linked-view fixture passed unchanged allow and drift denial. |
| #137 | Proven already fixed | Focused facade regression confirms same-projection discovery excludes unrelated historical/escalated lineages. |
| #1244 | Closed false positive | Corrected external-artifact fixture passed against package-local v2.1.2; the historical denial was candidate pollution, not an upstream runtime defect. |

No issue was closed, commented on, or otherwise mutated. Upstream tracker dispositions #1247/#1248/#1249 are preserved.

### TDD Cycle Evidence

| Slice | RED | GREEN | TRIANGULATE | REFACTOR | Result |
| --- | --- | --- | --- | --- | --- |
| Final verification pre-review | Ran complete focused I1/I2/I3/F1/B1/B2 matrix and captured failures as blocking criteria | Focused 208/208, harness, verifier (54 files), full suite 694/694, diff check, and no-tarball package dry-run all passed | Intentionally unchecked: mandatory high-risk 4R plus independent SDD verification | Intentionally unchecked: lifecycle/delivery gates | RED/GREEN complete; ready for review only |

### Persisted task and state updates

- Marked Final verification **RED** and **GREEN** `[x]` in `tasks.md` immediately after the full-green evidence.
- Left Final verification **TRIANGULATE** and **REFACTOR** `[ ]`.
- Updated `state.yaml` to `apply: ready-review`; `verify` remains `blocked-pending-review`.
- Workload / PR boundary: pre-approved `exception-ok` / `size-exception`; this was verification-only and made no delivery action.
- Structured status consumed: authoritative OpenSpec status reported `applyState: ready`, `nextRecommended: apply`, repo-local workspace `/home/gentleman/work/gentle-pi`, allowed edit root `/home/gentleman/work/gentle-pi`, and no action-context warnings.

### Remaining tasks and boundary

- `- [ ] **TRIANGULATE:** complete the issue matrix for #96, #113, #119, #122, #123, #124, #128, #129, #133, #137, and closed-false-positive #1244; preserve upstream dispositions #1247/#1248/#1249; run independent SDD verification and the mandatory high-risk 4R review.`
- `- [ ] **REFACTOR:** validate the approved content-bound receipt at pre-commit, pre-push, pre-PR, and release lifecycle/delivery gates. Only then authorize PR/merge/release.`

## C1 v2.1.3 apply attempt — blocked before RED (2026-07-13)

- Consumed authoritative OpenSpec state: change `consolidate-review-parity-runtime`, `artifact_store: openspec`, `status: apply-ready-c1`, and `next_recommended: apply`. Strict TDD is active; configured runner is `pnpm test`.
- Delivery boundary consumed: C1 only under the recorded `exception-ok` / `size-exception`. No final 4R review, independent SDD verification, lifecycle validation, commit, push, PR, or release was started.
- Required apply artifact `openspec/changes/consolidate-review-parity-runtime/spec.md` is absent (`ENOENT`). The artifact directory contains no replacement spec file. Per the apply dependency contract, implementation and RED test edits did not begin.
- Action context was not supplied as structured status. Produced safety status: authoritative workspace `/home/gentleman/work/gentle-pi`; no additional allowed edit roots were established; no edits were made outside the workspace. The missing required spec is the blocking reason.
- Existing `state.yaml` already requires `/reload` before review; because C1 is incomplete, that downstream boundary remains unchanged.

### C1 TDD Cycle Evidence

| Slice | RED | GREEN | TRIANGULATE | REFACTOR | Result |
| --- | --- | --- | --- | --- | --- |
| C1 v2.1.3 migration | Blocked: required specification artifact missing before any test or production edit | Not started | Not started | Not started | Blocked |

### Remaining tasks and boundary

All C1 rows remain unchecked because no C1 implementation or verification ran. Restore the required specification artifact, then rerun C1 from RED under strict TDD. Final review, SDD verification, lifecycle/delivery, and `/reload` proof remain out of scope for this blocked attempt.

## C1 v2.1.3 migration — implementation and verification (2026-07-13)

The preceding “blocked before RED” note is **superseded provenance only**: native OpenSpec status confirms the two domain specifications (`specs/review-runtime/spec.md` and `specs/package-runtime/spec.md`) are the required completed specs; no root `spec.md` was created.

- Provisioned and verified the absolute package-local runtime: `.gentle-ai/v2.1.3/gentle-ai` → `gentle-ai 2.1.3`.
- Migrated the resolver, installer, package verification, native adapter, controller preflight/routing, active docs, package-resource test, and native fixtures to v2.1.3 using all six design-specified release digests.
- START strictly decodes released `action` and `lenses_required`, rejects unknown/contradictory response shapes, exposes both fields, avoids candidate-view binding when lenses are not required, and preserves no implicit `--committed-only` behavior.
- Clean INSPECT now reports an explicitly incomplete Pi-owned preflight and routes to authoritative native START; it does not claim native inventory.
- Persisted task updates: all C1 RED, GREEN, package/parity/B1/B2/refactor, and full-verification rows are `[x]`. The action/lens matrix row and `/reload` row remain unchecked.

### C1 TDD Cycle Evidence

| Slice | Safety net | RED | GREEN | TRIANGULATE | REFACTOR | Result |
| --- | --- | --- | --- | --- | --- | --- |
| C1 pin/install/adapter | Focused five-suite baseline: 162 passing | v2.1.3 fixture/pin tests: 25 failures against v2.1.2 | Focused installer/binary/native tests: 43 passing | Parity, B1/B2, integrity, and full suite exercised | Adapter and controller routing centralized | Complete except explicit action/lens matrix row |

### C1 verification

- `node --experimental-strip-types --test tests/gentle-ai-installer.test.ts tests/gentle-ai-binary.test.ts tests/native-review-cli.test.ts` — 43 passing.
- `node --experimental-strip-types --test tests/review-controller-native-routing.test.ts tests/review-controller.test.ts` — 119 passing.
- `node --experimental-strip-types --test tests/review-candidate-view.test.ts tests/review-controller-native-routing.test.ts tests/native-review-parity-runtime.test.ts` — passed.
- `pnpm test` — 694 passing; `pnpm run test:harness` — passed.
- `node scripts/verify-package-files.mjs`, `pnpm pack --dry-run`, and `git diff --check` — passed.

### Remaining tasks and boundary

- `- [ ] Complete the matrix for \`created\`, \`resumed\`, \`reuse-receipt\`, and \`blocked-scope-action\`, including valid \`lenses_required: true/false\`, zero dispatch for false/reuse/blocked, no duplicate budget, and exact retry after ambiguous output.`
- `- [ ] Run Pi \`/reload\`, then prove the current session reloads \`extensions/gentle-ai.ts\` and uses the v2.1.3 adapter/runtime identity. A pre-reload review is invalid.`

Workload / PR boundary: C1 only under the recorded `exception-ok` / `size-exception`; no commit, push, review, or delivery action was performed. Structured status consumed: authoritative OpenSpec `applyState: ready`, `nextRecommended: apply`, workspace and allowed edit root `/home/gentleman/work/gentle-pi`; no action-context warning.

## C1 action/lenses-required triangulation and post-reload proof (2026-07-13)

**Scope:** Completed only the remaining C1 START action/lenses-required matrix and recorded the parent-provided post-reload identity proof. No native review authority was inspected beyond the provided non-mutating result, and no lineage was created, recovered, reset, finalized, or otherwise mutated.

### TDD Cycle Evidence

| Slice | RED | GREEN | TRIANGULATE | REFACTOR | Result |
| --- | --- | --- | --- | --- | --- |
| C1 START action/lenses-required matrix | Added matrix expectations, then `node --experimental-strip-types --test tests/native-review-cli.test.ts` failed because inconsistent `created` false-lens combinations were accepted. | The strict v2.1.3 decoder now rejects `created` + `lenses_required: false` unless risk is low and `selected_lenses` is empty, and rejects `blocked-scope-action` + `lenses_required: true`. | Controller tests cover created/resumed true dispatch binding, created/resumed false zero binding, receipt reuse/blocked-scope zero binding, and exact ambiguous START replay with preserved request, action, lineage, and budget. | Kept routing authority native-owned; no local claimant, receipt, budget, or lineage reconstruction was added. | Complete. |

### Matrix and reload evidence

- `tests/native-review-cli.test.ts` covers every valid action/boolean pair and rejects impossible `created` false-lens metadata, `reuse-receipt: true`, and `blocked-scope-action: true` responses.
- `tests/review-controller-native-routing.test.ts` proves selected lens binding only for created/resumed true responses; false, receipt reuse, and scope-block responses leave no candidate-view lens binding. It also proves an ambiguous START result returns exact-replay guidance and a replay preserves the native request, `resumed` action, lineage, and original budget without a local second budget.
- Parent post-reload proof: `gentle_review` INSPECT returned `native_contract: gentle-ai/2.1.3`, `start_routing: authoritative`, `status: ready`, and `next_action: start-native-authoritative`. The response reported seven existing compact lineages in the repository common directory; this slice did not inspect, infer, or mutate their inventory or authority.
- Focused verification passed: `node --experimental-strip-types --test tests/native-review-cli.test.ts tests/review-controller-native-routing.test.ts tests/review-controller.test.ts` — 150 passing, 0 failing.
- Full strict-TDD verification passed: `pnpm test` — 697 passing, 0 failing; runtime harness passed.

### Persisted task and state updates

- Marked the C1 action/lenses-required matrix `[x]` and Pi `/reload` identity-proof `[x]` in `tasks.md` after the listed evidence.
- Updated `state.yaml`: `apply: ready-review`, `verify: blocked-pending-c1-review`.
- Remaining unchecked tasks are intentionally downstream and unchanged:
  - `- [ ] Start and complete the mandatory high-risk 4R final review only after C1 verification and post-reload identity proof.`
  - `- [ ] Run independent SDD verification against the spec and completed task evidence.`
  - `- [ ] Validate the approved content-bound receipt at pre-commit, pre-push, pre-PR, and release gates; only then authorize delivery.`
- Workload / PR boundary: C1 only under the pre-recorded `exception-ok` / `size-exception`. No review, commit, push, PR, release, or lifecycle action was performed.
- Structured status consumed: authoritative OpenSpec status (`applyState: ready`, `nextRecommended: apply`), repo-local workspace `/home/gentleman/work/gentle-pi`, allowed edit root `/home/gentleman/work/gentle-pi`; no action-context warning.

## C2 applicability-aware native START — partial implementation (2026-07-13)

- Added a strict-TDD regression in `tests/review-controller-native-routing.test.ts` before changing production routing. It proved the old presence-based block: an unrelated compact claimant prevented native START.
- GREEN: `extensions/gentle-ai.ts` now classifies readable compact lineages against the live frozen candidate binding (base tree, candidate trees, genesis paths, intended untracked scope). Unrelated valid history reaches the v2.1.3 native START; one matching claimant returns `compact-authority-applicable` and routes `use-compatible-read-or-gate-route` without invoking native START; multiple matching claimants and unreadable/corrupt authority fail closed with distinct diagnostics.
- No authority, receipt, reset journal, or historical lineage was mutated. The incident RESET remains recorded as rejected before mutation and was not retried.
- This is **not C2 completion**: the required controlled seven-lineage approved/escalated/correction-required fixture, explicit matching nonterminal/invalid coverage, centralized INSPECT/reset/gate reuse, and post-extension `/reload` proof remain outstanding. C2 task checkboxes and `state.yaml` are intentionally unchanged.

### TDD Cycle Evidence

| Slice | Safety net | RED | GREEN | TRIANGULATE | REFACTOR | Result |
| --- | --- | --- | --- | --- | --- | --- |
| C2 native START applicability | `review-controller.test.ts` + `review-controller-native-routing.test.ts`: 121 passing | Replaced blanket-claimant expectation with unrelated-history/native-start and exact-match/no-native-start expectations; failed before routing change | Focused native-routing suite passed (84/84) after minimal classifier/routing change | Existing compact terminal, reset, ambiguity, invalid-record, and candidate-binding controller coverage passed in full suite | Classifier is one local decision used by native START; broader reuse remains pending | Partial; not checkbox-complete |

### Verification

- `node --experimental-strip-types --test tests/review-controller.test.ts tests/review-controller-native-routing.test.ts` — 121 passing (safety net).
- `node --experimental-strip-types --test tests/review-controller-native-routing.test.ts` — 84 passing (focused GREEN).
- `pnpm run test:harness` — passed.
- `node scripts/verify-package-files.mjs` — passed.
- `pnpm test` — 697 passing, 0 failures; runtime harness passed.
- `git diff --check` — passed.

### Remaining C2 tasks

- `- [ ] Add failing tests/fixtures at the existing native/controller review test targets for seven unrelated valid compact-v2 historical lineages plus the current frozen candidate; assert unrelated history does not cause a blanket native START block.`
- `- [ ] Add RED cases proving a matching exact terminal receipt uses compatible read/gate behavior, while matching nonterminal, ambiguous, and invalid records remain closed; prove RESET remains forbidden for valid historical compact authority.`
- `- [ ] Classify each compact authority claimant against the current frozen candidate, frozen scope, and receipt/gate identity rather than treating compact_authority !== undefined as a blanket block.`
- `- [ ] Allow exact v2.1.3 atomic native START only when every Pi compact claimant is valid historical authority and none applies to the current target; preserve exact matching terminal receipt read/gate compatibility.`
- `- [ ] Keep matching nonterminal, ambiguous, invalid, or otherwise applicable claimants closed; never delete, mutate, ignore, or reset a matching claimant, and retain truthful diagnostics for each closure.`
- `- [ ] Exercise a seven-lineage fixture across approved, escalated, and correction-required histories, including one matching receipt, ambiguity, and an invalid record.`
- `- [ ] Prove no dual same-target authority is created and capture exact before/after authority bytes, state, and filesystem evidence for every rejected RESET or closed START path.`
- `- [ ] Re-run C1 routing/parity, B1/B2, package integrity, and full regression suites; append evidence to apply-progress.md without overwriting prior evidence.`
- `- [ ] Centralize the compact-authority applicability decision and reuse it for INSPECT, START, reset eligibility, and compatibility read/gate routing; remove duplicated presence-based checks.`
- `- [ ] Make diagnostics identify claimant applicability and closure reason without exposing a false inventory or claiming authority ownership the controller cannot prove.`
- `- [ ] Run focused C2 tests, pnpm run test:harness, package verification, pnpm test, parity/regression suites, and git diff --check.`
- `- [ ] If the extension/controller or native adapter changes, run Pi /reload and prove post-reload v2.1.3 identity and C2 routing; pre-reload evidence is invalid.`

- Workload / PR boundary: pre-approved `exception-ok` / `size-exception`; no review/reset/recover/supersede/commit/push was started.
- Structured status consumed: authoritative OpenSpec status reported `applyState: ready`, `nextRecommended: apply`, repo-local workspace `/home/gentleman/work/gentle-pi`, allowed edit root `/home/gentleman/work/gentle-pi`, no action-context warnings.

## C2 correction follow-up — nonterminal compact authority closure (2026-07-13)

**Result: partial; C2 remains blocked and no C2 checkbox was marked complete.**

- **RED:** Added a focused native-controller regression proving that a same-candidate compact lineage in `reviewing`/correction-required-class authority must not invoke native START. The test failed against the prior broad `applicable` route.
- **GREEN:** Refined the native START compact classifier to distinguish `unrelated-history`, `compatible-receipt` (approved receipt only), `nonterminal`, `escalated`, `ambiguous`, and `invalid`. Matching nonterminal authority now returns `compact-authority-nonterminal` with `stop-and-resolve-existing-compact-authority`; it performs no native START and leaves authority bytes unchanged. Matching escalated authority is separately fail-closed by classifier state.
- **TRIANGULATE:** Existing focused controller coverage continues to verify valid compact terminal authority cannot be reset; existing full-suite coverage verifies corrupt/detached authority fails closed. This follow-up did **not** add the required controlled seven-lineage mix or complete the matching approved/escalated/ambiguous/invalid C2 matrix.
- **REFACTOR:** The START routing now uses one classifier-to-diagnostic mapping. INSPECT, RESET eligibility, and compatibility gate routing have not yet been migrated to that decision surface.

### Verification

| Command | Result |
| --- | --- |
| `node --experimental-strip-types --test tests/review-controller-native-routing.test.ts` | 85 passing |
| Focused adapter/controller/candidate/parity matrix | 155 passing |
| `pnpm run test:harness` | Passed |
| `node scripts/verify-package-files.mjs` | Passed (54 files) |
| `pnpm test` | 698 passing, 0 failing; harness passed |
| `git diff --check` | Passed |

### Remaining C2 requirements

- Controlled seven-lineage fixture (5 approved, 1 escalated, 1 correction_required) and all-unrelated native START proof.
- Matching approved receipt compatibility, matching escalated closure, ambiguous closure, corrupt/identity-broken/incomplete-evidence closure, and zero-mutation assertions for each.
- Shared classifier adoption for INSPECT, RESET eligibility, and compatible gate routing.
- C2 post-extension `/reload` identity/routing proof.

No review, reset, recover, supersede, commit, push, PR, or delivery action was run. Workload boundary remains `exception-ok` / `size-exception`; authoritative OpenSpec state remains `ready-c2-correction`, workspace `/home/gentleman/work/gentle-pi`.

## C2 applicability matrix completion — ready for reload (2026-07-13)

- **RED:** Added the controlled C2 matrix to `tests/review-controller-native-routing.test.ts`. Before the implementation, the seven-lineage INSPECT diagnostic was absent and identity-broken authority could fall through to native START. The focused test failed with those exact assertions.
- **GREEN:** Centralized compact applicability classification in `extensions/gentle-ai.ts`. It distinguishes `unrelated-history`, `compatible-receipt`, `nonterminal`, `escalated`, `ambiguous`, and `invalid`; START and native INSPECT use it. Valid unrelated history reaches native START, a valid exact approved receipt uses the compatible read/gate route, and every unsafe/incomplete condition fails closed before native START.
- **TRIANGULATE:** The disposable fixture creates five approved lineages, one escalated lineage, and one `correction_required` lineage, all unrelated to the live target. It proves exactly one native START, snapshots every fixture authority state/receipt byte before and after, and covers exact matching approved, escalated, correction-required, ambiguous, corrupt, missing, malformed, mismatched-receipt, and identity-broken cases. Existing controller coverage confirms valid compact terminal authority remains non-resettable.
- **REFACTOR:** INSPECT reports the Pi-local applicability diagnostic without claiming a native claimant inventory. RESET eligibility remains unchanged: valid historical compact authority is not reset-eligible; only existing invalid-authority paths retain their explicit reset protocol.

### Verification

| Command | Result |
| --- | --- |
| `node --experimental-strip-types --test tests/review-controller-native-routing.test.ts` | 95 passing |
| `node --experimental-strip-types --test tests/review-controller-native-routing.test.ts tests/review-controller.test.ts tests/review-facade.test.ts tests/review-reset.test.ts tests/review-candidate-view.test.ts tests/native-review-parity-runtime.test.ts` | 165 passing |
| `pnpm run test:harness` | Passed |
| `node scripts/verify-package-files.mjs` | Passed (54 files) |
| `pnpm test` | Passed (708 tests, 0 failures); runtime harness passed |
| `git diff --check` | Passed |

### Persisted task/state update

- Marked the C2 RED, GREEN, TRIANGULATE, REFACTOR, and focused/full verification rows complete in `tasks.md`.
- Updated `state.yaml` to `ready-reload`. The C2 `/reload` proof remains intentionally unchecked and must be performed by the controlling Pi session before final review.
- No real review, reset, recover, supersede, finalize, validate, commit, push, PR, release, or repository authority mutation was run. All authority mutation assertions use disposable test repositories only.

## C3 parent `subagent_run` candidate-view propagation — ready for reload (2026-07-13)

- **RED:** Added parent `tool_call` tests for real `subagent_run` input shapes. Before implementation, task text remained unchanged and malformed or mixed review dispatch reached the child boundary instead of being blocked.
- **GREEN:** `injectReviewCandidateView` now validates and mutates the actual mutable `subagent_run` input from the parent hook. It accepts only one all-review single or parallel shape in `mode: "task"`, resolves each selected lens from the controller registry, proves a single identical frozen root/tree/path/mode view, rejects user candidate text, and appends one bounded controller-owned task block. Candidate tree entries now reject unsafe control-character, traversal, absolute, and backslash paths before prompt construction.
- **TRIANGULATE:** Focused tests prove single and parallel 4R identity, missing/ambiguous/unselected/stale/corrupt views, malformed inputs, mixed batches, background mode, conflicting candidate text, and live-worktree divergence. The runtime harness exercises the registered `tool_call` boundary with `subagent_run` and proves a missing view blocks before child execution. The nested `before_agent_start` review hook is retired; unrelated SDD/persona handling and lean resources are unchanged.
- **REFACTOR:** README now records the parent-dispatch, task-only, bounded immutable-context, and fail-closed contract. The escalated `review-818fa72b8c23668a` lineage was not accessed, mutated, reused, or rerun.

### Verification

| Command | Result |
| --- | --- |
| `node --experimental-strip-types --test tests/review-candidate-view.test.ts tests/review-controller-native-routing.test.ts` | Passed: 102 tests, 0 failures |
| `pnpm run test:harness` | Passed |
| `node scripts/verify-package-files.mjs` | Passed: 54 package resources |
| `pnpm test` | Passed: 712 tests, 0 failures; runtime harness passed |
| `git diff --check` | Passed |

### Persisted task/state update

- Marked C3 RED, GREEN, TRIANGULATE, and the completed REFACTOR implementation/documentation rows in `tasks.md`.
- Updated `state.yaml` to `ready-reload`; the controlling Pi session must `/reload` and prove runtime identity before creating a fresh lineage or running new 4R actors.
- No native review authority was created, finalized, validated, reset, recovered, reused, or rerun. The escalated incident lineage remains immutable evidence only.

## C4 compact changed-scope implementation — ready for reload (2026-07-13)

- **RED:** Added the 293-entry/45-change candidate-view regression. Before the implementation, it failed with `293 !== 45`, proving the public projection used every candidate-tree entry instead of the changed scope. The controller regression also proves compact 4R dispatch would proceed while genuinely oversized scope blocks before actor launch.
- **GREEN:** CandidateView now retains full candidate-tree entries for root/index/path/content/mode verification, derives changed scope from `git diff --name-status -z --no-ext-diff --find-renames=100% <base> <candidate-tree>`, and exposes only sorted changed paths. Deleted paths are explicit in `deletedPaths`; present paths retain exact candidate modes. The compact actor block groups paths once by mode plus `deleted` and enforces a UTF-8 4096-byte limit.
- **TRIANGULATE:** Focused coverage exercises a 293-entry tree with 45 changed paths, additions, modifications, all-deletion candidates, rename destination semantics, executable mode, symlink mode (supported Linux platform), unsafe control-character paths, unchanged-entry tampering, stale/corrupt view handling, live contributor divergence, byte-identical parallel 4R scope, and zero-dispatch failure for oversized scope.
- **REFACTOR:** Centralized NUL-safe Git output parsing, changed-scope derivation, compact mode grouping, and full-tree content/mode verification. README now distinguishes full-tree integrity from changed-scope actor context.

### C4 verification

| Command | Result |
| --- | --- |
| `node --experimental-strip-types --test tests/review-candidate-view.test.ts tests/review-controller-native-routing.test.ts` | Passed: 108 tests, 0 failures |
| `pnpm run test:harness` | Passed |
| `node scripts/verify-package-files.mjs` | Passed: 54 package resources |
| `pnpm test` | Passed: 718 tests, 0 failures; runtime harness passed |
| `git diff --check` | Passed |

### C4 boundary

- The implementation, focused verification, runtime harness, package verification, full suite, and diff check are complete. The exact historical `review-d3587ca14ff4f06b` assertion/reload, its abandonment, fresh lineage, fresh 4R, independent SDD verification, and lifecycle receipt validation were intentionally not run: this scoped worker must not invoke review operations or mutate `.git` authority.
- No repository review authority was accessed or mutated. `review-d3587ca14ff4f06b` remains reviewing with no actors, and `review-818fa72b8c23668a` remains escalated, as supplied by the task boundary.
- State is `ready-reload`; controlling Pi must reload before the remaining authority-bound C4 work.

## C4 reload, lineage closure, and bounded 4R completion (2026-07-13)

- `review-d3587ca14ff4f06b` was blocked before actor execution because bounded dispatch context could not be established. It consumed zero actors/lenses and received no FINALIZE mutation; it was abandoned unchanged and was never reused.
- Multiple Pi reloads occurred. The active post-reload parent hook/candidate-view identity was proven when START resumed `review-558624bfd9e14204` with `lenses_required:false` and corrected runtime behavior.
- Fresh high-risk 4R lineage `review-558624bfd9e14204` ran exactly once. Initial lenses produced seven severe correction IDs; one bounded correction used 180/200 lines. Independent targeted validation attempt 2 passed every criterion and the exact focused suite (118/118). Final state: approved. Receipt: `.git/gentle-ai/review-transactions/v2/review-558624bfd9e14204/review-receipt.json`.
- `review-818fa72b8c23668a` remains escalated and unchanged.

### C4 final-review evidence

| Evidence | Result |
| --- | --- |
| Correction delta | 149 additions, 31 deletions |
| Focused suite | 118/118 passing |
| Worker full suite | 720/720 passing |
| Package verifier | 54 files |
| `git diff --check` | Clean |
| Approved revision | `sha256:7349c3c63de77d051f0457aa4ce01ff85de2e3258e9be1d7c5b41cf78f6be183` |

### Persisted task and remaining boundary

- Marked C4 lineage fixture/harness assertion, reload proof, blocked-lineage abandonment, and fresh 4R task rows `[x]` in `tasks.md`.
- Remaining implementation-owned task: `- [ ] Only after fresh 4R completion, run independent SDD verification and lifecycle receipt validation.`
- No implementation, test, package metadata, Git authority, review/finalize/validate, staging, commit, push, PR, or lifecycle operation was performed by this synchronization.
- Workload / PR boundary: approved single-PR unlimited size exception (`exception-ok`).
- Structured status consumed: authoritative OpenSpec workspace `/home/gentleman/work/gentle-pi`; change root is within the allowed edit root. Prior persisted state was `ready-reload` / `verify: blocked-pending-c4-reload`; its dispatcher routing is stale after these checkbox updates. The next dependency boundary is independent SDD verification; lifecycle receipt validation remains part of task 75 and must not be reported complete.

## Task-graph correction (2026-07-13)

- Task 75 is complete as an implementation handoff: the approved 4R receipt, exact verification commands, and frozen evidence are prepared. Independent SDD verification and lifecycle validation have not run; verify remains the next phase.

## Final v2.1.4 bounded migration synchronization (2026-07-14)

**Scope:** Factual OpenSpec synchronization only. No implementation, tests, task checkboxes, verify report, Git authority/index, runtime, or lifecycle/delivery operation was changed or run.

### Provenance and approved binding

- Gentle AI **v2.1.4** was published and verified with all six official release assets. The release contains the #1255/#1258 merge `734f8c19c186751d3870e338246cc3671f6c6211`.
- The official `linux_amd64` manifest and binary SHA-256 is `aa60f95186520d6e8c70bb9cca8d8a5735adbc3b69576519d35e32754aed261a`.
- Final bounded migration lineage: `review-ca0c5ee1e22c737c` — approved lineage revision `sha256:5cd2d7a263f1327ef1bc54587de4d717b31c7660002931c8268ac66c49d69f87`; receipt final tree `be5daf06771c947ed1f544285163b4821e5a6cfb`.
- Approved SDD binding revision: `sha256:ac5146818c566518ae2512aaa8a60f738479905aec6823ed8c1e20c5b1d47bc1`.

### TDD Cycle Evidence

| Slice | RED | GREEN | TRIANGULATE | REFACTOR | Result |
| --- | --- | --- | --- | --- | --- |
| Final v2.1.4 bounded migration | Installer mapping test failed while production still returned v2.1.3 assets and digests. | Migrated production installer, resolver, native adapter, and explicit installer to v2.1.4 with the exact six official checksums; verified the official `linux_amd64` manifest/binary SHA; removed `LOCAL_BUILD_PROVENANCE`; parity uses the production resolver and official bytes; v2.1.3 runtime is rejected. | Focused 46/46; `pnpm test` 724/724; package verifier 54 files; runtime harness pass; `git diff --check` pass. | Consolidated parity assertions without behavior loss to fit the exact correction: 85 additions + 75 deletions = 160/200. | Approved lineage and binding recorded. |

### Independent validation and boundary

- An independent targeted validator passed the criteria/regression checks and exact scope/index checks.
- Apply is complete, v2.1.4 provenance is resolved, and the review/binding are approved.
- **Not claimed:** final independent SDD verification pass, lifecycle receipt validation, commit, push, PR, merge, or release.
- Workload / PR boundary: final bounded migration correction only; exact correction budget consumption was `160/200`.
- Structured status produced: authoritative OpenSpec workspace; implementation/apply complete; `next_recommended: verify-after-content-bound-review`; no action-context warning was supplied for this artifact-only synchronization.

### Remaining task boundary

- Independent SDD verification is the next phase. Lifecycle/delivery validation remains unperformed and is not completed by this synchronization.
