import React from 'react';
import { Building2 } from 'lucide-react';
import { GoogleSheetsSync } from './GoogleSheetsSync';
import { AdminTab } from './AdminTab';
import { PassTicket, EventRecord, OrderRecord, ScannerLog } from '../types';

interface OrganizationWorkspaceProps {
  customLogoUrl?: string;
  onLogoChange: (url: string | undefined) => void;
  onResetDatabase: () => void;
  events: EventRecord[];
  tickets: PassTicket[];
  orders?: OrderRecord[];
  scannerLogs?: ScannerLog[];
  onImportTickets: (imported: PassTicket[]) => void;
  onImportEvents?: (imported: EventRecord[]) => void;
}

export const OrganizationWorkspace: React.FC<OrganizationWorkspaceProps> = ({
  customLogoUrl,
  onLogoChange,
  onResetDatabase,
  events,
  tickets,
  orders = [],
  scannerLogs = [],
  onImportTickets,
  onImportEvents,
}) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" /> Organization & Workspace Settings
          </h2>
          <p className="text-xs text-slate-400">
            Liberia Basketball Association enterprise settings, Google Sheets synchronization, and branding
          </p>
        </div>
      </div>

      {/* Google Sheets Sync Integration Section */}
      <section>
        <GoogleSheetsSync
          events={events}
          tickets={tickets}
          orders={orders}
          scannerLogs={scannerLogs}
          onImportTickets={onImportTickets}
          onImportEvents={onImportEvents}
        />
      </section>

      {/* Admin Controls Section */}
      <section>
        <AdminTab customLogoUrl={customLogoUrl} onLogoChange={onLogoChange} onResetDatabase={onResetDatabase} />
      </section>
    </div>
  );
};
