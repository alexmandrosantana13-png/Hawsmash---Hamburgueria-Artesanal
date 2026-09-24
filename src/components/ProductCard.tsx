import React, { useState } from 'react';
import { MenuItem, MeatType } from '../types';

interface ProductCardProps {
  item: MenuItem;
  currentMeat: MeatType;
  onToggleMeat: (itemId: string, type: MeatType) => void;
  onAddToCart: (item: MenuItem, meatChoice: MeatType, price: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  item,
  currentMeat,
  onToggleMeat,
  onAddToCart,
}) => {
  const [isAdded, setIsAdded] = useState(false);

  const currentPrice = item.supportsMeatChoice && item.prices
    ? item.prices[currentMeat]
    : item.price ?? 0;

  const hasBadge = Boolean(item.badge);

  const handleAddClick = () => {
    onAddToCart(item, currentMeat, currentPrice);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1000);
  };

  return (
    <div
      className={`h-full bg-[#181818] hover:bg-[#1C1C1C] transition-all duration-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg group relative sm:hover:-translate-y-1 sm:hover:shadow-xl sm:hover:shadow-black/50 ${
        hasBadge
          ? "border border-[#FF6B00]/60 ring-1 ring-[#FF6B00]/30 shadow-[#FF6B00]/10 hover:border-[#FF6B00] hover:ring-[#FF6B00]/50"
          : "border border-[#262626] hover:border-[#FF6B00]/40"
      }`}
    >
      {hasBadge && (
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#FF6B00]/10 rounded-full blur-2xl pointer-events-none z-10" />
      )}

      {/* Top Section: Media & Product Content */}
      <div className="flex flex-col flex-1">
        {/* Image & Badges Container */}
        <div className="relative h-48 sm:h-52 overflow-hidden bg-[#222222] shrink-0">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 ease-out sm:group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null; 
              if (item.category === 'drinks') {
                target.src = "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80";
              } else if (item.category === 'desserts') {
                target.src = "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80";
              } else if (item.category === 'sides') {
                target.src = "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80";
              } else {
                target.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80";
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent opacity-80 pointer-events-none" />
          
          {/* Top Badge */}
          {item.badge && (
            <span className="absolute top-3 left-3 bg-[#0D0D0D]/90 backdrop-blur-md text-[#FF6B00] text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-[#FF6B00]/40 shadow-md">
              {item.badge}
            </span>
          )}

          {/* Refined Floating Price tag badge */}
          <div className="absolute bottom-3 right-3 bg-[#0D0D0D]/90 backdrop-blur-md border border-[#FF6B00]/40 text-white font-display text-base sm:text-lg font-bold px-3 py-1 rounded-xl shadow-xl tracking-wider">
            {currentPrice} MT
          </div>
        </div>

        {/* Card Content with flexible expansion */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-start">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white uppercase tracking-wide group-hover:text-[#FF6B00] transition-colors leading-tight">
            {item.name}
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed flex-1 line-clamp-3">
            {item.description}
          </p>
        </div>
      </div>

      {/* Bottom Section: Actions */}
      <div className="p-4 sm:p-5 pt-0 space-y-3 shrink-0">
        {/* Meat Selection Toggle if burger */}
        {item.supportsMeatChoice && item.prices ? (
          <div className="bg-[#111111] p-1.5 rounded-xl border border-[#262626]">
            <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400 px-1 mb-1.5">
              <span className="uppercase tracking-wider">Opção de Carne:</span>
              <span className="text-[#FF6B00] font-extrabold uppercase">Carne {currentMeat} Smash</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                aria-pressed={currentMeat === "HAW"}
                aria-label={`Carne HAW Smash, ${item.prices.HAW} MT`}
                onClick={() => onToggleMeat(item.id, "HAW")}
                className={`min-h-[40px] py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] ${
                  currentMeat === "HAW"
                    ? "bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/25 ring-1 ring-[#FF6B00]"
                    : "bg-[#1A1A1A] text-zinc-300 hover:text-white hover:bg-[#242424] border border-[#2B2B2B]"
                }`}
              >
                <span>HAW</span>
                <span className={currentMeat === "HAW" ? "text-white font-extrabold" : "text-zinc-400 font-semibold"}>
                  {item.prices.HAW} MT
                </span>
              </button>

              <button
                type="button"
                aria-pressed={currentMeat === "WAGYU"}
                aria-label={`Carne WAGYU Smash, ${item.prices.WAGYU} MT`}
                onClick={() => onToggleMeat(item.id, "WAGYU")}
                className={`min-h-[40px] py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] ${
                  currentMeat === "WAGYU"
                    ? "bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/25 ring-1 ring-[#FF6B00]"
                    : "bg-[#1A1A1A] text-zinc-300 hover:text-white hover:bg-[#242424] border border-[#2B2B2B]"
                }`}
              >
                <span className="flex items-center gap-1">
                  WAGYU <i className="fa-solid fa-sparkles text-[10px] text-amber-300"></i>
                </span>
                <span className={currentMeat === "WAGYU" ? "text-white font-extrabold" : "text-zinc-400 font-semibold"}>
                  {item.prices.WAGYU} MT
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="h-2"></div>
        )}

        {/* Add button with temporary green feedback and checkmark */}
        <button
          type="button"
          aria-label={isAdded ? "Produto adicionado ao carrinho" : `Adicionar ${item.name} ao carrinho por ${currentPrice} MT`}
          onClick={handleAddClick}
          className={`w-full min-h-[44px] py-2.5 sm:py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#181818] ${
            isAdded
              ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-[1.02]"
              : "bg-[#FF6B00] hover:bg-[#E55F00] active:scale-[0.98] text-white shadow-[#FF6B00]/20"
          }`}
        >
          {isAdded ? (
            <>
              <i className="fa-solid fa-check text-base"></i>
              <span>Adicionado!</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-plus"></i>
              <span>Adicionar</span>
              <span className="opacity-80 font-normal">({currentPrice} MT)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
