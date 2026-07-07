import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import OnboardingWizard from './pages/Onboarding/OnboardingWizard';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import TodayView from './pages/Today/TodayView';
import DayWiseView from './pages/DayWise/DayWiseView';
import ImportantView from './pages/Important/ImportantView';
import GuideView from './pages/Guide/GuideView';
import ListPage from './pages/List/ListPage';

// Private Route Guard Component
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-400">Restoring session...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/onboarding"
              element={
                <PrivateRoute>
                  <OnboardingWizard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="today" replace />} />
              <Route path="today" element={<TodayView />} />
              <Route path="daywise" element={<DayWiseView />} />
              <Route path="important" element={<ImportantView />} />
              <Route path="guide" element={<GuideView />} />
              <Route path="list/:listId" element={<ListPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
