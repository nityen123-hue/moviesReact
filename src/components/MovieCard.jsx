import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Bookmark, Film } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { toggleFavorite, selectIsFavorite } from '../redux/slices/favoritesSlice';
import { toggleWatchlist, selectIsInWatchlist } from '../redux/slices/watchlistSlice';
import { getPosterUrl } from '../utils/constants';

const MovieCard = ({ movie }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const isFav = useAppSelector((state) => selectIsFavorite(state, movie?.id));
  const isWatch = useAppSelector((state) => selectIsInWatchlist(state, movie?.id));

  if (!movie) return null;

  const posterUrl = !imgError && movie.poster_path ? getPosterUrl(movie.poster_path) : null;
  const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    dispatch(toggleFavorite(movie));
  };

  const handleWatchlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    dispatch(toggleWatchlist(movie));
  };

  return (
    <div className="movie-card">
      <Link to={`/movie/${movie.id}`} className="text-decoration-none">
        <div className="movie-poster-wrapper">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title || 'Movie'} Poster`}
              className="movie-poster-img"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="poster-fallback">
              <Film size={36} />
              <span>{movie.title || 'No Poster'}</span>
            </div>
          )}

          <div className="rating-pill" title={`TMDB Rating: ${rating}/10`}>
            <Star size={12} fill="#FFC107" stroke="#FFC107" />
            <span>{rating}</span>
          </div>

          <div className="card-overlay-actions">
            <button
              type="button"
              className={`action-icon-btn ${isFav ? 'active-favorite' : ''}`}
              onClick={handleFavoriteClick}
              title={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
              aria-label={isFav ? 'Remove from Favorites' : 'Add to Favorites'}
            >
              <Heart size={15} fill={isFav ? '#FFFFFF' : 'none'} />
            </button>
            <button
              type="button"
              className={`action-icon-btn ${isWatch ? 'active-watchlist' : ''}`}
              onClick={handleWatchlistClick}
              title={isWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label={isWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Bookmark size={15} fill={isWatch ? '#FFFFFF' : 'none'} />
            </button>
          </div>
        </div>

        <div className="movie-card-body">
          <h3 className="movie-card-title" title={movie.title}>
            {movie.title}
          </h3>
          <div className="movie-card-info">
            <span>{releaseYear}</span>
            <span className="badge bg-dark border border-secondary text-white font-monospace" style={{ fontSize: '0.72rem' }}>
              Movie
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
