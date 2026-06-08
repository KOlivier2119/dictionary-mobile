import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useAudioPlayback(urls: string[]) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeUrl = urls[activeIndex] ?? null;

  const player = useAudioPlayer(activeUrl);
  const status = useAudioPlayerStatus(player);
  const isPlaying = status.playing;

  useEffect(() => {
    if (activeUrl) {
      player.replace(activeUrl);
    }
  }, [activeUrl, player]);

  const showPlaybackError = useCallback(() => {
    Alert.alert(
      "Pronunciation unavailable",
      "The pronunciation file could not be loaded or played.",
    );
  }, []);

  const play = useCallback(async () => {
    if (!activeUrl) {
      showPlaybackError();
      return;
    }

    try {
      if (isPlaying) {
        player.pause();
        return;
      }

      if (status.currentTime > 0 && !status.didJustFinish) {
        player.play();
        return;
      }

      player.seekTo(0);
      player.play();
    } catch {
      showPlaybackError();
    }
  }, [activeUrl, isPlaying, player, showPlaybackError, status]);

  const stop = useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
    } catch {
      showPlaybackError();
    }
  }, [player, showPlaybackError]);

  const cycleAudio = useCallback(() => {
    if (urls.length <= 1) return;
    setActiveIndex((current) => (current + 1) % urls.length);
  }, [urls.length]);

  return {
    activeUrl,
    activeIndex,
    audioCount: urls.length,
    isPlaying,
    play,
    stop,
    cycleAudio,
    hasAudio: urls.length > 0,
  };
}
