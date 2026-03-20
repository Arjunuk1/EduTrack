import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const FacultyDashboard = lazy(() => import('./components/Dashboard/FacultyDashboard'));
const StudentDashboard = lazy(() => import('./components/Dashboard/StudentDashboard'));
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './components/Common/NotificationSystem';
import { ToastProvider } from './components/Common/ToastNotification';
import './App.css';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <Login />} />
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/faculty/*" 
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student/*" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <ToastProvider>
              <Router>
                <div className="App">
                  <Suspense fallback={<div style={{padding:20}}>Loading...</div>}>
                    <AppRoutes />
                  </Suspense>
                </div>
              </Router>
            </ToastProvider>
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
