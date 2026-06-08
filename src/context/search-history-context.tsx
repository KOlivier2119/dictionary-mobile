import {
  addWord as persistAddWord,
  clearHistory as persistClearHistory,
  loadHistory,
} from "@/services/search-history";
import type { SearchHistoryItem } from "@/types/dictionary";
import React, {
  createContext,
  use,
  useCallback,
  useEffect,
  useState,
} from "react";

type SearchHistoryContextValue = {
  history: SearchHistoryItem[];
  isReady: boolean;
  addWord: (word: string) => Promise<void>;
  clearHistory: () => Promise<void>;
};

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(
  null,
);

export function SearchHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    loadHistory().then((items) => {
      if (mounted) {
        setHistory(items);
        setIsReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  const addWord = useCallback(async (word: string) => {
    const next = await persistAddWord(word);
    setHistory(next);
  }, []);

  const clearHistory = useCallback(async () => {
    await persistClearHistory();
    setHistory([]);
  }, []);

  return (
    <SearchHistoryContext
      value={{ history, isReady, addWord, clearHistory }}
    >
      {children}
    </SearchHistoryContext>
  );
}

export function useSearchHistory() {
  const context = use(SearchHistoryContext);
  if (!context) {
    throw new Error(
      "useSearchHistory must be used within a SearchHistoryProvider",
    );
  }
  return context;
}
