import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const expertosMock = [
  {
    id: 1,
    nombre: 'Dr. Carlos Martínez',
    especialidad: 'Entrenador Personal',
    experiencia: '5 años',
    rating: 4.8,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    precio: '$50/sesión'
  },
  {
    id: 2,
    nombre: 'Dra. Ana López',
    especialidad: 'Nutricionista',
    experiencia: '8 años',
    rating: 4.9,
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    precio: '$40/consulta'
  },
  {
    id: 3,
    nombre: 'Prof. Miguel Torres',
    especialidad: 'Fisioterapeuta',
    experiencia: '6 años',
    rating: 4.7,
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    precio: '$45/sesión'
  },
];

export default function Expertos() {
  const goToChatWithExpert = (experto: any) => {
    router.push({
      pathname: '/chat/[id]',
      params: { 
        id: experto.id,
        name: experto.nombre, 
        avatar: experto.avatar,
        chatId: `expert_${experto.id}`
      },
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={16} color="#FFD700" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFD700" />
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFD700" />
      );
    }
    
    return stars;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expertos Disponibles</Text>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {expertosMock.map((experto) => (
          <TouchableOpacity
            key={experto.id}
            style={styles.expertoCard}
            onPress={() => goToChatWithExpert(experto)}
          >
            <Image 
              source={{ uri: experto.avatar }} 
              style={styles.avatar}
            />
            
            <View style={styles.expertoInfo}>
              <View style={styles.headerInfo}>
                <Text style={styles.nombre}>{experto.nombre}</Text>
                <Text style={styles.precio}>{experto.precio}</Text>
              </View>
              
              <Text style={styles.especialidad}>{experto.especialidad}</Text>
              <Text style={styles.experiencia}>{experto.experiencia} de experiencia</Text>
              
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars(experto.rating)}
                </View>
                <Text style={styles.ratingText}>{experto.rating}</Text>
              </View>
            </View>
            
            <View style={styles.actionContainer}>
              <TouchableOpacity 
                style={styles.chatButton}
                onPress={() => goToChatWithExpert(experto)}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#0066CC" />
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8F8',
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_700Bold',
    color: '#0b111e',
    marginBottom: 20,
    marginTop: 15,
  },
  scrollView: {
    flex: 1,
  },
  expertoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  expertoInfo: {
    flex: 1,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nombre: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0b111e',
    flex: 1,
  },
  precio: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0066CC',
  },
  especialidad: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#666',
    marginBottom: 2,
  },
  experiencia: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#888',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#0b111e',
  },
  actionContainer: {
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#0066CC',
    marginLeft: 4,
  },
});
