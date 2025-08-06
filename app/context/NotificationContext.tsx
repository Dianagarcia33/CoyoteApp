import React, { createContext, useContext, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationContextType {
  sendChatNotification: (data: {
    chatId: string;
    clienteNombre: string;
    mensaje: string;
  }) => Promise<void>;
  sendGeneralNotification: (title: string, body: string, data?: any) => Promise<void>;
  expoPushToken: string;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { 
    expoPushToken, 
    sendChatNotification, 
    sendGeneralNotification 
  } = useNotifications();

  useEffect(() => {
    // Listener para cambios de estado de la app
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('📱 App state changed to:', nextAppState);
      
      if (nextAppState === 'active') {
        // App está activa, no enviar notificaciones
        console.log('🟢 App is active - notifications will be suppressed');
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        // App está en background, permitir notificaciones
        console.log('🟡 App is in background - notifications will be shown');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const value: NotificationContextType = {
    sendChatNotification,
    sendGeneralNotification,
    expoPushToken,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
