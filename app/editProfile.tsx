import { ButtonCustom } from '@/components/ButtonCustom';
import { InputCustom } from '@/components/InputCustom';
import { SelectDropdownCustom } from '@/components/SelectCustom';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';
import { useAuth } from './context/AuthContext';

export default function EditProfileScreen() {
  const { user, token, login } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Estados para campos comunes
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para contacto de emergencia
  const [contactoEmergenciaNombre, setContactoEmergenciaNombre] = useState('');
  const [contactoEmergenciaTelefono, setContactoEmergenciaTelefono] = useState('');
  const [contactoEmergenciaRelacion, setContactoEmergenciaRelacion] = useState('');

  // Estados específicos por rol
  const [objetivo, setObjetivo] = useState('');
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [tarifa, setTarifa] = useState('');
  const [moneda, setMoneda] = useState('COP');
  const [periodoFacturacion, setPeriodoFacturacion] = useState('mensual');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horario, setHorario] = useState('');
  const [instalaciones, setInstalaciones] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setContactoEmergenciaNombre(user.contacto_emergencia_nombre || '');
      setContactoEmergenciaTelefono(user.contacto_emergencia_telefono || '');
      setContactoEmergenciaRelacion(user.contacto_emergencia_relacion || '');

      // Campos específicos por rol
      if (user.role === 'cliente') {
        setObjetivo(user.objetivo || '');
      }

      if (user.role === 'entrenador' || user.role === 'nutricionista') {
        setEspecialidades(user.especialidades ? [user.especialidades] : []);
        setTarifa(user.tarifa || '');
        setMoneda(user.moneda || 'COP');
        setPeriodoFacturacion(user.periodo_facturacion || 'mensual');
      }

      if (user.role === 'gimnasio') {
        setTelefono(user.telefono || '');
        setDireccion(user.direccion || '');
        setDescripcion(user.descripcion || '');
        setHorario(user.horario || '');
        setInstalaciones(user.instalaciones || '');
      }
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'El nombre es requerido';
    if (!email.trim()) newErrors.email = 'El email es requerido';
    
    if (password && password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (password && password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validaciones específicas por rol
    if (user?.role === 'cliente' && !objetivo) {
      newErrors.objetivo = 'El objetivo es requerido';
    }

    if ((user?.role === 'entrenador' || user?.role === 'nutricionista')) {
      if (especialidades.length === 0) newErrors.especialidades = 'Selecciona al menos una especialidad';
      if (!tarifa) newErrors.tarifa = 'La tarifa es requerida';
    }

    if (user?.role === 'gimnasio') {
      if (!telefono) newErrors.telefono = 'El teléfono es requerido';
      if (!direccion) newErrors.direccion = 'La dirección es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    
    try {
      const payload: any = {
        name,
        email,
        contacto_emergencia_nombre: contactoEmergenciaNombre,
        contacto_emergencia_telefono: contactoEmergenciaTelefono,
        contacto_emergencia_relacion: contactoEmergenciaRelacion,
      };

      // Solo incluir contraseña si se está cambiando
      if (password) {
        payload.password = password;
        payload.password_confirmation = confirmPassword;
      }

      // Campos específicos por rol
      if (user?.role === 'cliente') {
        payload.objetivo = objetivo;
      }

      if (user?.role === 'entrenador' || user?.role === 'nutricionista') {
        payload.especialidades = especialidades[0] || '';
        payload.tarifa = tarifa;
        payload.moneda = moneda;
        payload.periodo_facturacion = periodoFacturacion;
      }

      if (user?.role === 'gimnasio') {
        payload.telefono = telefono;
        payload.direccion = direccion;
        payload.descripcion = descripcion;
        payload.horario = horario;
        payload.instalaciones = instalaciones;
      }

      console.log('🔄 Actualizando perfil:', payload);

      const response = await fetch('http://192.168.18.84:8000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar el contexto con los nuevos datos
        await login(data.user, token!);
        
        Alert.alert('Éxito', 'Perfil actualizado correctamente', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        console.error('❌ Error del servidor:', data);
        Alert.alert('Error', data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6A3D" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0b111e' : '#ffffff' }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
          Editar mis datos
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Información básica */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
            Información Personal
          </Text>

          <InputCustom
            label="Nombre completo"
            value={name}
            onChangeText={setName}
            placeholder="Nombre completo"
            icon={<Ionicons name="person" size={16} color={isDarkMode ? '#fff' : '#666'} />}
            isDarkMode={isDarkMode}
            errorMessage={errors.name}
            style={{ marginBottom: 12 }}
          />

          <InputCustom
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            icon={<Ionicons name="mail" size={16} color={isDarkMode ? '#fff' : '#666'} />}
            isDarkMode={isDarkMode}
            keyboardType="email-address"
            errorMessage={errors.email}
            style={{ marginBottom: 12 }}
          />

          {/* Cambiar contraseña */}
          <Text style={[styles.subsectionTitle, { color: isDarkMode ? '#ccc' : '#666' }]}>
            Cambiar contraseña (opcional)
          </Text>

          <InputCustom
            label="Nueva contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Nueva contraseña"
            icon={<Ionicons name="lock-closed" size={16} color={isDarkMode ? '#fff' : '#666'} />}
            isDarkMode={isDarkMode}
            secureTextEntry
            errorMessage={errors.password}
            style={{ marginBottom: 12 }}
          />

          <InputCustom
            label="Confirmar contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirmar contraseña"
            icon={<Ionicons name="lock-closed" size={16} color={isDarkMode ? '#fff' : '#666'} />}
            isDarkMode={isDarkMode}
            secureTextEntry
            errorMessage={errors.confirmPassword}
            style={{ marginBottom: 12 }}
          />
        </View>

        {/* Campos específicos por rol */}
        {user.role === 'cliente' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
              Objetivo de Entrenamiento
            </Text>

            <SelectDropdownCustom
              value={objetivo}
              setValue={setObjetivo}
              options={[
                { label: "Perdida de peso", value: "perdidaPeso" },
                { label: "Aumento de masa muscular", value: "aumentoMasa" },
                { label: "Mejorar resistencia", value: "mejorarResistencia" },
                { label: "Aumentar fuerza", value: "aumentarFuerza" },
                { label: "Mejorar flexibilidad", value: "mejorarFlexibilidad" },
                { label: "Mejorar salud en general", value: "mejorarSalud" },
                { label: "Rehabilitacion", value: "rehabilitacion" },
              ]}
              placeholder="Selecciona tu objetivo"
              isDarkMode={isDarkMode}
              icon={<Ionicons name="fitness" size={16} color="#374151" />}
              errorMessage={errors.objetivo}
            />
          </View>
        )}

        {(user.role === 'entrenador' || user.role === 'nutricionista') && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
              Información Profesional
            </Text>

            <SelectDropdownCustom
              value={especialidades[0] || ''}
              setValue={(val) => setEspecialidades([val])}
              options={user.role === 'entrenador' ? [
                { label: "Fuerza", value: "fuerza" },
                { label: "Resistencia", value: "resistencia" },
                { label: "Movilidad", value: "movilidad" },
                { label: "Cardio", value: "cardio" },
              ] : [
                { label: "Nutrición deportiva", value: "nutricion_deportiva" },
                { label: "Pérdida de peso", value: "perdida_peso" },
                { label: "Nutrición clínica", value: "nutricion_clinica" },
                { label: "Suplementación", value: "suplementacion" },
              ]}
              placeholder="Especialidad"
              isDarkMode={isDarkMode}
              icon={<Ionicons name="briefcase" size={16} color="#374151" />}
              errorMessage={errors.especialidades}
              containerStyle={{ marginBottom: 12 }}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <InputCustom
                  label="Tarifa"
                  value={tarifa}
                  onChangeText={setTarifa}
                  placeholder="Tarifa"
                  icon={<Ionicons name="cash" size={16} color={isDarkMode ? '#fff' : '#666'} />}
                  isDarkMode={isDarkMode}
                  keyboardType="numeric"
                  errorMessage={errors.tarifa}
                />
              </View>

              <View style={styles.halfWidth}>
                <SelectDropdownCustom
                  value={moneda}
                  setValue={setMoneda}
                  options={[
                    { label: "COP", value: "COP" },
                    { label: "USD", value: "USD" },
                    { label: "EUR", value: "EUR" },
                  ]}
                  placeholder="Moneda"
                  isDarkMode={isDarkMode}
                  icon={<Ionicons name="card" size={16} color="#374151" />}
                />
              </View>
            </View>

            <SelectDropdownCustom
              value={periodoFacturacion}
              setValue={setPeriodoFacturacion}
              options={[
                { label: "Mensual", value: "mensual" },
                { label: "Semanal", value: "semanal" },
                { label: "Por sesión", value: "por_sesion" },
              ]}
              placeholder="Periodo de facturación"
              isDarkMode={isDarkMode}
              icon={<Ionicons name="calendar" size={16} color="#374151" />}
              containerStyle={{ marginTop: 12 }}
            />
          </View>
        )}

        {user.role === 'gimnasio' && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
              Información del Gimnasio
            </Text>

            <InputCustom
              label="Teléfono"
              value={telefono}
              onChangeText={setTelefono}
              placeholder="Teléfono de contacto"
              icon={<Ionicons name="call" size={16} color={isDarkMode ? '#fff' : '#666'} />}
              isDarkMode={isDarkMode}
              keyboardType="phone-pad"
              errorMessage={errors.telefono}
              style={{ marginBottom: 12 }}
            />

            <InputCustom
              label="Dirección"
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Dirección del gimnasio"
              icon={<Ionicons name="location" size={16} color={isDarkMode ? '#fff' : '#666'} />}
              isDarkMode={isDarkMode}
              errorMessage={errors.direccion}
              style={{ marginBottom: 12 }}
            />

            <InputCustom
              label="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Descripción del gimnasio"
              icon={<Ionicons name="document-text" size={16} color={isDarkMode ? '#fff' : '#666'} />}
              isDarkMode={isDarkMode}
              multiline
              numberOfLines={3}
              style={{ marginBottom: 12 }}
            />

            <InputCustom
              label="Horario"
              value={horario}
              onChangeText={setHorario}
              placeholder="Horario de atención"
              icon={<Ionicons name="time" size={16} color={isDarkMode ? '#fff' : '#666'} />}
              isDarkMode={isDarkMode}
              style={{ marginBottom: 12 }}
            />

            <InputCustom
              label="Instalaciones"
              value={instalaciones}
              onChangeText={setInstalaciones}
              placeholder="Descripción de instalaciones"
              icon={<Ionicons name="home" size={16} color={isDarkMode ? '#fff' : '#666'} />}
              isDarkMode={isDarkMode}
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* Contacto de emergencia */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
            Contacto de Emergencia
          </Text>

          <InputCustom
            label="Nombre del contacto"
            value={contactoEmergenciaNombre}
            onChangeText={setContactoEmergenciaNombre}
            placeholder="Nombre completo"
            icon={<Ionicons name="person-add" size={16} color={isDarkMode ? '#fff' : '#666'} />}
            isDarkMode={isDarkMode}
            style={{ marginBottom: 12 }}
          />

          <InputCustom
            label="Teléfono del contacto"
            value={contactoEmergenciaTelefono}
            onChangeText={setContactoEmergenciaTelefono}
            placeholder="Número de teléfono"
            icon={<Ionicons name="call" size={16} color={isDarkMode ? '#fff' : '#666'} />}
            isDarkMode={isDarkMode}
            keyboardType="phone-pad"
            style={{ marginBottom: 12 }}
          />

          <SelectDropdownCustom
            value={contactoEmergenciaRelacion}
            setValue={setContactoEmergenciaRelacion}
            options={[
              { label: "Padre/Madre", value: "padre" },
              { label: "Hermano/Hermana", value: "hermano" },
              { label: "Esposo/Esposa", value: "esposo" },
              { label: "Hijo/Hija", value: "hijo" },
              { label: "Amigo/Amiga", value: "amigo" },
              { label: "Otro", value: "otro" },
            ]}
            placeholder="Relación con el contacto"
            isDarkMode={isDarkMode}
            icon={<Ionicons name="people" size={16} color="#374151" />}
          />
        </View>
      </ScrollView>

      {/* Botón guardar */}
      <View style={styles.buttonContainer}>
        <ButtonCustom
          text={saving ? "Guardando..." : "Guardar cambios"}
          onPress={handleSave}
          disabled={saving}
          icon={saving ? undefined : <Ionicons name="save" size={20} color="white" />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 35,
    paddingBottom: 16,
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
  headerSpacer: {
    width: 40,
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
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
});
