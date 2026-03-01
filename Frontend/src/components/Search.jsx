import React from 'react'

const Search = ({searchUrl, setSearchUrl, onSearch}) => {
    return (
    <div className='search'>
        <input 
          type="text"
          placeholder='Repo URL'
          value={searchUrl}
          onChange={(e) => setSearchUrl(e.target.value)}
        />
        <button onClick={onSearch}>Search</button>
    </div>
  )
}

export default Search