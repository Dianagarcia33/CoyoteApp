import { DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';

export const MyLightTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: '#1E40AF',
    background: '#F0F4FF',
    card: '#FFFFFF',
    text: '#111827',
    border: '#E5E7EB',
    notification: '#EF4444',
  },
};

export const MyDarkTheme = {
  ...NavigationDarkTheme,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: '#2563EB',
    background: '#0b111e',
    card: '#374151',
    text: '#F9FAFB',
    border: '#4B5563',
    notification: '#F87171',
  },
};
