# Protected Installer Baseline Checklist

## Protected paths

- `package.json`
- `lib/native-review-cli.ts`
- `lib/gentle-ai-binary.ts`
- `scripts/verify-package-files.mjs`
- `scripts/gentle-ai-installer.mjs`
- `scripts/install-gentle-ai.mjs`
- `tests/package-manifest.test.ts`
- `tests/gentle-ai-binary.test.ts`
- `tests/gentle-ai-installer.test.ts`

## Baseline receipt

The complete initial status, diff stat, full protected diffs, environment, and SHA-256 digests are recorded in `installer-baseline.md`. Post-suite digests match its initial protected-path digests byte-for-byte.

## Guard

Do not rewrite, discard, or replace protected installer behavior while applying later work units. Any later change to a protected path must preserve the baseline intent, be explicitly justified by the relevant work unit, and be tested with its installer/binary/package suite.

## Work-unit boundary

WU-01 is evidence-only: it introduces only this checklist, `installer-baseline.md`, and cumulative apply progress. No installer/product behavior was changed. No commit was created.
