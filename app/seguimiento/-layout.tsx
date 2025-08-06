import { Stack } from 'expo-router';

export default function SeguimientoLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="tallas" />
      <Stack.Screen name="peso" />
      <Stack.Screen name="marcas" />
    </Stack>
  );
}
