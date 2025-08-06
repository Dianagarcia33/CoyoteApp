import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface KettlebellRatingProps {
  rating: number;
  totalRatings?: number;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
}

export const KettlebellRating: React.FC<KettlebellRatingProps> = ({
  rating,
  totalRatings,
  showText = true,
  size = 'medium',
  loading = false
}) => {
  const getKettlebellSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  const renderKettlebells = () => {
    const kettlebells = [];
    const fullKettlebells = Math.floor(rating);
    const hasHalfKettlebell = rating % 1 >= 0.5;
    const emptyKettlebells = 5 - fullKettlebells - (hasHalfKettlebell ? 1 : 0);

    // Kettlebells llenas
    for (let i = 0; i < fullKettlebells; i++) {
      kettlebells.push(
        <Image
          key={`full-${i}`}
          source={require('@/assets/images/kettlebell.png')}
          style={[
            styles.kettlebell,
            { 
              width: getKettlebellSize(), 
              height: getKettlebellSize(),
              tintColor: '#FF6A3D' // Color principal de la app
            }
          ]}
        />
      );
    }

    // Kettlebell media (si aplica)
    if (hasHalfKettlebell) {
      kettlebells.push(
        <View key="half" style={styles.halfContainer}>
          <Image
            source={require('@/assets/images/kettlebell.png')}
            style={[
              styles.kettlebell,
              { 
                width: getKettlebellSize(), 
                height: getKettlebellSize(),
                tintColor: '#FFB399' // Color más claro para media
              }
            ]}
          />
        </View>
      );
    }

    // Kettlebells vacías
    for (let i = 0; i < emptyKettlebells; i++) {
      kettlebells.push(
        <Image
          key={`empty-${i}`}
          source={require('@/assets/images/kettlebell.png')}
          style={[
            styles.kettlebell,
            { 
              width: getKettlebellSize(), 
              height: getKettlebellSize(),
              tintColor: '#E5E7EB' // Gris claro para vacías
            }
          ]}
        />
      );
    }

    return kettlebells;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.kettlebellsContainer}>
        {renderKettlebells()}
      </View>
      {showText && (
        <View style={styles.textContainer}>
          <Text style={styles.ratingText}>
            {rating.toFixed(1)} • {totalRatings || 0} {totalRatings === 1 ? 'reseña' : 'reseñas'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  kettlebellsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  kettlebell: {
    resizeMode: 'contain',
  },
  halfContainer: {
    overflow: 'hidden',
  },
  textContainer: {
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});
