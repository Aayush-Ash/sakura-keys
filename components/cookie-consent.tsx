"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "sakurakeys_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  function respond(choice: "accepted" | "declined") {
    localStorage.setItem(CONSENT_KEY, choice);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div aria-label="Cookie notice" className="cookie-banner" role="dialog">
      <p>
        SakuraKeys uses local storage for your preferences and anonymous
        analytics to improve the site. No ads, no data is sold. See our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <div className="cookie-banner-actions">
        <button
          className="cookie-btn decline"
          onClick={() => respond("declined")}
          type="button"
        >
          Decline
        </button>
        <button
          className="cookie-btn accept"
          onClick={() => respond("accepted")}
          type="button"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
