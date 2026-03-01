import React, {useState} from 'react';

const ComplexityCard = ({result}) => {
    const [open, setOpen] = useState(false);
    const {average, highestComplexityFiles} = result.complexity;
    const complexityScore = Math.round( 1 - average ) * 100;

    return (
        <div className="card">
            <div className="card-header">
                <h3>Complexity</h3>
                <button onClick={() => setOpen(!open)}>
                    {open ? 'Hide' : 'View'}
                </button>
            </div>

            <div className="metric">
                <span className="metric-label">Score</span>
                <span className="metric-value highlight">
                    {complexityScore}
                </span>
            </div>

            {open && (
                <div className="card-details">
                    <div className="metric">
                        <span className="metric-label">Complex File Ratio</span>
                        <span className="metric-value">{(average * 100).toFixed(1)}%</span>
                    </div>

                    <div className="metric">
                        <span className="metric-label">High Complexity Files</span>
                        <span className="metric-value">{highestComplexityFiles}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ComplexityCard;
