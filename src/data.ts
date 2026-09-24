import { MenuItem, MenuCategory, DeliveryZone } from './types';
import { RESTAURANT_CONFIG } from './config/restaurant';
import { MENU_ITEMS, MENU_CATEGORIES, DEFAULT_DRINK_UPSELL } from './data/menu';
import { DELIVERY_ZONES, DEFAULT_DELIVERY_ZONES, DEFAULT_DELIVERY_ZONE_ID, getDeliveryZone } from './config/delivery';

export { 
  RESTAURANT_CONFIG, 
  MENU_ITEMS, 
  MENU_CATEGORIES, 
  DEFAULT_DRINK_UPSELL,
  DELIVERY_ZONES,
  DEFAULT_DELIVERY_ZONES,
  DEFAULT_DELIVERY_ZONE_ID,
  getDeliveryZone
};

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

export type Neighborhood = DeliveryZone;

export const MAPUTO_NEIGHBORHOODS: Neighborhood[] = DELIVERY_ZONES;
