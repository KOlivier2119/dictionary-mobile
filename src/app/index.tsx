import {
  BookOpen,
  ICON_STROKE,
  Quote,
  Search,
  Volume2,
} from "@/components/dictionary/dictionary-icons";
import { DictionarySearchLoader } from "@/components/dictionary/dictionary-loader";
import { LookupErrorState } from "@/components/dictionary/lookup-error-state";
import { SearchRecentSuggestions } from "@/components/dictionary/search-recent-suggestions";
import { HistoryMenuButton } from "@/components/drawer-content";
import { Icon } from "@/components/icon";
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
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const EXPLORE_WORDS = ["hello", "serendipity", "ephemeral"] as const;

export default function SearchScreen() {
  const router = useRouter();
  const { lookup, isLoading, error, retry } = useDictionaryLookup();
  const { addWord } = useSearchHistory();
  const [query, setQuery] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function handleSearch(word?: string) {
    const trimmed = (word ?? query).trim();
    if (!trimmed) {
      setValidationError("Please enter a word to search");
      return;
    }

    setValidationError(null);
    setQuery(trimmed);
    inputRef.current?.blur();
    setIsFocused(false);

    const result = await lookup(trimmed);

    if (result?.ok) {
      await addWord(trimmed);
      router.push(`/word/${encodeURIComponent(trimmed)}` as Href);
    }
  }

  function handleFocus() {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsFocused(true);
  }

  function handleBlur() {
    blurTimeoutRef.current = setTimeout(() => setIsFocused(false), 160);
  }

  function handleRecentSelect(word: string) {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    setIsFocused(false);
    setQuery(word);
    setValidationError(null);
    router.push(`/word/${encodeURIComponent(word)}` as Href);
  }

  function handleExploreWord(word: string) {
    setQuery(word);
    handleSearch(word);
  }

  const showWelcome = !error && !isLoading && query.trim().length === 0;

  return (
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

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>LexiTech Dictionary</Text>
          <Text style={styles.headline}>
            Discover the meaning{"\n"}behind every word
          </Text>
          <View style={styles.heroRule}>
            <View style={styles.heroRuleLine} />
            <Text style={styles.heroRuleSymbol}>◆</Text>
            <View style={styles.heroRuleLine} />
          </View>
          <Text style={styles.tagline}>
            Definitions, pronunciations, and examples — instantly.
          </Text>
        </View>

        <View style={styles.searchSection}>
          <View
            style={StyleSheet.flatten([
              styles.searchCard,
              isFocused ? styles.searchCardFocused : null,
            ])}
          >
            <View style={styles.inputRow}>
              <Icon
                icon={Search}
                strokeWidth={ICON_STROKE}
                style={styles.searchIcon}
              />
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Type a word to look up..."
                placeholderTextColor={colors.textMuted}
                selectionColor={colors.primary}
                value={query}
                onChangeText={(value) => {
                  setQuery(value);
                  if (validationError) setValidationError(null);
                }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                onSubmitEditing={() => handleSearch()}
              />
            </View>

            <SearchRecentSuggestions
              visible={isFocused}
              onSelectWord={handleRecentSelect}
            />
          </View>

          {validationError ? (
            <Text style={styles.validationError}>{validationError}</Text>
          ) : null}

          <Pressable
            disabled={isLoading}
            onPress={() => handleSearch()}
            style={StyleSheet.flatten([
              globalStyles.primaryButton,
              styles.searchButton,
              isLoading ? styles.buttonDisabled : null,
            ])}
          >
            <Text style={globalStyles.primaryButtonText}>Look Up Word</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <DictionarySearchLoader word={query.trim()} />
        ) : null}

        {error ? (
          <View style={styles.errorWrap}>
            <LookupErrorState error={error} onRetry={retry} />
          </View>
        ) : null}

        {showWelcome && !isFocused ? (
          <View style={styles.welcomeBlock}>
            <View style={styles.hintList}>
              <View style={styles.hintRow}>
                <View style={styles.hintIconWrap}>
                  <Icon
                    icon={BookOpen}
                    strokeWidth={ICON_STROKE}
                    style={styles.hintIcon}
                  />
                </View>
                <View style={styles.hintCopy}>
                  <Text style={styles.hintTitle}>Clear definitions</Text>
                  <Text style={styles.hintText}>
                    Every meaning, part of speech, and example.
                  </Text>
                </View>
              </View>

              <View style={styles.hintRow}>
                <View style={styles.hintIconWrap}>
                  <Icon
                    icon={Volume2}
                    strokeWidth={ICON_STROKE}
                    style={styles.hintIcon}
                  />
                </View>
                <View style={styles.hintCopy}>
                  <Text style={styles.hintTitle}>Hear pronunciations</Text>
                  <Text style={styles.hintText}>
                    Tap to listen and learn how words sound.
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.exploreCard}>
              <Icon
                icon={Quote}
                strokeWidth={ICON_STROKE}
                style={styles.quoteIcon}
              />
              <Text style={styles.exploreLabel}>Try exploring</Text>
              <View style={styles.exploreChips}>
                {EXPLORE_WORDS.map((word) => (
                  <Pressable
                    key={word}
                    onPress={() => handleExploreWord(word)}
                    style={styles.exploreChip}
                    accessibilityRole="button"
                    accessibilityLabel={`Explore ${word}`}
                  >
                    <Text style={styles.exploreChipText}>{word}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </ScreenShell>
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
  hero: {
    alignItems: "center",
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  eyebrow: {
    fontFamily: fonts.dmSansBold,
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  headline: {
    fontFamily: fonts.playfairBold,
    fontSize: 34,
    lineHeight: 42,
    color: colors.textPrimary,
    textAlign: "center",
  },
  heroRule: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
    width: "72%",
  },
  heroRuleLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },
  heroRuleSymbol: {
    fontFamily: fonts.playfairBold,
    fontSize: 10,
    color: colors.primary,
  },
  tagline: {
    fontFamily: fonts.loraItalic,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: spacing.sm,
    maxWidth: 300,
  },
  searchSection: {
    marginBottom: spacing.sm,
  },
  searchCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  searchCardFocused: {
    borderColor: colors.primary,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minHeight: 48,
  },
  searchIcon: {
    width: 22,
    height: 22,
    color: colors.primary,
  },
  input: {
    flex: 1,
    fontFamily: fonts.loraRegular,
    fontSize: 17,
    color: colors.textPrimary,
    paddingVertical: spacing.xs,
    minHeight: 48,
  },
  validationError: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  searchButton: {
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  errorWrap: {
    marginTop: spacing.md,
  },
  welcomeBlock: {
    flex: 1,
    marginTop: spacing.md,
    gap: spacing.md,
  },
  hintList: {
    gap: spacing.sm,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.sm,
  },
  hintIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  hintIcon: {
    width: 20,
    height: 20,
    color: colors.primary,
  },
  hintCopy: {
    flex: 1,
    gap: 2,
  },
  hintTitle: {
    fontFamily: fonts.dmSansBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  hintText: {
    fontFamily: fonts.loraRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  exploreCard: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.background,
  },
  quoteIcon: {
    width: 22,
    height: 22,
    color: colors.secondary,
    marginBottom: 2,
  },
  exploreLabel: {
    fontFamily: fonts.dmSansBold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  exploreChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  exploreChip: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  exploreChipText: {
    fontFamily: fonts.loraRegular,
    fontSize: 15,
    color: colors.primary,
  },
});
