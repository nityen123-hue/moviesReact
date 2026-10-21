import React from 'react';

const LoadingSpinner = ({ text = 'Loading movies...', fullPage = false, count = 12, asSkeleton = false }) => {
  if (asSkeleton) {
    return (
      <div className="movies-grid-container">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton skeleton-poster" />
            <div className="p-3">
              <div className="skeleton skeleton-text w-75" />
              <div className="d-flex justify-content-between mt-2">
                <div className="skeleton skeleton-text w-25" />
                <div className="skeleton skeleton-text w-25" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const spinnerContent = (
    <div className="text-center py-5">
      <div
        className="spinner-border"
        style={{ width: '3rem', height: '3rem', color: 'var(--accent-primary)' }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-3 text-white">{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;
