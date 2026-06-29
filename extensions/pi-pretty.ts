import { realpathSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const packageJsonPath = realpathSync(
	fileURLToPath(new URL("../package.json", import.meta.url)),
);
const requireFromRealPackage = createRequire(packageJsonPath);
const piPrettyModule = requireFromRealPackage("@heyhuynhgiabuu/pi-pretty");

const piPrettyExtension =
	typeof piPrettyModule === "function"
		? piPrettyModule
		: piPrettyModule.default;

export default piPrettyExtension;
