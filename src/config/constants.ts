export const STORE_CONFIG = {
  name: "TrustSmash Demo",
  phoneDisplay: "+258 87 959 0556",
  phoneWhatsapp: "258879590556",
  paymentNumber: "879590556",
  paymentAccountName: "Trust Point Digital",
};

export const getWhatsAppUrl = (customMessage?: string): string => {
  const base = `https://wa.me/${STORE_CONFIG.phoneWhatsapp}`;
  if (!customMessage) return base;
  return `${base}?text=${encodeURIComponent(customMessage)}`;
};
