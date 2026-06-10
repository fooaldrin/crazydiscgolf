import { ThemedText } from '@/components/themed-text';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'default' | 'large';
}

export function PrimaryButton({ title, variant = 'default', style, ...props }: PrimaryButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        variant === 'large' && styles.buttonLarge,
        props.disabled && styles.buttonDisabled,
        style
      ]} 
      {...props}
    >
      <ThemedText style={[
        styles.buttonText,
        variant === 'large' && styles.buttonTextLarge
      ]}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#B6F2D1',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#85D1DB',
  },
  buttonLarge: {
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 30,
    borderWidth: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  buttonTextLarge: {
    fontSize: 32,
  },
});
