// app/(tabs)/profile.tsx

import { useAuth } from "@/app/context/AuthContext";
import { CalificacionesComponent } from "@/components/CalificacionesComponent";
import { InputCustom } from "@/components/InputCustom";
import { useCalificaciones } from "@/hooks/useCalificaciones";
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Profile() {
  const { user, token, isLoading } = useAuth();
  const { stats: calificacionesStats, loading: loadingCalificaciones } = useCalificaciones();
  
  // Log detallado para verificar los datos del usuario
  console.log('=== PROFILE DEBUG ===');
  console.log('isLoading:', isLoading);
  console.log('token exists:', !!token);
  console.log('user object:', user);
  console.log('user name:', user?.name);
  console.log('user role:', user?.role);
  console.log('user tarifa:', user?.tarifa);
  console.log('user moneda:', user?.moneda);
  console.log('user periodo_facturacion:', user?.periodo_facturacion);
  console.log('user descripcion:', user?.descripcion);
  console.log('user objetivo:', user?.objetivo);
  console.log('user especialidades:', user?.especialidades);
  console.log('user telefono:', user?.telefono);
  console.log('user direccion:', user?.direccion);
  console.log('user horario:', user?.horario);
  console.log('user instalaciones:', user?.instalaciones);
  console.log('==================');
  
  // Estados basados en el rol del usuario
  const [tarifa, setTarifa] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // Actualizar los estados cuando el usuario cambie
  useEffect(() => {
    if (user) {
      // Tarifa para entrenadores y nutricionistas
      if (user.role === 'entrenador' || user.role === 'nutricionista') {
        setTarifa(user.tarifa || '');
      }
      
      // Descripción para todos los roles
      if (user.role === 'gimnasio') {
        setDescripcion(user.descripcion || '');
      } else if (user.role === 'cliente') {
        setDescripcion(user.objetivo || ''); // Para clientes, mostrar objetivo
      } else {
        setDescripcion(user.descripcion || ''); // Para entrenadores/nutricionistas
      }
    }
  }, [user]);

  const formatTarifa = () => {
    if (!user?.tarifa || !user?.moneda) return '';
    
    const periodo = user.periodo_facturacion === 'mensual' ? 'mes' : 
                   user.periodo_facturacion === 'semanal' ? 'semana' : 'sesión';
    
    return `${user.tarifa} ${user.moneda} / ${periodo}`;
  };

  const getDescriptionLabel = () => {
    switch (user?.role) {
      case 'cliente':
        return 'Mi objetivo';
      case 'gimnasio':
        return 'Acerca del gimnasio';
      default:
        return 'Acerca de mí';
    }
  };

  const getDescriptionPlaceholder = () => {
    switch (user?.role) {
      case 'cliente':
        return 'Describe tu objetivo fitness...';
      case 'gimnasio':
        return 'Describe las instalaciones y servicios...';
      default:
        return 'Cuéntanos sobre ti...';
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      'cliente': 'Cliente',
      'entrenador': 'Entrenador Personal',
      'nutricionista': 'Nutricionista',
      'gimnasio': 'Gimnasio'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getSpecialtyDisplayName = (specialty: string) => {
    const specialtyNames = {
      'fuerza': 'Fuerza',
      'resistencia': 'Resistencia',
      'movilidad': 'Movilidad',
      'cardio': 'Cardio',
      'nutricion_deportiva': 'Nutrición Deportiva',
      'perdida_peso': 'Pérdida de Peso',
      'nutricion_clinica': 'Nutrición Clínica',
      'suplementacion': 'Suplementación'
    };
    return specialtyNames[specialty as keyof typeof specialtyNames] || specialty;
  };

  const getAvatarUri = () => {
    if (user?.profile_pic) {
      return user.profile_pic;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Usuario')}&background=FF6A3D&color=ffffff&size=120`;
  };

  const goToSettings = () => {
    router.push('/settings');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>
          Perfil
        </Text>
        <TouchableOpacity style={styles.settingsIcon} onPress={goToSettings}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Contenido principal */}
        <View style={styles.formContainer}>
          
          {/* Avatar centrado */}
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: getAvatarUri() }} 
              style={styles.profileAvatar}
            />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="pencil" size={12} color="white" />
            </TouchableOpacity>
          </View>

          {/* Nombre del usuario */}
          <InputCustom
            label="Nombre completo"
            value={user?.name || 'Pedro Morín'}
            onChangeText={() => {}} // Solo lectura por ahora
            placeholder="Nombre completo"
            icon={
              <Feather
                name="user"
                size={16}
                color="#6B7280"
              />
            }
            style={styles.inputField}
          />

          {/* Email */}
          <InputCustom
            label="Email"
            value={user?.email || 'correo@ejemplo.com'}
            onChangeText={() => {}} // Solo lectura por ahora
            placeholder="Email"
            icon={
              <Feather
                name="mail"
                size={16}
                color="#6B7280"
              />
            }
            style={styles.inputField}
          />

          {/* Rol */}
          <InputCustom
            label="Tipo de usuario"
            value={getRoleDisplayName(user?.role || 'entrenador')}
            onChangeText={() => {}} // Solo lectura
            placeholder="Tipo de usuario"
            icon={
              <Feather
                name="shield"
                size={16}
                color="#6B7280"
              />
            }
            style={styles.inputField}
          />

          {/* Especialidades (solo para entrenadores y nutricionistas) */}
          {user?.especialidades && (
            <InputCustom
              label="Especialidades"
              value={getSpecialtyDisplayName(user.especialidades)}
              onChangeText={() => {}} // Solo lectura
              placeholder="Especialidades"
              icon={
                <Feather
                  name="award"
                  size={16}
                  color="#6B7280"
                />
              }
              style={styles.inputField}
            />
          )}

          {/* Tarifa (solo para entrenadores y nutricionistas) */}
          {user?.role !== 'cliente' && (
            <InputCustom
              label="Mi tarifa"
              value={tarifa}
              onChangeText={setTarifa}
              placeholder={`Ingresa tu tarifa (${user?.moneda || 'COP'})`}
              keyboardType="numeric"
              icon={
                <Feather
                  name="dollar-sign"
                  size={16}
                  color="#6B7280"
                />
              }
              style={styles.inputField}
            />
          )}

          {/* Calificaciones (solo para no clientes) */}
          {user?.role !== 'cliente' && (
            <View style={styles.calificacionesContainer}>
              <Text style={styles.sectionTitle}>Mis calificaciones</Text>
              <View style={styles.calificacionesContent}>
                <CalificacionesComponent
                  promedio={calificacionesStats?.promedio}
                  totalCalificaciones={calificacionesStats?.total_calificaciones}
                  loading={loadingCalificaciones}
                  showText={true}
                />
                {calificacionesStats?.total_calificaciones && calificacionesStats.total_calificaciones > 0 && (
                  <TouchableOpacity 
                    style={styles.verMasButton}
                    onPress={() => router.push('/calificaciones-detalle')}
                  >
                    <Text style={styles.verMasText}>Ver todas las reseñas</Text>
                    <Feather name="chevron-right" size={16} color="#FF6A3D" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}

          {/* Descripción / Objetivo */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{getDescriptionLabel()}</Text>
            <View style={styles.textAreaContainer}>
              <Feather
                name="info"
                size={16}
                color="#6B7280"
                style={styles.textAreaIcon}
              />
              <TextInput
                style={styles.textArea}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder={getDescriptionPlaceholder()}
                placeholderTextColor="#A1A1AA"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === "ios" ? 50 : 35,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#222',
    textAlign: 'center',
  },
  settingsIcon: {
    padding: 10,
    backgroundColor: '#F7F8F8',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 30,
    paddingTop: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f3f4f6',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#FF6A3D',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  inputField: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  calificacionesContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  calificacionesContent: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  verMasButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 8,
  },
  verMasText: {
    color: '#FF6A3D',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textAreaContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 15,
    paddingVertical: 12,
    minHeight: 100,
  },
  textAreaIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  textArea: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    textAlignVertical: 'top',
    lineHeight: 20,
  },
});
