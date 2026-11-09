import type { Metadata } from 'next'
import { monatsangebote as angebote } from '@/lib/angebote-daten'
import { AngeboteAnsicht } from '@/components/angebote/Angebote'


export const metadata: Metadata = {
  title: `Angebote ${angebote.monat}`,
  description: `Aktuelle Monatsangebote im Weitmarer Brillenstudio in Bochum-Weitmar: ${angebote.angebote.map((a) => a.titel).join(', ')}.`,
  alternates: { canonical: '/angebote' },
}

export default function AngebotePage() {
  return <AngeboteAnsicht daten={angebote} />
}
