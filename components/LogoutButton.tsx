import { useRouter } from "expo-router";
import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../app/context/AuthContext";

export const LogoutButton = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás segura/o que deseas salir?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/");  
        },
      },
    ]);
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 12,
        borderRadius: 12, 
      }}
      activeOpacity={0.8}
    >
      
      <Text
        style={{
          marginLeft: 10,
          fontSize: 16,
          color: "#555",
          fontFamily: "Poppins-SemiBold",
        }}
      >
        Cerrar sesión
      </Text>
    </TouchableOpacity>
  );
};
