export type UserRole = 
  | 'super_admin' 
  | 'event_organizer' 
  | 'ticket_issuer' 
  | 'gate_agent' 
  | 'financial_auditor';

export interface UserPermissions {
  canCreateEvents: boolean;
  canIssueTickets: boolean;
  canScanTickets: boolean;
  canViewReports: boolean;
  canManageUsers: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  passcode: string; // Unique separate passcode set by Super Admin
  status: 'active' | 'suspended';
  createdBy: string;
  createdAt: string;
  assignedEventIds?: string[];
  permissions: UserPermissions;
}

export type PassCategory =
  | 'regular'
  | 'vip'
  | 'vvip'
  | 'all_access'
  | 'courtside_vip'
  | 'courtside_box'
  | 'courtside_floor'
  | 'general_access'
  | 'media'
  | 'player_staff';

export type TicketCanvasThemeId =
  | 'gold_foil_vip'
  | 'purple_gold_sports'
  | 'neon_esports'
  | 'sleek_black_match'
  | 'courtside_classic';

export type PassStatus = 'valid' | 'used' | 'revoked' | 'expired' | 'blocked' | 'refunded' | 'transferred';

export type AppNavView =
  | 'dashboard'
  | 'events'
  | 'tickets'
  | 'orders'
  | 'customers'
  | 'users'
  | 'scanners'
  | 'venues'
  | 'reports'
  | 'analytics'
  | 'organization'
  | 'settings'
  | 'help';

export type PassTypeKind = 'ticket' | 'staff_badge' | 'qr_only';

export interface PassTicket {
  id: string;
  ticketCode: string;
  passType?: PassTypeKind;
  holderName?: string;
  holderEmail?: string;
  holderPhone?: string;
  holderPhotoUrl?: string;
  holderRole?: string;
  category: PassCategory;
  themeId?: TicketCanvasThemeId;
  eventName: string;
  eventDate: string;
  eventTime?: string;
  venue?: string;
  section?: string;
  row?: string;
  seatNumber?: string;
  gateEntry?: string;
  price: number;
  currency: string;
  status: PassStatus;
  issuedAt: string;
  scannedAt?: string;
  scannedBy?: string;
  customLogoUrl?: string;
  qrCodeData: string;
  notes?: string;
  batchId?: string;
  orderId?: string;
  createdByUserId?: string;
  createdByUserName?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  eventName: string;
  ticketCount: number;
  totalAmount: number;
  currency: string;
  status: 'completed' | 'pending' | 'refunded' | 'cancelled';
  paymentMethod: 'Mobile Money (MTN/Orange)' | 'Credit Card' | 'Cash at Gate' | 'VIP Comp';
  createdAt: string;
  ticketCodes: string[];
}

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
  eventsAttended: string[];
  ticketsCount: number;
  notes?: string;
  joinedAt: string;
}

export interface ScannerDevice {
  id: string;
  name: string;
  gate: string;
  venue: string;
  battery: number;
  isOnline: boolean;
  lastSync: string;
  todayScans: number;
  currentUser: string;
}

export interface EventRecord {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  ticketsSold: number;
  totalRevenue: number;
  attendanceCount: number;
  status: 'upcoming' | 'live' | 'completed' | 'draft';
  bannerGradient: string;
  createdByUserId?: string;
  createdByUserName?: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'order' | 'scan' | 'refund' | 'event' | 'scanner' | 'system' | 'ticket';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'system' | 'orders' | 'events' | 'customers' | 'scanners' | 'payments' | 'support';
  timestamp: string;
  isRead: boolean;
}

export interface PassTemplate {
  id: string;
  name: string;
  category: PassCategory;
  bgGradient: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  accentColor: string;
  glowColor: string;
  description: string;
}

export interface ScannerLog {
  id: string;
  ticketCode: string;
  holderName: string;
  category: PassCategory;
  status: 'valid' | 'already_used' | 'invalid' | 'revoked';
  scannedAt: string;
  gate: string;
  scannedBy: string;
}

export interface GoogleSheetsConfig {
  sheetUrl: string;
  autoSync: boolean;
  lastSyncedAt?: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  ticketsSold: number;
  activeEvents: number;
  totalScanCount: number;
  recentScans?: ScannerLog[];
  totalEvents: number;
  totalTickets: number;
  totalScanned: number;
  totalPending: number;
  duplicateAttempts: number;
  scanRate: number;
  scansByEvent: Record<string, { name: string; scanned: number; total: number }>;
  scanLogs: ScannerLog[];
}

