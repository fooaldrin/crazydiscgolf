import { ModalButton } from '@/components/buttons';
import { ThemedText } from '@/components/themed-text';
import { UI_TEXT } from '@/constants/ui-text';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuitConfirmModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export function QuitConfirmModal({ onCancel, onConfirm }: QuitConfirmModalProps) {
  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity 
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onCancel}
      />
      <View style={styles.modalContent}>
        <ThemedText type="subtitle" style={styles.modalTitle}>
          {UI_TEXT.GAME_QUIT_CONFIRM_TITLE}
        </ThemedText>
        <ThemedText style={styles.modalMessage}>
          {UI_TEXT.GAME_QUIT_CONFIRM_MESSAGE}
        </ThemedText>
        <View style={styles.modalButtons}>
          <ModalButton 
            title={UI_TEXT.GAME_QUIT_CONFIRM_CANCEL}
            onPress={onCancel}
            variant="cancel"
          />
          <ModalButton 
            title={UI_TEXT.GAME_QUIT_CONFIRM_QUIT}
            onPress={onConfirm}
            variant="danger"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#85D1DB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333333',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    color: '#666666',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
});
