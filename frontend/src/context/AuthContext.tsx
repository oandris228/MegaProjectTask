import React, { createContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export interface User {
  id?: string;
  username?: string;
  password?: string;
  token: string;
}



export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  validate: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  validate: () => {}, // Addeth yon vawidate hewe UwU
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setUser({ token });
      }
    };
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, password})
      });

      if (!response.ok) {
        throw new Error("fail :(");
      }

      const data = await response.json();

      setUser({
        id: data.userId,
        token: data.token
      })
      localStorage.setItem("authToken", data.token);
    } catch (error) {
      console.error(error);
    }
  };

  const validate = async () => {
    if (!user?.token && !localStorage.getItem("authToken")) return; // Ensure there's a token

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem("authToken")}`,
        },
      });

      if (!response.ok) throw new Error("Validation failed");

      const data = await response.json();
      setUser({
        id: data.id,
        username: data.username,
        token: user?.token || localStorage.getItem("authToken")!,
      });
    } catch (error) {
      console.error("Validation error:", error);
      setUser(null);
      localStorage.removeItem("authToken");
    }
  };


  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("authToken");
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, validate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};