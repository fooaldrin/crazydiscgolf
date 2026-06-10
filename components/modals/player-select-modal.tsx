import { ThemedText } from '@/components/themed-text';
import { UI_TEXT } from '@/constants/ui-text';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface Player {
  name: string;
  throwsPerHole: any[][];
}

interface PlayerSelectModalProps {
  players: Player[];
  currentHole: number;
  isStartOfHole: boolean;
  playersFinishedCurrentHole: Set<number>;
  currentPlayerIndex: number;
  onSelectPlayer: (index: number) => void;
}

export function PlayerSelectModal({
  players,
  currentHole,
  isStartOfHole,
  playersFinishedCurrentHole,
  currentPlayerIndex,
  onSelectPlayer,
}: PlayerSelectModalProps) {
  return (
    <View style={styles.modalOverlay}>
      <TouchableOpacity 
        style={styles.modalBackdrop}
        activeOpacity={1}
      />
      <View style={styles.modalContent}>
        <ThemedText type="subtitle" style={styles.modalTitle}>
          {isStartOfHole ? UI_TEXT.PLAYER_SELECT_WHO_FIRST : UI_TEXT.PLAYER_SELECT_WHO_NEXT}
        </ThemedText>
        <ThemedText style={styles.modalMessage}>
          {isStartOfHole 
            ? UI_TEXT.PLAYER_SELECT_TEE_OFF 
            : UI_TEXT.PLAYER_SELECT_THROW_NEXT}
        </ThemedText>
        <View style={styles.playerSelectList}>
          {players.map((player, index) => {
            const isFinished = playersFinishedCurrentHole.has(index);
            
            // Don't show players who have finished
            if (isFinished) return null;
            
            const throwCount = player.throwsPerHole?.[currentHole]?.length || 0;
            
            return (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.playerSelectButton,
                  index === currentPlayerIndex && !isStartOfHole && styles.playerSelectButtonCurrent
                ]}
                onPress={() => onSelectPlayer(index)}
              >
                <ThemedText style={styles.playerSelectName}>{player.name}</ThemedText>
                {!isStartOfHole && (
                  <ThemedText style={styles.playerSelectThrows}>
                    {UI_TEXT.PLAYER_SELECT_THROWS(throwCount)} so far
                  </ThemedText>
                )}
              </TouchableOpacity>
            );
          })}
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
    maxHeight: '70%',
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
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666666',
  },
  playerSelectList: {
    gap: 10,
  },
  playerSelectButton: {
    backgroundColor: '#C9FDF2',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#85D1DB',
  },
  playerSelectButtonCurrent: {
    backgroundColor: '#B6F2D1',
    borderColor: '#5FB882',
  },
  playerSelectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  playerSelectThrows: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
});
