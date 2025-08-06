import { useRouter } from "expo-router";
import { useState } from "react";
import { useAuth } from "../app/context/AuthContext";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    const newErrors: typeof errors = {};
    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Formato de email inválido";
    }
    if (!password.trim()) {
      newErrors.password = "La contraseña es requerida";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return { success: false, message: "Errores de validación" };
    setIsLoading(true);
    try {
      const response = await fetch("http://192.168.18.84:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMsg = data?.message || "Error del servidor. Intenta más tarde.";
        throw new Error(errorMsg);
      }
      await login(data.user, data.access_token);
      router.replace("/home");
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  return { handleLogin, isLoading, errors };
}
