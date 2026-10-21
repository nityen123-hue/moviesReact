import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Film, Sparkles } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { searchMovies, clearSearchResults } from '../redux/slices/moviesSlice';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Search = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get('q') || '';
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageFromUrl) || pageFromUrl < 1 ? 1 : pageFromUrl;

  const [searchTerm, setSearchTerm] = useState(queryFromUrl);
  const debounceTimerRef = useRef(null);

  const { search } = useAppSelector((state) => state.movies);

  useEffect(() => {
    setSearchTerm(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    if (queryFromUrl.trim()) {
      dispatch(searchMovies({ query: queryFromUrl.trim(), page: currentPage }));
    } else {
      dispatch(clearSearchResults());
    }
  }, [dispatch, queryFromUrl, currentPage]);

  const handleInputChange = (newVal) => {
    setSearchTerm(newVal);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (newVal.trim()) {
        setSearchParams({ q: newVal.trim(), page: '1' });
      } else {
        setSearchParams({});
      }
    }, 500);
  };

  const handleSubmit = (val) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (val.trim()) {
      setSearchParams({ q: val.trim(), page: '1' });
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchParams({});
    dispatch(clearSearchResults());
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ q: queryFromUrl, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickSuggestions = ['Oppenheimer', 'Interstellar', 'Dune', 'The Dark Knight', 'Gladiator'];

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <h1 className="h3 fw-bold text-white mb-2">Search Movie Database</h1>
        <p className="text-white">
          Find movies by title, explore ratings, and discover new titles from TMDB
        </p>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        onClear={handleClear}
        autoFocus
      />

      {!queryFromUrl && (
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2 text-white small">
            <Sparkles size={14} className="text-warning" />
            <span>Popular searches to try:</span>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            {quickSuggestions.map((title) => (
              <button
                key={title}
                className="btn btn-sm btn-nav-outline rounded-pill px-3 py-1 text-white"
                style={{ fontSize: '0.82rem' }}
                onClick={() => {
                  setSearchTerm(title);
                  setSearchParams({ q: title, page: '1' });
                }}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      )}

      {queryFromUrl && (
        <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-25">
          <div>
            <h2 className="h5 fw-bold text-white mb-1">
              Results for <span className="text-danger">"{queryFromUrl}"</span>
            </h2>
            <p className="text-white small mb-0">
              {search.totalResults > 0
                ? `Found ${search.totalResults.toLocaleString()} titles`
                : 'Searching across TMDB records'}
            </p>
          </div>
        </div>
      )}

      {search.error && (
        <ErrorMessage
          message={search.error}
          onRetry={() => {
            if (queryFromUrl.trim()) {
              dispatch(searchMovies({ query: queryFromUrl.trim(), page: currentPage }));
            }
          }}
        />
      )}

      {search.loading ? (
        <LoadingSpinner asSkeleton count={12} />
      ) : queryFromUrl && search.results.length === 0 && !search.error ? (
        <div className="empty-state-box">
          <div className="empty-icon">
            <SearchIcon size={48} />
          </div>
          <h4 className="text-white mb-2 fw-bold">No movies found</h4>
          <p className="text-white mb-3">
            We couldn't find any movies matching "{queryFromUrl}".
          </p>
          <p className="text-white small">
            Suggestions: Check for spelling errors, try alternative titles, or search by a general keyword.
          </p>
        </div>
      ) : (
        <>
          <MovieGrid movies={search.results} />

          {search.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={search.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {!queryFromUrl && (
        <div className="empty-state-box my-4">
          <div className="empty-icon text-white">
            <Film size={44} />
          </div>
          <h5 className="text-white mb-2 fw-bold">Your Next Movie Awaits</h5>
          <p className="text-white small mb-0">
            Type any movie title in the search box above to browse real-time ratings, release dates, and posters.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;
