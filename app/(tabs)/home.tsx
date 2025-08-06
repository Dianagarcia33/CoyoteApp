import { useAuth } from "@/app/context/AuthContext";
import { DashboardGrid } from "@/components/DashboardGrid";
import { HeaderLogoNotificaciones } from "@/components/HeaderLogoNotificaciones";
import { UserInfo } from "@/components/UserInfo";
import { useChatsRecientes } from "@/hooks/useChatsRecientes";
import { router } from "expo-router";
import React from "react";
import {
    Platform,
    ScrollView,
    Text,
    useColorScheme,
    View,
} from "react-native";

export default function Home() {
  const isDarkMode = useColorScheme() === "dark";
  const { user } = useAuth();  
  const { chatsRecientes } = useChatsRecientes();

  // Calcular total de mensajes no leídos
  const totalUnreadMessages = chatsRecientes.reduce((total, chat) => total + chat.sinLeer, 0);

  const handleNotificationPress = () => {
    // Navegar a la pantalla de chats/mensajes
    router.push("/clients");
  };

  if (!user) { 
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: isDarkMode ? "#0b111e" : "#ffffff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: isDarkMode ? "white" : "black" }}>
          Cargando usuario...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#0b111e" : "#ffffff",
      }}
      contentContainerStyle={{
        paddingBottom: 32,
        paddingTop: Platform.OS === "ios" ? 50 : 35, 
      }}
    >
      <HeaderLogoNotificaciones 
        onNotificationPress={handleNotificationPress} 
        unreadCount={totalUnreadMessages}
      />

      <UserInfo isDarkMode={isDarkMode} />  

      <DashboardGrid role={user.role as "entrenador" | "cliente" | "gimnasio" | "nutricionista"} /> 
    </ScrollView>
  );
}
