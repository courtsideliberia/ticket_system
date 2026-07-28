export type CurrencyCode = 'USD' | 'LRD';

/**
 * Formats amount with currency suffix, e.g., "$35 USD" or "L$7,000 LRD"
 */
export function formatCurrency(amount: number | undefined | null, currency: string = 'USD'): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const code = (currency || 'USD').toUpperCase();
  const formatted = val.toLocaleString('en-US');
  if (code === 'LRD') {
    return `L$${formatted} LRD`;
  }
  return `$${formatted} USD`;
}

/**
 * Short formatting, e.g., "$35" or "L$7,000" or "FREE PASS"
 */
export function formatPriceShort(amount: number | undefined | null, currency: string = 'USD'): string {
  const val = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  if (val === 0) return 'FREE PASS';
  const code = (currency || 'USD').toUpperCase();
  const formatted = val.toLocaleString('en-US');
  if (code === 'LRD') {
    return `L$${formatted}`;
  }
  return `$${formatted}`;
}

/**
 * Formats combined totals from a list of items with price/totalAmount + currency
 * e.g. "$1,250 USD + L$ 50,000 LRD"
 */
export function formatRevenueSummary(
  items: Array<{ price?: number; totalAmount?: number; currency?: string; status?: string }>
): string {
  let usdTotal = 0;
  let lrdTotal = 0;

  items.forEach((item) => {
    if (item.status !== 'refunded' && item.status !== 'revoked' && item.status !== 'cancelled') {
      const amount = typeof item.price === 'number' ? item.price : (typeof item.totalAmount === 'number' ? item.totalAmount : 0);
      const code = (item.currency || 'USD').toUpperCase();
      if (code === 'LRD') {
        lrdTotal += amount;
      } else {
        usdTotal += amount;
      }
    }
  });

  const parts: string[] = [];
  if (usdTotal > 0 || lrdTotal === 0) {
    parts.push(`$${usdTotal.toLocaleString('en-US')} USD`);
  }
  if (lrdTotal > 0) {
    parts.push(`L$${lrdTotal.toLocaleString('en-US')} LRD`);
  }
  return parts.join(' + ');
}
