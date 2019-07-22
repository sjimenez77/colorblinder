import { Animated } from 'react-native';

export const shakeAnimation = (value: Animated.Value | Animated.ValueXY) => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: 50,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: -50,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 50,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: -50,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};
