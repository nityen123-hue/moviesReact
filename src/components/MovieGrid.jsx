import React from 'react';
import MovieCard from './MovieCard';
import { Film } from 'lucide-react';

const MovieGrid = ({ movies = [], emptyMessage = 'No movies found.', emptyAction }) => {
  if (!movies || movies.length === 0) {
    return (
      <div className="empty-state-box">
        <div className="empty-icon">
          <Film size={48} />
        </div>
        <h4 className="text-white mb-2 fw-bold">Nothing to show</h4>
        <p className="text-white mb-4">{emptyMessage}</p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="movies-grid-container">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
