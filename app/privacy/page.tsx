import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/static-page-layout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SakuraKeys handles your data: local settings storage, anonymous analytics, and cookies.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      subtitle="Last updated: September 14, 2026"
      title="Privacy Policy"
    >
      <h2>Overview</h2>
      <p>
        SakuraKeys ("we", "our") is a free typing test. This page explains what
        data is collected when you use the site and how it's handled. We keep
        this deliberately simple: SakuraKeys does not require an account, and we
        do not sell your data.
      </p>

      <h2>Information stored on your device</h2>
      <p>
        Your test settings — theme, sound volume, audio on/off, difficulty, and
        similar preferences — are saved in your browser's{" "}
        <strong>localStorage</strong>. This data never leaves your device and is
        not sent to our servers. Clearing your browser storage or cookies will
        reset these preferences.
      </p>

      <h2>Analytics</h2>
      <p>
        We use privacy-friendly analytics (Vercel Analytics and Speed Insights)
        to understand aggregate traffic and performance — for example, page
        views and load times. This data is anonymized and is not used to
        individually identify you, and is not shared with advertisers.
      </p>

      <h2>Cookies</h2>
      <p>
        SakuraKeys uses a minimal, functional cookie/localStorage entry to
        remember that you've seen our cookie notice, plus your saved preferences
        described above. We do not use third-party advertising or tracking
        cookies. See our cookie banner for accept/decline options.
      </p>

      <h2>Third-party services</h2>
      <p>
        The site is hosted on Vercel, which may log standard server request data
        (such as IP address and request timing) for security and performance
        purposes, governed by{" "}
        <a
          href="https://vercel.com/legal/privacy-policy"
          rel="noopener noreferrer"
          target="_blank"
        >
          Vercel's own privacy policy
        </a>
        .
      </p>

      <h2>Children's privacy</h2>
      <p>
        SakuraKeys is not directed at children under 13 and we do not knowingly
        collect personal information from them.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy as the app evolves. Material changes will be
        reflected by updating the "Last updated" date above.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Reach out via the{" "}
        <a
          href="https://github.com/Aayush-Ash"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub repository
        </a>{" "}
        linked in the site footer.
      </p>
    </StaticPageLayout>
  );
}
