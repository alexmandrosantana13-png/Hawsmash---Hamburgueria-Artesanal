import React from 'react';
import { RESTAURANT_CONFIG } from '../config/restaurant';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#1F1F1F] text-zinc-400 py-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center">
              <span className="font-display text-2xl font-black tracking-tighter text-white uppercase select-none">
                {RESTAURANT_CONFIG.logo.textPrimary}
                <span className="text-[#FF6B00]">{RESTAURANT_CONFIG.logo.textSecondary}</span>
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed">
              {RESTAURANT_CONFIG.description}
            </p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Localização</h4>
            <p className="flex items-start gap-2 text-zinc-400">
              <i className="fa-solid fa-location-dot text-[#FF6B00] mt-0.5"></i>
              <span>{RESTAURANT_CONFIG.address}, {RESTAURANT_CONFIG.country}</span>
            </p>
          </div>

          {/* Delivery & Hours */}
          <div className="space-y-2">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Horário & Entrega</h4>
            <p className="flex items-center gap-2 text-zinc-400">
              <i className="fa-regular fa-clock text-[#FF6B00]"></i>
              <span>{RESTAURANT_CONFIG.openingHours.display}</span>
            </p>
            <p className="text-zinc-500">
              Taxa de entrega: <strong className="text-white">{RESTAURANT_CONFIG.deliveryFeeMinDisplay}</strong> (por bairro)
            </p>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white">Pedidos Diretos</h4>
            <a 
              href={`https://wa.me/${RESTAURANT_CONFIG.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-colors shadow-lg shadow-[#25D366]/20"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
              <span>WhatsApp: {RESTAURANT_CONFIG.contact.phoneDisplay}</span>
            </a>
          </div>

        </div>

        <div className="pt-8 border-t border-[#181818] flex flex-col sm:flex-row items-center justify-between text-zinc-600 text-[11px] gap-2">
          <p>© 2026 {RESTAURANT_CONFIG.name} {RESTAURANT_CONFIG.city} (Restaurante Demo). Todos os direitos reservados.</p>
          {RESTAURANT_CONFIG.motto && (
            <p className="uppercase tracking-widest font-semibold">{RESTAURANT_CONFIG.motto}</p>
          )}
        </div>
      </div>
    </footer>
  );
};
