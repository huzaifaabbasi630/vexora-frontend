import { useState, useEffect } from 'react'
import {
  ArrowRight,
  Menu,
  X,
  Search,
  ShoppingBag,
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Sun,
  Moon,
  Heart,
  Eye,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  UserRound,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { footerNavigation, primaryNavigation } from '../data/navigation'
import { homeHeroImages, trendingCategoryDefaults } from '../data/brandMedia'
import { API_BASE_URL } from '../config/api.js'

// ---------------------------------------------
// DATA
// ---------------------------------------------

const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#e8dfd5"/><text x="50%" y="48%" text-anchor="middle" fill="#6f4e37" font-family="Georgia,serif" font-size="54" letter-spacing="8">VEXORA</text><text x="50%" y="55%" text-anchor="middle" fill="#6f4e37" font-family="Arial,sans-serif" font-size="22" letter-spacing="3">IMAGE UNAVAILABLE</text></svg>'
)}`

const navLinks = primaryNavigation

const marketingConfig = {
  shippingMessage: 'Free Nationwide Shipping Across Pakistan',
  cashOnDelivery: true,
  sale: {
    enabled: true,
    label: 'Flash Sale',
    endTimestamp: '2026-12-31T23:59:59+05:00',
    summaryText: 'Ends soon',
  },
}

const testimonials = [
  { name: 'Abdullah Khan', city: 'Karachi', comment: 'The quality of the Kashmiri Jubbe is phenomenal! Delivered on time with COD.', rating: 5 },
  { name: 'Hamza Siddiqui', city: 'Lahore', comment: 'Vexora streetwear collection is unmatched. Clean stitching and premium fit.', rating: 5 },
  { name: 'Usman Ali', city: 'Islamabad', comment: 'Super smooth ordering and luxury packaging. Highly recommended.', rating: 4.9 },
]

const { quickLinks, customerCare, whyVexora } = footerNavigation

// ---------------------------------------------
// SHARED ANIMATION VARIANTS
// ---------------------------------------------

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

export function TrendingCategories({ categories = trendingCategoryDefaults, loading = false }) {
  return (
    <motion.section
      className="mt-12"
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">Trending Categories</h2>
        <a href="/shop" className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">View All <ArrowRight size={14} /></a>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }, (_, index) => <CategoryCardSkeleton key={index} />)
        ) : categories.map((cat) => (
          <motion.div
            key={cat.name}
            onClick={() => { window.location.href = `/shop?category=${encodeURIComponent(cat.name)}` }}
            variants={fadeUp}
            className="group relative cursor-pointer overflow-hidden rounded-[16px] border border-[#e2d7cf] bg-white/60 dark:border-[#33251e] dark:bg-[#1a1512]"
          >
            <div className="relative h-[220px]">
              <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-0 p-4 text-white">
              <span className="font-display text-xl">{cat.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

// ---------------------------------------------
// COMPONENTS
// ---------------------------------------------

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[16px] border border-[#e2d7cf] dark:border-[#33251e] bg-white/70 dark:bg-[#1a1512] p-3 shadow-sm">
      <div className="relative overflow-hidden rounded-[12px] bg-[#efe8e2] dark:bg-[#261d18] h-[240px] animate-pulse">
        <div className="absolute left-3 top-3 h-5 w-16 rounded-full bg-black/20" />
        <div className="absolute right-3 top-3 h-6 w-6 rounded-full bg-black/20" />
      </div>
      <div className="pt-3">
        <div className="h-4 bg-[#e8dfd5] dark:bg-[#33251e] rounded animate-pulse mb-2" />
        <div className="h-4 w-3/4 bg-[#e8dfd5] dark:bg-[#33251e] rounded animate-pulse mb-3" />
        <div className="h-5 w-1/3 bg-[#e8dfd5] dark:bg-[#33251e] rounded animate-pulse mb-2" />
        <div className="h-3 w-1/4 bg-[#e8dfd5] dark:bg-[#33251e] rounded animate-pulse" />
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#e2d7cf]/40 dark:border-[#33251e]">
          <div className="flex gap-1.5">
            <div className="h-3.5 w-3.5 rounded-full bg-[#e8dfd5] dark:bg-[#33251e] animate-pulse" />
            <div className="h-3.5 w-3.5 rounded-full bg-[#e8dfd5] dark:bg-[#33251e] animate-pulse" />
            <div className="h-3.5 w-3.5 rounded-full bg-[#e8dfd5] dark:bg-[#33251e] animate-pulse" />
          </div>
          <div className="h-8 w-24 rounded-full bg-[#e8dfd5] dark:bg-[#33251e] animate-pulse" />
        </div>
      </div>
    </div>
  )
}

function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[16px] border border-[#e2d7cf] dark:border-[#33251e] bg-white/60 dark:bg-[#1a1512]">
      <div className="relative h-[220px] animate-pulse bg-[#e8dfd5] dark:bg-[#261d18]" />
      <div className="absolute bottom-0 p-4">
        <div className="h-6 w-32 bg-black/30 rounded animate-pulse" />
      </div>
    </div>
  )
}

function AnnouncementBar() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!marketingConfig.sale.enabled) return

    const getRemainingTime = () => {
      const target = new Date(marketingConfig.sale.endTimestamp).getTime()
      const now = Date.now()
      const delta = Math.max(target - now, 0)

      return {
        hours: Math.floor(delta / (1000 * 60 * 60)),
        minutes: Math.floor((delta / (1000 * 60)) % 60),
        seconds: Math.floor((delta / 1000) % 60),
      }
    }

    const updateCountdown = () => setTimeLeft(getRemainingTime())
    updateCountdown()

    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  const pad = (n) => String(Math.max(0, n)).padStart(2, '0')

  return (
    <div className="bg-[#5c4a3a] text-[#f3efe9] py-2 text-center text-[11px] tracking-[0.18em] uppercase font-medium flex flex-wrap items-center justify-center gap-2 px-4">
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true">🚚</span>
        <span>{marketingConfig.shippingMessage}</span>
        {marketingConfig.cashOnDelivery && <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5">COD Available</span>}
      </span>

      {marketingConfig.sale.enabled && timeLeft.hours >= 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.15em] text-amber-200">
          <span aria-hidden="true">⚡</span>
          {marketingConfig.sale.label}: {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
      )}
    </div>
  )
}

function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScroll = () => {
      const currentScroll = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setScrollProgress((currentScroll / scrollHeight) * 100)
      }
    }
    window.addEventListener('scroll', updateScroll)
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-transparent">
      <div className="h-full bg-amber-600 transition-all duration-75" style={{ width: `${scrollProgress}%` }} />
    </div>
  )
}

function Toast({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-6 left-1/2 z-[110] rounded-full bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white px-5 py-2.5 text-[12px] font-semibold shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function WhatsAppButton() {
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/923000000000?text=Hi%20Vexora,%20I%20want%20to%20place%20an%20order.', '_blank')
  }

  return (
    <motion.button
      onClick={handleWhatsAppClick}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba5a] transition"
      title="Order via WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" className="text-white" />
    </motion.button>
  )
}

function CartDrawer({ isOpen, onClose, cart, onUpdateQty, onRemove, onCheckout }) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#f3efe9] dark:bg-[#1a1512] shadow-2xl flex flex-col border-l border-[#e2d7cf] dark:border-[#33251e]"
          >
            <div className="flex items-center justify-between p-5 border-b border-[#e2d7cf] dark:border-[#33251e]">
              <h3 className="font-display text-xl font-bold text-coffee-900 dark:text-white">Your Cart ({cart.reduce((a, c) => a + c.quantity, 0)})</h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-coffee-900 dark:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-coffee-600 dark:text-gray-400">
                  <ShoppingBag size={48} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartLineId || item.id} className="flex gap-4 items-center bg-white/70 dark:bg-[#241a15] p-3 rounded-xl border border-[#e2d7cf] dark:border-[#33251e]">
                    <img src={item.images[0]} alt={item.name} className="h-16 w-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase text-coffee-900 dark:text-white">{item.name}</h4>
                      <p className="text-xs text-coffee-600 dark:text-gray-400 mt-0.5">{item.priceFormatted}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-[#e2d7cf] dark:border-[#3d2a1f] rounded-md">
                          <button onClick={() => onUpdateQty(item.cartLineId || item.id, -1)} className="p-1 hover:bg-black/5"><Minus size={12} /></button>
                          <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                          <button onClick={() => onUpdateQty(item.cartLineId || item.id, 1)} className="p-1 hover:bg-black/5"><Plus size={12} /></button>
                        </div>
                        <button onClick={() => onRemove(item.cartLineId || item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-[#e2d7cf] dark:border-[#33251e] bg-white/40 dark:bg-[#1a1512]">
                <div className="flex justify-between items-center mb-4 text-sm font-bold text-coffee-900 dark:text-white">
                  <span>Subtotal:</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <button
                  onClick={onCheckout}
                  className="w-full rounded-full bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white py-3 text-xs font-semibold uppercase tracking-widest hover:opacity-95 transition shadow-lg"
                >
                  Proceed to Checkout / COD
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Header({ cartCount, wishlistCount, darkMode, setDarkMode, onOpenCart, onSearchSelect, products }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 90)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredSearch = searchQuery.trim() === '' ? [] : products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      <div className="bg-[#f3efe9] dark:bg-[#1a1512] border-b border-[#e2d7cf]/60 dark:border-[#33251e] py-4 px-4 text-center">
        <h6 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-coffee-900 dark:text-white">
          VEXORA
        </h6>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-md bg-[#f3efe9]/90 dark:bg-[#1a1512]/90 shadow-md border-b border-[#e2d7cf] dark:border-[#33251e]'
            : 'bg-[#f3efe9] dark:bg-[#1a1512]'
        }`}
      >
        <div className="mx-auto max-w-[1380px] px-4 lg:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-coffee-900 dark:text-[#f3efe9]"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium uppercase tracking-widest text-coffee-700 dark:text-[#d1c2b5]">
              {navLinks.map((link) => (
                <a key={link.path} href={link.path} className="hover:text-coffee-900 dark:hover:text-white transition">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className={`transition-all duration-300 ${isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <span className="font-display text-xl font-bold tracking-tight text-coffee-900 dark:text-white">
              VEXORA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] text-coffee-900 dark:text-[#f3efe9] transition hover:bg-black/5 dark:hover:bg-white/10"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* LIVE AUTOCOMPLETE SEARCH */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] bg-transparent px-3 py-1.5 text-[12px] text-coffee-900 dark:text-white focus:outline-none w-36 lg:w-48"
              />
              <Search size={13} className="absolute right-3 top-2 text-coffee-600 dark:text-gray-400" />
              
              {filteredSearch.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-[#241a15] border border-[#e2d7cf] dark:border-[#33251e] rounded-xl shadow-xl z-50 overflow-hidden">
                  {filteredSearch.map(product => (
                    <div
                      key={product.id}
                      onClick={() => { onSearchSelect(product); setSearchQuery(''); }}
                      className="px-4 py-2.5 text-xs hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer flex items-center justify-between"
                    >
                      <span className="font-medium">{product.name}</span>
                      <span className="text-coffee-600 dark:text-gray-400">{product.priceFormatted}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="relative p-2 rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] text-coffee-900 dark:text-white">
              <Heart size={16} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8c6d53] text-[9px] text-white">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button onClick={onOpenCart} className="relative p-2 rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] text-coffee-900 dark:text-white">
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <motion.span
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-coffee-900 text-[9px] text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
            <a
              href="/login"
              aria-label="Login or sign up"
              title="Login or sign up"
              className="inline-flex items-center gap-2 rounded-full border border-[#e2d7cf] px-3 py-2 text-coffee-900 transition hover:bg-black/5 dark:border-[#3d2a1f] dark:text-white dark:hover:bg-white/10"
            >
              <UserRound size={16} />
              <span className="hidden sm:inline text-xs font-semibold">Login</span>
            </a>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-b border-[#e2d7cf] dark:border-[#33251e] bg-[#f3efe9] dark:bg-[#1a1512] px-6 py-6"
            >
              <div className="flex flex-col space-y-4 text-sm font-semibold uppercase tracking-widest text-coffee-900 dark:text-white">
                {navLinks.map((link) => (
                  <a key={link.path} href={link.path} onClick={() => setMobileMenuOpen(false)}>
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

function QuickViewModal({ product, products, onClose, isWishlisted, onToggleWishlist, onAddToCart }) {
  if (!product) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl overflow-hidden rounded-[18px] bg-[#f3efe9] dark:bg-[#1a1512] shadow-2xl grid sm:grid-cols-2"
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-black/50 p-1.5 text-white"
          >
            <X size={16} />
          </button>
          <div className="overflow-hidden h-64 sm:h-full relative group">
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-125" />
          </div>
          <div className="p-6 text-coffee-900 dark:text-white flex flex-col">
            <span className="text-[11px] uppercase tracking-widest text-coffee-600 dark:text-[#d1c2b5]">{product.label}</span>
            <h3 className="font-display text-2xl font-semibold mt-1">{product.name}</h3>
            <div className="mt-2 flex items-center gap-1 text-amber-600 text-xs">
              <Star size={12} fill="currentColor" /> {product.rating}
            </div>
            <p className="mt-3 text-[13px] leading-6 text-coffee-700 dark:text-gray-300">{product.description}</p>
            <div className="mt-4 text-lg font-bold">{product.priceFormatted}</div>
            
            {/* COMPLETE THE LOOK BUNDLE */}
            <div className="mt-4 pt-3 border-t border-[#e2d7cf] dark:border-[#3d2a1f]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-coffee-600 dark:text-gray-400">Pair with:</span>
              <div className="flex gap-2 mt-1.5">
                {products.filter(p => p.id !== product.id).slice(0, 2).map(bundleItem => (
                  <span key={bundleItem.id} className="text-[10px] bg-white/50 dark:bg-white/10 px-2 py-1 rounded-md border border-[#e2d7cf] dark:border-[#3d2a1f]">
                    {bundleItem.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-auto flex gap-2 pt-6">
              <button
                onClick={() => onAddToCart(product)}
                className="flex-1 rounded-full bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white py-2.5 text-[12px] font-semibold uppercase tracking-wider"
              >
                Add to Cart
              </button>
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`rounded-full border p-2.5 ${isWishlisted ? 'bg-[#8c6d53] text-white border-[#8c6d53]' : 'border-[#e2d7cf] dark:border-[#3d2a1f]'}`}
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

function RecentlyViewed({ items, onQuickView }) {
  if (!items || items.length === 0) return null
  return (
    <section className="mx-auto max-w-[1380px] px-4 my-12 lg:px-6">
      <h3 className="font-display text-xl font-semibold mb-4">Recently Viewed</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map(product => (
          <div key={product.id} onClick={() => onQuickView(product)} className="min-w-[180px] bg-white/60 dark:bg-[#241a15] p-3 rounded-xl border border-[#e2d7cf] dark:border-[#33251e] cursor-pointer">
            <img src={product.images[0]} alt={product.name} className="h-28 w-full object-cover rounded-lg" />
            <h4 className="text-xs font-bold mt-2 truncate">{product.name}</h4>
            <p className="text-[11px] text-coffee-600 dark:text-gray-400">{product.priceFormatted}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section className="mx-auto max-w-[1380px] px-4 my-16 lg:px-6">
      <div className="rounded-[24px] bg-[#5c4a3a] dark:bg-[#241a15] px-6 py-12 text-center text-[#f5f0ea]">
        <span className="text-xs uppercase tracking-[0.25em] text-[#e9dccf]">Join The Vexora Club</span>
        <h3 className="font-display text-2xl sm:text-3xl font-medium mt-2">Get 10% Off Your First Order</h3>
        <p className="mt-2 text-sm text-[#ece3dc] max-w-md mx-auto">Subscribe for early access to seasonal drops and VIP sales.</p>
        <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm text-white placeholder-white/60 focus:outline-none"
          />
          <button className="rounded-full bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-[#2b201d]">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#f3efe9] dark:bg-[#1a1512] border-t border-[#e2d7cf] dark:border-[#2b201d] pt-12 pb-8">
      <div className="mx-auto max-w-[1380px] px-4 lg:px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 text-coffee-900 dark:text-gray-300">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold">VEXORA</h2>
          <p className="mt-3 text-xs text-coffee-600 dark:text-gray-400 max-w-sm leading-relaxed">
            Modest meets modern. Crafting premium quality apparel, jubbas, abayas, and accessories.
          </p>
          {/* PAYMENT METHOD ICONS */}
          <div className="mt-4 flex gap-2 items-center">
            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-white/60 dark:bg-white/10 rounded border border-[#e2d7cf] dark:border-[#33251e]">COD</span>
            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-white/60 dark:bg-white/10 rounded border border-[#e2d7cf] dark:border-[#33251e]">JazzCash</span>
            <span className="text-[10px] font-bold uppercase px-2 py-1 bg-white/60 dark:bg-white/10 rounded border border-[#e2d7cf] dark:border-[#33251e]">EasyPaisa</span>
          </div>
        </div>
        <FooterColumn title="Quick Links" items={quickLinks} />
        <FooterColumn title="Customer Care" items={customerCare} />
        <FooterColumn title="Why Vexora" items={whyVexora} />
      </div>
      <div className="mx-auto max-w-[1380px] px-4 lg:px-6 mt-10 pt-4 border-t border-[#e2d7cf] dark:border-[#2b201d] flex flex-col sm:flex-row justify-between text-[11px] text-coffee-600 dark:text-gray-500">
        <p>© 2026 Vexora Pakistan. All rights reserved.</p>
        <p>Karachi, Pakistan</p>
      </div>
    </footer>
  )
}

function FooterColumn({ title, items }) {
  return (
    <div>
      <div className="text-[12px] font-semibold uppercase tracking-wider text-coffee-900 dark:text-white">{title}</div>
      <ul className="mt-3 space-y-2 text-[12px] text-coffee-600 dark:text-gray-400">
        {items.map((item) => (
          <li key={item.path} className="cursor-pointer hover:text-coffee-900 dark:hover:text-white transition"><a href={item.path}>{item.label}</a></li>
        ))}
      </ul>
    </div>
  )
}

// ---------------------------------------------
// PAGE
// ---------------------------------------------

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [currentHeroImg, setCurrentHeroImg] = useState(0)
  const [homeMedia, setHomeMedia] = useState({
    heroImages: homeHeroImages,
    trendingCategoryImages: trendingCategoryDefaults.map(({ image }) => image),
  })
  const [isHeroPaused, setIsHeroPaused] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [toastMsg, setToastMsg] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [recentlyViewed, setRecentlyViewed] = useState([])

  const [productStates, setProductStates] = useState({})

  const loadFeaturedProducts = async () => {
    setProductsLoading(true)
    setProductsError('')
    try {
      if (!API_BASE_URL) throw new Error('The product catalog API is not configured.')
      const apiBase = `${API_BASE_URL}/api`
      const timestamp = Date.now()
      const response = await fetch(`${apiBase}/products?limit=6&_t=${timestamp}`)
      const body = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(body.message || 'Featured products could not be loaded.')
      const rows = (body.rows || []).map((product) => ({
        ...product,
        productId: product._id || product.id,
        label: product.subtitle || product.category,
        price: product.price,
        originalPrice: product.oldPrice || 0,
        priceFormatted: `PKR ${Number(product.price).toLocaleString()}`,
        originalPriceFormatted: product.oldPrice ? `PKR ${Number(product.oldPrice).toLocaleString()}` : '',
        discountPercent: product.oldPrice > product.price ? Math.round((1 - product.price / product.oldPrice) * 100) : 0,
        images: product.gallery?.length ? product.gallery : product.image ? [product.image] : [],
        swatches: (product.colors || []).map((color) => ({ color, name: color })),
        rating: Number.isFinite(product.rating) ? product.rating : null,
        reviewCount: Number.isFinite(product.reviews) ? product.reviews : null,
      }))
      setFeaturedProducts(rows)
      setProductStates(Object.fromEntries(rows.map((product) => [product.id, { imageIdx: 0, colorIdx: 0 }])))
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : 'Featured products could not be loaded.')
    } finally {
      setProductsLoading(false)
    }
  }

  useEffect(() => { loadFeaturedProducts() }, [])

  useEffect(() => {
    if (!API_BASE_URL) return undefined
    const apiBase = `${API_BASE_URL}/api`
    let active = true
    fetch(`${apiBase}/content/home`)
      .then(async (response) => {
        if (response.status === 404) return null
        const body = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(body.message || 'Homepage media could not be loaded.')
        return body.content
      })
      .then((content) => {
        if (!active || !content) return
        setHomeMedia({
          heroImages: Array.isArray(content.heroImages) && content.heroImages.length === homeHeroImages.length
            ? content.heroImages
            : homeHeroImages,
          trendingCategoryImages: Array.isArray(content.trendingCategoryImages) && content.trendingCategoryImages.length === trendingCategoryDefaults.length
            ? content.trendingCategoryImages
            : trendingCategoryDefaults.map(({ image }) => image),
        })
      })
      .catch((error) => {
        if (active) console.error(error.message || 'Homepage media could not be loaded.')
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || isHeroPaused) return

    const timer = setInterval(() => {
      setCurrentHeroImg((prev) => (prev + 1) % homeMedia.heroImages.length)
    }, 4800)

    return () => clearInterval(timer)
  }, [homeMedia.heroImages.length, isHeroPaused])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setCurrentHeroImg((prev) => (prev + 1) % homeMedia.heroImages.length)
      }
      if (event.key === 'ArrowLeft') {
        setCurrentHeroImg((prev) => (prev - 1 + homeMedia.heroImages.length) % homeMedia.heroImages.length)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [homeMedia.heroImages.length])

  const activeHeroImages = homeMedia.heroImages

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(''), 1800)
    return () => clearTimeout(t)
  }, [toastMsg])

  const handleColorSelect = (productId, colorIdx) => {
    setProductStates((prev) => ({
      ...prev,
      [productId]: { imageIdx: colorIdx, colorIdx },
    }))
  }

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
    setToastMsg(wishlist.includes(productId) ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  const handleAddToCart = (product) => {
    if (product.sizes?.length > 1) {
      window.location.assign(`/product/${encodeURIComponent(product.slug || product.id)}`)
      return
    }
    const selectedSize = product.sizes?.[0] || ''
    const selectedColor = product.colors?.[productStates[product.id]?.colorIdx] || product.colors?.[0] || ''
    setCart((prev) => {
      const cartLineId = `${product.id}:${selectedSize}:${selectedColor}`
      const existing = prev.find((item) => (item.cartLineId || item.id) === cartLineId)
      if (existing) {
        return prev.map((item) => (item.cartLineId || item.id) === cartLineId ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, productId: product.productId || product._id || product.id, cartLineId, selectedSize, selectedColor, quantity: 1 }]
    })
    setToastMsg(`${product.name} added to cart`)
    setQuickViewProduct(null)
    setIsCartOpen(true)
  }

  const handleUpdateQty = (productId, delta) => {
    setCart((prev) => prev.map(item => {
      if ((item.cartLineId || item.id) === productId) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : null
      }
      return item
    }).filter(Boolean))
  }

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter(item => (item.cartLineId || item.id) !== productId))
  }

  const handleOpenQuickView = (product) => {
    if (!product || (!product.id && !product._id)) {
      console.error('Invalid product data:', product)
      setToastMsg('Unable to view product details')
      return
    }
    // Ensure product has required fields for modal
    const normalizedProduct = {
      ...product,
      id: product.id || product._id || product.productId,
      images: product.images && product.images.length > 0 ? product.images : [FALLBACK_IMAGE],
      name: product.name || 'Product',
      price: product.price || 0,
      priceFormatted: product.priceFormatted || 'PKR 0',
    }
    setQuickViewProduct(normalizedProduct)
    setRecentlyViewed((prev) => {
      const productId = normalizedProduct.id
      if (prev.some(p => p.id === productId)) return prev
      return [normalizedProduct, ...prev].slice(0, 4)
    })
  }

  return (
    <div className={darkMode ? 'dark bg-[#1a1512] text-white min-h-screen' : 'bg-[#f3efe9] text-coffee-900 min-h-screen'}>
      <ScrollProgressBar />
      <AnnouncementBar />
      <Header
        cartCount={cart.reduce((a, c) => a + c.quantity, 0)}
        wishlistCount={wishlist.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenCart={() => setIsCartOpen(true)}
        onSearchSelect={(product) => handleOpenQuickView(product)}
        products={featuredProducts}
      />

      <main className="mx-auto max-w-[1380px] px-4 pb-12 pt-4 lg:px-6">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[18px] bg-[#543f32] shadow-lg"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(31,21,17,0.78) 0%, rgba(31,21,17,0.58) 40%, rgba(31,21,17,0.22) 70%), url(${activeHeroImages[currentHeroImg % activeHeroImages.length]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.8s ease-in-out',
          }}
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          onFocus={() => setIsHeroPaused(true)}
          onBlur={() => setIsHeroPaused(false)}
          aria-label="Featured campaign slideshow"
        >
          <div className="flex min-h-[480px] items-center justify-between px-6 py-10 sm:px-8 lg:min-h-[580px] lg:px-10">
            <div className="max-w-[520px] text-[#f5f0ea]">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e9dccf]">VEXORA DROP</span>
              <h1 className="font-display text-[40px] font-medium leading-[0.95] tracking-tight sm:text-[64px] mt-3">
                Modest Meets <br /> Modern.
              </h1>
              <p className="mt-4 max-w-[400px] text-[14px] leading-6 text-[#ece3dc]">
                Premium modest wear for the modern you. Traditional roots, stylish fits, built for every step.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="/shop" className="inline-flex items-center rounded-full bg-[#f3efe9] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-[#1a1512] transition hover:bg-white">
                  Shop New Arrivals <ArrowRight size={14} className="ml-2" />
                </a>
                <a href="/shop?category=Jubbe%20%26%20Abaya" className="rounded-full border border-white/35 bg-white/10 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm transition hover:bg-white/20">
                  Explore Collection
                </a>
              </div>

              <div className="mt-10 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => setCurrentHeroImg((prev) => (prev - 1 + activeHeroImages.length) % activeHeroImages.length)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/15 text-white transition hover:bg-black/30"
                >
                  <ArrowRight size={14} className="rotate-180" />
                </button>
                <div className="flex items-center gap-2">
                  {activeHeroImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`View slide ${idx + 1}`}
                      onClick={() => setCurrentHeroImg(idx)}
                      className={`h-2 rounded-full transition-all ${currentHeroImg === idx ? 'w-6 bg-white' : 'w-2 bg-white/40'}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => setCurrentHeroImg((prev) => (prev + 1) % activeHeroImages.length)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/15 text-white transition hover:bg-black/30"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TRUST TICKER WITH BADGES */}
        <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/60 dark:bg-[#241a15] border border-[#e2d7cf] dark:border-[#33251e] rounded-[14px] p-5">
          <div className="flex items-center gap-3">
            <Truck size={18} className="text-coffee-800 dark:text-gray-300" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider">Cash on Delivery</h4>
              <p className="text-[10px] text-coffee-600 dark:text-gray-400">All over Pakistan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-coffee-800 dark:text-gray-300" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider">100% Original</h4>
              <p className="text-[10px] text-coffee-600 dark:text-gray-400">Guaranteed quality</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RotateCcw size={18} className="text-coffee-800 dark:text-gray-300" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider">7-Day Return</h4>
              <p className="text-[10px] text-coffee-600 dark:text-gray-400">Easy replacement</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-coffee-800 dark:text-gray-300" />
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider">Premium Fabric</h4>
              <p className="text-[10px] text-coffee-600 dark:text-gray-400">Handcrafted quality</p>
            </div>
          </div>
        </section>

        {/* TRENDING CATEGORIES */}
        <TrendingCategories 
          categories={trendingCategoryDefaults.map((item, index) => ({
            ...item,
            image: homeMedia.trendingCategoryImages[index] || item.image,
          }))} 
          loading={productsLoading}
        />

        {/* FEATURED PRODUCTS BY CATEGORY */}
        <motion.section
          className="mt-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Featured by Category</h2>
            <a href="/shop" className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider">View All <ArrowRight size={14} /></a>
          </div>
          {productsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => <ProductCardSkeleton key={index} />)}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {trendingCategoryDefaults.map((category) => {
                const matchesCategory = (product) => (product.categories?.length ? product.categories : [product.category]).includes(category.name)
                const categoryProduct = featuredProducts.find(p => matchesCategory(p) && p.categoryFeatured) ||
                                        featuredProducts.find(matchesCategory)
                const state = categoryProduct ? (productStates[categoryProduct.id] || { imageIdx: 0, colorIdx: 0 }) : { imageIdx: 0, colorIdx: 0 }
                const isWishlisted = categoryProduct ? wishlist.includes(categoryProduct.id) : false
                
                return (
                  <motion.div key={category.name} variants={fadeUp}>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <a href={`/shop?category=${encodeURIComponent(category.name)}`} className="text-[10px] text-[#6f4e37] hover:underline">View All</a>
                    </div>
                    {categoryProduct ? (
                      <div className="group overflow-hidden rounded-[16px] border border-[#e2d7cf] dark:border-[#33251e] bg-white/70 dark:bg-[#1a1512] p-3 shadow-sm">
                        <div className="relative overflow-hidden rounded-[12px] bg-[#efe8e2] dark:bg-[#261d18] cursor-pointer" onClick={() => handleOpenQuickView(categoryProduct)}>
                          {categoryProduct.discountPercent && (
                            <span className="absolute left-3 top-3 z-10 rounded-full bg-[#8c6d53] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white shadow-sm">
                              -{categoryProduct.discountPercent}%
                            </span>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleWishlist(categoryProduct.id) }}
                            className={`absolute right-3 top-3 z-10 rounded-full p-1.5 ${isWishlisted ? 'bg-[#8c6d53] text-white' : 'bg-black/50 text-white'}`}
                          >
                            <Heart size={13} fill={isWishlisted ? 'currentColor' : 'none'} />
                          </button>
                          <img src={categoryProduct.images[state.imageIdx] || FALLBACK_IMAGE} alt={categoryProduct.name} className="h-[240px] w-full object-cover group-hover:scale-125 transition duration-500" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition">
                            <span className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-coffee-900">
                              <Eye size={12} /> Quick View
                            </span>
                          </div>
                        </div>
                        <div className="pt-3">
                          <div className="flex items-start justify-between gap-3 text-xs font-bold uppercase">
                            <span className="line-clamp-2">{categoryProduct.name}</span>
                            {Number.isFinite(categoryProduct.rating) && <span className="text-amber-600 flex items-center gap-0.5 whitespace-nowrap"><Star size={11} fill="currentColor" /> {categoryProduct.rating}</span>}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1a1512] dark:text-white">{categoryProduct.priceFormatted}</span>
                            {categoryProduct.originalPriceFormatted && (
                              <span className="text-[11px] text-coffee-600 line-through dark:text-gray-400">{categoryProduct.originalPriceFormatted}</span>
                            )}
                          </div>
                          {Number.isFinite(categoryProduct.reviewCount) && <p className="mt-1 text-[10px] text-coffee-600 dark:text-gray-400">{categoryProduct.reviewCount} reviews</p>}
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-[16px] border border-dashed border-[#e2d7cf] dark:border-[#33251e] bg-white/40 dark:bg-[#1a1512] p-8 text-center">
                        <p className="text-sm text-coffee-600 dark:text-gray-400 mb-3">No featured product yet</p>
                        <a href={`/shop?category=${encodeURIComponent(category.name)}`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6f4e37]">
                          Browse {category.name} <ArrowRight size={12} />
                        </a>
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.section>

        <RecentlyViewed items={recentlyViewed} onQuickView={handleOpenQuickView} />

        {/* TESTIMONIALS */}
        <motion.section
          className="mt-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center max-w-md mx-auto mb-8">
            <h2 className="font-display text-2xl font-bold">Loved Across Pakistan</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((t, idx) => (
              <motion.div key={idx} variants={fadeUp} className="rounded-[16px] border border-[#e2d7cf] dark:border-[#33251e] bg-white/70 dark:bg-[#1a1512] p-5">
                <p className="text-xs italic text-coffee-800 dark:text-gray-300">"{t.comment}"</p>
                <div className="mt-4 flex justify-between text-[11px] font-bold">
                  <span>{t.name}</span>
                  <span className="text-coffee-600 dark:text-gray-500">{t.city}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

      </main>

      <Newsletter />
      <Footer />

      <QuickViewModal
        product={quickViewProduct}
        products={featuredProducts}
        onClose={() => setQuickViewProduct(null)}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveFromCart}
        onCheckout={() => {
          try {
            window.localStorage.setItem('vexora-cart', JSON.stringify(cart))
            window.location.assign('/shop?checkout=1')
          } catch {
            setToastMsg('Your browser could not transfer the cart to checkout.')
          }
        }}
      />

      <WhatsAppButton />
      <Toast message={toastMsg} />
    </div>
  )
}