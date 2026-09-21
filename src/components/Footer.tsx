import React from 'react';
import { RESTAURANT_INFO } from '../data';
import { STORE_CONFIG } from '../config/constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#1F1F1F] text-zinc-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center">
              <span className="font-display text-2xl font-black tracking-tighter text-white uppercase select-none">
                SMASH<span className="text-[#FF6B00]">POINT</span>
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed">
              Hamburgueria artesanal especialista em smash burgers prensados na hora em Maputo. Ingredientes frescos e entrega rápida.
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Localização</h4>
            <p className="flex items-start gap-2 text-zinc-400">
              <i className="fa-solid fa-location-dot text-[#FF6B00] mt-0.5"></i>
              <span>{RESTAURANT_INFO.address}, Moçambique</span>
            </p>
          </div>

          {/* Delivery & Hours */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Horário & Entrega</h4>
            <p className="flex items-center gap-2 text-zinc-400">
              <i className="fa-regular fa-clock text-[#FF6B00]"></i>
              <span>Todos os dias: 11:00 – 23:00</span>
            </p>
            <p className="text-zinc-500">
              Taxa de entrega: <strong className="text-white">A partir de 100 MT</strong> (por bairro)
            </p>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Pedidos Diretos</h4>
            <a 
              href={`https://wa.me/${STORE_CONFIG.phoneWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-colors shadow-lg shadow-[#25D366]/20"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <span>WhatsApp: {STORE_CONFIG.phoneDisplay}</span>
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-[#181818] flex flex-col sm:flex-row items-center justify-between text-zinc-600 text-[11px] gap-2">
          <p>© 2026 SMASH POINT Maputo (Restaurante Demo). Todos os direitos reservados.</p>
          <p className="uppercase tracking-widest font-semibold">Sabor Puro • Carne Prensada</p>
        </div>
      </div>
    </footer>
  );
};
