import { colors, fonts, spacing, USE_NATIVE_DRIVER } from "@/utils/tailwind";
import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

type DictionarySearchLoaderProps = {
  word?: string;
  message?: string;
};

function AnimatedDot({ delay }: { delay: number }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: -6,
          duration: 320,
          easing: Easing.out(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 320,
          easing: Easing.in(Easing.quad),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.delay(480 - delay),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [delay, translateY]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        styles.dot,
        { transform: [{ translateY }] },
      ])}
    />
  );
}

export function DictionarySearchLoader({
  word,
  message = "Looking up definition",
}: DictionarySearchLoaderProps) {
  const spin = useRef(new Animated.Value(0)).current;
  const spinReverse = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2800,
        easing: Easing.linear,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    );

    const spinReverseAnimation = Animated.loop(
      Animated.timing(spinReverse, {
        toValue: 1,
        duration: 4200,
        easing: Easing.linear,
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    );

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER,
        }),
      ]),
    );

    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    );

    spinAnimation.start();
    spinReverseAnimation.start();
    pulseAnimation.start();
    shimmerAnimation.start();

    return () => {
      spinAnimation.stop();
      spinReverseAnimation.stop();
      pulseAnimation.stop();
      shimmerAnimation.stop();
    };
  }, [pulse, shimmer, spin, spinReverse]);

  const outerRotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const innerRotate = spinReverse.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const diamondScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1.08],
  });

  const diamondOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 1],
  });

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-72, 72],
  });

  return (
    <View style={styles.container} accessibilityRole="progressbar">
      <View style={styles.emblemWrap}>
        <Animated.View
          style={StyleSheet.flatten([
            styles.ring,
            styles.ringOuter,
            { transform: [{ rotate: outerRotate }] },
          ])}
        />
        <Animated.View
          style={StyleSheet.flatten([
            styles.ring,
            styles.ringInner,
            { transform: [{ rotate: innerRotate }] },
          ])}
        />
        <Animated.Text
          style={StyleSheet.flatten([
            styles.diamond,
            {
              opacity: diamondOpacity,
              transform: [{ scale: diamondScale }],
            },
          ])}
        >
          ◆
        </Animated.Text>
      </View>

      {word ? (
        <Text style={styles.word} numberOfLines={1}>
          {word}
        </Text>
      ) : null}

      <View style={styles.shimmerTrack}>
        <Animated.View
          style={StyleSheet.flatten([
            styles.shimmerBar,
            { transform: [{ translateX: shimmerTranslate }] },
          ])}
        />
      </View>

      <Text style={styles.message}>{message}</Text>

      <View style={styles.dotsRow}>
        <AnimatedDot delay={0} />
        <AnimatedDot delay={160} />
        <AnimatedDot delay={320} />
      </View>
    </View>
  );
}

const RING_SIZE = 96;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
    minHeight: 280,
  },
  emblemWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
  },
  ring: {
    position: "absolute",
    borderRadius: RING_SIZE / 2,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ringOuter: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderStyle: "dashed",
    opacity: 0.55,
  },
  ringInner: {
    width: RING_SIZE - 24,
    height: RING_SIZE - 24,
    opacity: 0.85,
  },
  diamond: {
    fontFamily: fonts.playfairBold,
    fontSize: 28,
    color: colors.primary,
    lineHeight: 32,
  },
  word: {
    fontFamily: fonts.playfairBold,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: "center",
    maxWidth: 280,
  },
  shimmerTrack: {
    width: 144,
    height: 2,
    backgroundColor: colors.surface,
    borderRadius: 1,
    overflow: "hidden",
    marginTop: spacing.xs,
  },
  shimmerBar: {
    width: 48,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  message: {
    fontFamily: fonts.loraItalic,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: spacing.xs,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
