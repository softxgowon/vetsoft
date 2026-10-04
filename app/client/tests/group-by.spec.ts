import { describe, expect, it } from 'vitest'
import { groupBy } from '../app/utils/group-by'

describe('utils/group-by', () => {
  it('группирует элементы, сохраняя порядок первого появления группы', () => {
    const items = [
      { group: 'b', name: '1' },
      { group: 'a', name: '2' },
      { group: 'b', name: '3' },
    ]
    const result = groupBy(items, (i) => i.group)
    expect(result.map(([key]) => key)).toEqual(['b', 'a'])
    expect(result[0][1]).toHaveLength(2)
    expect(result[1][1]).toHaveLength(1)
  })

  it('на пустом массиве возвращает пустой список', () => {
    expect(groupBy([], (i: { x: string }) => i.x)).toEqual([])
  })
})
