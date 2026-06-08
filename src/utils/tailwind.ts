import { clsx, type ClassValue } from "clsx";
import { StyleSheet } from "react-native";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const colors = {
  background: "#0D0D0D",
  surface: "#161616",
  border: "#2A2A2A",
  primary: "#C8A96E",
  secondary: "#5C8FBF",
  textPrimary: "#F0EDE6",
  textMuted: "#9E9B94",
  error: "#D9534F",
  success: "#4CAF78",
  black: "#000000",
  white: "#FFFFFF",
  overlay: "rgba(0,0,0,0.6)",
} as const;

export const fonts = {
  playfairBold: "PlayfairDisplay_700Bold",
  loraRegular: "Lora_400Regular",
  loraItalic: "Lora_400Regular_Italic",
  dmMono: "DMMono_400Regular",
  dmSansRegular: "DMSans_400Regular",
  dmSansBold: "DMSans_700Bold",
} as const;

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 40,
} as const;

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    width: "100%",
  },
  sectionRule: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  sectionRuleLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  sectionRuleSymbol: {
    paddingHorizontal: spacing.xs,
    fontFamily: fonts.playfairBold,
    fontSize: 10,
    color: colors.primary,
  },
  posPill: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "transparent",
  },
  posPillText: {
    fontFamily: fonts.dmMono,
    fontSize: 12,
    color: colors.secondary,
    textTransform: "lowercase",
  },
  blockQuote: {
    borderLeftWidth: 2.5,
    borderLeftColor: colors.primary,
    paddingLeft: 12,
    marginTop: spacing.xs,
  },
  blockQuoteText: {
    fontFamily: fonts.loraItalic,
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  primaryButtonText: {
    fontFamily: fonts.dmSansBold,
    fontSize: 14,
    color: colors.black,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  outlineButtonText: {
    fontFamily: fonts.dmSansBold,
    fontSize: 14,
    color: colors.primary,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  loadingBar: {
    height: 2,
    backgroundColor: colors.primary,
    width: "100%",
  },
});
