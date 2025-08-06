import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

interface MedidaCorporal {
  id: number;
  fecha_medicion: string;
  peso: number;
  altura: number;
  imc: number;
  interpretacion_imc: string;
  porcentaje_grasa?: number;
  masa_muscular?: number;
  porcentaje_agua?: number;
  circunferencia_cintura?: number;
  circunferencia_cadera?: number;
  circunferencia_brazo?: number;
  circunferencia_muslo?: number;
  tipo_medicion: string;
  notas?: string;
  created_at: string;
}

interface ProgresoData {
  peso?: {
    actual: number;
    anterior: number;
    cambio: number;
    porcentaje_cambio: number;
  };
  imc?: {
    actual: number;
    anterior: number;
    cambio: number;
    categoria_actual: string;
  };
  tendencias?: {
    peso: string;
    masa_muscular: string;
    porcentaje_grasa: string;
  };
}

export default function TallasScreen() {
  const { clienteId, clienteNombre } = useLocalSearchParams<{ 
    clienteId?: string; 
    clienteNombre?: string;
  }>();

  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [medidas, setMedidas] = useState<MedidaCorporal[]>([]);
  const [progreso, setProgreso] = useState<ProgresoData | null>(null);

  const obtenerMedidas = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Si tenemos clienteId, usamos la API del entrenador, sino la API del cliente
      const url = clienteId 
        ? `http://192.168.18.84:8000/api/entrenador/clientes/${clienteId}/medidas`
        : `http://192.168.18.84:8000/api/medidas-corporales`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📏 Medidas corporales obtenidas:', data);
        
        if (data.success && data.data?.data) {
          setMedidas(data.data.data);
          // Si hay datos de progreso, los guardamos
          if (data.progreso) {
            setProgreso(data.progreso);
          }
        }
      } else {
        console.error('❌ Error en la respuesta:', response.status);
      }
    } catch (error) {
      console.error('❌ Error obteniendo medidas corporales:', error);
    } finally {
      setLoading(false);
    }
  }, [token, clienteId]);

  useEffect(() => {
    obtenerMedidas();
  }, [obtenerMedidas]);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTipoMedicionColor = (tipo: string) => {
    switch (tipo) {
      case 'inicial': return '#3B82F6'; // Azul
      case 'seguimiento': return '#10B981'; // Verde
      case 'final': return '#8B5CF6'; // Púrpura
      default: return '#6B7280'; // Gris
    }
  };

  const getTipoMedicionLabel = (tipo: string) => {
    switch (tipo) {
      case 'inicial': return 'Inicial';
      case 'seguimiento': return 'Seguimiento';
      case 'final': return 'Final';
      default: return tipo;
    }
  };

  const renderProgreso = () => {
    if (!progreso) return null;

    return (
      <View style={styles.progresoContainer}>
        <Text style={styles.progresoTitle}>📊 Progreso Reciente</Text>
        
        {progreso.peso && (
          <View style={styles.progresoItem}>
            <Text style={styles.progresoLabel}>Peso</Text>
            <Text style={styles.progresoValor}>
              {progreso.peso.actual}kg 
              <Text style={[
                styles.progresoCambio,
                { color: progreso.peso.cambio >= 0 ? '#EF4444' : '#10B981' }
              ]}>
                {progreso.peso.cambio >= 0 ? '+' : ''}{progreso.peso.cambio.toFixed(1)}kg
              </Text>
            </Text>
          </View>
        )}

        {progreso.imc && (
          <View style={styles.progresoItem}>
            <Text style={styles.progresoLabel}>IMC</Text>
            <Text style={styles.progresoValor}>
              {progreso.imc.actual.toFixed(1)} 
              <Text style={styles.progresoCategoria}>
                ({progreso.imc.categoria_actual})
              </Text>
            </Text>
          </View>
        )}

        {progreso.tendencias && (
          <View style={styles.tendenciasContainer}>
            <Text style={styles.tendenciasTitle}>Tendencias:</Text>
            <View style={styles.tendenciasList}>
              <Text style={styles.tendenciaItem}>
                💪 Músculo: {progreso.tendencias.masa_muscular}
              </Text>
              <Text style={styles.tendenciaItem}>
                🔥 Grasa: {progreso.tendencias.porcentaje_grasa}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Medidas de {clienteNombre || 'Cliente'}
        </Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FF6A3D" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6A3D" />
          <Text style={styles.loadingText}>Cargando medidas...</Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Progreso */}
          {renderProgreso()}

          {/* Lista de medidas */}
          {medidas.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay medidas registradas</Text>
              <Text style={styles.emptySubtext}>
                Las medidas corporales aparecerán aquí una vez registradas
              </Text>
            </View>
          ) : (
            medidas.map((medida) => (
              <View key={medida.id} style={styles.medidaCard}>
                {/* Header de la medida */}
                <View style={styles.medidaHeader}>
                  <View>
                    <Text style={styles.medidaFecha}>
                      {formatearFecha(medida.fecha_medicion)}
                    </Text>
                    <View style={styles.tipoContainer}>
                      <View style={[
                        styles.tipoBadge,
                        { backgroundColor: getTipoMedicionColor(medida.tipo_medicion) }
                      ]}>
                        <Text style={styles.tipoText}>
                          {getTipoMedicionLabel(medida.tipo_medicion)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-vertical" size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                {/* Datos principales */}
                <View style={styles.datosSection}>
                  <Text style={styles.sectionTitle}>📏 Datos Básicos</Text>
                  <View style={styles.datosGrid}>
                    <View style={styles.datoItem}>
                      <Text style={styles.datoLabel}>Peso</Text>
                      <Text style={styles.datoValue}>{medida.peso} kg</Text>
                    </View>
                    <View style={styles.datoItem}>
                      <Text style={styles.datoLabel}>Altura</Text>
                      <Text style={styles.datoValue}>{medida.altura} cm</Text>
                    </View>
                    <View style={styles.datoItem}>
                      <Text style={styles.datoLabel}>IMC</Text>
                      <Text style={[styles.datoValue, { fontSize: 16, fontWeight: 'bold' }]}>
                        {medida.imc.toFixed(1)}
                      </Text>
                      <Text style={styles.datoSubtext}>{medida.interpretacion_imc}</Text>
                    </View>
                  </View>
                </View>

                {/* Composición corporal */}
                {(medida.porcentaje_grasa || medida.masa_muscular || medida.porcentaje_agua) && (
                  <View style={styles.composicionSection}>
                    <Text style={styles.sectionTitle}>🏋️ Composición Corporal</Text>
                    <View style={styles.composicionGrid}>
                      {medida.porcentaje_grasa && (
                        <View style={styles.composicionItem}>
                          <Text style={styles.composicionLabel}>% Grasa</Text>
                          <Text style={styles.composicionValue}>{medida.porcentaje_grasa}%</Text>
                        </View>
                      )}
                      {medida.masa_muscular && (
                        <View style={styles.composicionItem}>
                          <Text style={styles.composicionLabel}>Músculo</Text>
                          <Text style={styles.composicionValue}>{medida.masa_muscular} kg</Text>
                        </View>
                      )}
                      {medida.porcentaje_agua && (
                        <View style={styles.composicionItem}>
                          <Text style={styles.composicionLabel}>% Agua</Text>
                          <Text style={styles.composicionValue}>{medida.porcentaje_agua}%</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Circunferencias */}
                {(medida.circunferencia_cintura || medida.circunferencia_cadera || 
                  medida.circunferencia_brazo || medida.circunferencia_muslo) && (
                  <View style={styles.circunferenciasSection}>
                    <Text style={styles.sectionTitle}>📐 Circunferencias</Text>
                    <View style={styles.circunferenciasGrid}>
                      {medida.circunferencia_cintura && (
                        <View style={styles.circunferenciaItem}>
                          <Text style={styles.circunferenciaLabel}>Cintura</Text>
                          <Text style={styles.circunferenciaValue}>
                            {medida.circunferencia_cintura} cm
                          </Text>
                        </View>
                      )}
                      {medida.circunferencia_cadera && (
                        <View style={styles.circunferenciaItem}>
                          <Text style={styles.circunferenciaLabel}>Cadera</Text>
                          <Text style={styles.circunferenciaValue}>
                            {medida.circunferencia_cadera} cm
                          </Text>
                        </View>
                      )}
                      {medida.circunferencia_brazo && (
                        <View style={styles.circunferenciaItem}>
                          <Text style={styles.circunferenciaLabel}>Brazo</Text>
                          <Text style={styles.circunferenciaValue}>
                            {medida.circunferencia_brazo} cm
                          </Text>
                        </View>
                      )}
                      {medida.circunferencia_muslo && (
                        <View style={styles.circunferenciaItem}>
                          <Text style={styles.circunferenciaLabel}>Muslo</Text>
                          <Text style={styles.circunferenciaValue}>
                            {medida.circunferencia_muslo} cm
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Notas */}
                {medida.notas && (
                  <View style={styles.notasSection}>
                    <Text style={styles.sectionTitle}>📝 Notas</Text>
                    <Text style={styles.notasText}>{medida.notas}</Text>
                  </View>
                )}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progresoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progresoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  progresoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progresoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  progresoValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  progresoCambio: {
    fontSize: 14,
    marginLeft: 8,
  },
  progresoCategoria: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  tendenciasContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  tendenciasTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  tendenciasList: {
    gap: 4,
  },
  tendenciaItem: {
    fontSize: 13,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  medidaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medidaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  medidaFecha: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  tipoContainer: {
    flexDirection: 'row',
  },
  tipoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tipoText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  moreButton: {
    padding: 4,
  },
  datosSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  datosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  datoItem: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  datoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  datoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  datoSubtext: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 2,
  },
  composicionSection: {
    marginBottom: 16,
  },
  composicionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  composicionItem: {
    flex: 1,
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  composicionLabel: {
    fontSize: 12,
    color: '#92400e',
    marginBottom: 4,
  },
  composicionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400e',
  },
  circunferenciasSection: {
    marginBottom: 16,
  },
  circunferenciasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  circunferenciaItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#e0f2fe',
    padding: 12,
    borderRadius: 8,
  },
  circunferenciaLabel: {
    fontSize: 12,
    color: '#0c4a6e',
    marginBottom: 4,
  },
  circunferenciaValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0c4a6e',
  },
  notasSection: {},
  notasText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
