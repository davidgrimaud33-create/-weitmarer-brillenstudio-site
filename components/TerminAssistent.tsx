'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { oeffnungszeiten, stammdaten } from '@/lib/content'
import { MONATE_KURZ, WOCHENTAGE, WOCHENTAGE_KURZ, naechsteOeffnungstage } from '@/lib/oeffnungszeiten'
import { Icon } from './Icon'

const ANLIEGEN = [
  { id: 'brille', label: 'Neue Brille', hint: 'Sehstärke, Fassung, Gläser' },
  { id: 'gleitsicht', label: 'Gleitsicht', hint: 'Eine Brille für alle Entfernungen' },
  { id: 'linsen', label: 'Kontaktlinsen', hint: 'Testlinsen unverbindlich anpassen' },
  { id: 'screening', label: 'Augenscreening', hint: 'Augendruck, Netzhaut-Scan' },
  { id: 'trocken', label: 'Trockene Augen', hint: 'Tränenfilmanalyse, TearStim' },
  { id: 'service', label: 'Reparatur & Service', hint: 'Passform, Reinigung, Defekt' },
]

type Zeitraum = 'vormittag' | 'nachmittag' | 'egal'

// Spam-Schutz: Das Widget erscheint nur, wenn der Site-Key gesetzt ist (Cloudflare Turnstile).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ''
const TURNSTILE_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

type TurnstileApi = {
  render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; 'expired-callback': () => void; 'error-callback': () => void }) => string
  reset: (id?: string) => void
  remove: (id?: string) => void
}
declare global {
  interface Window { turnstile?: TurnstileApi }
}

export function TerminAssistent() {
  const params = useSearchParams()
  const [schritt, setSchritt] = useState(1)
  const [anliegen, setAnliegen] = useState<string | null>(null)
  const [tagIdx, setTagIdx] = useState(0)
  const [zeitraum, setZeitraum] = useState<Zeitraum>('vormittag')
  const [tage, setTage] = useState<ReturnType<typeof naechsteOeffnungstage>>([])
  const [form, setForm] = useState({ name: '', telefon: '', email: '', nachricht: '', einwilligung: false, website: '' })
  const [turnstileToken, setTurnstileToken] = useState('')
  const [status, setStatus] = useState<'bereit' | 'sendet' | 'fehler'>('bereit')
  const widgetBox = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)

  // Widget nur im Kontaktschritt laden und anzeigen
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || schritt !== 3) return
    let abgebrochen = false
    const zeichnen = () => {
      if (abgebrochen || !widgetBox.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(widgetBox.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: setTurnstileToken,
        'expired-callback': () => setTurnstileToken(''),
        'error-callback': () => setTurnstileToken(''),
      })
    }
    if (window.turnstile) zeichnen()
    else {
      let el = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SCRIPT}"]`)
      if (!el) {
        el = document.createElement('script')
        el.src = TURNSTILE_SCRIPT
        el.async = true
        document.head.appendChild(el)
      }
      el.addEventListener('load', zeichnen)
    }
    return () => {
      abgebrochen = true
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = undefined
      setTurnstileToken('')
    }
  }, [schritt])

  useEffect(() => setTage(naechsteOeffnungstage(oeffnungszeiten, 6)), [])
  useEffect(() => {
    const a = params.get('anliegen')
    if (a && ANLIEGEN.some((x) => x.id === a)) { setAnliegen(a); setSchritt(2) }
  }, [params])

  const tag = tage[tagIdx]
  const nurVormittag = tag ? tag.zeiten.every(([, bis]) => bis <= '13:00') : false
  const zeitraeume = useMemo(() => {
    const l: { id: Zeitraum; label: string }[] = [{ id: 'vormittag', label: 'Vormittags · 9–13 Uhr' }]
    if (!nurVormittag) l.push({ id: 'nachmittag', label: 'Nachmittags · 14–18 Uhr' })
    l.push({ id: 'egal', label: 'Egal' })
    return l
  }, [nurVormittag])

  const anliegenLabel = ANLIEGEN.find((a) => a.id === anliegen)?.label ?? ''
  const wann = tag
    ? `${WOCHENTAGE[tag.datum.getDay()]}, ${tag.datum.getDate()}. ${MONATE_KURZ[tag.datum.getMonth()]} · ${zeitraum === 'egal' ? 'Uhrzeit egal' : zeitraum === 'vormittag' ? 'Vormittags' : 'Nachmittags'}`
    : ''
  const fortschritt = { 1: 15, 2: 50, 3: 82, 4: 100 }[schritt] ?? 0
  const kannSenden = form.name.trim().length > 1 && (form.telefon.trim().length > 4 || form.email.includes('@')) && form.einwilligung && (!TURNSTILE_SITE_KEY || turnstileToken !== '')

  async function senden(e: React.FormEvent) {
    e.preventDefault()
    if (!kannSenden) return
    setStatus('sendet')
    try {
      const res = await fetch('/api/termin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, anliegen: anliegenLabel, wunschtermin: wann, turnstileToken }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('bereit')
      setSchritt(4)
    } catch {
      setStatus('fehler')
      if (widgetId.current) { window.turnstile?.reset(widgetId.current); setTurnstileToken('') }
    }
  }

  const opt = (an: boolean) => `transition-colors ${an ? 'border-ink bg-ink text-white' : 'border-transparent bg-grund text-ink hover:border-ink/20'}`
  const feld = 'min-h-[52px] rounded-[14px] border border-[#CFCBC2] bg-[#FBFAF8] px-4 py-3'

  return (
    <div className="a-rise a-d2 min-w-0 flex-[999_1_620px] rounded-[32px] bg-white p-[clamp(22px,4vw,40px)] shadow-[0_30px_60px_-40px_rgba(14,27,43,0.4)]">
      <div className="flex items-center justify-between gap-3 text-sm font-semibold text-text-3">
        <span>{schritt < 4 ? `Schritt ${schritt} von 3 · ${['Anliegen', 'Wunschzeit', 'Kontaktdaten'][schritt - 1]}` : 'Fertig'}</span>
        {(schritt === 2 || schritt === 3) && (
          <button type="button" onClick={() => setSchritt(schritt - 1)} className="min-h-11 px-1 font-semibold text-blau">← Zurück</button>
        )}
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[#ECE9E3]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={fortschritt}>
        <div className="h-full rounded-full bg-blau transition-[width] duration-500" style={{ width: `${fortschritt}%` }} />
      </div>

      {schritt === 1 && (
        <div className="mt-8">
          <h2 className="display m-0 text-[40px]">Worum geht es?</h2>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
            {ANLIEGEN.map((a) => (
              <button key={a.id} type="button" aria-pressed={anliegen === a.id} onClick={() => { setAnliegen(a.id); setSchritt(2) }}
                className={`min-h-[84px] rounded-[20px] border px-[18px] py-4 text-left hover:-translate-y-0.5 ${opt(anliegen === a.id)}`}>
                <span className="block text-xl font-bold">{a.label}</span>
                <span className="block text-sm opacity-80">{a.hint}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {schritt === 2 && (
        <div className="mt-8">
          <h2 className="display m-0 text-[40px]">Wann passt es Ihnen?</h2>
          <p className="mt-2 text-text-3">Wählen Sie einen Wunschtag und eine Tageszeit – wir richten uns so gut es geht danach.</p>
          <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(96px,1fr))] gap-2.5" role="group" aria-label="Wunschtag">
            {tage.map((t, i) => (
              <button key={t.datum.toISOString()} type="button" aria-pressed={tagIdx === i}
                onClick={() => { setTagIdx(i); if (t.zeiten.every(([, b]) => b <= '13:00') && zeitraum === 'nachmittag') setZeitraum('vormittag') }}
                className={`min-h-[92px] rounded-[18px] border px-1.5 py-2.5 text-center ${tagIdx === i ? 'border-blau bg-blau text-white' : 'border-transparent bg-grund text-ink'}`}>
                <span className="block text-[13px] font-semibold opacity-75">{WOCHENTAGE_KURZ[t.datum.getDay()]}</span>
                <span className="block text-[28px] font-[780] leading-[1.1] [font-stretch:72%]">{t.datum.getDate()}</span>
                <span className="block text-[13px] opacity-75">{MONATE_KURZ[t.datum.getMonth()]}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2.5" role="group" aria-label="Tageszeit">
            {zeitraeume.map((z) => (
              <button key={z.id} type="button" aria-pressed={zeitraum === z.id} onClick={() => setZeitraum(z.id)}
                className={`min-h-12 rounded-full border px-[18px] py-2.5 font-semibold ${zeitraum === z.id ? 'border-ink bg-ink text-white' : 'border-ink/20 bg-white text-ink'}`}>
                {z.label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setSchritt(3)} className="mt-7 min-h-[52px] rounded-full bg-blau px-7 py-3.5 text-[17px] font-semibold text-white">Weiter</button>
        </div>
      )}

      {schritt === 3 && (
        <form className="mt-8" onSubmit={senden} noValidate>
          <h2 className="display m-0 text-[40px]">Wie erreichen wir Sie?</h2>
          <div className="mt-3.5 flex flex-wrap gap-2">
            <span className="rounded-full bg-blau-zart px-3 py-1.5 text-sm font-semibold text-[#1E3550]">{anliegenLabel}</span>
            <span className="rounded-full bg-blau-zart px-3 py-1.5 text-sm font-semibold text-[#1E3550]">{wann}</span>
          </div>
          <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
            <label className="flex flex-col gap-1.5 font-semibold">Name
              <input required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={feld} />
            </label>
            <label className="flex flex-col gap-1.5 font-semibold">Telefon
              <input type="tel" autoComplete="tel" value={form.telefon} onChange={(e) => setForm({ ...form, telefon: e.target.value })} className={feld} />
            </label>
            <label className="col-span-full flex flex-col gap-1.5 font-semibold">E-Mail (optional, wenn Telefon angegeben)
              <input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={feld} />
            </label>
            <label className="col-span-full flex flex-col gap-1.5 font-semibold">Möchten Sie uns noch etwas sagen? (optional)
              <textarea rows={3} value={form.nachricht} onChange={(e) => setForm({ ...form, nachricht: e.target.value })} className={`${feld} resize-y`} />
            </label>
            {/* Honeypot gegen Spam-Bots – für Menschen unsichtbar */}
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </div>
          <label className="mt-4 flex items-start gap-3 text-[15px] text-text-2">
            <input type="checkbox" checked={form.einwilligung} onChange={(e) => setForm({ ...form, einwilligung: e.target.checked })} className="mt-0.5 h-[22px] w-[22px] shrink-0 accent-blau" />
            <span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert werden. Mehr in der <a href="/datenschutz">Datenschutzerklärung</a>.</span>
          </label>
          {TURNSTILE_SITE_KEY && <div ref={widgetBox} className="mt-5" />}
          {status === 'fehler' && (
            <p role="alert" className="mt-4 rounded-2xl bg-[#FFF1EF] p-4 text-[#7A1E18]">Das hat leider nicht geklappt. Bitte rufen Sie uns an: <a href={`tel:${stammdaten.telefonLink}`}>{stammdaten.telefon}</a></p>
          )}
          <button type="submit" disabled={!kannSenden || status === 'sendet'} className="mt-6 min-h-[52px] rounded-full bg-blau px-7 py-3.5 text-[17px] font-semibold text-white disabled:opacity-40">
            {status === 'sendet' ? 'Wird gesendet …' : 'Anfrage senden'}
          </button>
          {!kannSenden && <p className="mt-2 text-sm text-text-3">Bitte Name, Telefon oder E-Mail und die Einwilligung angeben{TURNSTILE_SITE_KEY ? ' und den Spam-Schutz bestätigen' : ''}.</p>}
        </form>
      )}

      {schritt === 4 && (
        <div role="status" className="mt-9 py-5 text-center">
          <div className="a-pop mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blau text-white"><Icon name="haken" size={46} strokeWidth={2.6} /></div>
          <h2 className="display mt-6 text-[44px]">Danke! Ihre Anfrage ist da.</h2>
          <p className="mx-auto mt-3 max-w-[520px] text-text-2">{anliegenLabel} · {wann}. Wir melden uns mit einem Terminvorschlag. Eilt es? Rufen Sie uns an: <a href={`tel:${stammdaten.telefonLink}`}>{stammdaten.telefon}</a></p>
          <button type="button" onClick={() => { setSchritt(1); setAnliegen(null); setForm({ name: '', telefon: '', email: '', nachricht: '', einwilligung: false, website: '' }) }} className="mt-6 min-h-12 rounded-full bg-grund px-6 py-3 font-semibold">Neue Anfrage</button>
        </div>
      )}
    </div>
  )
}
