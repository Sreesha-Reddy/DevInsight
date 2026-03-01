const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', 'coverage']);

function travDir(repoPath) {
    const repo = fs.readdirSync(repoPath);
    let jsFiles = [];

    for (const entry of repo) {
        const fullPath = path.join(repoPath, entry);
        const stat = fs.lstatSync(fullPath);

        if (stat.isDirectory()) {
            if (IGNORE_DIRS.has(entry)) continue;

            jsFiles = jsFiles.concat(travDir(fullPath));
        }

        else if (stat.isFile() && entry.endsWith('.js')) {
            jsFiles.push(fullPath);
        }
    }

    return jsFiles;
}

function countLOC(filePath) {
    try {
        const fileContents = fs.readFileSync(filePath, 'utf-8'); // code in string format
        const lines = fileContents.split('\n'); // converts to list of lines of code seperated

        let multiComment = false;
        let count = 0;

        for (let line of lines) {
            const trimmed = line.trim(); // to remove starting and ending spaces

            if (!trimmed) continue; // empty line

            if (multiComment) {
                if (trimmed.includes('*/')) {
                    multiComment = false;
                }
                continue;
            }

            if (trimmed.startsWith('//')) continue;

            if (trimmed.startsWith('/*')) {
                if (!trimmed.endsWith('*/')) {
                    multiComment = true;
                }
                continue;
            }

            count ++;
        }

        return count;
    }
    catch(err) {
        throw err;
    }
}

const locAnalysis = (repoPath) => {
    try {
        const jsFiles = travDir(repoPath);
        let total = 0;

        for (let file of jsFiles) {
            total += countLOC(file);
        }

        return {total, jsFiles: jsFiles.length}
    }
    catch(err) {
        throw err;
    }
}

module.exports = {locAnalysis};