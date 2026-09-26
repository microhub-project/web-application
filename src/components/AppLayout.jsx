import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Sidebar from './Sidebar';

export default function AppLayout({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Faça login para acessar esta página', 'warning');
      navigate('/');
      return;
    }

    if (adminOnly && !isAdmin) {
      showToast('Acesso restrito para administradores', 'warning');
      navigate('/app');
    }
  }, [isAuthenticated, adminOnly, isAdmin, navigate, showToast]);

  if (!isAuthenticated) return null;
  if (adminOnly && !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-mono antialiased relative">
      <Sidebar />
      <main className="flex-1 ml-72 p-8 min-h-screen relative overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
