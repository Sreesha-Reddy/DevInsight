const fs = require("fs");
const path = require("path");
const extract = require("extract-zip");
const axios = require("axios");

function getGithubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  const headers = {
    "User-Agent": "DevInsight-App",
    Accept: "application/vnd.github+json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function downloadRepoZip(fileUrl, outputPath) {
  const writer = fs.createWriteStream(outputPath);

  try {
    const response = await axios({
      method: "GET",
      url: fileUrl,
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("close", () => {
        resolve(outputPath);
      });
      writer.on("error", (err) => {
        writer.close();
        reject(err);
      });
    });
  } catch (err) {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    throw err;
  }
}

async function extractZip(zipPath, outputDir) {
  try {
    await extract(zipPath, { dir: outputDir });
    const extractedItems = fs.readdirSync(outputDir);

    if (extractedItems.length == 0) {
      throw new Error("No files found");
    }

    const repoPath = path.join(outputDir, extractedItems[0]);
    return repoPath;
  } catch (err) {
    throw err;
  }
}

const repoExtraction = async (owner, repoName) => {
  const tempDir = path.join(__dirname, "..", repoName);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const zipPath = path.join(tempDir, `${repoName}.zip`);
  const extractedDir = path.join(tempDir, `${repoName}_extracted`); // output path

  if (fs.existsSync(extractedDir)) {
    fs.rmSync(extractedDir, { recursive: true, force: true });
  }
  fs.mkdirSync(extractedDir);

  try {
    const repoMetaResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}`,
      {
        headers: getGithubHeaders(),
      },
    );
    const defaultBranch = repoMetaResponse.data.default_branch;
    const fileUrl = `https://codeload.github.com/${owner}/${repoName}/zip/refs/heads/${defaultBranch}`;

    console.log("Downloading zip");
    await downloadRepoZip(fileUrl, zipPath);

    console.log("Extracting zip");
    const repoPath = await extractZip(zipPath, extractedDir);

    return { repoPath, zipPath, extractedDir, tempDir };
  } catch (err) {
    throw err;
  }
};

module.exports = { repoExtraction };
