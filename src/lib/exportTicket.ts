import { downloadTicketPng, downloadTicketPdf, exportPassToCanvasImage } from './ticketExport';

export async function captureNodePng(node: HTMLElement, pixelRatio = 2, backgroundColor?: string) {
  const jsonAttr = node.getAttribute('data-ticket-json');
  if (jsonAttr) {
    try {
      const ticket = JSON.parse(jsonAttr);
      return await exportPassToCanvasImage(ticket, 'png');
    } catch {
      // fallback
    }
  }
  return '';
}

export async function downloadPng(node: HTMLElement, filename: string, backgroundColor?: string) {
  await downloadTicketPng(node, filename);
}

export interface PdfExportOptions {
  widthIn: number;
  heightIn: number;
  backgroundColor?: string;
}

export async function downloadPdf(node: HTMLElement, filename: string, opts?: PdfExportOptions) {
  await downloadTicketPdf(node, filename);
}

export function getPhysicalSizeIn(passType: 'ticket' | 'staff_badge' | 'qr_only', orientation?: 'portrait' | 'landscape') {
  if (passType === 'staff_badge') return { widthIn: 3.5, heightIn: 5.8 };
  if (passType === 'qr_only') return { widthIn: 4, heightIn: 4 };
  return orientation === 'portrait' ? { widthIn: 3.5, heightIn: 5.8 } : { widthIn: 7, heightIn: 3 };
}
