import React, { useState, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Home,
  FileText,
  Bike,
  Store,
  AlertCircle,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { CartItem, DeliveryMode } from '../types';
import { 
  RESTAURANT_INFO, 
  MAPUTO_NEIGHBORHOODS, 
  formatPrice, 
  Neighborhood 
} from '../data';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onBackToCart?: () => void;
  // Accept both items and cart for maximum compatibility
  items?: CartItem[];
  cart?: CartItem[];
  // Accept both orderType and deliveryOption
  orderType?: DeliveryMode;
  deliveryOption?: DeliveryMode;
  onSuccess?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onBackToCart,
  items: propItems,
  cart: propCart,
  orderType: propOrderType,
  deliveryOption: propDeliveryOption,
  onSuccess,
}) => {
  const titleId = useId();
  const descriptionId = useId();

  // Support both onBack and onBackToCart
  const handleBack = onBack || onBackToCart;

  // Normalize inputs
  const items: CartItem[] = propItems || propCart || [];
  const currentOrderType: DeliveryMode = propOrderType || propDeliveryOption || 'delivery';

  // Customer form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>('polana-cimento');
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Resolve neighborhood and delivery fee
  const selectedNeighborhood: Neighborhood =
    MAPUTO_NEIGHBORHOODS.find((n) => n.id === selectedNeighborhoodId) ||
    MAPUTO_NEIGHBORHOODS[0];

  const deliveryFee = currentOrderType === 'delivery' 
    ? (selectedNeighborhood?.fee ?? RESTAURANT_INFO.deliveryFee) 
    : 0;

  // Financial calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  // Clean WhatsApp number (extracting only digits from RESTAURANT_INFO.phone)
  const cleanWhatsAppNumber = (
    RESTAURANT_INFO.phone ||
    RESTAURANT_INFO.whatsappNumber ||
    '258860760009'
  ).replace(/\D/g, '');

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'O nome completo é obrigatório.';
    } else if (name.trim().length < 3) {
      newErrors.name = 'Por favor, insira pelo menos 3 caracteres.';
    }

    const digitsOnlyPhone = phone.replace(/\D/g, '');
    if (!phone.trim()) {
      newErrors.phone = 'O número de telefone/WhatsApp é obrigatório.';
    } else if (digitsOnlyPhone.length < 7) {
      newErrors.phone = 'Insira um número de telefone válido (mínimo 7 dígitos).';
    }

    if (currentOrderType === 'delivery') {
      if (!selectedNeighborhoodId) {
        newErrors.neighborhood = 'Selecione o bairro de entrega.';
      }
      if (!address.trim()) {
        newErrors.address = 'O endereço (rua, número ou prédio) é obrigatório.';
      } else if (address.trim().length < 3) {
        newErrors.address = 'Insira um endereço mais detalhado.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const handleConfirmOrder = () => {
    // Mark all required fields as touched
    setTouched({
      name: true,
      phone: true,
      neighborhood: true,
      address: true,
    });

    if (!validateForm()) {
      return;
    }

    // Build structured WhatsApp message
    let msg = `Olá, HAWSMASH! Gostaria de fazer um pedido.\n\n`;

    // 1. Items section
    msg += `*PEDIDO*\n`;
    items.forEach((item) => {
      const meatPart = item.supportsMeatChoice && item.meatChoice ? ` [${item.meatChoice}]` : '';
      const obsPart = item.observation || item.notes ? ` (Obs: ${item.observation || item.notes})` : '';
      msg += `- ${item.quantity}x ${item.name}${meatPart} — ${formatPrice(item.unitPrice * item.quantity)} (${formatPrice(item.unitPrice)} un.)${obsPart}\n`;
    });
    msg += `\n`;

    // 2. Customer details section
    msg += `*DADOS DO CLIENTE*\n`;
    msg += `Nome: ${name.trim()}\n`;
    msg += `Telefone: ${phone.trim()}\n`;

    if (currentOrderType === 'delivery') {
      msg += `Bairro: ${selectedNeighborhood.name}\n`;
      msg += `Endereço: ${address.trim()}\n`;
      if (reference.trim()) {
        msg += `Ponto de referência: ${reference.trim()}\n`;
      }
    } else {
      msg += `Local de Retirada: ${RESTAURANT_INFO.address}\n`;
    }

    if (notes.trim()) {
      msg += `Observação: ${notes.trim()}\n`;
    }
    msg += `\n`;

    // 3. Financial summary section
    msg += `*RESUMO*\n`;
    msg += `Subtotal: ${formatPrice(subtotal)}\n`;
    if (currentOrderType === 'delivery') {
      msg += `Taxa de entrega (${selectedNeighborhood.name}): ${formatPrice(deliveryFee)}\n`;
    } else {
      msg += `Taxa de entrega: Grátis (Levantamento)\n`;
    }
    msg += `TOTAL: ${formatPrice(total)}\n\n`;

    // 4. Order mode
    msg += `Modalidade: ${currentOrderType === 'delivery' ? 'Entrega ao Domicílio' : 'Levantamento no Balcão'}\n`;
    msg += `Tempo Estimado: ${RESTAURANT_INFO.estimatedDeliveryTime}`;

    // Open WhatsApp
    const encodedMessage = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
        >
          {/* Backdrop with smooth fade */}
          <motion.div
            key="checkout-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <motion.div
            key="checkout-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="relative z-10 w-full max-w-xl bg-[#141414] border border-[#262626] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden text-white"
          >
            {/* 1. Header with navigation controls */}
            <header className="p-4 sm:p-5 border-b border-[#222222] bg-[#181818] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                {handleBack && (
                  <button
                    type="button"
                    onClick={handleBack}
                    aria-label="Voltar ao carrinho"
                    className="p-2 -ml-1 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] border border-[#2D2D2D] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Voltar</span>
                  </button>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <h2 
                      id={titleId}
                      className="font-display text-xl sm:text-2xl font-bold uppercase tracking-wider text-white leading-none"
                    >
                      Finalizar Pedido
                    </h2>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${
                      currentOrderType === 'delivery' 
                        ? 'bg-[#FF6B00]/15 text-[#FF6B00] border-[#FF6B00]/30' 
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {currentOrderType === 'delivery' ? (
                        <>
                          <Bike className="w-3 h-3" />
                          Entrega
                        </>
                      ) : (
                        <>
                          <Store className="w-3 h-3" />
                          Levantamento
                        </>
                      )}
                    </span>
                  </div>
                  <p 
                    id={descriptionId}
                    className="text-xs text-zinc-400 mt-1"
                  >
                    Preencha os seus dados para receber o pedido.
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar finalização de pedido"
                className="w-9 h-9 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] border border-[#2D2D2D] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* 2. Scrollable Body: Form & Order Summary */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* SECTION A: Customer Identification */}
              <section className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#FF6B00]" />
                    <span>Identificação do Cliente</span>
                  </h3>
                  <span className="text-[11px] text-zinc-500">* Campos obrigatórios</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="customer-name" 
                      className="block text-xs font-semibold text-zinc-200"
                    >
                      Nome Completo *
                    </label>
                    <div className="relative">
                      <input
                        id="customer-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) {
                            setErrors((prev) => ({ ...prev, name: '' }));
                          }
                        }}
                        onBlur={() => handleBlur('name')}
                        placeholder="Ex: Carlos Mandlate"
                        aria-invalid={Boolean(touched.name && errors.name)}
                        className={`w-full bg-[#1A1A1A] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                          touched.name && errors.name
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30'
                            : 'border-[#2D2D2D] focus:border-[#FF6B00]'
                        }`}
                      />
                    </div>
                    {touched.name && errors.name && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1.5">
                    <label 
                      htmlFor="customer-phone" 
                      className="block text-xs font-semibold text-zinc-200"
                    >
                      WhatsApp / Telefone *
                    </label>
                    <div className="relative">
                      <input
                        id="customer-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) {
                            setErrors((prev) => ({ ...prev, phone: '' }));
                          }
                        }}
                        onBlur={() => handleBlur('phone')}
                        placeholder="Ex: +258 84 123 4567"
                        aria-invalid={Boolean(touched.phone && errors.phone)}
                        className={`w-full bg-[#1A1A1A] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                          touched.phone && errors.phone
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30'
                            : 'border-[#2D2D2D] focus:border-[#FF6B00]'
                        }`}
                      />
                    </div>
                    {touched.phone && errors.phone && (
                      <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION B: Delivery or Pickup Details */}
              <section className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                    {currentOrderType === 'delivery' ? (
                      <>
                        <MapPin className="w-4 h-4 text-[#FF6B00]" />
                        <span>Endereço de Entrega</span>
                      </>
                    ) : (
                      <>
                        <Store className="w-4 h-4 text-[#FF6B00]" />
                        <span>Informações de Levantamento</span>
                      </>
                    )}
                  </h3>
                </div>

                {currentOrderType === 'delivery' ? (
                  <div className="space-y-3 sm:space-y-4">
                    {/* Neighborhood Selector */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label 
                          htmlFor="delivery-neighborhood" 
                          className="block text-xs font-semibold text-zinc-200"
                        >
                          Bairro em Maputo *
                        </label>
                        <span className="text-[#FF6B00] font-bold text-[11px] bg-[#FF6B00]/15 px-2 py-0.5 rounded border border-[#FF6B00]/25">
                          Taxa: {formatPrice(selectedNeighborhood.fee)}
                        </span>
                      </div>
                      <div className="relative">
                        <select
                          id="delivery-neighborhood"
                          value={selectedNeighborhoodId}
                          onChange={(e) => {
                            setSelectedNeighborhoodId(e.target.value);
                            if (errors.neighborhood) {
                              setErrors((prev) => ({ ...prev, neighborhood: '' }));
                            }
                          }}
                          className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00] appearance-none cursor-pointer pr-10"
                        >
                          {MAPUTO_NEIGHBORHOODS.map((n) => (
                            <option key={n.id} value={n.id} className="bg-[#181818] text-white">
                              {n.name} — {formatPrice(n.fee)}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                          <i className="fa-solid fa-chevron-down text-xs"></i>
                        </div>
                      </div>
                    </div>

                    {/* Address Field */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="delivery-address" 
                        className="block text-xs font-semibold text-zinc-200"
                      >
                        Rua / Avenida, Edifício, Nº da Porta *
                      </label>
                      <input
                        id="delivery-address"
                        type="text"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (errors.address) {
                            setErrors((prev) => ({ ...prev, address: '' }));
                          }
                        }}
                        onBlur={() => handleBlur('address')}
                        placeholder="Ex: Av. Julius Nyerere, Edifício Tropical, 3º andar, porta 32"
                        aria-invalid={Boolean(touched.address && errors.address)}
                        className={`w-full bg-[#1A1A1A] border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                          touched.address && errors.address
                            ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500/30'
                            : 'border-[#2D2D2D] focus:border-[#FF6B00]'
                        }`}
                      />
                      {touched.address && errors.address && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-3 h-3 shrink-0" />
                          <span>{errors.address}</span>
                        </p>
                      )}
                    </div>

                    {/* Reference Point Field (Optional) */}
                    <div className="space-y-1.5">
                      <label 
                        htmlFor="delivery-reference" 
                        className="block text-xs font-semibold text-zinc-400"
                      >
                        Ponto de Referência <span className="text-zinc-600 font-normal">(Opcional)</span>
                      </label>
                      <div className="relative">
                        <input
                          id="delivery-reference"
                          type="text"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          placeholder="Ex: Portão preto em frente à Farmácia Central"
                          className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Pickup Information Card */
                  <div className="bg-[#181818] border border-[#262626] rounded-2xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white uppercase tracking-wider">
                          Ponto de Levantamento no Balcão
                        </p>
                        <p className="text-sm font-semibold text-zinc-200">
                          {RESTAURANT_INFO.address}
                        </p>
                        <p className="text-xs text-zinc-400">
                          Tempo estimado para preparação: <strong className="text-white">{RESTAURANT_INFO.estimatedDeliveryTime}</strong>
                        </p>
                      </div>
                    </div>
                    <div className="pt-2.5 border-t border-[#242424] flex items-center justify-between text-xs text-zinc-400">
                      <span>Taxa de levantamento:</span>
                      <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        GRÁTIS
                      </span>
                    </div>
                  </div>
                )}

                {/* Additional Notes Field (Optional for both) */}
                <div className="space-y-1.5 pt-1">
                  <label 
                    htmlFor="order-notes" 
                    className="block text-xs font-semibold text-zinc-400"
                  >
                    Observações Adicionais do Pedido <span className="text-zinc-600 font-normal">(Opcional)</span>
                  </label>
                  <textarea
                    id="order-notes"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Por favor sem pickles no hambúrguer, maionese à parte..."
                    className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
                  />
                </div>
              </section>

              {/* SECTION C: Order Review (Items & Totals) */}
              <section className="bg-[#181818] border border-[#262626] rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#282828] pb-2.5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#FF6B00]" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                      Resumo do Pedido ({items.reduce((acc, i) => acc + i.quantity, 0)} itens)
                    </h3>
                  </div>
                  {handleBack && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="text-xs text-[#FF6B00] hover:text-[#E55F00] font-semibold cursor-pointer"
                    >
                      Editar carrinho
                    </button>
                  )}
                </div>

                {/* Mini Item List */}
                <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div 
                      key={`${item.id}-${idx}`}
                      className="flex items-center justify-between text-xs py-1 border-b border-[#222222] last:border-none"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="font-extrabold text-[#FF6B00]">{item.quantity}x</span>
                        <span className="text-zinc-200 font-medium truncate">{item.name}</span>
                        {item.supportsMeatChoice && item.meatChoice && (
                          <span className="text-[10px] font-bold bg-[#FF6B00]/15 text-[#FF6B00] px-1 rounded border border-[#FF6B00]/25 shrink-0">
                            {item.meatChoice}
                          </span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-white">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          ({formatPrice(item.unitPrice)} un.)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="pt-3 border-t border-[#282828] space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal geral</span>
                    <span className="text-zinc-200 font-semibold">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-zinc-400">
                    <span>
                      {currentOrderType === 'delivery' 
                        ? `Taxa de entrega (${selectedNeighborhood.name})` 
                        : 'Levantamento no balcão'}
                    </span>
                    <span className={currentOrderType === 'delivery' ? 'text-zinc-200 font-semibold' : 'text-emerald-400 font-semibold'}>
                      {currentOrderType === 'delivery' ? formatPrice(deliveryFee) : 'Grátis'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#262626] flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white uppercase tracking-wider font-display">
                      TOTAL A PAGAR
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#FF6B00] font-display tracking-wide">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* 3. Modal Footer: Confirmation CTA */}
            <footer className="p-4 sm:p-5 border-t border-[#222222] bg-[#181818] space-y-2 shrink-0">
              <button
                type="button"
                onClick={handleConfirmOrder}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>Confirmar pedido pelo WhatsApp</span>
              </button>

              <p className="text-[11px] text-center text-zinc-500 leading-tight">
                Ao clicar, você será redirecionado para o WhatsApp da Hawsmash com o seu pedido já formatado.
              </p>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
