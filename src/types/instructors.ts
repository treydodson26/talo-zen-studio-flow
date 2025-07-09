export interface Instructor {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  certificationLevel: '200hr' | '500hr+';
  certificationExpiry: string;
  specializations: string[];
  rateTier: 'tier1' | 'tier2';
  baseRate: number;
  perStudentRate: number;
  classesThisMonth: number;
  availableForSubs: boolean;
  lastActive: string;
  status: 'active' | 'inactive';
  emergencyContact?: string;
  bio?: string;
  yearsExperience: number;
  insuranceInfo?: string;
  paymentMethod: 'direct_deposit' | 'check';
  w9Status: 'complete' | 'pending' | 'not_required';
}

export interface SubstituteRequest {
  id: string;
  date: string;
  time: string;
  classType: string;
  room: string;
  originalInstructor: string;
  expectedAttendance: number;
  reason: string;
  urgency: 'urgent' | 'medium' | 'normal';
  postedAt: string;
  responses: SubstituteResponse[];
  status: 'open' | 'filled' | 'cancelled';
  payRate: number;
  specialRequirements?: string;
}

export interface SubstituteResponse {
  instructorId: string;
  instructorName: string;
  response: 'available' | 'interested' | 'not_available';
  responseTime: string;
  notes?: string;
  confirmed?: boolean;
}

export interface PayrollEntry {
  instructorId: string;
  instructorName: string;
  regularClasses: number;
  regularRate: number;
  studentBonuses: number;
  substituteClasses: number;
  substituteRate: number;
  grossTotal: number;
  gustoStatus: 'pending' | 'approved' | 'processed';
  adjustments?: number;
  notes?: string;
}

export interface AvailabilitySlot {
  instructorId: string;
  day: string;
  time: string;
  status: 'available' | 'scheduled' | 'unavailable';
  classType?: string;
}