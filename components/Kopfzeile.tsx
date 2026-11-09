'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { stammdaten } from '@/lib/content'
import { Icon } from './Icon'
import { LiveStatus } from './LiveStatus'
import { Suche } from './Suche'

type Eintrag = { href: string; label: string }
type SuchEintrag = { titel: string; href: string; stichworte: string }

export function Kopfzeile({ menue, suchindex }: { menue: Eintrag[]; suchindex: SuchEintrag[] }) {
  const pfad = usePathname()
  const [menueOffen, setMenueOffen] = useState(false)
  const [sucheOffen, setSucheOffen] = useState(false)

  useEffect(() => setMenueOffen(false), [pfad])

  return (
    <>
      <div className="bg-ink text-[#DCE4EC] text-sm">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-x-7 gap-y-2 px-6 py-2.5">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-white"><LiveStatus /></span>
            <span className="text-[#8FA0B2]">{stammdaten.strasse} · {stammdaten.stadtteil}</span>
          </div>
          <a href={`tel:${stammdaten.telefonLink}`} className="font-semibold text-white no-underline hover:text-white">{stammdaten.telefon}</a>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-ink/10 bg-grund/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] items-center gap-6 px-6 py-3.5">
          <Link href="/" className="flex shrink-0" aria-label="Weitmarer Brillenstudio – zur Startseite">
            <Image src="/logo/logo.png" alt="Weitmarer Brillenstudio" width={104} height={50} priority className="h-[50px] w-auto" />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden flex-1 gap-7 text-base font-medium lg:flex">
            {menue.map((m) => {
              const aktiv = pfad.startsWith(m.href)
              return (
                <Link
                  key={m.href}
                  href={m.href}
                  aria-current={aktiv ? 'page' : undefined}
                  className={`py-2.5 no-underline ${aktiv ? 'border-b-2 border-blau font-semibold text-blau' : 'text-ink hover:text-blau'}`}
                >
                  {m.label}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSucheOffen(true)}
              className="flex h-[46px] items-center gap-2 rounded-full border border-ink/20 bg-white px-4 text-[15px] text-text-3"
              aria-label="Seite durchsuchen"
            >
              <Icon name="suche" size={18} className="text-ink" />
              <span className="hidden sm:inline">Suchen</span>
            </button>
            <Link href="/termin" className="hidden h-[46px] items-center rounded-full bg-ink px-5 font-semibold text-white no-underline hover:bg-ink-2 hover:text-white sm:inline-flex">
              Termin vereinbaren
            </Link>
            <button
              type="button"
              onClick={() => setMenueOffen((v) => !v)}
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-ink/20 bg-white lg:hidden"
              aria-expanded={menueOffen}
              aria-controls="mobilmenue"
              aria-label={menueOffen ? 'Menü schließen' : 'Menü öffnen'}
            >
              <Icon name={menueOffen ? 'schliessen' : 'menue'} size={20} />
            </button>
          </div>
        </div>

        {menueOffen && (
          <nav id="mobilmenue" aria-label="Mobilmenü" className="border-t border-ink/10 bg-grund px-6 pb-6 pt-2 lg:hidden">
            {menue.map((m) => (
              <Link key={m.href} href={m.href} className="block border-b border-ink/10 py-4 text-2xl text-ink no-underline condensed uppercase">
                {m.label}
              </Link>
            ))}
            <Link href="/termin" className="mt-5 flex min-h-[52px] items-center justify-center rounded-full bg-blau font-semibold text-white no-underline">
              Termin vereinbaren
            </Link>
          </nav>
        )}
      </header>

      <Suche index={suchindex} offen={sucheOffen} schliessen={() => setSucheOffen(false)} />
    </>
  )
}
