import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AnalyticsGate } from "@/components/analytics-gate";
import { CookieConsent } from "@/components/cookie-consent";
import { env } from "@/lib/env";
import "./globals.css";

const SITE_NAME = "SakuraKeys";
const DESCRIPTION =
  "A Japanese/anime-themed typing test with realistic mechanical keyboard sounds, live WPM tracking, and an interactive on-screen keyboard. Free, no account needed.";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${SITE_NAME} — タイプで進め`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "typing test",
    "WPM test",
    "typing speed test",
    "mechanical keyboard sounds",
    "anime typing test",
    "sakura",
    "free typing practice",
  ],
  authors: [{ name: "Aayush Kumar", url: "https://github.com/Aayush-Ash" }],
  creator: "Aayush Kumar",
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — タイプで進め`,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — タイプで進め`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#08050a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to typing test
        </a>
        {children}
        <CookieConsent />
        <AnalyticsGate />
      </body>
    </html>
  );
}
