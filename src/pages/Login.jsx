import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle, Film, Sparkles } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { login, clearAuthError } from '../redux/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(login({ email, password }));
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@cinevault.com');
    setPassword('Demo1234!');
    setValidationErrors({});
    dispatch(clearAuthError());
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-3">
            <Film size={32} />
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="text-white small mb-0">Sign in to sync your favorites and watchlist</p>
        </div>

        <div className="demo-credentials-box">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fw-semibold text-white d-flex align-items-center gap-1">
              <Sparkles size={14} className="text-warning" /> Demo Account
            </span>
            <button
              type="button"
              className="demo-btn-fill"
              onClick={handleFillDemo}
            >
              Fill Demo Login
            </button>
          </div>
          <div>demo@cinevault.com &bull; Demo1234!</div>
          <div className="text-white mt-1" style={{ fontSize: '0.72rem' }}>
            Note: Frontend educational authentication via localStorage.
          </div>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label-custom">Email Address</label>
            <input
              type="email"
              className={`form-control form-control-custom ${
                validationErrors.email ? 'is-invalid border-danger' : ''
              }`}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) setValidationErrors({ ...validationErrors, email: null });
              }}
              autoComplete="email"
            />
            {validationErrors.email && (
              <div className="text-danger small mt-1">{validationErrors.email}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label-custom">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control form-control-custom ${
                  validationErrors.password ? 'is-invalid border-danger' : ''
                }`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) setValidationErrors({ ...validationErrors, password: null });
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.password && (
              <div className="text-danger small mt-1">{validationErrors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-nav-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
            disabled={loading}
          >
            <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center text-white small">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-danger fw-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
