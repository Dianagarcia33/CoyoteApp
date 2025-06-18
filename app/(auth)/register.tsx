import React, { useState } from "react";
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
import { SelectDropdownCustom } from "@/components/SelectCustom";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FormCliente from "./formCliente";

const HomeScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isDarkMode = useColorScheme() === "dark";
  const [tipo, setTipo] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    nombre?: string;
  }>({});

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
              Crear una cuenta
            </Text>

            <View style={{ width: "100%" }}>
              <View style={{ zIndex: 3000 }}>
                <SelectDropdownCustom
                  value={tipo}
                  setValue={setTipo}
                  options={[
                    { label: "Cliente", value: "cliente" },
                    { label: "Entrenador", value: "entrenador" },
                    { label: "Nutricionista", value: "nutricionista" },
                    { label: "Gimnasio", value: "gimnasio" },
                  ]}
                  isDarkMode={isDarkMode}
                  errorMessage={tipo === "" ? "Campo requerido" : undefined}
                />
              </View>

              {tipo === "cliente" && (
                <FormCliente
                  objetivo={objetivo}
                  setObjetivo={setObjetivo}
                  nombre={nombre}
                  setNombre={setNombre}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                  errors={errors}
                  isDarkMode={isDarkMode}
                  router={router}
                />
              )}

              {tipo === "entrenador" && (
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      color: isDarkMode ? "white" : "black",
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    Certificaciones
                  </Text>
                  {/* Reemplaza esto con tu input personalizado */}
                </View>
              )}

              {tipo === "nutricionista" && (
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      color: isDarkMode ? "white" : "black",
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    Especialidad
                  </Text>
                  {/* Reemplaza esto con tu input personalizado */}
                </View>
              )}

              {tipo === "gimnasio" && (
                <View style={{ marginTop: 20 }}>
                  <Text
                    style={{
                      color: isDarkMode ? "white" : "black",
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    Nombre del gimnasio
                  </Text>
                  {/* Reemplaza esto con tu input personalizado */}
                </View>
              )}
            </View>
          </View>

          {/* Footer con botón abajo */}
          <View style={{ alignItems: "center" }}>
            <ButtonCustom
              text={isLoading ? "Cargando..." : "Registrar"}
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
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  color: isDarkMode ? "white" : "#7B6F72",
                  fontFamily: "Poppins-Regular",
                  fontSize: 14,
                  textAlign: "center",
                }}
              >
                Ya tengo una cuenta{" "}
              </Text>
              <Text
                onPress={() => router.replace("/")} // o navega a donde necesites
                style={{
                  color: "#FB7747",
                  fontFamily: "Poppins-SemiBold",
                  fontSize: 14,
                }}
              >
                Ingresar
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
