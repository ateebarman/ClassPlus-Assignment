import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import TemplatePage from './pages/TemplatePage';
import CustomEditorPage from './pages/CustomEditorPage';
import AuthCallback from './pages/AuthCallback';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center animated-bg">
      <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  
  // Strict onboarding check
  if (!user.onboardingComplete && !window.location.pathname.startsWith('/onboarding')) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="relative min-h-screen overflow-x-hidden mesh-bg">
          {/* Decorative Orbs */}
          <div className="premium-orb orb-1"></div>
          <div className="premium-orb orb-2"></div>

          <div className="relative z-10">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Private Routes */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/create" element={
                <ProtectedRoute>
                  <CustomEditorPage />
                </ProtectedRoute>
              } />
              
              <Route path="/template/:id" element={
                <ProtectedRoute>
                  <TemplatePage />
                </ProtectedRoute>
              } />

              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          
          <Toaster 
            position="bottom-center"
            toastOptions={{
              className: 'glass-strong text-white border-glass-border',
              duration: 3000,
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
