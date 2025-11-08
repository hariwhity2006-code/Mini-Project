
export interface FeeBreakdown {
  tuition: number;
  hostel: number;
  library: number;
  lab: number;
}

export interface Student {
  id: string; // Roll Number
  name: string;
  email: string;
  phone: string;
  password: string;
  totalFees: number;
  paidAmount: number;
  feeBreakdown: FeeBreakdown;
}

// Type for the data required to register a new student
export type NewStudentData = Omit<Student, 'totalFees' | 'paidAmount' | 'feeBreakdown'>;

export interface Admin {
    username: string;
    password: string;
}

export type User = Student | Admin;
export type UserType = 'student' | 'admin' | null;

export enum PaymentMethod {
    CREDIT_CARD = 'Credit Card',
    GOOGLE_PAY = 'Google Pay',
    PHONEPE = 'PhonePe',
}