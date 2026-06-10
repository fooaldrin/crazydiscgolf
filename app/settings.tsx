import { CustomStringModal } from '@/components/custom-string-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { UI_TEXT } from '@/constants/ui-text';
import { useCustomStrings } from '@/hooks/use-custom-strings';
import { useEnabledStrings } from '@/hooks/use-enabled-strings';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import styles from './settings.styles';

export default function SettingsScreen() {
  const router = useRouter();
  const { enabledStrings, enabledStringIds, allStrings, loading, saveSettings, refreshSettings } = useEnabledStrings();
  const { deleteCustomString } = useCustomStrings();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshSettings();
    }, [refreshSettings])
  );

  const defaultStrings = allStrings.filter(s => !s.isCustom);
  const customStrings = allStrings.filter(s => s.isCustom);

  const toggleString = (stringId: string) => {
    let newEnabled: string[];
    
    if (enabledStringIds.includes(stringId)) {
      // Don't allow unchecking if it's the last one
      if (enabledStringIds.length === 1) {
        return;
      }
      newEnabled = enabledStringIds.filter(id => id !== stringId);
    } else {
      newEnabled = [...enabledStringIds, stringId];
    }
    
    saveSettings(newEnabled);
  };

  const handleAddCustom = () => {
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEditCustom = (id: string) => {
    setEditingId(id);
    setModalVisible(true);
  };

  const handleDeleteCustom = async (id: string) => {
    const option = allStrings.find(s => s.id === id);
    if (!option) return;

    Alert.alert(
      'Delete Custom Option',
      `Are you sure you want to delete "${option.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Remove from enabled list if it's there
            if (enabledStringIds.includes(id)) {
              const newEnabled = enabledStringIds.filter(eid => eid !== id);
              await saveSettings(newEnabled);
            }
            // Delete the custom string
            await deleteCustomString(id);
            // Refresh to show updated list
            await refreshSettings();
          },
        },
      ]
    );
  };

  const renderOption = (option: typeof allStrings[0], isCustom: boolean) => {
    const isEnabled = enabledStringIds.includes(option.id);
    const isLastEnabled = enabledStringIds.length === 1 && isEnabled;

    return (
      <View key={option.id} style={styles.optionRow}>
        <TouchableOpacity
          style={styles.optionCheckboxContainer}
          onPress={() => toggleString(option.id)}
          disabled={isLastEnabled}
        >
          <View style={[
            styles.checkbox,
            isEnabled && styles.checkboxChecked,
            isLastEnabled && styles.checkboxDisabled
          ]}>
            {isEnabled && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </View>
          <View style={styles.optionTextContainer}>
            <View style={styles.optionTitleRow}>
              <ThemedText style={[
                styles.optionText,
                isLastEnabled && styles.optionTextDisabled
              ]}>
                {option.name}
              </ThemedText>
              {option.minPlayers && option.minPlayers > 1 && (
                <View style={styles.minPlayersBadge}>
                  <ThemedText style={styles.minPlayersText}>
                    {UI_TEXT.SETTINGS_MIN_PLAYERS(option.minPlayers)}
                  </ThemedText>
                </View>
              )}
            </View>
            <ThemedText style={[
              styles.optionDescription,
              isLastEnabled && styles.optionTextDisabled
            ]}>
              {option.description}
            </ThemedText>
          </View>
        </TouchableOpacity>

        {isCustom && (
          <View style={styles.customActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditCustom(option.id)}
            >
              <ThemedText style={styles.actionButtonText}>✏️</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteCustom(option.id)}
            >
              <ThemedText style={styles.actionButtonText}>🗑️</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{UI_TEXT.SETTINGS_LOADING}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>{UI_TEXT.SETTINGS_BACK}</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>{UI_TEXT.SETTINGS_TITLE}</ThemedText>
      </ThemedView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <ThemedText type="subtitle" style={styles.subtitle}>
          {UI_TEXT.SETTINGS_SUBTITLE}
        </ThemedText>
        <ThemedText style={styles.description}>
          {UI_TEXT.SETTINGS_DESCRIPTION}
        </ThemedText>

        {/* Default Options Section */}
        <ThemedText style={styles.sectionHeader}>
          {UI_TEXT.SETTINGS_DEFAULT_SECTION}
        </ThemedText>
        <View style={styles.optionsList}>
          {defaultStrings.map(option => renderOption(option, false))}
        </View>

        {/* Custom Options Section */}
        <ThemedText style={styles.sectionHeader}>
          {UI_TEXT.SETTINGS_CUSTOM_SECTION}
        </ThemedText>
        <View style={styles.optionsList}>
          {customStrings.map(option => renderOption(option, true))}
          
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddCustom}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.addButtonText}>
              {UI_TEXT.SETTINGS_CUSTOM_ADD}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <ThemedView style={styles.infoBox}>
          <ThemedText style={styles.infoText}>
            {UI_TEXT.SETTINGS_INFO(enabledStrings.length, allStrings.length)}
          </ThemedText>
        </ThemedView>
      </ScrollView>

      <CustomStringModal
        visible={modalVisible}
        editingId={editingId}
        allStrings={allStrings}
        onClose={() => {
          setModalVisible(false);
          setEditingId(null);
        }}
        onSave={async (newStringId) => {
          await refreshSettings();
          
          // If a new custom string was created, auto-enable it
          if (newStringId && !enabledStringIds.includes(newStringId)) {
            await saveSettings([...enabledStringIds, newStringId]);
          }
          
          setModalVisible(false);
          setEditingId(null);
        }}
      />
    </ThemedView>
  );
}

