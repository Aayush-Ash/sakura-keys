import type { Metadata } from "next";
import Link from "next/link";
import { StaticPageLayout } from "@/components/static-page-layout";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "This page doesn't exist. Head back to the SakuraKeys typing test.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <StaticPageLayout>
      <div className="not-found-hero">
        <div className="code">404</div>
        <h1>This page wandered off the path</h1>
        <p>
          The page you're looking for doesn't exist, may have moved, or the link
          might be broken.
        </p>
        <div className="cta-row">
          <Link className="cta-primary" href="/">
            🌸 Start typing test
          </Link>
          <Link className="cta-secondary" href="/faq">
            Visit FAQ
          </Link>
        </div>
      </div>
    </StaticPageLayout>
  );
}
