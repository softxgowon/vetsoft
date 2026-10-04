import { describe, expect, it } from 'vitest'
import { formatMoney, SPECIES_LABELS, STATUS_LABELS } from '../app/utils/format'

describe('utils/format', () => {
  it('форматирует деньги с пробелом и знаком рубля', () => {
    expect(formatMoney(1500)).toBe(`1${'\u00A0'}500 ₽`)
    expect(formatMoney(0)).toBe('0 ₽')
  })

  it('содержит подписи для всех статусов записи', () => {
    expect(STATUS_LABELS.scheduled).toBe('Запланирован')
    expect(STATUS_LABELS.completed).toBe('Завершен')
    expect(STATUS_LABELS.cancelled).toBe('Отменен')
    expect(STATUS_LABELS.no_show).toBe('Неявка')
  })

  it('содержит подписи для всех видов животных', () => {
    expect(Object.keys(SPECIES_LABELS).sort()).toEqual(['bird', 'cat', 'dog', 'other', 'rodent'])
  })
})
