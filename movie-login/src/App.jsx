import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute'; // Import ProtectedRoute

import DashboardOverview from './pages/DashboardOverview';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import RegisterPage from './pages/RegisterPage';
import MovieListPage from './pages/MovieListPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />}/>

          {/* Route Dashboard cha */}
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          >
            {/* Các route con sẽ được render bởi <Outlet /> */}
            <Route index element={<DashboardOverview />} /> 
            <Route path="movies" element={<MovieListPage />} />
            {/* Thêm các route khác cho schedules, users ở đây */}
            {/* <Route path="schedules" element={<SchedulePage />} /> */}
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;