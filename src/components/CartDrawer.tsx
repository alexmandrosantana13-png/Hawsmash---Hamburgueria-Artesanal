import React, { useState } from 'react';
import { CartItem, DeliveryMode } from '../types';
import { RESTAURANT_INFO, MAPUTO_NEIGHBORHOODS } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, delta: number) => void;
  onClearCart: () => void;
  deliveryOption: DeliveryMode;
  setDeliveryOption: (mode: DeliveryMode) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onClearCart,
  deliveryOption,
  setDeliveryOption,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>("polana-cimento");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);

  if (!isOpen) return null;

  const currentNeighborhood = MAPUTO_NEIGHBORHOODS.find(n => n.id === selectedNeighborhoodId) || MAPUTO_NEIGHBORHOODS[0];
  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = deliveryOption === 'delivery' ? currentNeighborhood.fee : 0;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    const isNameValid = customerName.trim().length >= 3;
    const isAddressValid = deliveryOption !== 'delivery' || address.trim().length >= 3;

    if (!isNameValid || !isAddressValid) {
      setShowValidationError(true);
      return;
    }

    // Format highly structured WhatsApp message with clean emojis and line breaks
    let message = `🍔 *NOVO PEDIDO - HAWSMASH MAPUTO*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    message += `👤 *DADOS DO CLIENTE*\n`;
    message += `• *Nome:* ${customerName.trim()}\n`;
    if (customerPhone.trim()) {
      message += `• *Contacto:* ${customerPhone.trim()}\n`;
    }
    message += `• *Modalidade:* ${deliveryOption === 'delivery' ? '🛵 Entrega ao Domicílio' : '🏬 Levantamento no Restaurante'}\n`;

    if (deliveryOption === 'delivery') {
      message += `• *Bairro:* 📍 ${currentNeighborhood.name}\n`;
      message += `• *Endereço:* 🏠 ${address.trim()}\n`;
    }

    if (notes.trim()) {
      message += `• *Observações:* 📝 ${notes.trim()}\n`;
    }

    message += `\n🛒 *ITENS DO PEDIDO*\n`;
    message += `─────────────────────\n`;
    cart.forEach((item, index) => {
      const meatTag = item.supportsMeatChoice ? ` [Carne ${item.meatChoice}]` : '';
      message += `${index + 1}️⃣ *${item.quantity}x ${item.name}*${meatTag}\n`;
      message += `   └ ${item.unitPrice} MT × ${item.quantity} = *${item.unitPrice * item.quantity} MT*\n`;
    });

    message += `\n💰 *RESUMO FINANCEIRO*\n`;
    message += `─────────────────────\n`;
    message += `▫️ *Subtotal:* ${subtotal} MT\n`;
    if (deliveryOption === 'delivery') {
      message += `🛵 *Taxa de Entrega (${currentNeighborhood.name}):* ${currentNeighborhood.fee} MT\n`;
    } else {
      message += `🏬 *Taxa de Entrega:* GRÁTIS (Levantamento)\n`;
    }
    message += `\n🔥 *TOTAL A PAGAR: ${total} MT*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `⏰ *Tempo estimado:* ${RESTAURANT_INFO.estimatedDeliveryTime}\n`;
    message += `Aguardando confirmação da equipa de atendimento! 🙏`;

    const encoded = encodeURIComponent(message);
    const whatsappTargetUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encoded}`;
    window.open(whatsappTargetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141414] border-l border-[#262626] text-white flex flex-col justify-between shadow-2xl">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-[#222222] bg-[#181818] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00]">
                <i className="fa-solid fa-bag-shopping text-lg"></i>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                  Seu Carrinho
                </h2>
                <p className="text-xs text-zinc-400">
                  {cart.length === 0 ? "Carrinho vazio" : `${cart.reduce((a, b) => a + b.quantity, 0)} itens selecionados`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-[#222222] hover:bg-[#2A2A2A] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Cart List Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#1F1F1F] flex items-center justify-center text-zinc-600 text-3xl">
                  <i className="fa-solid fa-burger"></i>
                </div>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-zinc-300">
                  O seu carrinho está vazio
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Navegue pelo nosso menu e escolha os seus hambúrgueres artesanais favoritos.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Ver Cardápio
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Itens no Pedido</span>
                  <button 
                    onClick={onClearCart}
                    className="text-[11px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                  >
                    Esvaziar Carrinho
                  </button>
                </div>

                {cart.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="bg-[#1C1C1C] border border-[#282828] p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-sm"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-white truncate">
                          {item.name}
                        </h4>
                        {item.supportsMeatChoice && (
                          <span className="text-[10px] font-extrabold bg-[#FF6B00]/20 text-[#FF6B00] px-1.5 py-0.5 rounded border border-[#FF6B00]/30 shrink-0">
                            {item.meatChoice}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 font-medium mt-0.5">
                        {item.unitPrice} MT × {item.quantity} = <strong className="text-white">{item.unitPrice * item.quantity} MT</strong>
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 bg-[#111111] p-1 rounded-lg border border-[#2A2A2A] shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, -1)}
                        className="w-7 h-7 rounded bg-[#222222] hover:bg-[#2C2C2C] text-zinc-300 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="w-5 text-center text-xs font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(idx, 1)}
                        className="w-7 h-7 rounded bg-[#FF6B00] hover:bg-[#E55F00] text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                ))}

                {/* Delivery Mode Selector */}
                <div className="pt-4 space-y-3 border-t border-[#222222]">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Modo de Recebimento
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryOption('delivery');
                        if (showValidationError) setShowValidationError(false);
                      }}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        deliveryOption === 'delivery'
                          ? 'bg-[#FF6B00]/15 border-[#FF6B00] text-[#FF6B00]'
                          : 'bg-[#181818] border-[#262626] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <i className="fa-solid fa-motorcycle text-sm"></i>
                      <span>Entrega ({currentNeighborhood.fee} MT)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeliveryOption('pickup');
                        if (showValidationError) setShowValidationError(false);
                      }}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        deliveryOption === 'pickup'
                          ? 'bg-[#FF6B00]/15 border-[#FF6B00] text-[#FF6B00]'
                          : 'bg-[#181818] border-[#262626] text-zinc-400 hover:text-white'
                      }`}
                    >
                      <i className="fa-solid fa-store text-sm"></i>
                      <span>Levantamento (Grátis)</span>
                    </button>
                  </div>
                </div>

                {/* Customer Form */}
                <div className="space-y-3 pt-3 border-t border-[#222222]">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Dados de Entrega & Contacto
                    </label>
                    <span className="text-[10px] text-zinc-500">* Obrigatório</span>
                  </div>

                  {/* Nome do Cliente - Destaque no topo */}
                  <div className="bg-[#1D1D1D] p-3 rounded-xl border border-[#2D2D2D] space-y-1.5 shadow-inner">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                        <i className="fa-solid fa-user text-[#FF6B00] text-xs"></i>
                        <span>Seu Nome *</span>
                      </label>
                      <span className="text-[10px] text-zinc-400 font-medium">Mín. 3 letras</span>
                    </div>
                    <input 
                      type="text" 
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (showValidationError) setShowValidationError(false);
                      }}
                      placeholder="Ex: João Silva"
                      className={`w-full bg-[#141414] border rounded-xl px-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                        showValidationError && customerName.trim().length < 3
                          ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30'
                          : 'border-[#2D2D2D] focus:border-[#FF6B00]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Telefone / WhatsApp
                    </label>
                    <input 
                      type="text" 
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (showValidationError) setShowValidationError(false);
                      }}
                      placeholder="Ex: +258 84 000 0000"
                      className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  {deliveryOption === 'delivery' && (
                    <>
                      {/* Maputo Neighborhood Dropdown */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-zinc-300">
                            Bairro em Maputo *
                          </label>
                          <span className="text-[#FF6B00] font-bold text-[11px] bg-[#FF6B00]/15 px-2 py-0.5 rounded border border-[#FF6B00]/25">
                            Taxa: {currentNeighborhood.fee} MT
                          </span>
                        </div>
                        <div className="relative">
                          <select
                            value={selectedNeighborhoodId}
                            onChange={(e) => {
                              setSelectedNeighborhoodId(e.target.value);
                              if (showValidationError) setShowValidationError(false);
                            }}
                            className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00] appearance-none cursor-pointer pr-9"
                          >
                            {MAPUTO_NEIGHBORHOODS.map(n => (
                              <option key={n.id} value={n.id} className="bg-[#181818] text-white">
                                {n.name} — {n.fee} MT
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                            <i className="fa-solid fa-chevron-down text-xs"></i>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-zinc-300">
                            Rua / Av., Edifício, nº da Porta *
                          </label>
                          <span className="text-[10px] text-zinc-400 font-medium">Mín. 3 caracteres</span>
                        </div>
                        <textarea 
                          rows={2}
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (showValidationError) setShowValidationError(false);
                          }}
                          placeholder="Ex: Av. Julius Nyerere, Edifício Tropical, 3º andar, porta 32"
                          className={`w-full bg-[#1A1A1A] border rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                            showValidationError && address.trim().length < 3
                              ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30'
                              : 'border-[#2D2D2D] focus:border-[#FF6B00]'
                          }`}
                        ></textarea>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Observações / Ponto de Referência
                    </label>
                    <input 
                      type="text" 
                      value={notes}
                      onChange={(e) => {
                        setNotes(e.target.value);
                        if (showValidationError) setShowValidationError(false);
                      }}
                      placeholder="Ex: Sem cebola, portão cinzento ao lado da farmácia"
                      className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  {showValidationError && (
                    <div className="text-xs text-red-400 font-medium bg-red-950/30 p-2.5 rounded-xl border border-red-800/40 flex items-start gap-2">
                      <i className="fa-solid fa-circle-exclamation text-red-400 mt-0.5 text-sm shrink-0"></i>
                      <span>
                        {deliveryOption === 'delivery'
                          ? 'Por favor preencha o seu nome e o endereço de entrega (mínimo de 3 caracteres cada).'
                          : 'Por favor preencha o seu nome (mínimo de 3 caracteres).'}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer & Total */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#222222] bg-[#181818] space-y-3">
              <div className="space-y-1 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-medium">{subtotal} MT</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxa de Entrega {deliveryOption === 'delivery' ? `(${currentNeighborhood.name})` : ''}:</span>
                  <span className="text-white font-medium">
                    {deliveryOption === 'delivery' ? `${currentNeighborhood.fee} MT` : 'Grátis (Levantamento)'}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#2A2A2A]">
                  <span>TOTAL:</span>
                  <span className="text-[#FF6B00]">{total} MT</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>Enviar Pedido via WhatsApp</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
