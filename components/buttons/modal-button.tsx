import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ModalButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'danger' | 'cancel';
}

export function ModalButton({ title, onPress, variant = 'primary' }: ModalButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'danger':
        return styles.dangerButton;
      case 'cancel':
        return styles.cancelButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'danger':
        return styles.dangerText;
      case 'cancel':
        return styles.cancelText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={getVariantStyle()}>
        <Text style={getTextStyle()}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#B6F2D1',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#85D1DB',
  },
  cancelButton: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  dangerButton: {
    backgroundColor: '#FFB3BA',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF8C94',
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333333',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#666666',
  },
  dangerText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#CC0000',
  },
});
