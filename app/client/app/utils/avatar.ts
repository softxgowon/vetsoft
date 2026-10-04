// цвет и инициалы для аватара врача, когда нет реальной фотографии
const PALETTE = ['#c98a4b', '#5f8d6b', '#6b7fd7', '#c25b7c', '#4f9ba6', '#a9874b', '#8a6bd7']

export const initialsOf = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const letters = parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '')
  return letters.join('') || '?'
}

// простой хэш имени, чтобы один и тот же врач всегда получал один и тот же цвет
export const colorOf = (seed: string): string => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length] ?? '#c98a4b'
}
