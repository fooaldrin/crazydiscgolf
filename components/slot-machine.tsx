import { ThemedText } from '@/components/themed-text';
import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface SlotMachineProps {
  currentRoll: string;
  isAnimating: boolean;
}

export function SlotMachine({ currentRoll, isAnimating }: SlotMachineProps) {
  const scrollAnim = useRef(new Animated.Value(0)).current;
  const ITEM_HEIGHT = 72;
  
  useEffect(() => {
    if (isAnimating) {
      scrollAnim.setValue(0);
      Animated.timing(scrollAnim, {
        toValue: ITEM_HEIGHT * 20,
        duration: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [isAnimating, scrollAnim]);

  return (
    <View style={styles.slotMachineContainer}>
      <View style={styles.slotMachine}>
        <View style={styles.slotWindow}>
          <Animated.View 
            style={[
              styles.slotReel,
              {
                transform: [{
                  translateY: scrollAnim.interpolate({
                    inputRange: [0, ITEM_HEIGHT * 20],
                    outputRange: [0, -(ITEM_HEIGHT * 20)],
                  })
                }]
              }
            ]}
          >
            {Array(21).fill(currentRoll).map((_, index) => (
              <View key={index} style={[styles.slotItem, { height: ITEM_HEIGHT }]}>
                <ThemedText style={styles.slotText}>{currentRoll}</ThemedText>
              </View>
            ))}
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slotMachineContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  slotMachine: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#85D1DB',
    overflow: 'hidden',
  },
  slotWindow: {
    height: 72,
    overflow: 'hidden',
    backgroundColor: '#C9FDF2',
  },
  slotReel: {
    width: '100%',
  },
  slotItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    fontFamily: 'Slackey_400Regular',
    lineHeight: 40, // Add lineHeight to prevent clipping
  },
});
