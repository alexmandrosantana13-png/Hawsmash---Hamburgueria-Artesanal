import React from 'react';
import { CupSoda, Plus, Sparkles } from 'lucide-react';

export interface DrinkUpsellProps {
  onAddDrink: () => void;
  className?: string;
}

export const DrinkUpsell: React.FC<DrinkUpsellProps> = ({ 
  onAddDrink,
  className = '' 
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-[#1a1a1a] border border-[#2a2a2a] hover:border-amber-500/40 p-3.5 sm:p-4 transition-all duration-300 shadow-lg group ${className}`}
      role="region"
      aria-label="Sugestão de bebida"
    >
      {/* Glow decorativo sutil no canto */}
      <div 
        className="pointer-events-none absolute -right-8 -top-8 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl transition-opacity group-hover:opacity-100 opacity-60"
        aria-hidden="true" 
      />

      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Ícone e Textos de Incentivo */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar / Ícone estilizado da Bebida */}
          <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
            <CupSoda className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 group-hover:text-amber-300 transition-colors" />
            <Sparkles className="w-3 h-3 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
          </div>

          {/* Textos */}
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-display text-xs sm:text-sm font-black tracking-wider text-amber-400 uppercase">
                FALTA A BEBIDA?
              </span>
            </div>
            <p className="text-xs sm:text-xs text-zinc-300 truncate">
              Adiciona uma Coca-Cola gelada por{' '}
              <strong className="text-white font-bold tracking-tight">
                + 100 MT
              </strong>
            </p>
          </div>
        </div>

        {/* Botão de Ação */}
        <button
          type="button"
          onClick={onAddDrink}
          aria-label="Adicionar Coca-Cola gelada por 100 MT"
          className="shrink-0 flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-amber-400 active:scale-95 text-[#0f0f0f] font-extrabold text-xs tracking-wider uppercase transition-all duration-200 shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>ADICIONAR</span>
        </button>
      </div>
    </div>
  );
};

export default DrinkUpsell;
