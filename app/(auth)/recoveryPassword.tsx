import React, { useEffect, useState } from "react";
import {
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
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string }>({});
  const isDarkMode = useColorScheme() === "dark";
  const router = useRouter();

  const handleLogin = async () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Formato de email inválido";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    router.push("/recoveryCode");
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#0b111e" : "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            backgroundColor: isDarkMode ? "#0b111e" : "#fff",
            paddingHorizontal: 30,
            paddingTop: 80,
          }}
        >
          {/* Contenido principal alineado arriba */}
          <View>
            <Text
              style={{
                color: isDarkMode ? "white" : "black",
                fontFamily: "Poppins-Bold",
                marginBottom: 20,
                fontSize: 20,
                textAlign: "center",
              }}
            >
              Olvidé mi contraseña
            </Text>

            <Text
              style={{
                color: isDarkMode ? "white" : "black",
                fontFamily: "Poppins-Regular",
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              Confirma tu correo electrónico
            </Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View style={{ flex: 1 }}>
                <InputCustom
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  icon={
                    <Feather
                      name="mail"
                      size={14}
                      color={isDarkMode ? "#FFF" : "#6B7280"}
                    />
                  }
                  isDarkMode={isDarkMode}
                  keyboardType="email-address"
                  errorMessage={errors.email}
                  style={{ height: 50 }}
                />
              </View>

              <ButtonCustom
                icon={<Feather name="log-in" size={20} color="white" />}
                onPress={handleLogin}
                disabled={isLoading}
                width={50}
                colors={["#3872F9", "#574FED"]}
                height={50}
                style={{
                  opacity: isLoading ? 0.6 : 1,
                  aspectRatio: 1,
                  
                }}
              />
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {!keyboardVisible && (
            <View style={{ marginBottom: 50 }}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "#7B6F72",
                  fontFamily: "Poppins-Regular",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
               
                 Ya tengo una cuenta {" "}
                <Text
                  style={{
                    color: "#FB7747",
                    fontFamily: "Poppins-SemiBold",
                  }}
                >
                  Ingresar
                </Text>
              </Text>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
