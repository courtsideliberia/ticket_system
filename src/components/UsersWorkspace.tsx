import React, { useState } from 'react';
import { UserAccount, UserRole, UserPermissions, EventRecord } from '../types';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Crown, 
  Copy, 
  Check, 
  Trash2, 
  Lock, 
  Edit2, 
  X, 
  Sparkles,
  Calendar,
  Ticket,
  Eye,
  EyeOff,
  Building2,
  ShieldAlert
} from 'lucide-react';

interface UsersWorkspaceProps {
  users: UserAccount[];
  events: EventRecord[];
  currentUser: UserAccount | null;
  isSuperAdmin?: boolean;
  onAddUser: (newUser: UserAccount) => void;
  onUpdateUser: (updatedUser: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
  onOpenSuperAdminModal?: () => void;
  onSelectUserPasscode?: (passcode: string) => void;
}

export const UsersWorkspace: React.FC<UsersWorkspaceProps> = ({
  users,
  events,
  currentUser,
  isSuperAdmin = false,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onOpenSuperAdminModal,
  onSelectUserPasscode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedPasscodeId, setCopiedPasscodeId] = useState<string | null>(null);
  const [revealedPasscodes, setRevealedPasscodes] = useState<Record<string, boolean>>({});

  // Form State for creating/editing user
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('event_organizer');
  const [customPasscode, setCustomPasscode] = useState('');
  const [canCreateEvents, setCanCreateEvents] = useState(true);
  const [canIssueTickets, setCanIssueTickets] = useState(true);
  const [canScanTickets, setCanScanTickets] = useState(true);
  const [canViewReports, setCanViewReports] = useState(true);
  const [canManageUsers, setCanManageUsers] = useState(false);

  // Generate a random unique passcode
  const handleGeneratePasscode = () => {
    const randomPass = Math.floor(100000 + Math.random() * 900000).toString();
    setCustomPasscode(randomPass);
  };

  const handleOpenCreate = () => {
    setName('');
    setEmail('');
    setPhone('');
    setRole('event_organizer');
    setCustomPasscode(Math.floor(100000 + Math.random() * 900000).toString());
    setCanCreateEvents(true);
    setCanIssueTickets(true);
    setCanScanTickets(true);
    setCanViewReports(true);
    setCanManageUsers(false);
    setIsCreateModalOpen(true);
  };

  const handleSubmitNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !customPasscode.trim()) {
      alert('Please provide a Name, Email, and Unique Passcode.');
      return;
    }

    // Check for passcode uniqueness
    const passcodeExists = users.some((u) => u.passcode === customPasscode.trim());
    if (passcodeExists) {
      alert(`Passcode ${customPasscode} is already assigned to another user! Please generate or assign a unique passcode.`);
      return;
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      role,
      passcode: customPasscode.trim(),
      status: 'active',
      createdBy: currentUser?.name || (isSuperAdmin ? 'Owner / Super Admin' : 'System Admin'),
      createdAt: new Date().toISOString(),
      permissions: {
        canCreateEvents,
        canIssueTickets,
        canScanTickets,
        canViewReports,
        canManageUsers,
      },
    };

    onAddUser(newUser);
    setIsCreateModalOpen(false);
  };

  const handleCopyPasscode = (passcode: string, userId: string) => {
    navigator.clipboard.writeText(passcode);
    setCopiedPasscodeId(userId);
    setTimeout(() => setCopiedPasscodeId(null), 2000);
  };

  const toggleRevealPasscode = (userId: string) => {
    setRevealedPasscodes((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.passcode.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'event_organizer':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'ticket_issuer':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'gate_agent':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'financial_auditor':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Controls Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" /> User & Passcode Access Portal ({users.length})
          </h2>
          <p className="text-xs text-slate-400">
            Create organizers, assign unique passcodes, and control event permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isSuperAdmin && (
            <button
              onClick={onOpenSuperAdminModal}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-blue-400 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <Crown className="w-4 h-4 text-blue-400" /> Sign In 004455
            </button>
          )}

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-2 uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Create New User
          </button>
        </div>
      </div>

      {/* Super Admin Info Banner */}
      {isSuperAdmin && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/40 shrink-0">
              <Crown className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-bold text-white font-heading">
                Owner / Super Admin Master Mode Active (Code 004455)
              </p>
              <p className="text-xs text-slate-300">
                You can create multiple event organizers, generate custom passcodes for each user, and oversee all tickets.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
            Full Controls
          </span>
        </div>
      )}

      {/* Search & Role Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users, email, passcode..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 focus:outline-none focus:border-blue-500/50"
        >
          <option value="all">All User Roles</option>
          <option value="super_admin">Super Admin / Owner</option>
          <option value="event_organizer">Event Organizer</option>
          <option value="ticket_issuer">Ticket Agent</option>
          <option value="gate_agent">Gate Agent</option>
          <option value="financial_auditor">Financial Auditor</option>
        </select>
      </div>

      {/* Users Grid Card Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const isRevealed = revealedPasscodes[user.id];
          const isCopied = copiedPasscodeId === user.id;

          return (
            <div
              key={user.id}
              className={`p-5 rounded-2xl bg-slate-900/90 border transition-all space-y-4 flex flex-col justify-between ${
                user.role === 'super_admin'
                  ? 'border-purple-500/40 shadow-lg shadow-purple-500/5'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* User Card Top */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      user.role === 'super_admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                    }`}>
                      {user.role === 'super_admin' ? '👑' : user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm font-heading flex items-center gap-1.5">
                        {user.name}
                      </h3>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getRoleBadge(user.role)}`}>
                    {user.role.replace('_', ' ')}
                  </span>
                </div>

                {/* Passcode Box */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-blue-400" /> Assigned Passcode:
                    </span>
                    <button
                      onClick={() => toggleRevealPasscode(user.id)}
                      className="text-slate-500 hover:text-slate-300 text-[10px] flex items-center gap-1"
                    >
                      {isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {isRevealed ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    <span className="font-mono text-sm font-bold text-blue-400 tracking-wider">
                      {isRevealed ? user.passcode : '••••••'}
                    </span>
                    <button
                      onClick={() => handleCopyPasscode(user.passcode, user.id)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 flex items-center gap-1 transition-colors"
                      title="Copy passcode to clipboard"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Permissions Indicators */}
                <div className="space-y-1 text-[11px]">
                  <p className="text-slate-500 uppercase font-bold text-[9px] tracking-wider">Granted Capabilities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.permissions.canCreateEvents && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-medium border border-blue-500/20">
                        Create Events
                      </span>
                    )}
                    {user.permissions.canIssueTickets && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-medium border border-emerald-500/20">
                        Issue Passes
                      </span>
                    )}
                    {user.permissions.canScanTickets && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] font-medium border border-amber-500/20">
                        Gate Scanner
                      </span>
                    )}
                    {user.permissions.canViewReports && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-medium border border-purple-500/20">
                        Audit Reports
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Card Bottom Controls */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500">
                  Created by <span className="text-slate-400 font-medium">{user.createdBy}</span>
                </span>

                {user.role !== 'super_admin' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        const updated = {
                          ...user,
                          status: (user.status === 'active' ? 'suspended' : 'active') as 'active' | 'suspended',
                        };
                        onUpdateUser(updated);
                      }}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
                        user.status === 'active'
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}
                    >
                      {user.status === 'active' ? 'Active' : 'Suspended'}
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete user account "${user.name}"?`)) {
                          onDeleteUser(user.id);
                        }
                      }}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete User Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CREATE USER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading uppercase tracking-wider">
                    Create User & Assign Unique Passcode
                  </h3>
                  <p className="text-xs text-slate-400">Generate a custom login passcode for the user</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitNewUser} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  User Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Marcus Cooper"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="organizer@lba.lr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+231 88 123 456"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Assigned User Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="event_organizer">Event Organizer (Can create events & issue passes)</option>
                  <option value="ticket_issuer">Ticket Agent / Issuer (Can issue & manage passes)</option>
                  <option value="gate_agent">Gate Agent (Can scan QR codes at venue gates)</option>
                  <option value="financial_auditor">Financial Auditor (Can view sales & export reports)</option>
                </select>
              </div>

              {/* Unique Passcode Section */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4" /> Assigned Unique Passcode
                  </label>
                  <button
                    type="button"
                    onClick={handleGeneratePasscode}
                    className="text-[11px] font-bold text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Auto-Generate
                  </button>
                </div>

                <input
                  type="text"
                  required
                  value={customPasscode}
                  onChange={(e) => setCustomPasscode(e.target.value)}
                  placeholder="e.g. 112233"
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-500 text-center">
                  This user will sign in with this passcode to access their events & features.
                </p>
              </div>

              {/* Checkbox Permissions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Custom Feature Permissions
                </label>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canCreateEvents}
                      onChange={(e) => setCanCreateEvents(e.target.checked)}
                      className="rounded text-blue-500 focus:ring-0"
                    />
                    <span className="text-slate-300 font-medium">Create Events</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canIssueTickets}
                      onChange={(e) => setCanIssueTickets(e.target.checked)}
                      className="rounded text-blue-500 focus:ring-0"
                    />
                    <span className="text-slate-300 font-medium">Issue Passes</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canScanTickets}
                      onChange={(e) => setCanScanTickets(e.target.checked)}
                      className="rounded text-blue-500 focus:ring-0"
                    />
                    <span className="text-slate-300 font-medium">Gate Scanner</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={canViewReports}
                      onChange={(e) => setCanViewReports(e.target.checked)}
                      className="rounded text-blue-500 focus:ring-0"
                    />
                    <span className="text-slate-300 font-medium">View Reports</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Save User & Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
