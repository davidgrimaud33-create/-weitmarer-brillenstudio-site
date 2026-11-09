import type { Baustein } from '@/lib/bausteine/typen'

type Props = Extract<Baustein, { typ: 'hinweis' }>

/** Baustein „Hinweis“: kurze hervorgehobene Box */
export function Hinweis({ text }: Props) {
  return (
    <section className="mx-auto max-w-[980px] px-6 py-12">
      <div role="note" className="a-reveal flex items-start gap-4 rounded-[22px] bg-blau-zart px-7 py-6">
        <span aria-hidden className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blau text-lg font-bold text-white">!</span>
        <p className="m-0 min-w-0 whitespace-pre-line text-lg text-ink [overflow-wrap:break-word]">{text}</p>
      </div>
    </section>
  )
}
