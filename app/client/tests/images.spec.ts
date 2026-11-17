import { describe, expect, it } from 'vitest'
import { imageByKey } from '../app/utils/images'

describe('utils/images', () => {
  it('возвращает картинку по известному ключу', () => {
    expect(imageByKey('uslugi2')).toBeTruthy()
  })

  it('возвращает картинку по умолчанию для неизвестного или пустого ключа', () => {
    const fallback = imageByKey('uslugi-1')
    expect(imageByKey('unknown-key')).toBe(fallback)
    expect(imageByKey(null)).toBe(fallback)
    expect(imageByKey(undefined)).toBe(fallback)
  })
})
