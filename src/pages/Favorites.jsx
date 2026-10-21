import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Trash2 } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import MovieGrid from '../components/MovieGrid';

const Favorites = () => {
  const { items, ids } = useAppSelector((state) => state.favorites);

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-25 gap-3">
        <div>
          <h1 className="h3 fw-bold text-white d-flex align-items-center gap-2 mb-1">
            <Heart className="text-danger" size={26} fill="#E50914" /> My Favorite Movies
          </h1>
          <p className="text-white small mb-0">
            {ids.length} {ids.length === 1 ? 'movie' : 'movies'} saved to your personal collection
          </p>
        </div>

        {ids.length > 0 && (
          <Link to="/movies" className="btn btn-sm btn-nav-outline d-inline-flex align-items-center gap-2">
            <Compass size={15} /> Discover More
          </Link>
        )}
      </div>

      <MovieGrid
        movies={items}
        emptyMessage="You haven't saved any movies to your favorites list yet. Explore popular movies and tap the heart icon on any poster to bookmark them here!"
        emptyAction={
          <Link to="/movies" className="btn btn-nav-primary d-inline-flex align-items-center gap-2">
            <Compass size={18} /> Browse Popular Movies
          </Link>
        }
      />
    </div>
  );
};

export default Favorites;
