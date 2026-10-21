import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Heart, Bookmark, Search, LogOut, Menu, X, Flame } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, isAuthenticated } = useAppSelector((state) => state.auth);
  const favoriteCount = useAppSelector((state) => state.favorites.ids.length);
  const watchlistCount = useAppSelector((state) => state.watchlist.ids.length);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className={`navbar navbar-expand-lg sticky-top custom-navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="brand-logo me-4">
          <span className="brand-icon">
            <Film size={26} strokeWidth={2.4} />
          </span>
          <span>
            Cine<span className="brand-highlight">Vault</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 text-white p-1"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/movies"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                Movies
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/trending"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <Flame size={16} className="text-danger" />
                Trending
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/search"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <Search size={16} />
                Search
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/favorites"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <Heart size={16} />
                Favorites
                {favoriteCount > 0 && <span className="badge-count ms-1">{favoriteCount}</span>}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/watchlist"
                className={({ isActive }) => `nav-link-custom ${isActive ? 'active' : ''}`}
              >
                <Bookmark size={16} />
                Watchlist
                {watchlistCount > 0 && <span className="badge-count ms-1">{watchlistCount}</span>}
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="dropdown position-relative">
                <button
                  className="btn btn-nav-outline d-flex align-items-center gap-2 dropdown-toggle"
                  type="button"
                  id="userDropdown"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  aria-expanded={isUserDropdownOpen}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center bg-danger text-white fw-bold"
                    style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}
                  >
                    {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="d-none d-md-inline small fw-semibold text-white">
                    {currentUser?.name || 'Account'}
                  </span>
                </button>

                <ul
                  className={`dropdown-menu dropdown-menu-dark dropdown-menu-end shadow ${
                    isUserDropdownOpen ? 'show' : ''
                  }`}
                  style={{ minWidth: '200px' }}
                >
                  <li className="px-3 py-2 border-bottom border-secondary border-opacity-25">
                    <div className="fw-semibold text-white small">{currentUser?.name}</div>
                    <div className="text-white small text-truncate">{currentUser?.email}</div>
                  </li>
                  <li>
                    <Link to="/favorites" className="dropdown-item py-2 d-flex align-items-center gap-2 small text-white">
                      <Heart size={15} /> My Favorites ({favoriteCount})
                    </Link>
                  </li>
                  <li>
                    <Link to="/watchlist" className="dropdown-item py-2 d-flex align-items-center gap-2 small text-white">
                      <Bookmark size={15} /> My Watchlist ({watchlistCount})
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-1" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item py-2 text-danger d-flex align-items-center gap-2 small"
                      onClick={handleLogout}
                    >
                      <LogOut size={15} /> Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-sm btn-nav-outline text-center text-white">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-sm btn-nav-primary text-center text-white">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
