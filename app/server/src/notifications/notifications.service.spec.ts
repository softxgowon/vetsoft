import { NotFoundException } from '@nestjs/common';
import { NotificationType } from '../common/enums';
import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  let repo: { save: jest.Mock; create: jest.Mock; update: jest.Mock; exist: jest.Mock; find: jest.Mock; count: jest.Mock };
  let gateway: { emitToUser: jest.Mock; emitToStaff: jest.Mock; broadcastSlotsChanged: jest.Mock };
  let mail: { send: jest.Mock };
  let users: { findById: jest.Mock };
  let service: NotificationsService;

  beforeEach(() => {
    repo = {
      save: jest.fn(async (x) => ({ id: 'n1', ...x })),
      create: jest.fn((x) => x),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
      exist: jest.fn(),
      find: jest.fn().mockResolvedValue([{ id: 'n1' }]),
      count: jest.fn().mockResolvedValue(3),
    };
    gateway = { emitToUser: jest.fn(), emitToStaff: jest.fn(), broadcastSlotsChanged: jest.fn() };
    mail = { send: jest.fn().mockResolvedValue(true) };
    users = { findById: jest.fn().mockResolvedValue({ email: 'o@o.ru' }) };
    service = new NotificationsService(repo as never, gateway as never, mail as never, users as never);
  });

  it('сохраняет уведомление, отправляет его в websocket и по почте', async () => {
    const saved = await service.notifyUser('u1', { type: NotificationType.HealthRecord, title: 'Заголовок', body: 'Текст' });

    expect(saved.id).toBe('n1');
    expect(gateway.emitToUser).toHaveBeenCalledWith('u1', 'notification', expect.objectContaining({ id: 'n1', userId: 'u1' }));
    await new Promise((resolve) => setImmediate(resolve));
    expect(mail.send).toHaveBeenCalledWith('o@o.ru', 'Заголовок', 'Текст');
  });

  it('сбой почты не ломает создание уведомления', async () => {
    mail.send.mockRejectedValue(new Error('smtp down'));
    await expect(service.notifyUser('u1', { type: NotificationType.HealthRecord, title: 'a', body: 'b' })).resolves.toBeDefined();
  });

  it('отдает список и число непрочитанных', async () => {
    expect(await service.listForUser('u1')).toEqual({ items: [{ id: 'n1' }], unread: 3 });
  });

  it('markRead сообщает, если уведомление не принадлежит пользователю', async () => {
    repo.update.mockResolvedValue({ affected: 0 });
    repo.exist.mockResolvedValue(false);
    await expect(service.markRead('u1', 'foreign')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('markRead не падает, если уведомление уже прочитано', async () => {
    repo.update.mockResolvedValue({ affected: 0 });
    repo.exist.mockResolvedValue(true);
    await expect(service.markRead('u1', 'n1')).resolves.toBeUndefined();
  });
});
