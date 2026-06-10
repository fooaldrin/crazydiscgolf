import { useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

export function useSlotMachineAnimation() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentRoll, setCurrentRoll] = useState('');
  const scrollAnim = useRef(new Animated.Value(0)).current;

  const animateRoll = (finalRoll: string, onComplete: () => void) => {
    setIsAnimating(true);
    setCurrentRoll(finalRoll);
    
    scrollAnim.setValue(0);
    
    Animated.timing(scrollAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setIsAnimating(false);
      onComplete();
    });
  };

  return {
    isAnimating,
    currentRoll,
    scrollAnim,
    animateRoll,
    setCurrentRoll,
  };
}
