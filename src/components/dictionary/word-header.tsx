import { PronunciationButton } from "@/components/dictionary/pronunciation-button";
import type { DictionaryEntry } from "@/types/dictionary";
import { getAllAudioUrls, getPhoneticTexts } from "@/types/dictionary";
import { colors, fonts, spacing, USE_NATIVE_DRIVER } from "@/utils/tailwind";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

export function WordHeader({ entries }: { entries: DictionaryEntry[] }) {
  const primary = entries[0];
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]).start();
  }, [opacity, translateY]);

  if (!primary) return null;

  const phonetics = entries.flatMap((entry) => getPhoneticTexts(entry));
  const uniquePhonetics = [...new Set(phonetics)];
  const audioUrls = getAllAudioUrls(entries);
  const phoneticText = uniquePhonetics[0] ?? "";

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
    >
      <Text style={styles.wordTitle}>{primary.word}</Text>
      {phoneticText ? (
        <View style={styles.phoneticRow}>
          <Text style={styles.phoneticText}>{phoneticText}</Text>
          <PronunciationButton urls={audioUrls} />
        </View>
      ) : (
        <PronunciationButton urls={audioUrls} />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    gap: spacing.xs,
  },
  wordTitle: {
    fontFamily: fonts.playfairBold,
    fontSize: 38,
    color: colors.primary,
  },
  phoneticRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  phoneticText: {
    fontFamily: fonts.dmMono,
    fontSize: 14,
    color: colors.secondary,
  },
});
