import type {
  Definition,
  DictionaryEntry,
  Meaning,
  Phonetic,
} from "@/types/dictionary";

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function normalizeDefinition(raw: unknown): Definition | null {
  if (typeof raw !== "object" || raw === null) return null;

  const definition = asString(
    "definition" in raw ? raw.definition : undefined,
  );
  if (!definition) return null;

  return {
    definition,
    example: asString("example" in raw ? raw.example : undefined),
    synonyms: asStringArray("synonyms" in raw ? raw.synonyms : []),
    antonyms: asStringArray("antonyms" in raw ? raw.antonyms : []),
  };
}

function normalizeMeaning(raw: unknown): Meaning | null {
  if (typeof raw !== "object" || raw === null) return null;

  const partOfSpeech = asString(
    "partOfSpeech" in raw ? raw.partOfSpeech : undefined,
  );
  if (!partOfSpeech) return null;

  const definitionsRaw =
    "definitions" in raw && Array.isArray(raw.definitions)
      ? raw.definitions
      : [];

  const definitions = definitionsRaw
    .map(normalizeDefinition)
    .filter((item): item is Definition => item !== null);

  if (definitions.length === 0) return null;

  return {
    partOfSpeech,
    definitions,
    synonyms: asStringArray("synonyms" in raw ? raw.synonyms : []),
    antonyms: asStringArray("antonyms" in raw ? raw.antonyms : []),
  };
}

function normalizePhonetic(raw: unknown): Phonetic | null {
  if (typeof raw !== "object" || raw === null) return null;

  const text = asString("text" in raw ? raw.text : undefined);
  const audio =
    "audio" in raw && typeof raw.audio === "string" ? raw.audio : undefined;

  if (!text && !audio) return null;

  return { text, audio };
}

function normalizeEntry(raw: unknown): DictionaryEntry | null {
  if (typeof raw !== "object" || raw === null) return null;

  const word = asString("word" in raw ? raw.word : undefined);
  if (!word) return null;

  const phoneticsRaw =
    "phonetics" in raw && Array.isArray(raw.phonetics) ? raw.phonetics : [];

  const meaningsRaw =
    "meanings" in raw && Array.isArray(raw.meanings) ? raw.meanings : [];

  const meanings = meaningsRaw
    .map(normalizeMeaning)
    .filter((item): item is Meaning => item !== null);

  if (meanings.length === 0) return null;

  const phonetics = phoneticsRaw
    .map(normalizePhonetic)
    .filter((item): item is Phonetic => item !== null);

  return {
    word,
    phonetics,
    meanings,
    sourceUrls: asStringArray(
      "sourceUrls" in raw ? raw.sourceUrls : [],
    ),
  };
}

export function normalizeDictionaryResponse(
  data: unknown,
): DictionaryEntry[] | null {
  if (!Array.isArray(data)) return null;

  const entries = data
    .map(normalizeEntry)
    .filter((item): item is DictionaryEntry => item !== null);

  return entries.length > 0 ? entries : null;
}
