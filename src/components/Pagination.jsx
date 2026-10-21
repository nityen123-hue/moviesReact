import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const safeTotalPages = Math.min(totalPages, 500);

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= safeTotalPages; i++) {
      if (
        i === 1 ||
        i === safeTotalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav aria-label="Movie pages navigation" className="custom-pagination">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      {visiblePages.map((page, idx) => {
        if (page === '...') {
          return (
            <span key={`dots-${idx}`} className="px-2 text-white user-select-none">
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            className={`pagination-btn ${isCurrent ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= safeTotalPages}
        aria-label="Next Page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
