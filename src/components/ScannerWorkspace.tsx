import React from 'react';
import { PassTicket, ScannerDevice, ScannerLog } from '../types';
import { ScannerTab } from './ScannerTab';

interface ScannerWorkspaceProps {
  scanners: ScannerDevice[];
  tickets: PassTicket[];
  onScanPass: (ticketCode: string, gateName: string) => { success: boolean; ticket?: PassTicket; message: string; code: 'valid' | 'already_used' | 'invalid' | 'revoked' };
  scannerLogs: ScannerLog[];
  onSyncState?: () => Promise<boolean | void>;
}

export const ScannerWorkspace: React.FC<ScannerWorkspaceProps> = ({
  tickets,
  onScanPass,
  scannerLogs,
  onSyncState,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      <ScannerTab tickets={tickets} onScanPass={onScanPass} scannerLogs={scannerLogs} onSyncState={onSyncState} />
    </div>
  );
};
