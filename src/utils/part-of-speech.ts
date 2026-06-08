import type { LucideIcon } from "lucide-react-native";
import {
    BookMarked,
    Hash,
    MessageCircle,
    Sparkles,
    Tag,
    Zap,
} from "lucide-react-native";

export function getPartOfSpeechIcon(partOfSpeech: string): LucideIcon {
  const pos = partOfSpeech.toLowerCase();
  if (pos.includes("verb")) return Zap;
  if (pos.includes("noun")) return BookMarked;
  if (pos.includes("adjective") || pos.includes("adj")) return Tag;
  if (pos.includes("adverb")) return Sparkles;
  if (pos.includes("interjection")) return MessageCircle;
  return Hash;
}

export function formatPartOfSpeech(partOfSpeech: string): string {
  return partOfSpeech.charAt(0).toUpperCase() + partOfSpeech.slice(1);
}
