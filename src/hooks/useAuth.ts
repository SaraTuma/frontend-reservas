import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

interface UseAuthRedirectOptions {
  requireAuth?: boolean; // se true, redireciona p/ login se não estiver logado
}

export function useAuth({ requireAuth = false }: UseAuthRedirectOptions) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (requireAuth && !savedToken) {
      router.replace('/login');
    }

    if (!requireAuth && savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        router.replace('/dashboard');
    }
    
  }, [requireAuth, router]);

  const login = (token: string, userData: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logoutGoToLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.replace('/login');
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return { user, token, login, logout , logoutGoToLogin};
}