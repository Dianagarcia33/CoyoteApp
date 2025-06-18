import React, { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableWithoutFeedback,
    useColorScheme,
    View
} from "react-native";

import { ButtonCustom } from "@/components/ButtonCustom";
import { InputCustom } from "@/components/InputCustom";
import { Feather } from "@expo/vector-icons";
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

    
   
      router.replace("/home");
     
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
             Ingresa tu nueva contraseña
            </Text>

            <View style={{ width: "100%" }}>
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
                errorMessage={errors.password}
              />
            </View>
          </View>

          {/* Footer con botón abajo */}
          <View style={{ alignItems: "center" }}>
            <ButtonCustom
              text={isLoading ? "Cargando..." : "Actualizar contraseña"}
              icon={
                isLoading ? null : (
                  <Feather name="lock" size={20} color="white" />
                )
              }
              colors={["#3872F9", "#574FED"]}
              onPress={handleLogin}
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.6 : 1,
              }}
            />

            <View>
              <Text
                style={{
                  color: isDarkMode ? "white" : "#7B6F72",
                  marginTop: 10,
                  fontFamily: "Poppins-Regular",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Ya tengo una cuenta{" "}
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
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
