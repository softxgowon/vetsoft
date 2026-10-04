// типы соответствуют dto и сущностям бэкенда (см. backend/src)

export type Role = 'owner' | 'doctor' | 'admin'
export type Species = 'dog' | 'cat' | 'rodent' | 'bird' | 'other'
export type Gender = 'male' | 'female' | 'unknown'
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show'
export type NotificationType =
  | 'appointment_created'
  | 'appointment_cancelled'
  | 'appointment_status'
  | 'appointment_reminder'
  | 'vaccination_reminder'
  | 'health_record'

export interface PublicUser {
  id: string
  email: string
  fullName: string
  phone: string | null
  role: Role
  createdAt: string
}

export interface AuthSession {
  accessToken: string
  user: PublicUser
}

export interface Pet {
  id: string
  ownerId: string
  name: string
  species: Species
  breed: string | null
  gender: Gender
  birthDate: string | null
  weightKg: number | null
  chipNumber: string | null
  notes: string | null
  createdAt: string
  owner?: PublicUser
}

export interface Doctor {
  id: string
  fullName: string
  position: string
  description: string | null
  photoKey: string
  workStart: string
  workEnd: string
  slotMinutes: number
  isActive: boolean
  sortOrder: number
}

export interface Department {
  id: string
  slug: string
  title: string
  points: string[]
  imageKey: string
  color: string
  sortOrder: number
}

export interface FaqItem {
  q: string
  a: string
}

export interface ServiceItemDto {
  id: string
  categoryId: string
  groupTitle: string
  title: string
  price: number
  includesMedicines: boolean
  hasLiability: boolean
  hasComplicationsGuarantee: boolean
  sortOrder: number
}

export interface ServiceCategory {
  id: string
  slug: string
  title: string
  imageKey: string
  faq: FaqItem[]
  sortOrder: number
  items?: ServiceItemDto[]
}

export interface CheckupPackage {
  id: string
  slug: string
  title: string
  description: string
  price: number
  imageKey: string
  inclusions: string[]
  sortOrder: number
}

export interface ArticleSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  publishedAt: string
}

export interface Article extends ArticleSummary {
  content: string
}

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pages: number
}

export interface ClinicInfo {
  name: string
  phone: string
  email: string
  address: string
  hours: string
  timeZone: string
  // координаты определяются автоматически по адресу через nominatim на бэкенде, могут отсутствовать при сбое геокодирования
  lat?: number
  lon?: number
}

export interface LabItem {
  name: string
  value: string
  unit?: string
  reference?: string
}

export interface MedicalRecord {
  id: string
  petId: string
  doctorId: string | null
  doctor?: Doctor | null
  visitedAt: string
  complaint: string | null
  diagnosis: string
  treatment: string | null
  recommendations: string | null
  createdAt: string
}

export interface LabResult {
  id: string
  petId: string
  title: string
  takenAt: string
  items: LabItem[]
  conclusion: string | null
  createdAt: string
}

export interface Prescription {
  id: string
  petId: string
  doctorId: string | null
  doctor?: Doctor | null
  prescribedAt: string
  medication: string
  dosage: string
  duration: string | null
  instructions: string | null
  createdAt: string
}

export interface Vaccination {
  id: string
  petId: string
  vaccine: string
  vaccinatedAt: string
  nextDueAt: string | null
  batchNumber: string | null
  reminderSentAt: string | null
  createdAt: string
  pet?: Pet
}

export interface SlotInfo {
  startsAt: string
  available: boolean
}

export interface SlotsResponse {
  date: string
  timeZone: string
  slots: SlotInfo[]
}

export interface Appointment {
  id: string
  petId: string
  pet?: Pet
  doctorId: string
  doctor?: Doctor
  serviceId: string | null
  service?: ServiceItemDto | null
  startsAt: string
  endsAt: string
  status: AppointmentStatus
  reason: string | null
  createdAt: string
}

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  payload: Record<string, unknown> | null
  readAt: string | null
  createdAt: string
}

export interface NotificationsResponse {
  items: AppNotification[]
  unread: number
}

export interface ApiErrorBody {
  statusCode: number
  message: string | string[]
  error?: string
}
