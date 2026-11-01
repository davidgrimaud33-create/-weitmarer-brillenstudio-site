import Link from 'next/link'

export default function NichtGefunden() {
  return (
    <section className="mx-auto max-w-[900px] px-6 py-32 text-center">
      <div className="kicker">Fehler 404</div>
      <h1 className="display mt-4 text-[clamp(56px,9vw,120px)]">Hier ist alles <span className="text-blau">unscharf.</span></h1>
      <p className="mx-auto mt-6 max-w-[520px] text-xl text-text-2">Diese Seite gibt es nicht (mehr). Vielleicht finden Sie über die Startseite, was Sie suchen.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-ink px-7 py-4 font-semibold text-white no-underline hover:text-white">Zur Startseite</Link>
    </section>
  )
}
