import { CalificacionesComponent } from '@/components/CalificacionesComponent';
import { useCalificaciones } from '@/hooks/useCalificaciones';
import { useReseñas } from '@/hooks/useReseñas';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CalificacionesDetalle() {
  const { stats: calificacionesStats, loading } = useCalificaciones();
  const { reseñas, loading: loadingReseñas } = useReseñas();

  const goBack = () => {
    router.back();
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const renderKettlebells = (rating: number) => {
    const kettlebells = [];
    const fullKettlebells = Math.floor(rating);
    const hasHalfKettlebell = rating % 1 >= 0.5;
    const emptyKettlebells = 5 - fullKettlebells - (hasHalfKettlebell ? 1 : 0);

    // Kettlebells llenos
    for (let i = 1; i <= fullKettlebells; i++) {
      kettlebells.push(
        <Image
          key={`full-${i}`}
          source={require('@/assets/images/kettlebell.png')}
          style={[styles.kettlebell, { tintColor: '#FF6A3D' }]}
        />
      );
    }

    // Kettlebell medio (si aplica)
    if (hasHalfKettlebell) {
      kettlebells.push(
        <Image
          key="half"
          source={require('@/assets/images/kettlebell.png')}
          style={[styles.kettlebell, { tintColor: '#FFB399' }]}
        />
      );
    }

    // Kettlebells vacíos
    for (let i = 1; i <= emptyKettlebells; i++) {
      kettlebells.push(
        <Image
          key={`empty-${i}`}
          source={require('@/assets/images/kettlebell.png')}
          style={[styles.kettlebell, { tintColor: '#E5E7EB' }]}
        />
      );
    }

    return kettlebells;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Reseñas</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Resumen de calificaciones */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen de Calificaciones</Text>
          
          <CalificacionesComponent
            promedio={calificacionesStats?.promedio}
            totalCalificaciones={calificacionesStats?.total_calificaciones}
            loading={loading}
            showText={true}
          />

          {/* Distribución de estrellas */}
          {calificacionesStats?.distribucion && (
            <View style={styles.distributionContainer}>
              <Text style={styles.distributionTitle}>Distribución de calificaciones</Text>
              {[5, 4, 3, 2, 1].map((kettlebells) => (
                <View key={kettlebells} style={styles.distributionRow}>
                  <Text style={styles.starsLabel}>{kettlebells}</Text>
                  <Image
                    source={require('@/assets/images/kettlebell.png')}
                    style={[styles.distributionKettlebell, { tintColor: '#FF6A3D' }]}
                  />
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${(calificacionesStats.distribucion[kettlebells as keyof typeof calificacionesStats.distribucion] / calificacionesStats.total_calificaciones) * 100}%` 
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.countLabel}>
                    {calificacionesStats.distribucion[kettlebells as keyof typeof calificacionesStats.distribucion]}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Lista de reseñas individuales */}
        <View style={styles.reviewsSection}>
          <Text style={styles.reviewsTitle}>Reseñas de Clientes</Text>
          
          {loadingReseñas ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Cargando reseñas...</Text>
            </View>
          ) : reseñas.length > 0 ? (
            reseñas.map((reseña) => (
              <View key={reseña.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.clienteInfo}>
                    <Image 
                      source={{ 
                        uri: reseña.cliente_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(reseña.cliente_nombre)}&background=FF6A3D&color=ffffff&size=80`
                      }} 
                      style={styles.clienteAvatar}
                    />
                    <View style={styles.clienteDetails}>
                      <Text style={styles.clienteNombre}>{reseña.cliente_nombre}</Text>
                      <Text style={styles.reviewFecha}>{formatFecha(reseña.fecha)}</Text>
                    </View>
                  </View>
                  <View style={styles.reviewStars}>
                    {renderKettlebells(reseña.calificacion)}
                  </View>
                </View>
                
                <Text style={styles.reviewComentario}>{reseña.comentario}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay reseñas disponibles</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  distributionContainer: {
    width: '100%',
    marginTop: 20,
  },
  distributionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 20,
  },
  distributionKettlebell: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6A3D',
    borderRadius: 4,
  },
  countLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 30,
    textAlign: 'right',
  },
  reviewsSection: {
    marginHorizontal: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clienteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  clienteAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  clienteDetails: {
    flex: 1,
  },
  clienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewFecha: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  kettlebell: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  reviewComentario: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});
