import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
  value = '',
  onChange,
  onSubmit,
  onClear,
  placeholder = 'Search movies by title, actor, or genre...',
  autoFocus = false,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div className="search-bar-wrapper">
      <form onSubmit={handleSubmit} className="search-input-group">
        <span className="search-icon-left">
          <Search size={20} />
        </span>
        <input
          type="text"
          className="search-input-custom"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          aria-label="Search movies"
        />
        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear}
            aria-label="Clear search input"
            title="Clear"
          >
            <X size={18} />
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
