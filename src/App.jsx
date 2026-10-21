import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Movies from './pages/Movies';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import Watchlist from './pages/Watchlist';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

import './App.css';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies isTrending={false} />} />
          <Route path="/trending" element={<Movies isTrending={true} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <Watchlist />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
