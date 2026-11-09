import { describe, expect, it } from 'vitest'
import { BEISPIELE } from '@/lib/bausteine/beispiele'
import { MUSTERBUCH } from '@/lib/bausteine/musterbuch'

describe('Musterbuch', () => {
  it('zeigt jeden Baustein genau einmal', () => {
    const typen = MUSTERBUCH.map((m) => m.typ)
    expect(new Set(typen).size).toBe(typen.length)
    expect([...typen].sort()).toEqual(Object.keys(BEISPIELE).sort())
  })

  it('hat für jeden Baustein einen Namen', () => {
    for (const m of MUSTERBUCH) expect(m.name.trim()).not.toBe('')
  })
})
