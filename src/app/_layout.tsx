import {
    DrawerContent,
    DrawerProvider,
    useDrawer,
} from "@/components/drawer-content";
import { DrawerLayout } from "@/components/drawer-layout";
import { SplashPlaceholder } from "@/components/splash-placeholder";
import { SearchHistoryProvider } from "@/context/search-history-context";
import "@/global.css";
import { useAppFonts } from "@/hooks/use-app-fonts";
import { colors } from "@/utils/tailwind";
import { useSystemBackgroundColor } from "@/utils/use-system-background-color";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { DarkTheme, ThemeProvider as RNTheme } from "expo-router/react-navigation";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

const GLASS = isLiquidGlassAvailable();

function ThemeProvider(props: { children: React.ReactNode }) {
  return (
    <RNTheme value={DarkTheme}>
      <SafeAreaListener onChange={({ insets }) => Uniwind.updateInsets(insets)}>
        {props.children}
      </SafeAreaListener>
    </RNTheme>
  );
}

export const unstable_settings = {
  anchor: "index",
};

export default function RootLayout() {
  const { loaded: fontsLoaded } = useAppFonts();

  useEffect(() => {
    Uniwind.setTheme("dark");
  }, []);

  if (!fontsLoaded) {
    return <SplashPlaceholder />;
  }

  return (
    <View style={layoutStyles.root}>
      <ThemeProvider>
        <KeyboardProvider>
          <SearchHistoryProvider>
            <DrawerProvider>
              <RootDrawer />
            </DrawerProvider>
            {process.env.EXPO_OS !== "ios" && <StatusBar style="light" />}
          </SearchHistoryProvider>
        </KeyboardProvider>
      </ThemeProvider>
    </View>
  );
}

function RootDrawer() {
  const router = useRouter();
  const { isOpen, openDrawer, closeDrawer } = useDrawer();

  useSystemBackgroundColor();

  return (
    <DrawerLayout
      open={isOpen}
      onOpen={openDrawer}
      onClose={closeDrawer}
      drawerContent={
        <DrawerContent
          onNavigate={(path) => {
            closeDrawer();
            router.replace(path, { withAnchor: true });
          }}
        />
      }
    >
      <StackLayout />
    </DrawerLayout>
  );
}

function StackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: GLASS,
        headerBackButtonDisplayMode: GLASS ? "minimal" : "default",
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="index"
        dangerouslySingular
        options={{
          title: "Dictionary",
          animation: "none",
          gestureEnabled: false,
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="word/[word]"
        options={{
          title: "Word",
          headerLargeTitleShadowVisible: false,
        }}
      />
    </Stack>
  );
}

const layoutStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
