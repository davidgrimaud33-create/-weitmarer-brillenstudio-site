import type { Baustein } from '@/lib/bausteine/typen'

type Props = Extract<Baustein, { typ: 'zitat' }>

/** Baustein „Zitat“: großes Zitat mit Anführungszeichen wie auf der Startseite */
export function Zitat({ text, name }: Props) {
  return (
    <section className="mx-auto max-w-[980px] px-6 py-28">
      <figure className="a-reveal m-0">
        <svg width="54" height="40" viewBox="0 0 54 40" fill="#0A62A8" aria-hidden><path d="M0 40V22C0 9 7 2 20 0l2 6c-7 2-10 6-10 12h10v22zM32 40V22C32 9 39 2 52 0l2 6c-7 2-10 6-10 12h10v22z" /></svg>
        <blockquote className="m-0 mt-5 text-[clamp(28px,2.8vw,40px)] font-semibold leading-[1.15] [font-stretch:85%] [overflow-wrap:break-word]">{text}</blockquote>
        {name && <figcaption className="mt-6 font-bold">{name}</figcaption>}
      </figure>
    </section>
  )
}
