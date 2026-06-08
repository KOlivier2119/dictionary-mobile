import type { SearchHistoryItem } from "@/types/dictionary";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@lexitech/search-history";
const MAX_HISTORY_ITEMS = 20;

export async function loadHistory(): Promise<SearchHistoryItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is SearchHistoryItem =>
        typeof item === "object" &&
        item !== null &&
        typeof item.word === "string" &&
        typeof item.searchedAt === "number",
    );
  } catch {
    return [];
  }
}

export async function saveHistory(items: SearchHistoryItem[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function addWord(word: string): Promise<SearchHistoryItem[]> {
  const trimmed = word.trim();
  if (!trimmed) return loadHistory();

  const existing = await loadHistory();
  const normalized = trimmed.toLowerCase();
  const filtered = existing.filter(
    (item) => item.word.toLowerCase() !== normalized,
  );

  const next: SearchHistoryItem[] = [
    { word: trimmed, searchedAt: Date.now() },
    ...filtered,
  ].slice(0, MAX_HISTORY_ITEMS);

  await saveHistory(next);
  return next;
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
