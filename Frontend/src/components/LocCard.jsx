import React, {useState} from "react";

const LocCard = ({result}) => {
    const [open, setOpen] = useState(false);
    const {total, jsFiles} = result.linesOfCode;
    const avgPerFile = jsFiles === 0 ? 0 : Math.round(total / jsFiles);

    return (
        <div className="card">
            <div className="card-header">
                <h3>Lines of Code</h3>
                <button onClick={() => setOpen(!open)}>
                    {open ? 'Hide' : 'View'}
                </button>
            </div>

            <div className="metric">
                <span className="metric-label">Total LOC</span>
                <span className="metric-value highlight">
                    {total.toLocaleString()}
                </span>
            </div>

            {open && (
                <div className="card-details">
                    <div className="metric">
                        <span className="metric-label">Total Number of Lines</span>
                        <span className="metric-value">{total.toLocaleString()}</span>
                    </div>

                    <div className="metric">
                        <span className="metric-label">JS Files Analyzed</span>
                        <span className="metric-value">{jsFiles}</span>
                    </div>

                    <div className="metric">
                        <span className="metric-label">Average LOC per JS File</span>
                        <span className="metric-value">{avgPerFile.toLocaleString()}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocCard;