import { Text, View } from '@/components/Themed';
import { useAztecTime } from '@/src/hooks/useAztecTime';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

export default function ModalScreen() {
  const { currentGlyph } = useAztecTime();

  // Auto-cierre después de 30 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      if (router.canGoBack()) router.back();
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#000000', '#111']} style={styles.container}>
      {/* StatusBar clara para fondo oscuro */}
      <StatusBar style="light" />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Título */}
          <Text style={styles.title}>Posición en la Rueda</Text>

          {/* Visualización del Puntero */}
          <View style={styles.pointerContainer}>
            {currentGlyph && (
              <>
                <Image
                  source={currentGlyph.wheelImage}
                  style={styles.wheelImage}
                  resizeMode="contain"
                />
                <Text style={styles.glyphName}>{currentGlyph.name}</Text>
                <Text style={styles.glyphMeaning}>{currentGlyph.meaning}</Text>
              </>
            )}
          </View>

          <Text style={styles.description}>
            El puntero indica el avance en cada uno de los 20 días
          </Text>

          {/* Botón cerrar */}
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeButtonText}>Volver al Sincronario</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    paddingTop: 40, // Espacio estándar adicional al Safe Area
    paddingBottom: 40
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00F0FF', // Cian Neón
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 30,
    textAlign: 'center',
  },
  pointerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  wheelImage: {
    width: height < 700 ? 260 : 320, // Imagen más pequeña en iPhone 8
    height: height < 700 ? 260 : 320,
    marginBottom: 20,
  },
  glyphName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    letterSpacing: 2,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowRadius: 10,
  },
  glyphMeaning: {
    fontSize: 20,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
  },
  description: {
    color: '#CCC',
    textAlign: 'center',
    fontSize: 15,
    maxWidth: '85%',
    lineHeight: 22,
    marginTop: 20,
  },
  closeButton: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButtonText: {
    color: '#00F0FF',
    fontSize: 14,
    fontWeight: '600',
  }
});
