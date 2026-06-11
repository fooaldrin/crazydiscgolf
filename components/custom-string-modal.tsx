import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { UI_TEXT } from "@/constants/ui-text";
import { useCustomStrings } from "@/hooks/use-custom-strings";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
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
  }, [visible, editingId]); // Only reset when modal opens or editingId changes, not when allStrings updates

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
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCancel}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <ThemedView style={styles.modalContent}>
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
                  placeholderTextColor="#999999"
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
                  placeholderTextColor="#999999"
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
                  placeholderTextColor="#999999"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleCancel}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.cancelButtonText}>
                    {UI_TEXT.SETTINGS_MODAL_CANCEL}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.saveButton,
                    !name.trim() && styles.saveButtonDisabled,
                  ]}
                  onPress={handleSave}
                  activeOpacity={0.7}
                  disabled={!name.trim()}
                >
                  <ThemedText style={styles.saveButtonText}>
                    {UI_TEXT.SETTINGS_MODAL_SAVE}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
