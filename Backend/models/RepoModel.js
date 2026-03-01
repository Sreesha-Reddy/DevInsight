const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RepoSchema = new Schema({
    repoName: {
        type: String,
        required: true
    },
    
    owner: {
        type: String,
        required: true
    },

    url: {
        type: String,
        required: true
    },

    metrics: {
        commits: Number,
        issues: Number,
        pullRequests: Number,
        forks: Number,
        stars: Number,
        popularityScore: Number
    },

    codeQuality: {
        lintErrors: Number,
        lintWarnings: Number,
        filesAnalyzed: Number,
        worstFile: String,
        codeQualityScore: Number,
    },

    linesOfCode: {
        total: Number,
        jsFiles: Number,
    },

    complexity: {
        average: Number,
        highComplexityFiles: Number,
    },

    overallScore: Number,

    lastAnalyzed: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Repo', RepoSchema);