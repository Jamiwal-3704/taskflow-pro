import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Suspense, lazy } from 'react';

// Lazy-loaded routes
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const OnboardingWizard = lazy(() => import('./pages/Onboarding/OnboardingWizard'));
const DashboardLayout = lazy(() => import('./pages/Dashboard/DashboardLayout'));
const TodayView = lazy(() => import('./pages/Today/TodayView').then(module => ({ default: module.TodayView })));
const DayWiseView = lazy(() => import('./pages/DayWise/DayWiseView').then(module => ({ default: module.DayWiseView })));
const ImportantView = lazy(() => import('./pages/Important/ImportantView').then(module => ({ default: module.ImportantView })));
const GuideView = lazy(() => import('./pages/Guide/GuideView').then(module => ({ default: module.GuideView })));
const ListPage = lazy(() => import('./pages/List/ListPage').then(module => ({ default: module.ListPage })));

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
          <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
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
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
