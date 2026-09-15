import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/static-page-layout";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about SakuraKeys — WPM calculation, sounds, accounts, and more.",
  alternates: { canonical: "/faq" },
};

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "Is SakuraKeys free to use?",
    a: "Yes. SakuraKeys is completely free, with no account, paywall, or ads.",
  },
  {
    q: "How is WPM calculated?",
    a: "WPM (words per minute) is calculated as the number of correctly typed characters divided by 5, divided by the elapsed time in minutes — the standard convention used by most typing tests.",
  },
  {
    q: "How is accuracy calculated?",
    a: "Accuracy is the percentage of correctly typed characters out of all characters you typed (correct + incorrect), based on the final state of your test after any corrections.",
  },
  {
    q: "Why don't I hear any keyboard sounds?",
    a: (
      <>
        Browsers block audio until you interact with the page, so press any key
        or click once to enable sound. You can also check the{" "}
        <strong>Audio</strong> toggle in the header or the volume slider in{" "}
        <strong>Settings</strong>.
      </>
    ),
  },
  {
    q: "Do I need an account?",
    a: "No. SakuraKeys works entirely without an account. Your preferences (sound, volume, difficulty) are saved locally in your browser.",
  },
  {
    q: "Does SakuraKeys work on mobile?",
    a: "The site itself is responsive and fully readable on mobile. Typing requires a physical or Bluetooth keyboard though, so on a phone or tablet with only a touchscreen you can browse and read, but you won't be able to type — the on-screen keyboard graphic is hidden on small screens for that reason.",
  },
  {
    q: "What do 'easy' and 'hard' difficulty change?",
    a: "Easy uses common, shorter everyday words. Hard pulls from a pool of longer, less common words for a bigger challenge.",
  },
  {
    q: "What's zen mode?",
    a: "Zen mode removes the timer and word limit entirely — type for as long as you like, at your own pace, with live stats tracked in the background.",
  },
  {
    q: "How do I restart a test?",
    a: 'Press Tab + Enter together, or click the "restart" link beneath the typing area.',
  },
  {
    q: "I found a bug or have a feature request — where do I report it?",
    a: (
      <>
        Please open an issue on the{" "}
        <a
          href="https://github.com/Aayush-Ash"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub repository
        </a>
        .
      </>
    ),
  },
];

export default function FaqPage() {
  return (
    <StaticPageLayout
      subtitle="Everything you need to know about SakuraKeys."
      title="Frequently Asked Questions"
    >
      {faqs.map((item) => (
        <div className="faq-item" key={item.q}>
          <h2>{item.q}</h2>
          <p>{item.a}</p>
        </div>
      ))}

      <p style={{ marginTop: 28 }}>
        Didn't find your answer? Check our{" "}
        <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/terms">Terms of Service</Link>, or head back to{" "}
        <Link href="/">the typing test</Link>.
      </p>
    </StaticPageLayout>
  );
}
