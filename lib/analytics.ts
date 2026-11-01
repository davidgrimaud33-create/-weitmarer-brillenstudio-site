/**
 * Umami-Ereignisse (Statistik ohne Cookies, läuft später auf dem Hetzner-Server).
 * Ohne geladenes Script (Staging, Adblocker …) passiert einfach nichts.
 */
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void }
  }
}

export function trackEvent(event: string, data?: Record<string, string | number>) {
  try {
    window.umami?.track(event, data)
  } catch {
    // Statistik darf die Seite nie kaputt machen
  }
}
