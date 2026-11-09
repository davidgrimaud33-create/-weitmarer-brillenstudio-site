import type { Baustein } from '@/lib/bausteine/typen'
import { CtaBand } from '@/components/Gestaltung'

type Props = Extract<Baustein, { typ: 'aufforderung' }>

/** Baustein „Aufforderung“: vorhandenes CtaBand mit eigenem Knopf (Telefon-Knopf bleibt) */
export function Aufforderung({ titel, text, knopf }: Props) {
  return <CtaBand titel={titel} text={text} knopf={knopf} />
}
