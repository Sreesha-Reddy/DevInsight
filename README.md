# DevInsight – Repository Analytics Platform

## Overview

DevInsight is a full-stack repository analytics platform that evaluates public GitHub repositories and generates structured performance insights based on popularity, activity, code quality, and complexity indicators.

The system integrates with the GitHub REST API to retrieve real-time repository data and leverages ESLint-based static analysis to evaluate code quality. It applies weighted scoring algorithms to compute normalized performance metrics and persists analyzed results in a cloud-hosted MongoDB database.

The project demonstrates production-ready full-stack architecture, secure API authentication, static code analysis integration, and end-to-end cloud deployment.

---

## Problem Statement

Public GitHub repositories contain multiple signals of quality and activity such as stars, forks, commits, issues, and pull requests. However, interpreting these signals collectively to understand repository health and maintainability can be difficult.

DevInsight addresses this by:

- Aggregating repository metrics
- Performing static code analysis using ESLint
- Normalizing raw statistics using logarithmic scaling
- Computing weighted performance scores
- Presenting structured analytics through a clean interface

---

## Core Features

- Analysis of any public GitHub repository
- Real-time retrieval of:
  - Repository metadata
  - Commit activity
  - Pull requests
  - Issues
  - Stars
  - Forks
- ESLint-based static code quality analysis
- Log-normalized popularity scoring
- Repository complexity evaluation
- Weighted overall performance score calculation
- Persistent storage of analyzed repositories
- Authenticated GitHub API integration to handle rate limits
- Cloud-based deployment architecture

---

## Code Quality Analysis (ESLint Integration)

DevInsight integrates ESLint to perform static analysis of repository code. ESLint evaluates JavaScript files against standardized rules to detect:

- Syntax errors
- Unused variables
- Potential runtime issues
- Code style inconsistencies
- Best practice violations

The linting results are processed to compute a Code Quality Score, which contributes significantly to the overall repository evaluation.

By combining static analysis with repository activity metrics, DevInsight provides a more balanced assessment of both popularity and maintainability.

---

## Scoring Methodology

### Popularity Score

Popularity is computed using logarithmic normalization of:

- Stars (50% weight)
- Forks (30% weight)
- Commits (20% weight)

Log scaling ensures that extremely large repositories do not disproportionately dominate the scoring model.

### Overall Repository Score

The final repository score is calculated using a weighted combination of:

0.5 × Code Quality Score  
+ 0.3 × Popularity Score  
+ 0.2 × Complexity Score  

This balanced approach ensures that both activity and maintainability are considered.

---

## System Architecture

User  
→ Frontend Application (React + Vite)  
→ Backend API (Node.js + Express)  
→ GitHub REST API (Authenticated Requests)  
→ ESLint Static Analysis Engine  
→ MongoDB Atlas (Cloud Database)  

The backend acts as a processing layer that aggregates GitHub data, performs static analysis, computes analytics, and stores structured results.

---

## Technology Stack

### Frontend
- React (Vite)
- Modern JavaScript (ES6+)
- Fetch API
- CSS

### Backend
- Node.js
- Express.js
- Axios
- Mongoose
- ESLint (Static Code Analysis)

### Database
- MongoDB Atlas (Cloud-hosted NoSQL database)

### Deployment
- Render (Backend Web Service + Frontend Static Site)

### External Integration
- GitHub REST API (Authenticated via Personal Access Token)

---

## Engineering Highlights

- Static code analysis integration using ESLint
- Production deployment on a Linux-based cloud environment
- Case-sensitive module resolution debugging
- Secure environment variable management
- GitHub API rate limit handling using authentication
- Logarithmic data normalization for fair scoring
- Separation of concerns between frontend, backend, and data layer
- Cloud database connectivity and persistence

---

## Conclusion

DevInsight demonstrates a complete full-stack analytical system integrating external APIs, static code analysis, cloud infrastructure, database persistence, and algorithmic scoring techniques. The project reflects practical engineering considerations including API authentication, rate limit handling, production debugging, and deployment configuration.
