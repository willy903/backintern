import { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser } from '../types/auth';
import { authService, AuthResponse } from '../services/authService';
import { apiService } from '../services/api';

interface AuthContextType {
  user: { id: string; email: string } | null;
  authUser: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const AUTH_STORAGE_KEY = 'auth_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Chargement initial (données stockées)
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      const token = apiService.getToken();

      if (storedUser && token) {
        try {
          const userData = JSON.parse(storedUser);
          setUser({ id: userData.id.toString(), email: userData.email });
          setAuthUser({
            profile: {
              firstName: userData.prenom,
              lastName: userData.nom,
              email: userData.email,
              userID: userData.id,
              avatar: `https://ui-avatars.com/api/?name=${userData.prenom}+${userData.nom}&background=random`,
            },
            role: userData.role,
          });
        } catch (error) {
          console.error('❌ Erreur de chargement utilisateur:', error);
          localStorage.removeItem(AUTH_STORAGE_KEY);
          apiService.setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // ✅ Connexion utilisateur
  const signIn = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await authService.login({ email, password });

      if (!response.user || !response.token) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const user = response.user;
      const token = response.token;

      const userAuth = {
        id: user.id.toString(),
        email: user.email,
      };

      setUser(userAuth);
      setAuthUser({
        profile: {
          firstName: user.prenom,
          lastName: user.nom,
          email: user.email,
          avatar: `https://ui-avatars.com/api/?name=${user.prenom}+${user.nom}&background=random`,
        },
        role: user.role,
      });

      // ✅ Sauvegarde en localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      apiService.setToken(token);
    } catch (error: any) {
      console.error("❌ Erreur de connexion:", error);
      throw new Error(error.message || "Impossible de se connecter au serveur");
    }
  };

  const signOut = async () => {
    setUser(null);
    setAuthUser(null);
    authService.logout();
    localStorage.removeItem(AUTH_STORAGE_KEY);
    apiService.setToken(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, authUser, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
