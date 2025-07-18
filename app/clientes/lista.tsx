import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const clientes = [
  {
    id: 1,
    nombre: 'Dana Villegas',
    objetivo: 'Bajar de peso',
    avatar: null, // Simulación de imagen
    selected: true,
  },
  {
    id: 2,
    nombre: 'Juan Velasco',
    objetivo: 'Aumento de masa muscular',
    avatar: null,
    selected: false,
  },
  {
    id: 3,
    nombre: 'Nicolás Jaramillo',
    objetivo: 'Aumentar fuerza',
    avatar: null,
    selected: false,
  },
  {
    id: 4,
    nombre: 'Juana Castrillón',
    objetivo: 'Mejorar salud general',
    avatar: null,
    selected: false,
  },
];

export default function ListaClientes() {
  const router = useRouter();
  const handleSelect = (cliente) => {
    router.replace({ pathname: '/calendar/new', params: { cliente: cliente.nombre } });
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 40, paddingBottom: 18 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222' }}>Lista de clientes</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}>
        {clientes.map((c, idx) => (
          <TouchableOpacity
            key={c.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: c.selected ? '#F7F3F2' : 'transparent',
              borderRadius: 14,
              marginBottom: 12,
              padding: 6,
            }}
            onPress={() => handleSelect(c)}
          >
            <View style={{ width: 48, height: 48, borderRadius: 24, marginRight: 14, backgroundColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person" size={28} color="#fff" />
            </View>
            <View>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222' }}>{c.nombre}</Text>
              <Text style={{ color: '#bdbdbd', fontSize: 14 }}>{c.objetivo}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
