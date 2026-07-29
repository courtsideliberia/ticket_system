import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

const DPI = 300;

/** Warm-up + real capture pass — avoids blank/partial exports on first render
 *  (fonts/QR canvas sometimes aren't fully painted on the very first snapshot). */
export async function captureNodePng(node: HTMLElement, pixelRatio = 2, backgroundColor?: string) {
  await toPng(node, { pixelRatio, cacheBust: true, backgroundColor });
  return toPng(node, { pixelRatio, cacheBust: true, backgroundColor });
}

export async function downloadPng(node: HTMLElement, filename: string, backgroundColor?: string) {
  const dataUrl = await captureNodePng(node, 2, backgroundColor);
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

export interface PdfExportOptions {
  /** Physical page size in inches — determines true 300 DPI pixel capture. */
  widthIn: number;
  heightIn: number;
  backgroundColor?: string;
}

/** Exports a DOM node as a single-page PDF at true 300 DPI for the given
 *  physical ticket size (e.g. 8.5in x 3.5in for a landscape ticket stub). */
export async function downloadPdf(node: HTMLElement, filename: string, opts: PdfExportOptions) {
  const targetPxWidth = opts.widthIn * DPI;
  const pixelRatio = Math.max(1, targetPxWidth / (node.offsetWidth || targetPxWidth));
  const dataUrl = await captureNodePng(node, pixelRatio, opts.backgroundColor);

  const pdf = new jsPDF({
    orientation: opts.widthIn >= opts.heightIn ? 'landscape' : 'portrait',
    unit: 'in',
    format: [opts.widthIn, opts.heightIn],
  });
  pdf.addImage(dataUrl, 'PNG', 0, 0, opts.widthIn, opts.heightIn, undefined, 'FAST');
  pdf.save(filename);
}

/** Standard physical dimensions (inches) per pass type/orientation, used so
 *  PDF export always renders at genuine 300 DPI for a real-world ticket size. */
export function getPhysicalSizeIn(passType: 'ticket' | 'staff_badge' | 'qr_only', orientation?: 'portrait' | 'landscape') {
  if (passType === 'staff_badge') return { widthIn: 3.375, heightIn: 5.375 }; // standard ID badge
  if (passType === 'qr_only') return { widthIn: 3.375, heightIn: 3.375 };
  // ticket
  return orientation === 'portrait' ? { widthIn: 4.25, heightIn: 8.5 } : { widthIn: 8.5, heightIn: 4.25 };
}
