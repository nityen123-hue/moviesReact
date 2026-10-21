import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Heart,
  Bookmark,
  DollarSign,
  Globe,
  Film,
  Building,
  User,
  Play,
  X,
} from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  fetchMovieDetails,
  fetchMovieCredits,
  clearSelectedMovie,
} from '../redux/slices/moviesSlice';
import { toggleFavorite, selectIsFavorite } from '../redux/slices/favoritesSlice';
import { toggleWatchlist, selectIsInWatchlist } from '../redux/slices/watchlistSlice';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import {
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
} from '../utils/constants';

const MovieDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [activeTrailerKey, setActiveTrailerKey] = useState(null);

  const { selectedMovie } = useAppSelector((state) => state.movies);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const movie = selectedMovie.data;
  const credits = selectedMovie.credits;
  const loading = selectedMovie.loading;
  const error = selectedMovie.error;

  const isFav = useAppSelector((state) => selectIsFavorite(state, movie?.id));
  const isWatch = useAppSelector((state) => selectIsInWatchlist(state, movie?.id));

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieDetails(id));
      dispatch(fetchMovieCredits(id));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return () => {
      dispatch(clearSelectedMovie());
    };
  }, [dispatch, id]);

  const handleFavoriteToggle = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    if (movie) {
      dispatch(toggleFavorite(movie));
    }
  };

  const handleWatchlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    if (movie) {
      dispatch(toggleWatchlist(movie));
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return null;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const formatCurrency = (amount) => {
    if (!amount || amount <= 0) return 'Not Disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="skeleton mb-4" style={{ height: '360px', borderRadius: '16px' }} />
        <div className="row g-4">
          <div className="col-md-4">
            <div className="skeleton" style={{ height: '450px', borderRadius: '12px' }} />
          </div>
          <div className="col-md-8">
            <div className="skeleton mb-3" style={{ height: '40px', width: '60%' }} />
            <div className="skeleton mb-3" style={{ height: '24px', width: '40%' }} />
            <div className="skeleton mb-4" style={{ height: '120px' }} />
            <div className="skeleton" style={{ height: '60px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <button onClick={() => navigate(-1)} className="btn btn-nav-outline mb-4 d-inline-flex align-items-center gap-2">
          <ArrowLeft size={16} /> Back
        </button>
        <ErrorMessage
          message={error}
          onRetry={() => {
            dispatch(fetchMovieDetails(id));
            dispatch(fetchMovieCredits(id));
          }}
        />
      </div>
    );
  }

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path ? getBackdropUrl(movie.backdrop_path, 'original') : null;
  const posterUrl = movie.poster_path ? getPosterUrl(movie.poster_path, 'w500') : null;

  const trailer = movie.videos?.results?.find(
    (v) => (v.type === 'Trailer' || v.type === 'Teaser') && v.site === 'YouTube'
  );

  const castList = credits?.cast?.slice(0, 12) || [];
  const director = credits?.crew?.find((c) => c.job === 'Director')?.name;

  return (
    <div className="movie-details-page">
      <div
        className="details-hero"
        style={{
          backgroundImage: backdropUrl
            ? `url(${backdropUrl})`
            : 'linear-gradient(135deg, #181C26, #0B0D12)',
        }}
      >
        <div className="details-overlay" />
        <div className="container details-content-wrapper">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-nav-outline mb-4 d-inline-flex align-items-center gap-2"
          >
            <ArrowLeft size={15} /> Back to Movies
          </button>

          <div className="row g-4 align-items-start">
            <div className="col-lg-4 col-md-5 text-center text-md-start">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="details-poster img-fluid"
                />
              ) : (
                <div className="details-poster poster-fallback d-flex flex-column align-items-center justify-content-center p-4">
                  <Film size={54} className="mb-2" />
                  <span>No Poster Available</span>
                </div>
              )}
            </div>

            <div className="col-lg-8 col-md-7">
              <h1 className="details-title">{movie.title}</h1>
              {movie.tagline && <p className="details-tagline">"{movie.tagline}"</p>}

              <div className="details-meta-row">
                {movie.vote_average > 0 && (
                  <span className="d-flex align-items-center gap-1 text-warning fw-bold">
                    <Star size={18} fill="#FFC107" stroke="#FFC107" />
                    {movie.vote_average.toFixed(1)}
                    <span className="text-white fw-normal small">
                      ({movie.vote_count?.toLocaleString()} votes)
                    </span>
                  </span>
                )}

                {movie.release_date && (
                  <span className="d-flex align-items-center gap-1 text-white">
                    <Calendar size={16} />
                    {movie.release_date}
                  </span>
                )}

                {movie.runtime > 0 && (
                  <span className="d-flex align-items-center gap-1 text-white">
                    <Clock size={16} />
                    {formatRuntime(movie.runtime)}
                  </span>
                )}

                {movie.original_language && (
                  <span className="meta-badge text-uppercase font-monospace small">
                    {movie.original_language}
                  </span>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-4">
                  {movie.genres.map((g) => (
                    <span key={g.id} className="genre-pill">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <h5 className="text-white fw-bold mb-2">Overview</h5>
                <p className="text-white leading-relaxed" style={{ fontSize: '1.02rem' }}>
                  {movie.overview || 'No overview has been added for this movie.'}
                </p>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
                <button
                  type="button"
                  className={`btn ${isFav ? 'btn-nav-primary' : 'btn-nav-outline'} d-inline-flex align-items-center gap-2 px-3 py-2`}
                  onClick={handleFavoriteToggle}
                >
                  <Heart size={18} fill={isFav ? '#FFFFFF' : 'none'} />
                  {isFav ? 'In Favorites' : 'Add to Favorites'}
                </button>

                <button
                  type="button"
                  className={`btn ${isWatch ? 'btn-primary' : 'btn-nav-outline'} d-inline-flex align-items-center gap-2 px-3 py-2`}
                  onClick={handleWatchlistToggle}
                >
                  <Bookmark size={18} fill={isWatch ? '#FFFFFF' : 'none'} />
                  {isWatch ? 'In Watchlist' : 'Add to Watchlist'}
                </button>

                {trailer && (
                  <button
                    type="button"
                    className="btn btn-outline-warning d-inline-flex align-items-center gap-2 px-3 py-2"
                    onClick={() => setActiveTrailerKey(trailer.key)}
                  >
                    <Play size={18} /> Watch Trailer
                  </button>
                )}
              </div>

              <div
                className="p-3 rounded mb-4"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
              >
                <div className="row g-3 text-white small">
                  {director && (
                    <div className="col-sm-6 col-md-4">
                      <span className="d-block text-white opacity-75">Director</span>
                      <strong className="text-white">{director}</strong>
                    </div>
                  )}
                  {movie.status && (
                    <div className="col-sm-6 col-md-4">
                      <span className="d-block text-white opacity-75">Status</span>
                      <strong className="text-white">{movie.status}</strong>
                    </div>
                  )}
                  {movie.budget > 0 && (
                    <div className="col-sm-6 col-md-4">
                      <span className="d-block text-white opacity-75">Budget</span>
                      <strong className="text-white">{formatCurrency(movie.budget)}</strong>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div className="col-sm-6 col-md-4">
                      <span className="d-block text-white opacity-75">Box Office Revenue</span>
                      <strong className="text-white">{formatCurrency(movie.revenue)}</strong>
                    </div>
                  )}
                  {movie.production_companies && movie.production_companies.length > 0 && (
                    <div className="col-12">
                      <span className="d-block text-white opacity-75 mb-1">Production Companies</span>
                      <span className="text-white">
                        {movie.production_companies.map((c) => c.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        {castList.length > 0 && (
          <section className="mb-5">
            <h3 className="h4 fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <User size={22} className="text-danger" /> Top Cast Members
            </h3>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-6 g-3">
              {castList.map((actor) => {
                const profileImg = actor.profile_path
                  ? getProfileUrl(actor.profile_path)
                  : null;
                return (
                  <div key={actor.id} className="col">
                    <div className="cast-card h-100">
                      {profileImg ? (
                        <img
                          src={profileImg}
                          alt={actor.name}
                          className="cast-img"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center bg-dark text-white"
                          style={{ aspectRatio: '1/1' }}
                        >
                          <User size={32} />
                        </div>
                      )}
                      <div className="cast-info">
                        <div className="cast-name" title={actor.name}>
                          {actor.name}
                        </div>
                        <div className="cast-character" title={actor.character}>
                          {actor.character || 'Role'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {movie.similar?.results && movie.similar.results.length > 0 && (
          <section className="mb-4">
            <h3 className="h4 fw-bold text-white mb-3 d-flex align-items-center gap-2">
              <Film size={22} className="text-danger" /> You Might Also Like
            </h3>
            <div className="movies-grid-container">
              {movie.similar.results.slice(0, 6).map((m) => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          </section>
        )}
      </div>

      {activeTrailerKey && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 1060 }}
          tabIndex="-1"
          role="dialog"
          onClick={() => setActiveTrailerKey(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark border border-secondary">
              <div className="modal-header border-bottom border-secondary border-opacity-25 py-2">
                <h5 className="modal-title text-white small fw-bold">Official Trailer</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setActiveTrailerKey(null)}
                  aria-label="Close"
                />
              </div>
              <div className="modal-body p-0 ratio ratio-16x9">
                <iframe
                  src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1`}
                  title="Movie Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
