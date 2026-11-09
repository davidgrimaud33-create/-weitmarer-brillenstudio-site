import type { Metadata } from 'next'
import { BEISPIELE, BEISPIEL_BILD } from '@/lib/bausteine/beispiele'
import { MUSTERBUCH } from '@/lib/bausteine/musterbuch'
import type { Baustein } from '@/lib/bausteine/typen'
import { BausteinAnzeige } from '@/components/bausteine/BausteinListe'

export const metadata: Metadata = {
  title: 'Musterbuch',
  description: 'Alle Bausteine für neue Seiten auf einen Blick.',
  robots: { index: false, follow: false },
}

// Die Beispiele nennen überall dasselbe Foto (BEISPIEL_BILD). Damit im Musterbuch echte Fotos
// zu sehen sind, wird es hier der Reihe nach durch vorhandene Ladenfotos ersetzt.
const FOTOS = ['/images/laden/laden-innen.jpg', '/images/laden/fassungswand.jpg', '/images/laden/lounge.jpg', '/images/laden/beratung.jpg']
function mitFotos(b: Baustein): Baustein {
  let n = 0
  return JSON.parse(JSON.stringify(b), (_, wert) => (wert === BEISPIEL_BILD ? FOTOS[n++ % FOTOS.length] : wert))
}

export default function Musterbuch() {
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-6 pb-10 pt-14">
        <div className="kicker">Nur für die Seitenpflege · nicht in Google</div>
        <h1 className="display mt-4 text-[clamp(48px,7vw,104px)]">Musterbuch</h1>
        <p className="mt-6 max-w-[720px] text-xl text-text-2">
          Hier steht jeder Baustein einmal mit Beispieltext. Für eine neue Seite reicht ein Satz wie
          „Neue Seite wie Baustein 1, 3 und 9“.
        </p>
      </section>
      {MUSTERBUCH.map(({ typ, name }, i) => (
        <div key={typ} id={`baustein-${i + 1}`} className="scroll-mt-24 border-t-2 border-dashed border-blau/40">
          <div className="mx-auto max-w-[1320px] px-6 pt-8">
            <h2 className="m-0 inline-flex flex-wrap items-baseline gap-x-3 rounded-full bg-ink px-5 py-2.5 text-lg font-semibold text-white">
              <span>Baustein {i + 1} – {name}</span>
              <code className="text-sm font-normal text-auf-dunkel">typ: &quot;{typ}&quot;</code>
            </h2>
          </div>
          <BausteinAnzeige baustein={mitFotos(BEISPIELE[typ])} />
        </div>
      ))}
    </>
  )
}
