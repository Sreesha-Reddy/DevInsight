import React, { useState } from 'react'
import Search from './components/Search';
import Popularity from './components/PopularityCard';
import CodeQuality from './components/CodeQualityCard';
import Complexity from './components/ComplexityCard';
import LOC from './components/LocCard';

const App = () => {
  const [searchUrl, setSearchUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (searchUrl === "") {
      setError('Enter URL');
      return
    }

    console.log('URL ', searchUrl);

    setIsLoading(true);
    setError('');
    setResult(null)

    try {
      const response = await fetch('https://devinsight-k5ej.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({repoUrl: searchUrl})
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.data);
    }
    catch(err) {
      setError(err.message);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <div>
        <header>
          <h1>DevInsight - Analyse Your Repositories Here</h1>
          <Search searchUrl={searchUrl} setSearchUrl={setSearchUrl} onSearch={handleSearch}/>
        </header>
        <div>
          {isLoading && <p className='status loading'>Analyzing...</p>}
          {error && <p className='status error'>{error}</p>}
          {result && (
            <div>
              <div className='results-header'>
                <h2>Results</h2>
                <p>
                  <span className="repo-name">{result.repoName}</span>
                  <span className="repo-owner">by {result.owner}</span>
                </p>
              </div>

             <div className="overall-score">
              <span className="overall-label">Overall Score</span>
              <span className="overall-value">{Math.round(result.overallScore)}</span>
            </div>
            
              <div className='cards'>
                <div className='card'><Popularity result={result}/></div>
                <div className='card'><CodeQuality result={result}/></div>
                <div className='card'><Complexity result={result}/></div>
                <div className='card'><LOC result={result}/></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default App