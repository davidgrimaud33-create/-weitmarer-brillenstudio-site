import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BausteinListe } from '@/components/bausteine/BausteinListe'
import { ladeSeiten } from '@/lib/seiten'

// Nur Adressen aus content/seiten/ gibt es; alles andere ist eine 404-Seite.
export const dynamicParams = false

// "output: export" verlangt mindestens eine Seite. Gibt es noch keine Datei in content/seiten/,
// wird eine Platzhalter-Adresse gebaut ("_leer" – echte Adressen dürfen keinen Unterstrich haben).
// Sie zeigt die normale 404-Seite, steht in keinem Menü und nicht in der Sitemap.
const PLATZHALTER = '_leer'

export function generateStaticParams() {
  const seiten = ladeSeiten()
  return seiten.length > 0 ? seiten.map((s) => ({ seite: s.adresse })) : [{ seite: PLATZHALTER }]
}

const finde = (adresse: string) => ladeSeiten().find((s) => s.adresse === adresse)

export async function generateMetadata({ params }: { params: Promise<{ seite: string }> }): Promise<Metadata> {
  const s = finde((await params).seite)
  if (!s) return {}
  return {
    title: s.titel,
    description: s.beschreibung,
    alternates: { canonical: `/${s.adresse}` },
    ...(s.menue === 'versteckt' ? { robots: { index: false, follow: false } } : {}),
  }
}

export default async function NeueSeite({ params }: { params: Promise<{ seite: string }> }) {
  const s = finde((await params).seite)
  if (!s) notFound()
  const hatBuehne = s.bausteine.some((b) => b.typ === 'buehne')
  return (
    <>
      {/* Die Bühne bringt die h1 mit; ohne Bühne gibt es sie unsichtbar für Screenreader und Google. */}
      {!hatBuehne && <h1 className="sr-only">{s.titel}</h1>}
      <BausteinListe bausteine={s.bausteine} />
    </>
  )
}
