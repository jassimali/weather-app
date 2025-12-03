import React from "react";

function CitySearch({
  searchQuery,
  onSearchChange,
  onSubmit,
  suggestions,
  onSelectSuggestion,
  loadingSuggestions,
}) {
  return (
    <div className="search-container">
      <form className="search-form" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Search city..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loadingSuggestions && <p className="info small">Searching cities...</p>}

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city, idx) => {
            const parts = [city.name];
            if (city.state) parts.push(city.state);
            if (city.country) parts.push(city.country);
            const label = parts.join(", ");

            return (
              <li
                key={`${city.lat}-${city.lon}-${idx}`}
                className="suggestion-item"
                onClick={() => onSelectSuggestion(city)}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CitySearch;
