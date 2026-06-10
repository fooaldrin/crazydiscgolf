import { ThemedText } from '@/components/themed-text';
import { UI_TEXT } from '@/constants/ui-text';
import { useRouter } from 'expo-router';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function IntroScreen() {
  const router = useRouter();

  const handleLetsPlay = () => {
    router.push('/');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/splash-icon.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={handleLetsPlay}
            >
              <ThemedText style={styles.playButtonText}>{UI_TEXT.INTRO_LETS_PLAY}</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Light overlay to ensure button is visible
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#B6F2D1',
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#85D1DB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playButtonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
  },
});
