import { Company, Seller, Tour, Booking, User, UserRole, Voucher } from './types';

export const USERS: User[] = [
  { id: 'user-master', name: 'Admin Master', email: 'admin@ilhadomel.com', role: UserRole.MASTER },
  { id: 'user-company-1', name: 'Baía dos Golfinhos Admin', email: 'admin@golfinhos.com', role: UserRole.COMPANY, companyId: 'company-1' },
  { id: 'user-company-2', name: 'Mar Azul Ecoturismo Admin', email: 'admin@marazul.com', role: UserRole.COMPANY, companyId: 'company-2' },
  { id: 'user-seller-1', name: 'João Guia', email: 'joao@vendas.com', role: UserRole.SELLER },
  { id: 'user-seller-2', name: 'Maria Agente', email: 'maria@vendas.com', role: UserRole.SELLER },
];

export const COMPANIES: Company[] = [
  {
    id: 'company-1',
    name: 'Baía dos Golfinhos',
    slug: 'baiadosgolfinhos',
    description: 'Viva a experiência única de navegar com os golfinhos em seu habitat natural. Passeios seguros e inesquecíveis.',
    logoUrl: 'https://picsum.photos/seed/golfinhos/200',
    contactEmail: 'contato@golfinhos.com',
  },
  {
    id: 'company-2',
    name: 'Mar Azul Ecoturismo',
    slug: 'marazulecoturismo',
    description: 'Explore as belezas naturais da Ilha do Mel com nossos roteiros ecológicos. Conhecimento e aventura em um só lugar.',
    logoUrl: 'https://picsum.photos/seed/marazul/200',
    contactEmail: 'contato@marazul.com',
  },
];

export const SELLERS: Seller[] = [
  {
    id: 'seller-1',
    name: 'João Guia',
    email: 'joao.guia@email.com',
  },
  {
    id: 'seller-2',
    name: 'Maria Agente',
    email: 'maria.agente@email.com',
  },
];

export const VOUCHERS: Voucher[] = [
    { code: 'JOAO-GOLFINHOS-123', sellerId: 'seller-1', companyId: 'company-1' },
    { code: 'MARIA-MARAZUL-ABC', sellerId: 'seller-2', companyId: 'company-2' },
];


export const TOURS: Tour[] = [
  {
    id: 'tour-1',
    companyId: 'company-1',
    name: 'Passeio com Golfinhos',
    description: 'Um passeio de 3 horas para observação de golfinhos na baía.',
    duration: '3 horas',
    pricing: { adult: 150.0, child: 75.0, infant: 0.0 },
    schedules: [
        { time: '09:00', capacity: 20 },
        { time: '14:00', capacity: 25 },
    ],
    pickupLocations: ['Trapiche de Brasília', 'Trapiche de Encantadas'],
  },
  {
    id: 'tour-2',
    companyId: 'company-1',
    name: 'Pôr do Sol na Fortaleza',
    description: 'Aprecie o pôr do sol espetacular com um passeio de barco até a Fortaleza.',
    duration: '2 horas',
    pricing: { adult: 90.0, child: 45.0, infant: 0.0 },
    schedules: [
        { time: '16:00', capacity: 30 },
    ],
    pickupLocations: ['Trapiche de Brasília'],
  },
  {
    id: 'tour-3',
    companyId: 'company-2',
    name: 'Trilha Aquática Ecológica',
    description: 'Navegue por mangues e aprenda sobre o ecossistema local.',
    duration: '4 horas',
    pricing: { adult: 120.0, child: 60.0, infant: 10.0 },
    schedules: [
        { time: '08:30', capacity: 15 },
        { time: '13:30', capacity: 15 },
    ],
    pickupLocations: ['Trapiche de Encantadas'],
  },
  {
    id: 'tour-4',
    companyId: 'company-2',
    name: 'Volta à Ilha',
    description: 'Um dia inteiro de passeio conhecendo os principais pontos da Ilha do Mel.',
    duration: '8 horas',
    pricing: { adult: 250.0, child: 125.0, infant: 20.0 },
    schedules: [
        { time: '09:00', capacity: 40 },
    ],
    pickupLocations: ['Trapiche de Brasília', 'Trapiche de Encantadas'],
  },
];

export const BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    tourId: 'tour-1',
    companyId: 'company-1',
    customerName: 'Carlos Silva',
    customerCpf: '111.222.333-44',
    bookingDate: '2024-08-10',
    selectedTime: '09:00',
    selectedPickupLocation: 'Trapiche de Brasília',
    passengers: { adults: 2, children: 1, infants: 0 },
    totalPrice: 375.00, // 2 * 150 + 1 * 75
    sellerId: 'seller-1',
    status: 'Confirmada',
  },
  {
    id: 'booking-2',
    tourId: 'tour-3',
    companyId: 'company-2',
    customerName: 'Ana Pereira',
    customerCpf: '555.666.777-88',
    bookingDate: '2024-08-12',
    selectedTime: '08:30',
    selectedPickupLocation: 'Trapiche de Encantadas',
    passengers: { adults: 1, children: 0, infants: 0 },
    totalPrice: 120.00,
    sellerId: 'seller-2',
    status: 'Confirmada',
  },
  {
    id: 'booking-3',
    tourId: 'tour-2',
    companyId: 'company-1',
    customerName: 'Beatriz Costa',
    customerCpf: '999.888.777-66',
    bookingDate: '2024-08-15',
    selectedTime: '16:00',
    selectedPickupLocation: 'Trapiche de Brasília',
    passengers: { adults: 4, children: 0, infants: 0 },
    totalPrice: 360.00, // 4 * 90
    status: 'Pendente',
  },
    {
    id: 'booking-4',
    tourId: 'tour-4',
    companyId: 'company-2',
    customerName: 'Lucas Mendes',
    customerCpf: '123.456.789-00',
    bookingDate: '2024-08-18',
    selectedTime: '09:00',
    selectedPickupLocation: 'Trapiche de Encantadas',
    passengers: { adults: 2, children: 2, infants: 1 },
    totalPrice: 770.00, // 2 * 250 + 2 * 125 + 1 * 20
    sellerId: 'seller-1', // João agora vendendo para a empresa 2
    status: 'Confirmada',
  },
];