# Technical Design: Consolidate Review Parity Runtime

## 1. Revision decision

Gentle Pi will migrate its package-local review runtime from Gentle AI v2.1.2 to the released Gentle AI v2.1.3 before final review.

The accepted upstream release evidence is:

- tag/version: `v2.1.3` / `2.1.3`;
- published: `2026-07-13T16:33:06Z`;
- source commit: `5317daca8e59d7554d87dbd1a8207c3fc0847dc6`;
- upstream PR/issue: [Gentle AI #1245](https://github.com/Gentleman-Programming/gentle-ai/pull/1245) / [#1239](https://github.com/Gentleman-Programming/gentle-ai/issues/1239); and
- compatibility addition: repository-wide atomic `StartCompactAuthority`, including authoritative create/resume/receipt-reuse/scope-block routing without duplicate review budgets.

This revision supersedes the prior design statement that no runtime pin update was required. The v2.1.2 differential conclusion remains valid: #1244 was a Gentle Pi fixture false positive, and B1/B2 were correctly completed. The migration is required because v2.1.3 now supplies the authoritative idempotent START contract needed for truthful final review routing.

No product or test code is changed by this design revision. `tasks.md` must be revised before apply resumes.

## 2. Preserved completed behavior and evidence

The migration is additive to completed work. It must not discard, reopen, or relabel the following evidence:

- WU-01 and I1–I5, including installer protection, FINALIZE documentation, regressions, and upstream trackers #1247/#1248/#1249;
- F1's corrected external-artifact linked-view fixture and its v2.1.2 unchanged-allow/changed-deny evidence;
- B1's controller-owned immutable candidate view, actor-context isolation, live-worktree divergence protection, and fail-closed pre-dispatch checks;
- B2's exact frozen pre-commit projection, path-limited staging assumptions, bash-time rederivation, and native-only lifecycle authorization;
- the full v2.1.2 focused, harness, package verification, package dry-run, and 694/694 suite evidence; and
- historical WU-02/I5 known-red output, still labeled only as superseded fixture evidence.

Existing v2.1.2 evidence proves the behavior at the time it was captured. It is not accepted as final v2.1.3 compatibility evidence. Real parity and full verification must run again after provisioning v2.1.3.

## 3. Authority and ownership boundaries

### 3.1 Gentle AI v2.1.3 owns

The package-provisioned native runtime owns repository-wide atomic START authority discovery, candidate identity, lineage create/resume/reuse decisions, state, risk, selected lenses, authored file/line counts, correction budget, receipt applicability, scope blocking, and lifecycle validation.

Pi must not derive or reconstruct those decisions from private stores. A lost or ambiguous START response is recovered by replaying the exact START request; Pi must not choose a different lineage or create another budget.

### 3.2 Gentle Pi owns

Pi owns:

- exact package-local v2.1.3 pinning, archive integrity, binary integrity, and absolute-path resolution;
- the mandatory controller INSPECT preflight and truthful presentation of its limited scope;
- candidate-view creation, verification, actor context, projection preconditions, and cleanup from completed B1/B2;
- strict decoding and routing of the released START response;
- refusal to add native acknowledgements that are not explicitly authorized by a typed Pi input;
- actor dispatch only when native START says lenses are required; and
- focused, parity, harness, package, and full-suite verification before final review.

### 3.3 Fail-closed invariant

INSPECT is mandatory but is not native authority inventory. Native START is authoritative for this exact v2.1.3 discovery/resume/reuse/block contract. Neither operation authorizes lifecycle delivery; native `review validate` remains mandatory at each lifecycle gate.

## 4. End-to-end data flow

```text
controller INSPECT (required)
  -> inspect Pi-owned legacy/mixed/reset preconditions
  -> report native general status/inventory as unsupported and incomplete
  -> if local preflight is clean, route to package-local v2.1.3 START
  -> controller constructs and verifies the B1 candidate view
  -> native review start performs atomic repository-wide StartCompactAuthority
  -> strict decode of action + lenses_required + retained authority fields
      created/resumed + lenses_required=true
        -> bind frozen candidate view
        -> dispatch exactly selected_lenses
      created/resumed + lenses_required=false
        -> dispatch zero lenses
        -> route using returned action/state
      reuse-receipt
        -> dispatch zero lenses
        -> reuse returned lineage/receipt route; do not finalize or open a budget
      blocked-scope-action
        -> dispatch zero lenses
        -> fail closed and require explicit scope action
  -> native FINALIZE only when the returned state/action requires it
  -> B2 projection precondition
  -> native lifecycle VALIDATE
```

The controller must preserve returned lineage, state, risk, selected lenses, changed files, changed lines, and correction budget in its public result. It must add the released `action` and `lenses_required` fields rather than inferring them from local stores.

## 5. Exact package-local v2.1.3 migration

### 5.1 Version and location

The only supported native runtime becomes `2.1.3` at:

```text
<package-root>/.gentle-ai/v2.1.3/gentle-ai
<package-root>/.gentle-ai/v2.1.3/gentle-ai.exe
```

`lib/gentle-ai-binary.ts`, `scripts/gentle-ai-installer.mjs`, and `scripts/install-gentle-ai.mjs` must agree on `2.1.3`. Runtime verification must accept exactly `gentle-ai 2.1.3\n`. No PATH/global fallback and no fallback to v2.1.2 is allowed.

The installer creates/verifies the v2.1.3 directory and four-field `integrity.json` contract already used by v2.1.2. Existing v2.1.2 package-local bytes are not authority and need not be deleted; the resolver ignores them after the pin changes. Migration must not mutate user-managed assets.

### 5.2 Official release assets

Base URL:

```text
https://github.com/Gentleman-Programming/gentle-ai/releases/download/v2.1.3/
```

| Platform | Archive | SHA-256 |
| --- | --- | --- |
| darwin/amd64 | `gentle-ai_2.1.3_darwin_amd64.tar.gz` | `c4e7f061eb249db721434a9532fb1c0d93f4935b0d411766ba8d805459a33874` |
| darwin/arm64 | `gentle-ai_2.1.3_darwin_arm64.tar.gz` | `a7fd7965e3d9c28ec34fc8231eaaf99ac797734d09d1a2d93a4d4fe9431f10e9` |
| linux/amd64 | `gentle-ai_2.1.3_linux_amd64.tar.gz` | `6d98c42159ae88fca7130395e394ad1120ef06713ce79d3fdd96229d6d634856` |
| linux/arm64 | `gentle-ai_2.1.3_linux_arm64.tar.gz` | `fa28e55a90b44d4774680c3e7dad4e48ef4cc031348a055ba5b2965e46956238` |
| windows/amd64 | `gentle-ai_2.1.3_windows_amd64.zip` | `64f9667f9c6c27fa58c878890f890b58a180100a286e5c261144b521a4085d45` |
| windows/arm64 | `gentle-ai_2.1.3_windows_arm64.zip` | `cfb3b1a0b558db670b7211497b99db59edb33b348bbd60d459769fe41fc24981` |

Asset names, URLs, archive digests, manifest version, manifest asset name, manifest archive digest, and extracted binary digest remain exact integrity checks. Any mismatch fails installation/resolution closed.

## 6. v2.1.3 START contract

### 6.1 Strict decoder

`lib/native-review-cli.ts` must migrate the version-specific adapter and fixtures from v2.1.2 to v2.1.3. The START decoder must require exactly the released response fields:

```text
operation
lineage_id
state
risk_level
selected_lenses
changed_files
changed_lines
correction_budget
action
lenses_required
```

The decoder must:

- require `operation === "review/start"`;
- accept only released compact states used by START (`reviewing`, `correction_required`, `validating`, `approved`, or `escalated`);
- accept only actions `created`, `resumed`, `reuse-receipt`, or `blocked-scope-action`;
- require `lenses_required` to be boolean;
- retain the existing strict risk, lens, integer, lineage, and requested-lineage identity checks;
- require at least one valid selected lens when `lenses_required` is true; and
- reject unknown keys, unknown enums, malformed fields, or contradictory `reuse-receipt` plus `lenses_required: true` as schema-incompatible and fail closed.

When `lenses_required` is false, `selected_lenses` remains returned authority metadata but is not an actor dispatch instruction. Pi dispatches zero lenses even if a resumed lineage retains its original selection in that field.

### 6.2 Controller routing

`NativeStartResult` and `mapNativeStartResult` must expose `action` and `lensesRequired`/`lenses_required` alongside every retained field.

| START action | Required Pi behavior |
| --- | --- |
| `created` | If `lenses_required` is true, dispatch exactly `selected_lenses`; otherwise dispatch none and continue from returned state. |
| `resumed` | Reuse the returned lineage, state, files, lines, and original budget. Dispatch exactly `selected_lenses` only when `lenses_required` is true; when false, dispatch none and route to the returned state without opening another review. |
| `reuse-receipt` | Dispatch no lenses, do not call FINALIZE merely to recreate authority, and route to validation using the existing content-bound receipt/lineage. |
| `blocked-scope-action` | Fail closed, dispatch no actors, create no local authorization, and require the explicit supported scope action. |

Candidate-view projection metadata required by completed B2 may be retained for exact lifecycle preconditions, but a false `lenses_required` result must not create an actor lease or dispatch work. Cleanup remains confined and idempotent.

### 6.3 Exact retry behavior

After a thrown START that may have accessed authority or after lost output, Pi repeats the exact same native START request. The returned `resumed`, `reuse-receipt`, or `blocked-scope-action` action is authoritative. Pi must not regenerate a lineage, recalculate a budget, or use INSPECT as a substitute for the replay.

## 7. Mandatory INSPECT without fabricated inventory

Gentle AI v2.1.3 still has no native general read-only status or claimant-inventory operation. Pi must not claim otherwise.

The controller's required `INSPECT` call becomes a truthful local preflight:

- it checks Pi-owned legacy, mixed, ambiguous, invalid, and reset-in-progress conditions that Pi can actually inspect;
- those detected conditions remain blocking and retain the existing explicit reset/recovery authorization rules;
- on a clean local preflight, it returns a non-blocking route to native START while explicitly reporting `inventory_complete: false`, native general status/inventory as unsupported, and START as the authoritative routing operation;
- it does not enumerate native claimants, infer native receipt applicability, or claim that no native lineage exists; and
- it never authorizes skipping INSPECT.

The current native `INSPECT` response that always blocks on `require-upstream-read-only-native-status-inventory` must therefore be replaced by a ready/preflight result only for the v2.1.3 START contract. This is not a fabricated inventory: the result must say that inventory is unavailable and that atomic START performs the authoritative discovery/resume/reuse/block decision.

Tool guidance and prompt text must continue to say “Call INSPECT before START,” then explain why a clean preflight routes to idempotent START. It must not say or imply that INSPECT discovered all native authority.

## 8. `baseRef` and committed-only acknowledgement

Gentle AI v2.1.3 rejects START with dirty tracked content plus `--base-ref` unless the caller explicitly supplies `--committed-only`.

Pi does not currently define a typed committed-only acknowledgement. This migration must therefore:

- keep the native ordinary START input whitelist limited to the currently specified typed fields (`mode`, optional `baseRef`, optional repository-local `policyPath`);
- never append `--committed-only` implicitly, infer it from `baseRef`, or retry with it after native rejection;
- pass an explicitly supplied valid `baseRef` unchanged and preserve the native fail-closed rejection when the candidate has dirty tracked content; and
- treat any future committed-only support as a separate typed-input/specification change with explicit user intent and dedicated tests.

A dirty-tracked `baseRef` failure is a known contract result, not permission to fall back to v2.1.2, ambient Git projection, or local authority.

## 9. Planned file changes for the tasks revision

No files in this section are edited during design. The next tasks revision must make these work units explicit.

### 9.1 Pin, provisioning, and integrity

- `lib/gentle-ai-binary.ts` — pin/path/error/integrity version `2.1.3`.
- `scripts/gentle-ai-installer.mjs` — v2.1.3 base URL, tag, filenames, six official digests, install directory, and manifest version.
- `scripts/install-gentle-ai.mjs` — v2.1.3 install/verification diagnostics.
- `scripts/verify-package-files.mjs` — require the v2.1.3 native fixture path instead of the v2.1.2 path.

### 9.2 Native adapter and controller

- `lib/native-review-cli.ts` — v2.1.3 contract/version, version-specific adapter naming, strict START fields, action enum, lenses-required boolean, and no implicit committed-only flag.
- `extensions/gentle-ai.ts` — truthful INSPECT preflight, authoritative START routing, result mapping, actor-dispatch rules, failure mapping, and v2.1.3 guidance/contract labels.
- `lib/review-candidate-view.ts` — preserve B1/B2 behavior; change only if required to avoid actor binding when `lenses_required` is false, with focused regression evidence.

### 9.3 Fixtures and tests

- migrate checked-in native fixtures from `tests/fixtures/native-review-cli/v2.1.2/` to `tests/fixtures/native-review-cli/v2.1.3/`, updating START action/lenses fields while preserving unchanged released shapes for other operations;
- `tests/gentle-ai-installer.test.ts` and `tests/gentle-ai-binary.test.ts` — exact v2.1.3 assets, digests, path, manifest, version, and v2.1.2 rejection/no-fallback;
- `tests/native-review-cli.test.ts` — strict START decode and malformed/action/lenses/identity cases;
- `tests/review-controller-native-routing.test.ts` and `tests/review-controller.test.ts` — INSPECT-to-START routing, all four actions, no duplicate dispatch/budget, false-lenses behavior, blocked-scope closure, and baseRef argv behavior;
- `tests/native-review-parity-runtime.test.ts` — real package-local v2.1.3 unchanged allow and byte/path/mode deny while retaining the corrected external-artifact linked-view fixture; and
- package manifest/resource tests — v2.1.3 fixture and runtime labels.

### 9.4 OpenSpec evidence

- `tasks.md` — preserve completed checkmarks/evidence and add an unchecked v2.1.3 migration work unit before final review;
- `apply-progress.md` — append, never overwrite, v2.1.3 TDD and verification evidence; and
- `state.yaml` — remain at tasks revision required until the revised task plan is complete.

## 10. Strict TDD and verification

### 10.1 Migration RED/GREEN/TRIANGULATE/REFACTOR

- **RED:** pin tests expect v2.1.3 and fail against v2.1.2; START decoder fixtures require `action` and `lenses_required`; controller tests demonstrate the old INSPECT blocker and old unconditional lens binding; dirty-tracked `baseRef` tests prove Pi must not add `--committed-only`.
- **GREEN:** provision/verify v2.1.3, decode its exact START response, route all four actions, dispatch only when required, and make clean INSPECT a truthful non-blocking preflight to START.
- **TRIANGULATE:** cover created/resumed with both boolean values where valid, receipt reuse, blocked scope action, exact retry after ambiguous output, unknown fields/enums, contradictory receipt reuse, dirty tracked plus baseRef rejection, and unchanged B1/B2 projection behavior.
- **REFACTOR:** centralize v2.1.3 action/state routing without local inventory, budget, receipt, or authorization reconstruction.

### 10.2 Required real v2.1.3 evidence

Before final review, all must pass against the verified absolute package-local v2.1.3 binary:

```text
focused installer/binary/native-adapter/controller/candidate-view suites
real tests/native-review-parity-runtime.test.ts
complete focused issue/regression matrix
pnpm run test:harness
node scripts/verify-package-files.mjs
pnpm test
pnpm pack --dry-run
git diff --check
```

The parity fixture must again prove exact unchanged candidate authorization and changed byte/path/mode denial. The full suite must be green; the prior 694/694 v2.1.2 result is preserved evidence but cannot satisfy this v2.1.3 gate.

## 11. Rollout and final-review boundary

Rollout order is mandatory:

1. revise `tasks.md` while preserving every completed B1/B2 and earlier evidence item;
2. migrate the package-local pin, integrity metadata, native adapter, controller routing, fixtures, tests, and guidance under strict TDD;
3. provision and verify `.gentle-ai/v2.1.3/<executable>` and prove exact runtime version;
4. rerun the real parity fixture, focused suites, harness, package verification, full suite, and package dry-run;
5. append v2.1.3 evidence to apply progress and update state;
6. run Pi `/reload` so the current session reloads `extensions/gentle-ai.ts` and uses the new v2.1.3 adapter;
7. after reload, re-prove the controller/runtime identity is v2.1.3; and only then
8. start the mandatory high-risk final review, followed by independent SDD verification and lifecycle receipt validation in their required order.

Final review performed before `/reload`, or by a session still holding the v2.1.2 adapter, is invalid for this migration and must not be reported as final evidence.

## 12. Rollback and recovery

- A failed v2.1.3 install/verification leaves native review unavailable; it must not fall back to v2.1.2 or PATH.
- Pin rollback, if release-blocking evidence requires it, must revert installer metadata, resolver version, fixtures, tests, and package verification together. It does not delete native authority or user assets.
- START ambiguity is recovered only by exact replay. `resumed` and `reuse-receipt` must not allocate another review budget.
- `blocked-scope-action` remains terminal for the attempted route until an explicit supported scope action occurs.
- INSPECT failures involving legacy/mixed/reset authority retain existing exact-challenge recovery. Clean preflight does not prove native authority absence.
- B1/B2 rollback remains fail closed: never restore live-worktree reviewer fallback or local lifecycle authorization.

## 13. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Partial pin leaves installer, resolver, fixtures, or messages on different versions | One atomic migration work unit with exact URL/name/digest/version assertions and no v2.1.2 fallback. |
| Pi dispatches lenses again for resumed or approved authority | Route on native `action` and `lenses_required`; false always means zero dispatch, and receipt reuse never finalizes to recreate authority. |
| Unknown START fields are silently ignored | Preserve exact-object decoding and fail schema-incompatible. |
| INSPECT is misrepresented as native inventory | Report inventory incomplete/unsupported and name v2.1.3 START as the authoritative operation; never synthesize claimants. |
| Required INSPECT is skipped because START is idempotent | Keep INSPECT mandatory in controller guidance and tests; only its clean result is non-blocking. |
| Pi silently acknowledges committed-only semantics | No typed input and no `--committed-only` argv; native dirty-tracked `baseRef` rejection is preserved. |
| Prior B1/B2 evidence is lost or treated as sufficient for v2.1.3 | Preserve all existing evidence, then append real v2.1.3 parity/full-suite results. |
| Final review runs through stale loaded code | Require `/reload`, post-reload v2.1.3 identity proof, then review. |

## 14. Specification and task decision

The proposal and existing review/package runtime specifications remain semantically valid: they already require a released package-local runtime, immutable candidate views, exact projection, truthful diagnostics, no fabricated authority, mandatory INSPECT/gates, and full verification. This revision selects v2.1.3 as that released compatibility boundary and defines the newly available START response contract.

Tasks are no longer review-ready. The next phase is a tasks revision that preserves all completed B1/B2 and earlier checkmarks/evidence, introduces the v2.1.3 migration and reload gate, and blocks final review until real v2.1.3 parity/full verification is green.

## 15. Tooling limitation

The repository contains `.codegraph/`, but this executor had no CodeGraph query or shell tool. After that required-tool limitation, design verification used targeted reads of the proposal, specifications, design/state/tasks/apply evidence, installer/resolver/native adapter/controller paths, package verification script, and relevant fixture/test references. No product or test code was modified.
