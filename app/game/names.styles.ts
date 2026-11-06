import { GlassPalette } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: GlassPalette.textPrimary,
  },
  roundSummaryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  roundSummaryBadge: {
    fontSize: 13,
    fontWeight: "800",
    color: GlassPalette.textAccentLime,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
    color: GlassPalette.textPrimary,
    fontFamily: "Fredoka_600SemiBold",
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: GlassPalette.textSecondary,
    textAlign: "center",
    marginBottom: 26,
  },
  inputContainer: {
    marginBottom: 16,
    padding: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    color: GlassPalette.textAccentLime,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: GlassPalette.glassRecessed,
    borderWidth: 1,
    borderColor: GlassPalette.specularBorderBright,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    fontWeight: "600",
    color: GlassPalette.textPrimary,
  },
  continueButtonTouch: {
    marginTop: 12,
    marginBottom: 32,
  },
  continueButton: {
    paddingVertical: 18,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 20,
    fontWeight: "800",
    color: GlassPalette.textPrimary,
  },
});

export default styles;


