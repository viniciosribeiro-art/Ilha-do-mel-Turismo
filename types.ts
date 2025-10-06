export enum UserRole {
  MASTER = 'MASTER',
  COMPANY = 'COMPANY',
  SELLER = 'SELLER',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  contactEmail: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
}

export interface TourSchedule {
  time: string;
  capacity: number;
}

export interface TourPricing {
  adult: number;
  child: number;
  infant: number;
}

export interface Tour {
  id: string;
  companyId: string;
  name: string;
  description: string;
  duration: string;
  pricing: TourPricing;
  schedules: TourSchedule[];
  pickupLocations: string[];
}

export interface BookingPassengers {
  adults: number;
  children: number;
  infants: number;
}

export interface Booking {
  id: string;
  tourId: string;
  companyId: string;
  customerName: string;
  customerCpf: string;
  bookingDate: string;
  selectedTime: string;
  selectedPickupLocation: string;
  passengers: BookingPassengers;
  totalPrice: number;
  sellerId?: string;
  status: 'Confirmada' | 'Pendente' | 'Cancelada';
}

export interface Voucher {
  code: string;
  sellerId: string;
  companyId: string;
}