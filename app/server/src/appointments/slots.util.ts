import { zonedToUtc } from '../common/tz.util';

export interface WorkDay {
  workStart: string;
  workEnd: string;
  slotMinutes: number;
}

// все стартовые моменты слотов за день врача, последний слот должен полностью помещаться в рабочее время
export const buildDaySlots = (date: string, work: WorkDay, timeZone: string): Date[] => {
  const start = zonedToUtc(date, work.workStart, timeZone).getTime();
  const end = zonedToUtc(date, work.workEnd, timeZone).getTime();
  const step = work.slotMinutes * 60_000;
  const slots: Date[] = [];
  if (step <= 0) return slots;
  for (let t = start; t + step <= end; t += step) slots.push(new Date(t));
  return slots;
};
