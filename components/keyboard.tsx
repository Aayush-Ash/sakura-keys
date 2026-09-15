"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface KeySpec {
  className?: string;
  dataKey: string;
  label: React.ReactNode;
  mini?: React.ReactNode;
}

function key(
  label: React.ReactNode,
  dataKey: string,
  className?: string,
  mini?: React.ReactNode
): KeySpec {
  return { label, dataKey, className, mini };
}

const FLOWER_KEY = (
  <Image
    alt=""
    className="key-flower"
    height={22}
    src="/flower-icon.png"
    width={22}
  />
);
const FLOWER_MINI = (
  <Image
    alt=""
    className="mini-flower"
    height={9}
    src="/flower-icon.png"
    width={9}
  />
);

const ROWS: KeySpec[][] = [
  [
    key(FLOWER_KEY, "blossom-tl", "blossom"),
    key("F1", "f1", "dark"),
    key("F2", "f2", "dark"),
    key("F3", "f3", "dark"),
    key("F4", "f4", "dark"),
    key("", "gap-1", "spacer"),
    key("F5", "f5", "dark"),
    key("F6", "f6", "dark"),
    key("F7", "f7", "dark"),
    key("F8", "f8", "dark"),
    key("", "gap-2", "spacer"),
    key("F9", "f9", "dark"),
    key("F10", "f10", "dark"),
    key("F11", "f11", "dark"),
    key("F12", "f12", "dark"),
    key(FLOWER_KEY, "blossom-tr", "blossom"),
    key("", "gap-3", "spacer"),
    key("Del", "delete", "dark"),
  ],
  [
    key("~", "`", "dark", "`"),
    key("1", "1", "", "!"),
    key("2", "2", "", "@"),
    key("3", "3", "", "#"),
    key("4", "4", "", "$"),
    key("5", "5", "", "%"),
    key("6", "6", "", "^"),
    key("7", "7", "", "&"),
    key("8", "8", "", "*"),
    key("9", "9", "", "("),
    key("0", "0", "", ")"),
    key("-", "-", "", "_"),
    key("=", "=", "", "+"),
    key("← Backspace", "backspace", "dark wide-backspace"),
    key("", "gap-4", "spacer"),
    key("PgUp", "pageup", "dark"),
  ],
  [
    key("Tab", "tab", "dark wide-tab", FLOWER_MINI),
    key("Q", "q"),
    key("W", "w"),
    key("E", "e"),
    key("R", "r"),
    key("T", "t"),
    key("Y", "y"),
    key("U", "u"),
    key("I", "i"),
    key("O", "o"),
    key("P", "p"),
    key("[", "["),
    key("]", "]"),
    key("", "gap-5", "spacer"),
    key("PgDn", "pagedown", "dark"),
  ],
  [
    key("Caps Lock", "capslock", "dark wide-caps", FLOWER_MINI),
    key("A", "a"),
    key("S", "s"),
    key("D", "d"),
    key("F", "f"),
    key("G", "g"),
    key("H", "h"),
    key("J", "j"),
    key("K", "k"),
    key("L", "l"),
    key(";", ";"),
    key("'", "'"),
    key("Enter", "enter", "accent wide-enter"),
    key("", "gap-6", "spacer"),
    key("Home", "home", "dark"),
  ],
  [
    key("Shift", "shift", "dark wide-shift-l", "☁️"),
    key("Z", "z"),
    key("X", "x"),
    key("C", "c"),
    key("V", "v"),
    key("B", "b"),
    key("N", "n"),
    key("M", "m"),
    key(",", ","),
    key(".", "."),
    key("/", "/", "", "?"),
    key("Shift", "shift", "dark wide-shift-r", FLOWER_MINI),
    key("", "gap-7", "spacer"),
    key("End", "end", "dark"),
  ],
  [
    key("Ctrl", "control", "dark wide-ctrl"),
    key("Win", "win", "dark wide-win"),
    key("Alt", "alt", "dark wide-alt"),
    key("SPACE", "space", "space-key-placeholder"),
    key("Alt", "alt-r", "dark wide-alt"),
    key("Fn", "fn", "dark wide-fn"),
    key("Ctrl", "control-r", "dark wide-ctrl"),
    key("", "gap-8", "spacer"),
    key(FLOWER_KEY, "blossom-b1", "blossom"),
    key(FLOWER_KEY, "blossom-b2", "blossom"),
    key(FLOWER_KEY, "blossom-b3", "blossom"),
  ],
];

interface KeyboardProps {
  activeKey: string | null;
  pressedKeys: Set<string>;
}

export function Keyboard({ activeKey, pressedKeys }: KeyboardProps) {
  return (
    <div className="kb-wrap">
      <div className="keyboard">
        {ROWS.map((row, rowIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static layout, order never changes
          <div className="kb-row" key={rowIndex}>
            {row.map((k) =>
              k.className === "space-key-placeholder" ? (
                <div
                  className={cn(
                    "space-key",
                    activeKey === "space" && "active-next",
                    pressedKeys.has("space") && "pressed"
                  )}
                  key={k.dataKey}
                />
              ) : (
                <div
                  className={cn(
                    "key",
                    k.className,
                    activeKey === k.dataKey && "active-next",
                    pressedKeys.has(k.dataKey) && "pressed"
                  )}
                  key={k.dataKey}
                >
                  {k.label}
                  {k.mini && <div className="mini">{k.mini}</div>}
                </div>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
