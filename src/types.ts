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
  | 'gold_championship'
  | 'crimson_slam'
  | 'royal_courtside'
  | 'emerald_press'
  | 'violet_allstar'
  | 'midnight_neon'
  | 'platinum_vvip'
  | 'sunset_finals'
  | 'ice_arena'
  | 'copper_classic'
  | 'confetti_celebration'
  | 'trophy_gold_foil'
  | 'stadium_lights'
  | 'minimal_light_court'
  | 'student_access'
  | 'media_press_pass'
  | 'stadium_championship_art_bg'
  | 'vvip_gold_badge_art_bg'
  | 'cyber_neon_match_art_bg'
  | 'retro_vintage_stub_art_bg'
  | 'royal_courtside_art_bg'
  | 'blank_canvas'
  | (string & {});

export type FontFamilyOption = 'sans' | 'heading' | 'serif' | 'mono' | 'display' | 'stencil';
export type BorderStyleOption = 'solid_gold' | 'neon_glow' | 'double_metallic' | 'dashed_stub' | 'none' | 'chamfer';
export type BadgeStyleOption = 'pill_stars' | 'shield_crest' | 'metallic_ribbon' | 'gold_tag' | 'minimal_block';
export type QRFrameStyleOption = 'security_glow' | 'gold_metallic' | 'corner_crosshairs' | 'glass_card' | 'minimal';
export type CornerStyleOption = 'notch_cutouts' | 'rounded_lg' | 'sharp_square' | 'pill_edges';
export type TicketOrientation = 'portrait' | 'landscape';
export type SecurityWatermarkStyle = 'shield_logo' | 'starburst_hologram' | 'official_seal' | 'none';
export type SponsorLogoPlacement = 'top_header' | 'bottom_stub' | 'footer' | 'none';

export type ThemeMode = 'dark' | 'light';

export interface CanvasElement {
  id: string;
  type: 'text' | 'image' | 'logo' | 'qr' | 'barcode' | 'badge' | 'line' | 'watermark' | 'shape' | 'rectangle' | 'circle' | string;
  content?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right';
  opacity?: number;
  [key: string]: any;
}

export type CanvasElementType = CanvasElement['type'];

export interface CanvasThemeDefinition {
  id: TicketCanvasThemeId | string;
  name: string;
  mode?: 'dark' | 'light';
  borderStyle?: BorderStyleOption;
  badgeStyle?: BadgeStyleOption;
  qrFrameStyle?: QRFrameStyleOption;
  defaultOrientation?: TicketOrientation;
  cornerStyle?: CornerStyleOption;
  securityWatermark?: SecurityWatermarkStyle;
  sponsorLogoPosition?: SponsorLogoPlacement;
  fontFamily?: FontFamilyOption;
  patternId?: string;
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    text?: string;
    background?: string;
  };
  [key: string]: any;
}

export interface TemplateCustomization {
  mode?: 'dark' | 'light';
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: FontFamilyOption;
  fontColor?: string;
  borderStyle?: BorderStyleOption;
  badgeStyle?: BadgeStyleOption;
  qrFrameStyle?: QRFrameStyleOption;
  orientation?: TicketOrientation;
  cornerStyle?: CornerStyleOption;
  securityWatermark?: SecurityWatermarkStyle;
  sponsorLogoPosition?: SponsorLogoPlacement;
  backgroundImageUrl?: string;
  bgOverlayOpacity?: number; // 0 to 1 scale for image backdrop darkening
  canvasElements?: CanvasElement[];
  [key: string]: any;
}

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
  /** A separate sponsor/partner logo, distinct from the event's own logo
   * above — its on-ticket placement is controlled by
   * templateCustomization.sponsorLogoPosition. */
  sponsorLogoUrl?: string;
  qrCodeData: string;
  notes?: string;
  batchId?: string;
  orderId?: string;
  createdByUserId?: string;
  createdByUserName?: string;

  /** Per-ticket overrides on top of the chosen template's own defaults —
   * omit any/all fields and the template's defaults apply, so existing
   * tickets (with no customization saved) render exactly as designed. */
  templateCustomization?: TemplateCustomization;
  templateThemeMode?: 'dark' | 'light';
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
  currency?: 'USD' | 'LRD';
  gaPrice?: number;
  vipPrice?: number;
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

export interface AppState {
  users?: UserAccount[];
  events?: EventRecord[];
  tickets?: PassTicket[];
  orders?: OrderRecord[];
  customers?: CustomerRecord[];
  scanners?: ScannerDevice[];
  scannerLogs?: ScannerLog[];
  activities?: ActivityItem[];
  notifications?: NotificationItem[];
  customLogoUrl?: string;
}

