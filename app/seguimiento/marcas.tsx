import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface MarcaPersonal {
  id: number;
  ejercicio_id: number;
  ejercicio: {
    id: number;
    name: string;
    muscle_group: string;
    equipment?: string;
  };
  tipo_marca: string;
  valor_principal: number;
  valor_secundario?: number;
  unidad_medida: string;
  fecha_marca: string;
  validada: boolean;
  validada_por?: string;
  es_record_personal: boolean;
  mejora_anterior?: {
    valor_anterior: number;
    mejora: number;
    porcentaje_mejora: number;
  };
  notas?: string;
  created_at: string;
}

const tipoMarcaLabels: { [key: string]: string } = {
  '1rm': '1RM',
  '3rm': '3RM',
  '5rm': '5RM',
  'amrap': 'AMRAP',
  'tiempo': 'Tiempo',
  'distancia': 'Distancia',
  'volumen': 'Volumen'
};

export default function MarcasScreen() {
  const { clienteId, clienteNombre } = useLocalSearchParams<{ 
    clienteId?: string; 
    clienteNombre?: string;
  }>();

  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [marcas, setMarcas] = useState<MarcaPersonal[]>([]);
  const [filtroMusculo, setFiltroMusculo] = useState<string>('todos');

  const obtenerMarcas = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Si tenemos clienteId, usamos la API del entrenador, sino la API del cliente
      const url = clienteId 
        ? `http://192.168.18.84:8000/api/entrenador/clientes/${clienteId}/marcas`
        : `http://192.168.18.84:8000/api/marcas-personales`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🏆 Marcas del cliente:', data);
        
        if (data.success && data.data?.data) {
          setMarcas(data.data.data);
        }
      } else {
        console.error('❌ Error en la respuesta:', response.status);
      }
    } catch (error) {
      console.error('❌ Error obteniendo marcas:', error);
    } finally {
      setLoading(false);
    }
  }, [token, clienteId]);

  useEffect(() => {
    obtenerMarcas();
  }, [obtenerMarcas]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatearValor = (marca: MarcaPersonal) => {
    if (marca.tipo_marca === 'tiempo') {
      return `${marca.valor_principal} seg`;
    }
    if (marca.valor_secundario && marca.valor_secundario > 1) {
      return `${marca.valor_principal}${marca.unidad_medida} x ${marca.valor_secundario}`;
    }
    return `${marca.valor_principal}${marca.unidad_medida}`;
  };

  const gruposMusculares = ['todos', ...Array.from(new Set(marcas.map(m => m.ejercicio.muscle_group)))];

  const marcasFiltradas = filtroMusculo === 'todos' 
    ? marcas 
    : marcas.filter(m => m.ejercicio.muscle_group === filtroMusculo);

  const marcasPorEjercicio = marcasFiltradas.reduce((acc, marca) => {
    const ejercicio = marca.ejercicio.name;
    if (!acc[ejercicio]) {
      acc[ejercicio] = [];
    }
    acc[ejercicio].push(marca);
    return acc;
  }, {} as { [key: string]: MarcaPersonal[] });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marcas de {clienteNombre}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FF6A3D" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6A3D" />
          <Text style={styles.loadingText}>Cargando marcas personales...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {marcas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="trophy-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>Sin marcas registradas</Text>
              <Text style={styles.emptySubtitle}>Agrega la primera marca personal para comenzar el seguimiento</Text>
              <TouchableOpacity style={styles.addFirstButton}>
                <Text style={styles.addFirstButtonText}>Agregar primera marca</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Filtros */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filtrosContainer}
                contentContainerStyle={styles.filtrosContent}
              >
                {gruposMusculares.map((grupo) => (
                  <TouchableOpacity
                    key={grupo}
                    style={[
                      styles.filtroChip,
                      filtroMusculo === grupo && styles.filtroChipActive
                    ]}
                    onPress={() => setFiltroMusculo(grupo)}
                  >
                    <Text style={[
                      styles.filtroText,
                      filtroMusculo === grupo && styles.filtroTextActive
                    ]}>
                      {grupo === 'todos' ? 'Todos' : grupo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Resumen */}
              <View style={styles.resumenCard}>
                <View style={styles.resumenItem}>
                  <Text style={styles.resumenNumero}>{marcasFiltradas.length}</Text>
                  <Text style={styles.resumenLabel}>Total marcas</Text>
                </View>
                <View style={styles.resumenItem}>
                  <Text style={styles.resumenNumero}>
                    {marcasFiltradas.filter(m => m.es_record_personal).length}
                  </Text>
                  <Text style={styles.resumenLabel}>Records personales</Text>
                </View>
                <View style={styles.resumenItem}>
                  <Text style={styles.resumenNumero}>
                    {marcasFiltradas.filter(m => !m.validada).length}
                  </Text>
                  <Text style={styles.resumenLabel}>Pendientes</Text>
                </View>
              </View>

              {/* Marcas por ejercicio */}
              {Object.entries(marcasPorEjercicio).map(([ejercicio, marcasEjercicio]) => (
                <View key={ejercicio} style={styles.ejercicioSection}>
                  <View style={styles.ejercicioHeader}>
                    <Text style={styles.ejercicioNombre}>{ejercicio}</Text>
                    <View style={styles.musculoBadge}>
                      <Text style={styles.musculoText}>
                        {marcasEjercicio[0].ejercicio.muscle_group}
                      </Text>
                    </View>
                  </View>

                  {marcasEjercicio.map((marca, index) => (
                    <View key={marca.id} style={styles.marcaCard}>
                      <View style={styles.marcaHeader}>
                        <View style={styles.marcaInfo}>
                          <Text style={styles.marcaValor}>{formatearValor(marca)}</Text>
                          <Text style={styles.marcaTipo}>
                            {tipoMarcaLabels[marca.tipo_marca] || marca.tipo_marca.toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.marcaBadges}>
                          {marca.es_record_personal && (
                            <View style={styles.recordBadge}>
                              <Ionicons name="trophy" size={12} color="#FFD700" />
                              <Text style={styles.recordText}>PR</Text>
                            </View>
                          )}
                          {!marca.validada && (
                            <View style={styles.pendienteBadge}>
                              <Text style={styles.pendienteText}>Pendiente</Text>
                            </View>
                          )}
                          {marca.validada && (
                            <View style={styles.validadaBadge}>
                              <Ionicons name="checkmark-circle" size={12} color="#10B981" />
                              <Text style={styles.validadaText}>Validada</Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <View style={styles.marcaFooter}>
                        <Text style={styles.marcaFecha}>
                          {formatearFecha(marca.fecha_marca)}
                        </Text>
                        {index === 0 && (
                          <Text style={styles.marcaReciente}>Marca más reciente</Text>
                        )}
                      </View>

                      {/* Mejora anterior */}
                      {marca.mejora_anterior && (
                        <View style={styles.mejoraSection}>
                          <Text style={styles.mejoraText}>
                            🔥 Mejora de {marca.mejora_anterior.mejora.toFixed(1)}{marca.unidad_medida} 
                            ({marca.mejora_anterior.porcentaje_mejora.toFixed(1)}%)
                          </Text>
                          <Text style={styles.mejoraAnterior}>
                            Anterior: {marca.mejora_anterior.valor_anterior}{marca.unidad_medida}
                          </Text>
                        </View>
                      )}

                      {/* Validación */}
                      {marca.validada && marca.validada_por && (
                        <View style={styles.validacionSection}>
                          <Text style={styles.validacionText}>
                            ✅ Validada por {marca.validada_por}
                          </Text>
                        </View>
                      )}

                      {marca.notas && (
                        <View style={styles.notasSection}>
                          <Text style={styles.notasText}>{marca.notas}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#FF6A3D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filtrosContainer: {
    marginBottom: 16,
  },
  filtrosContent: {
    paddingHorizontal: 4,
  },
  filtroChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filtroChipActive: {
    backgroundColor: '#FF6A3D',
    borderColor: '#FF6A3D',
  },
  filtroText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filtroTextActive: {
    color: '#fff',
  },
  resumenCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  resumenItem: {
    alignItems: 'center',
  },
  resumenNumero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6A3D',
  },
  resumenLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  ejercicioSection: {
    marginBottom: 20,
  },
  ejercicioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ejercicioNombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  musculoBadge: {
    backgroundColor: '#E5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  musculoText: {
    fontSize: 12,
    color: '#0066CC',
    fontWeight: '500',
  },
  marcaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  marcaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  marcaInfo: {
    flex: 1,
  },
  marcaValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6A3D',
  },
  marcaTipo: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  marcaBadges: {
    alignItems: 'flex-end',
    gap: 4,
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  recordText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D97706',
  },
  pendienteBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pendienteText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#D97706',
  },
  validadaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  validadaText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#10B981',
  },
  marcaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marcaFecha: {
    fontSize: 12,
    color: '#999',
  },
  marcaReciente: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '500',
  },
  notasSection: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  notasText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  mejoraSection: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
  },
  mejoraText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 2,
  },
  mejoraAnterior: {
    fontSize: 11,
    color: '#374151',
  },
  validacionSection: {
    marginTop: 8,
    padding: 6,
    backgroundColor: '#ECFDF5',
    borderRadius: 6,
  },
  validacionText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
});
