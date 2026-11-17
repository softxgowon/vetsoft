import { buildDaySlots } from './slots.util';

describe('buildDaySlots', () => {
  const work = { workStart: '09:00', workEnd: '11:00', slotMinutes: 30 };

  it('строит слоты с шагом приема', () => {
    const slots = buildDaySlots('2026-10-05', work, 'Europe/Moscow');
    expect(slots.map((s) => s.toISOString())).toEqual([
      '2026-10-05T06:00:00.000Z',
      '2026-10-05T06:30:00.000Z',
      '2026-10-05T07:00:00.000Z',
      '2026-10-05T07:30:00.000Z',
    ]);
  });

  it('не создает слот, который не помещается в рабочее время', () => {
    const slots = buildDaySlots('2026-10-05', { workStart: '09:00', workEnd: '10:45', slotMinutes: 30 }, 'Europe/Moscow');
    expect(slots).toHaveLength(3);
  });

  it('возвращает пустой список при нулевом шаге', () => {
    expect(buildDaySlots('2026-10-05', { ...work, slotMinutes: 0 }, 'UTC')).toEqual([]);
  });
});
