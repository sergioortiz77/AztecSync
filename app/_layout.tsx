import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync("#00000000");
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="help" options={{ presentation: 'modal' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />

      {/* Menú Principal */}
      <Stack.Screen name="settings" options={{ presentation: 'card' }} />

      {/* Preferencias / Ajustes Reales */}
      <Stack.Screen name="preferences" options={{ presentation: 'card', title: 'Ajustes' }} />

      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}