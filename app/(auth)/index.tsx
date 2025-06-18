import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

import { ButtonCustom } from "@/components/ButtonCustom";
import { InputCustom } from "@/components/InputCustom";
import { Logo } from "@/components/Logo";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isDarkMode = useColorScheme() === "dark";

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleLogin = async () => {
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
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://192.168.18.4:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión");
      }

      // Guardar token en AsyncStorage
      await AsyncStorage.setItem("access_token", data.access_token);

      Alert.alert("Login exitoso", `¡Bienvenido/a ${data.user.name}!`);

      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#0b111e" : "white" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
            paddingHorizontal: 30,
            paddingTop: 80,
            paddingBottom: keyboardVisible ? 20 : 40,
          }}
        >
          {/* Contenido arriba */}
          <View style={{ alignItems: "center" }}>
            <Logo width={180} height={180} />
            <Text
              style={{
                color: isDarkMode ? "white" : "black",
                marginTop: 20,
                fontFamily: "Poppins-Bold",
                fontSize: 20,
                textAlign: "center",
              }}
            >
              ¡Bienvenido/a de vuelta!
            </Text>

            <View style={{ width: "100%", marginTop: 30 }}>
              <InputCustom
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                icon={
                  <Feather
                    name="mail"
                    size={14}
                    color={isDarkMode ? "#FFFFFF" : "#6B7280"}
                  />
                }
                isDarkMode={isDarkMode}
                keyboardType="email-address"
                style={{ marginBottom: 10 }}
                errorMessage={errors.email}
              />

              <InputCustom
                label="Contraseña"
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                icon={
                  <Feather
                    name="lock"
                    size={14}
                    color={isDarkMode ? "#FFFFFF" : "#6B7280"}
                  />
                }
                isDarkMode={isDarkMode}
                secureTextEntry
                errorMessage={errors.password}
              />
              <Text
                style={{
                  color: isDarkMode ? "white" : "#7B6F72",
                  marginTop: 10,
                  fontFamily: "Poppins-Regular",
                  fontSize: 12,
                  textAlign: "center",
                }}
                onPress={() => router.push("/recoveryPassword")}
              >
                Olvidé mi contraseña
              </Text>
            </View>
          </View>

          {/* Footer con botón abajo */}
          <View style={{ alignItems: "center" }}>
            <ButtonCustom
              text={isLoading ? "Cargando..." : "Ingresar"}
              icon={
                isLoading ? null : (
                  <Feather name="log-in" size={20} color="white" />
                )
              }
              onPress={handleLogin}
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.6 : 1,
              }}
            />

            <Text
              style={{
                color: isDarkMode ? "white" : "#7B6F72",
                marginTop: 10,
                fontFamily: "Poppins-Regular",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              ¿No tienes una cuenta?{" "}
              <Text
                style={{
                  color: "#FB7747",
                  fontFamily: "Poppins-SemiBold",
                  
                }}
                onPress={() => router.push("/register")}
              >
                Registrarse
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
