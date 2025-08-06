import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRoutines } from '../../hooks/useRoutines';
import { useAuth } from '../context/AuthContext';

export default function MisRutinas() {
  const router = useRouter();
  const { savedRoutines, autoRoutines, loading } = useRoutines();
  const { user } = useAuth();
  const handleGoBack = () => {
    router.replace('/(tabs)/home');
  };

  if (user?.role !== 'entrenador') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ color: '#222', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Acceso solo para entrenadores</Text>
        <TouchableOpacity onPress={handleGoBack} style={{ marginTop: 20, backgroundColor: '#F7F8F8', borderRadius: 8, padding: 10 }}>
          <Text style={{ color: '#222' }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}
      contentContainerStyle={{
        paddingBottom: 32,
        paddingTop: Platform.OS === "ios" ? 50 : 35,
        paddingHorizontal: 20,
      }}
      showsVerticalScrollIndicator={false}
    >
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
      {loading && <Text style={{ color: '#888', marginBottom: 8 }}>Cargando...</Text>}
      {savedRoutines.length === 0 && !loading && (
        <Text style={{ color: '#bbb', fontSize: 14, marginBottom: 8 }}>No tienes rutinas guardadas.</Text>
      )}
      {savedRoutines.map((routine) => (
        <TouchableOpacity
          key={routine.id}
          style={{ backgroundColor: '#F7F8F8', borderRadius: 8, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          onPress={() => router.push({ pathname: '/rutinas/DetalleRutina', params: { id: routine.id } })}
        >
          <Text style={{ color: '#222', fontSize: 15, flex: 1 }}>{routine.title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
      ))}

      {/* Generadas automáticamente */}
      <Text style={{ color: '#888', fontSize: 14, marginTop: 16, marginBottom: 8 }}>Generadas automáticamente</Text>
      {autoRoutines.length === 0 && !loading && (
        <Text style={{ color: '#bbb', fontSize: 14, marginBottom: 8 }}>No tienes rutinas automáticas.</Text>
      )}
      {autoRoutines.map((routine) => (
        <TouchableOpacity
          key={routine.id}
          style={{ backgroundColor: '#F7F8F8', borderRadius: 8, marginBottom: 10, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          onPress={() => router.push({ pathname: '/rutinas/DetalleRutina', params: { id: routine.id } })}
        >
          <Text style={{ color: '#222', fontSize: 15, flex: 1 }}>{routine.title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#222" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

