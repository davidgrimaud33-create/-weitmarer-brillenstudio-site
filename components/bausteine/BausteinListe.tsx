import type { Baustein } from '@/lib/bausteine/typen'
import { Buehne } from './Buehne'
import { Text } from './Text'
import { TextBild } from './TextBild'
import { Karten } from './Karten'
import { Galerie } from './Galerie'
import { Zitat } from './Zitat'
import { FaqBaustein } from './FaqBaustein'
import { Hinweis } from './Hinweis'
import { Aufforderung } from './Aufforderung'
import { MarkenBaustein } from './MarkenBaustein'
import { OeffnungszeitenBaustein } from './OeffnungszeitenBaustein'
import { AktionenBaustein } from './AktionenBaustein'

/** Ein einzelner Baustein – jeder Typ aus lib/bausteine/typen.ts muss hier vorkommen. */
export function BausteinAnzeige({ baustein }: { baustein: Baustein }) {
  const b = baustein
  switch (b.typ) {
    case 'buehne': return <Buehne {...b} />
    case 'text': return <Text {...b} />
    case 'text-bild': return <TextBild {...b} />
    case 'karten': return <Karten {...b} />
    case 'galerie': return <Galerie {...b} />
    case 'zitat': return <Zitat {...b} />
    case 'faq': return <FaqBaustein {...b} />
    case 'hinweis': return <Hinweis {...b} />
    case 'aufforderung': return <Aufforderung {...b} />
    case 'marken': return <MarkenBaustein {...b} />
    case 'oeffnungszeiten': return <OeffnungszeitenBaustein {...b} />
    case 'aktionen': return <AktionenBaustein {...b} />
    default: {
      const unbekannt: never = b
      throw new Error(`Unbekannter Baustein-Typ: ${JSON.stringify(unbekannt)}`)
    }
  }
}

/** Rendert die Bausteine einer Seite in der angegebenen Reihenfolge. */
export function BausteinListe({ bausteine }: { bausteine: Baustein[] }) {
  return <>{bausteine.map((b, i) => <BausteinAnzeige key={i} baustein={b} />)}</>
}
