import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/"); // Navega a la pantalla principal (index.tsx)
    }, 3000); // 3 segundos de splash

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/coyote-logo2.png")} style={styles.logo} />
      <Text style={styles.text}>CoyoteApp</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b111e",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 30,
    backgroundColor: "transparent",
  },
  text: {
    color: "white",
    fontSize: 28,
    fontFamily: "Poppins_600SemiBold",
    marginTop: 20,
  },
});
