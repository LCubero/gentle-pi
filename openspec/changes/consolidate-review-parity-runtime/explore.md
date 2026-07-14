# Exploration: Consolidate Review Parity Runtime

## Scope and evidence

This exploration covers gentle-pi issues #96, #113, #119, #122, #123, #124, #128, #129, #133, and #137, plus the already-present package-local Gentle AI binary installer work. Issue bodies and all captured comments were read from `/tmp/gentle-pi-parity-issues.json`. Structural inspection used the repository's review facade, controller, persistence reset code, tests, and installer sources. CodeGraph was not available in the executor tool surface; filesystem inspection was used only after that failure. No product code was edited.

The current source is already materially ahead of several issue reports: the controller distinguishes native ordinary START from legacy compact START, has compact-v2 authority discovery, supports owner-qualified PR heads, and contains extensive persistence/recovery tests. The installer work is present in the worktree (`scripts/install-gentle-ai.mjs`, `scripts/gentle-ai-installer.mjs`, `lib/gentle-ai-binary.ts`, and package verification references); it must remain untouched.

## Disposition by issue

| Issue | Disposition | Finding |
| --- | --- | --- |
| #96 | **In scope, Pi-owned** | Reviewer contracts currently describe `initial_review_tree`, while snapshot routing is an internal/test concern. The release must ensure every dispatched lens receives a controller-owned resolvable immutable snapshot context and fails closed before dispatch when unresolved. This is a runtime parity/security boundary, not merely documentation. |
| #113 | **Out of scope / upstream-owned unless released contract exists** | This is compact-v2-to-OpenSpec projection/reconciliation after chained reviews. The issue's comments explicitly describe missing `gentle-ai.verify-result/v1` and native v2 review transaction support. Do not fabricate legacy mirrors or add an unreleased upstream API. Pi can consume an upstream released contract later, but no Pi implementation is justified from the captured evidence alone. |
| #119 | **Superseded/closed by current contract; retain as regression context** | The native CLI v2.1.0 comment shows a new lineage can be started after scope change. The deeper comment identifies the Pi/native store and projection mismatch, which is the same underlying defect as #133. Do not implement a generic force/reset workaround. |
| #122 | **Conditional, downstream of #133** | Better scope-changed diagnostics are useful only after the candidate projection is made semantically correct. Current validation already exposes candidate-tree and denial metadata in the native response, but not a receipt-tree/path diff. Treat as a small follow-on only if the released upstream validate contract exposes the required comparison data; otherwise do not reconstruct it in Pi. |
| #123 | **In scope, Pi-owned, documentation-only** | `extensions/gentle-ai.ts` currently describes FINALIZE generically and omits the nested `review_result.lens_results[].{lens,findings,evidence}` shape and minimal example. Add tool-definition documentation, using only the currently supported compact-v2 input. |
| #124 | **Obsolete for native ordinary flow; legacy compact remains upstream/API-owned** | Current tool text and controller paths state native ordinary START derives policy identity from `policyPath`; `policyHash` is explicitly legacy compact-only. Do not invent a Pi canonical hash. Preserve legacy compact validation and document the distinction if needed. |
| #128 | **In scope only if package-local persistence is still affected; likely upstream-owned** | `review-reset.ts` still calls `fsyncSync` on read-only file descriptors and directory paths. The issue's required durability semantics span the Gentle AI persistence implementation, and the package-local controller imports those operations. However, the requested upstream contract is not present in the captured material. Avoid broad portability changes unless tests/current worktree prove Pi owns the implementation; otherwise track as upstream dependency. |
| #129 | **Already implemented; regression-only** | Current controller source includes owner-qualified PR-head parsing and the error explicitly requires branch or `owner:branch` syntax. Keep existing tests; no new implementation is indicated. |
| #133 | **In scope, Pi-owned, highest priority** | `deriveCommitTree` derives the pre-commit target from the index, while compact START is complete-projection based. This is a real projection mismatch and explains #119. The coherent release must align pre-commit authorization with the supported released upstream contract, or fail closed with an explicit upstream dependency; do not bypass the lifecycle gate. |
| #137 | **Likely already implemented / verify-only** | Current facade exposes authority-aware compact discovery and candidate-binding checks, and the issue claims a native 4R-approved candidate fix. Confirm with current tests/diff; avoid duplicating upstream behavior. Windows fsync text in the issue is a separate concern from candidate identity and must not expand scope. |

## Overlap, dependency, and contradiction map

1. **#119 → #133**: #133 is the root cause; #119 is the symptom/recovery framing. One implementation and one regression suite should cover both.
2. **#122 depends on #133**: reporting a mismatch is secondary to deriving the right target. It must not normalize the current false-positive `scope-changed` behavior.
3. **#96 is orthogonal but same review parity boundary**: reviewer execution must inspect the frozen tree, while lifecycle validation must authorize the same intended candidate.
4. **#113 is a store/projection interoperability problem**, not safely solvable by hand-writing OpenSpec mirrors. It is excluded pending a released Gentle AI contract.
5. **#124 conflicts with the current native/legacy split**: current source explicitly rejects legacy `policyHash` for native START and retains it only for compact START. No production hash source should be invented.
6. **#128 and #137 mix upstream persistence/runtime concerns**. They should not be merged into Pi behavior without ownership evidence and platform tests.
7. **#129 and likely #137 are already represented in current source**, so implementation would risk duplicate or regressive behavior.

## Smallest coherent single-release scope

**Include:**
- preserve and ship the package-local pinned Gentle AI binary provisioning already in the worktree;
- fix/complete Pi-owned immutable snapshot context propagation and pre-dispatch resolution for 4R reviewers (#96);
- align or adapt compact pre-commit validation with the released upstream projection contract, resolving #133 and the actionable part of #119 without bypasses;
- document the currently supported compact FINALIZE JSON shape (#123);
- add focused regression coverage for frozen reviewer content, projection alignment, and finalize input discoverability.

**Exclude:** #113 projection/export, #124 canonical policy hash, and broad #128 persistence portability unless the installed/released Gentle AI binary exposes a supported contract that makes them Pi-owned. Treat #122 and #137 as verify-only or conditional follow-ups; #129 is verify-only.

## Risks and open checks for proposal/design

- The exact installed upstream binary version/contract must be checked before choosing an adaptation path for #96/#133. Never rely on issue prose for an unreleased API.
- The uncommitted installer files are a protected baseline and must not be reverted, reformatted, or absorbed accidentally.
- A pre-commit fix must preserve fail-closed lifecycle authorization and direct-command inspection; script wrapping remains a security concern and is explicitly non-goal for this release unless current code proves Pi ownership.
- Before implementation, inspect the actual worktree diff and run the focused tests to distinguish already-applied local changes from mainline behavior.

## Recommendation

Proceed to proposal with a narrow Pi-owned parity slice: snapshot dispatch context, pre-commit projection compatibility, and finalize documentation, while recording explicit upstream dependencies and verify-only dispositions for the remaining trackers.
