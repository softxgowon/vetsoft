import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  points: string[];

  // ключ картинки и цвет круга на слайдере
  @Column()
  imageKey: string;

  @Column()
  color: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}

export interface FaqItem {
  q: string;
  a: string;
}

@Entity('service_categories')
export class ServiceCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column()
  imageKey: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  faq: FaqItem[];

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @OneToMany(() => ServiceItem, (item) => item.category)
  items?: ServiceItem[];
}

@Entity('service_items')
export class ServiceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column('uuid')
  categoryId: string;

  @ManyToOne(() => ServiceCategory, (c) => c.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category?: ServiceCategory;

  // название группы, из которой на странице цен собирается аккордеон
  @Column()
  groupTitle: string;

  @Column()
  title: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ default: false })
  includesMedicines: boolean;

  @Column({ default: false })
  hasLiability: boolean;

  @Column({ default: false })
  hasComplicationsGuarantee: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}

@Entity('checkup_packages')
export class CheckupPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'int' })
  price: number;

  @Column()
  imageKey: string;

  @Column({ type: 'jsonb', default: () => "'[]'" })
  inclusions: string[];

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamptz' })
  publishedAt: Date;
}
