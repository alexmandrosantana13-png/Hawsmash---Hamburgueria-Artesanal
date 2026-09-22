import React, { useState, useEffect } from 'react';
import { RESTAURANT_CONFIG } from '../config/restaurant';

interface HeaderProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, cartTotal, onOpenCart }) => {
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    if (cartCount === 0) return;
    setIsBumping(true);
    const timer = setTimeout(() => setIsBumping(false), 350);
    return () => clearTimeout(timer);
  }, [cartCount, cartTotal]);

  return (
    <header className="sticky top-0 z-40 bg-[#111111]/95 backdrop-blur-md border-b border-[#222222] transition-all">
      {/* Top micro-bar for quick details */}
      <div className="bg-[#181818] border-b border-[#262626] text-xs text-[#AAAAAA] px-4 py-1.5 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <span className="flex items-center gap-1.5 text-zinc-300">
              <i className="fa-solid fa-location-dot text-[#FF6B00]"></i>
              {RESTAURANT_CONFIG.address}
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <i className="fa-regular fa-clock text-[#FF6B00]"></i>
              Entrega em {RESTAURANT_CONFIG.estimatedDeliveryTime}
            </span>
            <span className="bg-[#FF6B00]/15 text-[#FF6B00] px-2 py-0.5 rounded font-medium text-[11px] border border-[#FF6B00]/20 inline-flex items-center gap-1">
              <i className="fa-solid fa-motorcycle text-[10px]"></i>
              <span>Taxa de entrega: {RESTAURANT_CONFIG.deliveryFeeMinDisplay}</span>
            </span>
          </div>
          <a
            href={`https://wa.me/${RESTAURANT_CONFIG.contact.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors group"
          >
            <span className="text-[#25D366] group-hover:scale-110 transition-transform inline-flex items-center justify-center">
              <i className="fa-brands fa-whatsapp text-sm"></i>
            </span>
            <span className="font-semibold text-zinc-200 group-hover:text-[#25D366] transition-colors">
              WhatsApp: {RESTAURANT_CONFIG.contact.phoneDisplay}
            </span>
          </a>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
        {/* Brand logo & status indicator */}
        <div className="flex items-center gap-4 sm:gap-5">
          <a 
            href="#" 
            className="flex items-center group transition-transform hover:opacity-95" 
            aria-label={`${RESTAURANT_CONFIG.name} Início`}
          >
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl sm:text-3xl font-black tracking-tighter text-white uppercase select-none">
                {RESTAURANT_CONFIG.logo.textPrimary}
                <span className="text-[#FF6B00]">{RESTAURANT_CONFIG.logo.textSecondary}</span>
              </span>
            </div>
          </a>

          {/* Indicator: Status de Funcionamento */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold shadow-xs shrink-0">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline leading-none">{RESTAURANT_CONFIG.openingHours.isOpenNowText}</span>
            <span className="sm:hidden leading-none">{RESTAURANT_CONFIG.openingHours.isOpenNowShortText}</span>
          </div>
        </div>

        {/* Action items - Destaque absoluto para o Carrinho */}
        <div className="flex items-center">
          {/* Dynamic Cart Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className={`relative flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md cursor-pointer ${
              cartCount > 0
                ? 'bg-[#FF6B00] hover:bg-[#E55F00] text-white shadow-[#FF6B00]/30'
                : 'bg-[#1A1A1A] hover:bg-[#222222] border border-[#2D2D2D] text-zinc-300 hover:text-white'
            } ${isBumping ? 'animate-bump scale-105' : ''}`}
          >
            <div className="relative flex items-center justify-center">
              <i className={`fa-solid fa-bag-shopping text-base ${cartCount > 0 ? 'text-white' : 'text-zinc-400'}`}></i>
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 min-w-[19px] h-[19px] px-1 bg-[#111111] text-[#FF6B00] border border-[#FF6B00] text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold leading-none">
              <span>Carrinho</span>
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-black rounded-full ${
                cartCount > 0 ? 'bg-white text-[#111111]' : 'bg-[#262626] text-zinc-400'
              }`}>
                {cartCount}
              </span>
              {cartCount > 0 && (
                <>
                  <span className="text-white/70 font-normal">•</span>
                  <span className="font-bold text-white">
                    {cartTotal} MT
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
