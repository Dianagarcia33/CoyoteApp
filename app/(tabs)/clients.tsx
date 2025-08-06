
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChatReciente, useChatsRecientes } from '../../hooks/useChatsRecientes';

const avatars = [
  'https://randomuser.me/api/portraits/women/45.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
  'https://randomuser.me/api/portraits/men/65.jpg',
];

// Función para calcular tiempo transcurrido
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Ahora';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d`;
  } else {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
  }
};




export default function Home() {
  const { chatsRecientes, loading, error } = useChatsRecientes();

  // Navegar a chat con cliente usando datos de Firebase
  const goToChat = (chat: ChatReciente) => {
    router.push({
      pathname: '/chat/[id]',
      params: { 
        id: chat.chatId, // Usar chatId (chatKey) para generar la ruta correcta en Firebase
        name: chat.clienteNombre, 
        avatar: chat.clienteAvatar,
        chatId: chat.chatId
      },
    });
  };

  // Navegar a la nueva vista de todos los clientes
  const goToAllClients = () => {
    router.push('/all-clients');
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <Text style={styles.headerTitle}>Clientes</Text>

        {/* Top Cards Row */}
        <View style={styles.topCardsContainer}>
          {/* Parche fit card */}
          <View style={styles.parcheFitCard}>
            <View style={styles.lockIconContainer}>
              <Ionicons name="lock-closed" size={20} color="#fff" />
            </View>
            <Text style={styles.parcheFitText}>Parche fit</Text>
          </View>

          {/* Ver todos card */}
          <TouchableOpacity style={styles.verTodosCard} activeOpacity={0.85} onPress={goToAllClients}>
            <View style={styles.avatarRow}>
              {avatars.slice(0, 3).map((avatar, i) => (
                <Image 
                  key={i} 
                  source={{ uri: avatar }} 
                  style={[styles.smallAvatar, { marginLeft: i === 0 ? 0 : -8 }]} 
                />
              ))}
            </View>
            <Text style={styles.verTodosText}>Ver todos mis clientes</Text>
          </TouchableOpacity>
        </View>

        {/* Chats Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={styles.chatsTitle}>Chats</Text>
        </View>

        <View style={styles.chatsList}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#5B3DF6" />
              <Text style={styles.loadingText}>Cargando conversaciones...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : chatsRecientes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay conversaciones</Text>
              <Text style={styles.emptySubtext}>Las conversaciones aparecerán aquí cuando comiences a chatear con tus clientes</Text>
            </View>
          ) : (
            chatsRecientes.map((chat, index) => {
              const tiempoTranscurrido = getTimeAgo(chat.fechaUltimoMensaje);
              
              return (
                <TouchableOpacity
                  key={chat.chatId}
                  style={styles.chatItem}
                  onPress={() => goToChat(chat)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: chat.clienteAvatar }} style={styles.clientAvatar} />
                  <View style={styles.chatTextContainer}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.clientName}>{chat.clienteNombre}</Text>
                      <Text style={styles.timeText}>{tiempoTranscurrido}</Text>
                    </View>
                    <Text style={styles.lastMessage} numberOfLines={1} ellipsizeMode="tail">
                      {chat.ultimoMensaje}
                    </Text>
                  </View>
                  {chat.sinLeer > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.sinLeer > 9 ? '9+' : chat.sinLeer}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 16, 
    paddingTop: Platform.OS === "ios" ? 50 : 35
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 15,
    color: '#000',
  },
  topCardsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  parcheFitCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  lockIconContainer: {
    backgroundColor: '#333',
    borderRadius: 12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  parcheFitText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  verTodosCard: {
    flex: 1,
    backgroundColor: '#E8E4FF',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#fff',
  },
  verTodosText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5B3DF6',
  },
  chatsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    marginLeft: 4,
  },
  chatsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  chatTextContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  timeText: {
    fontSize: 11,
    color: '#8E8E93',
    marginLeft: 8,
  },
  lastMessage: {
    fontSize: 13,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    marginLeft: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
  },
  loadingText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
});
