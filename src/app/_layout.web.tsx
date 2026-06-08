import { Sidebar, SidebarToggle } from "@/components/sidebar";
import { SplashPlaceholder } from "@/components/splash-placeholder";
import { SearchHistoryProvider } from "@/context/search-history-context";
import "@/global.css";
import { useAppFonts } from "@/hooks/use-app-fonts";
import { colors } from "@/utils/tailwind";
import { Slot, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Uniwind } from "uniwind";

export default function RootLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { loaded: fontsLoaded } = useAppFonts();
  const router = useRouter();

  useEffect(() => {
    Uniwind.setTheme("dark");
  }, []);

  if (!fontsLoaded) {
    return <SplashPlaceholder />;
  }

  return (
    <SearchHistoryProvider>
      <View
        className="flex h-dvh w-full flex-row"
        style={layoutStyles.root}
      >
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          isCollapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed((v) => !v)}
        />

        <View className="flex flex-1 min-w-0 flex-col">
          <View className="flex h-14 shrink-0 flex-row items-center gap-2 px-3" style={layoutStyles.topBar}>
            <View className="md:hidden">
              <SidebarToggle onPress={() => setSidebarOpen(true)} />
            </View>

            <View className="hidden md:flex md:ml-auto md:flex-row md:items-center md:gap-2">
              <Pressable
                onPress={() => router.push("/")}
                style={layoutStyles.searchButton}
              >
                <Text style={layoutStyles.searchButtonText}>Search</Text>
              </Pressable>
            </View>
          </View>

          <View
            className="flex flex-1 min-h-0 flex-col overflow-hidden md:rounded-tl-xl md:border-t md:border-l"
            style={layoutStyles.contentPanel}
          >
            <Slot />
          </View>
        </View>
      </View>
    </SearchHistoryProvider>
  );
}

const layoutStyles = StyleSheet.create({
  root: {
    backgroundColor: colors.surface,
  },
  topBar: {
    backgroundColor: colors.surface,
  },
  contentPanel: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 16,
    backgroundColor: colors.primary,
  },
  searchButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.black,
  },
});
