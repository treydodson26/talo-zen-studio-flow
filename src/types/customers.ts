export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: 'Active' | 'Trial' | 'Expired' | 'At-Risk';
  segment: 'Prenatal' | 'Seniors' | 'Students' | 'Professionals' | 'General';
  lastVisit: string;
  classesThisMonth: number;
  totalClasses: number;
  attendanceRate: number;
  favoriteClass: string;
  memberSince: string;
  currentPlan: string;
  autoRenewal: boolean;
  avatar?: string;
  notes?: string;
}

export interface CustomerFilters {
  search: string;
  status: string;
  segment: string;
  dateFilter: string;
}