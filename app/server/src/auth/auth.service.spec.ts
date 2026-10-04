import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const users = { findByEmail: jest.fn(), findByEmailWithPassword: jest.fn(), create: jest.fn() };
  const jwt = { sign: jest.fn().mockReturnValue('signed.jwt.token') };
  const service = new AuthService(users as never, jwt as never);

  beforeEach(() => jest.clearAllMocks());

  describe('register', () => {
    it('создает владельца, хеширует пароль и возвращает токен без хеша', async () => {
      users.findByEmail.mockResolvedValue(null);
      users.create.mockImplementation(async (data) => ({ id: 'u1', createdAt: new Date(), ...data }));

      const session = await service.register({ email: '  Anna@Mail.ru ', password: 'secret123', fullName: ' Анна ', phone: '+7 900 000 00 00' });

      const saved = users.create.mock.calls[0][0];
      expect(saved.email).toBe('anna@mail.ru');
      expect(saved.role).toBe(Role.Owner);
      expect(saved.passwordHash).not.toBe('secret123');
      expect(await bcrypt.compare('secret123', saved.passwordHash)).toBe(true);
      expect(session.accessToken).toBe('signed.jwt.token');
      expect(session.user).not.toHaveProperty('passwordHash');
      expect(jwt.sign).toHaveBeenCalledWith({ sub: 'u1', email: 'anna@mail.ru', role: Role.Owner });
    });

    it('не дает зарегистрировать занятый email', async () => {
      users.findByEmail.mockResolvedValue({ id: 'u1' });
      await expect(service.register({ email: 'a@a.ru', password: 'secret123', fullName: 'Анна' })).rejects.toBeInstanceOf(ConflictException);
      expect(users.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('пускает с верным паролем', async () => {
      const passwordHash = await bcrypt.hash('secret123', 4);
      users.findByEmailWithPassword.mockResolvedValue({ id: 'u1', email: 'a@a.ru', role: Role.Owner, passwordHash });
      const session = await service.login({ email: 'A@a.ru', password: 'secret123' });
      expect(session.accessToken).toBe('signed.jwt.token');
      expect(users.findByEmailWithPassword).toHaveBeenCalledWith('a@a.ru');
    });

    it('отказывает при неверном пароле', async () => {
      const passwordHash = await bcrypt.hash('secret123', 4);
      users.findByEmailWithPassword.mockResolvedValue({ id: 'u1', email: 'a@a.ru', role: Role.Owner, passwordHash });
      await expect(service.login({ email: 'a@a.ru', password: 'wrong-pass' })).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('отказывает, если пользователя нет, с тем же сообщением', async () => {
      users.findByEmailWithPassword.mockResolvedValue(null);
      await expect(service.login({ email: 'no@a.ru', password: 'whatever1' })).rejects.toThrow('Неверный email или пароль');
    });
  });
});
