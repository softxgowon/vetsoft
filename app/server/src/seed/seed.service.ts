import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { Article, CheckupPackage, Department, ServiceCategory, ServiceItem } from '../catalog/catalog.entities';
import { Gender, Role, Species } from '../common/enums';
import { Doctor } from '../doctors/doctor.entity';
import { LabResult, MedicalRecord, Prescription, Vaccination } from '../health/health.entities';
import { Pet } from '../pets/pet.entity';
import { User } from '../users/user.entity';

const isoDate = (offsetDays: number): string => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);

// наполнение базы при первом запуске, все данные демонстрационные и легко заменяются своими
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly log = new Logger(SeedService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Pet) private readonly pets: Repository<Pet>,
    @InjectRepository(Doctor) private readonly doctors: Repository<Doctor>,
    @InjectRepository(Department) private readonly departments: Repository<Department>,
    @InjectRepository(ServiceCategory) private readonly categories: Repository<ServiceCategory>,
    @InjectRepository(ServiceItem) private readonly items: Repository<ServiceItem>,
    @InjectRepository(CheckupPackage) private readonly checkups: Repository<CheckupPackage>,
    @InjectRepository(Article) private readonly articles: Repository<Article>,
    @InjectRepository(MedicalRecord) private readonly records: Repository<MedicalRecord>,
    @InjectRepository(LabResult) private readonly labs: Repository<LabResult>,
    @InjectRepository(Prescription) private readonly prescriptions: Repository<Prescription>,
    @InjectRepository(Vaccination) private readonly vaccinations: Repository<Vaccination>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    if (this.config.get('SEED_ON_START') !== 'true') return;
    if ((await this.doctors.count()) > 0) return;
    this.log.log('база пустая, добавляю начальные данные');

    const password = this.config.get<string>('SEED_STAFF_PASSWORD', 'ChangeMe123!');
    const hash = await bcrypt.hash(password, 10);
    const doctors = await this.seedCatalog();
    await this.users.save([
      this.users.create({ email: 'admin@vetsoft.local', passwordHash: hash, fullName: 'Администратор клиники', role: Role.Admin, phone: null }),
      this.users.create({ email: 'doctor@vetsoft.local', passwordHash: hash, fullName: doctors[0].fullName, role: Role.Doctor, phone: null }),
    ]);
    if (this.config.get('SEED_DEMO_DATA', 'true') === 'true') await this.seedDemoOwner(hash, doctors[0].id);
    this.log.log('начальные данные добавлены');
  }

  private async seedCatalog(): Promise<Doctor[]> {
    const doctors = await this.doctors.save(
      [
        ['Шалимов Денис Андреевич', 'Заведующий отделением терапии, ветеринарный врач-терапевт, дерматолог'],
        ['Кравцова Мария Игоревна', 'Ветеринарный врач-хирург, анестезиолог'],
        ['Орлов Сергей Петрович', 'Ветеринарный врач-кардиолог, специалист по УЗИ'],
        ['Белова Анна Викторовна', 'Ветеринарный врач-терапевт, специалист по вакцинации'],
        ['Громов Илья Дмитриевич', 'Врач отделения ОАРИТ с БИТ, реаниматолог'],
        ['Лебедева Ольга Николаевна', 'Ветеринарный врач-стоматолог'],
      ].map(([fullName, position], i) => this.doctors.create({ fullName, position, sortOrder: i, workStart: '09:00', workEnd: '20:00', slotMinutes: 30 })),
    );

    const points = [
      'Консультации специалистов по лечению и реабилитации животных',
      'Диагностика и лечение внутренних заболеваний',
      'Лечение инфекционных заболеваний',
    ];
    await this.departments.save([
      this.departments.create({ slug: 'therapy', title: 'Терапия', points, imageKey: 'therapy', color: '#b5d5eb', sortOrder: 1 }),
      this.departments.create({ slug: 'surgery', title: 'Хирургия', points, imageKey: 'surgery', color: '#d62e6b', sortOrder: 2 }),
      this.departments.create({ slug: 'oarit', title: 'ОАРИТ с БИТ', points, imageKey: 'OARIT', color: '#34ff5d', sortOrder: 3 }),
    ]);

    const cat = (slug: string, title: string, imageKey: string, sortOrder: number, faq: ServiceCategory['faq'] = []) =>
      this.categories.create({ slug, title, imageKey, sortOrder, faq });
    const [reception, vaccination, surgery, neutering, hospital] = await this.categories.save([
      cat('priem-i-konsultaciya', 'Прием и консультация', 'uslugi-1', 1),
      cat('vakcinaciya', 'Вакцинация', 'uslugi2', 2),
      cat('hirurgiya', 'Хирургия', 'uslugi3', 3),
      cat('kastraciya-i-sterilizaciya', 'Кастрация и стерилизация', 'uslugi4', 4, [
        { q: 'Что такое кастрация', a: 'Это операция по удалению необходимых органов, которые отвечают за размножение' },
        { q: 'Как подготовить питомца к операции', a: 'Перед операцией питомца нельзя кормить 8–12 часов, воду убирают за 2–4 часа. Точные рекомендации даст врач на приеме.' },
        { q: 'Когда можно забрать питомца домой', a: 'Как правило, в тот же день после отхода от наркоза и осмотра врача.' },
      ]),
      cat('stacionar', 'Стационар', 'uslugi5', 5),
    ]);

    const item = (categoryId: string, groupTitle: string, title: string, price: number, flags: [boolean, boolean, boolean], sortOrder: number) =>
      this.items.create({ categoryId, groupTitle, title, price, includesMedicines: flags[0], hasLiability: flags[1], hasComplicationsGuarantee: flags[2], sortOrder });
    await this.items.save([
      item(reception.id, 'Прием', 'Первичный прием врача-терапевта', 1500, [false, false, false], 1),
      item(reception.id, 'Прием', 'Повторный прием', 900, [false, false, false], 2),
      item(reception.id, 'Прием', 'Консультация специалиста', 2200, [false, false, false], 3),
      item(vaccination.id, 'Собаки', 'Комплексная вакцинация собаки', 1800, [true, false, false], 1),
      item(vaccination.id, 'Кошки', 'Комплексная вакцинация кошки', 1700, [true, false, false], 2),
      item(vaccination.id, 'Кошки', 'Вакцинация от бешенства', 700, [true, false, false], 3),
      item(surgery.id, 'Мягкие ткани', 'Удаление новообразования', 7500, [true, true, false], 1),
      item(surgery.id, 'Мягкие ткани', 'Обработка и ушивание раны', 3200, [false, false, false], 2),
      item(neutering.id, 'Кастрация', 'Кастрация котов', 1000, [false, true, true], 1),
      item(neutering.id, 'Кастрация', 'Кастрация хорьков 1–9 кг', 9200, [true, true, true], 2),
      item(neutering.id, 'Кастрация', 'Собака маленькая, 1–9 кг', 13800, [true, true, true], 3),
      item(neutering.id, 'Стерилизация', 'Стерилизация кошек', 5200, [true, true, true], 4),
      item(hospital.id, 'Пребывание', 'Сутки в стационаре', 2800, [false, false, false], 1),
      item(hospital.id, 'Пребывание', 'Интенсивная терапия, сутки', 6500, [true, false, false], 2),
    ]);

    await this.checkups.save([
      this.checkups.create({
        slug: 'dog-young',
        title: 'Для собак до 7 лет',
        description: 'Ежегодное профилактическое обследование для поддержания здоровья вашего питомца.',
        price: 4500,
        imageKey: 'uslugi-1',
        sortOrder: 1,
        inclusions: ['Первичный прием терапевта', 'Общий анализ крови', 'Биохимический анализ (12 показателей)', 'УЗИ брюшной полости', 'ЭКГ сердца'],
      }),
      this.checkups.create({
        slug: 'cat-senior',
        title: 'Для кошек старше 7 лет',
        description: 'Расширенное обследование для кошек старшего возраста с упором на почки и сердце.',
        price: 5200,
        imageKey: 'uslugi2',
        sortOrder: 2,
        inclusions: ['Первичный прием терапевта', 'Общий анализ крови', 'Биохимический анализ (16 показателей)', 'Измерение артериального давления', 'УЗИ брюшной полости'],
      }),
      this.checkups.create({
        slug: 'dog-senior',
        title: 'Для собак старше 7 лет',
        description: 'Комплексная диагностика для собак старшего возраста.',
        price: 6100,
        imageKey: 'uslugi3',
        sortOrder: 3,
        inclusions: ['Первичный прием терапевта', 'Общий анализ крови', 'Биохимический анализ (16 показателей)', 'УЗИ брюшной полости', 'ЭКГ и УЗИ сердца'],
      }),
    ]);

    const article = (slug: string, title: string, excerpt: string, ago: number) =>
      this.articles.create({ slug, title, excerpt, content: `${excerpt}\n\nЭто демонстрационная статья, замените ее своим контентом.`, publishedAt: new Date(Date.now() - ago * 86_400_000) });
    await this.articles.save([
      article('kak-uhazhivat-za-pitomcem', 'Как правильно ухаживать за своим питомцем', 'Базовые правила ухода: питание, прогулки, гигиена и регулярные осмотры.', 3),
      article('grafik-vakcinacii', 'Как составить график вакцинации', 'Какие прививки нужны щенкам и котятам и когда делать ревакцинацию.', 10),
      article('kogda-idti-k-vrachu', 'Когда нужно срочно обратиться к ветеринару', 'Тревожные симптомы, при которых нельзя откладывать визит в клинику.', 17),
      article('pitanie-pitomca', 'Питание питомца: сухой корм или натуралка', 'Плюсы и минусы разных типов кормления и как выбрать подходящий.', 24),
    ]);
    return doctors;
  }

  private async seedDemoOwner(passwordHash: string, doctorId: string): Promise<void> {
    const owner = await this.users.save(
      this.users.create({ email: 'demo@vetsoft.local', passwordHash, fullName: 'Анна Демонстрационная', phone: '+7 900 000 00 00', role: Role.Owner }),
    );
    const pet = await this.pets.save(
      this.pets.create({ ownerId: owner.id, name: 'Барсик', species: Species.Cat, breed: 'Британская короткошерстная', gender: Gender.Male, birthDate: '2021-04-12', weightKg: 5.2, chipNumber: null, notes: null }),
    );
    await this.records.save(
      this.records.create({
        petId: pet.id,
        doctorId,
        visitedAt: new Date(Date.now() - 40 * 86_400_000),
        complaint: 'Вялость, снижение аппетита',
        diagnosis: 'Легкий гастрит',
        treatment: 'Диета, курс сорбентов',
        recommendations: 'Повторный осмотр через месяц',
      }),
    );
    await this.labs.save(
      this.labs.create({
        petId: pet.id,
        title: 'Общий анализ крови',
        takenAt: isoDate(-40),
        items: [
          { name: 'Гемоглобин', value: '132', unit: 'г/л', reference: '80–150' },
          { name: 'Лейкоциты', value: '9.4', unit: '10^9/л', reference: '5.5–19.5' },
        ],
        conclusion: 'Показатели в пределах нормы',
      }),
    );
    await this.prescriptions.save(
      this.prescriptions.create({ petId: pet.id, doctorId, prescribedAt: isoDate(-40), medication: 'Смекта', dosage: '1/2 пакетика 2 раза в день', duration: '5 дней', instructions: 'Растворить в воде и давать перед едой' }),
    );
    await this.vaccinations.save([
      this.vaccinations.create({ petId: pet.id, vaccine: 'Комплексная вакцина (панлейкопения, ринотрахеит, калицивироз)', vaccinatedAt: isoDate(-350), nextDueAt: isoDate(5), batchNumber: 'A-2041' }),
      this.vaccinations.create({ petId: pet.id, vaccine: 'Вакцина от бешенства', vaccinatedAt: isoDate(-200), nextDueAt: isoDate(165), batchNumber: 'R-118' }),
    ]);
  }
}
