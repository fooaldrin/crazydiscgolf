import { GlassPalette } from "@/constants/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: GlassPalette.specularBorderSoft,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: GlassPalette.textPrimary,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: GlassPalette.textPrimary,
    fontFamily: "Fredoka_600SemiBold",
    lineHeight: 34,
  },
  activeCountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activeCountBadgeText: {
    color: GlassPalette.textAccentLime,
    fontSize: 13,
    fontWeight: "800",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 44,
  },
  description: {
    fontSize: 14,
    color: GlassPalette.textSecondary,
    marginBottom: 18,
    lineHeight: 20,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    color: GlassPalette.textAccentLime,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  packsGrid: {
    gap: 10,
    marginBottom: 24,
  },
  packChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  packChipEmoji: {
    fontSize: 24,
    lineHeight: 28,
  },
  packChipTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: GlassPalette.textPrimary,
  },
  packChipTitleSelected: {
    color: GlassPalette.textAccentLime,
  },
  packChipSubtitle: {
    fontSize: 12,
    color: GlassPalette.textSecondary,
    marginTop: 2,
  },
  categoryBlock: {
    marginBottom: 24,
  },
  categoryHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryTitleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryEmoji: {
    fontSize: 18,
    lineHeight: 22,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: GlassPalette.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  categoryCounter: {
    fontSize: 13,
    fontWeight: "600",
    color: GlassPalette.textSecondary,
  },
  categoryToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "rgba(168, 230, 76, 0.16)",
    borderWidth: 1,
    borderColor: GlassPalette.specularEmeraldRim,
  },
  categoryToggleText: {
    fontSize: 12,
    fontWeight: "700",
    color: GlassPalette.textAccentLime,
  },
  optionsList: {
    gap: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  optionRowUnchecked: {
    opacity: 0.65,
  },
  optionCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: GlassPalette.specularEmeraldRim,
    marginRight: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlassPalette.glassRecessed,
  },
  checkboxChecked: {
    backgroundColor: "rgba(168, 230, 76, 0.38)",
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    color: GlassPalette.textPrimary,
    fontSize: 15,
    lineHeight: 16,
    fontWeight: "bold",
  },
  optionTextContainer: {
    flex: 1,
    gap: 3,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  minPlayersBadge: {
    backgroundColor: "rgba(252, 174, 36, 0.28)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GlassPalette.specularGoldRim,
  },
  minPlayersText: {
    fontSize: 11,
    fontWeight: "700",
    color: GlassPalette.textAccentGold,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "700",
    color: GlassPalette.textPrimary,
  },
  optionDescription: {
    fontSize: 13,
    color: GlassPalette.textSecondary,
    lineHeight: 18,
  },
  optionTextDisabled: {
    opacity: 0.5,
  },
  infoBox: {
    marginTop: 8,
    padding: 14,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    color: GlassPalette.textAccentLime,
  },
  credit: {
    marginTop: 24,
    marginBottom: 8,
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
  customActions: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 8,
  },
  actionButton: {
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: GlassPalette.glassRecessed,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: GlassPalette.specularBorderSoft,
  },
  actionButtonText: {
    fontSize: 16,
  },
  addButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: GlassPalette.textPrimary,
  },
});

export default styles;
