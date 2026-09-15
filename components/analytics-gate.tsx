"use client";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

const CONSENT_KEY = "sakurakeys_cookie_consent";

export function AnalyticsGate() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = () =>
      setAllowed(localStorage.getItem(CONSENT_KEY) !== "declined");
    check();
    // re-check if the user changes their choice in another tab
    window.addEventListener("storage", check);
    return () => window.removeEventListener("storage", check);
  }, []);

  if (!allowed) {
    return null;
  }

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
