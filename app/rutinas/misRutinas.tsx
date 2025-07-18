

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const savedRoutines = [
  'Potencia Total: Ganancia de Fuerza y Volumen',
  'Cardio Intenso y Resistencia Extrema',
  'Definición y Calistenia',
  'Fluidez Articular: Movilidad y Prevención de Lesiones',
  'Core & Glúteos',
];

const autoRoutines = [
  'HIIT para todas las edades',
  'Full body workout',
];

export default function MisRutinas() {
  const router = useRouter();
  const handleGoBack = () => {
    router.replace('/(tabs)/home');
  };
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
      contentContainerStyle={{
        paddingBottom: 32,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <TouchableOpacity style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 6 }} onPress={handleGoBack}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#222' }}>Mis rutinas</Text>
        <TouchableOpacity style={{ backgroundColor: '#F7F8F8', borderRadius: 8, padding: 6 }} onPress={() => router.push('/rutinas/newRutina')}>
          <Ionicons name="add" size={24} color="#222" />
        </TouchableOpacity>
      </View>

      {/* Guardadas */}
      <Text style={{ color: '#888', fontSize: 14, marginBottom: 8 }}>Guardadas</Text>
      {savedRoutines.map((title, idx) => (
        <TouchableOpacity key={idx} style={{ backgroundColor: '#F7F8F8', borderRadius: 8, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: '#222', fontSize: 15, flex: 1 }}>{title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
      ))}

      {/* Generadas automáticamente */}
      <Text style={{ color: '#888', fontSize: 14, marginTop: 16, marginBottom: 8 }}>Generadas automáticamente</Text>
      {autoRoutines.map((title, idx) => (
        <TouchableOpacity key={idx} style={{ backgroundColor: '#F7F8F8', borderRadius: 8, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: '#222', fontSize: 15, flex: 1 }}>{title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
