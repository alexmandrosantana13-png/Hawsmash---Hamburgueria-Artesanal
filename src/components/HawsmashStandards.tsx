import React from 'react';

export const HawsmashStandards: React.FC = () => {
  const standards = [
    {
      icon: "fa-solid fa-fire-flame-curved",
      title: "Chapa de Alta Temperatura",
      description: "Prensagem milimétrica para criar a crostinha (crust) maillard caramelizada perfeita, retendo todo o sumo e sabor da carne."
    },
    {
      icon: "fa-solid fa-award",
      title: "Carnes Nobres (HAW & WAGYU)",
      description: "Blend exclusivo preparado diariamente com cortes selecionados. Escolha entre a nossa carne HAW tradicional ou a experiência WAGYU."
    },
    {
      icon: "fa-solid fa-truck-ramp-box",
      title: "Entrega Rápida em Maputo",
      description: "Embalagens térmicas projetadas para manter o pão brioche macio e a carne quentinha no percurso até à sua porta."
    }
  ];

  return (
    <section className="py-16 bg-[#141414] border-t border-b border-[#222222] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#FF6B00] font-bold bg-[#FF6B00]/10 px-3 py-1 rounded-full border border-[#FF6B00]/20">
            Compromisso de Qualidade
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mt-3 uppercase tracking-wide">
            O Padrão <span className="text-[#FF6B00]">Hawsmash</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Não fazemos apenas fast food. Entregamos uma experiência de artesanal de verdade em cada mordida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {standards.map((item, index) => (
            <div 
              key={index}
              className="bg-[#1A1A1A] hover:bg-[#1E1E1E] border border-[#262626] hover:border-[#FF6B00]/40 transition-all duration-300 rounded-2xl p-6 sm:p-8 flex flex-col items-start shadow-xl group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FF6B00]/15 group-hover:bg-[#FF6B00] flex items-center justify-center text-[#FF6B00] group-hover:text-white transition-all duration-300 mb-5 shadow-sm text-xl">
                <i className={item.icon}></i>
              </div>
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-2">
                {item.title}
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
