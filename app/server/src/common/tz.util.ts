const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export const isValidDateString = (value: string): boolean => {
  if (!DATE_RE.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const probe = new Date(Date.UTC(y, m - 1, d));
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d;
};

export const isValidTimeString = (value: string): boolean => TIME_RE.test(value);

// разница между временем в часовом поясе и utc в миллисекундах
const zoneOffsetMs = (at: Date, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at);
  const map: Record<string, number> = {};
  for (const p of parts) if (p.type !== 'literal') map[p.type] = Number(p.value);
  return Date.UTC(map.year, map.month - 1, map.day, map.hour, map.minute, map.second) - at.getTime();
};

// локальные дата и время в часовом поясе клиники превращаем в момент времени utc
export const zonedToUtc = (date: string, time: string, timeZone: string): Date => {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  return new Date(guess - zoneOffsetMs(new Date(guess), timeZone));
};

// дата вида yyyy-mm-dd в часовом поясе клиники
export const toZonedDateString = (at: Date, timeZone: string): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);

export const zonedHour = (at: Date, timeZone: string): number =>
  Number(new Intl.DateTimeFormat('en-US', { timeZone, hourCycle: 'h23', hour: '2-digit' }).format(at));

export const addDays = (date: string, days: number): string => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
};

export const formatDateTimeRu = (at: Date, timeZone: string): string =>
  new Intl.DateTimeFormat('ru-RU', {
    timeZone,
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(at);
