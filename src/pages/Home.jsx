import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Flame, Compass, ChevronRight, Play, Info } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchGenres,
  fetchMoviesByGenre,
} from '../redux/slices/moviesSlice';
import MovieCard from '../components/MovieCard';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getBackdropUrl } from '../utils/constants';

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { trending, popular, genres, byGenre } = useAppSelector((state) => state.movies);
  const [selectedGenreId, setSelectedGenreId] = useState(null);

  useEffect(() => {
    if (trending.items.length === 0) {
      dispatch(fetchTrendingMovies({ timeWindow: 'week', page: 1 }));
    }
    if (popular.items.length === 0) {
      dispatch(fetchPopularMovies(1));
    }
    if (genres.items.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, trending.items.length, popular.items.length, genres.items.length]);

  const handleGenreSelect = (genreId) => {
    if (selectedGenreId === genreId) {
      setSelectedGenreId(null);
    } else {
      setSelectedGenreId(genreId);
      dispatch(fetchMoviesByGenre({ genreId, page: 1 }));
    }
  };

  const heroMovie = trending.items.find((m) => m.backdrop_path) || trending.items[0] || popular.items[0];
  const heroBackdrop = heroMovie ? getBackdropUrl(heroMovie.backdrop_path, 'original') : null;
  const heroYear = heroMovie?.release_date ? heroMovie.release_date.substring(0, 4) : '2025';
  const heroRating = heroMovie?.vote_average ? heroMovie.vote_average.toFixed(1) : '8.5';

  const anyError = trending.error || popular.error;

  return (
    <div className="home-page">
      {heroMovie ? (
        <section
          className="hero-section"
          style={{
            backgroundImage: heroBackdrop
              ? `url(${heroBackdrop})`
              : 'linear-gradient(135deg, #181C26, #0B0D12)',
          }}
        >
          <div className="hero-overlay" />
          <div className="hero-bottom-fade" />
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <Flame size={14} /> #1 Trending This Week
              </div>
              <h1 className="hero-title">{heroMovie.title}</h1>
              <div className="hero-meta">
                <span className="meta-rating">
                  <Star size={16} fill="#FFC107" stroke="#FFC107" />
                  {heroRating} Rating
                </span>
                <span>•</span>
                <span>{heroYear}</span>
                <span>•</span>
                <span className="badge bg-secondary bg-opacity-25 border border-secondary border-opacity-50 text-white">
                  Featured
                </span>
              </div>
              <p className="hero-overview">
                {heroMovie.overview ||
                  'Discover cinema at its finest. Stream reviews, explore detailed cast profiles, and track what you want to watch next.'}
              </p>
              <div className="hero-actions">
                <Link
                  to={`/movie/${heroMovie.id}`}
                  className="btn btn-nav-primary d-inline-flex align-items-center gap-2 px-4 py-2"
                >
                  <Play size={18} fill="#FFFFFF" /> View Details
                </Link>
                <Link
                  to="/movies"
                  className="btn btn-nav-outline d-inline-flex align-items-center gap-2 px-4 py-2"
                >
                  <Compass size={18} /> Explore Movies
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : trending.loading ? (
        <div className="container my-5">
          <div className="skeleton" style={{ height: '420px', borderRadius: '16px' }} />
        </div>
      ) : null}

      <div className="container">
        {anyError && (
          <ErrorMessage
            message={anyError}
            onRetry={() => {
              dispatch(fetchTrendingMovies({ timeWindow: 'week', page: 1 }));
              dispatch(fetchPopularMovies(1));
            }}
          />
        )}

        {genres.items && genres.items.length > 0 && (
          <section className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h3 className="h5 fw-bold text-white mb-0">Browse by Genre</h3>
              {selectedGenreId && (
                <button
                  className="btn btn-link btn-sm text-white text-decoration-none p-0"
                  onClick={() => setSelectedGenreId(null)}
                >
                  Reset Filter
                </button>
              )}
            </div>
            <div className="filter-pills-row">
              <button
                className={`filter-pill ${selectedGenreId === null ? 'active' : ''}`}
                onClick={() => setSelectedGenreId(null)}
              >
                All Genres
              </button>
              {genres.items.slice(0, 14).map((genre) => (
                <button
                  key={genre.id}
                  className={`filter-pill ${selectedGenreId === genre.id ? 'active' : ''}`}
                  onClick={() => handleGenreSelect(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedGenreId && (
          <section className="mb-5">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="h4 fw-bold text-white mb-0">
                {genres.items.find((g) => g.id === selectedGenreId)?.name || 'Genre'} Movies
              </h2>
            </div>
            {byGenre.loading ? (
              <LoadingSpinner asSkeleton count={6} />
            ) : (
              <MovieGrid movies={byGenre.items.slice(0, 12)} />
            )}
          </section>
        )}

        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="h4 fw-bold text-white mb-1 d-flex align-items-center gap-2">
                <Flame size={20} className="text-danger" /> Trending Movies
              </h2>
              <p className="text-white small mb-0">The most popular titles across the world this week</p>
            </div>
            <Link
              to="/trending"
              className="text-danger small fw-semibold text-decoration-none d-flex align-items-center gap-1 hover-underline"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {trending.loading && trending.items.length === 0 ? (
            <LoadingSpinner asSkeleton count={6} />
          ) : (
            <MovieGrid movies={trending.items.slice(0, 12)} />
          )}
        </section>

        <section className="mb-5">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2 className="h4 fw-bold text-white mb-1 d-flex align-items-center gap-2">
                <Compass size={20} className="text-danger" /> Popular Movies
              </h2>
              <p className="text-white small mb-0">Fan favorites with high community engagement</p>
            </div>
            <Link
              to="/movies"
              className="text-danger small fw-semibold text-decoration-none d-flex align-items-center gap-1 hover-underline"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {popular.loading && popular.items.length === 0 ? (
            <LoadingSpinner asSkeleton count={6} />
          ) : (
            <MovieGrid movies={popular.items.slice(0, 12)} />
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
