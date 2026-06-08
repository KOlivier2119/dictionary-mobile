import type { LookupError } from "@/types/dictionary";
import {
    colors,
    fonts,
    globalStyles,
    spacing,
} from "@/utils/tailwind";
import { useEffect, useRef } from "react";
import {
    Animated,
    Easing,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export function LoadingBar() {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[globalStyles.loadingBar, styles.loadingBarWrap, { opacity }]}
    />
  );
}

export function LookupLoadingState({ message }: { message?: string }) {
  return (
    <View style={styles.loadingContainer}>
      <LoadingBar />
      <Text style={styles.loadingMessage}>
        {message ?? "Looking up word..."}
      </Text>
    </View>
  );
}

export function LookupErrorState({
  error,
  onRetry,
}: {
  error: LookupError;
  onRetry?: () => void;
}) {
  const isNotFound = error.kind === "not_found";

  const title = isNotFound
    ? "Word Not Found"
    : error.kind === "network"
      ? "Unable to Connect"
      : "Something Went Wrong";

  const subtitle = isNotFound
    ? "Check the spelling or try a different word."
    : error.message;

  return (
    <View style={styles.errorContainer}>
      <View style={styles.errorIconCircle}>
        <Text style={styles.errorIconMark}>
          {isNotFound ? "✕" : "!"}
        </Text>
      </View>
      <Text style={styles.errorTitle}>{title}</Text>
      <Text style={styles.errorSubtitle}>{subtitle}</Text>
      {onRetry ? (
        <Pressable onPress={onRetry} style={globalStyles.outlineButton}>
          <Text style={globalStyles.outlineButtonText}>Try Again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingBarWrap: {
    marginTop: spacing.xs,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  loadingMessage: {
    fontFamily: fonts.loraItalic,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  errorIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  errorIconMark: {
    fontFamily: fonts.playfairBold,
    fontSize: 64,
    color: colors.primary,
    lineHeight: 72,
  },
  errorTitle: {
    fontFamily: fonts.playfairBold,
    fontSize: 26,
    color: colors.textPrimary,
    textAlign: "center",
  },
  errorSubtitle: {
    fontFamily: fonts.loraItalic,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
});
