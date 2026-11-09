/**
 * Abschnitts-Überschrift wie auf den bestehenden Seiten.
 * Lange deutsche Wörter dürfen umbrechen, damit auf dem Handy nichts übersteht.
 */
export const UMBRUCH = 'hyphens-auto [overflow-wrap:break-word]'

export function Ueberschrift({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`display m-0 text-[clamp(40px,4.6vw,68px)] ${UMBRUCH} ${className ?? ''}`}>{children}</h2>
}

/** Fließtext in Absätze teilen: Leerzeile = neuer Absatz. Kein HTML, kein Markdown. */
export function absaetze(text: string): string[] {
  return text.split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean)
}
