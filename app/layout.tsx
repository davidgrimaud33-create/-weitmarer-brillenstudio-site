import type { Metadata, Viewport } from 'next'
import { Archivo } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { Kopfzeile } from '@/components/Kopfzeile'
import { Fusszeile } from '@/components/Fusszeile'
import { MobilLeiste } from '@/components/MobilLeiste'
import { stammdaten, oeffnungszeiten } from '@/lib/content'
import { isStaging, SITE_URL } from '@/lib/feature-flags'

const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Weitmarer Brillenstudio | Ihr Optiker in Bochum-Weitmar',
    template: '%s | Weitmarer Brillenstudio Bochum',
  },
  description:
    'Meisterbetrieb für Brillen, Gleitsicht und Kontaktlinsen in Bochum-Weitmar – mit Augenscreening per Laser-Scan, Hilfe bei trockenen Augen und 3 Jahren Garantie.',
  openGraph: { type: 'website', locale: 'de_DE', siteName: stammdaten.name },
  robots: isStaging ? { index: false, follow: false } : { index: true, follow: true },
  alternates: { canonical: '/' },
}

export const viewport: Viewport = { themeColor: '#0E1B2B' }

// Strukturierte Daten für Google (lokales Optiker-Geschäft mit Öffnungszeiten)
const TAG_CODES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Optician',
  name: stammdaten.name,
  url: SITE_URL,
  telephone: stammdaten.telefonLink,
  email: stammdaten.email,
  image: `${SITE_URL}/images/laden/laden-aussen.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: stammdaten.strasse,
    postalCode: stammdaten.plz,
    addressLocality: stammdaten.ort,
    addressCountry: 'DE',
  },
  openingHoursSpecification: Object.entries(oeffnungszeiten.regulaer).flatMap(([tag, fenster]) =>
    fenster.map(([opens, closes]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][Number(tag)]}`,
      opens,
      closes,
    })),
  ),
  openingHours: Object.entries(oeffnungszeiten.regulaer).flatMap(([tag, f]) => f.map(([a, b]) => `${TAG_CODES[Number(tag)]} ${a}-${b}`)),
}

const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={archivo.variable}>
      <body>
        <a href="#inhalt" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Zum Inhalt springen</a>
        <Kopfzeile />
        <main id="inhalt">{children}</main>
        <Fusszeile />
        <MobilLeiste />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {!isStaging && CF_BEACON_TOKEN && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
            strategy="afterInteractive"
            defer
          />
        )}
      </body>
    </html>
  )
}
