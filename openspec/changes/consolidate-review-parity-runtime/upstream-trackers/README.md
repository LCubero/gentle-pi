# I4 Upstream Tracker Evidence

## Ownership matrix

| Local issue | Owner for supported path | Released v2.1.2 evidence | Upstream tracker | Local disposition |
| --- | --- | --- | --- | --- |
| #113 | Gentle AI | `review bind-sdd` binds one lineage, but no released versioned compact-v2/OpenSpec reconciliation or chained-lineage consumption contract exists. | [gentle-ai#1247](https://github.com/Gentleman-Programming/gentle-ai/issues/1247) | Upstream-blocked with concrete tracker |
| #122 | Gentle AI | `review validate` reports actual `candidate_tree`, `paths_digest`, and denial code, but lacks expected receipt tree/path digest and differing paths. | [gentle-ai#1248](https://github.com/Gentleman-Programming/gentle-ai/issues/1248) | Upstream-blocked with concrete tracker |
| #128 | Gentle AI for native ordinary authority | `NativeReviewCliV212` delegates START, FINALIZE, VALIDATE, and bind-sdd to the verified package-local v2.1.2 executable. Pi legacy compact/graph persistence is excluded. | [gentle-ai#1249](https://github.com/Gentleman-Programming/gentle-ai/issues/1249) | Upstream-blocked with concrete tracker |

## Evidence boundary

- The package-local binary reports `gentle-ai 2.1.2`.
- Native help was inspected for `review start`, `review finalize`, `review validate`, and `review bind-sdd`.
- `tests/native-review-parity-runtime.test.ts` retains the real v2.1.2 fixture that records the `receipt-binding/candidate-or-paths-mismatch` denial without reading private authority.
- No private-store parsing, receipt/mirror/hash fabrication, reset, native authority mutation, or Pi persistence shadow implementation was used.
- Duplicate searches covered compact-v2/OpenSpec reconciliation, scope-change diagnostics, and Windows fsync/durability. #1246 is related only to hard-link publication; #1244 is linked-worktree projection parity; #1239 is authority idempotency/budget.

## Remote creation verification

Each issue is open and has `bug` and `status:needs-review` labels. Bodies were prepared from the upstream bug-report template fields; GitHub CLI cannot combine `--template` with `--body-file`, so the exact template headings/checklists were supplied in the submitted body and the template labels were explicitly applied.
