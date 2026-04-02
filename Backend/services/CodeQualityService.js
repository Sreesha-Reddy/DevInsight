const path = require("path");
const fs = require("fs");
const { ESLint } = require("eslint");

function writeTempEslintConfig(repoPath) {
  const configPath = path.join(repoPath, "eslint.config.mjs");
  const configContent = `
export default [
  {
    files: ["**/*.js"],
    ignores: ["node_modules/**", "dist/**", "build/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module"
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-extra-semi": "warn",
      "eqeqeq": "warn"
    }
  }
];`;
  fs.writeFileSync(configPath, configContent.trim());
  return configPath;
}

async function runESLint(repoPath) {
  const originalCwd = process.cwd();
  const configPath = writeTempEslintConfig(repoPath);
  try {
    process.chdir(repoPath);
    const eslint = new ESLint({
      fix: false,
      errorOnUnmatchedPattern: false,
    });
    const results = await eslint.lintFiles(["**/*.js"]);
    return results;
  } finally {
    process.chdir(originalCwd);
    if (fs.existsSync(configPath)) fs.unlinkSync(configPath);
  }
}

async function parseLintResults(results) {
  try {
    let lintErrors = 0;
    let lintWarnings = 0;
    let filesAnalyzed = results.length;

    let worstFile = null;
    let maxProblems = 0;

    for (const result of results) {
      const { filePath, errorCount, warningCount } = result;

      lintErrors += errorCount;
      lintWarnings += warningCount;

      const totalProblems = errorCount + warningCount;
      if (totalProblems > maxProblems) {
        maxProblems = totalProblems;
        worstFile = filePath;
      }
    }
    return { lintErrors, lintWarnings, filesAnalyzed, worstFile };
  } catch (err) {
    throw err;
  }
}
async function codeQualityScore(metrics) {
  try {
    const { lintErrors, lintWarnings, filesAnalyzed } = metrics;
    if (filesAnalyzed === 0) {
      return 100;
    }
    const avgErrors = lintErrors / filesAnalyzed;
    const avgWarnings = lintWarnings / filesAnalyzed;
    const errorPenalty = Math.min(1, avgErrors / 10);
    const warningPenalty = Math.min(1, avgWarnings / 10);
    const base = 100;
    const score = base * (1 - errorPenalty * 0.7) * (1 - warningPenalty * 0.3);
    return score;
  } catch (err) {
    throw err;
  }
}

const analyzeCodeQuality = async (repoPath) => {
  try {
    console.log("Running ESLint");
    const results = await runESLint(repoPath);

    console.log("Parsing results");
    const metrics = await parseLintResults(results);

    console.log("Calculating score");
    const score = await codeQualityScore(metrics);

    return { ...metrics, codeQualityScore: score };
  } catch (err) {
    throw err;
  }
  // finally {
  //     if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
  //     if (fs.existsSync(extractedDir)) fs.rmSync(extractedDir, {recursive: true, force: true});
  // }
};

module.exports = { analyzeCodeQuality };
