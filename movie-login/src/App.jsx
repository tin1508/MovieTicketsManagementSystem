import React from 'react';
import { BrowserRouter, Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute'; // Import ProtectedRoute

import DashboardOverview from './pages/DashboardOverview';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import MovieListPage from './pages/MovieListPage';
import HomePage from './pages/user/HomePage';
import MovieDetailPage from './pages/user/MovieDetailPage';
import UserLayout from './../src/components/common/layout/UserLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          {/* === KHU VỰC USER (LAYOUT CÔNG KHAI) === */}
          {/* Tất cả các path này sẽ có chung Navbar/Footer của UserLayout */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<HomePage />} />
            <Route path="phim/:movieId" element={<MovieDetailPage />} />
            {/* Ví dụ: Thêm trang /dat-ve sau này */}
            {/* <Route path="dat-ve/:showtimeId" element={<BookingPage />} /> */}
          </Route>

          {/* === KHU VỰC AUTH (ĐĂNG NHẬP/ĐĂNG KÝ) === */}
          {/* Các trang này không có Layout chung */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* === KHU VỰC ADMIN (LAYOUT DASHBOARD) === */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} /> 
            <Route path="movies" element={<MovieListPage />} />
            {/* <Route path="schedules" element={<SchedulePage />} /> */}
          </Route>

          {/* TODO: Thêm Route 404 Not Found */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;