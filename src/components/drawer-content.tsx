import "@/global.css";

import { useSearchHistory } from "@/context/search-history-context";
import {
    colors,
    fonts,
    globalStyles,
    spacing,
} from "@/utils/tailwind";
import type { Href } from "expo-router";
import { usePathname } from "expo-router";

import React, { createContext, use, useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type DrawerContextValue = {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = useCallback(() => setIsOpen(true), []);
  const closeDrawer = useCallback(() => setIsOpen(false), []);

  return (
    <DrawerContext value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext>
  );
}

export function useDrawer() {
  const context = use(DrawerContext);
  if (!context) {
    if (process.env.EXPO_OS === "web") {
      return {
        isOpen: false,
        openDrawer: () => {},
        closeDrawer: () => {},
      };
    }
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
}

export function HistoryMenuButton({
  buttonStyle,
  iconStyle,
}: {
  buttonStyle?: object;
  iconStyle?: object;
}) {
  if (process.env.EXPO_OS === "web") {
    return null;
  }

  return <NativeHistoryMenuButton buttonStyle={buttonStyle} iconStyle={iconStyle} />;
}

function NativeHistoryMenuButton({
  buttonStyle,
  iconStyle,
}: {
  buttonStyle?: object;
  iconStyle?: object;
}) {
  const { openDrawer } = useDrawer();

  return (
    <Pressable
      onPress={openDrawer}
      accessibilityLabel="Open history"
      accessibilityRole="button"
      style={[styles.menuButton, buttonStyle]}
    >
      <Text style={[styles.menuIcon, iconStyle]}>☰</Text>
    </Pressable>
  );
}

function DrawerHistoryItem({
  title,
  onPress,
  active,
}: {
  title: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.historyItem, active && styles.historyItemActive]}
    >
      <Text
        numberOfLines={1}
        style={[styles.historyText, active && styles.historyTextActive]}
      >
        {title}
      </Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export function DrawerContent({
  onNavigate,
}: {
  onNavigate: (path: Href) => void;
}) {
  const { history } = useSearchHistory();
  const pathname = usePathname();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left"]}>
      <View style={styles.goldEdge} />
      <View style={styles.headerBlock}>
        <Text style={styles.headerTitle}>History</Text>
        <View style={globalStyles.divider} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {history.length === 0 ? (
          <Text style={styles.emptyText}>
            No searches yet. Look up your first word.
          </Text>
        ) : (
          history.map((item) => {
            const href = `/word/${encodeURIComponent(item.word)}`;
            const isActive = pathname === href;
            return (
              <DrawerHistoryItem
                key={item.word}
                title={item.word}
                active={isActive}
                onPress={() => onNavigate(href as Href)}
              />
            );
          })
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={globalStyles.divider} />
        <Pressable onPress={() => onNavigate("/")} style={styles.footerButton}>
          <Text style={styles.footerButtonText}>Search</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  goldEdge: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.primary,
    zIndex: 1,
  },
  headerBlock: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
  },
  headerTitle: {
    fontFamily: fonts.playfairBold,
    fontSize: 22,
    color: colors.primary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.sm,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    minHeight: 48,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  historyItemActive: {
    borderLeftColor: colors.primary,
  },
  historyText: {
    flex: 1,
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  historyTextActive: {
    color: colors.white,
  },
  chevron: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 20,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  emptyText: {
    fontFamily: fonts.loraItalic,
    fontSize: 15,
    color: colors.textMuted,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    textAlign: "center",
  },
  footer: {
    paddingBottom: spacing.xs,
  },
  footerButton: {
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    minHeight: 48,
    justifyContent: "center",
  },
  footerButtonText: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    color: colors.textMuted,
  },
  menuButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  menuIcon: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 22,
    color: colors.primary,
  },
});
