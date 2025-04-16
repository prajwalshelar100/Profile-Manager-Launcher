
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

type User = {
  id: string;
  email: string;
  name: string;
  isGuest: boolean;
  profilePic?: string;
  authProvider?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage with a slight delay to ensure login page is shown first
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Small delay to ensure login page is shown first
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simple simulated authentication, in a real app this would be an API call
      // This is just for demo purposes
      const mockUser = {
        id: uuidv4(),
        email,
        name: email.split('@')[0],
        isGuest: false,
        authProvider: 'email'
      };
      
      // In a real app, validate credentials server-side
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error("Failed to login. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simple simulated registration, in a real app this would be an API call
      const newUser = {
        id: uuidv4(),
        email,
        name,
        isGuest: false,
        authProvider: 'email'
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast.success("Account created successfully!");
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Simulate Google login
      // In a real app, this would use Google OAuth API
      const mockGoogleUser = {
        id: `google-${uuidv4()}`,
        email: `user.${Math.floor(Math.random() * 1000)}@gmail.com`,
        name: `Google User ${Math.floor(Math.random() * 1000)}`,
        isGuest: false,
        profilePic: "https://lh3.googleusercontent.com/a/default-user",
        authProvider: 'google'
      };
      
      setUser(mockGoogleUser);
      localStorage.setItem('user', JSON.stringify(mockGoogleUser));
      toast.success("Logged in with Google successfully!");
    } catch (error) {
      toast.error("Failed to login with Google. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsGuest = () => {
    const guestUser = {
      id: `guest-${uuidv4()}`,
      email: 'guest@example.com',
      name: 'Guest User',
      isGuest: true,
      authProvider: 'guest'
    };
    
    setUser(guestUser);
    localStorage.setItem('user', JSON.stringify(guestUser));
    toast.success("Logged in as guest. Your data will not be saved after you leave.");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('profiles');
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signUp, loginWithGoogle, logout, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
};
