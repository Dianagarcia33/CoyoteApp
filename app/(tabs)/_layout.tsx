import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { LogBox, Platform } from 'react-native';

import { useAuth } from '@/app/context/AuthContext';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

LogBox.ignoreLogs([
  "Warning: Text strings must be rendered within a <Text> component",
]);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();



  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      {/* Home - común para todos */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />

      {/* Calendario - solo para cliente, entrenador y nutricionista (NO gym) */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendario',
          tabBarIcon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
          href: user?.role === 'gym' ? null : '/calendar',
        }}
      />

      {/* Clientes - solo para entrenador, nutricionista y gym (NO cliente) */}
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clientes',
          tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
          href: user?.role === 'cliente' ? null : '/clients',
        }}
      />

      {/* Expertos - solo para cliente */}
      <Tabs.Screen
        name="expertos"
        options={{
          title: 'Expertos',
          tabBarIcon: ({ color }) => <Feather name="users" size={24} color={color} />,
          href: user?.role === 'cliente' ? '/expertos' : null,
        }}
      />

      {/* Tienda - común para todos */}
      <Tabs.Screen
        name="shop"
        options={{
          title: 'Tienda',
          tabBarIcon: ({ color }) => <Feather name="shopping-cart" size={24} color={color} />,
        }}
      />

      {/* Perfil - común para todos */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
