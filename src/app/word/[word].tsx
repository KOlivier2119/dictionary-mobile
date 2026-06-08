import {
  LookupErrorState,
  LookupLoadingState,
} from "@/components/dictionary/lookup-error-state";
import { MeaningSection } from "@/components/dictionary/meaning-section";
import { WordHeader } from "@/components/dictionary/word-header";
import { HistoryMenuButton } from "@/components/drawer-content";
import { ScreenShell } from "@/components/tw";
import { useSearchHistory } from "@/context/search-history-context";
import { useDictionaryLookup } from "@/hooks/use-dictionary-lookup";
import { colors, fonts, globalStyles, IS_WEB, spacing } from "@/utils/tailwind";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

function DrawerMenuButton() {
  return (
    <HistoryMenuButton
      buttonStyle={headerStyles.menuButton}
      iconStyle={headerStyles.menuIcon}
    />
  );
}

function WordScreenOptions({
  title,
}: {
  title: string;
}) {
  if (IS_WEB) {
    return null;
  }

  return (
    <Stack.Screen
      options={{
        title,
        headerRight: () => <DrawerMenuButton />,
      }}
    />
  );
}

export default function WordDetailScreen() {
  const { word } = useLocalSearchParams<{ word: string }>();
  const decodedWord = word ? decodeURIComponent(word) : "";
  const { data, error, isLoading, lookup, retry } = useDictionaryLookup();
  const { addWord } = useSearchHistory();

  useEffect(() => {
    if (!decodedWord) return;

    lookup(decodedWord).then((result) => {
      if (result?.ok) {
        addWord(decodedWord);
      }
    });
  }, [addWord, decodedWord, lookup]);

  if (!decodedWord) {
    return (
      <ScreenShell edges={["bottom"]}>
        <LookupErrorState
          error={{
            kind: "invalid_response",
            message: "No word was provided.",
            word: "",
          }}
        />
      </ScreenShell>
    );
  }

  if (isLoading) {
    return (
      <ScreenShell edges={["bottom"]}>
        <WordScreenOptions title={decodedWord} />
        <LookupLoadingState word={decodedWord} />
      </ScreenShell>
    );
  }

  if (error) {
    return (
      <ScreenShell edges={["bottom"]}>
        <WordScreenOptions title={decodedWord} />
        <LookupErrorState error={error} onRetry={retry} />
      </ScreenShell>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ScreenShell edges={["bottom"]}>
        <WordScreenOptions title={decodedWord} />
        <LookupErrorState
          error={{
            kind: "not_found",
            message: "Check the spelling or try a different word.",
            word: decodedWord,
          }}
          onRetry={retry}
        />
      </ScreenShell>
    );
  }

  let meaningIndex = 0;

  return (
    <ScreenShell edges={["bottom"]}>
      <WordScreenOptions title={data[0]?.word ?? decodedWord} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={globalStyles.screenContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <WordHeader entries={data} />

        {data.map((entry, entryIndex) => (
          <View key={`${entry.word}-${entryIndex}`}>
            {entry.meanings.map((meaning) => {
              const showDivider = meaningIndex > 0;
              meaningIndex += 1;
              return (
                <MeaningSection
                  key={`${entry.word}-${meaning.partOfSpeech}-${meaningIndex}`}
                  meaning={meaning}
                  showDivider={showDivider}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
});

const headerStyles = StyleSheet.create({
  menuButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.xs,
  },
  menuIcon: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 22,
    color: colors.primary,
  },
});
