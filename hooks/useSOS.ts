import * as Location from "expo-location";
import { Alert, Linking } from "react-native";
import { useAuth } from "../app/context/AuthContext";

export const useSOS = () => {
  const { user } = useAuth();

  const getCurrentLocation = async (): Promise<string> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return "Ubicación no disponible (permisos denegados)";
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      return `https://maps.google.com/?q=${latitude},${longitude}`;
    } catch (error) {
      console.error("Error obteniendo ubicación:", error);
      return "Ubicación no disponible";
    }
  };

  const sendSOSMessage = async () => {
    if (!user?.contacto_emergencia_telefono || !user?.contacto_emergencia_nombre) {
      Alert.alert(
        "Contacto de emergencia no configurado", 
        "No tienes un contacto de emergencia registrado. Por favor, actualiza tu perfil."
      );
      return;
    }

    // Obtener ubicación actual
    const ubicacion = await getCurrentLocation();

    const mensaje = `🚨 EMERGENCIA 🚨\n\nHola ${user.contacto_emergencia_nombre}, soy ${user.name}.\n\nTengo una situación de emergencia y necesito ayuda urgente.\n\nPor favor contactarme lo antes posible.\n\n📍 Mi ubicación: ${ubicacion}\n\nGracias.`;
    
    const telefono = user.contacto_emergencia_telefono.replace(/\D/g, ''); // Remover caracteres no numéricos
    
    try {
      // Intentar abrir WhatsApp primero (más común)
      const whatsappUrl = `whatsapp://send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;
      const canOpenWhatsApp = await Linking.canOpenURL(whatsappUrl);
      
      if (canOpenWhatsApp) {
        await Linking.openURL(whatsappUrl);
        return;
      }

      // Si no se puede abrir WhatsApp, intentar SMS
      const smsUrl = `sms:${telefono}?body=${encodeURIComponent(mensaje)}`;
      const canOpenSMS = await Linking.canOpenURL(smsUrl);
      
      if (canOpenSMS) {
        await Linking.openURL(smsUrl);
        return;
      }

      // Si ninguna aplicación de mensajería está disponible
      Alert.alert(
        "Error",
        "No se pudo abrir ninguna aplicación de mensajería. Por favor, contacta manualmente a tu contacto de emergencia."
      );

    } catch (error) {
      console.error("Error al enviar mensaje SOS:", error);
      Alert.alert(
        "Error", 
        "Hubo un problema al abrir la aplicación de mensajes. Por favor, contacta manualmente a tu contacto de emergencia."
      );
    }
  };

  const confirmSOS = () => {
    Alert.alert(
      "🚨 Mensaje de Emergencia",
      `¿Estás seguro de que quieres enviar un mensaje de emergencia a ${user?.contacto_emergencia_nombre}?\n\nEsto incluirá tu ubicación actual.`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Enviar SOS",
          style: "destructive",
          onPress: sendSOSMessage
        }
      ]
    );
  };

  return {
    sendSOSMessage,
    confirmSOS,
    hasEmergencyContact: !!(user?.contacto_emergencia_telefono && user?.contacto_emergencia_nombre)
  };
};
