import { View } from 'react-native';

// Mock Component
const AnimatedView = ({ style, children, ...props }: any) => {
  // Flatten styles if they contain shared values (simplified for mock)
  return <View style={style} {...props}>{children}</View>;
};

export default {
  View: AnimatedView,
  createAnimatedComponent: (c: any) => c,
};

// Mock Hooks
export const useSharedValue = (initialValue: any) => ({ value: initialValue });
export const useAnimatedStyle = (fn: any) => {
  // In a real app this returns a worklet, here we just return an empty object 
  // or simple styles to prevent crashes.
  try {
    return fn() || {};
  } catch (e) {
    return {};
  }
};

// Mock Animation Functions
export const withRepeat = (val: any) => val;
export const withTiming = (val: any) => val;
export const Easing = {
  inOut: () => {},
  ease: () => {},
};

// Export Animated object as default fallback
export const Animated = {
  View: AnimatedView
};
