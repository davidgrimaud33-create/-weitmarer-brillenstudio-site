type Props = { name: IconName; size?: number; className?: string; strokeWidth?: number }

export type IconName =
  | 'suche' | 'telefon' | 'kalender' | 'ort' | 'haken' | 'stern' | 'auge' | 'druck' | 'sonne'
  | 'wuerfel' | 'monitor' | 'dokument' | 'schild' | 'menue' | 'schliessen' | 'pfeil' | 'linse'
  | 'puls' | 'kreuz'

const PFADE: Record<IconName, React.ReactNode> = {
  suche: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  telefon: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />,
  kalender: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  ort: <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  haken: <path d="M20 6L9 17l-5-5" />,
  stern: <path d="M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.6 5.8 21l1.4-7L2 9.3l7-.8z" />,
  auge: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  druck: <><circle cx="12" cy="13" r="8" /><path d="M12 13l3.5-3.5M12 2v3" /></>,
  sonne: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  wuerfel: <><path d="M12 2l9 5v10l-9 5-9-5V7z" /><path d="M12 22V12M21 7l-9 5-9-5" /></>,
  monitor: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M7 14l3-3 3 2 4-5M8 22h8" /></>,
  dokument: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>,
  schild: <><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  menue: <path d="M3 6h18M3 12h18M3 18h18" />,
  schliessen: <path d="M18 6L6 18M6 6l12 12" />,
  pfeil: <path d="M5 12h14M13 6l6 6-6 6" />,
  linse: <><path d="M6 30c4-14 32-14 36 0" transform="scale(.5)" /><path d="M10 30c3-8 25-8 28 0" transform="scale(.5)" /></>,
  puls: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  kreuz: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></>,
}

export function Icon({ name, size = 22, className, strokeWidth = 2 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {PFADE[name]}
    </svg>
  )
}

/** Das Auge aus dem Logo – kleines Markenzeichen */
export function LogoAuge({ className }: { className?: string }) {
  return (
    <svg width="20" height="12" viewBox="0 0 40 22" fill="none" aria-hidden="true" className={className}>
      <path d="M2 11C8 3 14 1 20 1s12 2 18 10c-6 8-12 10-18 10S8 19 2 11z" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="20" cy="11" r="6" fill="#0A62A8" />
      <circle cx="18" cy="9" r="1.6" fill="#E2231A" />
    </svg>
  )
}
