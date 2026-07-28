import React, { useState, useEffect, useMemo } from 'react';
import { PassTicket, PassStatus, ScannerLog, EventRecord, OrderRecord, CustomerRecord, ScannerDevice, ActivityItem, NotificationItem, UserAccount, AppState } from './types';
import {
  INITIAL_TICKETS,
  INITIAL_EVENTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMERS,
  INITIAL_SCANNERS,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_USERS,
} from './lib/mockData';

// Component Workspaces
import { NavigationSidebar, TabType } from './components/NavigationSidebar';
import { PageHeader } from './components/PageHeader';
import { CommandPalette } from './components/CommandPalette';
import { SideDetailPanel } from './components/SideDetailPanel';
import { DashboardWorkspace } from './components/DashboardWorkspace';
import { EventsWorkspace } from './components/EventsWorkspace';
import { TicketsWorkspace } from './components/TicketsWorkspace';
import { OrdersWorkspace } from './components/OrdersWorkspace';
import { CustomersWorkspace } from './components/CustomersWorkspace';
import { UsersWorkspace } from './components/UsersWorkspace';
import { ScannerWorkspace } from './components/ScannerWorkspace';
import { VenuesWorkspace } from './components/VenuesWorkspace';
import { ReportsWorkspace } from './components/ReportsWorkspace';
import { AnalyticsWorkspace } from './components/AnalyticsWorkspace';
import { OrganizationWorkspace } from './components/OrganizationWorkspace';
import { syncDataToGoogleSheets } from './components/GoogleSheetsSync';
import { HelpWorkspace } from './components/HelpWorkspace';

// Modals
import { PassGeneratorModal } from './components/PassGeneratorModal';
import { TicketDetailModal } from './components/TicketDetailModal';
import { ConfirmDeleteModal, DeleteTarget } from './components/ConfirmDeleteModal';
import { CreateEventModal } from './components/CreateEventModal';
import { SuperAdminModal } from './components/SuperAdminModal';
import { SharePassModal } from './components/SharePassModal';
import { LoginScreen } from './components/LoginScreen';

export const App: React.FC = () => {
  // True until the initial GET /api/state load completes — the app's
  // real data (tickets, events, users, etc.) now lives on the server
  // (backed by Google Sheets, or a local JSON file as a fallback), not in
  // localStorage, so everything starts empty and is populated once by
  // that load.
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>(() => {
    try {
      return (localStorage.getItem('courtside_active_tab_v2') as TabType) || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('courtside_sidebar_collapsed_v2') === 'true';
    } catch {
      return false;
    }
  });

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Data persistence with localStorage local fallback cache for instant offline PWA support
  const [tickets, setTickets] = useState<PassTicket[]>(() => {
    try {
      const saved = localStorage.getItem('courtside_tickets_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [events, setEvents] = useState<EventRecord[]>(() => {
    try {
      const saved = localStorage.getItem('courtside_events_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_EVENTS;
  });

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [scanners, setScanners] = useState<ScannerDevice[]>(INITIAL_SCANNERS);

  const [scannerLogs, setScannerLogs] = useState<ScannerLog[]>(() => {
    try {
      const saved = localStorage.getItem('courtside_scanner_logs_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [customLogoUrl, setCustomLogoUrlState] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem('courtside_custom_logo_url') || undefined;
    } catch {
      return undefined;
    }
  });
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Local storage synchronization effects
  useEffect(() => {
    try { localStorage.setItem('courtside_tickets_v2', JSON.stringify(tickets)); } catch {}
  }, [tickets]);

  useEffect(() => {
    try { localStorage.setItem('courtside_events_v2', JSON.stringify(events)); } catch {}
  }, [events]);

  useEffect(() => {
    try { localStorage.setItem('courtside_scanner_logs_v2', JSON.stringify(scannerLogs)); } catch {}
  }, [scannerLogs]);

  const setCustomLogoUrl = (url: string | undefined) => {
    setCustomLogoUrlState(url);
    try {
      if (url) {
        localStorage.setItem('courtside_custom_logo_url', url);
      } else {
        localStorage.removeItem('courtside_custom_logo_url');
      }
    } catch {
      /* ignore */
    }
  };

  // Helper to sync latest database state from server
  const fetchStateFromServer = async () => {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) return false;
      const data = await res.json();
      if (data.success && data.state) {
        const s = data.state;
        const savedLogo = localStorage.getItem('courtside_custom_logo_url') || undefined;

        setTickets((prevLocal) => {
          const serverTickets: PassTicket[] = s.tickets || [];
          const localScanMap = new Map<string, PassTicket>();
          prevLocal.forEach((t) => {
            if (t.status === 'used' || (t.status as string) === 'already_used') {
              localScanMap.set(t.id || t.ticketCode, t);
            }
          });
          // Update scan status for tickets that exist on server
          return serverTickets.map((st) => {
            const key = st.id || st.ticketCode;
            const localScanned = localScanMap.get(key);
            if (localScanned && st.status === 'valid') {
              return {
                ...st,
                status: 'used',
                scannedAt: localScanned.scannedAt || st.scannedAt,
                scannedBy: localScanned.scannedBy || st.scannedBy,
                gateEntry: localScanned.gateEntry || st.gateEntry,
              };
            }
            return st;
          });
        });

        setEvents(s.events || INITIAL_EVENTS);
        setOrders(s.orders || []);
        setCustomers(s.customers || []);
        setScanners(s.scanners || INITIAL_SCANNERS);
        setScannerLogs(s.scannerLogs || []);
        setActivities(s.activities || INITIAL_ACTIVITIES);
        setNotifications(s.notifications || []);
        const logoToUse = s.customLogoUrl || savedLogo;
        setCustomLogoUrlState(logoToUse);
        if (logoToUse) {
          try { localStorage.setItem('courtside_custom_logo_url', logoToUse); } catch {}
        }
        setUsers(s.users || INITIAL_USERS);
        return true;
      }
    } catch {
      // Offline mode or server restarting - fallback gracefully
    }
    return false;
  };

  // ── Load everything from server on mount, setup polling, and sync on tab focus ──
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchStateFromServer();
      if (!cancelled) setIsLoading(false);
    })();

    // Poll every 8 seconds so PWA scanners pick up passes generated on other devices
    const interval = setInterval(() => {
      fetchStateFromServer();
    }, 8000);

    // Sync state whenever phone/computer regains focus or tab becomes active
    const handleFocus = () => {
      fetchStateFromServer();
    };
    window.addEventListener('focus', handleFocus);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStateFromServer();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Helper to force immediate persistence to server (bypassing debounce)
  const saveStateImmediately = async (customPayload?: Partial<AppState>) => {
    const payload = {
      tickets, events, orders, customers, scanners,
      scannerLogs, activities, notifications, users, customLogoUrl,
      ...customPayload
    };
    try {
      await fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Offline mode or server restarting
    }
  };

  // ── Auto-save everything back to the server whenever state changes ──
  const saveTimerRef = React.useRef<any>(null);
  useEffect(() => {
    if (isLoading) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveStateImmediately();
    }, 600);
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); };
  }, [tickets, events, orders, customers, scanners, scannerLogs, activities, notifications, users, customLogoUrl, isLoading]);

  // Current Logged In User State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('courtside_current_user_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null; // Force sign in first
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('courtside_current_user_v2', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('courtside_current_user_v2');
    }
  }, [currentUser]);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState(false);
  const [sharingTicket, setSharingTicket] = useState<PassTicket | null>(null);

  const handleAuthenticateUser = (passcode: string) => {
    const code = passcode.trim();
    const found = users.find((u) => u.passcode === code && u.status === 'active');
    if (found) {
      setCurrentUser(found);
      // Instantly pull all tickets and events created on computer or other devices
      fetchStateFromServer();
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `👤 Signed in as ${found.name}`,
        message: `Passcode PIN ${code} verified. Permissions active for ${found.role.replace('_', ' ')}.`,
        category: 'system',
        timestamp: 'Just now',
        isRead: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      return { success: true, user: found };
    }

    if (code === '004455') {
      const owner = users.find((u) => u.role === 'super_admin') || INITIAL_USERS[0];
      setCurrentUser(owner);
      // Instantly pull all tickets and events created on computer or other devices
      fetchStateFromServer();
      return { success: true, user: owner };
    }

    return { success: false, message: 'Invalid passcode PIN. Enter 004455 for Super Admin or your assigned user PIN.' };
  };

  const handleLogoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('courtside_current_user_v2');
  };

  const handleAddUser = (newUser: UserAccount) => {
    setUsers((prev) => [newUser, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `🔑 User Account Created: ${newUser.name}`,
      message: `Passcode PIN ${newUser.passcode} assigned for role ${newUser.role.replace('_', ' ')}.`,
      category: 'system',
      timestamp: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleUpdateUser = (updatedUser: UserAccount) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const u = users.find((x) => x.id === userId);
    setDeleteTarget({
      type: 'user',
      id: userId,
      title: u ? `${u.name} (${u.email})` : `User Account`,
      subtitle: u ? `Role: ${u.role}` : undefined,
      warningText: 'This user credentials and scanner access privileges will be revoked.',
    });
  };

  // Modal Delete Target State
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Slide-over & Modal inspection states
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<PassTicket | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerRecord | null>(null);
  const [selectedScanner, setSelectedScanner] = useState<ScannerDevice | null>(null);

  // System-wide record access for authenticated accounts
  const visibleEvents = useMemo(() => {
    if (!currentUser) return [];
    return events;
  }, [events, currentUser]);

  const visibleTickets = useMemo(() => {
    if (!currentUser) return [];
    return tickets;
  }, [tickets, currentUser]);

  const visibleOrders = useMemo(() => {
    if (!currentUser) return [];
    if (isSuperAdmin) return orders;
    const userTicketOrderIds = new Set(visibleTickets.map((t) => t.orderId).filter(Boolean));
    const userTicketEmails = new Set(visibleTickets.map((t) => t.holderEmail).filter(Boolean));
    return orders.filter(
      (o) => userTicketOrderIds.has(o.id) || userTicketEmails.has(o.customerEmail)
    );
  }, [orders, visibleTickets, currentUser, isSuperAdmin]);

  const visibleCustomers = useMemo(() => {
    if (!currentUser) return [];
    if (isSuperAdmin) return customers;
    const userTicketEmails = new Set(visibleTickets.map((t) => t.holderEmail).filter(Boolean));
    return customers.filter((c) => userTicketEmails.has(c.email));
  }, [customers, visibleTickets, currentUser, isSuperAdmin]);

  const visibleActivities = useMemo(() => {
    if (!currentUser) return [];
    if (isSuperAdmin) return activities;
    return activities.filter(
      (a) => a.user === currentUser.name || a.user === 'Owner / Super Admin'
    );
  }, [activities, currentUser, isSuperAdmin]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('courtside_active_tab_v2', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('courtside_sidebar_collapsed_v2', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    localStorage.setItem('courtside_tickets_v2', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('courtside_events_v2', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('courtside_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('courtside_customers_v2', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('courtside_scanners_v2', JSON.stringify(scanners));
  }, [scanners]);

  useEffect(() => {
    localStorage.setItem('courtside_scanner_logs_v2', JSON.stringify(scannerLogs));
  }, [scannerLogs]);

  useEffect(() => {
    localStorage.setItem('courtside_activities_v2', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('courtside_notifications_v2', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (customLogoUrl) {
      localStorage.setItem('courtside_logo_url_v2', customLogoUrl);
    } else {
      localStorage.removeItem('courtside_logo_url_v2');
    }
  }, [customLogoUrl]);

  // Global Keyboard Shortcuts (Cmd+K, N, T, R, S, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        if (e.key === 'Escape') {
          setIsCommandPaletteOpen(false);
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsCreateEventOpen(true);
      } else if (e.key.toLowerCase() === 't' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsGeneratorOpen(true);
      } else if (e.key.toLowerCase() === 'r' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setActiveTab('reports');
      } else if (e.key.toLowerCase() === 's' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setActiveTab('scanners');
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsGeneratorOpen(false);
        setIsCreateEventOpen(false);
        setSelectedTicket(null);
        setSelectedOrder(null);
        setSelectedCustomer(null);
        setSelectedScanner(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Super Admin Handlers
  const handleAuthenticateSuperAdmin = (code: string): boolean => {
    const res = handleAuthenticateUser(code);
    return res.success;
  };

  const handleLogoutSuperAdmin = () => {
    handleLogoutUser();
  };

  // Handlers
  const handleGenerateTickets = (newTickets: PassTicket[]) => {
    const processed = newTickets.map((t) => ({
      ...t,
      customLogoUrl: t.customLogoUrl || customLogoUrl,
      createdByUserId: currentUser?.id,
      createdByUserName: currentUser?.name,
    }));

    const updatedTickets = [...processed, ...tickets];
    setTickets(updatedTickets);

    // Save immediately to cloud database so all other devices receive new passes
    saveStateImmediately({ tickets: updatedTickets });

    // Add activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      user: currentUser?.name || 'Operations Officer',
      action: `generated ${newTickets.length} digital pass(es)`,
      target: newTickets[0]?.eventName || 'LBA Championship',
      timestamp: 'Just now',
      type: 'ticket',
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Auto sync to Google Sheets
    try {
      const savedSheetUrl = localStorage.getItem('courtside_sheets_webapp_url_v2') || import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL;
      if (savedSheetUrl) {
        syncDataToGoogleSheets(savedSheetUrl, events, updatedTickets, orders, scannerLogs);
      }
    } catch {}
  };

  const handleCreateEvent = (newEvent: EventRecord) => {
    const taggedEvent: EventRecord = {
      ...newEvent,
      createdByUserId: currentUser?.id,
      createdByUserName: currentUser?.name,
    };
    const updatedEvents = [taggedEvent, ...events];
    setEvents(updatedEvents);

    // Save immediately to cloud database so all other devices receive new event
    saveStateImmediately({ events: updatedEvents });

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      user: currentUser?.name || 'Event Director',
      action: 'published new event',
      target: newEvent.name,
      timestamp: 'Just now',
      type: 'event',
    };
    setActivities((prev) => [newActivity, ...prev]);

    // Auto sync to Google Sheets
    try {
      const savedSheetUrl = localStorage.getItem('courtside_sheets_webapp_url_v2') || import.meta.env.VITE_GOOGLE_SHEETS_WEBAPP_URL;
      if (savedSheetUrl) {
        syncDataToGoogleSheets(savedSheetUrl, updatedEvents, tickets, orders, scannerLogs);
      }
    } catch {}
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: PassStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: newStatus } : t))
    );
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    const t = tickets.find((x) => x.id === ticketId);
    setDeleteTarget({
      type: 'ticket',
      id: ticketId,
      title: t ? `Pass #${t.ticketCode} - ${t.holderName}` : `Pass Ticket`,
      subtitle: t ? `Event: ${t.eventName} • Category: ${t.category.toUpperCase()}` : undefined,
      warningText: 'This pass record and QR code validation will be permanently deleted.',
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const e = events.find((x) => x.id === eventId);
    setDeleteTarget({
      type: 'event',
      id: eventId,
      title: e ? e.name : `Event Record`,
      subtitle: e ? `${e.date} @ ${e.venue}` : undefined,
      warningText: 'Deleting this event will remove it from all schedules and dashboards.',
    });
  };

  const handleResetDatabase = () => {
    setDeleteTarget({
      type: 'reset',
      id: 'reset',
      title: 'Reset System Database',
      subtitle: 'Restores sample events, passes, users, and logs to initial default state.',
      warningText: 'All custom created passes, events, and records will be replaced.',
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    let updatedTickets = tickets;
    let updatedEvents = events;
    let updatedUsers = users;

    if (deleteTarget.type === 'ticket') {
      updatedTickets = tickets.filter((t) => t.id !== deleteTarget.id);
      setTickets(updatedTickets);
      if (selectedTicket?.id === deleteTarget.id) setSelectedTicket(null);
    } else if (deleteTarget.type === 'event') {
      updatedEvents = events.filter((e) => e.id !== deleteTarget.id);
      setEvents(updatedEvents);
    } else if (deleteTarget.type === 'user') {
      updatedUsers = users.filter((u) => u.id !== deleteTarget.id);
      setUsers(updatedUsers);
      if (currentUser?.id === deleteTarget.id) {
        setCurrentUser(INITIAL_USERS[0]);
      }
    } else if (deleteTarget.type === 'reset') {
      updatedTickets = INITIAL_TICKETS;
      updatedEvents = INITIAL_EVENTS;
      updatedUsers = INITIAL_USERS;
      setTickets(INITIAL_TICKETS);
      setEvents(INITIAL_EVENTS);
      setOrders(INITIAL_ORDERS);
      setCustomers(INITIAL_CUSTOMERS);
      setScanners(INITIAL_SCANNERS);
      setActivities(INITIAL_ACTIVITIES);
      setNotifications(INITIAL_NOTIFICATIONS);
      setScannerLogs([]);
    }

    saveStateImmediately({
      tickets: updatedTickets,
      events: updatedEvents,
      users: updatedUsers,
    });

    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Scanning ticket handler
  const handleScanPass = (
    ticketCode: string,
    gateName: string
  ): { success: boolean; ticket?: PassTicket; message: string; code: 'valid' | 'already_used' | 'invalid' | 'revoked' } => {
    const scanTime = new Date().toLocaleTimeString();

    // Owner / Super Admin Master Passcode Override
    const rawCodeInput = (ticketCode || '').trim();
    if (rawCodeInput === '004455' || rawCodeInput.toUpperCase() === '004455') {
      handleAuthenticateUser('004455');
      const masterLog: ScannerLog = {
        id: `log-${Date.now()}`,
        ticketCode: '004455',
        holderName: 'Owner / Super Admin',
        category: 'all_access',
        status: 'valid',
        scannedAt: scanTime,
        gate: gateName,
        scannedBy: 'Master Override System',
      };
      setScannerLogs((prev) => [masterLog, ...prev]);

      const masterTicket: PassTicket = {
        id: 'owner-master-pass',
        ticketCode: '004455',
        holderName: 'Courtside Owner / Super Admin',
        holderEmail: 'courtsideliberia@gmail.com',
        category: 'all_access',
        eventName: 'LBA Master Command Pass',
        eventDate: '2026 Season',
        venue: 'SKD Sports Complex',
        price: 0,
        currency: 'USD',
        status: 'valid',
        issuedAt: new Date().toISOString(),
        qrCodeData: '004455|Courtside Owner|super_admin',
        notes: 'Master Super Admin Security Key 004455',
      };

      return {
        success: true,
        ticket: masterTicket,
        message: '👑 OWNER / SUPER ADMIN CODE 004455 VERIFIED • ALL ACCESS GRANTED',
        code: 'valid',
      };
    }

    // Extract potential code candidate tokens from scanned raw text
    const cleanRaw = rawCodeInput.replace(/^["']|["']$/g, '').toUpperCase();
    const candidateTokens = new Set<string>();
    if (cleanRaw) candidateTokens.add(cleanRaw);

    // Split by delimiters (| : ; , / space newline ? =)
    cleanRaw.split(/[|:;,\/\s\n?=&]+/).forEach((part) => {
      const p = part.trim();
      if (p.length >= 3) candidateTokens.add(p);
    });

    const ticket = tickets.find((t) => {
      const code = (t.ticketCode || '').trim().toUpperCase();
      const id = (t.id || '').trim().toUpperCase();
      const qrData = (t.qrCodeData || '').trim().toUpperCase();

      if (code && candidateTokens.has(code)) return true;
      if (id && candidateTokens.has(id)) return true;
      if (qrData && (qrData === cleanRaw || candidateTokens.has(qrData))) return true;

      // Prefix / Substring matching if token length >= 3
      for (const tok of candidateTokens) {
        if (tok.length >= 3) {
          if (code && (code === tok || tok.includes(code) || code.includes(tok))) return true;
          if (id && (id === tok || tok.includes(id) || id.includes(tok))) return true;
          if (qrData && (qrData === tok || qrData.startsWith(tok) || tok.startsWith(qrData))) return true;
        }
      }
      return false;
    });

    if (!ticket) {
      const newLog: ScannerLog = {
        id: `log-${Date.now()}`,
        ticketCode,
        holderName: 'Unknown Code',
        category: 'regular',
        status: 'invalid',
        scannedAt: scanTime,
        gate: gateName,
        scannedBy: 'Gate System',
      };
      setScannerLogs((prev) => [newLog, ...prev]);
      return {
        success: false,
        message: 'INVALID TICKET CODE • ACCESS DENIED',
        code: 'invalid',
      };
    }

    if (ticket.status === 'revoked') {
      const newLog: ScannerLog = {
        id: `log-${Date.now()}`,
        ticketCode,
        holderName: ticket.holderName || ticket.eventName || "Guest",
        category: ticket.category,
        status: 'revoked',
        scannedAt: scanTime,
        gate: gateName,
        scannedBy: 'Gate System',
      };
      setScannerLogs((prev) => [newLog, ...prev]);
      return {
        success: false,
        ticket,
        message: 'PASS REVOKED / CANCELLED • ACCESS DENIED',
        code: 'revoked',
      };
    }

    if (ticket.status === 'used') {
      const newLog: ScannerLog = {
        id: `log-${Date.now()}`,
        ticketCode,
        holderName: ticket.holderName || ticket.eventName || "Guest",
        category: ticket.category,
        status: 'already_used',
        scannedAt: scanTime,
        gate: gateName,
        scannedBy: 'Gate System',
      };
      setScannerLogs((prev) => [newLog, ...prev]);
      return {
        success: false,
        ticket,
        message: `PASS ALREADY SCANNED AT ${ticket.scannedAt || 'earlier'}`,
        code: 'already_used',
      };
    }

    // Gate Access Validation Logic (Strict Gate Category Matching)
    // Note: All Access passes can enter at any gate!
    const normalizedGate = gateName.toLowerCase();
    const cat = (ticket.category || 'regular').toLowerCase();

    let isGateAllowed = true;
    let gateReason = '';

    if (cat === 'all_access') {
      isGateAllowed = true;
    } else if (normalizedGate.includes('vvip')) {
      // VVIP Gate accepts ONLY VVIP tier passes (vvip, courtside_box, courtside_floor)
      const isVVIPPass = cat === 'vvip' || cat === 'courtside_box' || cat === 'courtside_floor';
      if (!isVVIPPass) {
        isGateAllowed = false;
        const formattedCat = cat === 'regular' ? 'REGULAR' : cat.replace('_', ' ').toUpperCase();
        gateReason = `WRONG GATE • This scanner is set to VVIP Gate. ${formattedCat} pass cannot scan here.`;
      }
    } else if (normalizedGate.includes('vip')) {
      // VIP Gate accepts ONLY VIP tier passes (vip, courtside_vip, player_staff, media)
      const isVIPPass = cat === 'vip' || cat === 'courtside_vip' || cat === 'player_staff' || cat === 'media';
      if (!isVIPPass) {
        isGateAllowed = false;
        const formattedCat = cat === 'regular' ? 'REGULAR' : cat.replace('_', ' ').toUpperCase();
        gateReason = `WRONG GATE • This scanner is set to VIP Gate. ${formattedCat} pass cannot scan here. (Please proceed to Regular Gate)`;
      }
    } else {
      // Regular Gate accepts ONLY Regular & General Access passes
      const isRegularPass = cat === 'regular' || cat === 'general_access';
      if (!isRegularPass) {
        isGateAllowed = false;
        const formattedCat = cat.replace('_', ' ').toUpperCase();
        gateReason = `WRONG GATE • This scanner is set to Regular Gate. ${formattedCat} pass cannot scan here. (Please proceed to VIP/VVIP Gate)`;
      }
    }

    if (!isGateAllowed) {
      const newLog: ScannerLog = {
        id: `log-${Date.now()}`,
        ticketCode,
        holderName: ticket.holderName || ticket.eventName || "Guest",
        category: ticket.category,
        status: 'invalid',
        scannedAt: scanTime,
        gate: gateName,
        scannedBy: 'Gate System',
      };
      setScannerLogs((prev) => [newLog, ...prev]);
      return {
        success: false,
        ticket,
        message: gateReason || `WRONG GATE • Pass not valid for ${gateName}`,
        code: 'invalid',
      };
    }

    // Valid pass entry
    const updatedTicket: PassTicket = {
      ...ticket,
      status: 'used',
      scannedAt: new Date().toISOString(),
      gateEntry: gateName,
    };

    const updatedTickets = tickets.map((t) => (t.id === ticket.id ? updatedTicket : t));
    setTickets(updatedTickets);

    const newLog: ScannerLog = {
      id: `log-${Date.now()}`,
      ticketCode,
      holderName: ticket.holderName || ticket.eventName || "Guest",
      category: ticket.category,
      status: 'valid',
      scannedAt: scanTime,
      gate: gateName,
      scannedBy: 'Gate Agent',
    };
    const updatedLogs = [newLog, ...scannerLogs];
    setScannerLogs(updatedLogs);

    // Save immediately to cloud database so all other devices see pass as used
    saveStateImmediately({ tickets: updatedTickets, scannerLogs: updatedLogs });

    return {
      success: true,
      ticket: updatedTicket,
      message: `ENTRY GRANTED AT ${gateName.toUpperCase()} • VALID PASS`,
      code: 'valid',
    };
  };

  if (!currentUser) {
    return (
      <LoginScreen
        users={users}
        onLogin={handleAuthenticateUser}
        customLogoUrl={customLogoUrl}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setMobileNavOpen(false);
        }}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        customLogoUrl={customLogoUrl}
        mobileNavOpen={mobileNavOpen}
        onCloseMobileNav={() => setMobileNavOpen(false)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isSuperAdmin={isSuperAdmin}
        currentUser={currentUser}
        onLogout={handleLogoutUser}
        onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Unified Page Header */}
        <PageHeader
          activeTab={activeTab}
          notifications={notifications}
          onMarkRead={handleMarkNotificationRead}
          onClearAll={handleClearNotifications}
          onOpenSearch={() => setIsCommandPaletteOpen(true)}
          onOpenIssueModal={() => setIsGeneratorOpen(true)}
          onOpenCreateEventModal={() => setIsCreateEventOpen(true)}
          onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
          isSuperAdmin={isSuperAdmin}
          onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardWorkspace
              tickets={visibleTickets}
              events={visibleEvents}
              orders={visibleOrders}
              customers={visibleCustomers}
              scanners={scanners}
              activities={visibleActivities}
              currentUser={currentUser}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
              onOpenIssueModal={() => setIsGeneratorOpen(true)}
              onOpenCreateEventModal={() => setIsCreateEventOpen(true)}
              onOpenShareModal={(ticket) => setSharingTicket(ticket)}
              onDeleteTicket={handleDeleteTicket}
              onDeleteEvent={handleDeleteEvent}
            />
          )}

          {activeTab === 'events' && (
            <EventsWorkspace
              events={visibleEvents}
              tickets={visibleTickets}
              orders={visibleOrders}
              scanners={scanners}
              onOpenCreateEventModal={() => setIsCreateEventOpen(true)}
              onOpenIssueModal={() => setIsGeneratorOpen(true)}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
              onSelectOrder={(order) => setSelectedOrder(order)}
              onDeleteEvent={handleDeleteEvent}
              onDeleteTicket={handleDeleteTicket}
            />
          )}

          {activeTab === 'tickets' && (
            <TicketsWorkspace
              tickets={visibleTickets}
              events={visibleEvents}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
              onUpdateTicketStatus={handleUpdateTicketStatus}
              onDeleteTicket={handleDeleteTicket}
              onOpenIssueModal={() => setIsGeneratorOpen(true)}
              onOpenShareModal={(ticket) => setSharingTicket(ticket)}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersWorkspace
              orders={visibleOrders}
              tickets={visibleTickets}
              onSelectOrder={(order) => setSelectedOrder(order)}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersWorkspace
              customers={visibleCustomers}
              tickets={visibleTickets}
              orders={visibleOrders}
              onSelectCustomer={(customer) => setSelectedCustomer(customer)}
              onSelectTicket={(ticket) => setSelectedTicket(ticket)}
            />
          )}

          {activeTab === 'users' && (
            <UsersWorkspace
              users={users}
              currentUser={currentUser}
              events={events}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
              onSelectUserPasscode={(code: string) => {
                handleAuthenticateUser(code);
              }}
            />
          )}

          {activeTab === 'scanners' && (
            <ScannerWorkspace
              scanners={scanners}
              tickets={visibleTickets}
              onScanPass={handleScanPass}
              scannerLogs={scannerLogs}
              onSyncState={fetchStateFromServer}
            />
          )}

          {activeTab === 'venues' && <VenuesWorkspace />}

          {activeTab === 'reports' && <ReportsWorkspace tickets={visibleTickets} />}

          {activeTab === 'analytics' && <AnalyticsWorkspace tickets={visibleTickets} />}

          {(activeTab === 'organization' || activeTab === 'settings') && (
            isSuperAdmin ? (
              <OrganizationWorkspace
                customLogoUrl={customLogoUrl}
                onLogoChange={setCustomLogoUrl}
                onResetDatabase={handleResetDatabase}
                events={events}
                tickets={tickets}
                orders={orders}
                scannerLogs={scannerLogs}
                onImportTickets={(imported) => setTickets((prev) => [...imported, ...prev])}
                onImportEvents={(imported) => setEvents((prev) => [...imported, ...prev])}
              />
            ) : (
              <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 space-y-4 my-8">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center font-bold text-2xl">
                  🔒
                </div>
                <h3 className="text-xl font-bold text-white font-heading uppercase tracking-wider">Super Admin Access Required</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Workspace settings, system branding, and database controls are strictly restricted to Super Administrators. Please sign in with a Super Admin PIN to access Settings.
                </p>
                <button
                  onClick={() => setIsSuperAdminModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
                >
                  Sign In as Super Admin
                </button>
              </div>
            )
          )}

          {activeTab === 'help' && (
            <HelpWorkspace
              onOpenIssueModal={() => setIsGeneratorOpen(true)}
              onOpenCreateEventModal={() => setIsCreateEventOpen(true)}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Intelligent Command Palette Search Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tickets={tickets}
        events={events}
        orders={orders}
        customers={customers}
        scanners={scanners}
        onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
        onSelectTicket={(ticket) => {
          setSelectedTicket(ticket);
          setActiveTab('tickets');
        }}
        onSelectOrder={(order) => {
          setSelectedOrder(order);
          setActiveTab('orders');
        }}
        onSelectCustomer={(customer) => {
          setSelectedCustomer(customer);
          setActiveTab('customers');
        }}
        onSelectScanner={(scanner) => {
          setSelectedScanner(scanner);
          setActiveTab('scanners');
        }}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      {/* Slide-Over Detail Inspector Panel */}
      <SideDetailPanel
        selectedTicket={selectedTicket}
        selectedOrder={selectedOrder}
        selectedCustomer={selectedCustomer}
        selectedScanner={selectedScanner}
        onClose={() => {
          setSelectedTicket(null);
          setSelectedOrder(null);
          setSelectedCustomer(null);
          setSelectedScanner(null);
        }}
        onUpdateTicketStatus={handleUpdateTicketStatus}
        onDeleteTicket={handleDeleteTicket}
      />

      {/* Quick Actions Modals */}
      <PassGeneratorModal
        isOpen={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onGenerate={handleGenerateTickets}
        events={visibleEvents}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreateEvent={handleCreateEvent}
      />

      <TicketDetailModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdateStatus={handleUpdateTicketStatus}
        onOpenShareModal={(t) => setSharingTicket(t)}
        onDelete={handleDeleteTicket}
      />

      <SuperAdminModal
        isOpen={isSuperAdminModalOpen}
        onClose={() => setIsSuperAdminModalOpen(false)}
        currentUser={currentUser}
        users={users}
        onAuthenticate={handleAuthenticateUser}
        onLogout={handleLogoutUser}
      />

      <SharePassModal
        ticket={sharingTicket}
        onClose={() => setSharingTicket(null)}
      />

      {/* Unified Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};
export default App;
