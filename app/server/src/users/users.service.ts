import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PublicUser, toPublicUser, User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  findById(id: string): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  // пароль по умолчанию не выбирается, поэтому для логина добавляем его явно
  findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repo.createQueryBuilder('u').addSelect('u.passwordHash').where('u.email = :email', { email }).getOne();
  }

  create(data: Partial<User>): Promise<User> {
    return this.repo.save(this.repo.create(data));
  }

  async createStaff(dto: CreateStaffDto): Promise<PublicUser> {
    const email = dto.email.trim().toLowerCase();
    if (await this.findByEmail(email)) throw new ConflictException('Пользователь с таким email уже существует');
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.create({ email, passwordHash, fullName: dto.fullName.trim(), role: dto.role, phone: null });
    return toPublicUser(user);
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<PublicUser> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Пользователь не найден');
    Object.assign(user, dto);
    return toPublicUser(await this.repo.save(user));
  }

  async getPublic(id: string): Promise<PublicUser> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('Пользователь не найден');
    return toPublicUser(user);
  }

  countByRole(role: Role): Promise<number> {
    return this.repo.count({ where: { role } });
  }
}
