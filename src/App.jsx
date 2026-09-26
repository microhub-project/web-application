import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import CompanyRegisterPage from './pages/CompanyRegisterPage';
import DashboardPage from './pages/DashboardPage';
import CodesPage from './pages/CodesPage';
import UsersPage from './pages/UsersPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />

            <Route path="/company-register" element={<CompanyRegisterPage />} />
            <Route path="/companyRegister" element={<CompanyRegisterPage />} />

            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/index.html" element={<DashboardPage />} />

            <Route path="/app/codes" element={<CodesPage />} />
            <Route path="/app/codes/index.html" element={<CodesPage />} />

            <Route path="/app/users" element={<UsersPage />} />
            <Route path="/app/users/index.html" element={<UsersPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}