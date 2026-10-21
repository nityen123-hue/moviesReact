import React, { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Compass, Flame } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchPopularMovies, fetchTrendingMovies } from '../redux/slices/moviesSlice';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Movies = ({ isTrending: propIsTrending }) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const isTrending = propIsTrending || location.pathname.includes('/trending');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const currentPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const { popular, trending } = useAppSelector((state) => state.movies);
  const currentData = isTrending ? trending : popular;

  useEffect(() => {
    if (isTrending) {
      dispatch(fetchTrendingMovies({ timeWindow: 'week', page: currentPage }));
    } else {
      dispatch(fetchPopularMovies(currentPage));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dispatch, isTrending, currentPage]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
  };

  const title = isTrending ? 'Trending Movies' : 'Popular Movies';
  const subtitle = isTrending
    ? 'The hottest movies being watched and discussed globally right now'
    : 'Discover the most popular movies rated and watched by the community';

  return (
    <div className="container py-4">
      <div className="mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <h1 className="h3 fw-bold text-white d-flex align-items-center gap-2 mb-2">
          {isTrending ? (
            <Flame className="text-danger" size={26} />
          ) : (
            <Compass className="text-danger" size={26} />
          )}
          {title}
        </h1>
        <p className="text-white mb-0">{subtitle}</p>
      </div>

      {currentData.error && (
        <ErrorMessage
          message={currentData.error}
          onRetry={() => {
            if (isTrending) {
              dispatch(fetchTrendingMovies({ timeWindow: 'week', page: currentPage }));
            } else {
              dispatch(fetchPopularMovies(currentPage));
            }
          }}
        />
      )}

      {currentData.loading ? (
        <LoadingSpinner asSkeleton count={18} />
      ) : (
        <>
          <MovieGrid
            movies={currentData.items}
            emptyMessage={`No ${isTrending ? 'trending' : 'popular'} movies found.`}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={currentData.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Movies;
