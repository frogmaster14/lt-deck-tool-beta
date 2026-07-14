import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectExpectedImages } from "../data/limbus-data-validator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, "..");

const transparentPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

function parseArgs(argv) {
  const result = {
    projectRoot: defaultProjectRoot,
    overwrite: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--overwrite") {
      result.overwrite = true;
      continue;
    }

    if (arg === "--root") {
      const next = argv[index + 1];
      if (next) {
        result.projectRoot = path.resolve(next);
        index += 1;
      }
      continue;
    }

    if (!arg.startsWith("--")) {
      result.projectRoot = path.resolve(arg);
    }
  }

  return result;
}

const options = parseArgs(process.argv.slice(2));
const expectedImages = collectExpectedImages();

let created = 0;
let skipped = 0;
let overwritten = 0;

expectedImages.forEach((asset) => {
  const fullPath = path.join(options.projectRoot, asset.image);
  const exists = fs.existsSync(fullPath);

  if (exists && !options.overwrite) {
    skipped += 1;
    return;
  }

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, transparentPng);

  if (exists) {
    overwritten += 1;
  } else {
    created += 1;
  }
});

console.log(`Asset placeholders created under: ${options.projectRoot}`);
console.log(`Expected images: ${expectedImages.length}`);
console.log(`Created: ${created}`);
console.log(`Skipped: ${skipped}`);
console.log(`Overwritten: ${overwritten}`);
