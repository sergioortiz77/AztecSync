// This file mocks Native Modules that don't exist in a web browser

// Mock expo-location
export const requestForegroundPermissionsAsync = async () => ({ status: 'granted' });

export const getCurrentPositionAsync = async () => ({
  coords: {
    latitude: 19.4352,
    longitude: -99.1312,
    altitude: 2240,
    accuracy: 5,
    altitudeAccuracy: 5,
    heading: 0,
    speed: 0
  },
  timestamp: Date.now()
});

// Mock expo-keep-awake
export const useKeepAwake = () => {
  // No-op for web
};

// Mock expo-blur
export const BlurView = ({ children, style }: any) => (
  <div style={{ ...style, backdropFilter: 'blur(10px)' }}>{children}</div>
);

// Mock expo-status-bar
export const StatusBar = () => null;
