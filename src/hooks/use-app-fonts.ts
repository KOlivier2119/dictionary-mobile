import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";
import {
    DMSans_400Regular,
    DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import {
    Lora_400Regular,
    Lora_400Regular_Italic,
} from "@expo-google-fonts/lora";
import { PlayfairDisplay_700Bold } from "@expo-google-fonts/playfair-display";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export function useAppFonts() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_700Bold,
    Lora_400Regular,
    Lora_400Regular_Italic,
    DMMono_400Regular,
    DMSans_400Regular,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return { loaded, error };
}
