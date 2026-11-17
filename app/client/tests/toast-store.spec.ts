import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useToastStore } from '../app/stores/toast'

describe('stores/toast', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  it('добавляет тост и убирает его через 5 секунд', () => {
    const toast = useToastStore()
    toast.push('Заголовок', 'Текст')
    expect(toast.items).toHaveLength(1)
    expect(toast.items[0]).toMatchObject({ title: 'Заголовок', body: 'Текст' })

    vi.advanceTimersByTime(5000)
    expect(toast.items).toHaveLength(0)
  })

  it('каждый тост получает уникальный id', () => {
    const toast = useToastStore()
    toast.push('Первый')
    toast.push('Второй')
    expect(toast.items[0].id).not.toBe(toast.items[1].id)
  })

  it('remove убирает конкретный тост по id', () => {
    const toast = useToastStore()
    toast.push('Первый')
    toast.push('Второй')
    const firstId = toast.items[0].id
    toast.remove(firstId)
    expect(toast.items).toHaveLength(1)
    expect(toast.items[0].title).toBe('Второй')
  })
})
