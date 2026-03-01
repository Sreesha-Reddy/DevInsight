import React, { useState } from 'react';

const PopularityCard = ({ result }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <div className="card-header">
        <h3>Popularity</h3>
        <button onClick={() => setOpen(!open)}>
          {open ? 'Hide' : 'View'}
        </button>
      </div>

      <div className="metric">
        <span className="metric-label">Score</span>
        <span className="metric-value highlight">
          {Math.round(result.metrics.popularityScore)}
        </span>
      </div>

      {open && (
        <div className="card-details">
          <div className="metric">
            <span className="metric-label">Stars</span>
            <span className="metric-value">{result.metrics.stars}</span>
          </div>

          <div className="metric">
            <span className="metric-label">Forks</span>
            <span className="metric-value">{result.metrics.forks}</span>
          </div>

          <div className="metric">
            <span className="metric-label">Commits</span>
            <span className="metric-value">{result.metrics.commits}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularityCard;
