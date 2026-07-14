### Pre-flight Checklist

- [x] I have searched [existing issues](https://github.com/Gentleman-Programming/gentle-ai/issues) and this is not a duplicate
- [x] I understand that PRs will be rejected if the linked issue does not have `status:approved`

### 📝 Bug Description

The supported Gentle Pi ordinary-review path delegates authority mutation and persistence to the package-provisioned Gentle AI v2.1.2 executable. Pi must not shadow or reimplement native persistence when Windows durability fails in that supported path.

The currently shipped Pi adapter verifies the absolute package-local executable and invokes only native `review start`, `review finalize`, `review validate`, and `review bind-sdd`. Pi's older compact/graph-v1 persistence modules still contain POSIX-oriented `fsync` calls, but they are legacy compatibility paths and are not evidence that Pi owns ordinary native authority persistence.

Gentle AI needs a released Windows durability contract and executable coverage for native ordinary authority operations: writable-file flushing, directory-fsync behavior where unsupported, same-directory atomic replacement, immutable no-replace publication, locks, crash recovery, reset/recovery, and SDD binding.

### 🔄 Steps to Reproduce

1. On Windows, install the released Gentle AI v2.1.2 executable and run it through the supported native ordinary review path.
2. In a repository without existing authority, run `gentle-ai review start --cwd <repo>`.
3. Supply valid selected-lens results and final evidence, then run `gentle-ai review finalize --cwd <repo> --lineage <lineage> ...`.
4. Run `gentle-ai review validate --gate pre-commit --cwd <repo> --lineage <lineage>` and, when applicable, `gentle-ai review bind-sdd --cwd <repo> --change <change> --lineage <lineage> --expected-binding-revision=`.
5. Exercise the same operations across retry, immutable publication, lock release/recovery, and reset/recovery paths.
6. Observe any Windows failure caused by read-only file `fsync`, directory `fsync`, unsupported atomic publication, or lock/durability handling.

### ✅ Expected Behavior

A released Windows binary completes supported native ordinary authority operations without unsupported read-only-file or directory `fsync` calls while retaining all authority guarantees:

- writable-file flush before publication;
- same-directory atomic replacement for mutable state;
- no-replace/immutable publication with verified idempotent retry;
- lock ownership, retry, and fail-closed recovery;
- crash-safe reset/recovery and SDD binding; and
- documented residual durability guarantees when Windows cannot provide POSIX directory synchronization.

### ❌ Actual Behavior

The supported call-path boundary proves that Pi delegates native ordinary persistence to the v2.1.2 executable and cannot safely correct native storage behavior locally:

```text
Gentle Pi NativeReviewCliV212
  -> verified absolute package-local gentle-ai 2.1.2 executable
  -> review start | review finalize | review validate | review bind-sdd
```

The native CLI help exposes these mutable ordinary operations but no released Windows durability contract or platform-specific guarantees. Pi has legacy persistence code with read-only descriptor and directory `fsync` patterns, for example in `review-compact-store.ts`, `review-repository.ts`, `review-lock.ts`, `review-object-store.ts`, and `review-reset.ts`; those paths are explicitly excluded from the supported native ordinary route and must not be used to fabricate an ownership transfer.

Without a native released fix/contract, Pi can only fail closed and record the upstream dependency.

### Gentle AI Version

2.1.2

### Operating System

Windows

### AI Agent / Client

Other

### 📋 Affected Area

CLI (commands, flags)

### 💡 Logs / Error Output

```shell
$ gentle-ai review start --help
Freeze live Git scope and derive the bounded review tier, lenses, and correction budget.

$ gentle-ai review finalize --help
Canonicalize reviewer output and evidence, perform required native transitions, and materialize the terminal receipt.

$ gentle-ai review bind-sdd --help
Bind an explicit approved compact lineage to an OpenSpec change.

# Required Windows regression failure signature to eliminate:
# EPERM: operation not permitted, fsync
# or an equivalent native authority publication/lock durability failure.
```

### Additional Context

Acceptance criteria:

- [ ] Native ordinary START, FINALIZE, VALIDATE, and bind-sdd have Windows CI coverage, including retry, lock, crash-recovery, reset/recovery, and immutable publication paths.
- [ ] Writable files are flushed through supported writable descriptors; unsupported directory synchronization is handled by an explicit platform contract without weakening fail-closed behavior.
- [ ] Mutable state uses same-directory atomic replacement; immutable records/bundles retain no-replace semantics and safe idempotent retries.
- [ ] Lock ownership and recovery remain race-safe; failed persistence never reports an approved authority.
- [ ] The CLI documents Windows residual guarantees and deterministic errors.
- [ ] Pi clients need not parse native stores, alter receipts, or implement a shadow persistence layer.

Related but not a duplicate: #1246 covers Windows filesystems that reject native hard-link event publication. This issue covers the broader native ordinary durability contract, especially writable-file and directory synchronization, mutable-state replacement, lock/recovery, reset/recovery, and SDD binding. #1239 remains the separate authority idempotency/review-budget constraint.
