import { DictionarySearchLoader } from "@/components/dictionary/dictionary-loader";
import { LookupErrorState } from "@/components/dictionary/lookup-error-state";
import { HistoryMenuButton } from "@/components/drawer-content";
import { ScreenShell } from "@/components/tw";
import { useSearchHistory } from "@/context/search-history-context";
import { useDictionaryLookup } from "@/hooks/use-dictionary-lookup";
import {
  colors,
  fonts,
  globalStyles,
  spacing,
} from "@/utils/tailwind";
import { useRouter, type Href } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function SearchScreen() {
  const router = useRouter();
  const { lookup, isLoading, error, retry } = useDictionaryLookup();
  const { addWord } = useSearchHistory();
  const [query, setQuery] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) {
      setValidationError("Please enter a word to search");
      return;
    }

    setValidationError(null);
    const result = await lookup(trimmed);

    if (result?.ok) {
      await addWord(trimmed);
      router.push(`/word/${encodeURIComponent(trimmed)}` as Href);
    }
  }

  const showEmptyState = !error && !isLoading && query.trim().length === 0;

  return (
    <>
      <ScreenShell edges={["top", "bottom"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <HistoryMenuButton
            buttonStyle={styles.menuButton}
            iconStyle={styles.menuIcon}
          />

          <View style={styles.brandBlock}>
            <Text style={styles.brandTitle}>LexiTech</Text>
            <Text style={styles.ornament}>—◆—</Text>
            <Text style={styles.subtitle}>Words. Meanings. Mastered.</Text>
          </View>

          <View style={styles.searchBlock}>
            <TextInput
              style={styles.input}
              placeholder="Search a word..."
              placeholderTextColor={colors.textMuted}
              selectionColor={colors.primary}
              value={query}
              onChangeText={(value) => {
                setQuery(value);
                if (validationError) setValidationError(null);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {validationError ? (
              <Text style={styles.validationError}>{validationError}</Text>
            ) : null}
          </View>

          <Pressable
            disabled={isLoading}
            onPress={handleSearch}
            style={StyleSheet.flatten([
              globalStyles.primaryButton,
              isLoading ? styles.buttonDisabled : null,
            ])}
          >
            <Text style={globalStyles.primaryButtonText}>Search</Text>
          </Pressable>

          {isLoading ? (
            <DictionarySearchLoader word={query.trim()} />
          ) : null}

          {error ? (
            <View style={styles.errorWrap}>
              <LookupErrorState error={error} onRetry={retry} />
            </View>
          ) : null}

          {showEmptyState ? (
            <View style={styles.emptyState}>
              <Text style={styles.watermark}>?</Text>
              <Text style={styles.emptyText}>Search a word to begin.</Text>
            </View>
          ) : null}
        </ScrollView>
      </ScreenShell>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  menuButton: {
    alignSelf: "flex-start",
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  menuIcon: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 22,
    color: colors.primary,
  },
  brandBlock: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  brandTitle: {
    fontFamily: fonts.playfairBold,
    fontSize: 32,
    color: colors.primary,
    textAlign: "center",
  },
  ornament: {
    fontFamily: fonts.playfairBold,
    fontSize: 14,
    color: colors.primary,
    marginTop: spacing.xs,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: fonts.loraItalic,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: "center",
  },
  searchBlock: {
    marginBottom: spacing.sm,
  },
  input: {
    fontFamily: fonts.loraRegular,
    fontSize: 17,
    color: colors.textPrimary,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
    paddingVertical: spacing.xs,
    minHeight: 48,
  },
  validationError: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    color: colors.error,
    marginTop: spacing.xs,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  errorWrap: {
    marginTop: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 280,
    marginTop: spacing.md,
  },
  watermark: {
    position: "absolute",
    fontFamily: fonts.playfairBold,
    fontSize: 220,
    color: colors.surface,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: fonts.loraItalic,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
  },
});
