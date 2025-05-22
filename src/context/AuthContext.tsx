
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from local storage)
    const storedUser = localStorage.getItem('parkingApp_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user data', error);
        localStorage.removeItem('parkingApp_user');
      }
    }
    setLoading(false);
  }, []);

  // Mock login function (replace with real authentication)
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data (replace with real auth)
      const userData: User = {
        id: '123',
        email,
        name: email.split('@')[0],
        profilePic: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
      };
      
      setUser(userData);
      localStorage.setItem('parkingApp_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Mock register function (replace with real implementation)
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data (replace with real auth)
      const userData: User = {
        id: '123',
        email,
        name,
        profilePic: `https://ui-avatars.com/api/?name=${name}&background=random`
      };
      
      setUser(userData);
      localStorage.setItem('parkingApp_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Registration failed', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setUser(null);
    localStorage.removeItem('parkingApp_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
