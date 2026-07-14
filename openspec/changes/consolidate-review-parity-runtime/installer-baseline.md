## Environment
2026-07-13T15:16:42Z
v24.18.0
11.1.1
92f126cddb1ca3f5c22c23dea7bb3f6e3d91d404
 M README.md
 M lib/native-review-cli.ts
 M package.json
 M scripts/verify-package-files.mjs
 M tests/package-manifest.test.ts
?? lib/gentle-ai-binary.ts
?? openspec/changes/consolidate-review-parity-runtime/
?? scripts/gentle-ai-installer.mjs
?? scripts/install-gentle-ai.mjs
?? tests/gentle-ai-binary.test.ts
?? tests/gentle-ai-installer.test.ts

## Diff stat
 README.md                        |  4 +++-
 lib/native-review-cli.ts         | 23 ++++++++++++++++++-----
 package.json                     |  1 +
 scripts/verify-package-files.mjs |  3 +++
 tests/package-manifest.test.ts   | 11 +++++++++++
 5 files changed, 36 insertions(+), 6 deletions(-)
 /dev/null => lib/gentle-ai-binary.ts | 44 ++++++++++++++++++++++++++++++++++++
 1 file changed, 44 insertions(+)
 /dev/null => scripts/gentle-ai-installer.mjs | 178 +++++++++++++++++++++++++++
 1 file changed, 178 insertions(+)
 /dev/null => scripts/install-gentle-ai.mjs | 14 ++++++++++++++
 1 file changed, 14 insertions(+)
 /dev/null => tests/gentle-ai-binary.test.ts | 70 +++++++++++++++++++++++++++++
 1 file changed, 70 insertions(+)
 /dev/null => tests/gentle-ai-installer.test.ts | 97 ++++++++++++++++++++++++++
 1 file changed, 97 insertions(+)

## Protected path digests
b7a873043a640dbe634a7477801b08d29325f88d71360d5ad9aded0d00977f11  package.json
cd95beee25b3f8eb525d789941beef3a7ca159a1232015f9971123551949e571  lib/native-review-cli.ts
907f66e8ae357a93c20cfbe9ae89ed43243c1a4481ce7be3bd1eb470694a785c  lib/gentle-ai-binary.ts
ce9f4f656c7041f8e87e58dbd1da89fb5faced7eeaeacd9d9faed1157b8a0071  scripts/verify-package-files.mjs
8fa4ea6390b2f352ceb152552ec2ad55f0bb405f2ea3a192ceb45b7f63bf8d85  scripts/gentle-ai-installer.mjs
59fd147ddf93395d0046a54f7a8e0ed31d4c39dcd1db7c52d38e2f3da931dd03  scripts/install-gentle-ai.mjs
28706c70f0b1d0695a71214a14cb50a19b1dfc62bac3299712a56cbefc1b959b  tests/package-manifest.test.ts
53225d382106d22de4bc3d418a6ce082df9b652c1ea3ba9c4213a3ccc0c20627  tests/gentle-ai-binary.test.ts
081d965eb3b582849767c5f502447e20c6dadbea95c8b7809160f2f2ff23be63  tests/gentle-ai-installer.test.ts

## Full protected diffs
diff --git a/package.json b/package.json
index e134e5eb..f035708f 100644
--- a/package.json
+++ b/package.json
@@ -35,6 +35,7 @@
     "README.md"
   ],
   "scripts": {
+    "postinstall": "node scripts/install-gentle-ai.mjs",
     "test": "node --experimental-strip-types --test tests/*.test.ts && pnpm run test:harness",
     "test:harness": "node --experimental-strip-types tests/runtime-harness.mjs",
     "prepack": "pnpm test && node scripts/verify-package-files.mjs",
diff --git a/lib/native-review-cli.ts b/lib/native-review-cli.ts
index d278ea5a..f4378895 100644
--- a/lib/native-review-cli.ts
+++ b/lib/native-review-cli.ts
@@ -3,6 +3,7 @@ import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
 import { tmpdir } from "node:os";
 import { join } from "node:path";
 import { promisify } from "node:util";
+import { PackageLocalGentleAiBinaryMissingError, resolveGentleAiBinary } from "./gentle-ai-binary.ts";
 
 const execFileAsync = promisify(execFile);
 
@@ -29,6 +30,7 @@ export const NATIVE_REVIEW_ERROR_CODE = {
 	IDENTITY_MISMATCH: "identity-mismatch",
 	VERSION_INCOMPATIBLE: "version-incompatible",
 	CANCELLED: "cancelled",
+	PACKAGE_BINARY_MISSING: "package-local-binary-missing",
 } as const;
 export type NativeReviewErrorCode = (typeof NATIVE_REVIEW_ERROR_CODE)[keyof typeof NATIVE_REVIEW_ERROR_CODE];
 
@@ -309,11 +311,11 @@ interface NativeJsonExecution {
 
 export class NativeReviewCliV212 {
 	private readonly adapter: ExecFileAdapter;
-	private readonly executable: string;
+	private readonly executable: string | (() => string);
 	private readonly timeoutMs: number;
 	private readonly maxBufferBytes: number;
 	private readonly cleanupDirectory: (directory: string) => Promise<void>;
-	constructor(adapter: ExecFileAdapter, executable = "gentle-ai", timeoutMs = 30_000, maxBufferBytes = 1024 * 1024, cleanupDirectory = (directory: string) => rm(directory, { recursive: true, force: true })) {
+	constructor(adapter: ExecFileAdapter, executable: string | (() => string) = "gentle-ai", timeoutMs = 30_000, maxBufferBytes = 1024 * 1024, cleanupDirectory = (directory: string) => rm(directory, { recursive: true, force: true })) {
 		this.adapter = adapter;
 		this.executable = executable;
 		this.timeoutMs = timeoutMs;
@@ -321,9 +323,19 @@ export class NativeReviewCliV212 {
 		this.cleanupDirectory = cleanupDirectory;
 	}
 
+	private executablePath(operation: NativeReviewOperation, mutating: boolean): string {
+		try { return typeof this.executable === "string" ? this.executable : this.executable(); }
+		catch (error) {
+			if (error instanceof PackageLocalGentleAiBinaryMissingError) {
+				throw nativeError(NATIVE_REVIEW_ERROR_CODE.PACKAGE_BINARY_MISSING, operation, mutating, error.message);
+			}
+			throw nativeError(NATIVE_REVIEW_ERROR_CODE.UNAVAILABLE, operation, mutating, "package-local native process could not start");
+		}
+	}
+
 	private async execute(operation: NativeReviewOperation, cwd: string, arguments_: readonly string[], mutating: boolean, signal?: AbortSignal): Promise<NativeJsonExecution> {
 		let result: ExecFileResult;
-		try { result = await this.adapter({ file: this.executable, arguments: arguments_, cwd, timeoutMs: this.timeoutMs, maxBufferBytes: this.maxBufferBytes, signal }); }
+		try { result = await this.adapter({ file: this.executablePath(operation, mutating), arguments: arguments_, cwd, timeoutMs: this.timeoutMs, maxBufferBytes: this.maxBufferBytes, signal }); }
 		catch (error) {
 			if (error instanceof NativeReviewCliError) throw nativeError(error.code, operation, mutating, error.message);
 			if (error instanceof Error && error.name === "AbortError") throw nativeError(NATIVE_REVIEW_ERROR_CODE.CANCELLED, operation, mutating, "native process was cancelled");
@@ -340,8 +352,9 @@ export class NativeReviewCliV212 {
 
 	private async verifyVersion(cwd: string, signal?: AbortSignal): Promise<void> {
 		let result: ExecFileResult;
-		try { result = await this.adapter({ file: this.executable, arguments: ["version"], cwd, timeoutMs: this.timeoutMs, maxBufferBytes: this.maxBufferBytes, signal }); }
+		try { result = await this.adapter({ file: this.executablePath(NATIVE_REVIEW_OPERATION.VERSION, false), arguments: ["version"], cwd, timeoutMs: this.timeoutMs, maxBufferBytes: this.maxBufferBytes, signal }); }
 		catch (error) {
+			if (error instanceof NativeReviewCliError) throw error;
 			if (error instanceof Error && error.name === "AbortError") throw nativeError(NATIVE_REVIEW_ERROR_CODE.CANCELLED, NATIVE_REVIEW_OPERATION.VERSION, false, "version process was cancelled");
 			throw nativeError(NATIVE_REVIEW_ERROR_CODE.UNAVAILABLE, NATIVE_REVIEW_OPERATION.VERSION, false, "gentle-ai is unavailable");
 		}
@@ -497,4 +510,4 @@ export class NativeReviewCliV212 {
 	}
 }
 
-export function createNativeReviewCli(adapter = createNodeExecFileAdapter()): NativeReviewCliV212 { return new NativeReviewCliV212(adapter); }
+export function createNativeReviewCli(adapter = createNodeExecFileAdapter(), executable: string | (() => string) = resolveGentleAiBinary): NativeReviewCliV212 { return new NativeReviewCliV212(adapter, executable); }
diff --git a/scripts/verify-package-files.mjs b/scripts/verify-package-files.mjs
index 8e434f77..fc505653 100644
--- a/scripts/verify-package-files.mjs
+++ b/scripts/verify-package-files.mjs
@@ -36,8 +36,11 @@ const requiredPaths = [
   "extensions/gentle-ai.ts",
   "extensions/sdd-init.ts",
   "extensions/skill-registry.ts",
+  "lib/gentle-ai-binary.ts",
   "lib/native-review-cli.ts",
   "lib/sdd-preflight.ts",
+  "scripts/gentle-ai-installer.mjs",
+  "scripts/install-gentle-ai.mjs",
   "tests/fixtures/native-review-cli/v2.1.2/start.json",
   "prompts/gcl.md",
   "prompts/gis.md",
diff --git a/tests/package-manifest.test.ts b/tests/package-manifest.test.ts
index 6f47ed1d..b0d4e881 100644
--- a/tests/package-manifest.test.ts
+++ b/tests/package-manifest.test.ts
@@ -123,6 +123,17 @@ test("package verification names the native review runtime boundary and packaged
 	);
 });
 
+test("package manifest ships and runs the checked-in package-local Gentle AI installer", () => {
+	const packageJson = readPackageJson();
+	const verifier = readFileSync(join(PACKAGE_ROOT, "scripts", "verify-package-files.mjs"), "utf8");
+
+	assert.equal(packageJson.scripts?.postinstall, "node scripts/install-gentle-ai.mjs");
+	assert.ok(packageJson.files?.includes("scripts/"));
+	assert.match(verifier, /"scripts\/install-gentle-ai\.mjs"/);
+	assert.match(verifier, /"scripts\/gentle-ai-installer\.mjs"/);
+	assert.match(verifier, /"lib\/gentle-ai-binary\.ts"/);
+});
+
 test("package manifest installs pi-pretty through a wrapper without bundling native optional dependencies", () => {
 	const packageJson = readPackageJson();
 
diff --git a/lib/gentle-ai-binary.ts b/lib/gentle-ai-binary.ts
new file mode 100644
index 00000000..8f9c6e02
--- /dev/null
+++ b/lib/gentle-ai-binary.ts
@@ -0,0 +1,44 @@
+import { existsSync, lstatSync } from "node:fs";
+import { dirname, join, resolve } from "node:path";
+import { fileURLToPath } from "node:url";
+
+export const GENTLE_AI_BINARY_MISSING_CODE = "package-local-binary-missing";
+export const GENTLE_AI_VERSION = "2.1.2";
+
+export class PackageLocalGentleAiBinaryMissingError extends Error {
+	readonly code = GENTLE_AI_BINARY_MISSING_CODE;
+	constructor(path: string) {
+		super(
+			`${GENTLE_AI_BINARY_MISSING_CODE}: Gentle AI v${GENTLE_AI_VERSION} is not installed at ${path}. Reinstall gentle-pi, or use GENTLE_PI_SKIP_GENTLE_AI_INSTALL=1 only for development/offline installs.`,
+		);
+		this.name = "PackageLocalGentleAiBinaryMissingError";
+	}
+}
+
+export function gentleAiBinaryPath(
+	packageRoot = dirname(dirname(fileURLToPath(import.meta.url))),
+	platform = process.platform,
+): string {
+	return join(
+		resolve(packageRoot),
+		".gentle-ai",
+		`v${GENTLE_AI_VERSION}`,
+		platform === "win32" ? "gentle-ai.exe" : "gentle-ai",
+	);
+}
+
+export function resolveGentleAiBinary(
+	packageRoot = dirname(dirname(fileURLToPath(import.meta.url))),
+	platform = process.platform,
+): string {
+	const path = gentleAiBinaryPath(packageRoot, platform);
+	try {
+		if (!existsSync(path) || !lstatSync(path).isFile()) {
+			throw new PackageLocalGentleAiBinaryMissingError(path);
+		}
+		return path;
+	} catch (error) {
+		if (error instanceof PackageLocalGentleAiBinaryMissingError) throw error;
+		throw new PackageLocalGentleAiBinaryMissingError(path);
+	}
+}
diff --git a/scripts/gentle-ai-installer.mjs b/scripts/gentle-ai-installer.mjs
new file mode 100644
index 00000000..d4062a32
--- /dev/null
+++ b/scripts/gentle-ai-installer.mjs
@@ -0,0 +1,178 @@
+import { createHash } from "node:crypto";
+import { createWriteStream } from "node:fs";
+import {
+	chmod,
+	copyFile,
+	lstat,
+	mkdir,
+	mkdtemp,
+	readFile,
+	readdir,
+	rename,
+	rm,
+	writeFile,
+} from "node:fs/promises";
+import https from "node:https";
+import { dirname, join } from "node:path";
+import { fileURLToPath } from "node:url";
+import { execFile } from "node:child_process";
+import { promisify } from "node:util";
+
+const execFileAsync = promisify(execFile);
+const RELEASE_BASE_URL = "https://github.com/Gentleman-Programming/gentle-ai/releases/download/v2.1.2/";
+const MAX_DOWNLOAD_BYTES = 100 * 1024 * 1024;
+const MAX_REDIRECTS = 3;
+const INSTALLER_VERSION = "2.1.2";
+
+function asset(name, sha256, executable) {
+	return Object.freeze({ name, sha256, executable, url: `${RELEASE_BASE_URL}${name}` });
+}
+
+export const GENTLE_AI_RELEASE_ASSETS = Object.freeze({
+	"darwin/amd64": asset("gentle-ai_2.1.2_darwin_amd64.tar.gz", "d9b0282a27376a86f504f4e30f333708e126abde3497a56575639e5078750a96", "gentle-ai"),
+	"darwin/arm64": asset("gentle-ai_2.1.2_darwin_arm64.tar.gz", "deb6396dd66e2bb3cfbb4dd33525b76681bdfdc13da9d81a6a24d33f4e602496", "gentle-ai"),
+	"linux/amd64": asset("gentle-ai_2.1.2_linux_amd64.tar.gz", "6e9f9e7c7169ec23c54f00145350c54fbecf77da3ef69ed7c62315cc7f882b4b", "gentle-ai"),
+	"linux/arm64": asset("gentle-ai_2.1.2_linux_arm64.tar.gz", "e81bae0f37fbe4f1d19d39519ffe1e97afd2fb1f86d1173865225d2705569a3e", "gentle-ai"),
+	"windows/amd64": asset("gentle-ai_2.1.2_windows_amd64.zip", "16ede05867e62e7d1e28b206624af8ead7e1eff5242957b717b93d9ef2589aaa", "gentle-ai.exe"),
+	"windows/arm64": asset("gentle-ai_2.1.2_windows_arm64.zip", "40aac2b5f3397d6de962c4620d0b3329a7346613f753e1f55c13db1735fb3cee", "gentle-ai.exe"),
+});
+
+function upstreamArchitecture(architecture) {
+	return architecture === "x64" ? "amd64" : architecture;
+}
+
+export function resolveGentleAiReleaseAsset(platform = process.platform, architecture = process.arch, releaseAssets = GENTLE_AI_RELEASE_ASSETS) {
+	const key = `${platform}/${upstreamArchitecture(architecture)}`;
+	const resolved = releaseAssets[key];
+	if (!resolved) throw new Error(`unsupported Gentle AI platform/architecture: ${platform}/${architecture}; supported pairs are darwin, linux, or windows with x64 or arm64`);
+	return resolved;
+}
+
+async function sha256File(path) {
+	return createHash("sha256").update(await readFile(path)).digest("hex");
+}
+
+export async function downloadGentleAiAsset(url, destination, maxBytes = MAX_DOWNLOAD_BYTES, redirects = MAX_REDIRECTS) {
+	const responseFor = async (currentUrl, remainingRedirects) => {
+		const parsed = new URL(currentUrl);
+		if (parsed.protocol !== "https:") throw new Error("Gentle AI installer requires HTTPS downloads");
+		return new Promise((resolve, reject) => {
+			const request = https.get(parsed, { headers: { "user-agent": "gentle-pi-installer" } }, (response) => {
+				const statusCode = response.statusCode ?? 0;
+				const location = response.headers.location;
+				if (statusCode >= 300 && statusCode < 400 && location) {
+					response.resume();
+					if (remainingRedirects <= 0) reject(new Error("Gentle AI download exceeded redirect limit"));
+					else responseFor(new URL(location, parsed).toString(), remainingRedirects - 1).then(resolve, reject);
+					return;
+				}
+				if (statusCode !== 200) {
+					response.resume();
+					reject(new Error(`Gentle AI download failed with HTTP ${statusCode}`));
+					return;
+				}
+				resolve(response);
+			});
+			request.on("error", reject);
+		});
+	};
+	const response = await responseFor(url, redirects);
+	const contentLength = Number(response.headers["content-length"] ?? "0");
+	if (!Number.isSafeInteger(contentLength) || contentLength < 0 || contentLength > maxBytes) {
+		response.resume();
+		throw new Error("Gentle AI download exceeds the maximum allowed size");
+	}
+	await new Promise((resolve, reject) => {
+		const output = createWriteStream(destination, { flags: "wx", mode: 0o600 });
+		let received = 0;
+		response.on("data", (chunk) => {
+			received += chunk.length;
+			if (received > maxBytes) response.destroy(new Error("Gentle AI download exceeds the maximum allowed size"));
+		});
+		response.on("error", (error) => { output.destroy(); reject(error); });
+		output.on("error", reject);
+		output.on("finish", resolve);
+		response.pipe(output);
+	});
+}
+
+export async function extractGentleAiArchive(archive, destination) {
+	await mkdir(destination, { recursive: true, mode: 0o700 });
+	const command = archive.endsWith(".zip") ? "unzip" : "tar";
+	const arguments_ = archive.endsWith(".zip")
+		? ["-q", archive, "-d", destination]
+		: ["-xzf", archive, "-C", destination];
+	try {
+		await execFileAsync(command, arguments_, { shell: false, windowsHide: true, maxBuffer: 1024 * 1024 });
+	} catch (error) {
+		throw new Error(`Unable to extract ${archive}. Install the system ${command} command and retry.`, { cause: error });
+	}
+}
+
+async function expectedRegularFile(directory, executable) {
+	const candidates = [];
+	async function visit(current) {
+		for (const entry of await readdir(current, { withFileTypes: true })) {
+			const path = join(current, entry.name);
+			if (entry.name === executable) {
+				const details = await lstat(path);
+				if (!details.isFile()) throw new Error(`Gentle AI archive contains a non-regular ${executable}`);
+				candidates.push(path);
+			} else if (entry.isDirectory()) await visit(path);
+		}
+	}
+	await visit(directory);
+	if (candidates.length !== 1) throw new Error(`Gentle AI archive must contain exactly one regular ${executable}`);
+	return candidates[0];
+}
+
+async function existingBinaryMatches(binaryPath, manifestPath, asset) {
+	try {
+		const [binary, manifest] = await Promise.all([lstat(binaryPath), readFile(manifestPath, "utf8")]);
+		const parsed = JSON.parse(manifest);
+		return binary.isFile()
+			&& parsed.version === INSTALLER_VERSION
+			&& parsed.assetSha256 === asset.sha256
+			&& typeof parsed.binarySha256 === "string"
+			&& parsed.binarySha256 === await sha256File(binaryPath);
+	} catch {
+		return false;
+	}
+}
+
+export async function installGentleAi(options = {}) {
+	const packageRoot = options.packageRoot ?? dirname(fileURLToPath(new URL("..", import.meta.url)));
+	const platform = options.platform ?? process.platform;
+	const arch = options.arch ?? process.arch;
+	const releaseAssets = options.releaseAssets ?? GENTLE_AI_RELEASE_ASSETS;
+	const asset = resolveGentleAiReleaseAsset(platform, arch, releaseAssets);
+	const installDirectory = join(packageRoot, ".gentle-ai", `v${INSTALLER_VERSION}`);
+	const binaryPath = join(installDirectory, asset.executable);
+	const manifestPath = join(installDirectory, "integrity.json");
+	if (await existingBinaryMatches(binaryPath, manifestPath, asset)) return { installed: false, binaryPath, asset };
+
+	await mkdir(packageRoot, { recursive: true });
+	const temporaryDirectory = await mkdtemp(join(packageRoot, ".gentle-ai-install-"));
+	try {
+		await chmod(temporaryDirectory, 0o700);
+		const archive = join(temporaryDirectory, asset.name);
+		await (options.download ?? downloadGentleAiAsset)(asset.url, archive);
+		const digest = await sha256File(archive);
+		if (digest !== asset.sha256) throw new Error(`Gentle AI archive checksum mismatch for ${asset.name}`);
+		const extracted = join(temporaryDirectory, "extracted");
+		await (options.extractArchive ?? extractGentleAiArchive)(archive, extracted);
+		const source = await expectedRegularFile(extracted, asset.executable);
+		await mkdir(installDirectory, { recursive: true, mode: 0o700 });
+		const temporaryBinary = join(installDirectory, `.${asset.executable}.${process.pid}.${Date.now()}.tmp`);
+		const temporaryManifest = join(installDirectory, `.integrity.${process.pid}.${Date.now()}.tmp`);
+		await copyFile(source, temporaryBinary);
+		if (platform !== "win32") await chmod(temporaryBinary, 0o700);
+		const binarySha256 = await sha256File(temporaryBinary);
+		await writeFile(temporaryManifest, `${JSON.stringify({ version: INSTALLER_VERSION, asset: asset.name, assetSha256: asset.sha256, binarySha256 })}\n`, { mode: 0o600 });
+		await rename(temporaryBinary, binaryPath);
+		await rename(temporaryManifest, manifestPath);
+		return { installed: true, binaryPath, asset };
+	} finally {
+		await rm(temporaryDirectory, { recursive: true, force: true }).catch(() => undefined);
+	}
+}
diff --git a/scripts/install-gentle-ai.mjs b/scripts/install-gentle-ai.mjs
new file mode 100644
index 00000000..1ae07e47
--- /dev/null
+++ b/scripts/install-gentle-ai.mjs
@@ -0,0 +1,14 @@
+#!/usr/bin/env node
+import { installGentleAi } from "./gentle-ai-installer.mjs";
+
+if (process.env.GENTLE_PI_SKIP_GENTLE_AI_INSTALL === "1") {
+	console.warn("GENTLE_PI_SKIP_GENTLE_AI_INSTALL=1: skipped package-local Gentle AI installation; native review operations will fail with package-local-binary-missing until gentle-pi is reinstalled.");
+} else {
+	try {
+		const result = await installGentleAi();
+		console.log(`Gentle AI v2.1.2 ${result.installed ? "installed" : "integrity-verified"} at ${result.binaryPath}`);
+	} catch (error) {
+		console.error(`gentle-pi could not install its package-local Gentle AI v2.1.2 binary: ${error instanceof Error ? error.message : String(error)}`);
+		process.exitCode = 1;
+	}
+}
diff --git a/tests/gentle-ai-binary.test.ts b/tests/gentle-ai-binary.test.ts
new file mode 100644
index 00000000..6ce21d19
--- /dev/null
+++ b/tests/gentle-ai-binary.test.ts
@@ -0,0 +1,70 @@
+import assert from "node:assert/strict";
+import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
+import { tmpdir } from "node:os";
+import { basename, isAbsolute, join } from "node:path";
+import test from "node:test";
+import {
+	GENTLE_AI_BINARY_MISSING_CODE,
+	PackageLocalGentleAiBinaryMissingError,
+	resolveGentleAiBinary,
+} from "../lib/gentle-ai-binary.ts";
+import { NativeReviewCliV212, createNativeReviewCli, type ExecFileAdapter } from "../lib/native-review-cli.ts";
+
+const VERSION = { stdout: "gentle-ai 2.1.2\n", stderr: "", exitCode: 0, signal: null, timedOut: false, outputLimitExceeded: false } as const;
+
+test("runtime resolves an absolute package-local binary path without PATH fallback", async () => {
+	const packageRoot = await mkdtemp(join(tmpdir(), "gentle-pi-binary-"));
+	const executable = process.platform === "win32" ? "gentle-ai.exe" : "gentle-ai";
+	const binaryPath = join(packageRoot, ".gentle-ai", "v2.1.2", executable);
+	await mkdir(join(packageRoot, ".gentle-ai", "v2.1.2"), { recursive: true });
+	await writeFile(binaryPath, "native");
+
+	const resolved = resolveGentleAiBinary(packageRoot, process.platform);
+	assert.equal(resolved, binaryPath);
+	assert.equal(isAbsolute(resolved), true);
+	assert.equal(basename(resolved), executable);
+	assert.doesNotMatch(resolved, /(^|[/\\])PATH($|[/\\])/i);
+});
+
+test("runtime fails closed when the package-local binary is missing", async () => {
+	const packageRoot = await mkdtemp(join(tmpdir(), "gentle-pi-binary-missing-"));
+	assert.throws(
+		() => resolveGentleAiBinary(packageRoot, "linux"),
+		(error: unknown) => error instanceof PackageLocalGentleAiBinaryMissingError
+			&& error.code === GENTLE_AI_BINARY_MISSING_CODE
+			&& error.message.includes("package-local-binary-missing"),
+	);
+});
+
+test("production native operations report the package-local missing binary code", async () => {
+	const packageRoot = await mkdtemp(join(tmpdir(), "gentle-pi-native-missing-"));
+	const adapter: ExecFileAdapter = async () => {
+		throw new Error("the adapter must not be reached when the package binary is missing");
+	};
+	await assert.rejects(
+		() => createNativeReviewCli(adapter, () => resolveGentleAiBinary(packageRoot, "linux")).start({ cwd: packageRoot }),
+		(error: unknown) => error instanceof Error && "code" in error && error.code === GENTLE_AI_BINARY_MISSING_CODE,
+	);
+});
+
+test("production native client never invokes a global gentle-ai executable", async () => {
+	const packageRoot = await mkdtemp(join(tmpdir(), "gentle-pi-native-"));
+	const executable = process.platform === "win32" ? "gentle-ai.exe" : "gentle-ai";
+	const binaryPath = join(packageRoot, ".gentle-ai", "v2.1.2", executable);
+	await mkdir(join(packageRoot, ".gentle-ai", "v2.1.2"), { recursive: true });
+	await writeFile(binaryPath, "native");
+	const calls: string[] = [];
+	const adapter: ExecFileAdapter = async (request) => {
+		calls.push(request.file);
+		if (request.arguments[0] === "version") return VERSION;
+		return {
+			...VERSION,
+			stdout: JSON.stringify({ operation: "review/start", lineage_id: "lineage", state: "reviewing", risk_level: "low", selected_lenses: [], changed_files: 0, changed_lines: 0, correction_budget: 0 }),
+		};
+	};
+
+	await createNativeReviewCli(adapter, () => resolveGentleAiBinary(packageRoot, process.platform)).start({ cwd: packageRoot });
+	assert.deepEqual(calls, [binaryPath, binaryPath]);
+	assert.ok(calls.every((file) => file !== "gentle-ai"));
+	assert.ok(new NativeReviewCliV212(adapter, "gentle-ai"));
+});
diff --git a/tests/gentle-ai-installer.test.ts b/tests/gentle-ai-installer.test.ts
new file mode 100644
index 00000000..ee84cdbb
--- /dev/null
+++ b/tests/gentle-ai-installer.test.ts
@@ -0,0 +1,97 @@
+import assert from "node:assert/strict";
+import { createHash } from "node:crypto";
+import { existsSync } from "node:fs";
+import { chmod, mkdtemp, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
+import { tmpdir } from "node:os";
+import { join } from "node:path";
+import test from "node:test";
+import {
+	GENTLE_AI_RELEASE_ASSETS,
+	installGentleAi,
+	resolveGentleAiReleaseAsset,
+} from "../scripts/gentle-ai-installer.mjs";
+
+const EXPECTED_ASSETS = {
+	"darwin/amd64": { name: "gentle-ai_2.1.2_darwin_amd64.tar.gz", sha256: "d9b0282a27376a86f504f4e30f333708e126abde3497a56575639e5078750a96" },
+	"darwin/arm64": { name: "gentle-ai_2.1.2_darwin_arm64.tar.gz", sha256: "deb6396dd66e2bb3cfbb4dd33525b76681bdfdc13da9d81a6a24d33f4e602496" },
+	"linux/amd64": { name: "gentle-ai_2.1.2_linux_amd64.tar.gz", sha256: "6e9f9e7c7169ec23c54f00145350c54fbecf77da3ef69ed7c62315cc7f882b4b" },
+	"linux/arm64": { name: "gentle-ai_2.1.2_linux_arm64.tar.gz", sha256: "e81bae0f37fbe4f1d19d39519ffe1e97afd2fb1f86d1173865225d2705569a3e" },
+	"windows/amd64": { name: "gentle-ai_2.1.2_windows_amd64.zip", sha256: "16ede05867e62e7d1e28b206624af8ead7e1eff5242957b717b93d9ef2589aaa" },
+	"windows/arm64": { name: "gentle-ai_2.1.2_windows_arm64.zip", sha256: "40aac2b5f3397d6de962c4620d0b3329a7346613f753e1f55c13db1735fb3cee" },
+} as const;
+
+test("release mapping selects only the supported official v2.1.2 archive and pinned digest", () => {
+	assert.deepEqual(
+		Object.fromEntries(Object.entries(GENTLE_AI_RELEASE_ASSETS).map(([key, asset]) => [key, { name: asset.name, sha256: asset.sha256 }])),
+		EXPECTED_ASSETS,
+	);
+	assert.equal(resolveGentleAiReleaseAsset("linux", "x64").name, "gentle-ai_2.1.2_linux_amd64.tar.gz");
+	assert.equal(resolveGentleAiReleaseAsset("windows", "arm64").name, "gentle-ai_2.1.2_windows_arm64.zip");
+	for (const asset of Object.values(GENTLE_AI_RELEASE_ASSETS)) {
+		assert.match(asset.url, /^https:\/\/github\.com\/Gentleman-Programming\/gentle-ai\/releases\/download\/v2\.1\.2\//);
+	}
+});
+
+test("unsupported platform pairs fail clearly before download", () => {
+	for (const [platform, arch] of [["freebsd", "x64"], ["linux", "ia32"], ["darwin", "ppc64"]]) {
+		assert.throws(() => resolveGentleAiReleaseAsset(platform, arch), /unsupported Gentle AI platform\/architecture/);
+	}
+});
+
+test("checksum mismatch cleans temporary state without promoting a binary", async () => {
+	const packageRoot = await mkdtemp(join(tmpdir(), "gentle-pi-installer-mismatch-"));
+	await assert.rejects(
+		() => installGentleAi({
+			packageRoot,
+			platform: "linux",
+			arch: "x64",
+			download: async (_url, destination) => writeFile(destination, "corrupt archive"),
+		}),
+		/checksum mismatch/,
+	);
+	assert.equal(existsSync(join(packageRoot, ".gentle-ai", "v2.1.2", "gentle-ai")), false);
+	assert.deepEqual((await readdir(packageRoot)).filter((entry) => entry.startsWith(".gentle-ai-install-")), []);
+});
+
+test("installer promotes only the expected regular executable with executable POSIX mode", async () => {
+	const packageRoot = await mkdtemp(join(tmpdir(), "gentle-pi-installer-promote-"));
+	const payload = Buffer.from("trusted archive fixture");
+	const sha256 = createHash("sha256").update(payload).digest("hex");
+	const asset = { name: "gentle-ai_2.1.2_linux_amd64.tar.gz", sha256, url: "https://example.invalid/gentle-ai.tar.gz", executable: "gentle-ai" };
+	await installGentleAi({
+		packageRoot,
+		platform: "linux",
+		arch: "x64",
+		releaseAssets: { "linux/amd64": asset },
+		download: async (_url, destination) => writeFile(destination, payload),
+		extractArchive: async (_archive, destination) => {
+			await mkdir(destination, { recursive: true });
+			const extracted = join(destination, "gentle-ai");
+			await writeFile(extracted, "native executable");
+			await chmod(extracted, 0o700);
+		},
+	});
+	const binary = join(packageRoot, ".gentle-ai", "v2.1.2", "gentle-ai");
+	assert.equal(existsSync(binary), true);
+	assert.equal(await readFile(binary, "utf8"), "native executable");
+	assert.ok(((await stat(binary)).mode & 0o111) !== 0);
+	assert.equal((await installGentleAi({ packageRoot, platform: "linux", arch: "x64", releaseAssets: { "linux/amd64": asset } })).installed, false);
+});
+
+test("installer rejects an archive without the expected regular executable", async () => {
+	const packageRoot = await mkdtemp(join(tmpdir(), "gentle-pi-installer-nonregular-"));
+	const payload = Buffer.from("trusted archive fixture");
+	const asset = { name: "gentle-ai_2.1.2_linux_amd64.tar.gz", sha256: createHash("sha256").update(payload).digest("hex"), url: "https://example.invalid/gentle-ai.tar.gz", executable: "gentle-ai" };
+	await assert.rejects(
+		() => installGentleAi({
+			packageRoot,
+			platform: "linux",
+			arch: "x64",
+			releaseAssets: { "linux/amd64": asset },
+			download: async (_url, destination) => writeFile(destination, payload),
+			extractArchive: async (_archive, destination) => mkdir(join(destination, "gentle-ai"), { recursive: true }),
+		}),
+		/non-regular gentle-ai/,
+	);
+	assert.equal(existsSync(join(packageRoot, ".gentle-ai", "v2.1.2", "gentle-ai")), false);
+});

## Post-suite protected path digests
b7a873043a640dbe634a7477801b08d29325f88d71360d5ad9aded0d00977f11  package.json
cd95beee25b3f8eb525d789941beef3a7ca159a1232015f9971123551949e571  lib/native-review-cli.ts
907f66e8ae357a93c20cfbe9ae89ed43243c1a4481ce7be3bd1eb470694a785c  lib/gentle-ai-binary.ts
ce9f4f656c7041f8e87e58dbd1da89fb5faced7eeaeacd9d9faed1157b8a0071  scripts/verify-package-files.mjs
8fa4ea6390b2f352ceb152552ec2ad55f0bb405f2ea3a192ceb45b7f63bf8d85  scripts/gentle-ai-installer.mjs
59fd147ddf93395d0046a54f7a8e0ed31d4c39dcd1db7c52d38e2f3da931dd03  scripts/install-gentle-ai.mjs
28706c70f0b1d0695a71214a14cb50a19b1dfc62bac3299712a56cbefc1b959b  tests/package-manifest.test.ts
53225d382106d22de4bc3d418a6ce082df9b652c1ea3ba9c4213a3ccc0c20627  tests/gentle-ai-binary.test.ts
081d965eb3b582849767c5f502447e20c6dadbea95c8b7809160f2f2ff23be63  tests/gentle-ai-installer.test.ts

## Comparison
Protected paths are byte-for-byte unchanged after WU-01 verification.
