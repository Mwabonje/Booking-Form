export interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  socialHandle: string;
  subject: string;
  typeOfShoot: string;
  date: string;
  preferredContact: string;
  message: string;
  budget: string;
}

export enum SubjectOption {
  CONSULTATION = "15 Minute Consultation",
  GENERAL = "General Information",
  WEDDING = "Wedding Photography",
  PORTRAIT = "Portrait Session",
  EVENT = "Event Coverage",
  DRONE = "Drone Services",
  LESSONS = "Photography Lessons"
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  confirmEmail?: string;
  phone?: string;
  subject?: string;
  typeOfShoot?: string;
  date?: string;
  preferredContact?: string;
  message?: string;
  budget?: string;
}