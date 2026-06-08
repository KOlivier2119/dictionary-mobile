import { IS_WEB } from "@/utils/tailwind";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View } from "react-native";

const SPLASH_BACKGROUND = "#000000";
const LOGO_SIZE = 160;

export function SplashPlaceholder() {
  return (
    <View style={[styles.container, IS_WEB && styles.containerWeb]}>
      {Platform.OS !== "web" && <StatusBar style="light" />}
      <Image
        source={require("../../assets/images/splash-logo.png")}
        style={styles.logo}
        contentFit="contain"
        accessibilityLabel="LexiTech Dictionary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: SPLASH_BACKGROUND,
  },
  containerWeb: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
