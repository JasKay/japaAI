// lib/currency.ts
// Currency conversion for displaying costs in user's home country

export const CURRENCY_BY_COUNTRY: Record<string, { code: string; symbol: string; name: string }> = {
  Nigeria: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  Ghana: { code: 'GHS', symbol: '₵', name: 'Ghanaian Cedi' },
  Kenya: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  'South Africa': { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  India: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  Pakistan: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  Bangladesh: { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
  Mexico: { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  Brazil: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  Philippines: { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  UK: { code: 'GBP', symbol: '£', name: 'British Pound' },
  USA: { code: 'USD', symbol: '$', name: 'US Dollar' },
  Canada: { code: 'CAD', symbol: 'CAD $', name: 'Canadian Dollar' },
  Australia: { code: 'AUD', symbol: 'AUD $', name: 'Australian Dollar' },
  Germany: { code: 'EUR', symbol: '€', name: 'Euro' },
}

// Approximate exchange rates (GBP as base)
export const EXCHANGE_RATES: Record<string, number> = {
  GBP: 1.0, // Base currency
  NGN: 800, // 1 GBP = ~800 NGN (approximate, real-time better)
  GHS: 13, // 1 GBP = ~13 GHS
  KES: 170, // 1 GBP = ~170 KES
  ZAR: 23, // 1 GBP = ~23 ZAR
  INR: 105, // 1 GBP = ~105 INR
  PKR: 345, // 1 GBP = ~345 PKR
  BDT: 135, // 1 GBP = ~135 BDT
  MXN: 21, // 1 GBP = ~21 MXN
  BRL: 6.5, // 1 GBP = ~6.5 BRL
  PHP: 73, // 1 GBP = ~73 PHP
  USD: 1.27, // 1 GBP = ~1.27 USD
  CAD: 1.73, // 1 GBP = ~1.73 CAD
  AUD: 1.95, // 1 GBP = ~1.95 AUD
  EUR: 0.87, // 1 GBP = ~0.87 EUR
}

export function convertGBPToHomeCountry(amountGBP: number, homeCountry: string): { amount: number; currency: string; formatted: string } {
  const currency = CURRENCY_BY_COUNTRY[homeCountry]
  if (!currency) {
    return { amount: amountGBP, currency: 'GBP', formatted: `£${amountGBP.toLocaleString()}` }
  }

  const rate = EXCHANGE_RATES[currency.code]
  if (!rate) {
    return { amount: amountGBP, currency: 'GBP', formatted: `£${amountGBP.toLocaleString()}` }
  }

  const convertedAmount = amountGBP * rate
  const formatted = `${currency.symbol}${Math.round(convertedAmount).toLocaleString()}`
  
  return { amount: convertedAmount, currency: currency.code, formatted }
}

export function getCurrencyForCountry(homeCountry: string) {
  return CURRENCY_BY_COUNTRY[homeCountry] || { code: 'GBP', symbol: '£', name: 'British Pound' }
}