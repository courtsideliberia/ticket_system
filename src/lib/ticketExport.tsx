import React from 'react';
import { createRoot } from 'react-dom/client';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { PassTicket } from '../types';
import { TicketRenderer } from '../components/TicketRenderer';

export async function exportPassToCanvasImage(
  ticket: PassTicket,
  format: 'png' | 'pdf' = 'png',
  filename?: string
): Promise<string> {
  const isLandscape = ticket.passType !== 'staff_badge';
  const width = isLandscape ? 1400 : 600;
  const height = isLandscape ? 600 : 1000;

  // Create fixed offscreen container with exact 1400px x 600px dimensions
  const container = document.createElement('div');
  container.id = `export-canvas-container-${Date.now()}`;
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  container.style.minWidth = `${width}px`;
  container.style.minHeight = `${height}px`;
  container.style.maxWidth = `${width}px`;
  container.style.maxHeight = `${height}px`;
  container.style.boxSizing = 'border-box';
  container.style.overflow = 'hidden';
  container.style.backgroundColor = '#020617';
  container.style.zIndex = '-9999';
  document.body.appendChild(container);

  // Render TicketRenderer in export mode
  const root = createRoot(container);

  await new Promise<void>((resolve) => {
    root.render(
      <React.StrictMode>
        <TicketRenderer ticket={ticket} isExport={true} showStub={true} />
      </React.StrictMode>
    );
    // Allow paint, font rendering, and QR SVG to settle
    setTimeout(resolve, 350);
  });

  const targetNode = (container.firstElementChild || container) as HTMLElement;

  // Warm-up pass + capture pass for html-to-image
  await toPng(targetNode, {
    pixelRatio: 2,
    cacheBust: true,
    width,
    height,
    backgroundColor: '#020617',
  });

  const dataUrl = await toPng(targetNode, {
    pixelRatio: 2,
    cacheBust: true,
    width,
    height,
    backgroundColor: '#020617',
  });

  // Clean up React root and DOM node
  setTimeout(() => {
    root.unmount();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 100);

  const defaultName = filename || `Courtside_Pass_${ticket.ticketCode.replace(/[^a-zA-Z0-9-_]/g, '_')}`;

  if (format === 'png') {
    const link = document.createElement('a');
    link.download = defaultName.endsWith('.png') ? defaultName : `${defaultName}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (format === 'pdf') {
    // Single landscape page PDF matching 1400x600 aspect ratio (7:3) at 300 DPI (7in x 3in)
    const widthIn = isLandscape ? 7 : 3.5;
    const heightIn = isLandscape ? 3 : 5.8;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'in',
      format: [widthIn, heightIn],
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, widthIn, heightIn, undefined, 'FAST');
    pdf.save(defaultName.endsWith('.pdf') ? defaultName : `${defaultName}.pdf`);
  }

  return dataUrl;
}

export async function captureTicketPng(
  target: HTMLElement | PassTicket
): Promise<{ dataUrl: string; widthPx: number; heightPx: number }> {
  if ('ticketCode' in target) {
    const dataUrl = await exportPassToCanvasImage(target as PassTicket, 'png');
    return { dataUrl, widthPx: 1400, heightPx: 600 };
  }
  const node = target as HTMLElement;
  const jsonAttr = node.getAttribute('data-ticket-json');
  if (jsonAttr) {
    try {
      const ticketObj = JSON.parse(jsonAttr);
      const dataUrl = await exportPassToCanvasImage(ticketObj, 'png');
      return { dataUrl, widthPx: 1400, heightPx: 600 };
    } catch {
      // ignore
    }
  }
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
  const rect = node.getBoundingClientRect();
  return { dataUrl, widthPx: rect.width * 2, heightPx: rect.height * 2 };
}

export async function downloadTicketPng(
  target: HTMLElement | PassTicket | null,
  filename = 'ticket.png',
  fallbackTicket?: PassTicket
): Promise<void> {
  if (!target && !fallbackTicket) return;
  const ticketObj = (target && 'ticketCode' in target) ? (target as PassTicket) : fallbackTicket;

  if (ticketObj) {
    await exportPassToCanvasImage(ticketObj, 'png', filename);
    return;
  }

  const node = target as HTMLElement | null;
  if (node) {
    const jsonAttr = node.getAttribute('data-ticket-json');
    if (jsonAttr) {
      try {
        const parsed = JSON.parse(jsonAttr);
        await exportPassToCanvasImage(parsed, 'png', filename);
        return;
      } catch {
        // fallback to node capture
      }
    }
    const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
    const link = document.createElement('a');
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export async function downloadTicketPdf(
  target: HTMLElement | PassTicket | null,
  filename = 'ticket.pdf',
  fallbackTicket?: PassTicket
): Promise<void> {
  if (!target && !fallbackTicket) return;
  const ticketObj = (target && 'ticketCode' in target) ? (target as PassTicket) : fallbackTicket;

  if (ticketObj) {
    await exportPassToCanvasImage(ticketObj, 'pdf', filename);
    return;
  }

  const node = target as HTMLElement | null;
  if (node) {
    const jsonAttr = node.getAttribute('data-ticket-json');
    if (jsonAttr) {
      try {
        const parsed = JSON.parse(jsonAttr);
        await exportPassToCanvasImage(parsed, 'pdf', filename);
        return;
      } catch {
        // fallback
      }
    }
    const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'in',
      format: [7, 3],
    });
    pdf.addImage(dataUrl, 'PNG', 0, 0, 7, 3, undefined, 'FAST');
    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  }
}
