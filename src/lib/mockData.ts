import { PassTicket, EventRecord, OrderRecord, CustomerRecord, ScannerDevice, ActivityItem, NotificationItem, UserAccount } from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr-owner-001',
    name: 'Courtside Owner / Super Admin',
    email: 'courtsideliberia@gmail.com',
    phone: '+231 88 000 4455',
    role: 'super_admin',
    passcode: '004455',
    status: 'active',
    createdBy: 'System Root',
    createdAt: '2026-01-01T00:00:00Z',
    permissions: {
      canCreateEvents: true,
      canIssueTickets: true,
      canScanTickets: true,
      canViewReports: true,
      canManageUsers: true,
    },
  },
];

export const INITIAL_TICKETS: PassTicket[] = [];

export const INITIAL_EVENTS: EventRecord[] = [];

export const INITIAL_ORDERS: OrderRecord[] = [];

export const INITIAL_CUSTOMERS: CustomerRecord[] = [];

export const INITIAL_SCANNERS: ScannerDevice[] = [
  {
    id: 'scn-1',
    name: 'Regular Gate Station',
    gate: 'Regular Gate',
    venue: 'Main Arena Entrance',
    battery: 100,
    isOnline: true,
    lastSync: 'Just now',
    todayScans: 0,
    currentUser: 'Gate Scanner #1',
  },
  {
    id: 'scn-2',
    name: 'VIP Gate Station',
    gate: 'VIP Gate',
    venue: 'Main Arena Entrance',
    battery: 100,
    isOnline: true,
    lastSync: 'Just now',
    todayScans: 0,
    currentUser: 'Gate Scanner #2',
  },
  {
    id: 'scn-3',
    name: 'VVIP Gate Station',
    gate: 'VVIP Gate',
    venue: 'Courtside VIP Entrance',
    battery: 100,
    isOnline: true,
    lastSync: 'Just now',
    todayScans: 0,
    currentUser: 'Gate Scanner #3',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
