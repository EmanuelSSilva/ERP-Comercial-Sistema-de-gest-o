import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@erp:accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    authService.me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('@erp:accessToken');
        localStorage.removeItem('@erp:refreshToken');
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(payload) {
    const data = await authService.login(payload);
    localStorage.setItem('@erp:accessToken', data.accessToken);
    localStorage.setItem('@erp:refreshToken', data.refreshToken);
    setUser(data.user);
    return data;
  }

  async function logout() {
    const refreshToken = localStorage.getItem('@erp:refreshToken');
    if (refreshToken) await authService.logout(refreshToken).catch(() => null);
    localStorage.removeItem('@erp:accessToken');
    localStorage.removeItem('@erp:refreshToken');
    setUser(null);
  }

  function can(permission) {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    const map = {
      GERENTE: ['dashboard:read', 'customer:write', 'supplier:write', 'product:write', 'financial:write', 'inventory:read', 'inventory:write', 'purchase:write', 'sale:write', 'report:read'],
      VENDEDOR: ['customer:write', 'sale:write', 'inventory:read', 'dashboard:read'],
      ESTOQUISTA: ['inventory:read', 'inventory:write', 'product:write', 'purchase:write', 'dashboard:read'],
      FINANCEIRO: ['financial:write', 'cashflow:write', 'dashboard:read', 'report:read']
    };
    return map[user.role]?.includes(permission);
  }

  const value = useMemo(() => ({ user, loading, login, logout, can, isAuthenticated: Boolean(user) }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
