// src/App.jsx - UPDATED WITH AUTHENTICATION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Login from './pages/Login';
import Dashboard from './components/Dashboard/Dashboard';
import WorkerManagement from './pages/WorkerManagement';
import Reports from './pages/Reports';
import AlertCenter from './pages/AlertCenter';

// Settings page (simple for now)
const Settings = () => (
  <div style={{ padding: '20px' }}>
    <h2>Settings</h2>
    <p>System settings and configuration</p>
  </div>
);

// Profile page
const Profile = () => (
  <div style={{ padding: '20px' }}>
    <h2>My Profile</h2>
    <p>User profile information</p>
  </div>
);

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: {
      main: '#f44336',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="reports" element={<Reports />} />
              <Route path="workers" element={<WorkerManagement />} />
              <Route path="alerts" element={<AlertCenter />} />
              <Route path="settings" element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Catch all route - redirect to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;