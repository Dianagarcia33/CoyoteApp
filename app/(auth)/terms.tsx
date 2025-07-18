import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";

import { useRouter } from "expo-router";

const TERMS_TEXT = `
Al registrarte, aceptas nuestros Términos y Condiciones. 
Por favor, lee cuidadosamente antes de continuar.

1. Uso del servicio: El usuario se compromete a utilizar el servicio conforme a las leyes aplicables y a respetar las condiciones establecidas.

2. Privacidad: Respetamos tu privacidad y tus datos personales serán tratados conforme a nuestra política de privacidad.

3. Responsabilidades: El usuario es responsable de mantener la confidencialidad de su cuenta y contraseña.

4. Modificaciones: Nos reservamos el derecho de modificar estos términos en cualquier momento, notificándote oportunamente.

5. Limitación de responsabilidad: No nos hacemos responsables por daños derivados del uso incorrecto del servicio.

6. Contacto: Para cualquier duda o consulta, puedes contactarnos en soporte@ejemplo.com.

Gracias por confiar en nosotros.
`;

const HomeScreen = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const isDarkMode = useColorScheme() === "dark";
  const router = useRouter();

  useEffect(() => {
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
            paddingHorizontal: 30,
            paddingVertical: 20,
          }}
        >
          {/* Título */}
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: isDarkMode ? "#f9fafb" : "#111827",
              fontFamily: "Poppins-SemiBold",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Términos y Condiciones
          </Text>

          {/* Texto largo con scroll */}
          <ScrollView style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 22,
                color: isDarkMode ? "#d1d5db" : "#4b5563",
                fontFamily: "Poppins-Regular",
              }}
            >
              {TERMS_TEXT}
            </Text>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default HomeScreen;
