import { useSearchHistory } from "@/context/search-history-context";
import { colors, fonts, globalStyles, spacing } from "@/utils/tailwind";
import { usePathname, useRouter, type Href } from "expo-router";
import { PanelLeft, PanelLeftOpen } from "lucide-react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export function Sidebar({
  isOpen,
  onToggle,
  isCollapsed,
  onCollapse,
}: {
  isOpen: boolean;
  onToggle: () => void;
  isCollapsed: boolean;
  onCollapse: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { history } = useSearchHistory();

  const sidebarWidth = isCollapsed ? 48 : 280;

  return (
    <>
      <Pressable
        onPress={onToggle}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={styles.overlay}
      />

      <View
        className={`fixed left-0 top-0 z-50 flex h-dvh flex-col md:relative md:z-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={StyleSheet.flatten([
          styles.sidebar,
          { width: sidebarWidth },
        ])}
      >
        {!isCollapsed && (
          <>
            <View style={styles.headerBlock}>
              <Text style={textStyles.headerTitle}>History</Text>
              <View style={globalStyles.divider} />
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
            >
              {history.length === 0 ? (
                <Text style={textStyles.emptyText}>
                  No searches yet. Look up your first word.
                </Text>
              ) : (
                history.map((item) => {
                  const href = `/word/${encodeURIComponent(item.word)}`;
                  const isActive = pathname === href;
                  return (
                    <Pressable
                      key={item.word}
                      onPress={() => router.push(href as Href)}
                      style={StyleSheet.flatten([
                        styles.historyItem,
                        isActive ? styles.historyItemActive : null,
                      ])}
                    >
                      <Text
                        numberOfLines={1}
                        style={StyleSheet.flatten([
                          textStyles.historyText,
                          isActive ? textStyles.historyTextActive : null,
                        ])}
                      >
                        {item.word}
                      </Text>
                      <Text style={textStyles.chevron}>›</Text>
                    </Pressable>
                  );
                })
              )}
            </ScrollView>

            <View style={styles.footer}>
              <View style={globalStyles.divider} />
              <Pressable
                onPress={() => router.push("/")}
                style={styles.footerButton}
              >
                <Text style={textStyles.footerButtonText}>Search</Text>
              </Pressable>
            </View>
          </>
        )}

        {isCollapsed && (
          <View style={styles.collapsedControls}>
            <Pressable
              onPress={onCollapse}
              accessibilityLabel="Open sidebar"
              style={styles.collapsedButton}
            >
              <PanelLeft size={18} strokeWidth={1.5} color={colors.primary} />
            </Pressable>
          </View>
        )}

        {isCollapsed && <View style={styles.flexSpacer} />}

        {!isCollapsed && (
          <Pressable onPress={onCollapse} style={styles.collapseButton}>
            <PanelLeftOpen size={18} strokeWidth={1.5} color={colors.textMuted} />
          </Pressable>
        )}

        <View style={styles.goldEdge} />
      </View>
    </>
  );
}

export function SidebarToggle({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.toggleButton}>
      <PanelLeft size={18} strokeWidth={1.5} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.overlay,
  },
  sidebar: {
    backgroundColor: colors.surface,
  },
  goldEdge: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: 1,
    backgroundColor: colors.primary,
  },
  headerBlock: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    gap: spacing.xs,
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
  footer: {
    paddingBottom: spacing.xs,
  },
  footerButton: {
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    minHeight: 48,
    justifyContent: "center",
  },
  collapsedControls: {
    paddingTop: spacing.xs,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: spacing.xs,
  },
  collapsedButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  flexSpacer: {
    flex: 1,
  },
  collapseButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});

const textStyles = StyleSheet.create({
  headerTitle: {
    fontFamily: fonts.playfairBold,
    fontSize: 22,
    color: colors.primary,
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
  footerButtonText: {
    fontFamily: fonts.dmSansRegular,
    fontSize: 15,
    color: colors.textMuted,
  },
});
