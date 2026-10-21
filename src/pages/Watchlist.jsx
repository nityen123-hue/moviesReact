import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Compass } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import MovieGrid from '../components/MovieGrid';

const Watchlist = () => {
  const { items, ids } = useAppSelector((state) => state.watchlist);

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-25 gap-3">
        <div>
          <h1 className="h3 fw-bold text-white d-flex align-items-center gap-2 mb-1">
            <Bookmark className="text-primary" size={26} fill="#3B82F6" /> My Watchlist
          </h1>
          <p className="text-white small mb-0">
            {ids.length} {ids.length === 1 ? 'title queued' : 'titles queued'} for your upcoming movie nights
          </p>
        </div>

        {ids.length > 0 && (
          <Link to="/movies" className="btn btn-sm btn-nav-outline d-inline-flex align-items-center gap-2">
            <Compass size={15} /> Find More Movies
          </Link>
        )}
      </div>

      <MovieGrid
        movies={items}
        emptyMessage="Your watchlist is currently empty. Tap the bookmark icon on any movie card or details page to queue titles you plan to watch."
        emptyAction={
          <Link to="/movies" className="btn btn-nav-primary d-inline-flex align-items-center gap-2">
            <Compass size={18} /> Explore Movies
          </Link>
        }
      />
    </div>
  );
};

export default Watchlist;
