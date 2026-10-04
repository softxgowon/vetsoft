import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums';
import { PublicUser, toPublicUser, User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

export interface AuthSession {
  accessToken: string;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthSession> {
    const email = dto.email.trim().toLowerCase();
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({
      email,
      passwordHash,
      fullName: dto.fullName.trim(),
      phone: dto.phone?.trim() || null,
      role: Role.Owner,
    });
    return this.buildSession(user);
  }

  async login(dto: LoginDto): Promise<AuthSession> {
    const user = await this.users.findByEmailWithPassword(dto.email.trim().toLowerCase());
    const valid = user ? await bcrypt.compare(dto.password, user.passwordHash) : false;
    if (!user || !valid) throw new UnauthorizedException('Неверный email или пароль');
    return this.buildSession(user);
  }

  private buildSession(user: User): AuthSession {
    const accessToken = this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
    return { accessToken, user: toPublicUser(user) };
  }
}
