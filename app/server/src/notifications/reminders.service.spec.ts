import { AppointmentStatus, NotificationType } from '../common/enums';
import { RemindersService } from './reminders.service';

const NOW = new Date('2026-10-05T06:00:00.000Z');
const hoursFromNow = (h: number) => new Date(NOW.getTime() + h * 3_600_000);

const makeAppointment = (startsAt: Date) => ({
  id: `a-${startsAt.getTime()}`,
  startsAt,
  status: AppointmentStatus.Scheduled,
  reminder24hSentAt: null,
  reminder2hSentAt: null,
  pet: { name: 'Барсик', ownerId: 'owner-1' },
  doctor: { fullName: 'Шалимов Д.А.' },
});

describe('RemindersService', () => {
  let appointments: { find: jest.Mock; save: jest.Mock };
  let vaccinations: { find: jest.Mock; save: jest.Mock };
  let notifications: { notifyUser: jest.Mock };
  let service: RemindersService;

  beforeEach(() => {
    appointments = { find: jest.fn(), save: jest.fn(async (x) => x) };
    vaccinations = { find: jest.fn().mockResolvedValue([]), save: jest.fn(async (x) => x) };
    notifications = { notifyUser: jest.fn().mockResolvedValue({}) };
    const config = { get: (_key: string, fallback: string) => fallback };
    service = new RemindersService(appointments as never, vaccinations as never, notifications as never, config as never);
  });

  it('напоминает за сутки и помечает отправленным', async () => {
    const a = makeAppointment(hoursFromNow(20));
    appointments.find.mockResolvedValueOnce([a]).mockResolvedValueOnce([]);

    const sent = await service.sendAppointmentReminders(NOW);

    expect(sent).toBe(1);
    expect(notifications.notifyUser).toHaveBeenCalledWith('owner-1', expect.objectContaining({ type: NotificationType.AppointmentReminder, title: 'Напоминание: завтра прием' }));
    expect(a.reminder24hSentAt).toEqual(NOW);
    expect(appointments.save).toHaveBeenCalledWith(a);
  });

  it('напоминает за два часа отдельным уведомлением', async () => {
    const a = makeAppointment(hoursFromNow(1.5));
    appointments.find.mockResolvedValueOnce([]).mockResolvedValueOnce([a]);

    await service.sendAppointmentReminders(NOW);

    expect(notifications.notifyUser).toHaveBeenCalledWith('owner-1', expect.objectContaining({ title: 'Напоминание: прием совсем скоро' }));
    expect(a.reminder2hSentAt).toEqual(NOW);
  });

  it('ищет только активные записи без отправленного напоминания', async () => {
    appointments.find.mockResolvedValue([]);
    await service.sendAppointmentReminders(NOW);
    const [dayQuery, soonQuery] = appointments.find.mock.calls.map((c) => c[0].where);
    expect(dayQuery.status).toBe(AppointmentStatus.Scheduled);
    expect(dayQuery.reminder24hSentAt).toBeDefined();
    expect(soonQuery.reminder2hSentAt).toBeDefined();
  });

  it('ничего не шлет, когда напоминать не о чем', async () => {
    appointments.find.mockResolvedValue([]);
    expect(await service.sendAppointmentReminders(NOW)).toBe(0);
    expect(notifications.notifyUser).not.toHaveBeenCalled();
  });

  it('напоминает о вакцинации и запоминает отправку', async () => {
    const v = { id: 'v1', petId: 'p1', vaccine: 'Бешенство', nextDueAt: '2026-10-09', reminderSentAt: null, pet: { name: 'Барсик', ownerId: 'owner-1' } };
    vaccinations.find.mockResolvedValue([v]);

    const sent = await service.sendVaccinationReminders(NOW);

    expect(sent).toBe(1);
    expect(notifications.notifyUser).toHaveBeenCalledWith('owner-1', expect.objectContaining({ type: NotificationType.VaccinationReminder }));
    expect(v.reminderSentAt).toEqual(NOW);
  });
});
