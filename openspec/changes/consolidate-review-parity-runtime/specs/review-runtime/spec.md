# Review Runtime Specification

## Purpose

Define truthful, fail-closed review and lifecycle behavior against the released, package-provisioned Gentle AI contract.

## Requirements

### Requirement: Reviewers inspect the immutable candidate snapshot

The controller MUST provide every selected reviewer with a read-only, resolvable view of the frozen candidate identified by the review authority. Reviewer dispatch MUST fail closed before any actor starts when the snapshot cannot be resolved or its content identity cannot be verified. Reviewers MUST NOT fall back to the live working directory.

#### Scenario: Frozen content differs from the live worktree

- GIVEN a review snapshot has been frozen and the live worktree is subsequently changed
- WHEN a selected reviewer reads the candidate
- THEN the reviewer reads the frozen snapshot content and not the live worktree content

#### Scenario: Snapshot resolution fails

- GIVEN a selected reviewer has no resolvable controller-owned snapshot context
- WHEN dispatch is requested
- THEN dispatch is denied before actor execution and the failure identifies snapshot resolution or identity verification

### Requirement: Start, finalize, and pre-commit validate the same supported candidate projection

The supported review path MUST derive candidate identity and intended paths using the released runtime contract consistently across START, FINALIZE, and pre-commit VALIDATE. Unchanged intended content, including supported staged initially-untracked files, MUST be authorizable. A genuine candidate or path change MUST be denied. No reset, direct object writing, store deletion, force option, or lifecycle bypass MAY be used as recovery.

#### Scenario: Unchanged intended content is committed

- GIVEN a review is finalized for an intended candidate and its supported path set
- WHEN the same candidate, including staged initially-untracked content, is validated for pre-commit
- THEN validation authorizes the lifecycle command

#### Scenario: Candidate content or paths changed

- GIVEN the validated candidate or intended path set differs from the approved receipt
- WHEN pre-commit validation runs
- THEN validation denies authorization, preserves the existing authority, and requires a new supported lineage or other released recovery action

#### Scenario: Projection support is unavailable

- GIVEN the installed runtime does not expose a released projection/reconciliation contract required by the flow
- WHEN the operation would require a fabricated mirror, hash, tree, or envelope
- THEN the operation fails closed and reports an upstream dependency instead of creating security-relevant data locally

### Requirement: Genuine candidate mismatches have honest diagnostics

The system MUST distinguish a real mismatch from a Pi-created projection mismatch. Mismatch diagnostics MAY expose only candidate, receipt, path, and diff data provided by the installed released validation contract. The system MUST NOT reconstruct authoritative trees, hashes, or path differences from private authority storage.

#### Scenario: Released runtime supplies comparison data

- GIVEN validation denies a genuine candidate or path mismatch
- WHEN the released runtime supplies comparison context
- THEN the response reports the denial code and the available expected/actual candidate and path-difference data

#### Scenario: Released runtime lacks path-diff support

- GIVEN validation denies a mismatch but the released runtime does not expose receipt/path-diff data
- WHEN diagnostics are produced
- THEN the response states that the data is unavailable and links or records the concrete upstream diagnostics dependency

### Requirement: FINALIZE input is publicly discoverable and schema-compatible

The public FINALIZE tool definition MUST document the nested `review_result.lens_results[]` shape, including `lens`, `findings`, and `evidence`; require results for every selected lens; document paired final evidence and `final_verification_passed`; and include a minimal valid no-correction example. Documentation MUST match the installed runtime and MUST distinguish the Pi wrapper contract from native CLI result-file inputs.

#### Scenario: Caller constructs a successful no-correction FINALIZE

- GIVEN all selected lenses produced result entries with findings and evidence
- WHEN the caller supplies the documented nested input with final evidence and `final_verification_passed: true`
- THEN FINALIZE accepts it and can produce an approved result without a correction

#### Scenario: Required lens or paired final data is missing

- GIVEN a FINALIZE input omits a selected lens result or supplies only one of final evidence and final verification status
- WHEN FINALIZE validates the input
- THEN it rejects the input with an actionable schema error and does not advance authority

### Requirement: Native and legacy policy identity remain distinct

The supported native ordinary START path MUST obtain policy identity only through the released native contract, including its documented policy path or internally derived identity. Production code and documentation MUST NOT invent, hard-code, or calculate a Pi-defined canonical policy hash. Legacy compact validation MAY remain supported only through its explicitly legacy contract.

#### Scenario: Native ordinary START is requested

- GIVEN the released native runtime provides the ordinary policy source
- WHEN native START is invoked
- THEN the controller delegates policy identity through that native source and exact retries bind the same policy identity

#### Scenario: No released policy source exists

- GIVEN a caller cannot obtain policy identity through the released native contract
- WHEN START would require an invented hash
- THEN START fails closed without creating authority

### Requirement: Fork heads bind to one exact remote commit

Pre-PR validation MUST support both branch and owner-qualified `owner:branch` heads. An owner-qualified head MUST resolve through exactly one matching configured GitHub remote and bind authorization to the exact advertised remote commit. Malformed syntax, missing or ambiguous owner remotes, and divergent advertised commits MUST fail closed.

#### Scenario: Valid fork head

- GIVEN one configured remote matches the requested owner and its branch resolves
- WHEN the pre-PR gate validates the owner-qualified head
- THEN it authorizes only the exact resolved commit

#### Scenario: Fork head is malformed, ambiguous, missing, or divergent

- GIVEN the owner-qualified head cannot be uniquely resolved or its commit differs from the advertised target
- WHEN the pre-PR gate validates it
- THEN validation denies publication and reports the resolution or commit mismatch

### Requirement: Lifecycle discovery is filtered by candidate identity

Implicit lifecycle discovery MUST filter review authority by the live candidate identity before applying the zero/one/multiple-match invariant. Historical or unrelated worktrees MUST NOT contaminate discovery. Corrected candidates and staged initially-untracked candidates MUST remain discoverable, while multiple true matches MUST fail closed.

#### Scenario: Unrelated historical lineage exists

- GIVEN unrelated historical or escalated lineages share the Git common directory
- WHEN validation implicitly discovers authority for the current candidate
- THEN unrelated lineages are excluded and the matching current lineage is selected

#### Scenario: Multiple true candidate matches exist

- GIVEN two or more valid lineages match the current candidate identity
- WHEN implicit discovery runs
- THEN discovery fails closed and requires explicit disambiguation

### Requirement: Issue dispositions and evidence remain truthful

Release evidence MUST assign exactly one terminal work-unit disposition to each scoped issue (#96, #113, #119, #122, #123, #124, #128, #129, #133, #137). A disposition MUST cite focused tests, runtime/source evidence, a named root fix, or a real upstream tracker URL. Upstream-blocked issues MUST NOT be reported as fixed; valid authority MUST remain intact.

#### Scenario: Verification matrix is produced

- GIVEN implementation and runtime verification are complete
- WHEN the issue disposition matrix is recorded
- THEN every issue has one evidence-linked disposition and no unsupported closure claim

#### Scenario: Upstream contract is missing

- GIVEN projection/reconciliation or diagnostics behavior is not available in the released runtime
- WHEN the work unit is finalized
- THEN the issue remains truthfully upstream-blocked with a concrete tracker URL and no fabricated mirror or reset

### Requirement: Lifecycle gates preserve fail-closed guarantees

Candidate parity corrections MUST preserve lifecycle authorization, receipt integrity, actor distrust, and content-bound gate validation. The implementation MUST NOT authorize commands by wrapping them, bypassing inspection, or weakening the supported gate.

#### Scenario: Unapproved lifecycle command is attempted

- GIVEN no valid authorization exists for the exact candidate
- WHEN a lifecycle command is requested
- THEN the gate denies it regardless of command wrapping or actor output
