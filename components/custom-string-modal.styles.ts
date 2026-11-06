import { GlassPalette } from "@/constants/theme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "rgba(3, 12, 8, 0.55)",
  },
  modalCardWrap: {
    width: "100%",
    maxWidth: 400,
  },
  modalContent: {
    width: "100%",
    padding: 22,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: GlassPalette.textPrimary,
    textAlign: "center",
    fontFamily: "Fredoka_600SemiBold",
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 7,
    color: GlassPalette.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  input: {
    backgroundColor: "rgba(4, 16, 10, 0.52)",
    borderWidth: 1.5,
    borderColor: "rgba(168, 230, 76, 0.42)",
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: GlassPalette.textPrimary,
    fontWeight: "600",
  },
  textArea: {
    minHeight: 84,
    textAlignVertical: "top",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },
  buttonWrap: {
    flex: 1,
  },
  button: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: GlassPalette.textSecondary,
  },
  saveButtonDisabled: {
    opacity: 0.45,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: GlassPalette.textPrimary,
  },
});

export default styles;
