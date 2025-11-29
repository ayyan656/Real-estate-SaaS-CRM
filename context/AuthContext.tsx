import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('estateflow_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email && password) {
          const mockUser: User = {
            id: '1',
            name: 'Demo User',
            email: email,
            avatar: `https://ui-avatars.com/api/?name=Demo+User&background=random&color=fff`
          };
          setUser(mockUser);
          localStorage.setItem('estateflow_user', JSON.stringify(mockUser));
          resolve();
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) {
           reject(new Error('Missing fields'));
           return;
        }
        const mockUser: User = {
          id: Date.now().toString(),
          name: name,
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`
        };
        setUser(mockUser);
        localStorage.setItem('estateflow_user', JSON.stringify(mockUser));
        resolve();
      }, 1000);
    });
  };

  const googleLogin = async () => {
    // Mock Google Login / Passport.js OAuth2 Flow
    // In a real application with Passport.js:
    // 1. Frontend redirects user to backend: window.location.href = 'http://api.yoursite.com/auth/google'
    // 2. Backend (Passport) redirects to Google Consent Screen
    // 3. User approves, Google redirects back to backend callback URL
    // 4. Backend processes user and redirects to Frontend with a token (e.g. ?token=xyz) or sets a cookie
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'google-123',
          name: 'Google User',
          email: 'user@gmail.com',
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c' // Generic google avatar placeholder
        };
        setUser(mockUser);
        localStorage.setItem('estateflow_user', JSON.stringify(mockUser));
        resolve();
      }, 1500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estateflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};