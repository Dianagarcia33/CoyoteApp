import { AuthProvider } from "@/app/context/AuthContext";
import "@/global.css";
import { ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { MyDarkTheme, MyLightTheme } from "../constants/themes";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider> {/* ✅ aquí envuelves todo con el provider */}
      <ThemeProvider value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            presentation: "card",
            gestureEnabled: true,
          }}
        />
      </ThemeProvider>
    </AuthProvider>
  );
}
