import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from './context/AuthContext';

// Tipado para clientes basado en la respuesta real de la API
type Cliente = {
  id?: string | number;
  name?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  phone?: string;
  role?: string;
  profile_pic?: string | null;
  avatar?: string;
  image?: string;
  document_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  objetivo?: string | null;
  especialidades?: string | null;
  tarifa?: string | null;
  moneda?: string | null;
  puntos?: number | null;
  periodo_facturacion?: string | null;
  direccion?: string | null;
  descripcion?: string | null;
  horario?: string | null;
  instalaciones?: string | null;
  lat?: string | null;
  lng?: string | null;
  total_rutinas?: number;
  rutinas_asignadas?: any[];
  estado?: string;
  ultimo_mensaje?: string;
  message?: string;
  hasNotification?: boolean;
};

function useClientes(search: string) {
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [allClientes, setAllClientes] = React.useState<Cliente[]>([]); // Guardar todos los clientes
  const { token } = useAuth(); // Obtener token del contexto

  // Efecto para cargar todos los clientes una sola vez
  React.useEffect(() => {
    async function fetchAllClientes() {
      console.log('🔄 Cargando TODOS los clientes por primera vez');
      setLoading(true);
      setError(null);
      
      console.log('🔑 Token del contexto:', token ? 'SÍ' : 'NO');
      console.log('🔑 Token (primeros 20 chars):', token ? token.substring(0, 20) + '...' : 'NO TOKEN');
      
      if (!token) {
        console.log('❌ No hay token disponible');
        setError('No se encontró token de autorización');
        setLoading(false);
        return;
      }
      
      try {
        const apiUrl = "http://192.168.18.84:8000/api/entrenador/clientes";
        console.log('📡 Haciendo fetch a:', apiUrl);
        console.log('📡 Headers enviados: Authorization: Bearer [token], Content-Type: application/json');
        
        const res = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📊 Response status:', res.status);
        console.log('📊 Response ok:', res.ok);
        
        if (!res.ok) throw new Error(`Error al obtener clientes: ${res.status}`);
        const data = await res.json();
        console.log('📋 API RESPUESTA COMPLETA:', JSON.stringify(data, null, 2));
        console.log('📋 Tipo de data:', typeof data);
        console.log('📋 Es array data?:', Array.isArray(data));
        console.log('📋 Keys de data:', Object.keys(data || {}));
        
        // Manejar diferentes estructuras de respuesta
        let lista = [];
        if (Array.isArray(data)) {
          console.log('📋 Usando data directamente (es array)');
          lista = data;
        } else if (data?.data && Array.isArray(data.data.data)) {
          console.log('📋 Usando data.data.data (estructura paginada)');
          lista = data.data.data;
        } else if (Array.isArray(data?.data)) {
          console.log('📋 Usando data.data (es array)');
          lista = data.data;
        } else if (Array.isArray(data?.clientes)) {
          console.log('📋 Usando data.clientes (es array)');
          lista = data.clientes;
        } else {
          console.log('📋 Estructura no reconocida, intentando otras propiedades...');
          // Revisar otras posibles propiedades
          const possibleArrays = Object.keys(data || {}).filter(key => Array.isArray(data[key]));
          console.log('📋 Arrays encontrados en la respuesta:', possibleArrays);
          if (possibleArrays.length > 0) {
            lista = data[possibleArrays[0]];
            console.log('📋 Usando primera propiedad array encontrada:', possibleArrays[0]);
          }
        }
        
        console.log('📋 Lista de clientes procesada:', lista.length, 'clientes');
        setAllClientes(lista);
        setClientes(lista); // Mostrar todos inicialmente
        console.log('✅ Clientes cargados exitosamente');
      } catch (e) {
        console.error('❌ Error al cargar clientes:', e);
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        console.log('🏁 Finalizando carga, setting loading to false');
        setLoading(false);
      }
    }
    
    fetchAllClientes();
  }, [token]); // Ejecutar cuando cambie el token

  // Efecto separado para filtrar según la búsqueda
  React.useEffect(() => {
    if (!search.trim()) {
      // Si no hay búsqueda, mostrar todos
      setClientes(allClientes);
      console.log('📋 Mostrando todos los clientes:', allClientes.length);
    } else {
      // Filtrar la lista completa
      const filtrados = allClientes.filter((cliente: any) => {
        const nombre = cliente.name || cliente.nombre || '';
        const email = cliente.email || '';
        return nombre.toLowerCase().includes(search.toLowerCase()) || 
               email.toLowerCase().includes(search.toLowerCase());
      });
      setClientes(filtrados);
      console.log('🔍 Filtrado:', allClientes.length, '→', filtrados.length, 'clientes para:', search);
    }
  }, [search, allClientes]); // Ejecutar cuando cambie search o allClientes
  
  return { clientes, loading, error };
}

export default function AllClientsScreen() {
  const [search, setSearch] = useState('');
  const { clientes, loading, error } = useClientes(search);

  // Navegar a chat con cliente
  const goToChat = (client: Cliente) => {
    const id = client.id ?? 'sin_id';
    const nombre = client.name || client.nombre || 'Sin nombre';
    const avatar = client.profile_pic || client.avatar || client.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=5B3DF6&color=ffffff`;
    console.log('💬 Navegando al chat del cliente:', nombre, 'ID:', id);
    router.push({
      pathname: `/chat/[id]`,
      params: { id: String(id), name: nombre, avatar },
    });
  };

  // Navegar al perfil del cliente
  const goToProfile = (client: Cliente) => {
    const nombre = client.name || client.nombre || 'Sin nombre';
    const avatar = client.profile_pic || client.avatar || client.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=5B3DF6&color=ffffff`;
    console.log('🔄 Navegando al perfil del cliente:', nombre, 'ID:', client.id);
    router.push({
      pathname: '/chat/perfilCliente',
      params: { 
        id: String(client.id), 
        name: nombre, 
        avatar,
        email: client.email || '',
        total_rutinas: String(client.total_rutinas || 0),
        objetivo: client.objetivo || 'Sin objetivo definido'
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Clientes</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={16} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            placeholder="Buscar clientes..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#8E8E93"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={16} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.centerContainer}>
            <View style={styles.loadingContainer}>
              <View style={styles.spinner} />
              <Text style={styles.loadingText}>Cargando clientes...</Text>
            </View>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
            <Text style={styles.errorTitle}>Error al cargar</Text>
            <Text style={styles.errorSubtitle}>Revisa tu conexión e intenta de nuevo</Text>
          </View>
        ) : clientes.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="people-outline" size={48} color="#C4C4C4" />
            <Text style={styles.emptyTitle}>
              {search.trim() ? 'Sin resultados' : 'No hay clientes'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {search.trim() 
                ? `No se encontraron clientes para "${search}"`
                : 'Cuando tengas clientes aparecerán aquí'
              }
            </Text>
          </View>
        ) : (
          <>
            {search.trim() && (
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {clientes.length} cliente{clientes.length !== 1 ? 's' : ''} encontrado{clientes.length !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
            
            <View style={styles.clientsList}>
              {clientes.map((client, index) => {
                const nombre = client.name || client.nombre || 'Sin nombre';
                const avatar = client.profile_pic || client.avatar || client.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre)}&background=5B3DF6&color=ffffff`;
                const email = client.email || '';
                
                return (
                  <View
                    key={client.id ?? index}
                    style={[styles.clientItem, index === clientes.length - 1 && styles.lastClientItem]}
                  >
                    <Image source={{ uri: avatar }} style={styles.clientAvatar} />
                    <View style={styles.clientInfo}>
                      <Text style={styles.clientName}>{nombre}</Text>
                      {email ? (
                        <Text style={styles.clientDetail}>
                          <Ionicons name="mail" size={12} color="#666" /> {email}
                        </Text>
                      ) : null}
                      {client.total_rutinas !== undefined && (
                        <Text style={styles.clientDetail}>
                          <Ionicons name="barbell" size={12} color="#666" /> {client.total_rutinas} rutinas
                        </Text>
                      )}
                    </View>
                    <View style={styles.clientActions}>
                      <TouchableOpacity 
                        style={styles.profileButton} 
                        onPress={() => {
                          console.log('👤 Presionado botón de PERFIL para:', nombre);
                          goToProfile(client);
                        }}
                      >
                        <Ionicons name="person" size={16} color="#5B3DF6" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.chatButton} 
                        onPress={() => {
                          console.log('💬 Presionado botón de CHAT para:', nombre);
                          goToChat(client);
                        }}
                      >
                        <Ionicons name="chatbubble" size={16} color="#5B3DF6" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // Compensar el botón de atrás
  },
  headerSpacer: {
    width: 32, // Mismo ancho que el botón de atrás
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  loadingContainer: {
    alignItems: 'center',
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#F0F0F0',
    borderTopColor: '#5B3DF6',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#C4C4C4',
    textAlign: 'center',
    lineHeight: 20,
  },
  resultsHeader: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  resultsCount: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  clientsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#fff',
  },
  lastClientItem: {
    borderBottomWidth: 0,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#F2F2F7',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  clientDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: '#E8E4FF',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
