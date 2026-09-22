import { MenuItem, MenuCategory } from './types';
import { RESTAURANT_CONFIG } from './config/restaurant';
import { MENU_ITEMS, MENU_CATEGORIES, DEFAULT_DRINK_UPSELL } from './data/menu';

export { RESTAURANT_CONFIG, MENU_ITEMS, MENU_CATEGORIES, DEFAULT_DRINK_UPSELL };

export const RESTAURANT_INFO = {
  name: RESTAURANT_CONFIG.name,
  tagline: RESTAURANT_CONFIG.tagline,
  address: RESTAURANT_CONFIG.address,
  estimatedDeliveryTime: RESTAURANT_CONFIG.estimatedDeliveryTime,
  deliveryFee: RESTAURANT_CONFIG.deliveryFee,
  pickupFee: RESTAURANT_CONFIG.pickupFee,
  phone: RESTAURANT_CONFIG.contact.phoneDisplay,
  whatsappNumber: RESTAURANT_CONFIG.contact.whatsappNumber,
  whatsappUrl: `https://wa.me/${RESTAURANT_CONFIG.contact.whatsappNumber}`,
  paymentNumber: RESTAURANT_CONFIG.payment.number,
  paymentAccountName: RESTAURANT_CONFIG.payment.accountName
};

export const formatPrice = (val: number): string => `${val} ${RESTAURANT_CONFIG.currency}`;

export interface Neighborhood {
  id: string;
  name: string;
  fee: number;
}

export const MAPUTO_NEIGHBORHOODS: Neighborhood[] = [
  { id: "polana-cimento", name: "Polana Cimento", fee: 120 },
  { id: "sommerschield", name: "Sommerschield", fee: 130 },
  { id: "sommerschield-2", name: "Sommerschield 2", fee: 150 },
  { id: "bairro-central", name: "Bairro Central", fee: 120 },
  { id: "malhangalene", name: "Malhangalene", fee: 140 },
  { id: "alto-mae", name: "Alto Maé", fee: 140 },
  { id: "coop", name: "Coop", fee: 130 },
  { id: "maxaquene", name: "Maxaquene", fee: 150 },
  { id: "triunfo", name: "Triunfo", fee: 180 },
  { id: "costa-do-sol", name: "Costa do Sol", fee: 200 },
  { id: "zimpeto", name: "Zimpeto", fee: 250 },
  { id: "matola", name: "Matola (Cidade)", fee: 280 },
  { id: "outro", name: "Outro Bairro (Sob Consulta)", fee: 150 }
];
