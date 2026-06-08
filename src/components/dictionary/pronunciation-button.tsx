import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { colors, spacing } from "@/utils/tailwind";
import { useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

function SpeakerIcon({ paused }: { paused: boolean }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M11 5L6 9H3v6h3l5 4V5z"
        stroke={colors.primary}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {paused ? (
        <>
          <Path
            d="M15 9l4 6M19 9l-4 6"
            stroke={colors.primary}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <Path
            d="M15.5 8.5a4.5 4.5 0 010 7"
            stroke={colors.primary}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path
            d="M18 6a7.5 7.5 0 010 12"
            stroke={colors.primary}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
}

function StopIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect
        x={7}
        y={7}
        width={10}
        height={10}
        stroke={colors.primary}
        strokeWidth={1.5}
      />
    </Svg>
  );
}

export function PronunciationButton({ urls }: { urls: string[] }) {
  const { hasAudio, isPlaying, play, stop, cycleAudio, audioCount } =
    useAudioPlayback(urls);
  const scale = useRef(new Animated.Value(1)).current;

  if (!hasAudio) return null;

  function pulse() {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handlePlayPress() {
    pulse();
    play();
  }

  return (
    <View style={styles.row}>
      <Pressable
        onPress={handlePlayPress}
        onLongPress={audioCount > 1 ? cycleAudio : undefined}
        accessibilityLabel={
          isPlaying ? "Pause pronunciation" : "Play pronunciation"
        }
        accessibilityRole="button"
        style={styles.touchTarget}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <SpeakerIcon paused={isPlaying} />
        </Animated.View>
      </Pressable>

      {isPlaying ? (
        <Pressable
          onPress={stop}
          accessibilityLabel="Stop pronunciation"
          accessibilityRole="button"
          style={styles.touchTarget}
        >
          <StopIcon />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  touchTarget: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
});
