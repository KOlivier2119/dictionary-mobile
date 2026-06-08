import {
    LookupErrorState,
    LookupLoadingState,
} from "@/components/dictionary/lookup-error-state";
import { MeaningSection } from "@/components/dictionary/meaning-section";
import { WordHeader } from "@/components/dictionary/word-header";
import { useDrawer } from "@/components/drawer-content";
import { useSearchHistory } from "@/context/search-history-context";
import { useDictionaryLookup } from "@/hooks/use-dictionary-lookup";
import { colors, fonts, globalStyles, spacing } from "@/utils/tailwind";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function DrawerMenuButton() {
  const { openDrawer } = useDrawer();

  return (
    <Pressable
      onPress={openDrawer}
      accessibilityLabel="Open history"
      accessibilityRole="button"
      style={headerStyles.menuButton}
    >
      <Text style={headerStyles.menuIcon}>☰</Text>
    </Pressable>
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
      <SafeAreaView style={globalStyles.screen} edges={["bottom"]}>
        <LookupErrorState
          error={{
            kind: "invalid_response",
            message: "No word was provided.",
            word: "",
          }}
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={globalStyles.screen} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: decodedWord,
            headerRight: () => <DrawerMenuButton />,
          }}
        />
        <LookupLoadingState />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={globalStyles.screen} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: decodedWord,
            headerRight: () => <DrawerMenuButton />,
          }}
        />
        <LookupErrorState error={error} onRetry={retry} />
      </SafeAreaView>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={globalStyles.screen} edges={["bottom"]}>
        <Stack.Screen
          options={{
            title: decodedWord,
            headerRight: () => <DrawerMenuButton />,
          }}
        />
        <LookupErrorState
          error={{
            kind: "not_found",
            message: "Check the spelling or try a different word.",
            word: decodedWord,
          }}
          onRetry={retry}
        />
      </SafeAreaView>
    );
  }

  let meaningIndex = 0;

  return (
    <SafeAreaView style={globalStyles.screen} edges={["bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={globalStyles.screenContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Stack.Screen
          options={{
            title: data[0]?.word ?? decodedWord,
            headerRight: () => <DrawerMenuButton />,
          }}
        />

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
    </SafeAreaView>
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
