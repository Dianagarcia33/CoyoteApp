import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// Verificar si estamos en Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

export interface NotificationData {
  chatId?: string;
  clienteId?: string;
  clienteNombre?: string;
  mensaje?: string;
  type?: 'chat_message' | 'general';
}

// Hook de notificaciones que funciona tanto en Expo Go como en development builds
export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<any>(null);
  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  useEffect(() => {
    // Solo configurar notificaciones si no estamos en Expo Go
    if (isExpoGo) {
      console.log('⚠️ Notificaciones push no disponibles en Expo Go. Use un development build para notificaciones.');
      return;
    }

    // Importar y configurar expo-notifications solo en development builds
    const setupNotifications = async () => {
      try {
        const Notifications = await import('expo-notifications');
        
        // Configurar comportamiento de notificaciones
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
          }),
        });

        // Solicitar permisos y obtener token
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
          console.log('📱 Push token obtenido:', token);
        }

        // Listener para notificaciones recibidas mientras la app está abierta
        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
          console.log('📨 Notificación recibida:', notification);
          setNotification(notification);
        });

        // Listener para cuando el usuario toca una notificación
        responseListener.current = Notifications.addNotificationResponseReceivedListener((response: any) => {
          console.log('👆 Notificación tocada:', response);
          
          const data = response.notification.request.content.data as NotificationData;
          
          // Navegar al chat correspondiente si es una notificación de mensaje
          if (data?.type === 'chat_message' && data.chatId) {
            console.log('🚀 Navegando al chat:', data.chatId);
            router.push(`/chat/${data.chatId}`);
          }
        });
      } catch (error) {
        console.log('⚠️ Error configurando notificaciones:', error);
      }
    };

    setupNotifications();

    return () => {
      if (notificationListener.current) {
        try {
          import('expo-notifications').then((Notifications) => {
            Notifications.removeNotificationSubscription(notificationListener.current);
          });
        } catch {
          console.log('Error limpiando listeners');
        }
      }
      if (responseListener.current) {
        try {
          import('expo-notifications').then((Notifications) => {
            Notifications.removeNotificationSubscription(responseListener.current);
          });
        } catch {
          console.log('Error limpiando listeners');
        }
      }
    };
  }, []);

  // Función para enviar notificación local cuando llega un mensaje
  const sendChatNotification = async (data: {
    chatId: string;
    clienteNombre: string;
    mensaje: string;
  }) => {
    // No hacer nada si estamos en Expo Go
    if (isExpoGo) {
      console.log('⚠️ Notificación de chat omitida en Expo Go');
      return;
    }

    try {
      const Notifications = await import('expo-notifications');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `💬 Mensaje de ${data.clienteNombre}`,
          body: data.mensaje,
          data: {
            type: 'chat_message',
            chatId: data.chatId,
            clienteNombre: data.clienteNombre,
            mensaje: data.mensaje,
          },
          sound: 'default',
        },
        trigger: null, // Mostrar inmediatamente
      });
      
      console.log('📬 Notificación de chat enviada para:', data.clienteNombre);
    } catch (error) {
      console.log('❌ Error enviando notificación de chat:', error);
    }
  };

  // Función para enviar notificación general
  const sendGeneralNotification = async (title: string, body: string, data?: any) => {
    // No hacer nada si estamos en Expo Go
    if (isExpoGo) {
      console.log('⚠️ Notificación general omitida en Expo Go');
      return;
    }

    try {
      const Notifications = await import('expo-notifications');
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            type: 'general',
            ...data,
          },
          sound: 'default',
        },
        trigger: null,
      });
      
      console.log('📬 Notificación general enviada:', title);
    } catch (error) {
      console.log('❌ Error enviando notificación general:', error);
    }
  };

  return {
    expoPushToken,
    notification,
    sendChatNotification,
    sendGeneralNotification,
  };
};

async function registerForPushNotificationsAsync() {
  // No registrar push tokens en Expo Go
  if (isExpoGo) {
    console.log('⚠️ Push tokens no disponibles en Expo Go');
    return undefined;
  }

  try {
    const Notifications = await import('expo-notifications');
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('❌ Permisos de notificación denegados');
      return;
    }

    try {
      const projectId = '2ddc227d-ecf5-4227-b041-2d4a92c2858b'; // ID del proyecto desde app.json
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      console.log('✅ Token de notificación obtenido:', token);
    } catch (error) {
      console.log('❌ Error obteniendo token de notificación:', error);
    }

    return token;
  } catch (error) {
    console.log('❌ Error en registerForPushNotificationsAsync:', error);
    return undefined;
  }
}
