import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  ShoppingBag,
  Users,
  QrCode,
  MapPin,
  BarChart3,
  TrendingUp,
  Building2,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  Command,
  X,
  KeyRound,
  LogOut,
  UserCheck,
  Smartphone,
} from 'lucide-react';
import { AppNavView, UserAccount } from '../types';
import { usePwaInstall } from '../lib/usePwaInstall';
import { PwaIosModal } from './PwaIosModal';

export type TabType = AppNavView;

interface NavigationSidebarProps {
  activeTab?: AppNavView;
  currentView?: AppNavView;
  onSelectTab?: (tab: AppNavView) => void;
  onSelectView?: (view: AppNavView) => void;
  ticketCount?: number;
  orderCount?: number;
  customerCount?: number;
  scannerCount?: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenCommandPalette?: () => void;
  customLogoUrl?: string;
  mobileNavOpen?: boolean;
  onCloseMobileNav?: () => void;
  isSuperAdmin?: boolean;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  onOpenSuperAdminModal?: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  items: {
    id: AppNavView;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
  }[];
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  currentView,
  onSelectTab,
  onSelectView,
  ticketCount = 7,
  orderCount = 7,
  customerCount = 6,
  scannerCount = 4,
  isCollapsed,
  onToggleCollapse,
  onOpenCommandPalette,
  customLogoUrl,
  mobileNavOpen = false,
  onCloseMobileNav,
  isSuperAdmin = false,
  currentUser,
  onLogout,
  onOpenSuperAdminModal,
}) => {
  const selectedView = activeTab || currentView || 'dashboard';
  const { isInstalled, triggerInstall, showIosInstructions, closeIosInstructions } = usePwaInstall();

  const handleSelect = (view: AppNavView) => {
    if (onSelectTab) onSelectTab(view);
    if (onSelectView) onSelectView(view);
    if (onCloseMobileNav) onCloseMobileNav();
  };

  // Remember expanded groups in localStorage
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('courtside_nav_expanded_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      main: true,
      ops: true,
      hardware: true,
      analytics: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('courtside_nav_expanded_v1', JSON.stringify(expandedGroups));
  }, [expandedGroups]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'main',
      label: 'Main Navigation',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'events', label: 'Create Event / Events', icon: Calendar, badge: 'Live' },
        { id: 'scanners', label: 'Gate Scanner', icon: QrCode, badge: `${scannerCount} Online` },
        { id: 'tickets', label: 'Passes & Tickets', icon: Ticket, badge: ticketCount },
        { id: 'orders', label: 'Orders & Sales', icon: ShoppingBag, badge: orderCount },
        { id: 'customers', label: 'Guests & Holders', icon: Users, badge: customerCount },
      ],
    },
    {
      id: 'analytics',
      label: 'Admin & Operations',
      items: [
        ...(isSuperAdmin
          ? [
              { id: 'users' as AppNavView, label: 'Users & Passcodes', icon: KeyRound, badge: 'Admin' },
              { id: 'settings' as AppNavView, label: 'Settings', icon: Settings, badge: 'Admin' },
            ]
          : []),
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        { id: 'help', label: 'Help & Shortcuts', icon: HelpCircle },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobileNav}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 h-screen bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/80 transition-all duration-300 flex flex-col shrink-0 ${
          mobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between gap-3">
          {!isCollapsed && (
            <div
              onClick={() => handleSelect('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              {customLogoUrl ? (
                <img src={customLogoUrl} alt="Logo" className="h-8 w-auto object-contain rounded-md" />
              ) : (
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center font-heading font-extrabold text-white text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  CS
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-sm tracking-wider text-white">
                    COURTSIDE
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono text-[9px] font-bold">
                    LR
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Digital Pass Suite</p>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div
              onClick={() => handleSelect('dashboard')}
              className="h-10 w-10 mx-auto rounded-xl bg-gradient-to-br from-blue-600 to-red-600 flex items-center justify-center font-heading font-extrabold text-white text-xl shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              CS
            </div>
          )}

          <div className="flex items-center gap-1">
            {/* Desktop collapse toggle */}
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors hidden md:flex items-center justify-center"
              title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
            >
              {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            {/* Mobile Close Button */}
            {onCloseMobileNav && (
              <button
                onClick={onCloseMobileNav}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 md:hidden flex items-center justify-center"
                title="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Global Quick Search trigger inside sidebar */}
        <div className="p-3 border-b border-slate-800/50">
          <button
            onClick={() => {
              if (onOpenCommandPalette) onOpenCommandPalette();
              if (onCloseMobileNav) onCloseMobileNav();
            }}
            className={`w-full py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-left text-xs text-slate-400 flex items-center justify-between group transition-all shadow-inner ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Quick Search (Cmd+K)"
          >
            <div className="flex items-center gap-2">
              <Command className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="font-medium text-slate-300">Quick Search...</span>}
            </div>
            {!isCollapsed && (
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">
                ⌘K
              </kbd>
            )}
          </button>
        </div>

        {/* Nav Groups List */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4 custom-scrollbar">
          {navGroups.map((group) => {
            const isExpanded = expandedGroups[group.id] !== false;

            return (
              <div key={group.id} className="space-y-1">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 flex items-center justify-between group"
                  >
                    <span>{group.label}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                )}

                {(isExpanded || isCollapsed) &&
                  group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = selectedView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.id)}
                        className={`w-full px-3 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all group ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/20 to-blue-600/10 text-blue-300 border border-blue-500/30 shadow-md shadow-blue-500/5'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
                        } ${isCollapsed ? 'justify-center px-0' : ''}`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                              isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          />
                          {!isCollapsed && <span className="truncate">{item.label}</span>}
                        </div>

                        {!isCollapsed && item.badge !== undefined && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              isActive
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                : 'bg-slate-800 text-slate-400 border border-slate-700/80'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            );
          })}
        </div>

        {/* User / Org Bottom Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div
                onClick={onOpenSuperAdminModal}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                  isSuperAdmin
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-xs ${
                    isSuperAdmin
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                  }`}>
                    {isSuperAdmin ? '👑' : '👤'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {currentUser?.name || (isSuperAdmin ? 'Super Admin / Owner' : 'Signed In User')}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate font-mono">
                      {currentUser?.role?.replace('_', ' ').toUpperCase() || 'EVENT ORGANIZER'}
                    </p>
                  </div>
                </div>
                <Sparkles className={`w-3.5 h-3.5 shrink-0 ${isSuperAdmin ? 'text-emerald-400' : 'text-blue-400'}`} />
              </div>

              {!isInstalled && (
                <button
                  type="button"
                  onClick={triggerInstall}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-blue-500/20"
                  title="Install Courtside Pass App on device"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>📱 Install App (PWA)</span>
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-extrabold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
                  title="Lock session & return to PIN login screen"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Lock / Sign Out</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2 text-center">
              <div
                onClick={onOpenSuperAdminModal}
                className={`w-8 h-8 mx-auto rounded-lg border flex items-center justify-center font-bold text-xs cursor-pointer ${
                  isSuperAdmin
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                }`}
                title={currentUser?.name || 'Active User'}
              >
                {isSuperAdmin ? '👑' : '👤'}
              </div>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-8 h-8 mx-auto rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 flex items-center justify-center transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </aside>
      <PwaIosModal isOpen={showIosInstructions} onClose={closeIosInstructions} />
    </>
  );
};
