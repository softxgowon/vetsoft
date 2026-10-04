import { describe, expect, it } from 'vitest'
import { colorOf, initialsOf } from '../app/utils/avatar'

describe('utils/avatar', () => {
  it('строит инициалы из имени и фамилии', () => {
    expect(initialsOf('Шалимов Денис Андреевич')).toBe('ШД')
    expect(initialsOf('Анна')).toBe('А')
    expect(initialsOf('   ')).toBe('?')
  })

  it('всегда возвращает один и тот же цвет для одного и того же имени', () => {
    const a = colorOf('Шалимов Денис Андреевич')
    const b = colorOf('Шалимов Денис Андреевич')
    expect(a).toBe(b)
    expect(a).toMatch(/^#[0-9a-f]{6}$/)
  })

  it('разным именам обычно достаются разные цвета', () => {
    const names = ['Шалимов Денис Андреевич', 'Кравцова Мария Игоревна', 'Орлов Сергей Петрович', 'Белова Анна Викторовна']
    const colors = new Set(names.map(colorOf))
    expect(colors.size).toBeGreaterThan(1)
  })
})
