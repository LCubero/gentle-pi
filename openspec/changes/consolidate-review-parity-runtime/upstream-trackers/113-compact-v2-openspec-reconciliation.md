### Pre-flight Checklist

- [x] I have searched [existing issues](https://github.com/Gentleman-Programming/gentle-ai/issues) and this is not a duplicate
- [x] I understand that PRs will be rejected if the linked issue does not have `status:approved`

### 📝 Bug Description

Gentle AI v2.1.2 can create an approved native ordinary review receipt and exposes `review bind-sdd`, but it does not expose a released, versioned contract that lets an OpenSpec status/archive flow consume or reconcile explicitly selected compact-v2 receipt(s) after chained reviews.

A terminal chained delivery can therefore retain valid native authority while `sdd-status` still sees no OpenSpec review receipt/state/bundle/context artifacts and routes the change to `resolve-review`. Pi must not parse private authority stores, hand-author legacy OpenSpec mirrors, guess a `gentle-ai.verify-result/v1` envelope, invalidate receipts, or reset valid authority to bridge that gap.

This is related to #1243, which concerns failed-verification remediation after a valid compact binding, and to #1239, which concerns authority idempotency and review-budget behavior. It is not a duplicate of either: this report requests the released reconciliation/consumption contract for explicitly selected approved lineage(s), including chained/superseded lineage handling.

### 🔄 Steps to Reproduce

1. Create an OpenSpec change delivered through two or more chained reviews, with each completed slice holding an approved native compact-v2 lineage.
2. Preserve an older terminal escalated or superseded lineage in the same Git common directory.
3. Validate and explicitly bind an approved lineage with the supported CLI:

   ```shell
   gentle-ai review validate --gate post-apply --cwd "$PWD" --lineage <approved-lineage>
   gentle-ai review bind-sdd --cwd "$PWD" --change <change> --lineage <approved-lineage> --expected-binding-revision=
   ```

4. Run:

   ```shell
   gentle-ai sdd-status <change> --cwd "$PWD" --json --instructions
   ```

5. Observe that the OpenSpec review mirror artifacts remain absent or the status cannot consume the approved chain as one explicit terminal review record.
6. Do not reset authority or fabricate `openspec/changes/<change>/reviews/*` files; those stores and hashes are private native authority, not a client API.

### ✅ Expected Behavior

Gentle AI publishes a released, versioned CLI/API contract that can either:

- reconcile an explicitly selected approved lineage or ordered set of chained approved lineages into non-authoritative OpenSpec evidence; or
- let native OpenSpec status/archive consume the explicit approved compact-v2 binding directly.

The contract must preserve native authority and receipt identity, require explicit lineage selection, define approved/terminal and chained/superseded-lineage rules, be idempotent, document deterministic failure modes, and never require reset, private-store parsing, fabricated mirrors, guessed verify envelopes, or a new review budget.

### ❌ Actual Behavior

The released v2.1.2 surface documents `review bind-sdd --change --lineage --expected-binding-revision`, but it exposes no documented compact-v2-to-OpenSpec reconciliation/export command, no versioned projection schema, and no native status contract that represents an ordered chain of approved receipt(s) as the required OpenSpec review evidence.

Gentle Pi's native adapter can invoke `review bind-sdd` and read `sdd-status`, but it cannot safely synthesize the missing mirror from the native private store. The resulting state is fail-closed rather than a supported terminal reconciliation path.

### Gentle AI Version

2.1.2

### Operating System

Linux (Other)

### AI Agent / Client

Other

### 📋 Affected Area

CLI (commands, flags)

### 💡 Logs / Error Output

```shell
$ gentle-ai review bind-sdd --help
Bind an explicit approved compact lineage to an OpenSpec change.

$ gentle-ai sdd-status <change> --cwd "$PWD" --json --instructions
# OpenSpec review receipt/state/bundle/context remain unavailable to the
# status/archive path for the approved chained compact authority.
# Safe clients cannot manufacture the missing legacy artifacts.
```

### Additional Context

Acceptance criteria:

- [ ] A released versioned output schema binds an explicit approved lineage or ordered chain of approved lineages to an OpenSpec change.
- [ ] The contract specifies selection, approved/terminal-state checks, chained and superseded lineage behavior, idempotency, and deterministic failure modes.
- [ ] Native authority, receipts, hashes, and audit history remain immutable; the operation never requires reset or a new review budget.
- [ ] `sdd-status`/archive can consume the released binding or projection without clients parsing private stores or fabricating `gentle-ai.verify-result/v1`/legacy mirrors.
- [ ] Ambiguous, unapproved, stale, receipt-mismatched, or cross-change lineage selections fail closed.
- [ ] CLI/schema documentation and cross-platform tests cover successful explicit selection and each failure class.

#1244 is a separate linked-worktree candidate-projection parity defect. This request does not alter candidate identity, authorization, or lifecycle validation; it concerns consumption of already-approved native authority. #1239 remains the authority-idempotency/budget companion, not a substitute for this OpenSpec reconciliation contract.
