import { downloadTicketPng, downloadTicketPdf } from '../lib/ticketExport';

/**
 * Exports an HTML ticket element to a high-resolution 300 DPI PNG image
 */
export async function exportTicketToPNG(elementId: string, filename = 'ticket.png'): Promise<void> {
  const element = document.getElementById(elementId);
  if (element) {
    await downloadTicketPng(element, filename);
  } else {
    throw new Error(`Element with id "${elementId}" not found for PNG export.`);
  }
}

/**
 * Exports an HTML ticket element to a high-resolution 300 DPI PDF document
 */
export async function exportTicketToPDF(elementId: string, filename = 'ticket.pdf', orientation: 'p' | 'l' = 'p'): Promise<void> {
  const element = document.getElementById(elementId);
  if (element) {
    await downloadTicketPdf(element, filename);
  } else {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }
}
