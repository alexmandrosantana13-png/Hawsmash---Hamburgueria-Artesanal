import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  FileText,
  Bike,
  Store,
  Car,
  Clock,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Calendar,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { CartItem, DeliveryMode, DeliveryZone } from '../types';
import { formatPrice } from '../data';
import { RESTAURANT_CONFIG } from '../config/restaurant';
import { DELIVERY_ZONES, DEFAULT_DELIVERY_ZONE_ID } from '../config/delivery';
import { DeliveryStep } from './DeliveryStep';
import { PaymentStep } from './PaymentStep';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onBackToCart?: () => void;
  onClearCart?: () => void;
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
  onClearCart,
  onSuccess,
}) => {
  const titleId = useId();
  const descriptionId = useId();

  // Support both onBack and onBackToCart
  const handleBack = onBack || onBackToCart;

  // Normalize inputs
  const items: CartItem[] = propItems || propCart || [];
  const initialMode: DeliveryMode = propOrderType || propDeliveryOption || 'delivery';

  // Checkout flow state:
  // Step 1: Delivery Mode & Schedule Time (DeliveryStep.tsx)
  // Step 2: Customer details & address
  // Step 3: Payment instructions with copy button (PaymentStep.tsx) & WhatsApp dispatch
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Delivery & Schedule state
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(initialMode);
  const [readyTime, setReadyTime] = useState<string>('asap');
  const [customTime, setCustomTime] = useState<string>('');
  const [timeError, setTimeError] = useState<string>('');

  // Synchronize initial mode when modal opens or prop changes
  useEffect(() => {
    if (isOpen) {
      if (propOrderType || propDeliveryOption) {
        setDeliveryMode(propOrderType || propDeliveryOption || 'delivery');
      }
      setCurrentStep(1);
    }
  }, [isOpen, propOrderType, propDeliveryOption]);

  const deliveryZones: DeliveryZone[] = 
    RESTAURANT_CONFIG.deliveryZones && RESTAURANT_CONFIG.deliveryZones.length > 0
      ? RESTAURANT_CONFIG.deliveryZones
      : DELIVERY_ZONES;

  const defaultZoneId = deliveryZones[0]?.id || DEFAULT_DELIVERY_ZONE_ID;

  // Customer form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedNeighborhoodId, setSelectedNeighborhoodId] = useState<string>(defaultZoneId);
  const [address, setAddress] = useState('');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  // Validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Resolve neighborhood and delivery fee
  const selectedNeighborhood: DeliveryZone =
    deliveryZones.find((n) => n.id === selectedNeighborhoodId) ||
    deliveryZones[0];

  // Fee calculation:
  // - delivery: neighborhood fee
  // - pickup: 0
  // - yango: 0 (paid directly to the Yango driver)
  const deliveryFee = deliveryMode === 'delivery' 
    ? (selectedNeighborhood?.fee ?? RESTAURANT_CONFIG.deliveryFee) 
    : 0;

  // Financial calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const total = subtotal + deliveryFee;

  // Clean WhatsApp number
  const cleanWhatsAppNumber = (
    RESTAURANT_CONFIG.contact.whatsappNumber ||
    '258879590556'
  ).replace(/\D/g, '');

  // Formatted string for ready time
  const getFormattedReadyTime = (): string => {
    if (readyTime === 'asap') {
      return 'O mais rápido possível (30-45 min)';
    }
    if (readyTime === 'custom') {
      return customTime.trim() ? `${customTime.trim()} (Horário marcado)` : 'Horário a combinar';
    }
    return `${readyTime} (Horário agendado)`;
  };

  // Step 1 -> Step 2 validation
  const handleProceedToStep2 = () => {
    if (readyTime === 'custom' && !customTime.trim()) {
      setTimeError('Por favor, indica a hora pretendida (ex: 13:30, 20:15).');
      return;
    }
    setTimeError('');
    setCurrentStep(2);
  };

  // Step 2 validation
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

    if (deliveryMode === 'delivery' || deliveryMode === 'yango') {
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

  // Step 2 -> Step 3 (Payment & Confirmation)
  const handleProceedToStep3 = () => {
    setTouched({
      name: true,
      phone: true,
      neighborhood: true,
      address: true,
    });

    if (validateForm()) {
      setCurrentStep(3);
    }
  };

  // Final Action: Send to WhatsApp
  const handleConfirmOrder = () => {
    // Build structured WhatsApp message
    let msg = `Olá, ${RESTAURANT_CONFIG.name}! Gostaria de fazer um pedido.\n\n`;

    // 1. Items section
    msg += `*PEDIDO*\n`;
    items.forEach((item) => {
      const meatPart = item.supportsMeatChoice && item.meatChoice ? ` [${item.meatChoice}]` : '';
      const obsPart = item.observation || item.notes ? ` (Obs: ${item.observation || item.notes})` : '';
      msg += `- ${item.quantity}x ${item.name}${meatPart} — ${formatPrice(item.unitPrice * item.quantity)} (${formatPrice(item.unitPrice)} un.)${obsPart}\n`;
    });
    msg += `\n`;

    // 2. Schedule and Fulfillment section
    msg += `*ENTREGA & HORÁRIO*\n`;
    if (deliveryMode === 'delivery') {
      msg += `Modalidade: 🛵 Entrega ao Domicílio (Estafeta Próprio)\n`;
    } else if (deliveryMode === 'pickup') {
      msg += `Modalidade: 🏪 Levantamento no Balcão (${RESTAURANT_CONFIG.address})\n`;
    } else {
      msg += `Modalidade: 🚗 Envio via Yango Flash (Pago ao motorista)\n`;
    }
    msg += `Horário pretendido: ⏰ ${getFormattedReadyTime()}\n\n`;

    // 3. Customer details section
    msg += `*DADOS DO CLIENTE*\n`;
    msg += `Nome: ${name.trim()}\n`;
    msg += `Telefone: ${phone.trim()}\n`;

    if (deliveryMode === 'delivery' || deliveryMode === 'yango') {
      msg += `Bairro: ${selectedNeighborhood.name}\n`;
      msg += `Endereço: ${address.trim()}\n`;
      if (reference.trim()) {
        msg += `Ponto de referência: ${reference.trim()}\n`;
      }
    } else {
      msg += `Local de Retirada: ${RESTAURANT_CONFIG.address}\n`;
    }

    if (notes.trim()) {
      msg += `Observação: ${notes.trim()}\n`;
    }
    msg += `\n`;

    // 4. Financial summary section
    msg += `*RESUMO*\n`;
    msg += `Subtotal: ${formatPrice(subtotal)}\n`;
    if (deliveryMode === 'delivery') {
      msg += `Taxa de entrega (${selectedNeighborhood.name}): ${formatPrice(deliveryFee)}\n`;
    } else if (deliveryMode === 'pickup') {
      msg += `Taxa de entrega: Grátis (Levantamento)\n`;
    } else {
      msg += `Taxa de entrega: A pagar ao motorista Yango\n`;
    }
    msg += `TOTAL: ${formatPrice(total)}\n\n`;

    // 5. Payment details section
    msg += `*PAGAMENTO (M-PESA / E-MOLA)*\n`;
    msg += `Número: ${RESTAURANT_CONFIG.payment.number}\n`;
    msg += `Titular: ${RESTAURANT_CONFIG.payment.accountName}\n\n`;

    msg += `Tempo Estimado de Cozinha: ${RESTAURANT_CONFIG.estimatedDeliveryTime}`;

    // Open WhatsApp
    const encodedMessage = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');

    if (onClearCart) {
      onClearCart();
    }
    if (onSuccess) {
      onSuccess();
    }
    onClose();
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
            {/* 1. Header with navigation controls and step progress */}
            <header className="p-3.5 sm:p-5 border-b border-[#222222] bg-[#181818] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {currentStep === 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    aria-label="Voltar para os dados do cliente"
                    className="p-1.5 sm:p-2 -ml-1 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] border border-[#2D2D2D] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Etapa 2</span>
                  </button>
                ) : currentStep === 2 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    aria-label="Voltar para a escolha de entrega e horário"
                    className="p-1.5 sm:p-2 -ml-1 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] border border-[#2D2D2D] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Etapa 1</span>
                  </button>
                ) : handleBack ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    aria-label="Voltar ao carrinho"
                    className="p-1.5 sm:p-2 -ml-1 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] border border-[#2D2D2D] text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Carrinho</span>
                  </button>
                ) : null}

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 
                      id={titleId}
                      className="font-display text-base sm:text-xl font-bold uppercase tracking-wider text-white leading-none truncate"
                    >
                      {currentStep === 1 && 'Entrega & Horário'}
                      {currentStep === 2 && 'Dados de Contacto'}
                      {currentStep === 3 && 'Pagamento & WhatsApp'}
                    </h2>
                    
                    {/* Step indicator */}
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 shrink-0">
                      Passo {currentStep} de 3
                    </span>
                  </div>
                  <p 
                    id={descriptionId}
                    className="text-[11px] sm:text-xs text-zinc-400 mt-0.5 sm:mt-1 truncate sm:whitespace-normal"
                  >
                    {currentStep === 1 && 'Escolhe como queres receber e o horário pretendido.'}
                    {currentStep === 2 && 'Informa os teus dados para podermos preparar o pedido.'}
                    {currentStep === 3 && 'Copia o número M-Pesa / e-Mola e envia o comprovativo no WhatsApp.'}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar finalização de pedido"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] border border-[#2D2D2D] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </header>

            {/* Stepper Progress Bar (3 Passos) */}
            <div className="grid grid-cols-3 bg-[#1A1A1A] border-b border-[#242424] text-[10px] sm:text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`py-1.5 sm:py-2 px-1.5 sm:px-2 text-center border-r border-[#242424] transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                  currentStep === 1 
                    ? 'bg-[#FF6B00]/10 text-[#FF6B00] border-b-2 border-b-[#FF6B00]' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-800 text-zinc-300 text-[9px] sm:text-[10px] flex items-center justify-center font-black shrink-0">
                  1
                </span>
                <span className="truncate">1. Horário</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToStep2}
                className={`py-1.5 sm:py-2 px-1.5 sm:px-2 text-center border-r border-[#242424] transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                  currentStep === 2 
                    ? 'bg-[#FF6B00]/10 text-[#FF6B00] border-b-2 border-b-[#FF6B00]' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-800 text-zinc-300 text-[9px] sm:text-[10px] flex items-center justify-center font-black shrink-0">
                  2
                </span>
                <span className="truncate">2. Dados</span>
              </button>

              <button
                type="button"
                onClick={handleProceedToStep3}
                className={`py-1.5 sm:py-2 px-1.5 sm:px-2 text-center transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                  currentStep === 3 
                    ? 'bg-[#FF6B00]/10 text-[#FF6B00] border-b-2 border-b-[#FF6B00]' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-zinc-800 text-zinc-300 text-[9px] sm:text-[10px] flex items-center justify-center font-black shrink-0">
                  3
                </span>
                <span className="truncate">3. Pagamento</span>
              </button>
            </div>

            {/* 2. Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-6">
              {currentStep === 1 && (
                /* ============================================================ */
                /* STEP 1: DeliveryStep Component                               */
                /* ============================================================ */
                <DeliveryStep
                  deliveryMode={deliveryMode}
                  onSelectDeliveryMode={(mode) => setDeliveryMode(mode)}
                  selectedTime={readyTime}
                  onSelectTime={(time) => {
                    setReadyTime(time);
                    if (time !== 'custom') {
                      setTimeError('');
                    }
                  }}
                  customTime={customTime}
                  onCustomTimeChange={(val) => {
                    setCustomTime(val);
                    if (val.trim()) {
                      setTimeError('');
                    }
                  }}
                  timeError={timeError}
                />
              )}

              {currentStep === 2 && (
                /* ============================================================ */
                /* STEP 2: Customer Data & Address                              */
                /* ============================================================ */
                <>
                  {/* Delivery & Schedule summary pill */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 flex items-center justify-center shrink-0">
                        {deliveryMode === 'delivery' && <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {deliveryMode === 'pickup' && <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        {deliveryMode === 'yango' && <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white capitalize truncate text-xs sm:text-sm">
                          {deliveryMode === 'delivery' && 'Entrega ao Domicílio'}
                          {deliveryMode === 'pickup' && 'Levantamento no Balcão'}
                          {deliveryMode === 'yango' && 'Envio via Yango Flash'}
                        </p>
                        <p className="text-[11px] text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#FF6B00] shrink-0" />
                          <span className="truncate">{getFormattedReadyTime()}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#FF6B00] hover:text-[#E55F00] font-semibold underline underline-offset-2 shrink-0 ml-2 cursor-pointer"
                    >
                      Alterar
                    </button>
                  </div>

                  {/* SECTION A: Customer Identification */}
                  <section className="space-y-2.5 sm:space-y-3.5">
                    <div className="flex items-center justify-between border-b border-[#242424] pb-1.5 sm:pb-2">
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 sm:gap-2">
                        <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B00]" />
                        <span>Identificação do Cliente</span>
                      </h3>
                      <span className="text-[10px] sm:text-[11px] text-zinc-500">* Obrigatório</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
                      {/* Name field */}
                      <div className="space-y-1">
                        <label 
                          htmlFor="customer-name" 
                          className="block text-xs font-semibold text-zinc-200"
                        >
                          Nome Completo *
                        </label>
                        <div className="relative">
                          <input
                            id="customer-name"
                            name="name"
                            autoComplete="name"
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
                            className={`w-full bg-[#1A1A1A] border rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
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
                      <div className="space-y-1">
                        <label 
                          htmlFor="customer-phone" 
                          className="block text-xs font-semibold text-zinc-200"
                        >
                          WhatsApp / Telefone *
                        </label>
                        <div className="relative">
                          <input
                            id="customer-phone"
                            name="tel"
                            autoComplete="tel"
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
                            className={`w-full bg-[#1A1A1A] border rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
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
                  <section className="space-y-2.5 sm:space-y-3.5">
                    <div className="flex items-center justify-between border-b border-[#242424] pb-1.5 sm:pb-2">
                      <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 sm:gap-2">
                        {deliveryMode === 'delivery' && (
                          <>
                            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B00]" />
                            <span>Endereço de Entrega (Estafeta Próprio)</span>
                          </>
                        )}
                        {deliveryMode === 'yango' && (
                          <>
                            <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                            <span>Endereço para Envio via Yango</span>
                          </>
                        )}
                        {deliveryMode === 'pickup' && (
                          <>
                            <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                            <span>Informações de Levantamento</span>
                          </>
                        )}
                      </h3>
                    </div>

                    {deliveryMode === 'delivery' || deliveryMode === 'yango' ? (
                      <div className="space-y-2.5 sm:space-y-3.5">
                        {/* Neighborhood Selector */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label 
                              htmlFor="delivery-neighborhood" 
                              className="block text-xs font-semibold text-zinc-200"
                            >
                              Bairro em {RESTAURANT_CONFIG.city} *
                            </label>
                            {deliveryMode === 'delivery' ? (
                              <span className="text-[#FF6B00] font-bold text-[10px] sm:text-[11px] bg-[#FF6B00]/15 px-2 py-0.5 rounded border border-[#FF6B00]/25">
                                Taxa: {formatPrice(selectedNeighborhood.fee)}
                              </span>
                            ) : (
                              <span className="text-yellow-400 font-bold text-[10px] sm:text-[11px] bg-yellow-500/15 px-2 py-0.5 rounded border border-yellow-500/25">
                                Yango Flash: Pago ao motorista
                              </span>
                            )}
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
                              className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#FF6B00] appearance-none cursor-pointer pr-10"
                            >
                              {deliveryZones.map((n) => (
                                <option key={n.id} value={n.id} className="bg-[#181818] text-white">
                                  {n.name} {deliveryMode === 'delivery' ? `— ${formatPrice(n.fee)}` : ''}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400">
                              <ChevronDown className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Address Field */}
                        <div className="space-y-1">
                          <label 
                            htmlFor="delivery-address" 
                            className="block text-xs font-semibold text-zinc-200"
                          >
                            Rua / Avenida, Edifício, Nº da Porta *
                          </label>
                          <input
                            id="delivery-address"
                            name="street-address"
                            autoComplete="street-address"
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
                            className={`w-full bg-[#1A1A1A] border rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
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
                        <div className="space-y-1">
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
                              className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Pickup Information Card */
                      <div className="bg-[#181818] border border-[#262626] rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="flex items-start gap-2.5 sm:gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                            <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="space-y-0.5 sm:space-y-1 min-w-0">
                            <p className="text-xs font-bold text-white uppercase tracking-wider">
                              Ponto de Levantamento no Balcão
                            </p>
                            <p className="text-xs sm:text-sm font-semibold text-zinc-200">
                              {RESTAURANT_CONFIG.address}
                            </p>
                            <p className="text-[11px] sm:text-xs text-zinc-400">
                              Horário agendado para retirada: <strong className="text-white">{getFormattedReadyTime()}</strong>
                            </p>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-[#242424] flex items-center justify-between text-xs text-zinc-400">
                          <span>Taxa de levantamento:</span>
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            GRÁTIS
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Additional Notes Field (Optional for both) */}
                    <div className="space-y-1 pt-0.5 sm:pt-1">
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
                        className="w-full bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl px-3 sm:px-3.5 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00]"
                      />
                    </div>
                  </section>

                  {/* Order Items Preview (Compact for mobile) */}
                  <section className="bg-[#181818] border border-[#262626] rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-[#282828] pb-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B00]" />
                        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                          Resumo ({items.reduce((acc, i) => acc + i.quantity, 0)} itens)
                        </h3>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-[#FF6B00] font-display">
                        Total: {formatPrice(total)}
                      </span>
                    </div>

                    <div className="space-y-1 max-h-24 sm:max-h-32 overflow-y-auto pr-1">
                      {items.map((item, idx) => (
                        <div 
                          key={`${item.id}-${idx}`}
                          className="flex items-center justify-between text-xs py-0.5 text-zinc-300"
                        >
                          <span className="truncate pr-2">
                            <strong className="text-[#FF6B00]">{item.quantity}x</strong> {item.name}
                          </span>
                          <span className="font-semibold text-white shrink-0">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {currentStep === 3 && (
                /* ============================================================ */
                /* STEP 3: PaymentStep Component                                */
                /* ============================================================ */
                <PaymentStep
                  total={total}
                  paymentNumber={RESTAURANT_CONFIG.payment.number}
                  accountName={RESTAURANT_CONFIG.payment.accountName}
                />
              )}
            </div>

            {/* 3. Modal Footer CTA */}
            <footer className="p-3.5 sm:p-5 border-t border-[#222222] bg-[#181818] space-y-2 shrink-0">
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={handleProceedToStep2}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00] active:scale-[0.99] text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B00]/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50"
                >
                  <span>Avançar para Identificação & Endereço</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              )}

              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleProceedToStep3}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00] active:scale-[0.99] text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B00]/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50"
                >
                  <span>Avançar para Pagamento (M-Pesa / e-Mola)</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              )}

              {currentStep === 3 && (
                <>
                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.99] text-white font-bold text-sm sm:text-base tracking-wide transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#25D366]/50"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span>Confirmar & Enviar Pedido no WhatsApp</span>
                  </button>

                  <p className="text-[11px] text-center text-zinc-500 leading-tight">
                    Ao clicar, o WhatsApp será aberto com o pedido completo e os dados de pagamento para envio do comprovativo.
                  </p>
                </>
              )}
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutModal;
