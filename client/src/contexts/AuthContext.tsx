import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'hadith-auth-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // In production, this would call your API endpoint
    // For now, we'll simulate an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (!email || !password) {
          reject(new Error('Email and password are required'));
          return;
        }

        // Mock successful login
        const mockUser: User = {
          id: 'user-' + Date.now(),
          name: email.split('@')[0],
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        setUser(mockUser);
        resolve();
      }, 1000); // Simulate network delay
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // In production, this would call your API endpoint
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (!name || !email || !password) {
          reject(new Error('All fields are required'));
          return;
        }

        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters'));
          return;
        }

        // Mock successful signup
        const mockUser: User = {
          id: 'user-' + Date.now(),
          name: name,
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        };

        setUser(mockUser);
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    // Clear other user-specific data if needed
    localStorage.removeItem('hadith-reading-progress');
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
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
