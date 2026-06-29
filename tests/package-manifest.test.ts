import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

interface PackageJsonPiManifest {
	extensions?: string[];
}

interface PackageJson {
	dependencies?: Record<string, string>;
	bundledDependencies?: string[];
	bundleDependencies?: string[];
	pi?: PackageJsonPiManifest;
}

function readPackageJson(): PackageJson {
	const rawPackageJson = readFileSync(join(PACKAGE_ROOT, "package.json"), "utf8");

	try {
		return JSON.parse(rawPackageJson) as PackageJson;
	} catch (error) {
		throw new Error("package.json must contain valid JSON", { cause: error });
	}
}

test("package manifest installs pi-pretty through a wrapper without bundling native optional dependencies", () => {
	const packageJson = readPackageJson();

	assert.equal(
		packageJson.dependencies?.["@heyhuynhgiabuu/pi-pretty"],
		"0.6.14",
		"gentle-pi must install the tested pi-pretty version as a normal dependency",
	);
	assert.ok(
		packageJson.pi?.extensions?.includes("./extensions"),
		"gentle-pi must load packaged extension wrappers",
	);
	assert.ok(
		!packageJson.pi?.extensions?.includes(
			"./node_modules/@heyhuynhgiabuu/pi-pretty/dist/index.js",
		),
		"gentle-pi must not reference pnpm-unportable nested node_modules paths",
	);
	assert.ok(
		existsSync(join(PACKAGE_ROOT, "extensions", "pi-pretty.ts")),
		"gentle-pi must expose pi-pretty through a packaged wrapper extension",
	);
	assert.ok(
		!packageJson.bundledDependencies?.includes("@heyhuynhgiabuu/pi-pretty"),
		"pi-pretty must not be bundled because its native optional dependencies are platform-specific",
	);
	assert.ok(
		!packageJson.bundleDependencies?.includes("@heyhuynhgiabuu/pi-pretty"),
		"pi-pretty must not be bundled because its native optional dependencies are platform-specific",
	);
});


test("pi-pretty wrapper uses real package path resolution for pnpm symlink installs", () => {
	const wrapper = readFileSync(
		join(PACKAGE_ROOT, "extensions", "pi-pretty.ts"),
		"utf8",
	);

	assert.match(wrapper, /realpathSync/);
	assert.match(wrapper, /createRequire/);
	assert.match(wrapper, /@heyhuynhgiabuu\/pi-pretty/);
});
