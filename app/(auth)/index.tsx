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
import { useRouter } from "expo-router";
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../context/AuthContext";

const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isDarkMode = useColorScheme() === "dark";
  // const { login } = useAuth(); // Eliminado porque no se usa

  const router = useRouter();

  const { handleLogin, isLoading, errors } = useLogin();

  const { user, isLoading: loadingSession } = useAuth();

  React.useEffect(() => {
    if (!loadingSession && user) {
      router.replace("/home");
    }
  }, [loadingSession, user]);


  const onLogin = async () => {
    const result = await handleLogin(email, password);
    if (!result.success) {
      Alert.alert("Inicio de sesión fallido", result.message || "Error");
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

  if (loadingSession) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDarkMode ? "#0b111e" : "#ffffff",
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins-Regular",
            fontSize: 16,
            color: isDarkMode ? "white" : "black",
          }}
        >
          Validando sesión...
        </Text>
      </View>
    );
  }

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
            <Logo width={250} height={250} />
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
              onPress={onLogin}
              // disabled={isLoading} // Prop eliminada porque no existe en ButtonCustomProps
              // style eliminado porque no existe en ButtonCustomProps
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
