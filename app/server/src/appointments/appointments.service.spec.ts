import { BadRequestException, ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AppointmentStatus, NotificationType, Role } from '../common/enums';
import { AppointmentsService } from './appointments.service';

const doctor = { id: 'd1', fullName: 'Шалимов Д.А.', workStart: '09:00', workEnd: '12:00', slotMinutes: 30, isActive: true };
const pet = { id: 'p1', name: 'Барсик', ownerId: 'owner-1' };
const owner = { id: 'owner-1', email: 'o@o.ru', role: Role.Owner };
const stranger = { id: 'owner-2', email: 's@s.ru', role: Role.Owner };
const admin = { id: 'adm', email: 'a@a.ru', role: Role.Admin };

// 2026-10-05 09:00 по москве
const NOW = new Date('2026-10-04T06:00:00.000Z');
const slot = (hhmm: string) => new Date(`2026-10-05T${hhmm}:00.000Z`).toISOString();

describe('AppointmentsService', () => {
  let repo: { find: jest.Mock; findOne: jest.Mock; create: jest.Mock; save: jest.Mock };
  let doctors: { findOne: jest.Mock };
  let services: { exist: jest.Mock };
  let pets: { assertAccess: jest.Mock };
  let notifications: { notifyUser: jest.Mock; emitToStaff: jest.Mock; broadcastSlotsChanged: jest.Mock };
  let service: AppointmentsService;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(NOW);
    repo = { find: jest.fn().mockResolvedValue([]), findOne: jest.fn(), create: jest.fn((x) => x), save: jest.fn(async (x) => ({ id: 'a1', ...x })) };
    doctors = { findOne: jest.fn().mockResolvedValue(doctor) };
    services = { exist: jest.fn().mockResolvedValue(true) };
    pets = { assertAccess: jest.fn().mockResolvedValue(pet) };
    notifications = { notifyUser: jest.fn(), emitToStaff: jest.fn(), broadcastSlotsChanged: jest.fn() };
    const config = { get: (_key: string, fallback: string) => fallback };
    service = new AppointmentsService(repo as never, doctors as never, services as never, pets as never, notifications as never, config as never);
  });

  afterEach(() => jest.useRealTimers());

  describe('getSlots', () => {
    it('отдает все слоты рабочего дня', async () => {
      const result = await service.getSlots('d1', '2026-10-05');
      expect(result.timeZone).toBe('Europe/Moscow');
      expect(result.slots).toHaveLength(6);
      expect(result.slots[0]).toEqual({ startsAt: slot('06:00'), available: true });
    });

    it('помечает занятые слоты недоступными', async () => {
      repo.find.mockResolvedValue([{ id: 'x', startsAt: new Date(slot('06:30')) }]);
      const { slots } = await service.getSlots('d1', '2026-10-05');
      expect(slots.find((s) => s.startsAt === slot('06:30'))?.available).toBe(false);
      expect(slots.find((s) => s.startsAt === slot('07:00'))?.available).toBe(true);
    });

    it('не предлагает слоты, которые уже прошли или начинаются слишком скоро', async () => {
      jest.setSystemTime(new Date('2026-10-05T06:10:00.000Z'));
      const { slots } = await service.getSlots('d1', '2026-10-05');
      // 06:00 прошел, 06:30 начинается менее чем через 30 минут, 07:00 доступен
      expect(slots.filter((s) => !s.available).map((s) => s.startsAt)).toEqual([slot('06:00'), slot('06:30')]);
    });

    it('проверяет дату и врача', async () => {
      await expect(service.getSlots('d1', '2026-13-45')).rejects.toBeInstanceOf(BadRequestException);
      doctors.findOne.mockResolvedValue(null);
      await expect(service.getSlots('nope', '2026-10-05')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    const dto = { petId: 'p1', doctorId: 'd1', startsAt: slot('07:00'), reason: ' плановый осмотр ' };

    it('создает запись, уведомляет владельца и обновляет слоты у всех клиентов', async () => {
      const saved = await service.create(owner, dto);

      expect(saved.status).toBe(AppointmentStatus.Scheduled);
      expect(saved.reason).toBe('плановый осмотр');
      expect(saved.endsAt).toEqual(new Date(slot('07:30')));
      expect(notifications.notifyUser).toHaveBeenCalledWith('owner-1', expect.objectContaining({ type: NotificationType.AppointmentCreated }));
      expect(notifications.emitToStaff).toHaveBeenCalledWith('appointment:changed', expect.objectContaining({ action: 'created' }));
      expect(notifications.broadcastSlotsChanged).toHaveBeenCalledWith('d1', '2026-10-05');
    });

    it('отклоняет время, которого нет в сетке слотов', async () => {
      await expect(service.create(owner, { ...dto, startsAt: '2026-10-05T07:10:00.000Z' })).rejects.toBeInstanceOf(BadRequestException);
      expect(repo.save).not.toHaveBeenCalled();
    });

    it('отклоняет занятый слот', async () => {
      repo.find.mockResolvedValue([{ id: 'x', startsAt: new Date(dto.startsAt) }]);
      await expect(service.create(owner, dto)).rejects.toBeInstanceOf(ConflictException);
    });

    it('превращает нарушение уникального индекса в конфликт при гонке двух клиентов', async () => {
      repo.save.mockRejectedValue({ code: '23505' });
      await expect(service.create(owner, dto)).rejects.toBeInstanceOf(ConflictException);
      expect(notifications.notifyUser).not.toHaveBeenCalled();
    });

    it('не дает записать чужого питомца', async () => {
      pets.assertAccess.mockRejectedValue(new ForbiddenException());
      await expect(service.create(stranger, dto)).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('проверяет существование услуги', async () => {
      services.exist.mockResolvedValue(false);
      await expect(service.create(owner, { ...dto, serviceId: 'nope' })).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('cancel', () => {
    const scheduled = () => ({
      id: 'a1',
      status: AppointmentStatus.Scheduled,
      doctorId: 'd1',
      startsAt: new Date(slot('07:00')),
      pet: { name: 'Барсик', ownerId: 'owner-1' },
    });

    it('владелец отменяет свою запись и слот освобождается', async () => {
      repo.findOne.mockResolvedValue(scheduled());
      const result = await service.cancel(owner, 'a1');
      expect(result.status).toBe(AppointmentStatus.Cancelled);
      expect(notifications.broadcastSlotsChanged).toHaveBeenCalledWith('d1', '2026-10-05');
      // владелец сам отменил, поэтому себе уведомление не шлем
      expect(notifications.notifyUser).not.toHaveBeenCalled();
    });

    it('сотрудник отменяет запись и владелец получает уведомление', async () => {
      repo.findOne.mockResolvedValue(scheduled());
      await service.cancel(admin, 'a1');
      expect(notifications.notifyUser).toHaveBeenCalledWith('owner-1', expect.objectContaining({ type: NotificationType.AppointmentCancelled }));
    });

    it('чужой владелец не может отменить запись', async () => {
      repo.findOne.mockResolvedValue(scheduled());
      await expect(service.cancel(stranger, 'a1')).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('нельзя менять уже завершенную запись', async () => {
      repo.findOne.mockResolvedValue({ ...scheduled(), status: AppointmentStatus.Completed });
      await expect(service.cancel(owner, 'a1')).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('setStatus', () => {
    it('отмечает визит завершенным и уведомляет владельца', async () => {
      repo.findOne.mockResolvedValue({ id: 'a1', status: AppointmentStatus.Scheduled, doctorId: 'd1', startsAt: new Date(slot('07:00')), pet: { name: 'Барсик', ownerId: 'owner-1' } });
      const result = await service.setStatus('a1', AppointmentStatus.Completed);
      expect(result.status).toBe(AppointmentStatus.Completed);
      expect(notifications.notifyUser).toHaveBeenCalledWith('owner-1', expect.objectContaining({ type: NotificationType.AppointmentStatus }));
      expect(notifications.broadcastSlotsChanged).not.toHaveBeenCalled();
    });
  });
});
