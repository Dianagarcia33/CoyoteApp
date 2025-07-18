import { Feather } from "@expo/vector-icons";
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
          router.replace("/"); // Redirige al login
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
        backgroundColor: "#FEE2E2",
        padding: 12,
        borderRadius: 12,
        marginTop: 30,
      }}
      activeOpacity={0.8}
    >
      <Feather name="log-out" size={20} color="#B91C1C" />
      <Text
        style={{
          marginLeft: 10,
          fontSize: 16,
          color: "#B91C1C",
          fontFamily: "Poppins-SemiBold",
        }}
      >
        Cerrar sesión
      </Text>
    </TouchableOpacity>
  );
};
