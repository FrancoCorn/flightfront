import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../api/auth';

interface AuthContextType {
  userToken: string | null;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string, nombre: string, genero: string, licencias: string, aviones: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      const storedUsername = await AsyncStorage.getItem('username');
      setUserToken(token);
      setUsername(storedUsername);
    };
    loadToken();
  }, []);

  const login = async (username: string, password: string) => {
    const token = await loginUser(username, password);
    if (token) {
      setUserToken(token);
      setUsername(username);
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('username', username);
    }
  };

  const logout = async () => {
    setUserToken(null);
    setUsername(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('username');
  };

  const register = (username: string, password: string, nombre: string, genero: string, licencias: string, aviones: string) => {
    console.log("Registrando usuario:", username);
    registerUser(username, password, nombre, genero, licencias, aviones);
  };

  return (
    <AuthContext.Provider value={{ userToken, username, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};