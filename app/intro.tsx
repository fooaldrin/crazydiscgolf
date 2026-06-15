import { ThemedText } from "@/components/themed-text";
import { UI_TEXT } from "@/constants/ui-text";
import { useGamePersistence } from "@/hooks/use-game-persistence";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    Linking,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { loadGameState } = useGamePersistence();
  const [checkedSavedGame, setCheckedSavedGame] = useState(false);

  useEffect(() => {
    const checkSavedGame = async () => {
      const savedState = await loadGameState();
      // If a game is in progress, go straight to the Continue / Start New screen.
      if (savedState && savedState.screen !== "names") {
        router.replace("/");
        return;
      }
      setCheckedSavedGame(true);
    };
    checkSavedGame();
  }, [loadGameState, router]);

  const handleLetsPlay = () => {
    router.push("/");
  };

  // Avoid flashing the "Let's Play" screen before the saved-game check resolves.
  if (!checkedSavedGame) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.logoArea, { paddingTop: Math.max(20, insets.top) }]}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel={UI_TEXT.APP_TITLE}
        />
      </View>

      <View
        style={[
          styles.bottomArea,
          { paddingBottom: Math.max(40, insets.bottom + 40) },
        ]}
      >
        <TouchableOpacity style={styles.playButton} onPress={handleLetsPlay}>
          <ThemedText style={styles.playButtonText}>
            {UI_TEXT.INTRO_LETS_PLAY}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.credit}
          onPress={() => Linking.openURL(UI_TEXT.CREDIT_INSTAGRAM_URL)}
          accessibilityRole="link"
          accessibilityLabel={`${UI_TEXT.CREDIT_TEXT} on Instagram`}
        >
          <ThemedText style={styles.creditText}>
            {UI_TEXT.CREDIT_TEXT}
          </ThemedText>
          <ThemedText style={styles.creditLink}>@aldrin_discgolf</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9F1",
  },
  logoArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 260,
    height: 260,
  },
  bottomArea: {
    paddingHorizontal: 40,
    alignItems: "center",
    gap: 16,
  },
  playButton: {
    backgroundColor: "#A8E64C",
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#6BC235",
    alignSelf: "stretch",
    alignItems: "center",
    shadowColor: "#000",
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
    fontWeight: "bold",
    color: "#333333",
    lineHeight: 40,
  },
  credit: {
    alignItems: "center",
    gap: 2,
  },
  creditText: {
    fontSize: 13,
    color: "#666666",
  },
  creditLink: {
    fontSize: 13,
    color: "#DC6E10",
    fontWeight: "600",
  },
});
