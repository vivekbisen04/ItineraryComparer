import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currency = 'INR') {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  return `${symbols[currency] || ''}${amount.toLocaleString()}`;
}

export function formatDuration(nights, days) {
  return `${nights}N / ${days}D`;
}

export function parseNumberFromString(str) {
  if (!str) return 0;
  // Remove currency symbols and commas, extract number
  const match = str.toString().match(/[\d,]+/);
  if (match) {
    return parseInt(match[0].replace(/,/g, ''), 10);
  }
  return 0;
}

export function detectCurrency(text) {
  const symbols = { '₹': 'INR', '$': 'USD', '€': 'EUR', '£': 'GBP' };
  for (const [symbol, code] of Object.entries(symbols)) {
    if (text.includes(symbol)) return code;
  }
  return 'INR'; // default
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
