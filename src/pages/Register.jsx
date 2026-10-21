import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, AlertCircle, Film } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { register, clearAuthError } from '../redux/slices/authSlice';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const validate = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    }

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

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(register({ name, email, password }));
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-3">
            <Film size={32} />
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="text-white small mb-0">Join CineVault to personalize your movie collection</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label-custom">Full Name</label>
            <input
              type="text"
              className={`form-control form-control-custom ${
                validationErrors.name ? 'is-invalid border-danger' : ''
              }`}
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationErrors.name) setValidationErrors({ ...validationErrors, name: null });
              }}
              autoComplete="name"
            />
            {validationErrors.name && (
              <div className="text-danger small mt-1">{validationErrors.name}</div>
            )}
          </div>

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

          <div className="mb-3">
            <label className="form-label-custom">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-control form-control-custom ${
                  validationErrors.password ? 'is-invalid border-danger' : ''
                }`}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) setValidationErrors({ ...validationErrors, password: null });
                }}
                autoComplete="new-password"
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

          <div className="mb-4">
            <label className="form-label-custom">Confirm Password</label>
            <input
              type="password"
              className={`form-control form-control-custom ${
                validationErrors.confirmPassword ? 'is-invalid border-danger' : ''
              }`}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (validationErrors.confirmPassword) setValidationErrors({ ...validationErrors, confirmPassword: null });
              }}
              autoComplete="new-password"
            />
            {validationErrors.confirmPassword && (
              <div className="text-danger small mt-1">{validationErrors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-nav-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mb-3"
            disabled={loading}
          >
            <UserPlus size={18} /> {loading ? 'Registering...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center text-white small">
          Already have an account?{' '}
          <Link to="/login" className="text-danger fw-semibold">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
