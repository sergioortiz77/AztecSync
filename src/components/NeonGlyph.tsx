import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import { Glyph } from '../data/glyphs';

interface NeonGlyphProps {
  glyph: Glyph;
  size?: number;
}

export const NeonGlyph: React.FC<NeonGlyphProps> = ({ glyph, size = 200 }) => {
  const glowOpacity = useSharedValue(0.6);

  useEffect(() => {
    // Basic breathing animation
    glowOpacity.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    // In React Native, shadowColor works on iOS. On Android use elevation.
    // On Web, this might need platform specific styles, but we keep it simple here.
    shadowColor: glyph.color,
    shadowOpacity: 0.8,
    shadowRadius: 20,
  }));

  // Using picsum as placeholder because local assets might not exist in this context.
  // In production, use: source={{ uri: glyph.imagePath }} or require(path)
  const imageUrl = `https://picsum.photos/seed/${glyph.name}/400/400`;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Glow Layer */}
      <Animated.View style={[
        styles.glowContainer, 
        animatedGlow,
        { 
            // Inline style fallback for web preview to ensure color shows up
            shadowColor: glyph.color,
        }
      ]}>
        <View style={[styles.innerGlow, { borderColor: glyph.color, shadowColor: glyph.color }]} />
      </Animated.View>

      {/* Actual Image */}
      <Image 
        source={{ uri: imageUrl }} 
        style={[styles.image, { tintColor: glyph.color }]} 
        resizeMode="contain" 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glowContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerGlow: {
    width: '80%',
    height: '80%',
    borderRadius: 20,
    borderWidth: 2,
    opacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    shadowOpacity: 0.8,
    // Elevation for Android
    elevation: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    zIndex: 2,
  },
});