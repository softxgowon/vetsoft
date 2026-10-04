export enum Role {
  Owner = 'owner',
  Doctor = 'doctor',
  Admin = 'admin',
}

export const STAFF_ROLES: Role[] = [Role.Doctor, Role.Admin];

export const isStaff = (role: Role): boolean => STAFF_ROLES.includes(role);

export enum AppointmentStatus {
  Scheduled = 'scheduled',
  Completed = 'completed',
  Cancelled = 'cancelled',
  NoShow = 'no_show',
}

export enum Species {
  Dog = 'dog',
  Cat = 'cat',
  Rodent = 'rodent',
  Bird = 'bird',
  Other = 'other',
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Unknown = 'unknown',
}

export enum NotificationType {
  AppointmentCreated = 'appointment_created',
  AppointmentCancelled = 'appointment_cancelled',
  AppointmentStatus = 'appointment_status',
  AppointmentReminder = 'appointment_reminder',
  VaccinationReminder = 'vaccination_reminder',
  HealthRecord = 'health_record',
}
