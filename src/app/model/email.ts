export interface Email {
  recipients: Recipient[];
  emailTemplate: EmailTemplate;
  emailSchedule: EmailSchedule;
}

export interface Recipient {
  email: string;
  recipientType: RecipientType;
}

export interface History {
  id: number;
  dateTime: Date;
  status: boolean;
  subject: string;
}

export enum RecipientType {
  TO,
  CC,
  BCC
}

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  userEmail: string;
  sharingLink: string;
}

export interface EmailSchedule {
  sendNow: boolean;

  sendDateTime: Date;
  endDate: Date;
  repeatAt: RepeatType;

  daysOfWeek: number[];
  dayOfMonth: number;
  dayOfWeek: number;
  numberOfWeek: number;
  month: number;
}

export enum RepeatType {
  NOTHING,
  ON_WORK_DAYS,
  EVERY_DAY,
  EVERY_WEEK,
  EVERY_MONTH,
  EVERY_YEAR
}


