import { ThemedText } from '@/components/themed-text';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface GameButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'continue' | 'basket' | 'reroll';
}

export function GameButton({ title, variant = 'continue', style, ...props }: GameButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'basket':
        return styles.basketButton;
      case 'reroll':
        return styles.rerollButton;
      default:
        return styles.continueButton;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        getVariantStyle(),
        props.disabled && styles.buttonDisabled,
        style
      ]} 
      {...props}
    >
      <ThemedText style={styles.buttonText}>{title}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 0,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButton: {
    backgroundColor: '#B6F2D1',
  },
  basketButton: {
    backgroundColor: '#FFD166',
  },
  rerollButton: {
    backgroundColor: '#C9FDF2',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: 'Slackey_400Regular',
    lineHeight: 24, // Add lineHeight to prevent clipping
  },
});
