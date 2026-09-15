"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Keyboard } from "@/components/keyboard";
import { useTypingSound } from "@/lib/use-typing-sound";
import { cn } from "@/lib/utils";
import { buildWordList, type Difficulty } from "@/lib/words";

type Mode = "time" | "words" | "quote" | "zen";
type CharStatus = "pending" | "correct" | "incorrect";
interface CharState {
  ch: string;
  status: CharStatus;
}
type WordState = CharState[];

const DURATIONS = [15, 30, 60, 120] as const;
const IGNORE_KEYS = new Set([
  "Control",
  "Meta",
  "Alt",
  "AltGraph",
  "CapsLock",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Insert",
  "Delete",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "ContextMenu",
  "OS",
  "ScrollLock",
  "Pause",
  "NumLock",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
]);

function toWordState(word: string): WordState {
  return [...word].map((ch) => ({ ch, status: "pending" as CharStatus }));
}

function keySoundCategory(key: string): "space" | "backspace" | "normal" {
  if (key === " ") {
    return "space";
  }
  if (key === "Backspace") {
    return "backspace";
  }
  return "normal";
}

function charClassName(status: CharStatus, isCurrent: boolean): string {
  const classes = ["char"];
  if (status === "correct") {
    classes.push("correct");
  }
  if (status === "incorrect") {
    classes.push("incorrect");
  }
  if (isCurrent) {
    classes.push("current");
  }
  return classes.join(" ");
}

function countCorrectAndIncorrect(wordList: WordState[]) {
  let correct = 0;
  let incorrect = 0;
  for (const w of wordList) {
    for (const c of w) {
      if (c.status === "correct") {
        correct++;
      } else if (c.status === "incorrect") {
        incorrect++;
      }
    }
  }
  return { correct, incorrect };
}

function computeResult(
  wordList: WordState[],
  elapsedMs: number
): { wpm: number; accuracy: number; chars: number } {
  const { correct, incorrect } = countCorrectAndIncorrect(wordList);
  const minutes = Math.max(elapsedMs / 1000 / 60, 1 / 60);
  const wpm = Math.round(correct / 5 / minutes) || 0;
  const totalChars = correct + incorrect;
  const accuracy = totalChars ? Math.round((correct / totalChars) * 100) : 100;
  return { wpm, accuracy, chars: totalChars };
}

export default function Page() {
  const [mode, setMode] = useState<Mode>("time");
  const [duration, setDuration] = useState<number>(30);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [punctuation, setPunctuation] = useState(false);
  const [numbers, setNumbers] = useState(false);

  const [words, setWords] = useState<WordState[]>([]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [keystrokes, setKeystrokes] = useState(0);
  const [showFocusHint, setShowFocusHint] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [topLineIndex, setTopLineIndex] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [result, setResult] = useState<{
    wpm: number;
    accuracy: number;
    chars: number;
  } | null>(null);

  const wordsRef = useRef<HTMLDivElement>(null);
  const wordLineIndexRef = useRef<number[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tabHeldRef = useRef(false);
  const startTimeRef = useRef<number | null>(null);

  // refs mirroring state so the single global keydown listener always reads
  // fresh values without needing to be re-registered on every keystroke.
  const modeRef = useRef(mode);
  const runningRef = useRef(running);
  const finishedRef = useRef(finished);
  const wordIndexRef = useRef(wordIndex);
  const charIndexRef = useRef(charIndex);
  const wordsLenRef = useRef(words.length);
  const wordsStateRef = useRef(words);
  useEffect(() => {
    modeRef.current = mode;
    runningRef.current = running;
    finishedRef.current = finished;
    wordIndexRef.current = wordIndex;
    charIndexRef.current = charIndex;
    wordsLenRef.current = words.length;
    wordsStateRef.current = words;
  });

  const { audioOn, setAudioOn, volume, setVolume, playKeySound, unlockAudio } =
    useTypingSound();

  const flashKey = useCallback((dataKey: string) => {
    setPressedKeys((prev) => new Set(prev).add(dataKey));
    setTimeout(() => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(dataKey);
        return next;
      });
    }, 90);
  }, []);

  const genWords = useCallback(
    (count: number) =>
      buildWordList(count, { difficulty, numbers, punctuation }).map(
        toWordState
      ),
    [difficulty, numbers, punctuation]
  );

  const resetTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setRunning(false);
    setFinished(false);
    setResult(null);
    setTimeLeft(duration);
    setWordIndex(0);
    setCharIndex(0);
    setTopLineIndex(0);
    setKeystrokes(0);
    setShowFocusHint(true);
    startTimeRef.current = null;
    const initialCount = mode === "words" ? duration : 60;
    setWords(genWords(initialCount));
  }, [duration, mode, genWords]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: resetTest already depends on everything relevant
  useEffect(() => {
    resetTest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, duration, difficulty, punctuation, numbers]);

  const ensureMoreWords = useCallback(() => {
    if (modeRef.current === "words") {
      return;
    }
    if (wordIndexRef.current <= wordsLenRef.current - 15) {
      return;
    }
    setWords((prev) => [...prev, ...genWords(40)]);
  }, [genWords]);

  const finishTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setRunning(false);
    setFinished(true);
    setWords((currentWords) => {
      const elapsedMs = startTimeRef.current
        ? Date.now() - startTimeRef.current
        : duration * 1000;
      setResult(computeResult(currentWords, elapsedMs));
      return currentWords;
    });
  }, [duration]);

  const startTest = useCallback(() => {
    if (runningRef.current || finishedRef.current) {
      return;
    }
    setRunning(true);
    setShowFocusHint(false);
    startTimeRef.current = Date.now();
    if (modeRef.current === "time") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            finishTest();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
  }, [finishTest]);

  const handleChar = useCallback(
    (ch: string) => {
      const wi = wordIndexRef.current;
      const ci = charIndexRef.current;
      const word = wordsStateRef.current[wi];
      const wordLen = word?.length ?? 0;

      setWords((prev) => {
        const targetWord = prev[wi];
        const charEntry = targetWord?.[ci];
        if (!(targetWord && charEntry)) {
          return prev;
        }
        const next = [...prev];
        const newWord = [...targetWord];
        newWord[ci] = {
          ...charEntry,
          status: charEntry.ch === ch ? "correct" : "incorrect",
        };
        next[wi] = newWord;
        return next;
      });
      setCharIndex((i) => i + 1);

      // In "words" mode there's no space press after the final word, so
      // completing its last character must finish the test on its own.
      const isLastWord = wi === wordsLenRef.current - 1;
      const isLastCharOfWord = ci + 1 === wordLen;
      if (modeRef.current === "words" && isLastWord && isLastCharOfWord) {
        finishTest();
      }
    },
    [finishTest]
  );

  const handleSpace = useCallback(() => {
    if (charIndexRef.current === 0) {
      return; // ignore leading spaces
    }
    setWordIndex((i) => i + 1);
    setCharIndex(0);
    ensureMoreWords();
    if (
      modeRef.current === "words" &&
      wordIndexRef.current + 1 >= wordsLenRef.current
    ) {
      finishTest();
    }
  }, [ensureMoreWords, finishTest]);

  const handleBackspace = useCallback(() => {
    setWords((prev) => {
      let wi = wordIndexRef.current;
      let ci = charIndexRef.current;
      if (ci === 0) {
        if (wi === 0) {
          return prev;
        }
        wi -= 1;
        ci = prev[wi]?.length ?? 0;
      } else {
        ci -= 1;
      }
      const word = prev[wi];
      if (!word) {
        return prev;
      }
      const charEntry = word[ci];
      if (!charEntry) {
        return prev;
      }
      const next = [...prev];
      const newWord = [...word];
      newWord[ci] = { ...charEntry, status: "pending" };
      next[wi] = newWord;
      wordIndexRef.current = wi;
      charIndexRef.current = ci;
      setWordIndex(wi);
      setCharIndex(ci);
      return next;
    });
  }, []);

  // ---- global keydown handling, split into small focused handlers ----
  const handleGlobalShortcut = useCallback((e: KeyboardEvent): boolean => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setSettingsOpen((o) => !o);
      return true;
    }
    if (e.key === "Escape") {
      setSettingsOpen(false);
      return true;
    }
    return false;
  }, []);

  const handleSpecialKey = useCallback(
    (e: KeyboardEvent): boolean => {
      if (e.key === "Tab") {
        tabHeldRef.current = true;
        e.preventDefault();
        playKeySound("tab");
        flashKey("tab");
        return true;
      }
      if (e.key === "Enter") {
        playKeySound("enter");
        flashKey("enter");
        if (tabHeldRef.current) {
          resetTest();
        }
        return true;
      }
      if (e.key === "Shift") {
        playKeySound("shift");
        flashKey("shift");
        return true;
      }
      return false;
    },
    [playKeySound, flashKey, resetTest]
  );

  const handleTypingKey = useCallback(
    (e: KeyboardEvent) => {
      const isTypingKey =
        e.key.length === 1 || e.key === " " || e.key === "Backspace";
      if (!isTypingKey) {
        return;
      }
      e.preventDefault();
      setShowFocusHint(false);
      if (!runningRef.current && modeRef.current !== "zen") {
        startTest();
      }
      if (modeRef.current === "zen") {
        setRunning(true);
      }
      setKeystrokes((k) => k + 1);
      playKeySound(keySoundCategory(e.key));
      flashKey(e.key === " " ? "space" : e.key.toLowerCase());
      if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === " ") {
        handleSpace();
      } else {
        handleChar(e.key);
      }
    },
    [
      startTest,
      playKeySound,
      flashKey,
      handleBackspace,
      handleSpace,
      handleChar,
    ]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (handleGlobalShortcut(e)) {
        return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }
      if (IGNORE_KEYS.has(e.key)) {
        return;
      }
      if (handleSpecialKey(e)) {
        return;
      }
      if (finishedRef.current) {
        return;
      }
      handleTypingKey(e);
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "Tab") {
        tabHeldRef.current = false;
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, [handleGlobalShortcut, handleSpecialKey, handleTypingKey]);

  // ---- 3-line scroll window ----
  // biome-ignore lint/correctness/useExhaustiveDependencies: must re-measure whenever the rendered word list changes, even though the effect reads the DOM (via ref) rather than `words` directly
  useLayoutEffect(() => {
    const container = wordsRef.current;
    if (!container) {
      return;
    }
    const wordEls = [...container.children] as HTMLElement[];
    if (!wordEls.length) {
      return;
    }
    const lineIdx: number[] = [];
    let currentTop: number | null = null;
    let idx = -1;
    for (const el of wordEls) {
      const top = el.offsetTop;
      if (currentTop === null || Math.abs(top - currentTop) > 2) {
        idx++;
        currentTop = top;
      }
      lineIdx.push(idx);
    }
    wordLineIndexRef.current = lineIdx;
    const secondLineWordIdx = lineIdx.indexOf(1);
    if (secondLineWordIdx !== -1) {
      const h = wordEls[secondLineWordIdx].offsetTop - wordEls[0].offsetTop;
      if (h > 0 && h !== lineHeight) {
        setLineHeight(h);
      }
    }
  }, [words, lineHeight]);

  useEffect(() => {
    const line = wordLineIndexRef.current[wordIndex];
    if (line !== undefined && line > topLineIndex) {
      setTopLineIndex(line);
    }
  }, [wordIndex, topLineIndex]);

  // ---- active key (next expected char) for keyboard highlight ----
  const activeKey = useMemo(() => {
    const word = words[wordIndex];
    if (!word) {
      return "space";
    }
    const charEntry = word[charIndex];
    return charEntry ? charEntry.ch.toLowerCase() : "space";
  }, [words, wordIndex, charIndex]);

  function selectMode(m: Mode) {
    setMode(m);
  }

  return (
    <>
      <div className="bg-video-wrap">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/bg-poster.jpg"
          preload="auto"
        >
          <source src="/bg.mp4" type="video/mp4" />
        </video>
      </div>

      <main className="app" id="main-content">
        <header>
          <div className="logo-block">
            <div className="logo">
              <span className="logo-text">SakuraKeys</span>
              <Image
                alt=""
                className="blossom-img"
                height={20}
                src="/flower-icon.png"
                width={20}
              />
            </div>
            <div className="logo-sub">タイプで進め</div>
          </div>

          <div className="header-mid">
            <span className="pulse-icon">
              <svg
                aria-hidden="true"
                fill="none"
                height="14"
                viewBox="0 0 18 14"
                width="18"
              >
                <path
                  d="M1 7H5L7 2L11 12L13 7H17"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.6"
                />
              </svg>
            </span>
            <span>
              <span className="keystroke-count">
                {keystrokes.toLocaleString()}
              </span>{" "}
              keystrokes and counting
            </span>
          </div>

          <div className="header-right">
            <button
              className={cn("pill-btn", !audioOn && "audio-off")}
              onClick={() => {
                unlockAudio();
                setAudioOn(!audioOn);
              }}
              type="button"
            >
              <span className="audio-icon">{audioOn ? "🔊" : "🔇"}</span> Audio
            </button>
            <button
              className="pill-btn"
              onClick={() => setSettingsOpen((o) => !o)}
              type="button"
            >
              ⚙️ Settings <span className="kbd-hint">⌘ K</span>
            </button>
            <a
              className="pill-btn github-btn"
              href="https://github.com/Aayush-Ash"
              rel="noopener noreferrer"
              target="_blank"
            >
              🐙 GitHub
            </a>
          </div>
        </header>

        {settingsOpen && (
          <div className="settings-overlay">
            <button
              aria-label="Close settings"
              className="settings-overlay-backdrop"
              onClick={() => setSettingsOpen(false)}
              type="button"
            />
            <div aria-label="Settings" className="settings-modal" role="dialog">
              <div className="settings-modal-header">
                <span>Settings</span>
                <button
                  className="settings-close"
                  onClick={() => setSettingsOpen(false)}
                  type="button"
                >
                  ✕
                </button>
              </div>
              <div className="settings-section-label">Sound</div>
              <div className="settings-row">
                <span className="settings-row-label">Audio</span>
                <button
                  aria-label="Toggle audio"
                  className={cn("toggle-switch", audioOn && "on")}
                  onClick={() => {
                    unlockAudio();
                    setAudioOn(!audioOn);
                  }}
                  type="button"
                >
                  <span className="toggle-knob" />
                </button>
              </div>
              <div className="settings-row">
                <span className="settings-row-label">Volume</span>
                <input
                  className="volume-slider"
                  max={1}
                  min={0}
                  onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                  step={0.01}
                  type="range"
                  value={volume}
                />
              </div>
              <div className="settings-row">
                <span className="settings-row-label">Sound profile</span>
                <select
                  className="sound-profile-select"
                  defaultValue="mechanical"
                >
                  <option value="mechanical">Mechanical Thock</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="config-bar">
          <div className="config-group">
            <button
              className={cn("opt", punctuation && "active")}
              onClick={() => setPunctuation((p) => !p)}
              type="button"
            >
              @ punctuation
            </button>
            <button
              className={cn("opt", numbers && "active")}
              onClick={() => setNumbers((n) => !n)}
              type="button"
            >
              # numbers
            </button>
            <button
              className={cn("opt", difficulty === "easy" && "active")}
              onClick={() => setDifficulty("easy")}
              type="button"
            >
              easy
            </button>
            <button
              className={cn("opt", difficulty === "hard" && "active")}
              onClick={() => setDifficulty("hard")}
              type="button"
            >
              hard
            </button>
          </div>
          <div className="config-group">
            <button
              className={cn("opt", mode === "time" && "pill-active")}
              onClick={() => selectMode("time")}
              type="button"
            >
              ⏱ time
            </button>
            <button
              className={cn("opt", mode === "words" && "pill-active")}
              onClick={() => selectMode("words")}
              type="button"
            >
              Aa words
            </button>
            <button
              className={cn("opt", mode === "quote" && "pill-active")}
              onClick={() => selectMode("quote")}
              type="button"
            >
              99 quote
            </button>
            <button
              className={cn("opt", mode === "zen" && "pill-active")}
              onClick={() => selectMode("zen")}
              type="button"
            >
              🌀 zen
            </button>
          </div>
          <div className="config-group">
            {DURATIONS.map((d) => (
              <button
                className={cn("opt", duration === d && "pill-active")}
                key={d}
                onClick={() => setDuration(d)}
                type="button"
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="type-wrap">
          <div
            aria-hidden="true"
            className={cn(
              "timer-display",
              running && mode === "time" && "show"
            )}
          >
            {timeLeft}
          </div>

          {!result && (
            <div
              className="words-viewport"
              style={{ height: lineHeight * 3 || 170 }}
            >
              <div
                className="words"
                ref={wordsRef}
                style={{
                  transform: `translateY(-${topLineIndex * lineHeight}px)`,
                }}
              >
                {words.map((word, wi) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: word list is append-only, order never changes
                  <Fragment key={wi}>
                    <span className="word">
                      {word.map((c, ci) => (
                        <span
                          className={charClassName(
                            c.status,
                            wi === wordIndex && ci === charIndex
                          )}
                          // biome-ignore lint/suspicious/noArrayIndexKey: char position within a word never reorders
                          key={ci}
                        >
                          {c.ch}
                        </span>
                      ))}
                    </span>
                    {wi < words.length - 1 && " "}
                  </Fragment>
                ))}
              </div>
            </div>
          )}

          {!result && showFocusHint && (
            <div className="focus-hint">
              <Image
                alt=""
                className="leaf-icon"
                height={34}
                src="/leaf-icon.png"
                width={56}
              />
              <div className="txt">
                <span>🖱</span> Click or press any key to focus
              </div>
            </div>
          )}

          {!result && (
            <div className="restart-row">
              <span className="key-chip">tab</span> +{" "}
              <span className="key-chip">enter</span>
              <button
                className="restart-text-btn"
                onClick={resetTest}
                type="button"
              >
                restart
              </button>
            </div>
          )}

          {result && (
            <div aria-live="polite" className="result-panel">
              <div className="big">{result.wpm} wpm</div>
              <div className="sub">
                {result.accuracy}% accuracy · {result.chars} characters
              </div>
              <button onClick={resetTest} type="button">
                Try again
              </button>
            </div>
          )}
        </div>

        <Keyboard activeKey={activeKey} pressedKeys={pressedKeys} />
        <p className="mobile-keyboard-note">
          ⌨️ SakuraKeys needs a physical or Bluetooth keyboard to type — the
          on-screen keyboard is hidden here since it needs more room than a
          phone screen gives it.
        </p>

        <footer>
          <nav aria-label="Legal and support links" className="footer-nav">
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </nav>
          <p>
            Built by <span className="name">Aayush Kumar</span>. The source code
            is available on GitHub.
          </p>
        </footer>
      </main>
    </>
  );
}
