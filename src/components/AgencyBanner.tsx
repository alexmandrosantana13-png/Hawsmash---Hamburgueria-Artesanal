import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AGENCY_CONFIG } from '../config/restaurant';

export const AgencyBanner: React.FC = () => {
  const customMessage =
    'Olá Trust Point, vi o vosso protótipo de cardápio digital e quero saber os preços para o meu restaurante.';
  const whatsappAgencyUrl = `https://wa.me/${AGENCY_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    customMessage
  )}`;

  return (
    <aside
      id="agency-footer-banner"
      aria-label="Assinatura da agência desenvolvedora"
      className="sticky bottom-0 z-40 w-full bg-[#111111]/95 backdrop-blur-md border-t border-[#2A241A] shadow-[0_-8px_30px_rgba(0,0,0,0.7)] text-zinc-300"
    >
      {/* Top subtle golden/amber accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2.5 sm:pt-3 pb-3.5 sm:pb-4 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
        {/* Left: Agency signature credit */}
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 shrink-0">
            <span className="text-xs">⚡</span>
          </span>
          <span className="text-zinc-300">
            Cardápio Digital desenvolvido por{' '}
            <strong className="text-white font-bold tracking-wide">
              Trust Point Digital
            </strong>
          </span>
        </div>

        {/* Right: Pitch & Call-to-action button */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3.5">
          <span className="text-[11px] sm:text-xs text-amber-200/80 font-normal">
            Quer um sistema destes para o seu restaurante?
          </span>

          <a
            id="agency-cta-button"
            href={whatsappAgencyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#E5C158] hover:to-[#FBBF24] active:scale-[0.98] text-[#111111] font-bold text-xs tracking-wide shadow-md shadow-[#D4AF37]/20 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#111111] group-hover:rotate-12 transition-transform" />
            <span>Falar com a Trust Point</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#111111] group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default AgencyBanner;
