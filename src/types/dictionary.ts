export interface License {
  name: string;
  url: string;
}

export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: License;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license?: License;
  sourceUrls?: string[];
}

export interface SearchHistoryItem {
  word: string;
  searchedAt: number;
}

export type LookupErrorKind =
  | "not_found"
  | "network"
  | "invalid_response"
  | "unknown";

export interface LookupError {
  kind: LookupErrorKind;
  message: string;
  word: string;
}

export type LookupResult =
  | { ok: true; data: DictionaryEntry[] }
  | { ok: false; error: LookupError };

export function getPhoneticTexts(entry: DictionaryEntry): string[] {
  const texts = entry.phonetics
    .map((p) => p.text?.trim())
    .filter((text): text is string => Boolean(text));
  return [...new Set(texts)];
}

export function getAudioUrls(entry: DictionaryEntry): string[] {
  const urls = entry.phonetics
    .map((p) => p.audio?.trim())
    .filter((url): url is string => Boolean(url));
  return [...new Set(urls)];
}

export function getAllAudioUrls(entries: DictionaryEntry[]): string[] {
  const urls = entries.flatMap((entry) => getAudioUrls(entry));
  return [...new Set(urls)];
}
