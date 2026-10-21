import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="container py-5 text-center" style={{ minHeight: '65vh' }}>
      <div className="empty-state-box mx-auto my-5">
        <div className="empty-icon text-danger">
          <Film size={64} />
        </div>
        <h1 className="display-4 fw-bold text-white mb-2">404</h1>
        <h2 className="h4 text-white mb-3">Page Not Found</h2>
        <p className="text-white mb-4" style={{ maxWidth: '420px', margin: '0 auto' }}>
          The scene you are looking for has been cut or does not exist. Let's get you back on track.
        </p>
        <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
          <Link to="/" className="btn btn-nav-primary d-inline-flex align-items-center gap-2">
            <Home size={16} /> Return to Home
          </Link>
          <Link to="/search" className="btn btn-nav-outline d-inline-flex align-items-center gap-2">
            <Search size={16} /> Search Catalog
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
