import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

function CustomTabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: insets.bottom }]}>
      <LinearGradient
        colors={['rgba(0,0,0,0.95)', 'rgba(20,20,20,1)']}
        style={styles.gradientBackground}
      />

      {/* ROW 1: Main Actions */}
      <View style={styles.mainRow}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push('/(tabs)')}
        >
          <FontAwesome name="map-marker" size={24} color="#00F0FF" style={{ marginBottom: 4 }} />
          {/* Note: Using a placeholder character for the Glyph if custom font not loaded, or generic text */}
          <Text style={styles.mainButtonText}>AXKAN</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push('/modal')}
        >
          <FontAwesome name="sun-o" size={24} color="#FFD700" style={{ marginBottom: 4 }} />
          <Text style={[styles.mainButtonText, { color: '#FFD700' }]}>TONALPOHUALLI</Text>
        </TouchableOpacity>
      </View>

      {/* ROW 2: Utilities Navigation */}
      <View style={styles.utilityRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)')}>
          <FontAwesome name="home" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/help')}>
          <FontAwesome name="question-circle" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/sign-up')}>
          <FontAwesome name="user-plus" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(tabs)/two')}>
          <FontAwesome name="user" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings')}>
          <FontAwesome name="cog" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={() => <CustomTabBar />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { display: 'none' }, // System tab bar hidden, we use custom
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="two" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    backgroundColor: 'black',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  // ROW 1
  mainRow: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  mainButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  mainButtonText: {
    color: '#E0E0E0',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  glifoText: {
    color: '#00F0FF',
    fontSize: 20,
    marginBottom: 2,
    // Add fontFamily if Aztec glyph font is available
  },
  divider: {
    width: 1,
    height: '60%',
    backgroundColor: '#333',
  },

  // ROW 2
  utilityRow: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
