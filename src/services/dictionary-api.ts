import type { LookupError, LookupResult } from "@/types/dictionary";
import { normalizeDictionaryResponse } from "@/utils/normalize-dictionary";
import axios, { isAxiosError } from "axios";
const BASE_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

function buildError(
  kind: LookupError["kind"],
  message: string,
  word: string,
): LookupResult {
  return {
    ok: false,
    error: { kind, message, word },
  };
}

export async function fetchWord(word: string): Promise<LookupResult> {
  const trimmed = word.trim();
  if (!trimmed) {
    return buildError(
      "invalid_response",
      "Please enter a word to search.",
      word,
    );
  }

  try {
    const response = await client.get(`/${encodeURIComponent(trimmed)}`);
    const normalized = normalizeDictionaryResponse(response.data);

    if (!normalized) {
      return buildError(
        "invalid_response",
        "Unexpected response from the dictionary service.",
        trimmed,
      );
    }

    return { ok: true, data: normalized };  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) {
        const apiMessage =
          typeof error.response.data === "object" &&
          error.response.data !== null &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
            ? error.response.data.message
            : "Word not found. Check the spelling and try again.";

        return buildError("not_found", apiMessage, trimmed);
      }

      if (!error.response) {
        return buildError(
          "network",
          "Unable to connect. Check your internet connection and try again.",
          trimmed,
        );
      }

      return buildError(
        "unknown",
        "Something went wrong while fetching the word. Please try again.",
        trimmed,
      );
    }

    return buildError(
      "unknown",
      "Something went wrong while fetching the word. Please try again.",
      trimmed,
    );
  }
}
