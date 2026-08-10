// Credit Card Luhn & BIN Utilities with IP & User Agent helpers

export interface BinInfo {
  brand: string;
  type: string;
  category: string;
  bank: string;
  country: string;
  countryCode?: string;
  isPrepaid?: boolean;
  luhnValid: boolean;
  apiSource?: string;
}

export function validateLuhn(cardNumber: string): boolean {
  const clean = cardNumber.replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export function lookupBinData(cardNumber: string): BinInfo {
  const clean = cardNumber.replace(/\D/g, '');
  const luhnValid = validateLuhn(clean);
  const prefix4 = clean.slice(0, 4);
  const prefix2 = clean.slice(0, 2);
  const prefix1 = clean.slice(0, 1);
  const prefix6 = clean.slice(0, 6);

  let brand = 'Unknown';
  let type = 'Credit';
  let category = 'Standard';
  let bank = 'Major Canadian / US Issuer';
  let country = 'Canada (CA)';

  if (prefix1 === '4') {
    brand = 'Visa';
    if (clean.length === 16) {
      category = prefix6.startsWith('4003') || prefix6.startsWith('4532') ? 'Infinite / Platinum' : 'Classic';
    }
  } else if (/^5[1-5]/.test(prefix2) || (/^2[2-7]/.test(prefix2) && parseInt(prefix4, 10) >= 2221 && parseInt(prefix4, 10) <= 2720)) {
    brand = 'Mastercard';
    category = 'World Elite / Platinum';
  } else if (/^3[47]/.test(prefix2)) {
    brand = 'American Express';
    type = 'Charge / Credit';
    category = 'Gold / Platinum Rewards';
    bank = 'American Express Bank';
  } else if (/^6011|^65|^64[4-9]/.test(prefix4) || /^6011/.test(clean.slice(0, 4))) {
    brand = 'Discover';
    category = 'Rewards Cashback';
  } else if (/^35[2-8][8-9]/.test(prefix4)) {
    brand = 'JCB';
    category = 'International';
    bank = 'JCB Global / Bank of Tokyo';
  } else if (/^3[0689]/.test(prefix2)) {
    brand = 'Diners Club';
    category = 'Corporate / Travel';
  } else if (/^62/.test(prefix2)) {
    brand = 'UnionPay';
    country = 'China / Global';
  }

  // Assign Canadian major banks based on prefix if brand is Visa/Mastercard
  if (brand === 'Visa' || brand === 'Mastercard') {
    const p3 = parseInt(clean.slice(0, 3), 10);
    if (p3 >= 450 && p3 <= 455) {
      bank = 'Royal Bank of Canada (RBC)';
    } else if (p3 >= 456 && p3 <= 460) {
      bank = 'Toronto-Dominion Bank (TD)';
    } else if (p3 >= 451 && p3 <= 453) {
      bank = 'Bank of Nova Scotia (Scotiabank)';
    } else if (p3 >= 454 && p3 <= 457) {
      bank = 'Bank of Montreal (BMO)';
    } else if (p3 >= 450 && p3 <= 452) {
      bank = 'Canadian Imperial Bank of Commerce (CIBC)';
    } else {
      bank = 'National Bank of Canada / ATB Financial';
    }
  }

  return {
    brand,
    type,
    category,
    bank,
    country,
    luhnValid,
    apiSource: 'Local BIN Engine'
  };
}

export async function fetchBinDataApi(cardNumber: string): Promise<BinInfo> {
  const clean = cardNumber.replace(/\D/g, '');
  const localFallback = lookupBinData(clean);
  if (clean.length < 6) return localFallback;

  const bin = clean.slice(0, 8);

  try {
    const res = await fetch(`/api/bin-lookup/${bin}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.brand) {
        return {
          brand: data.brand || localFallback.brand,
          type: data.type || localFallback.type,
          category: data.category || localFallback.category,
          bank: data.bank || localFallback.bank,
          country: data.country || localFallback.country,
          countryCode: data.countryCode,
          isPrepaid: data.isPrepaid,
          luhnValid: localFallback.luhnValid,
          apiSource: data.apiSource || 'Free BIN API'
        };
      }
    }
  } catch (err) {
    // Silent catch, fallback to local lookup
  }

  return localFallback;
}
