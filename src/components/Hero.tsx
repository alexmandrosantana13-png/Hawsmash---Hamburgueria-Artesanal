import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:py-16 bg-gradient-to-b from-[#181818] via-[#141414] to-[#111111]">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00]/25 text-[#FF6B00] text-xs font-bold uppercase tracking-wider">
              <i className="fa-solid fa-fire text-xs"></i>
              <span>O Autêntico Smash Burger em Maputo</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-black text-white uppercase tracking-tight leading-none">
              SABOR PURO.<br />
              <span className="text-[#FF6B00]">CARNE PRENSADA.</span><br />
              ARTESANAL DE VERDADE.
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Pão brioche dourado na chapa, crostinha crocante inconfundível, queijo derretido e carnes nobres com opção <strong className="text-white font-semibold">HAW</strong> ou <strong className="text-[#FF6B00] font-semibold">WAGYU</strong>. Peça direto e receba quentinho.
            </p>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-[#2A2A2A] shadow-2xl bg-[#1A1A1A] group">
              <img 
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80" 
                alt="Hawsmash Burger Especial" 
                className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-80"></div>
              
              {/* Float Tag */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#181818]/90 backdrop-blur-md border border-[#333333] flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#FF6B00] font-bold uppercase tracking-wider">Combinação Perfeita</p>
                  <p className="text-white font-bold text-lg font-display tracking-wide uppercase">Double Smash + Joe's Chips</p>
                </div>
                <span className="bg-[#FF6B00] text-white font-extrabold text-sm px-3 py-1.5 rounded-xl">
                  A partir de 400 MT
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
