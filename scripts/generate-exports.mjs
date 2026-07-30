import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = path.join(root, "package.json");
const srcRoot = path.join(root, "src");

const SCAN_DIRS = ["schemas", "responses", "domain"];

const STATIC_EXPORTS = {
  ".": {
    types: "./dist/index.d.ts",
    import: "./dist/index.js",
  },
  "./enums": {
    types: "./dist/enums/index.d.ts",
    import: "./dist/enums/index.js",
  },
  "./primitives/zod": {
    types: "./dist/primitives/zod.d.ts",
    import: "./dist/primitives/zod.js",
  },
  "./types/pagination": {
    types: "./dist/types/pagination.d.ts",
    import: "./dist/types/pagination.js",
  },
  "./types/errors": {
    types: "./dist/types/errors.d.ts",
    import: "./dist/types/errors.js",
  },
  "./types/response": {
    types: "./dist/types/response.d.ts",
    import: "./dist/types/response.js",
  },
};

function listModuleNames(dirName) {
  const dirPath = path.join(srcRoot, dirName);
  if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
    throw new Error(`Expected source directory missing: src/${dirName}`);
  }

  const names = fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
    .map((entry) => entry.name.slice(0, -".ts".length))
    .sort((a, b) => a.localeCompare(b));

  if (names.length === 0) {
    throw new Error(`Expected at least one .ts module in src/${dirName}`);
  }

  return names;
}

function entryFor(subpath, distFile) {
  return {
    types: `./dist/${distFile}.d.ts`,
    import: `./dist/${distFile}.js`,
  };
}

const exportsMap = { ...STATIC_EXPORTS };

for (const dirName of SCAN_DIRS) {
  for (const name of listModuleNames(dirName)) {
    const subpath = `./${dirName}/${name}`;
    exportsMap[subpath] = entryFor(subpath, `${dirName}/${name}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
packageJson.exports = exportsMap;
fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

const generatedCount = Object.keys(exportsMap).length - Object.keys(STATIC_EXPORTS).length;
console.log(
  `Updated exports: ${Object.keys(STATIC_EXPORTS).length} static + ${generatedCount} generated`,
);
