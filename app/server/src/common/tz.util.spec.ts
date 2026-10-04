import { addDays, isValidDateString, toZonedDateString, zonedHour, zonedToUtc } from './tz.util';

describe('tz.util', () => {
  it('переводит локальное время москвы в utc', () => {
    expect(zonedToUtc('2026-10-05', '09:00', 'Europe/Moscow').toISOString()).toBe('2026-10-05T06:00:00.000Z');
  });

  it('учитывает разные часовые пояса', () => {
    expect(zonedToUtc('2026-10-05', '09:00', 'Asia/Yekaterinburg').toISOString()).toBe('2026-10-05T04:00:00.000Z');
    expect(zonedToUtc('2026-01-15', '12:00', 'UTC').toISOString()).toBe('2026-01-15T12:00:00.000Z');
  });

  it('определяет локальную дату около полуночи', () => {
    const at = new Date('2026-10-05T22:30:00.000Z');
    expect(toZonedDateString(at, 'Europe/Moscow')).toBe('2026-10-06');
    expect(toZonedDateString(at, 'UTC')).toBe('2026-10-05');
  });

  it('возвращает локальный час', () => {
    expect(zonedHour(new Date('2026-10-05T06:15:00.000Z'), 'Europe/Moscow')).toBe(9);
  });

  it('добавляет дни через границу месяца', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
  });

  it('валидирует даты', () => {
    expect(isValidDateString('2026-02-28')).toBe(true);
    expect(isValidDateString('2026-02-30')).toBe(false);
    expect(isValidDateString('05.10.2026')).toBe(false);
  });
});
