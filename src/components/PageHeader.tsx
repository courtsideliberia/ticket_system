import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Command,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Ticket,
  QrCode,
  BarChart3,
  X,
  ExternalLink,
  Menu,
  Crown,
  ShieldCheck,
  KeyRound,
} from 'lucide-react';
import { AppNavView, NotificationItem } from '../types';

interface PageHeaderProps {
  activeTab?: AppNavView;
  currentView?: AppNavView;
  selectedEventName?: string;
  selectedSubSection?: string;
  onOpenSearch?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenIssueModal: () => void;
  onOpenCreateEventModal: () => void;
  onNavigate?: (view: AppNavView) => void;
  onNavigateView?: (view: AppNavView) => void;
  notifications: NotificationItem[];
  onMarkRead?: (id: string) => void;
  onMarkNotificationRead?: (id: string) => void;
  onClearAll?: () => void;
  onClearAllNotifications?: () => void;
  onToggleMobileNav?: () => void;
  isSuperAdmin?: boolean;
  onOpenSuperAdminModal?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  activeTab,
  currentView,
  selectedEventName,
  selectedSubSection,
  onOpenSearch,
  onOpenCommandPalette,
  onOpenIssueModal,
  onOpenCreateEventModal,
  onNavigate,
  onNavigateView,
  notifications,
  onMarkRead,
  onMarkNotificationRead,
  onClearAll,
  onClearAllNotifications,
  onToggleMobileNav,
  isSuperAdmin = false,
  onOpenSuperAdminModal,
}) => {
  const view = activeTab || currentView || 'dashboard';
  const handleOpenSearch = onOpenSearch || onOpenCommandPalette || (() => {});
  const handleNavigate = onNavigate || onNavigateView || (() => {});
  const handleMarkRead = onMarkRead || onMarkNotificationRead || (() => {});
  const handleClearAll = onClearAll || onClearAllNotifications || (() => {});

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Build Breadcrumbs list
  const getBreadcrumbs = () => {
    const items: { label: string; view?: AppNavView }[] = [{ label: 'Dashboard', view: 'dashboard' }];

    if (view === 'events') {
      items.push({ label: 'Events', view: 'events' });
      if (selectedEventName) {
        items.push({ label: selectedEventName });
        if (selectedSubSection) {
          items.push({ label: selectedSubSection });
        }
      }
    } else if (view === 'tickets') {
      items.push({ label: 'Tickets', view: 'tickets' });
    } else if (view === 'orders') {
      items.push({ label: 'Orders', view: 'orders' });
    } else if (view === 'customers') {
      items.push({ label: 'Customers', view: 'customers' });
    } else if (view === 'scanners') {
      items.push({ label: 'Gate Scanners', view: 'scanners' });
    } else if (view === 'venues') {
      items.push({ label: 'Venues', view: 'venues' });
    } else if (view === 'reports') {
      items.push({ label: 'Reports', view: 'reports' });
    } else if (view === 'analytics') {
      items.push({ label: 'Analytics', view: 'analytics' });
    } else if (view === 'organization') {
      items.push({ label: 'Organization', view: 'organization' });
    } else if (view === 'settings') {
      items.push({ label: 'Settings', view: 'settings' });
    } else if (view === 'help') {
      items.push({ label: 'Help & Shortcuts', view: 'help' });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Breadcrumbs & Title */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          {onToggleMobileNav && (
            <button
              onClick={onToggleMobileNav}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium overflow-x-auto custom-scrollbar pb-0.5">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={index}>
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
                  {crumb.view && !isLast ? (
                    <button
                      onClick={() => handleNavigate(crumb.view!)}
                      className="hover:text-blue-400 transition-colors shrink-0"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className={isLast ? 'text-blue-400 font-bold shrink-0' : 'shrink-0'}>
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <h1 className="text-xl lg:text-2xl font-heading font-extrabold text-white tracking-tight uppercase truncate">
            {view === 'dashboard' && 'Operations Dashboard'}
            {view === 'events' && (selectedEventName || 'Event Command Center')}
            {view === 'tickets' && 'Ticket Pass Workspace'}
            {view === 'orders' && 'Order Management & Ledger'}
            {view === 'customers' && 'Customer Profiles & History'}
            {view === 'scanners' && 'Hardware & Gate Verification'}
            {view === 'venues' && 'Venue & Capacity Manager'}
            {view === 'reports' && 'Reports & Settlement'}
            {view === 'analytics' && 'Executive Analytics'}
            {view === 'organization' && 'Organization Configuration'}
            {view === 'settings' && 'System Settings & Sync'}
            {view === 'help' && 'Help Center & Shortcuts'}
          </h1>

          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live System
          </span>
        </div>
      </div>

      {/* Global Controls & Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* Quick Search Bar Trigger */}
        <button
          onClick={handleOpenSearch}
          className="flex-1 md:w-64 py-2 px-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-400 flex items-center justify-between transition-all shadow-sm group"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="truncate">Search tickets, orders, customers...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Owner / Super Admin Button */}
          {onOpenSuperAdminModal && (
            <button
              onClick={onOpenSuperAdminModal}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                isSuperAdmin
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
              title={isSuperAdmin ? 'Authenticated as Super Admin (Code 004455)' : 'Sign in as Owner / Super Admin (Code 004455)'}
            >
              <Crown className={`w-4 h-4 ${isSuperAdmin ? 'text-emerald-400 animate-pulse' : 'text-blue-400'}`} />
              <span className="hidden sm:inline">
                {isSuperAdmin ? 'Owner / Super Admin' : 'Owner Access'}
              </span>
            </button>
          )}

          {view === 'events' ? (
            <button
              onClick={onOpenCreateEventModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all uppercase tracking-wider shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Event</span>
            </button>
          ) : (
            <button
              onClick={onOpenIssueModal}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all uppercase tracking-wider shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Issue Pass</span>
            </button>
          )}

          {/* Notification Center Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors relative"
              title="Notification Center"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white font-mono font-bold text-[10px] flex items-center justify-center border-2 border-slate-950 shadow-lg">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/80 z-50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-400" />
                    <h3 className="font-bold text-sm text-white">Notification Center</h3>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleClearAll}
                      className="text-[11px] text-slate-400 hover:text-white transition-colors"
                    >
                      Clear all
                    </button>
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications right now
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleMarkRead(notif.id)}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          notif.isRead
                            ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-slate-200 font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-bold text-blue-400 flex items-center gap-1.5">
                            {notif.category === 'scanners' && <QrCode className="w-3.5 h-3.5" />}
                            {notif.category === 'orders' && <Ticket className="w-3.5 h-3.5" />}
                            {notif.category === 'system' && <Sparkles className="w-3.5 h-3.5" />}
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3" /> {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
