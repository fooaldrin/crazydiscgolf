import { CustomStringModal } from "@/components/custom-string-modal";
import { GlassBackground } from "@/components/glass-background";
import { GlassScrollView } from "@/components/glass-scroll-view";
import { LiquidGlassView } from "@/components/liquid-glass";
import { ThemedText } from "@/components/themed-text";
import {
  CHALLENGE_CATEGORIES,
  CHALLENGE_PACKS,
  ChallengeCategory,
} from "@/constants/random-strings";
import { GlassPalette } from "@/constants/theme";
import { UI_TEXT } from "@/constants/ui-text";
import { useCustomStrings } from "@/hooks/use-custom-strings";
import { useEnabledStrings } from "@/hooks/use-enabled-strings";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./settings.styles";

const CATEGORY_ORDER: ChallengeCategory[] = [
  "disc",
  "angle",
  "form",
  "party",
  "bonus",
];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    enabledStrings,
    enabledStringIds,
    allStrings,
    activePackId,
    applyPack,
    loading,
    saveSettings,
    refreshSettings,
  } = useEnabledStrings();
  const { deleteCustomString } = useCustomStrings();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      refreshSettings();
    }, [refreshSettings]),
  );

  const defaultStrings = allStrings.filter((s) => !s.isCustom);
  const customStrings = allStrings.filter((s) => s.isCustom);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  const toggleString = (stringId: string) => {
    triggerHaptic();
    let newEnabled: string[];

    if (enabledStringIds.includes(stringId)) {
      if (enabledStringIds.length === 1) {
        return;
      }
      newEnabled = enabledStringIds.filter((id) => id !== stringId);
    } else {
      newEnabled = [...enabledStringIds, stringId];
    }

    saveSettings(newEnabled);
  };

  const toggleCategory = (category: ChallengeCategory) => {
    triggerHaptic();
    const catIds = defaultStrings
      .filter((s) => (s.category || "disc") === category)
      .map((s) => s.id);
    const allCatEnabled = catIds.every((id) => enabledStringIds.includes(id));

    if (allCatEnabled) {
      const remaining = enabledStringIds.filter((id) => !catIds.includes(id));
      if (remaining.length === 0) {
        saveSettings([catIds[0]]);
      } else {
        saveSettings(remaining);
      }
    } else {
      const merged = Array.from(new Set([...enabledStringIds, ...catIds]));
      saveSettings(merged);
    }
  };

  const handleAddCustom = () => {
    triggerHaptic();
    setEditingId(null);
    setModalVisible(true);
  };

  const handleEditCustom = (id: string) => {
    triggerHaptic();
    setEditingId(id);
    setModalVisible(true);
  };

  const handleDeleteCustom = async (id: string) => {
    const option = allStrings.find((s) => s.id === id);
    if (!option) return;

    Alert.alert(
      "Delete Custom Modifier",
      `Are you sure you want to delete "${option.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (enabledStringIds.includes(id)) {
              const newEnabled = enabledStringIds.filter((eid) => eid !== id);
              await saveSettings(
                newEnabled.length > 0 ? newEnabled : [defaultStrings[0].id],
              );
            }
            await deleteCustomString(id);
            await refreshSettings();
          },
        },
      ],
    );
  };

  const renderOption = (option: (typeof allStrings)[0], isCustom: boolean) => {
    const isEnabled = enabledStringIds.includes(option.id);
    const isLastEnabled = enabledStringIds.length === 1 && isEnabled;

    return (
      <LiquidGlassView
        key={option.id}
        effect={isEnabled ? "regular" : "clear"}
        borderRadius={16}
        tintColor={
          isEnabled ? GlassPalette.glassNeutral : "rgba(255, 255, 255, 0.03)"
        }
        borderColor={
          isEnabled
            ? GlassPalette.specularEmeraldRim
            : GlassPalette.specularBorderSoft
        }
        style={[styles.optionRow, !isEnabled && styles.optionRowUnchecked]}
      >
        <TouchableOpacity
          style={styles.optionCheckboxContainer}
          onPress={() => toggleString(option.id)}
          disabled={isLastEnabled}
          activeOpacity={0.75}
        >
          <View
            style={[
              styles.checkbox,
              isEnabled && styles.checkboxChecked,
              isLastEnabled && styles.checkboxDisabled,
            ]}
          >
            {isEnabled && <ThemedText style={styles.checkmark}>✓</ThemedText>}
          </View>
          <View style={styles.optionTextContainer}>
            <View style={styles.optionTitleRow}>
              <ThemedText
                style={[
                  styles.optionText,
                  isLastEnabled && styles.optionTextDisabled,
                ]}
              >
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
            <ThemedText
              style={[
                styles.optionDescription,
                isLastEnabled && styles.optionTextDisabled,
              ]}
            >
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
      </LiquidGlassView>
    );
  };

  if (loading) {
    return (
      <GlassBackground>
        <ThemedText style={{ textAlign: "center", marginTop: 100 }}>
          {UI_TEXT.SETTINGS_LOADING}
        </ThemedText>
      </GlassBackground>
    );
  }

  return (
    <GlassBackground>
      <View
        style={[
          styles.header,
          { paddingTop: Math.max(16, insets.top + 8) },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            triggerHaptic();
            router.back();
          }}
          activeOpacity={0.8}
          style={{ alignSelf: "flex-start", marginBottom: 12 }}
        >
          <LiquidGlassView
            interactive
            borderRadius={14}
            tintColor={GlassPalette.glassElevated}
            borderColor={GlassPalette.specularBorderBright}
            style={styles.backButton}
          >
            <ThemedText style={styles.backButtonText}>
              {UI_TEXT.SETTINGS_BACK}
            </ThemedText>
          </LiquidGlassView>
        </TouchableOpacity>

        <View style={styles.headerTitleRow}>
          <ThemedText type="title" style={styles.title}>
            {UI_TEXT.SETTINGS_TITLE}
          </ThemedText>
          <LiquidGlassView
            borderRadius={14}
            tintColor={GlassPalette.glassEmerald}
            borderColor={GlassPalette.specularEmeraldRim}
            style={styles.activeCountBadge}
          >
            <ThemedText style={styles.activeCountBadgeText}>
              {enabledStrings.length}/{allStrings.length} Active
            </ThemedText>
          </LiquidGlassView>
        </View>
      </View>

      <GlassScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <ThemedText style={styles.description}>
          {UI_TEXT.SETTINGS_DESCRIPTION}
        </ThemedText>

        {/* Preset Packs */}
        <ThemedText style={styles.sectionHeader}>
          {UI_TEXT.SETTINGS_PACKS_SECTION}
        </ThemedText>
        <View style={styles.packsGrid}>
          {CHALLENGE_PACKS.map((pack) => {
            const isSelected = activePackId === pack.id;
            return (
              <TouchableOpacity
                key={pack.id}
                onPress={() => {
                  triggerHaptic();
                  applyPack(pack.id);
                }}
                activeOpacity={0.8}
              >
                <LiquidGlassView
                  interactive
                  effect={isSelected ? "regular" : "clear"}
                  borderRadius={16}
                  tintColor={
                    isSelected
                      ? GlassPalette.glassEmerald
                      : GlassPalette.glassNeutral
                  }
                  borderColor={
                    isSelected
                      ? GlassPalette.specularEmeraldRim
                      : GlassPalette.specularBorderSoft
                  }
                  style={styles.packChip}
                >
                  <ThemedText style={styles.packChipEmoji}>
                    {pack.emoji}
                  </ThemedText>
                  <View style={{ flex: 1 }}>
                    <ThemedText
                      style={[
                        styles.packChipTitle,
                        isSelected && styles.packChipTitleSelected,
                      ]}
                    >
                      {pack.name}
                    </ThemedText>
                    <ThemedText
                      style={styles.packChipSubtitle}
                      numberOfLines={1}
                    >
                      {pack.subtitle}
                    </ThemedText>
                  </View>
                </LiquidGlassView>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Built-in Modifiers grouped by Category */}
        {CATEGORY_ORDER.map((catId) => {
          const catMeta = CHALLENGE_CATEGORIES[catId];
          const items = defaultStrings.filter(
            (s) => (s.category || "disc") === catId,
          );
          if (items.length === 0) return null;

          const enabledInCat = items.filter((s) =>
            enabledStringIds.includes(s.id),
          ).length;
          const allInCatEnabled = enabledInCat === items.length;

          return (
            <View key={catId} style={styles.categoryBlock}>
              <View style={styles.categoryHeaderRow}>
                <View style={styles.categoryTitleWrap}>
                  <ThemedText style={styles.categoryEmoji}>
                    {catMeta.emoji}
                  </ThemedText>
                  <ThemedText style={styles.categoryTitle}>
                    {catMeta.label}
                  </ThemedText>
                  <ThemedText style={styles.categoryCounter}>
                    ({enabledInCat}/{items.length})
                  </ThemedText>
                </View>

                <TouchableOpacity
                  style={styles.categoryToggleBtn}
                  onPress={() => toggleCategory(catId)}
                >
                  <ThemedText style={styles.categoryToggleText}>
                    {allInCatEnabled ? "Clear" : "Select All"}
                  </ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.optionsList}>
                {items.map((option) => renderOption(option, false))}
              </View>
            </View>
          );
        })}

        {/* Custom Options Section */}
        <View style={styles.categoryBlock}>
          <View style={styles.categoryHeaderRow}>
            <View style={styles.categoryTitleWrap}>
              <ThemedText style={styles.categoryEmoji}>✨</ThemedText>
              <ThemedText style={styles.categoryTitle}>
                {UI_TEXT.SETTINGS_CUSTOM_SECTION}
              </ThemedText>
            </View>
          </View>

          <View style={styles.optionsList}>
            {customStrings.map((option) => renderOption(option, true))}

            <TouchableOpacity
              onPress={handleAddCustom}
              activeOpacity={0.8}
            >
              <LiquidGlassView
                interactive
                borderRadius={16}
                tintColor={GlassPalette.glassOrangeAccent}
                borderColor="rgba(253, 186, 116, 0.68)"
                style={styles.addButton}
              >
                <ThemedText style={styles.addButtonText}>
                  {UI_TEXT.SETTINGS_CUSTOM_ADD}
                </ThemedText>
              </LiquidGlassView>
            </TouchableOpacity>
          </View>
        </View>

        <LiquidGlassView
          effect="clear"
          borderRadius={14}
          tintColor={GlassPalette.glassEmerald}
          borderColor={GlassPalette.specularEmeraldRim}
          style={styles.infoBox}
        >
          <ThemedText style={styles.infoText}>
            {UI_TEXT.SETTINGS_INFO(enabledStrings.length, allStrings.length)}
          </ThemedText>
        </LiquidGlassView>

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
      </GlassScrollView>

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

          if (newStringId && !enabledStringIds.includes(newStringId)) {
            await saveSettings([...enabledStringIds, newStringId]);
          }

          setModalVisible(false);
          setEditingId(null);
        }}
      />
    </GlassBackground>
  );
}
