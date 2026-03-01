import React, { useState } from 'react';

const CodeQualityCard = ({ result }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Code Quality</h3>
        <button onClick={() => setOpen(!open)}>
          {open ? 'Hide' : 'View'}
        </button>
      </div>

      <div className="metric">
        <span className="metric-label">Score</span>
        <span className="metric-value highlight">
          {Math.round(result.codeQuality.codeQualityScore)}
        </span>
      </div>

      {open && (
        <div className="card-details">
          <div className="metric">
            <span className="metric-label">Lint Errors</span>
            <span className="metric-value">{result.codeQuality.lintErrors}</span>
          </div>

          <div className="metric">
            <span className="metric-label">Lint Warnings</span>
            <span className="metric-value">{result.codeQuality.lintWarnings}</span>
          </div>

          {/* <div className="metric">
            <span className="metric-label">Worst File</span>
            <span className="metric-value">{result.codeQuality.worstFile}</span>
          </div> */}

          <div className="metric">
            <span className="metric-label">Files Analyzed</span>
            <span className="metric-value">{result.codeQuality.filesAnalyzed}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeQualityCard;
