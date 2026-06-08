import { colors } from "@/utils/tailwind";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";

export function useSystemBackgroundColor() {
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background);
  }, []);
}
