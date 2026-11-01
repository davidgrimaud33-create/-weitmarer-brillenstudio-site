import Link from 'next/link'
import { HAUPTMENUE } from '@/lib/navigation'
import { stammdaten, besonderes } from '@/lib/content'

export function Fusszeile() {
  return (
    <footer className="bg-ink pb-24 text-[15px] text-auf-dunkel lg:pb-0">
      <div className="mx-auto flex max-w-[1320px] flex-wrap justify-between gap-x-16 gap-y-8 px-6 pb-8 pt-16">
        <div className="flex-[1_1_300px]">
          <div className="display text-3xl text-white">{stammdaten.name}</div>
          <p className="mt-2.5">Inh. {stammdaten.inhaber}<br />{stammdaten.untertitel}</p>
        </div>
        <div className="flex-[1_1_180px]">
          <div className="font-semibold text-white">Bereiche</div>
          <ul className="mt-2 space-y-1.5">
            {HAUPTMENUE.map((m) => (
              <li key={m.href}><Link href={m.href} className="text-auf-dunkel hover:text-white">{m.label}</Link></li>
            ))}
            <li><Link href="/termin" className="text-auf-dunkel hover:text-white">Termin &amp; Kontakt</Link></li>
            <li><Link href="/holzkern" className="text-auf-dunkel hover:text-white">Holzkern-Uhren</Link></li>
            <li><a href={besonderes.irisfotografie.url} target="_blank" rel="noopener" className="text-auf-dunkel hover:text-white">Irisfotografie ↗</a></li>
          </ul>
        </div>
        <div className="flex-[1_1_220px]">
          <div className="font-semibold text-white">Kontakt</div>
          <p className="mt-2 leading-[1.9]">
            {stammdaten.strasse}, {stammdaten.plz} {stammdaten.ort}<br />
            <a href={`tel:${stammdaten.telefonLink}`} className="text-auf-dunkel hover:text-white">{stammdaten.telefon}</a><br />
            <a href={`mailto:${stammdaten.email}`} className="text-auf-dunkel hover:text-white">{stammdaten.email}</a>
          </p>
        </div>
        <div className="flex-[1_1_140px]">
          <div className="font-semibold text-white">Rechtliches</div>
          <p className="mt-2 leading-[1.9]">
            <Link href="/impressum" className="text-auf-dunkel hover:text-white">Impressum</Link><br />
            <Link href="/datenschutz" className="text-auf-dunkel hover:text-white">Datenschutz</Link>
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-[1320px] border-t border-[#23344A] px-6 pb-7 pt-4 text-[13px]">
        © {new Date().getFullYear()} {stammdaten.name}
      </div>
    </footer>
  )
}
