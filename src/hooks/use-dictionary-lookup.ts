import { fetchWord } from "@/services/dictionary-api";
import type { DictionaryEntry, LookupError } from "@/types/dictionary";
import { useCallback, useRef, useState } from "react";

export function useDictionaryLookup() {
  const [data, setData] = useState<DictionaryEntry[] | null>(null);
  const [error, setError] = useState<LookupError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastWord, setLastWord] = useState("");
  const lastWordRef = useRef<string>("");

  const lookup = useCallback(async (word: string) => {
    const trimmed = word.trim();
    lastWordRef.current = trimmed;
    setLastWord(trimmed);
    setIsLoading(true);
    setError(null);

    const result = await fetchWord(trimmed);

    if (lastWordRef.current !== trimmed) {
      return result;
    }

    setIsLoading(false);

    if (result.ok) {
      setData(result.data);
      setError(null);
    } else {
      setData(null);
      setError(result.error);
    }

    return result;
  }, []);

  const retry = useCallback(async () => {
    if (!lastWordRef.current) return null;
    return lookup(lastWordRef.current);
  }, [lookup]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    lastWordRef.current = "";
    setLastWord("");
  }, []);

  return {
    data,
    error,
    isLoading,
    lookup,
    retry,
    reset,
    lastWord,
  };
}
