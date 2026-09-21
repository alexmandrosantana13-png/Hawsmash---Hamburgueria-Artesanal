export type MeatType = 'HAW' | 'WAGYU';
export type DeliveryMode = 'delivery' | 'pickup' | 'yango';

export interface MenuItem {
  id: string;
  name: string;
  category: 'burgers' | 'sides' | 'desserts' | 'drinks';
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
