import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { useToast } from "../hooks/use-toast";
import { useLocation } from "wouter";

// Auth types
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Custom hook to access auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider Component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check if user is authenticated by querying the current user
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      if (!token) return null;
      
      try {
        const res = await fetch("/api/auth/user", {
          headers: {
            "x-auth-token": token,
          },
          credentials: "include",
        });
        
        if (!res.ok) {
          if (res.status === 401) {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            setToken(null);
            return null;
          }
          throw new Error("Failed to fetch user");
        }
        
        return await res.json();
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    },
    enabled: !!token,
    retry: false,
  });

  // Set user when data changes
  useEffect(() => {
    if (data) {
      setUser(data);
    } else {
      setUser(null);
    }
  }, [data]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        console.log("Attempting login with:", credentials.email);
        
        // Debug entire fetch process
        console.log("Making API request to /api/auth/login");
        const response = await apiRequest("POST", "auth/login", credentials);
        console.log("Login response received:", response);
        console.log("Login response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          console.error("Login error response:", errorData);
          throw new Error(errorData.message || "Invalid email or password");
        }
        
        const data = await response.json();
        console.log("Login successful for:", credentials.email, data);
        return data;
      } catch (error: any) {
        console.error("Login error:", error);
        throw new Error(error.message || "Login failed. Please try again.");
      }
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.name}!`,
      });
      // Redirect to dashboard based on user role
      const dashboardPath = data.user.role === 'admin' ? '/admin' : '/user';
      setLocation(dashboardPath);
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string }) => {
      try {
        console.log("Attempting registration for:", userData.email);
        
        // Debug entire fetch process
        console.log("Making API request to /api/auth/register");
        const response = await apiRequest("POST", "/api/auth/register", userData);
        console.log("Register response received:", response);
        console.log("Register response status:", response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          console.error("Registration error response:", errorData);
          throw new Error(errorData.message || "Registration failed");
        }
        
        const data = await response.json();
        console.log("Registration successful for:", userData.email, data);
        return data;
      } catch (error: any) {
        console.error("Registration error:", error);
        throw new Error(error.message || "Registration failed. Please try again.");
      }
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.user.name}!`,
      });
      // Redirect to user dashboard after registration
      setLocation('/user');
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log("Submitting login request with email:", email);
      // Make sure we're awaiting the result and properly returning it
      const result = await loginMutation.mutateAsync({ email, password });
      console.log("Login result:", result);
      // Return the result to the caller
      return result;
    } catch (error) {
      console.error("Login error in auth context:", error);
      throw error;
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      console.log("Submitting register request with email:", email);
      // Make sure we're awaiting the result and properly returning it
      const result = await registerMutation.mutateAsync({ name, email, password });
      console.log("Register result:", result);
      // Return the result to the caller
      return result;
    } catch (error) {
      console.error("Register error in auth context:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading: isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};