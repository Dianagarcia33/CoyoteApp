import { DashboardGrid } from "@/components/DashboardGrid";
import { HeaderLogoNotificaciones } from "@/components/HeaderLogoNotificaciones";
import { UserInfo } from "@/components/UserInfo";
import React from "react";
import {
  Platform,
  ScrollView,
  useColorScheme
} from "react-native";

export default function Home() {
  const isDarkMode = useColorScheme() === "dark";

  // Simulamos que el usuario está autenticado
  const user = {
    name: "Demo User",
    role: "entrenador", // puede ser: "cliente", "nutricionista", "gimnasio"
  };

  const handleNotificationPress = () => {
    console.log("Notificaciones presionadas");
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#0b111e" : "#ffffff",
      }}
      contentContainerStyle={{
        paddingBottom: 32,
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingHorizontal: 20,
      }}
    >
      <HeaderLogoNotificaciones onNotificationPress={handleNotificationPress} />

      <UserInfo isDarkMode={isDarkMode} />

      <DashboardGrid role={user.role} />
    </ScrollView>
  );
}
