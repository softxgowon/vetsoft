import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Role } from '../common/enums';
import { PetsService } from './pets.service';

describe('PetsService', () => {
  const repo = { findOne: jest.fn(), create: jest.fn((x) => x), save: jest.fn(async (x) => ({ id: 'p1', ...x })) };
  const service = new PetsService(repo as never);
  const owner = { id: 'owner-1', email: 'o@o.ru', role: Role.Owner };
  const stranger = { id: 'owner-2', email: 's@s.ru', role: Role.Owner };
  const doctor = { id: 'doc-1', email: 'd@d.ru', role: Role.Doctor };

  beforeEach(() => jest.clearAllMocks());

  describe('assertAccess', () => {
    it('пускает владельца к своему питомцу', async () => {
      repo.findOne.mockResolvedValue({ id: 'p1', ownerId: 'owner-1' });
      await expect(service.assertAccess(owner, 'p1')).resolves.toMatchObject({ id: 'p1' });
    });

    it('не пускает чужого владельца', async () => {
      repo.findOne.mockResolvedValue({ id: 'p1', ownerId: 'owner-1' });
      await expect(service.assertAccess(stranger, 'p1')).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('пускает врача к любому питомцу', async () => {
      repo.findOne.mockResolvedValue({ id: 'p1', ownerId: 'owner-1' });
      await expect(service.assertAccess(doctor, 'p1')).resolves.toBeDefined();
    });

    it('сообщает, если питомца нет', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.assertAccess(owner, 'nope')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('create', () => {
    const dto = { name: 'Барсик', species: 'cat' } as never;

    it('владелец всегда создает питомца на себя, даже если передал чужой ownerId', async () => {
      await service.create(owner, { ...(dto as object), ownerId: 'owner-2' } as never);
      expect(repo.create.mock.calls[0][0].ownerId).toBe('owner-1');
    });

    it('сотрудник может завести питомца на клиента', async () => {
      await service.create(doctor, { ...(dto as object), ownerId: 'owner-2' } as never);
      expect(repo.create.mock.calls[0][0].ownerId).toBe('owner-2');
    });
  });
});
