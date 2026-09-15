import type { Metadata } from "next";
import { StaticPageLayout } from "@/components/static-page-layout";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of SakuraKeys, a free online typing test.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <StaticPageLayout
      subtitle="Last updated: September 14, 2026"
      title="Terms of Service"
    >
      <h2>Acceptance of terms</h2>
      <p>
        By accessing or using SakuraKeys, you agree to these Terms of Service.
        If you don't agree, please don't use the site.
      </p>

      <h2>The service</h2>
      <p>
        SakuraKeys is provided as a free, ad-free typing test for personal,
        non-commercial use. We may add, change, or remove features (including
        test modes, sounds, or visuals) at any time without notice.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>
          Don't attempt to disrupt, overload, or scrape the service in a way
          that harms availability for others.
        </li>
        <li>
          Don't use automated scripts to farm results or artificially inflate
          WPM/leaderboard-style stats.
        </li>
        <li>
          Don't attempt to reverse engineer or misuse the site to distribute
          malware.
        </li>
      </ul>

      <h2>Intellectual property</h2>
      <p>
        The SakuraKeys name, design, and original artwork/audio are provided for
        use within this application. Underlying source code is available under
        the license published in the project's{" "}
        <a
          href="https://github.com/Aayush-Ash"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub repository
        </a>
        . Third-party fonts, icons, and libraries remain the property of their
        respective owners and are used under their own licenses.
      </p>

      <h2>No warranty</h2>
      <p>
        SakuraKeys is provided "as is" without warranties of any kind, express
        or implied. We don't guarantee the service will be uninterrupted,
        error-free, or suitable for any particular purpose.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, SakuraKeys and its creator are
        not liable for any indirect, incidental, or consequential damages
        arising from your use of, or inability to use, the service.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may revise these terms from time to time. Continued use of the site
        after changes are posted constitutes acceptance of the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Reach out via the{" "}
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
