import { RestaurantConfig, AgencyConfig } from '../types';

/**
 * CONFIGURAÇÃO CENTRAL DO RESTAURANTE
 * 
 * Este ficheiro centraliza todos os dados institucionais, operacionais e de contato
 * do restaurante, permitindo reutilizar o sistema para diferentes clientes
 * apenas ajustando este objeto.
 */
export const RESTAURANT_CONFIG: RestaurantConfig = {
  id: 'smash-point',
  name: 'SMASH POINT',
  shortName: 'Smash Point',
  tagline: 'Hamburgueria Artesanal • Maputo (Restaurante Demo)',
  description: 'Hamburgueria artesanal especialista em smash burgers prensados na hora em Maputo. Ingredientes frescos e entrega rápida.',
  motto: 'Sabor Puro • Carne Prensada',
  address: 'Av. Marginal, Maputo (Restaurante Demo)',
  city: 'Maputo',
  country: 'Moçambique',
  currency: 'MT',
  currencySymbol: 'MT',
  logo: {
    type: 'text',
    textPrimary: 'SMASH',
    textSecondary: 'POINT',
    imageUrl: '/images/hawsmash-logo.png',
    altText: 'SMASH POINT Logo'
  },
  contact: {
    phoneDisplay: '+258 87 959 0556',
    whatsappNumber: '258879590556',
  },
  social: {
    instagram: '',
    facebook: '',
  },
  openingHours: {
    display: 'Todos os dias: 11:00 – 23:00',
    shortDisplay: '11:00 - 23:00',
    isOpenNowText: 'Aberto agora • 11:00 - 23:00',
    isOpenNowShortText: 'Aberto • 11:00 - 23:00'
  },
  estimatedDeliveryTime: '30–45 minutos',
  deliveryFee: 150,
  deliveryFeeMinDisplay: 'A partir de 100 MT',
  pickupFee: 0,
  payment: {
    number: '879590556',
    accountName: 'Trust Point Digital',
    acceptedMethods: ['M-Pesa', 'e-Mola']
  }
};

/**
 * Configuração da agência desenvolvedora (Trust Point Digital)
 * Mantida separada para que o banner de divulgação da agência não se misture
 * com os dados de contato operacionais do restaurante em instâncias de clientes.
 */
export const AGENCY_CONFIG: AgencyConfig = {
  name: 'Trust Point Digital',
  phoneDisplay: '+258 87 959 0556',
  whatsappNumber: '258879590556',
};
