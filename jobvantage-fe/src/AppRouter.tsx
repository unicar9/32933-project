import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Import your page components here
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { EditProfile } from './pages/EditProfile';
import { Recommendations } from './pages/Recommendations';

export const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </Router>
  );
};
