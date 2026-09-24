import { DeliveryZone } from '../types';

/**
 * CONFIGURAÇÃO DAS ZONAS E TAXAS DE ENTREGA
 * 
 * Centraliza as zonas atendidas pelo restaurante e suas respectivas taxas de entrega.
 * Permite que restaurantes em diferentes cidades/regiões configurem seus próprios
 * bairros e valores de forma simples e independente da lógica dos componentes.
 */

export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
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

export const DEFAULT_DELIVERY_ZONE_ID = "polana-cimento";

export const DELIVERY_ZONES: DeliveryZone[] = DEFAULT_DELIVERY_ZONES;

/**
 * Retorna a zona de entrega pelo identificador com fallback para a primeira zona da lista.
 */
export const getDeliveryZone = (
  zoneId: string,
  zones: DeliveryZone[] = DELIVERY_ZONES
): DeliveryZone => {
  return zones.find((z) => z.id === zoneId) || zones[0] || {
    id: "padrao",
    name: "Entrega Geral",
    fee: 150
  };
};
