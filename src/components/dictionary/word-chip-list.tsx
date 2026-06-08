import { colors, fonts, spacing } from "@/utils/tailwind";
import { StyleSheet, Text, View } from "react-native";

export function WordChipList({
  label,
  words,
  variant = "default",
}: {
  label: string;
  words: string[];
  variant?: "default" | "muted";
}) {
  if (words.length === 0) return null;

  const display = words.slice(0, 8);
  const extra = words.length - display.length;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {display.map((word) => (
          <Text
            key={word}
            style={[
              styles.chip,
              variant === "muted" ? styles.chipMuted : styles.chipDefault,
            ]}
          >
            {word}
          </Text>
        ))}
        {extra > 0 ? (
          <Text style={styles.chipExtra}>+{extra} more</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  label: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 13,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 14,
  },
  chipDefault: {
    color: colors.secondary,
  },
  chipMuted: {
    color: colors.textMuted,
  },
  chipExtra: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 14,
    color: colors.textMuted,
  },
});
