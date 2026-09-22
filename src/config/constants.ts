import { RESTAURANT_CONFIG, AGENCY_CONFIG } from './restaurant';

export { RESTAURANT_CONFIG, AGENCY_CONFIG };

export const STORE_CONFIG = {
  name: RESTAURANT_CONFIG.name,
  phoneDisplay: RESTAURANT_CONFIG.contact.phoneDisplay,
  phoneWhatsapp: RESTAURANT_CONFIG.contact.whatsappNumber,
  paymentNumber: RESTAURANT_CONFIG.payment.number,
  paymentAccountName: RESTAURANT_CONFIG.payment.accountName,
};

export const getWhatsAppUrl = (customMessage?: string): string => {
  const base = `https://wa.me/${RESTAURANT_CONFIG.contact.whatsappNumber}`;
  if (!customMessage) return base;
  return `${base}?text=${encodeURIComponent(customMessage)}`;
};
