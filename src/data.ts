import { MenuItem } from './types';
import { STORE_CONFIG } from './config/constants';

export const RESTAURANT_INFO = {
  name: "HAWSMASH",
  tagline: "Hamburgueria Artesanal • Maputo",
  address: "141 Av. 24 de Julho, Maputo",
  estimatedDeliveryTime: "30–45 minutos",
  deliveryFee: 150,
  pickupFee: 0,
  phone: STORE_CONFIG.phoneDisplay,
  whatsappNumber: STORE_CONFIG.phoneWhatsapp,
  whatsappUrl: `https://wa.me/${STORE_CONFIG.phoneWhatsapp}`,
  paymentNumber: STORE_CONFIG.paymentNumber,
  paymentAccountName: STORE_CONFIG.paymentAccountName
};

export const formatPrice = (val: number): string => `${val} MT`;

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

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "classic-smash",
    name: "Classic Smash",
    category: "burgers",
    description: "Pão Brioche • Carne Smash Suculenta • Queijo Cheddar • Cebola Caramelizada • Jalapeños • Pickles • Molho Hawsmash",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: true,
    prices: {
      HAW: 300,
      WAGYU: 400
    },
    badge: "Mais Vendido"
  },
  {
    id: "double-smash",
    name: "Double Smash",
    category: "burgers",
    description: "Pão Brioche • 2 Carnes Smash Suculentas • Queijo Cheddar • Cebola Caramelizada • Jalapeños • Pickles • Molho Hawsmash",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: true,
    prices: {
      HAW: 400,
      WAGYU: 500
    },
    badge: "Favorito do Chefe"
  },
  {
    id: "smoked-brisket",
    name: "Smoked Brisket",
    category: "burgers",
    description: "Pão Brioche • Carne Smash Suculenta • Smoked Brisket • Cebola Caramelizada • Jalapeños • Pickles • Molho Hawsmash",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: true,
    prices: {
      HAW: 450,
      WAGYU: 550
    },
    badge: "Especial Defumado"
  },
  {
    id: "hawsmash-signature",
    name: "Hawsmash Signature",
    category: "burgers",
    description: "Pão Brioche Duplo Tostado • 2 Carnes Smash • Bacon Crocante • Duplo Cheddar • Cebola Crispy • Molho Secreto Haw",
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: true,
    prices: {
      HAW: 500,
      WAGYU: 600
    },
    badge: "Premium"
  },
  {
    id: "truffle-smash",
    name: "Truffle Smash",
    category: "burgers",
    description: "Pão Brioche • Carne Smash • Queijo Fontina Derretido • Cogumelos Salteados em Ervas • Maio de Trufas Negras • Rúcula Fresca",
    image: "https://images.unsplash.com/photo-1583794138616-52850ad3d15d?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: true,
    prices: {
      HAW: 480,
      WAGYU: 580
    }
  },
  {
    id: "joes-chips",
    name: "Joe's Chips",
    category: "sides",
    description: "Batatas rústicas cortadas à mão na hora, fritas em imersão e temperadas com flor de sal e especiarias secas da casa.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: false,
    price: 150,
    badge: "Crocante"
  },
  {
    id: "onion-rings-haw",
    name: "Onion Rings Haw",
    category: "sides",
    description: "Anéis de cebola doce empanados em farinha panko crocante, servidos quentinhos com dip de alho defumado.",
    image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: false,
    price: 180
  },
  {
    id: "chicken-nuggets",
    name: "Nuggets Artesanais (6 un)",
    category: "sides",
    description: "Pedaços de peito de frango marinados em especiarias, empanados e acompanhados de molho Honey Mustard caseiro.",
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: false,
    price: 220
  },
  {
    id: "pasteis-nata",
    name: "Pastéis de Nata (2 un)",
    category: "desserts",
    description: "Receita artesanal tradicional com massa folhada estaladiça, creme aveludado e toque de canela e açúcar em pó.",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: false,
    price: 150,
    badge: "Sobremesa Típica"
  },
  {
    id: "milkshake-doce-leite",
    name: "Milkshake Doce de Leite",
    category: "desserts",
    description: "Gelado cremoso de baunilha, doce de leite artesanal argentino, chantilly natural e farofa de bolacha.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: false,
    price: 250
  },
  {
    id: "coca-cola",
    name: "Coca-Cola Original (330ml)",
    category: "drinks",
    description: "Lata 330ml extremamente gelada para acompanhar o seu smash.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: false,
    price: 70
  },
  {
    id: "agua-vumba",
    name: "Água Vumba (500ml)",
    category: "drinks",
    description: "Garrafa de água mineral pura e refrescante.",
    image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80",
    supportsMeatChoice: false,
    price: 50
  }
];
