// группирует массив по ключу, сохраняя порядок первого появления группы
export const groupBy = <T, K extends string>(items: T[], keyFn: (item: T) => K): [K, T[]][] => {
  const map = new Map<K, T[]>()
  for (const item of items) {
    const key = keyFn(item)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(item)
  }
  return Array.from(map.entries())
}
