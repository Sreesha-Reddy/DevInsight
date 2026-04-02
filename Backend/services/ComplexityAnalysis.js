const fs = require("fs");
const path = require("path");
const { ESLint } = require("eslint");

async function writeCyclomaticComplexity(repoPath) {
  const configPath = path.join(repoPath, "eslint.config.mjs");
  try {
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
                  "complexity": ["error", 10]
                }
              }
           ] 
        `;
    fs.writeFileSync(configPath, configContent.trim());
    return configPath;
  } catch (err) {
    throw err;
  }
}

async function runESLint(repoPath) {
  const originalCwd = process.cwd();
  const configPath = await writeCyclomaticComplexity(repoPath);
  try {
    process.chdir(repoPath);
    const eslint = new ESLint({
      fix: false,
      overrideConfigFile: configPath,
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
  let highComplexityFiles = 0;
  let filesCount = results.length;

  for (const result of results) {
    if (result.messages.some((msg) => msg.ruleId === "complexity")) {
      highComplexityFiles += 1;
    }
  }
  const average = filesCount === 0 ? 0 : highComplexityFiles / filesCount;
  return { average, highComplexityFiles };
}

const complexityAnalysis = async (repoPath) => {
  try {
    const results = await runESLint(repoPath);
    const { highComplexityFiles, average } = await parseLintResults(results);
    return { average, highComplexityFiles };
  } catch (err) {
    throw err;
  }
};

module.exports = { complexityAnalysis };
