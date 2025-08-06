import { rtdb } from '@/lib/firebase';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { onValue, push, ref } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'client';
  createdAt: number;
};

export default function ChatScreen() {
  const { id, name, avatar } = useLocalSearchParams<{
    id: string;
    name?: string;
    avatar?: string;
  }>();
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<FlatList<Message>>(null);

  const chatKey = React.useMemo(
    () =>
      decodeURIComponent(String(id || '')).replace(/[^\w]/g, '_') || 'default',
    [id]
  );

  // Función para marcar mensajes del cliente como leídos
  const marcarMensajesComoLeidos = React.useCallback(async (messages: any) => {
    try {
      // Buscar mensajes del cliente (sender: 'client') que no están marcados como leídos
      const mensajesCliente = Object.entries(messages).filter(([key, message]: [string, any]) => 
        message.sender === 'client' && !message.readByTrainer
      );

      if (mensajesCliente.length > 0) {
        console.log(`Marcando ${mensajesCliente.length} mensajes como leídos en chat ${chatKey}`);
        
        const updates: any = {};
        
        // Marcar cada mensaje del cliente como leído por el entrenador
        mensajesCliente.forEach(([messageKey, message]) => {
          updates[`chats/${chatKey}/messages/${messageKey}/readByTrainer`] = true;
          updates[`chats/${chatKey}/messages/${messageKey}/readAt`] = Date.now();
        });

        // Actualizar en Realtime Database
        const { update } = await import('firebase/database');
        await update(ref(rtdb), updates);
        
        console.log(`✅ Mensajes marcados como leídos exitosamente en chat ${chatKey}`);
      } else {
        console.log(`ℹ️ No hay mensajes no leídos en chat ${chatKey}`);
      }
    } catch (error) {
      console.error('Error marcando mensajes como leídos:', error);
    }
  }, [chatKey]);

  // Suscripción a mensajes
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    const messagesRef = ref(rtdb, `chats/${chatKey}/messages`);

    const unsub = onValue(messagesRef, async (snapshot) => {
      try {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const arr: Message[] = Object.entries(data).map(([key, value]: any) => ({
            id: key,
            ...value,
          }));
          arr.sort((a, b) => a.createdAt - b.createdAt);
          setMessages(arr);
          
          // Marcar mensajes del cliente como leídos
          marcarMensajesComoLeidos(data);
        } else {
          setMessages([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Chat - Error processing messages:', err);
        setError('Error al procesar mensajes');
        setLoading(false);
      }
    }, (error) => {
      console.error('Chat - Firebase listener error:', error);
      setError('Error de conexión con Firebase');
      setLoading(false);
    });

    return () => {
      unsub();
    };
  }, [chatKey, name, user, id, marcarMensajesComoLeidos]);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !user?.id) return;

    const messageText = text.trim();
    const timestamp = Date.now();

    try {
      // Guardar en Realtime Database
      const messagesRef = ref(rtdb, `chats/${chatKey}/messages`);
      await push(messagesRef, {
        text: messageText,
        sender: 'me',
        createdAt: timestamp,
      });

      setText('');
    } catch (error) {
      console.error('Chat - Error sending message:', error);
      setText('');
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const shouldShowTime = (currentMessage: Message, previousMessage?: Message) => {
    if (!previousMessage) return true;
    const timeDiff = currentMessage.createdAt - previousMessage.createdAt;
    return timeDiff > 5 * 60 * 1000; // 5 minutos
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const previousMessage = index > 0 ? messages[index - 1] : undefined;
    const showTime = shouldShowTime(item, previousMessage);
    
    return (
      <>
        {showTime && (
          <Text style={styles.messageTime}>
            {formatTime(item.createdAt)}
          </Text>
        )}
        <View
          style={[
            styles.messageBubble,
            item.sender === 'me' ? styles.myMessage : styles.clientMessage,
          ]}
        >
          <Text style={item.sender === 'me' ? styles.messageText : styles.messageTextClient}>
            {item.text}
          </Text>
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      {/* Header personalizado */}
      <View style={styles.profileHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileInfo}
            onPress={() =>
              router.push({
                pathname: './perfilCliente',
                params: { 
                  id: String(id),
                  name, 
                  avatar,
                },
              })
            }
          >
            {avatar && <Image source={{ uri: String(avatar) }} style={styles.avatar} />}
            <View>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileStatus}>En línea</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.headerRight}>
          <Ionicons name="ellipsis-vertical" size={20} color="#000000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#666', fontSize: 16 }}>Cargando mensajes...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'red', fontSize: 16 }}>Error: {error}</Text>
          <Text style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
            Revisa la consola para más detalles
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesContainer}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ color: '#666', fontSize: 16, textAlign: 'center' }}>
                No hay mensajes aún{'\n'}
                ¡Envía el primer mensaje!
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Escribe un mensaje"
          placeholderTextColor="#999999"
          multiline={true}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginRight: 12,
  },
  profileName: { 
    fontSize: 16, 
    fontWeight: '600',
    color: '#000000',
  },
  profileStatus: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  headerRight: {
    padding: 4,
  },
  messagesContainer: { 
    padding: 16,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 2,
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  clientMessage: {
    backgroundColor: '#F0F0F0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: { 
    fontSize: 16, 
    color: '#ffffff',
    lineHeight: 22,
  },
  messageTextClient: { 
    fontSize: 16, 
    color: '#000000',
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#000000',
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { 
    color: '#ffffff', 
    fontSize: 18,
    fontWeight: '600',
  },
});
