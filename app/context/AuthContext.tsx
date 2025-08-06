import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  profile_pic: string | null;
  document_verified: number;
  created_at: string;
  updated_at: string;
  objetivo: string | null;
  especialidades: string | null;
  tarifa: string | null;
  moneda: string | null;
  puntos: number;
  periodo_facturacion: string | null;
  telefono: string | null;
  direccion: string | null;
  descripcion: string | null;
  horario: string | null;
  instalaciones: string | null;
  lat: string | null;
  lng: string | null;
  contacto_emergencia_nombre: string | null;
  contacto_emergencia_telefono: string | null;
  contacto_emergencia_relacion: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (userData: any, token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const storedToken = await AsyncStorage.getItem("access_token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error("Error parsing stored user:", err);
        }
      }

      setIsLoading(false);
    };

    loadSession();
  }, []);

  const login = async (userData: any, tokenValue: string) => {
    const parsedUser: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      profile_pic: userData.profile_pic,
      document_verified: userData.document_verified,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      objetivo: userData.objetivo,
      especialidades: userData.especialidades,
      tarifa: userData.tarifa,
      moneda: userData.moneda,
      puntos: Number(userData.puntos ?? 0),
      periodo_facturacion: userData.periodo_facturacion,
      telefono: userData.telefono,
      direccion: userData.direccion,
      descripcion: userData.descripcion,
      horario: userData.horario,
      instalaciones: userData.instalaciones,
      lat: userData.lat,
      lng: userData.lng,
      contacto_emergencia_nombre: userData.contacto_emergencia_nombre,
      contacto_emergencia_telefono: userData.contacto_emergencia_telefono,
      contacto_emergencia_relacion: userData.contacto_emergencia_relacion,
    };

    await AsyncStorage.setItem("access_token", tokenValue);
    await AsyncStorage.setItem("user", JSON.stringify(parsedUser));
    setUser(parsedUser);
    setToken(tokenValue);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe estar dentro de AuthProvider");
  return ctx;
};
