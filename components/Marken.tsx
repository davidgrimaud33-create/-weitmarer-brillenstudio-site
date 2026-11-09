import { marken } from '@/lib/content'

/** Marken als Schilder auf dunklem Grund (Über uns, Baustein „Marken“) */
export function MarkenListe() {
  return (
    <ul className="a-reveal m-0 flex list-none flex-wrap gap-2.5 p-0">
      {marken.map((m, i) => (
        <li key={m} className={`rounded-full px-[22px] py-3 text-xl font-bold uppercase [font-stretch:75%] ${i % 5 === 0 ? 'bg-blau' : 'border border-ink-line bg-ink-2 text-[#DCE4EC]'}`}>{m}</li>
      ))}
    </ul>
  )
}
