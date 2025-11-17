import React from 'react';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute'; // Import ProtectedRoute

import DashboardOverview from './pages/DashboardOverview';
import Dashboard from './pages/Dashboard';
import MovieListPage from './pages/MovieListPage';
import HomePage from './pages/user/HomePage';
import MovieDetailPage from './pages/user/MovieDetailPage';
import UserLayout from './../src/components/common/layout/UserLayout';
import UserListPage from './pages/UserListPage';
import MovieGridPage from './pages/user/MovieGridPage';
import SearchPage from './pages/user/SearchPage';
import ProfilePage from './pages/user/ProfilePage';
import AuthPage from './pages/AuthPage';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="phim/:movieId" element={<MovieDetailPage />} />
            <Route path="phim/dang-chieu" element={<MovieGridPage />} />
            <Route path="phim/sap-chieu" element={<MovieGridPage />} />
            <Route path="tim-kiem" element={<SearchPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route 
                path="tai-khoan" // Đường dẫn khớp với Link trong Navbar
                element={
                    <ProtectedRoute> {/* Bọc nó trong ProtectedRoute */}
                        <ProfilePage />
                    </ProtectedRoute>
                } 
            />
          </Route>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Dashboard />
              </ProtectedRoute>
            }
          >
          <Route index element={<DashboardOverview />} /> 
          <Route path="movies" element={<MovieListPage />} />
          <Route path="users" element={<UserListPage />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;