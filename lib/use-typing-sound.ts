"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Single-file sprite sound engine.
 *
 * `public/sounds/key-typing-full.wav` is one continuous ~39s recording of a
 * mechanical keyboard. Rather than splitting it into separate clip files, we
 * decode it once into a single AudioBuffer and, for every keystroke, jump to
 * a pre-analyzed onset offset inside that buffer and play a short slice from
 * it. This keeps the original recording intact as one file while still
 * giving natural per-keystroke variation.
 */

const SOUND_URL = "/sounds/key-typing-full.wav";
const SLICE_DURATION = 0.14;

// Timestamps (seconds) of clean keystroke transients found inside the full
// recording, pre-computed via onset/energy analysis.
const CLICK_OFFSETS = [
  3.926, 4.076, 4.321, 4.461, 4.69, 4.839, 5.064, 5.2, 5.463, 5.819, 5.976,
  6.169, 6.32, 6.573, 6.732, 6.962, 7.106, 7.34, 7.478, 7.716, 8.069, 8.158,
  9.103, 9.233, 9.468, 9.617, 9.863, 9.999, 10.194, 10.358, 10.583, 10.722,
  10.931, 11.074, 11.305, 11.447, 11.631, 11.794, 12.0, 12.158, 12.358, 12.501,
  12.695, 13.073, 13.229, 13.424, 13.768, 13.925, 14.227, 14.356, 14.553,
  14.699, 14.885, 14.988, 15.933, 16.069, 16.3, 16.668, 16.99, 17.137, 17.312,
  17.443, 17.647, 17.788, 17.994, 18.116, 18.307, 18.669, 18.827, 19.032,
  19.158, 19.364, 19.507, 19.704, 19.826, 20.061, 20.178, 20.423, 20.542,
  20.782, 20.933, 21.122, 21.273, 21.44, 21.525, 22.563, 22.7, 22.904, 23.272,
  23.604, 23.747, 23.93, 24.061, 24.273, 24.404, 24.588, 24.726, 24.955, 25.086,
  25.306, 25.443, 25.665, 25.786, 26.024, 26.158, 26.367, 26.502, 26.711,
  26.854, 28.113, 28.244, 28.531, 28.653, 28.885, 29.01, 29.593, 29.735, 29.947,
  30.062, 30.261, 30.437, 30.612, 30.776, 30.991, 31.133, 31.32, 31.469, 31.7,
  31.811, 32.022, 32.159, 32.439, 32.555, 33.878, 34.004, 34.211, 34.58, 34.915,
  35.045, 35.495, 35.612, 35.883, 36.014, 36.254, 36.397,
];

export type KeySoundCategory =
  | "normal"
  | "space"
  | "backspace"
  | "enter"
  | "shift"
  | "tab";

const AUDIO_ON_KEY = "sakurakeys_audio_on";
const VOLUME_KEY = "sakurakeys_volume";

function loadStoredBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") {
    return fallback;
  }
  const stored = window.localStorage.getItem(key);
  return stored === null ? fallback : stored === "true";
}

function loadStoredNumber(key: string, fallback: number): number {
  if (typeof window === "undefined") {
    return fallback;
  }
  const stored = window.localStorage.getItem(key);
  if (stored === null) {
    return fallback;
  }
  const parsed = Number.parseFloat(stored);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export function useTypingSound() {
  const [audioOn, setAudioOnState] = useState(true);
  const [volume, setVolumeState] = useState(0.7);
  const [ready, setReady] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const supportedRef = useRef(true);
  const lastOffsetIndexRef = useRef(-1);

  // Hydrate persisted prefs on mount (client only).
  useEffect(() => {
    setAudioOnState(loadStoredBool(AUDIO_ON_KEY, true));
    setVolumeState(loadStoredNumber(VOLUME_KEY, 0.7));
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: volume is read once at construction time; live changes are applied via the effect below instead
  const initAudio = useCallback(() => {
    if (audioCtxRef.current || !supportedRef.current) {
      return;
    }
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      const gain = ctx.createGain();
      gain.gain.value = volume;
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = gain;

      fetch(SOUND_URL)
        .then((r) => r.arrayBuffer())
        .then((buf) => ctx.decodeAudioData(buf))
        .then((decoded) => {
          bufferRef.current = decoded;
          setReady(true);
        })
        .catch((err) => {
          console.warn("SakuraKeys: could not load sound file", err);
        });
    } catch (err) {
      console.warn(
        "SakuraKeys: Web Audio API not supported, sound disabled.",
        err
      );
      supportedRef.current = false;
    }
  }, []);

  const unlockAudio = useCallback(() => {
    initAudio();
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {
        // best-effort resume; ignore rejection
      });
    }
  }, [initAudio]);

  useEffect(() => {
    document.addEventListener("keydown", unlockAudio, { once: true });
    document.addEventListener("click", unlockAudio, { once: true });
    return () => {
      document.removeEventListener("keydown", unlockAudio);
      document.removeEventListener("click", unlockAudio);
    };
  }, [unlockAudio]);

  useEffect(() => {
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = volume;
    }
  }, [volume]);

  const setAudioOn = useCallback((on: boolean) => {
    setAudioOnState(on);
    window.localStorage.setItem(AUDIO_ON_KEY, on ? "true" : "false");
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    window.localStorage.setItem(VOLUME_KEY, String(v));
  }, []);

  const pickOffset = useCallback(() => {
    let idx: number;
    do {
      idx = Math.floor(Math.random() * CLICK_OFFSETS.length);
    } while (idx === lastOffsetIndexRef.current && CLICK_OFFSETS.length > 1);
    lastOffsetIndexRef.current = idx;
    return CLICK_OFFSETS[idx];
  }, []);

  const playKeySound = useCallback(
    (category: KeySoundCategory) => {
      const ctx = audioCtxRef.current;
      const gain = masterGainRef.current;
      const buffer = bufferRef.current;
      if (
        !(audioOn && supportedRef.current && ctx && gain && buffer && ready)
      ) {
        return;
      }
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {
          // best-effort resume; ignore rejection
        });
      }

      let baseVolume: number;
      let rateMin = 0.97;
      let rateMax = 1.03;
      let duration = SLICE_DURATION;

      switch (category) {
        case "space":
          baseVolume = 0.5;
          rateMin = 0.8;
          rateMax = 0.86;
          duration = SLICE_DURATION * 1.3;
          break;
        case "backspace":
          baseVolume = 0.2;
          break;
        case "enter":
          baseVolume = 0.4;
          rateMin = 0.88;
          rateMax = 0.94;
          break;
        case "shift":
        case "tab":
          baseVolume = 0.18;
          break;
        default:
          baseVolume = 0.26 + Math.random() * 0.08;
      }

      const offset = pickOffset();
      const playbackRate = rateMin + Math.random() * (rateMax - rateMin);

      try {
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.playbackRate.value = playbackRate;
        const g = ctx.createGain();
        const now = ctx.currentTime;
        g.gain.setValueAtTime(baseVolume, now);
        g.gain.linearRampToValueAtTime(0.0001, now + duration);
        src.connect(g);
        g.connect(gain);
        src.start(now, offset, duration);
        src.stop(now + duration + 0.02);
      } catch {
        // never let a playback error break typing
      }
    },
    [audioOn, ready, pickOffset]
  );

  return {
    audioOn,
    setAudioOn,
    volume,
    setVolume,
    ready,
    playKeySound,
    unlockAudio,
  };
}
