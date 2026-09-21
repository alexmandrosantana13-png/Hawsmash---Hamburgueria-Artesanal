import React, { useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Store, 
  Bike, 
  Car,
  MapPin 
} from 'lucide-react';
import { CartItem, DeliveryMode, MenuItem, MeatType } from '../types';
import { RESTAURANT_INFO, MENU_ITEMS, formatPrice } from '../data';
import { DrinkUpsell } from './DrinkUpsell';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Backward and forward compatibility: support both cart and items
  cart?: CartItem[];
  items?: CartItem[];
  // Quantity and item manipulation
  onUpdateQuantity: (index: number, delta: number) => void;
  onRemoveItem?: (index: number) => void;
  onClearCart?: () => void;
  onAddToCart?: (item: MenuItem, meatChoice: MeatType, price: number) => void;
  onAddDrink?: () => void;
  // Support both orderType and deliveryOption
  deliveryOption?: DeliveryMode;
  orderType?: DeliveryMode;
  setDeliveryOption?: (mode: DeliveryMode) => void;
  onOrderTypeChange?: (mode: DeliveryMode) => void;
  // Checkout progression
  onProceedToCheckout?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  items: propItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  onAddDrink: propOnAddDrink,
  deliveryOption,
  orderType,
  setDeliveryOption,
  onOrderTypeChange,
  onProceedToCheckout,
}) => {
  const titleId = useId();

  // Unified items list (prioritizing propItems, then cart)
  const items: CartItem[] = propItems || cart || [];

  // Unified delivery / pickup mode
  const currentOrderType: DeliveryMode = orderType || deliveryOption || 'delivery';
  const handleOrderTypeChange = onOrderTypeChange || setDeliveryOption || (() => {});

  // Total quantity count (sum of all item quantities)
  const totalQuantity = items.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  // Financial calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const deliveryFee = currentOrderType === 'delivery' ? RESTAURANT_INFO.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  // Safe item removal handler
  const handleRemove = (index: number) => {
    if (onRemoveItem) {
      onRemoveItem(index);
    } else {
      // Fallback using onUpdateQuantity: remove all units of that item
      onUpdateQuantity(index, -items[index].quantity);
    }
  };

  // Safe checkout progression handler
  const handleProceed = () => {
    if (onProceedToCheckout) {
      onProceedToCheckout();
    }
  };

  // Add drink handler for DrinkUpsell
  const handleAddDrink = () => {
    if (propOnAddDrink) {
      propOnAddDrink();
      return;
    }

    if (onAddToCart) {
      const cocaColaItem = MENU_ITEMS.find((m) => m.id === 'coca-cola') || {
        id: 'coca-cola',
        name: 'Coca-Cola Original (330ml)',
        category: 'drinks' as const,
        description: 'Lata 330ml gelada',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
        supportsMeatChoice: false,
        price: 100,
      };
      onAddToCart(cocaColaItem, 'HAW', 100);
      return;
    }

    // Direct fallback using onUpdateQuantity if item already exists
    const existingDrinkIndex = items.findIndex((i) => i.id === 'coca-cola');
    if (existingDrinkIndex > -1) {
      onUpdateQuantity(existingDrinkIndex, 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 overflow-hidden flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          {/* Backdrop with smooth fade */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel with smooth slide-in/out */}
          <motion.div
            key="cart-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative z-10 w-full sm:max-w-[430px] md:max-w-[448px] h-full bg-[#141414] border-l border-[#262626] text-white flex flex-col shadow-2xl overflow-hidden"
          >
            {/* 1. Header (Always Visible) */}
            <header className="p-4 sm:p-5 border-b border-[#222222] bg-[#181818] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/15 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] shadow-sm">
                  <ShoppingBag className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <h2 
                    id={titleId}
                    className="font-display text-xl font-bold uppercase tracking-wider text-white"
                  >
                    Seu Pedido
                  </h2>
                  <p className="text-xs text-zinc-400">
                    {totalQuantity === 0
                      ? 'O seu carrinho está vazio'
                      : totalQuantity === 1
                      ? '1 item no pedido'
                      : `${totalQuantity} itens no pedido`}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar carrinho"
                className="w-9 h-9 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] border border-[#2D2D2D] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* 2. Order Type Selector: Entrega / Levantamento / Yango (Always Visible) */}
            <div className="p-3.5 sm:p-4 bg-[#161616] border-b border-[#242424] shrink-0 space-y-2.5">
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#111111] rounded-xl border border-[#262626]">
                <button
                  type="button"
                  onClick={() => handleOrderTypeChange('delivery')}
                  aria-pressed={currentOrderType === 'delivery'}
                  className={`py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 transition-all cursor-pointer ${
                    currentOrderType === 'delivery'
                      ? 'bg-[#FF6B00] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Bike className="w-3.5 h-3.5 shrink-0" />
                    Entrega
                  </span>
                  <span className={currentOrderType === 'delivery' ? 'text-white/95 font-extrabold text-[10px]' : 'text-zinc-500 text-[10px]'}>
                    {formatPrice(RESTAURANT_INFO.deliveryFee)}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOrderTypeChange('pickup')}
                  aria-pressed={currentOrderType === 'pickup'}
                  className={`py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 transition-all cursor-pointer ${
                    currentOrderType === 'pickup'
                      ? 'bg-[#FF6B00] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Store className="w-3.5 h-3.5 shrink-0" />
                    Balcão
                  </span>
                  <span className={currentOrderType === 'pickup' ? 'text-white/95 font-extrabold text-[10px]' : 'text-emerald-400 font-extrabold text-[10px]'}>
                    Grátis
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOrderTypeChange('yango')}
                  aria-pressed={currentOrderType === 'yango'}
                  className={`py-2 px-2 rounded-lg text-[11px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-1 transition-all cursor-pointer ${
                    currentOrderType === 'yango'
                      ? 'bg-[#FF6B00] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 shrink-0" />
                    Yango
                  </span>
                  <span className={currentOrderType === 'yango' ? 'text-white/95 font-extrabold text-[10px]' : 'text-yellow-400 font-extrabold text-[10px]'}>
                    App
                  </span>
                </button>
              </div>

              {/* Informative notification when Pickup or Yango is selected */}
              {currentOrderType === 'pickup' && (
                <div className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg bg-[#1D1D1D] text-[11px] text-zinc-300 border border-[#2A2A2A]">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B00] shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    Levantamento no balcão: <strong className="text-white font-semibold">{RESTAURANT_INFO.address}</strong>
                  </span>
                </div>
              )}
              {currentOrderType === 'yango' && (
                <div className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg bg-[#1D1D1D] text-[11px] text-yellow-300 border border-[#2A2A2A]">
                  <Car className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">
                    Envio por <strong>Yango Flash</strong> — o valor da entrega é pago diretamente ao motorista.
                  </span>
                </div>
              )}
            </div>

            {/* 3. Product List (Scrollable Area) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 min-h-0">
              {items.length === 0 ? (
                /* Empty Cart State */
                <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center space-y-4 py-12">
                  <div className="w-16 h-16 rounded-2xl bg-[#1C1C1C] border border-[#282828] flex items-center justify-center text-zinc-500 shadow-inner">
                    <ShoppingBag className="w-8 h-8 text-[#FF6B00]" />
                  </div>
                  <div className="space-y-1 max-w-[260px]">
                    <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                      O seu carrinho está vazio
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Adicione os seus favoritos para começar o pedido.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00] active:scale-95 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF6B00]/20 cursor-pointer"
                  >
                    Ver cardápio
                  </button>
                </div>
              ) : (
                /* Cart Items List */
                items.map((item, idx) => {
                  // Resolve product image from item itself or find in MENU_ITEMS
                  const matchedMenuItem = MENU_ITEMS.find(m => m.id === item.id);
                  const itemImage = item.image || matchedMenuItem?.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80";

                  return (
                    <div
                      key={`${item.id}-${item.meatChoice || 'standard'}-${idx}`}
                      className="bg-[#181818] hover:bg-[#1A1A1A] border border-[#262626] hover:border-[#333333] p-3 sm:p-3.5 rounded-2xl flex gap-3 transition-colors shadow-sm"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-[#222222] border border-[#2B2B2B] shrink-0">
                        <img
                          src={itemImage}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                      </div>

                      {/* Product Details & Actions */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        {/* Title, Variant & Remove */}
                        <div>
                          <div className="flex items-start justify-between gap-1.5">
                            <h4 className="font-bold text-xs sm:text-sm text-white truncate leading-snug">
                              {item.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleRemove(idx)}
                              aria-label={`Remover ${item.name} do carrinho`}
                              title="Remover item"
                              className="text-zinc-500 hover:text-red-400 p-1 rounded-md transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Meat Variant */}
                          {item.supportsMeatChoice && item.meatChoice && (
                            <p className="text-[11px] text-[#FF6B00] font-bold mt-0.5">
                              Opção: {item.meatChoice}
                            </p>
                          )}

                          {/* Unit Price */}
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {formatPrice(item.unitPrice)} por unidade
                          </p>

                          {/* Observations / Notes if present */}
                          {(item.observation || item.notes) && (
                            <p className="text-[11px] text-zinc-400 italic mt-1 bg-[#121212] px-2 py-0.5 rounded border border-[#242424] truncate">
                              Obs: {item.observation || item.notes}
                            </p>
                          )}
                        </div>

                        {/* Quantity Stepper & Subtotal */}
                        <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-[#242424]">
                          <div className="flex items-center gap-1 bg-[#111111] p-0.5 rounded-lg border border-[#262626]">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, -1)}
                              aria-label={`Diminuir quantidade de ${item.name}`}
                              className="w-6 h-6 rounded bg-[#1C1C1C] hover:bg-[#282828] text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-white tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(idx, 1)}
                              aria-label={`Aumentar quantidade de ${item.name}`}
                              className="w-6 h-6 rounded bg-[#FF6B00] hover:bg-[#E55F00] text-white flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-sm font-bold text-white font-display tracking-wide">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* 4. Financial Summary & Main Action Button (Always Visible when items exist) */}
            {items.length > 0 && (
              <footer className="p-4 sm:p-5 border-t border-[#222222] bg-[#161616] space-y-3 shrink-0">
                {/* Drink Upsell Suggestion */}
                <DrinkUpsell onAddDrink={handleAddDrink} />

                <div className="space-y-2 text-xs">
                  {/* Subtotal */}
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-zinc-200 font-semibold">{formatPrice(subtotal)}</span>
                  </div>

                  {/* Delivery Fee or Free Pickup or Yango */}
                  {currentOrderType === 'delivery' && (
                    <div className="flex justify-between text-zinc-400">
                      <span>Taxa de entrega</span>
                      <span className="text-zinc-200 font-semibold">{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  {currentOrderType === 'pickup' && (
                    <div className="flex justify-between text-zinc-400">
                      <span>Levantamento</span>
                      <span className="text-emerald-400 font-semibold">Grátis</span>
                    </div>
                  )}
                  {currentOrderType === 'yango' && (
                    <div className="flex justify-between text-zinc-400">
                      <span>Envio via Yango</span>
                      <span className="text-yellow-400 font-semibold">Pago ao motorista</span>
                    </div>
                  )}

                  {/* Total Highlight */}
                  <div className="pt-2.5 border-t border-[#262626] flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white uppercase tracking-wider font-display">
                      Total
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-[#FF6B00] font-display tracking-wide">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Main Action Button */}
                <button
                  type="button"
                  onClick={handleProceed}
                  className="w-full py-3 px-4 rounded-xl bg-[#FF6B00] hover:bg-[#E55F00] active:scale-[0.99] text-white font-bold text-sm tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B00]/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/50"
                >
                  <span>Avançar para Dados & Entrega</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default CartDrawer;
