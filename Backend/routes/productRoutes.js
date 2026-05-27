const express = require("express");
const axios = require("axios");
const router = express.Router();

const Repo = require("../models/temp");

const { analyzeCodeQuality } = require("../services/CodeQualityService");
const { repoExtraction } = require("../services/RepoExtraction");
const { locAnalysis } = require("../services/LOCAnalysisService");
const { complexityAnalysis } = require("../services/ComplexityAnalysis");

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

router.post("/api/analyze", async (req, res) => {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) {
      return res.status(400).json({ error: "Repo URL needed" });
    }

    console.log(repoUrl);

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)\/?$/); //github.com/user_name/repo_name
    if (!match) {
      return res.status(400).json({ error: "Invalid URL" });
    }
    const owner = match[1];
    const repoName = match[2];

    const { repoPath } = await repoExtraction(owner, repoName);

    const codeQuality = await analyzeCodeQuality(repoPath);
    const linesOfCode = await locAnalysis(repoPath);
    const complexity = await complexityAnalysis(repoPath);

    const githubHeaders = getGithubHeaders();

    const repoResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}`,
      {
        headers: githubHeaders,
      },
    );

    const lastPushed = new Date(repoResponse.data.pushed_at);
    const existingRepo = await Repo.findOne({ url: repoUrl });

    if (existingRepo) { 
      if(existingRepo.lastAnalyzed > lastPushed) {
        return res.json({
          message: "Repository already analyzed",
          data: existingRepo,
        });
      }
      await Repo.deleteOne({ url: repoUrl });
    }

    const repoData = repoResponse.data;

    const commitsResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/commits`,
      {
        headers: githubHeaders,
      },
    );
    const pullResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/pulls?state=all`,
      {
        headers: githubHeaders,
      },
    );
    const issuesResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repoName}/issues?state=all`,
      {
        headers: githubHeaders,
      },
    );

    const starsScore =
      Math.log10(repoData.stargazers_count + 1) / Math.log10(100000);
    const forksScore = Math.log10(repoData.forks_count + 1) / Math.log10(50000);
    const commitsScore =
      Math.log10(commitsResponse.data.length + 1) / Math.log10(5000);

    const metrics = {
      commits: commitsResponse.data.length,
      issues: issuesResponse.data.filter((issue) => !issue.pull_request).length,
      pullRequests: pullResponse.data.length,
      forks: repoData.forks_count,
      stars: repoData.stargazers_count,
      popularityScore:
        100 * (0.5 * starsScore + 0.3 * forksScore + 0.2 * commitsScore),
    };

    const { average } = complexity;
    const complexityScore = (1 - average) * 100;

    const overallScore =
      0.5 * codeQuality.codeQualityScore +
      0.3 * metrics.popularityScore +
      0.2 * complexityScore;

    const newRepo = new Repo({
      repoName,
      owner,
      url: repoUrl,
      metrics,
      codeQuality,
      linesOfCode,
      complexity,
      overallScore,
    });
    await newRepo.save();

    res.json({
      message: "Analysis Successful",
      data: newRepo,
    });
  } catch (err) {
    if (
      err.response &&
      err.response.status == 403 &&
      err.response.data.message.includes("API rate limit exceeded")
    ) {
      res
        .status(429)
        .json({ error: "GitHub rate limit exceeded. Try again later." });
    } else if (err.response && err.response.status == 404) {
      res.status(404).json({ error: "Repository not found" });
    } else {
      res.status(500).json({ error: "Failed to analyze repository" });
      console.log(err);
    }
  }
});

module.exports = router;
