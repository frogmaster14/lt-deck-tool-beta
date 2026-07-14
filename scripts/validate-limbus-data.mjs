import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateLimbusData } from "../data/limbus-data-validator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultProjectRoot = path.resolve(__dirname, "..");

function parseArgs(argv) {
  const result = {
    projectRoot: defaultProjectRoot,
    json: false,
    limit: 40
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--json") {
      result.json = true;
      continue;
    }

    if (arg === "--limit") {
      const next = argv[index + 1];
      const limit = Number(next);
      if (Number.isInteger(limit) && limit >= 0) {
        result.limit = limit;
        index += 1;
      }
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

function formatIssue(issue) {
  if (issue.code === "missing-image") {
    return `[${issue.code}] ${issue.kind} ${issue.id}: ${issue.image}`;
  }

  return `[${issue.code}] ${issue.message}`;
}

function printHumanReport(report, options) {
  const { summary, issues } = report;

  console.log(report.ok ? "Limbus data validation: OK" : "Limbus data validation: FAILED");
  console.log("");
  console.log(`Project root: ${options.projectRoot}`);
  console.log(`Sinners: ${summary.sinners}`);
  console.log(`Identities: ${summary.identities}`);
  console.log(`Cards: ${summary.cards}`);
  console.log(`Deckable cards: ${summary.deckableCards}`);
  console.log(`Unique add-on cards: ${summary.uniqueCards}`);
  console.log(`EGO cards: ${summary.egos}`);
  console.log(`Expected images: ${summary.expectedImages}`);
  console.log(`Missing images: ${summary.missingImages}`);
  Object.entries(summary.missingImagesByKind).forEach(([kind, count]) => {
    console.log(`- Missing ${kind} images: ${count}`);
  });
  console.log(`Errors: ${summary.errors}`);

  if (issues.length === 0) return;

  console.log("");
  console.log("Issue summary:");
  Object.entries(summary.byCode).forEach(([code, count]) => {
    console.log(`- ${code}: ${count}`);
  });

  if (options.limit === 0) return;

  const visibleIssues = issues.slice(0, options.limit);
  console.log("");
  console.log(`Issues, first ${visibleIssues.length}:`);
  visibleIssues.forEach((issue) => {
    console.log(`- ${formatIssue(issue)}`);
  });

  const hiddenCount = issues.length - visibleIssues.length;
  if (hiddenCount > 0) {
    console.log(`- ...and ${hiddenCount} more`);
  }
}

const options = parseArgs(process.argv.slice(2));
const report = validateLimbusData({
  imageExists(imagePath) {
    return fs.existsSync(path.join(options.projectRoot, imagePath));
  }
});

if (options.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  printHumanReport(report, options);
}

process.exitCode = report.ok ? 0 : 1;
