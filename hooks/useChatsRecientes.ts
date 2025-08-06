import * as Notifications from 'expo-notifications';
import { onValue, ref } from 'firebase/database';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useAuth } from '../app/context/AuthContext';
import { rtdb } from '../lib/firebase';

export type ChatReciente = {
  chatId: string;
  clienteId: string;
  clienteNombre: string;
  clienteAvatar: string;
  ultimoMensaje: string;
  fechaUltimoMensaje: Date;
  sinLeer: number;
  activo: boolean;
};

// Función auxiliar para obtener clientes de la API
const obtenerClientes = async (token: string) => {
  try {
    const response = await fetch('http://192.168.18.84:8000/api/entrenador/clientes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener clientes: ${response.status}`);
    }

    const data = await response.json();
    
    // Manejar diferentes estructuras de respuesta
    let lista = [];
    if (Array.isArray(data)) {
      lista = data;
    } else if (data?.data && Array.isArray(data.data.data)) {
      lista = data.data.data;
    } else if (Array.isArray(data?.data)) {
      lista = data.data;
    } else if (Array.isArray(data?.clientes)) {
      lista = data.clientes;
    }

    return lista;
  } catch (error) {
    console.error('useChatsRecientes - Error obteniendo clientes:', error);
    return [];
  }
};

export const useChatsRecientes = () => {
  const [chatsRecientes, setChatsRecientes] = useState<ChatReciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const previousChatsRef = useRef<Map<string, number>>(new Map()); // Para comparar mensajes no leídos

  // Función para enviar notificación local cuando llega un mensaje
  const sendChatNotification = useCallback(async (data: {
    chatId: string;
    clienteNombre: string;
    mensaje: string;
  }) => {
    try {
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
      console.error('❌ Error enviando notificación de chat:', error);
    }
  }, []);

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      // Agregar datos de prueba si no hay usuario para testing
      setChatsRecientes([
        {
          chatId: 'test_1',
          clienteId: 'test_client_1',
          clienteNombre: 'Ana García (Demo)',
          clienteAvatar: 'https://ui-avatars.com/api/?name=Ana+Garcia&background=random',
          ultimoMensaje: 'Hola, ¿cómo va mi rutina?',
          fechaUltimoMensaje: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
          sinLeer: 2,
          activo: true
        },
        {
          chatId: 'test_2',
          clienteId: 'test_client_2',
          clienteNombre: 'Carlos López (Demo)',
          clienteAvatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=random',
          ultimoMensaje: 'Perfecto, nos vemos mañana a las 3pm',
          fechaUltimoMensaje: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          sinLeer: 0,
          activo: true
        },
        {
          chatId: 'test_3',
          clienteId: 'test_client_3',
          clienteNombre: 'María López (Demo)',
          clienteAvatar: 'https://ui-avatars.com/api/?name=Maria+Lopez&background=random',
          ultimoMensaje: 'Excelente trabajo en la sesión de hoy!',
          fechaUltimoMensaje: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
          sinLeer: 0,
          activo: true
        }
      ]);
      return;
    }

    setError(null);

    // Ejecutar detección inicial y configurar listener
    let unsubscribe: (() => void) | null = null;
    
    const setupListener = async () => {
      try {
        setLoading(true);

        // Primero obtener la lista de clientes de la API
        const clientes = token ? await obtenerClientes(token) : [];

        // Crear un mapa de clienteId -> información del cliente
        const clientesMap = new Map();
        clientes.forEach((cliente: any) => {
          const clienteId = cliente.id?.toString();
          if (clienteId) {
            clientesMap.set(clienteId, {
              nombre: cliente.name || cliente.nombre || `Cliente ${clienteId}`,
              email: cliente.email || '',
              avatar: cliente.profile_pic || cliente.avatar || cliente.image || 
                     `https://ui-avatars.com/api/?name=${encodeURIComponent(cliente.name || cliente.nombre || 'Cliente')}&background=random`
            });
          }
        });

        // Configurar listener para todos los chats en tiempo real
        const chatsRef = ref(rtdb, 'chats');
        unsubscribe = onValue(chatsRef, (snapshot) => {
          const chatsArray: ChatReciente[] = [];
          const currentChats = new Map<string, number>(); // Para comparar con anterior

          if (snapshot.exists()) {
            const allChats = snapshot.val();

            // Iterar sobre todos los chats
            Object.entries(allChats).forEach(([chatKey, chatData]: [string, any]) => {
              // Verificar que el chat tenga mensajes
              const tieneMensajes = chatData && chatData.messages && Object.keys(chatData.messages).length > 0;
              
              if (tieneMensajes) {
                  // Obtener el último mensaje
                  const messages = Object.values(chatData.messages) as any[];
                  
                  if (messages.length > 0) {
                    const ultimoMensaje = messages.sort((a, b) => b.createdAt - a.createdAt)[0];
                    
                    // Contar mensajes no leídos del cliente (sender: 'client' y readByTrainer != true)
                    const mensajesNoLeidos = messages.filter(message => 
                      message.sender === 'client' && !message.readByTrainer
                    ).length;
                    
                    console.log(`Chat ${chatKey}: ${mensajesNoLeidos} mensajes no leídos`);
                    
                    // Buscar el cliente real por chatKey en el mapa de clientes
                    let clienteRealId = chatKey;
                    let clienteNombre = 'Cliente';
                    let clienteAvatar = '';
                    
                    // Primero intentar encontrar el cliente por chatKey exacto
                    let clienteInfo = clientesMap.get(chatKey);
                    
                    // Si no se encuentra, buscar por coincidencia de nombre normalizado
                    if (!clienteInfo) {
                      for (const [id, info] of clientesMap.entries()) {
                        const nombreNormalizado = (info.nombre || '').toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '_');
                        if (nombreNormalizado === chatKey.toLowerCase() || chatKey.includes(id)) {
                          clienteInfo = info;
                          clienteRealId = id;
                          break;
                        }
                      }
                    }
                    
                    if (clienteInfo) {
                      clienteNombre = clienteInfo.nombre;
                      clienteAvatar = clienteInfo.avatar;
                    } else {
                      // Fallback si no se encuentra en la API
                      clienteNombre = `Cliente ${chatKey}`;
                      clienteAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(clienteNombre)}&background=random`;
                    }

                    // Verificar si hay mensajes nuevos para notificar
                    const mensajesAnteriores = previousChatsRef.current.get(chatKey) || 0;
                    currentChats.set(chatKey, mensajesNoLeidos);
                    
                    // Si hay más mensajes no leídos que antes, enviar notificación
                    if (mensajesNoLeidos > mensajesAnteriores && AppState.currentState !== 'active') {
                      const ultimoMensajeDelCliente = messages
                        .filter(msg => msg.sender === 'client' && !msg.readByTrainer)
                        .sort((a, b) => b.createdAt - a.createdAt)[0];
                      
                      if (ultimoMensajeDelCliente) {
                        sendChatNotification({
                          chatId: chatKey,
                          clienteNombre: clienteNombre,
                          mensaje: ultimoMensajeDelCliente.text || 'Nuevo mensaje'
                        });
                      }
                    }

                    const chatReciente: ChatReciente = {
                      chatId: chatKey,
                      clienteId: clienteRealId, // Usar el ID real del cliente, no el chatKey
                      clienteNombre: clienteNombre,
                      clienteAvatar: clienteAvatar,
                      ultimoMensaje: ultimoMensaje.text || 'Nuevo mensaje',
                      fechaUltimoMensaje: new Date(ultimoMensaje.createdAt),
                      sinLeer: mensajesNoLeidos, // Usar el conteo real de mensajes no leídos
                      activo: true
                    };

                    chatsArray.push(chatReciente);
                  }
              }
            });
          }

          // Actualizar la referencia de chats anteriores
          previousChatsRef.current = currentChats;

          // Ordenar por fecha del último mensaje (más reciente primero)
          chatsArray.sort((a, b) => b.fechaUltimoMensaje.getTime() - a.fechaUltimoMensaje.getTime());

          setChatsRecientes(chatsArray);
          setLoading(false);
        }, (error) => {
          console.error('useChatsRecientes - Error en listener:', error);
          setError('Error al escuchar conversaciones: ' + error.message);
          setLoading(false);
        });

      } catch (error) {
        console.error('useChatsRecientes - Error setup listener:', error);
        setError('Error al configurar listener: ' + (error as Error).message);
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user, token, sendChatNotification]);

  return { chatsRecientes, loading, error };
};
