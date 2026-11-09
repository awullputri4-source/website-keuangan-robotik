export type DivisionType = 
  | 'Mekanik & Hardware'
  | 'Elektronika & PCB'
  | 'Pemrograman & AI'
  | 'Desain & Kreatif'
  | 'Manajemen & Humas';

export type PaymentMethod = 'cash' | 'transfer';

export type BankOrWallet = 
  | 'BCA'
  | 'Mandiri'
  | 'BRI'
  | 'BNI'
  | 'BSI'
  | 'Dana'
  | 'GoPay'
  | 'OVO'
  | 'ShopeePay'
  | 'Tunai (Cash)';

export interface Member {
  id: string;
  nim: string;
  name: string;
  division: DivisionType;
  phone: string;
  email: string;
  status: 'Aktif' | 'Alumni' | 'Cuti';
  joinedYear: string;
}

export interface KasPayment {
  id: string;
  memberId: string;
  memberName: string;
  nim: string;
  division: DivisionType;
  period: string; // e.g. "November 2024", "Minggu 1 - Nov 2024"
  amount: number;
  paymentDate: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  bankOrWallet?: BankOrWallet;
  referenceNumber?: string;
  proofImageUrl?: string;
  notes?: string;
  verifiedBy: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'Komponen Robot'
  | 'Alat & Bahan'
  | 'Konsumsi'
  | 'Transportasi & Akomodasi'
  | 'Sewa Venue/Alat'
  | 'Publikasi & Percetakan'
  | 'Hadiah & Plakat'
  | 'Lain-lain';

export interface EventExpenseItem {
  id: string;
  eventId: string;
  name: string;
  category: ExpenseCategory;
  quantity: number;
  unit: string; // pcs, set, unit, paket, box, dll.
  unitPrice: number;
  totalPrice: number; // quantity * unitPrice
  purchaseDate: string; // YYYY-MM-DD
  purchasedBy: string;
  notes?: string;
  receiptUrl?: string; // nota / struk
  createdAt: string;
}

export type EventStatus = 'Perencanaan' | 'Sedang Berjalan' | 'Selesai' | 'Dibatalkan';

export type EventCategory = 
  | 'Kompetisi Robotika'
  | 'Workshop & Pelatihan'
  | 'Proyek Riset & Divisi'
  | 'Pameran & Sosialisasi'
  | 'Internal & Makrab';

export interface OrganizationEvent {
  id: string;
  name: string;
  category: EventCategory;
  description: string;
  coordinator: string; // Nama Penanggung Jawab / Ketua Pelaksana
  location: string;
  startDate: string;
  endDate: string;
  status: EventStatus;
  allocatedBudget: number; // Anggaran yang disiapkan
  expenses: EventExpenseItem[];
  createdAt: string;
}

export interface CashFlowSummary {
  totalKasIn: number;
  totalCashKas: number;
  totalTransferKas: number;
  totalEventExpenses: number;
  currentBalance: number;
  totalMembers: number;
  activeEventsCount: number;
}

