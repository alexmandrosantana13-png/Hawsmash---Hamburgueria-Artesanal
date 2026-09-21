import React from 'react';
import { 
  Store, 
  Bike, 
  Car, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { DeliveryMode } from '../types';
import { RESTAURANT_INFO, formatPrice } from '../data';

export interface DeliveryStepProps {
  // Selected fulfillment method
  deliveryMode: DeliveryMode;
  onSelectDeliveryMode: (mode: DeliveryMode) => void;
  // Selected ready time
  selectedTime: string;
  onSelectTime: (time: string) => void;
  // Custom time option if needed
  customTime?: string;
  onCustomTimeChange?: (val: string) => void;
  // Error message for validation
  timeError?: string;
  className?: string;
}

export const DELIVERY_OPTIONS: {
  id: DeliveryMode;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'pickup',
    title: 'Levantar no Balcão',
    badge: 'Grátis',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: 'Levanta o teu pedido quentinho diretamente na nossa loja.',
    tag: RESTAURANT_INFO.address,
    icon: Store
  },
  {
    id: 'delivery',
    title: 'Entrega ao Domicílio',
    badge: 'Taxa fixa/bairro',
    badgeColor: 'text-[#FF6B00] bg-[#FF6B00]/10 border-[#FF6B00]/30',
    description: 'Estafeta próprio com entrega rápida no conforto da tua casa.',
    tag: 'Maputo & Arredores',
    icon: Bike
  },
  {
    id: 'yango',
    title: 'Envio via Yango',
    badge: 'Pago ao motorista',
    badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    description: 'Enviamos via estafeta Yango Flash / Entrega diretamente a ti.',
    tag: 'Rápido & Rastreado',
    icon: Car
  }
];

export const TIME_SLOTS: { label: string; value: string; hint?: string }[] = [
  { label: 'O mais rápido possível', value: 'asap', hint: '30-45 min' },
  { label: '12:00', value: '12:00' },
  { label: '12:30', value: '12:30' },
  { label: '13:00', value: '13:00' },
  { label: '13:30', value: '13:30' },
  { label: '18:30', value: '18:30' },
  { label: '19:00', value: '19:00' },
  { label: '19:30', value: '19:30' },
  { label: '20:00', value: '20:00' },
  { label: '20:30', value: '20:30' },
  { label: '21:00', value: '21:00' },
];

export const DeliveryStep: React.FC<DeliveryStepProps> = ({
  deliveryMode,
  onSelectDeliveryMode,
  selectedTime,
  onSelectTime,
  customTime = '',
  onCustomTimeChange,
  timeError,
  className = ''
}) => {
  const isCustom = selectedTime === 'custom';

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. SELEÇÃO DA FORMA DE RECEBER */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#242424]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-black font-black text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white">
              Como queres receber o teu pedido?
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400">Escolha uma opção</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DELIVERY_OPTIONS.map((opt) => {
            const isSelected = deliveryMode === opt.id;
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectDeliveryMode(opt.id)}
                className={`group relative text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-full ${
                  isSelected
                    ? 'bg-[#1e1a14] border-[#FF6B00] ring-1 ring-[#FF6B00]/40 shadow-lg shadow-[#FF6B00]/10'
                    : 'bg-[#181818] border-[#262626] hover:bg-[#1C1C1C] hover:border-[#333333]'
                }`}
              >
                {/* Active selection tick */}
                <div className="flex items-start justify-between gap-2 mb-2 w-full">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                      isSelected
                        ? 'bg-[#FF6B00] text-black border-[#FF6B00]'
                        : 'bg-[#222222] text-zinc-300 border-[#2C2C2C] group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border shrink-0 ${opt.badgeColor}`}
                  >
                    {opt.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors ${
                        isSelected ? 'text-[#FF6B00]' : 'text-white'
                      }`}
                    >
                      {opt.title}
                    </h4>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-snug">
                    {opt.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#262626] text-[10px] text-zinc-500 font-medium truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0 text-zinc-400" />
                  <span className="truncate">{opt.tag}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sub-informaçoes de apoio conforme a modalidade escolhida */}
        {deliveryMode === 'pickup' && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <Store className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Balcão: <strong className="text-white font-semibold">{RESTAURANT_INFO.address}</strong>. Pedido pronto no horário selecionado.
            </span>
          </div>
        )}

        {deliveryMode === 'yango' && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-300">
            <Car className="w-4 h-4 text-yellow-400 shrink-0" />
            <span>
              O pedido é despachado pelo restaurante via <strong>Yango Flash</strong> para o seu destino. O valor da corrida é pago ao motorista.
            </span>
          </div>
        )}
      </section>

      {/* 2. SELEÇÃO DO HORÁRIO EM QUE QUER A COMIDA PRONTA */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#242424]">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-black font-black text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-display text-sm sm:text-base font-bold uppercase tracking-wider text-white">
              Para que horas queres a comida pronta?
            </h3>
          </div>
          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#FF6B00]" />
            Sem atrasos
          </span>
        </div>

        <p className="text-xs text-zinc-400">
          Informa o horário desejado para a nossa cozinha preparar o teu smash na hora exata, sempre fresco e suculento.
        </p>

        {/* Grid de horários rápidos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTime === slot.value;

            return (
              <button
                key={slot.value}
                type="button"
                onClick={() => onSelectTime(slot.value)}
                className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-md shadow-[#FF6B00]/25 font-extrabold scale-[1.02]'
                    : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-300 hover:text-white hover:bg-[#222222] hover:border-[#383838]'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-zinc-400'}`} />
                  <span>{slot.label}</span>
                </div>
                {slot.hint && (
                  <span
                    className={`text-[10px] ${
                      isSelected ? 'text-black/80 font-bold' : 'text-zinc-500'
                    }`}
                  >
                    ({slot.hint})
                  </span>
                )}
              </button>
            );
          })}

          {/* Outro Horário Personalizado */}
          <button
            type="button"
            onClick={() => onSelectTime('custom')}
            className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 ${
              isCustom
                ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-md shadow-[#FF6B00]/25 font-extrabold'
                : 'bg-[#1A1A1A] border-[#2A2A2A] text-zinc-300 hover:text-white hover:bg-[#222222]'
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${isCustom ? 'text-black' : 'text-zinc-400'}`} />
            <span>Outro horário</span>
          </button>
        </div>

        {/* Input para horário personalizado */}
        {isCustom && (
          <div className="pt-2 animate-fadeIn">
            <label htmlFor="custom-time-input" className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Especifica a hora pretendida (ex: 14:15, 20:45) *
            </label>
            <div className="relative">
              <input
                id="custom-time-input"
                type="text"
                value={customTime}
                onChange={(e) => onCustomTimeChange && onCustomTimeChange(e.target.value)}
                placeholder="Ex: 14:15 ou 21:15"
                className="w-full bg-[#181818] border border-[#2D2D2D] focus:border-[#FF6B00] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
              />
              <Clock className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}

        {timeError && (
          <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{timeError}</span>
          </p>
        )}
      </section>
    </div>
  );
};

export default DeliveryStep;
