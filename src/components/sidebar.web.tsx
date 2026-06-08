import { useSearchHistory } from "@/context/search-history-context";
import { colors, fonts, globalStyles, spacing } from "@/utils/tailwind";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Link, usePathname } from "expo-router";
import { PanelLeft, PanelLeftOpen } from "lucide-react";
import type { ReactNode } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

function SidebarTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side="right"
          sideOffset={8}
          className="z-[100] rounded-lg bg-[#F0EDE6] px-3 py-1.5 text-[13px] text-[#0D0D0D] animate-fade-up"
        >
          {label}
          <Tooltip.Arrow className="fill-[#F0EDE6]" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

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
  const { history } = useSearchHistory();

  return (
    <>
      <Pressable
        onPress={onToggle}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-40 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={viewStyles.overlay}
      />

      <View
        style={[
          viewStyles.sidebar,
          { width: isCollapsed ? 48 : 280 },
          isOpen ? viewStyles.sidebarOpen : viewStyles.sidebarClosed,
        ]}
      >
        {!isCollapsed && (
          <>
            <View style={viewStyles.headerBlock}>
              <Text style={textStyles.headerTitle}>History</Text>
              <View style={globalStyles.divider} />
            </View>

            <ScrollView
              style={viewStyles.scroll}
              contentContainerStyle={viewStyles.scrollContent}
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
                    <Link key={item.word} href={href as any} asChild>
                      <Pressable
                        style={[
                          viewStyles.historyItem,
                          isActive && viewStyles.historyItemActive,
                        ]}
                      >
                        <Text
                          numberOfLines={1}
                          style={[
                            textStyles.historyText,
                            isActive && textStyles.historyTextActive,
                          ]}
                        >
                          {item.word}
                        </Text>
                        <Text style={textStyles.chevron}>›</Text>
                      </Pressable>
                    </Link>
                  );
                })
              )}
            </ScrollView>

            <View style={viewStyles.footer}>
              <View style={globalStyles.divider} />
              <Link href="/" asChild>
                <Pressable style={viewStyles.footerButton}>
                  <Text style={textStyles.footerButtonText}>Search</Text>
                </Pressable>
              </Link>
            </View>
          </>
        )}

        {isCollapsed && (
          <Tooltip.Provider delayDuration={200}>
            <View style={viewStyles.collapsedControls}>
              <SidebarTooltip label="Open sidebar">
                <Pressable onPress={onCollapse} style={viewStyles.collapsedButton}>
                  <PanelLeft size={18} strokeWidth={1.5} color={colors.primary} />
                </Pressable>
              </SidebarTooltip>
            </View>
          </Tooltip.Provider>
        )}

        {isCollapsed && <View style={viewStyles.flexSpacer} />}

        {!isCollapsed && (
          <Pressable onPress={onCollapse} style={viewStyles.collapseButton}>
            <PanelLeftOpen size={18} strokeWidth={1.5} color={colors.textMuted} />
          </Pressable>
        )}

        <View style={viewStyles.goldEdge} />
      </View>
    </>
  );
}

export function SidebarToggle({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={viewStyles.toggleButton}>
      <PanelLeft size={18} strokeWidth={1.5} color={colors.primary} />
    </Pressable>
  );
}

const viewStyles = StyleSheet.create({
  overlay: {
    backgroundColor: colors.overlay,
  },
  sidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 50,
    flex: 1,
    flexDirection: "column",
    backgroundColor: colors.surface,
  },
  sidebarOpen: {
    transform: [{ translateX: 0 }],
  },
  sidebarClosed: {
    transform: [{ translateX: -280 }],
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
