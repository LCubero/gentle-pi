### Pre-flight Checklist

- [x] I have searched [existing issues](https://github.com/Gentleman-Programming/gentle-ai/issues) and this is not a duplicate
- [x] I understand that PRs will be rejected if the linked issue does not have `status:approved`

### 📝 Bug Description

When Gentle AI v2.1.2 denies lifecycle validation with `result: "scope-changed"` and `denial.code: "candidate-or-paths-mismatch"`, the released response reports the actual live `candidate_tree`, `paths_digest`, denial stage, and denial code but does not expose the expected/approved receipt tree or bounded differing-path diagnostics.

Clients can report the denial honestly, but they cannot explain a genuine mismatch without reading private review authority or reconstructing native receipt bindings locally. Both approaches are unsafe: the native receipt tree, approved path digest, and path comparison are authoritative data owned by Gentle AI.

### 🔄 Steps to Reproduce

1. Start and finalize an ordinary native review against a repository candidate.
2. Change a reviewed byte, path, or staged initially-untracked file so the live candidate no longer equals the approved receipt.
3. Run:

   ```shell
   gentle-ai review validate --gate pre-commit --cwd "$PWD" --lineage <approved-lineage>
   ```

4. Observe a nonzero result with `scope-changed` and `receipt-binding/candidate-or-paths-mismatch`.
5. Inspect the released response: it supplies the actual candidate tree/path digest but not the expected receipt tree, expected receipt path digest, or bounded differing-path data.
6. Do not inspect native private stores or reconstruct authoritative receipt/path data in the client.

### ✅ Expected Behavior

The released validate contract provides versioned diagnostic fields for genuine receipt-binding mismatches, including:

- expected/approved receipt candidate tree and actual candidate tree;
- expected and actual path digests;
- bounded differing-path data, or a stable opaque diagnostic-artifact reference;
- truncation and privacy rules; and
- stable denial codes and equivalent behavior at every lifecycle gate.

Clients must be able to explain a real `candidate-or-paths-mismatch` using released response data only. Missing or redacted data must be explicit and deterministic.

### ❌ Actual Behavior

v2.1.2 `review validate --help` documents gate, lineage, and policy inputs but no diagnostic-output contract. The supported response consumed by Gentle Pi contains the result, action, reason, and context; the observed scope-change context includes actual candidate data and the native denial, but no expected receipt tree or differing paths.

Example denial from the package-local v2.1.2 linked-worktree parity probe:

```json
{
  "result": "scope-changed",
  "allowed": false,
  "action": "create-new-lineage",
  "denial": {
    "stage": "receipt-binding",
    "code": "candidate-or-paths-mismatch"
  },
  "context": {
    "candidate_tree": "6bd4847bb4018b6f29634c73fe3db570979583fd",
    "paths_digest": "sha256:fe531ea07463a26fd0b336fb46b004f868a4176ee8b7eb82f212fc4c16fd4515"
  }
}
```

The missing expected receipt values and path differences prevent safe actionable diagnostics. Pi intentionally does not parse private authority or compute a competing authoritative comparison.

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
$ gentle-ai review validate --gate pre-commit --cwd "$PWD" --lineage <approved-lineage>
# exit code: 1
# result: scope-changed
# allowed: false
# action: create-new-lineage
# denial: receipt-binding/candidate-or-paths-mismatch
# returned: actual candidate_tree and paths_digest
# absent: expected receipt tree, expected receipt path digest, differing paths
```

### Additional Context

Acceptance criteria:

- [ ] A released, versioned validate-response schema documents expected and actual candidate-tree/path-digest fields for receipt-binding mismatches.
- [ ] The response provides bounded differing-path diagnostics or an opaque diagnostic artifact with documented access semantics.
- [ ] The contract defines truncation, privacy/redaction, stable denial codes, and behavior across post-apply, pre-commit, pre-push, pre-pr, and release gates.
- [ ] Genuine byte, mode, path, policy, receipt, repository, and provenance mismatches remain fail closed.
- [ ] Clients need no private-store read, receipt reconstruction, hash fabrication, or local authority comparison.
- [ ] Cross-platform regression tests cover diagnostics present, diagnostics truncated/redacted, and diagnostics unavailable.

This is distinct from #1244: #1244 concerns false linked-worktree projection denial for an unchanged candidate. This issue concerns the released diagnostics contract after a mismatch has been genuinely established. It is also complementary to #1239: diagnostics must not create a new lineage, alter authority, or change the bounded review budget.
