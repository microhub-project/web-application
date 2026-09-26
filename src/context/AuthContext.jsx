import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const userId = sessionStorage.getItem('USER_ID');
    if (!userId) return null;

    return {
      id: userId,
      name: sessionStorage.getItem('USER_NAME') || 'Usuário',
      email: sessionStorage.getItem('USER_EMAIL') || '',
      role: Number(sessionStorage.getItem('ROLE') || 0),
      companyId: sessionStorage.getItem('COMPANY_ID') || '',
      companyName: sessionStorage.getItem('COMPANY_NAME') || '',
    };
  });

  const login = (userData) => {
    sessionStorage.setItem('USER_ID', userData.id);
    sessionStorage.setItem('USER_NAME', userData.nome);
    sessionStorage.setItem('USER_EMAIL', userData.email);
    sessionStorage.setItem('ROLE', userData.cargo);
    sessionStorage.setItem('COMPANY_ID', userData.empresa_id);
    sessionStorage.setItem('COMPANY_NAME', userData.nome_fantasia || '');

    setUser({
      id: userData.id,
      name: userData.nome,
      email: userData.email,
      role: Number(userData.cargo),
      companyId: userData.empresa_id,
      companyName: userData.nome_fantasia || '',
    });
  };

  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    navigate('/');
  };

  const isAuthenticated = Boolean(user && user.id);
  const isAdmin = Boolean(user && Number(user.role) === 1);

  const getInitials = () => {
    if (!user || !user.name) return 'US';
    const parts = user.name.trim().toUpperCase().split(/\s+/);
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return user.name.slice(0, 2).toUpperCase();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        initials: getInitials(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
