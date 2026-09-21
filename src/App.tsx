import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { HawsmashStandards } from './components/HawsmashStandards';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { MENU_ITEMS } from './data';
import { CartItem, MenuItem, MeatType, DeliveryMode } from './types';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [meatSelections, setMeatSelections] = useState<Record<string, MeatType>>({
    "classic-smash": "HAW",
    "double-smash": "HAW",
    "smoked-brisket": "HAW",
    "hawsmash-signature": "HAW",
    "truffle-smash": "HAW"
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryMode>("delivery");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Trigger toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Meat Selection toggle per item
  const handleToggleMeat = (itemId: string, type: MeatType) => {
    setMeatSelections(prev => ({
      ...prev,
      [itemId]: type
    }));
  };

  // Add to cart
  const handleAddToCart = (item: MenuItem, meatChoice: MeatType, price: number) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        i => i.id === item.id && (!item.supportsMeatChoice || i.meatChoice === meatChoice)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, {
          id: item.id,
          name: item.name,
          supportsMeatChoice: item.supportsMeatChoice,
          meatChoice: item.supportsMeatChoice ? meatChoice : null,
          unitPrice: price,
          quantity: 1
        }];
      }
    });

    showToast(`Adicionado ao carrinho: ${item.name} ${item.supportsMeatChoice ? `[${meatChoice}]` : ''}`);
  };

  // Quantity adjusters
  const handleUpdateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        updated.splice(index, 1);
      } else {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  // Clear cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Add drink upsell handler
  const handleAddDrink = () => {
    const cocaColaItem = MENU_ITEMS.find(m => m.id === 'coca-cola') || {
      id: 'coca-cola',
      name: 'Coca-Cola Original (330ml)',
      category: 'drinks' as const,
      description: 'Lata 330ml extremamente gelada para acompanhar o seu smash.',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
      supportsMeatChoice: false,
      price: 100
    };
    handleAddToCart(cocaColaItem, 'HAW', 100);
  };

  // Categories list
  const categories = [
    { id: "all", name: "Todos os Itens", icon: "fa-border-all" },
    { id: "burgers", name: "Hambúrgueres Artesanais", icon: "fa-burger" },
    { id: "sides", name: "Acompanhamentos & Extras", icon: "fa-utensils" },
    { id: "desserts", name: "Sobremesas", icon: "fa-ice-cream" },
    { id: "drinks", name: "Bebidas", icon: "fa-bottle-water" }
  ];

  // Filtered items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter(item => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Cart Totals
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#111111] text-zinc-200">
      {/* Header */}
      <Header 
        cartCount={cartCount} 
        cartTotal={cartTotal} 
        onOpenCart={() => setIsCartOpen(true)} 
      />

      {/* Hero Section */}
      <Hero />

      {/* Menu Navigation & Search */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00]">Cardápio Digital</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-wider mt-1">
              Escolha o seu <span className="text-[#FF6B00]">Smash</span>
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm"></i>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar hambúrguer, molho..."
              className="w-full bg-[#181818] border border-[#2A2A2A] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B00] transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 border-b border-[#222222]">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20"
                  : "bg-[#181818] hover:bg-[#222222] border border-[#262626] text-zinc-400 hover:text-white"
              }`}
            >
              <i className={`fa-solid ${cat.icon} text-sm`}></i>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-[#181818] rounded-2xl border border-[#262626]">
            <i className="fa-solid fa-magnifying-glass text-4xl text-zinc-600"></i>
            <p className="text-zinc-400 font-medium text-sm">Nenhum item encontrado para &quot;{searchQuery}&quot;.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
              className="text-xs text-[#FF6B00] font-bold hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <ProductCard 
                key={item.id}
                item={item}
                currentMeat={meatSelections[item.id] || "HAW"}
                onToggleMeat={handleToggleMeat}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* "O Padrão Hawsmash" Section */}
      <HawsmashStandards />

      {/* Footer Info Grid */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onClearCart={handleClearCart}
        onAddToCart={handleAddToCart}
        onAddDrink={handleAddDrink}
        deliveryOption={deliveryOption}
        setDeliveryOption={setDeliveryOption}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onBack={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        cart={cart}
        deliveryOption={deliveryOption}
        onClearCart={handleClearCart}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#FF6B00] text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-bounce">
          <i className="fa-solid fa-circle-check text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
