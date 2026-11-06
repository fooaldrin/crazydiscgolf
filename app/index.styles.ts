import { GlassPalette } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  introContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoFrame: {
    padding: 16,
    marginBottom: 18,
  },
  introLogo: {
    width: 185,
    height: 185,
    borderRadius: 28,
  },
  heroTitle: {
    fontSize: 34,
    fontFamily: "Fredoka_600SemiBold",
    color: GlassPalette.textPrimary,
    lineHeight: 40,
    textAlign: "center",
  },
  introTagline: {
    marginTop: 6,
    fontSize: 15,
    color: GlassPalette.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  savedRoundBanner: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
    gap: 5,
  },
  savedRoundBadgePill: {
    backgroundColor: "rgba(168, 230, 76, 0.22)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: GlassPalette.specularEmeraldRim,
    marginBottom: 2,
  },
  savedRoundBadge: {
    fontSize: 11,
    fontWeight: "800",
    color: GlassPalette.textAccentLime,
    letterSpacing: 1,
  },
  savedRoundTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: GlassPalette.textPrimary,
    fontFamily: "Fredoka_600SemiBold",
  },
  savedRoundPlayers: {
    fontSize: 13,
    color: GlassPalette.textSecondary,
  },
  buttonArea: {
    paddingHorizontal: 24,
    paddingTop: 12,
    gap: 14,
  },
  credit: {
    marginTop: 6,
    alignItems: "center",
    gap: 2,
  },
  creditText: {
    fontSize: 13,
    color: GlassPalette.textMuted,
  },
  creditLink: {
    fontSize: 13,
    color: GlassPalette.textAccentGold,
    fontWeight: "700",
  },
  newGameButtonText: {
    color: GlassPalette.textPrimary,
  },
  settingsButtonIntro: {
    position: "absolute",
    right: 20,
    zIndex: 10,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  navIconButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  navIconText: {
    fontSize: 22,
    fontWeight: "bold",
    color: GlassPalette.textPrimary,
    lineHeight: 26,
  },
  modifiersPillButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  modifiersPillText: {
    fontSize: 13,
    fontWeight: "800",
    color: GlassPalette.textAccentLime,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 28,
    gap: 16,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    textAlign: "center",
    color: GlassPalette.textPrimary,
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 26,
    lineHeight: 32,
  },
  selectorContainer: {
    padding: 18,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  label: {
    color: GlassPalette.textPrimary,
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
  },
  cardSubBadgeWrap: {
    backgroundColor: "rgba(168, 230, 76, 0.16)",
    borderColor: GlassPalette.specularEmeraldRim,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cardSubBadge: {
    fontSize: 12,
    fontWeight: "800",
    color: GlassPalette.textAccentLime,
  },
  customizeLinkText: {
    fontSize: 13,
    fontWeight: "700",
    color: GlassPalette.textAccentGold,
  },
  presetPillsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  presetPill: {
    paddingVertical: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  presetPillText: {
    fontSize: 14,
    fontWeight: "700",
    color: GlassPalette.textSecondary,
  },
  presetPillTextSelected: {
    color: GlassPalette.textPrimary,
    fontWeight: "800",
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  pickerButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 26,
    color: GlassPalette.textPrimary,
    fontWeight: "bold",
    lineHeight: 28,
  },
  valueContainer: {
    backgroundColor: GlassPalette.glassRecessed,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
    justifyContent: "center",
    minWidth: 84,
    alignItems: "center",
    borderWidth: 1,
    borderColor: GlassPalette.specularBorderSoft,
  },
  valueText: {
    fontSize: 30,
    fontWeight: "bold",
    color: GlassPalette.textPrimary,
    lineHeight: 36,
  },
  disabledValueContainer: {
    opacity: 0.75,
  },
  disabledText: {
    color: GlassPalette.textAccentLime,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    gap: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1.5,
    borderColor: GlassPalette.specularEmeraldRim,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: GlassPalette.glassRecessed,
  },
  checkboxChecked: {
    backgroundColor: "rgba(168, 230, 76, 0.35)",
  },
  checkmark: {
    fontSize: 15,
    color: GlassPalette.textPrimary,
    fontWeight: "bold",
    lineHeight: 18,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: GlassPalette.textSecondary,
    lineHeight: 20,
  },
  packGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  packCardTouch: {
    width: "48.2%",
  },
  packCard: {
    padding: 13,
    minHeight: 106,
  },
  packCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  packEmoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  packActiveDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(168, 230, 76, 0.45)",
    borderWidth: 1,
    borderColor: GlassPalette.specularEmeraldRim,
    alignItems: "center",
    justifyContent: "center",
  },
  packActiveDotText: {
    color: GlassPalette.textPrimary,
    fontSize: 12,
    fontWeight: "bold",
    lineHeight: 14,
  },
  packName: {
    fontSize: 15,
    fontWeight: "700",
    color: GlassPalette.textPrimary,
    marginBottom: 2,
  },
  packNameSelected: {
    color: GlassPalette.textAccentLime,
  },
  packSubtitle: {
    fontSize: 12,
    color: GlassPalette.textSecondary,
    lineHeight: 16,
  },
  continueButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 20,
    color: GlassPalette.textPrimary,
    fontWeight: "800",
    lineHeight: 26,
  },
});

export default styles;


