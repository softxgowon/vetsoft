// форматирование дат и денег в интерфейсе кабинета
export const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })

export const formatDate = (iso: string): string => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

export const formatMoney = (value: number): string => `${value.toLocaleString('ru-RU')} ₽`

export const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Запланирован',
  completed: 'Завершен',
  cancelled: 'Отменен',
  no_show: 'Неявка',
}

export const SPECIES_LABELS: Record<string, string> = {
  dog: 'Собака',
  cat: 'Кошка',
  rodent: 'Грызун',
  bird: 'Птица',
  other: 'Другое',
}
