import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const rutinas = [
  {
    id: 1,
    nombre: 'Potencia Total: Ganancia de Fuerza y Volumen',
    descripcion: 'Sentadilla con Barra, Press de Banca, Peso Muerto, Press Militar con Mancuernas, Remo con Barra',
    selected: false,
  },
  {
    id: 2,
    nombre: 'Cardio Intenso y Resistencia Extrema',
    descripcion: 'Burpees, Saltos de Tijera, Sprint en el Lugar, Mountain Climbers, Zancadas con Salto',
    selected: true,
  },
  {
    id: 3,
    nombre: 'Definición y Calistenia',
    descripcion: 'Dominadas, Flexiones, Fondos en Paralelas, Sentadilla Búlgara, Elevación de Piernas Colgado',
    selected: false,
  },
  {
    id: 4,
    nombre: 'Fluidez Articular: Movilidad y Prevención de Lesiones',
    descripcion: 'Burpees, Saltos de Tijera, Sprint en el Lugar, Mountain Climbers, Zancadas con Salto',
    selected: false,
  },
  {
    id: 5,
    nombre: 'Core & Glúteos',
    descripcion: 'Plancha, Puente de Glúteos, Superman, Sentadilla Sumo con Mancuerna, Elevaciones de Piernas Laterales',
    selected: false,
  },
];

export default function ListaRutinas() {
  const router = useRouter();
  const handleSelect = (rutina) => {
    router.replace({ pathname: '/calendar/new', params: { rutina: rutina.nombre } });
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingTop: 40, paddingBottom: 18 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
          <Ionicons name="chevron-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#222' }}>Lista de rutinas</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 24 }}>
        {rutinas.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={{
              backgroundColor: r.selected ? '#F7F3F2' : 'transparent',
              borderRadius: 14,
              marginBottom: 12,
              padding: 12,
            }}
            onPress={() => handleSelect(r)}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 2 }}>{r.nombre}</Text>
            <Text style={{ color: '#bdbdbd', fontSize: 14 }}>{r.descripcion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
