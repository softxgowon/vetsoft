import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isStaff } from '../common/enums';
import { AuthUser } from '../common/types';
import { CreatePetDto, UpdatePetDto } from './dto/pet.dto';
import { Pet } from './pet.entity';

@Injectable()
export class PetsService {
  constructor(@InjectRepository(Pet) private readonly repo: Repository<Pet>) {}

  // владелец видит только своих питомцев, персонал клиники любых
  async assertAccess(user: AuthUser, petId: string): Promise<Pet> {
    const pet = await this.repo.findOne({ where: { id: petId } });
    if (!pet) throw new NotFoundException('Питомец не найден');
    if (!isStaff(user.role) && pet.ownerId !== user.id) {
      throw new ForbiddenException('Нет доступа к этому питомцу');
    }
    return pet;
  }

  list(user: AuthUser, search?: string): Promise<Pet[]> {
    if (!isStaff(user.role)) {
      return this.repo.find({ where: { ownerId: user.id }, order: { createdAt: 'ASC' } });
    }
    const qb = this.repo.createQueryBuilder('pet').leftJoinAndSelect('pet.owner', 'owner').orderBy('pet.name', 'ASC').take(100);
    const term = search?.trim();
    if (term) {
      qb.where('pet.name ILIKE :t OR owner.fullName ILIKE :t OR owner.email ILIKE :t OR pet.chipNumber ILIKE :t', { t: `%${term}%` });
    }
    return qb.getMany();
  }

  async getOne(user: AuthUser, petId: string): Promise<Pet> {
    await this.assertAccess(user, petId);
    return this.repo.findOneOrFail({ where: { id: petId }, relations: isStaff(user.role) ? { owner: true } : {} });
  }

  create(user: AuthUser, dto: CreatePetDto): Promise<Pet> {
    const { ownerId, ...rest } = dto;
    const pet = this.repo.create({
      ...rest,
      ownerId: isStaff(user.role) && ownerId ? ownerId : user.id,
      breed: dto.breed ?? null,
      birthDate: dto.birthDate ?? null,
      weightKg: dto.weightKg ?? null,
      chipNumber: dto.chipNumber ?? null,
      notes: dto.notes ?? null,
    });
    return this.repo.save(pet);
  }

  async update(user: AuthUser, petId: string, dto: UpdatePetDto): Promise<Pet> {
    const pet = await this.assertAccess(user, petId);
    const { ownerId: _ignored, ...changes } = dto;
    Object.assign(pet, changes);
    return this.repo.save(pet);
  }

  async remove(user: AuthUser, petId: string): Promise<void> {
    const pet = await this.assertAccess(user, petId);
    await this.repo.remove(pet);
  }
}
