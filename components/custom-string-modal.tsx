import { LiquidGlassGroup, LiquidGlassView } from "@/components/liquid-glass";
import { ThemedText } from "@/components/themed-text";
import { GlassPalette } from "@/constants/theme";
import { UI_TEXT } from "@/constants/ui-text";
import { useCustomStrings } from "@/hooks/use-custom-strings";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "./custom-string-modal.styles";

interface CustomStringModalProps {
  visible: boolean;
  editingId: string | null;
  allStrings: {
    id: string;
    name: string;
    description: string;
    minPlayers?: number;
  }[];
  onClose: () => void;
  onSave: (newStringId?: string) => void | Promise<void>;
}

export function CustomStringModal({
  visible,
  editingId,
  allStrings,
  onClose,
  onSave,
}: CustomStringModalProps) {
  const { addCustomString, updateCustomString } = useCustomStrings();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [minPlayers, setMinPlayers] = useState("");

  useEffect(() => {
    if (visible) {
      if (editingId) {
        const editingOption = allStrings.find((s) => s.id === editingId);
        if (editingOption) {
          setName(editingOption.name);
          setDescription(editingOption.description);
          setMinPlayers(editingOption.minPlayers?.toString() || "");
        }
      } else {
        setName("");
        setDescription("");
        setMinPlayers("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, editingId]);

  const handleSave = async () => {
    if (!name.trim()) {
      return;
    }

    const minPlayersNum = minPlayers ? parseInt(minPlayers, 10) : undefined;

    let newStringId: string | undefined;
    if (editingId) {
      await updateCustomString(
        editingId,
        name.trim(),
        description.trim(),
        minPlayersNum,
      );
    } else {
      const newString = await addCustomString(
        name.trim(),
        description.trim(),
        minPlayersNum,
      );
      newStringId = newString.id;
    }

    await onSave(newStringId);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <BlurView intensity={36} tint="dark" style={StyleSheet.absoluteFill} />
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleCancel}
        />

        <View style={styles.modalCardWrap}>
          <LiquidGlassView
            effect="regular"
            tintColor="rgba(12, 42, 26, 0.78)"
            borderColor={GlassPalette.specularEmeraldRim}
            borderRadius={26}
            style={styles.modalContent}
          >
            <ThemedText type="subtitle" style={styles.modalTitle}>
              {editingId
                ? UI_TEXT.SETTINGS_MODAL_TITLE_EDIT
                : UI_TEXT.SETTINGS_MODAL_TITLE_ADD}
            </ThemedText>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                {UI_TEXT.SETTINGS_MODAL_NAME_LABEL}
              </ThemedText>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder={UI_TEXT.SETTINGS_MODAL_NAME_PLACEHOLDER}
                placeholderTextColor="rgba(240, 253, 244, 0.42)"
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                {UI_TEXT.SETTINGS_MODAL_DESC_LABEL}
              </ThemedText>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder={UI_TEXT.SETTINGS_MODAL_DESC_PLACEHOLDER}
                placeholderTextColor="rgba(240, 253, 244, 0.42)"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={styles.label}>
                {UI_TEXT.SETTINGS_MODAL_MIN_PLAYERS_LABEL}
              </ThemedText>
              <TextInput
                style={styles.input}
                value={minPlayers}
                onChangeText={setMinPlayers}
                placeholder="1"
                placeholderTextColor="rgba(240, 253, 244, 0.42)"
                keyboardType="number-pad"
              />
            </View>

            <LiquidGlassGroup spacing={12} style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.buttonWrap}
                onPress={handleCancel}
                activeOpacity={0.75}
              >
                <LiquidGlassView
                  effect="clear"
                  tintColor={GlassPalette.glassNeutral}
                  borderColor={GlassPalette.specularBorderBright}
                  borderRadius={16}
                  interactive
                  style={styles.button}
                >
                  <ThemedText style={styles.cancelButtonText}>
                    {UI_TEXT.SETTINGS_MODAL_CANCEL}
                  </ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonWrap,
                  !name.trim() && styles.saveButtonDisabled,
                ]}
                onPress={handleSave}
                activeOpacity={0.75}
                disabled={!name.trim()}
              >
                <LiquidGlassView
                  effect="regular"
                  tintColor={GlassPalette.glassLimeCTA}
                  borderColor={GlassPalette.specularEmeraldRim}
                  borderRadius={16}
                  interactive={Boolean(name.trim())}
                  style={styles.button}
                >
                  <ThemedText style={styles.saveButtonText}>
                    {UI_TEXT.SETTINGS_MODAL_SAVE}
                  </ThemedText>
                </LiquidGlassView>
              </TouchableOpacity>
            </LiquidGlassGroup>
          </LiquidGlassView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
