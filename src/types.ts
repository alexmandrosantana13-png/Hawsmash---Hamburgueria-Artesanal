export type MeatType = 'HAW' | 'WAGYU';
export type DeliveryMode = 'delivery' | 'pickup' | 'yango';

export type MenuCategoryId = 'burgers' | 'sides' | 'desserts' | 'drinks';

export interface MenuCategory {
  id: string;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategoryId | string;
  description: string;
  image: string;
  supportsMeatChoice: boolean;
  prices?: {
    HAW: number;
    WAGYU: number;
  };
  price?: number;
  badge?: string;
}

export interface CartItem {
  id: string;
  name: string;
  supportsMeatChoice: boolean;
  meatChoice: MeatType | null;
  unitPrice: number;
  quantity: number;
  image?: string;
  observation?: string;
  notes?: string;
}

export interface RestaurantPaymentConfig {
  number: string;
  accountName: string;
  acceptedMethods?: string[];
}

export interface RestaurantLogoConfig {
  type: 'text' | 'image';
  textPrimary?: string;
  textSecondary?: string;
  imageUrl?: string;
  altText?: string;
}

export interface RestaurantOpeningHours {
  display: string;
  shortDisplay: string;
  isOpenNowText?: string;
  isOpenNowShortText?: string;
}

export interface RestaurantContactConfig {
  phoneDisplay: string;
  whatsappNumber: string;
}

export interface RestaurantSocialConfig {
  instagram?: string;
  facebook?: string;
}

export interface RestaurantConfig {
  id: string;
  name: string;
  shortName?: string;
  tagline: string;
  description: string;
  motto?: string;
  address: string;
  city: string;
  country: string;
  currency: string;
  currencySymbol?: string;
  logo: RestaurantLogoConfig;
  contact: RestaurantContactConfig;
  social?: RestaurantSocialConfig;
  openingHours: RestaurantOpeningHours;
  estimatedDeliveryTime: string;
  deliveryFee: number;
  deliveryFeeMinDisplay: string;
  pickupFee: number;
  payment: RestaurantPaymentConfig;
}

export interface AgencyConfig {
  name: string;
  phoneDisplay: string;
  whatsappNumber: string;
}

