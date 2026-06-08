import {
    PartOfSpeechBadge,
    SectionDivider,
} from "@/components/dictionary/part-of-speech-badge";
import { WordChipList } from "@/components/dictionary/word-chip-list";
import type { Definition, Meaning } from "@/types/dictionary";
import {
    colors,
    fonts,
    globalStyles,
    spacing,
} from "@/utils/tailwind";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

function DefinitionItem({
  definition,
  index,
}: {
  definition: Definition;
  index: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: index * 80,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [index, opacity]);

  return (
    <Animated.View style={[styles.definitionRow, { opacity }]}>
      <Text style={styles.definitionText}>{definition.definition}</Text>
      {definition.example ? (
        <View style={globalStyles.blockQuote}>
          <Text style={globalStyles.blockQuoteText}>{definition.example}</Text>
        </View>
      ) : null}
    </Animated.View>
  );
}

export function MeaningSection({
  meaning,
  showDivider = true,
}: {
  meaning: Meaning;
  showDivider?: boolean;
}) {
  return (
    <View style={styles.section}>
      {showDivider ? <SectionDivider /> : null}
      <PartOfSpeechBadge label={meaning.partOfSpeech} />
      <View style={styles.definitions}>
        {meaning.definitions.map((definition, index) => (
          <DefinitionItem
            key={`${meaning.partOfSpeech}-${index}`}
            definition={definition}
            index={index}
          />
        ))}
      </View>
      <WordChipList label="Synonyms" words={meaning.synonyms} />
      <WordChipList label="Antonyms" words={meaning.antonyms} variant="muted" />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.sm,
    paddingBottom: spacing.sm,
  },
  definitions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  definitionRow: {
    gap: spacing.xs,
  },
  definitionText: {
    fontFamily: fonts.loraRegular,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 26,
  },
});
