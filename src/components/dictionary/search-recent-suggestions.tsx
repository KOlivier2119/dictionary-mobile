import {
    ArrowRight,
    Clock,
    ICON_STROKE,
} from "@/components/dictionary/dictionary-icons";
import { Icon } from "@/components/icon";
import { useSearchHistory } from "@/context/search-history-context";
import { colors, fonts, spacing } from "@/utils/tailwind";
import { Pressable, StyleSheet, Text, View } from "react-native";

const MAX_RECENT = 3;

type SearchRecentSuggestionsProps = {
  visible: boolean;
  onSelectWord: (word: string) => void;
};

export function SearchRecentSuggestions({
  visible,
  onSelectWord,
}: SearchRecentSuggestionsProps) {
  const { history } = useSearchHistory();
  const recent = history.slice(0, MAX_RECENT);

  if (!visible || recent.length === 0) {
    return null;
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.label}>Recent searches</Text>
      {recent.map((item, index) => (
        <Pressable
          key={item.word}
          onPress={() => onSelectWord(item.word)}
          style={StyleSheet.flatten([
            styles.row,
            index < recent.length - 1 ? styles.rowBorder : null,
          ])}
          accessibilityRole="button"
          accessibilityLabel={`Search ${item.word}`}
        >
          <View style={styles.iconWrap}>
            <Icon
              icon={Clock}
              strokeWidth={ICON_STROKE}
              style={styles.clockIcon}
            />
          </View>
          <Text style={styles.word} numberOfLines={1}>
            {item.word}
          </Text>
          <Icon
            icon={ArrowRight}
            strokeWidth={ICON_STROKE}
            style={styles.arrowIcon}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xs,
    marginTop: spacing.xs,
  },
  label: {
    fontFamily: fonts.dmSansBold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    gap: spacing.xs,
    paddingVertical: 6,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  clockIcon: {
    width: 16,
    height: 16,
    color: colors.primary,
  },
  word: {
    flex: 1,
    fontFamily: fonts.loraRegular,
    fontSize: 17,
    color: colors.textPrimary,
  },
  arrowIcon: {
    width: 18,
    height: 18,
    color: colors.textMuted,
  },
});
