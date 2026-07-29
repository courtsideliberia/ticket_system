import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
/ Exports an HTML ticket element to a high-resolution 300 DPI PNG image
*/
export async function exportTicketToPNG(elementId: string, filename = 'ticket.png'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PNG export.`);
  }

  // Scale of 3 to 4 produces ~300 DPI razor-sharp image output
  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  });

  const image = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.href = image;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
/ Exports an HTML ticket element to a high-resolution 300 DPI PDF document
*/
export async function exportTicketToPDF(elementId: string, filename = 'ticket.pdf', orientation: 'p' | 'l' = 'p'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found for PDF export.`);
  }

  const canvas = await html2canvas(element, {
    scale: 3,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png', 1.0);
  
  // Calculate PDF dimensions (in mm) based on canvas aspect ratio
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  
  const isPortrait = imgHeight >= imgWidth;
  const pdfOrientation = isPortrait ? 'p' : 'l';

  const pdf = new jsPDF({
    orientation: pdfOrientation,
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 15;
  const maxWidth = pageWidth - margin * 2;
  const maxHeight = pageHeight - margin * 2;

  let finalW = maxWidth;
  let finalH = (imgHeight * finalW) / imgWidth;

  if (finalH > maxHeight) {
    finalH = maxHeight;
    finalW = (imgWidth * finalH) / imgHeight;
  }

  const xPos = (pageWidth - finalW) / 2;
  const yPos = (pageHeight - finalH) / 2;

  pdf.addImage(imgData, 'PNG', xPos, yPos, finalW, finalH, undefined, 'FAST');
  pdf.save(filename);
}
