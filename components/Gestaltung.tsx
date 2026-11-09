import Image from 'next/image'
import Link from 'next/link'
import { stammdaten } from '@/lib/content'

/** Bild mit automatischem WebP-Tausch */
export function Bild(props: { src: string; alt: string; className?: string; style?: React.CSSProperties; sizes?: string; priority?: boolean }) {
  return (
    <Image
      src={props.src}
      alt={props.alt}
      fill
      sizes={props.sizes ?? '(max-width: 768px) 100vw, 50vw'}
      priority={props.priority}
      className={props.className ?? 'object-cover'}
      style={props.style}
    />
  )
}

/** Tiefer Hintergrund: Farbverläufe, driftende Lichtflächen, feines Korn */
export function HeroGrund({ children, ringe = false }: { children: React.ReactNode; ringe?: boolean }) {
  return (
    <div className="hero-grund relative overflow-hidden">
      <div aria-hidden className="a-orb1 pointer-events-none absolute -right-36 -top-44 h-[640px] w-[640px] rounded-full blur-[24px]" style={{ background: 'radial-gradient(circle, rgba(90,168,230,0.55) 0%, rgba(90,168,230,0) 66%)' }} />
      <div aria-hidden className="a-orb2 pointer-events-none absolute -bottom-60 -left-52 h-[560px] w-[560px] rounded-full blur-[28px]" style={{ background: 'radial-gradient(circle, rgba(236,196,146,0.5) 0%, rgba(236,196,146,0) 66%)' }} />
      <div aria-hidden className="a-orb3 pointer-events-none absolute left-[38%] top-[30%] h-[360px] w-[360px] rounded-full blur-[30px]" style={{ background: 'radial-gradient(circle, rgba(10,98,168,0.18) 0%, rgba(10,98,168,0) 68%)' }} />
      <svg aria-hidden width="100%" height="100%" className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-multiply">
        <filter id="korn"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={3} stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#korn)" />
      </svg>
      {ringe && (
        <svg aria-hidden viewBox="0 0 200 200" fill="none" className="a-spin pointer-events-none absolute right-[6%] top-10 h-[460px] w-[460px] opacity-50">
          <circle cx="100" cy="100" r="96" stroke="#0A62A8" strokeOpacity="0.25" strokeWidth="0.5" strokeDasharray="1 3" />
          <circle cx="100" cy="100" r="70" stroke="#0A62A8" strokeOpacity="0.2" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="44" stroke="#0A62A8" strokeOpacity="0.2" strokeWidth="0.5" strokeDasharray="6 4" />
          <circle cx="100" cy="4" r="1.8" fill="#E2231A" />
        </svg>
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}

/** Foto im Linsenrahmen (Bogen oben) mit Verlaufsrand, Tiefe und Lichtschimmer */
export function LinsenBild({ src, alt, ausschnitt = '50% 50%', priority, mitRingen = true }: { src: string; alt: string; ausschnitt?: string; priority?: boolean; mitRingen?: boolean }) {
  return (
    <>
      {mitRingen && (
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[44%] aspect-square w-[150%] max-w-[860px] -translate-x-1/2 -translate-y-1/2">
          <svg viewBox="0 0 200 200" fill="none" className="a-spin absolute inset-0 h-full w-full opacity-55">
            <circle cx="100" cy="100" r="98" stroke="#0A62A8" strokeOpacity="0.25" strokeWidth="0.4" strokeDasharray="1 3" />
            <circle cx="100" cy="100" r="84" stroke="#0A62A8" strokeOpacity="0.18" strokeWidth="0.5" />
          </svg>
          <svg viewBox="0 0 200 200" fill="none" className="a-spin-rev absolute inset-0 h-full w-full opacity-55">
            <circle cx="100" cy="100" r="70" stroke="#0A62A8" strokeOpacity="0.22" strokeWidth="0.5" strokeDasharray="6 4" />
            <circle cx="100" cy="30" r="1.6" fill="#E2231A" />
          </svg>
        </div>
      )}
      <div className="linsen-rahmen absolute inset-0 rounded-[320px_320px_32px_32px]">
        <div className="relative h-full w-full overflow-hidden rounded-[317px_317px_29px_29px] bg-[#DCD8D0]">
          <Bild src={src} alt={alt} priority={priority} className="a-focus object-cover" style={{ objectPosition: ausschnitt }} />
          <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(120% 70% at 50% 0%, rgba(156,199,236,0.28) 0%, rgba(156,199,236,0) 60%), linear-gradient(180deg, rgba(14,27,43,0) 50%, rgba(14,27,43,0.42) 100%)' }} />
          <div aria-hidden className="a-sheen absolute inset-0 mix-blend-soft-light" style={{ backgroundImage: 'linear-gradient(115deg, rgba(255,255,255,0) 38%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0) 62%)' }} />
        </div>
      </div>
    </>
  )
}

/** Laufband – Inhalt wird für die Endlosschleife verdoppelt */
export function Laufband({ children, langsam, className, label }: { children: React.ReactNode; langsam?: boolean; className?: string; label: string }) {
  return (
    <div className={`overflow-hidden ${className ?? ''}`} aria-label={label} role="region">
      <div className={langsam ? 'a-marquee-slow' : 'a-marquee'}>
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden>{children}</div>
      </div>
    </div>
  )
}

export function Brotkruemel({ seite }: { seite: string }) {
  return (
    <nav aria-label="Brotkrümel" className="flex gap-2 text-sm text-text-3">
      <Link href="/" className="text-text-3">Start</Link><span aria-hidden>/</span><span className="text-ink">{seite}</span>
    </nav>
  )
}

/**
 * Link für Knöpfe aus Inhaltsdateien: interne Adressen (/…, #…) über next/link,
 * externe (https://…) in neuem Tab, tel:/mailto: als normaler Link.
 */
export function Verweis({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
  if (href.startsWith('/') || href.startsWith('#')) return <Link href={href} className={className}>{children}</Link>
  if (/^https?:\/\//.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
  return <a href={href} className={className}>{children}</a>
}

export function CtaBand({ titel, text, dunkel = true, knopf }: { titel: string; text?: string; dunkel?: boolean; knopf?: { text: string; link: string } }) {
  return (
    <section className="mx-auto max-w-[1320px] px-6 py-24">
      <div className={`a-reveal relative flex flex-wrap items-center justify-between gap-8 overflow-hidden rounded-[36px] p-[clamp(36px,6vw,72px)] text-white ${dunkel ? 'bg-ink' : 'bg-blau'}`}>
        <svg aria-hidden viewBox="0 0 200 200" fill="none" className="pointer-events-none absolute -bottom-44 -right-28 h-[520px] w-[520px] opacity-[0.16]">
          <circle cx="100" cy="100" r="96" stroke="#fff" strokeWidth="1.5" /><circle cx="100" cy="100" r="70" stroke="#fff" strokeWidth="1.5" /><circle cx="100" cy="100" r="44" stroke="#fff" strokeWidth="1.5" /><circle cx="100" cy="100" r="18" fill="#fff" />
        </svg>
        <div className="relative max-w-[700px]">
          <h2 className="display m-0 text-[clamp(40px,5vw,80px)]">{titel}</h2>
          {text && <p className="mt-4 text-[19px] text-white/75">{text}</p>}
        </div>
        <div className="relative flex flex-wrap gap-3">
          <Verweis href={knopf?.link ?? '/termin'} className="rounded-full bg-white px-7 py-4 text-lg font-semibold text-ink no-underline hover:text-ink">{knopf?.text ?? 'Termin vereinbaren'}</Verweis>
          <a href={`tel:${stammdaten.telefonLink}`} className="rounded-full border border-white/50 px-7 py-4 text-lg font-semibold text-white no-underline hover:text-white">{stammdaten.telefon}</a>
        </div>
      </div>
    </section>
  )
}
