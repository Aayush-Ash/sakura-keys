export const EASY_WORDS = [
  "all",
  "time",
  "into",
  "tell",
  "the",
  "who",
  "not",
  "any",
  "well",
  "down",
  "he",
  "person",
  "seem",
  "year",
  "house",
  "own",
  "good",
  "get",
  "know",
  "order",
  "these",
  "end",
  "look",
  "too",
  "may",
  "give",
  "during",
  "much",
  "most",
  "plan",
  "very",
  "real",
  "off",
  "should",
  "then",
  "now",
  "without",
  "set",
  "new",
  "mean",
  "do",
  "small",
  "way",
  "find",
  "here",
  "thing",
  "great",
  "world",
  "life",
  "hand",
  "part",
  "child",
  "eye",
  "woman",
  "place",
  "work",
  "week",
  "case",
  "point",
  "company",
  "number",
  "group",
  "problem",
  "fact",
] as const;

export const HARD_WORDS = [
  "magnificent",
  "juxtaposition",
  "bewildered",
  "reconnaissance",
  "ephemeral",
  "quintessential",
  "serendipity",
  "paradoxical",
  "metamorphosis",
  "conscientious",
  "idiosyncratic",
  "surreptitious",
  "ubiquitous",
  "unprecedented",
  "circumnavigate",
  "philosophical",
  "cacophony",
  "extraordinary",
  "incomprehensible",
  "perpendicular",
  "reminiscence",
  "substantiate",
  "vulnerability",
  "authenticity",
  "disproportionate",
] as const;

export const PUNCTUATION_MARKS = [",", ".", "!", "?", ";", ":"] as const;

export type Difficulty = "easy" | "hard";

function randomNumberToken(): string {
  return String(Math.floor(Math.random() * 9000) + 100);
}

function pickWord(difficulty: Difficulty): string {
  const bank = difficulty === "hard" ? HARD_WORDS : EASY_WORDS;
  return bank[Math.floor(Math.random() * bank.length)];
}

export interface WordListOptions {
  difficulty: Difficulty;
  numbers: boolean;
  punctuation: boolean;
}

export function buildWordList(
  count: number,
  options: WordListOptions
): string[] {
  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    let word = pickWord(options.difficulty);
    if (options.numbers && Math.random() < 0.12) {
      word = randomNumberToken();
    }
    if (options.punctuation && Math.random() < 0.18) {
      word +=
        PUNCTUATION_MARKS[Math.floor(Math.random() * PUNCTUATION_MARKS.length)];
    }
    list.push(word);
  }
  return list;
}
