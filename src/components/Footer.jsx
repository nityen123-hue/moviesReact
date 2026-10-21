import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { APP_NAME } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="container">
        <div className="row gy-4 mb-4">
          <div className="col-lg-4 col-md-6">
            <Link to="/" className="brand-logo mb-3">
              <span className="brand-icon">
                <Film size={24} />
              </span>
              <span>
                Cine<span className="brand-highlight">Vault</span>
              </span>
            </Link>
            <p className="text-white opacity-90 small mt-2" style={{ maxWidth: '340px' }}>
              Your ultimate cinematic portal to discover trending movies, explore detailed cast profiles,
              curate custom watchlists, and organize your favorite titles.
            </p>
          </div>

          <div className="col-lg-2 col-6">
            <h6 className="text-white fw-bold mb-3 small text-uppercase letter-spacing-1">Navigation</h6>
            <ul className="list-unstyled mb-0">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/movies" className="footer-link">Popular Movies</Link></li>
              <li><Link to="/trending" className="footer-link">Trending Now</Link></li>
              <li><Link to="/search" className="footer-link">Search Catalog</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-6">
            <h6 className="text-white fw-bold mb-3 small text-uppercase letter-spacing-1">My Library</h6>
            <ul className="list-unstyled mb-0">
              <li><Link to="/favorites" className="footer-link">Favorite Movies</Link></li>
              <li><Link to="/watchlist" className="footer-link">Saved Watchlist</Link></li>
              <li><Link to="/login" className="footer-link">Account Sign In</Link></li>
              <li><Link to="/register" className="footer-link">Create Account</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h6 className="text-white fw-bold mb-3 small text-uppercase letter-spacing-1">Data Source</h6>
            <p className="text-white opacity-90 small mb-2">
              This application uses the <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-danger fw-semibold">TMDB API</a> but is not endorsed or certified by TMDB.
            </p>
            <div className="d-flex align-items-center gap-2 mt-3">
              <span className="badge bg-dark border border-secondary text-white py-2 px-3 small">
                React 18 + Redux Toolkit
              </span>
              <span className="badge bg-dark border border-secondary text-white py-2 px-3 small">
                Bootstrap 5
              </span>
            </div>
          </div>
        </div>

        <div className="border-top border-secondary border-opacity-25 pt-4 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-2 text-white opacity-90 small">
          <div>
            &copy; {new Date().getFullYear()} {APP_NAME}. Crafted with precision for movie lovers everywhere.
          </div>
          <div className="d-flex align-items-center gap-1 text-white">
            Built with React &amp; Redux Toolkit
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
