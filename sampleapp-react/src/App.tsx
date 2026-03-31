import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { GlobalLoader } from './components/GlobalLoader';
import { Header } from './components/Header';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { UsersPage } from './pages/UsersPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoadingDemoPage } from './pages/LoadingDemoPage';
import { GuardsDemoPage } from './pages/GuardsDemoPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ServerErrorPage } from './pages/ServerErrorPage';
import { setLoadingCallback } from './api/client';
import { useLoading } from './contexts/LoadingContext';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
});

const LoadingBridge = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoadingCallback(setLoading);
  }, [setLoading]);

  return null;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoadingProvider>
        <AuthProvider>
          <BrowserRouter>
            <LoadingBridge />
            <GlobalLoader message="Загрузка..." />
            <Header />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/loading-demo" element={<LoadingDemoPage />} />
              <Route path="/guards-demo" element={<GuardsDemoPage />} />

              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route path="/404" element={<NotFoundPage />} />
              <Route path="/500" element={<ServerErrorPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}

export default App;