import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function StaticPageLayout({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="static-page">
      <header className="static-header">
        <Link className="static-logo" href="/">
          <span className="logo-text">SakuraKeys</span>
          <Image
            alt=""
            className="blossom-img"
            height={18}
            src="/flower-icon.png"
            width={18}
          />
        </Link>
        <Link className="pill-btn" href="/">
          ← Back to typing test
        </Link>
      </header>

      <main className="static-main">
        {title && <h1>{title}</h1>}
        {subtitle && <p className="static-subtitle">{subtitle}</p>}
        <div className="static-content">{children}</div>
      </main>

      <footer className="static-footer">
        <nav aria-label="Legal and support links" className="static-footer-nav">
          <Link href="/">Home</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </nav>
        <p>
          Built by <span className="name">Aayush Kumar</span>. The source code
          is available on GitHub.
        </p>
      </footer>
    </div>
  );
}
