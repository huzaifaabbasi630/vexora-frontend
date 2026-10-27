import { useMemo, useState, useEffect, useRef } from 'react'
import {
  ChevronDown,
  SlidersHorizontal,
  X,
  ShoppingBag,
  Heart,
  Star,
  Eye,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Grid,
  List,
  Search,
  Instagram,
  Facebook,
  Twitter,
  Menu,
  Sun,
  Moon,
  ArrowUp,
  Truck,
  Check,
  UserRound,
  LoaderCircle,
} from 'lucide-react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { footerNavigation, primaryNavigation } from '../data/navigation'
import { formatPrice } from '../data/catalog'
import { BUSINESS_WHATSAPP } from '../data/contact'
import { defaultShopHeroImage } from '../data/brandMedia'
import { API_BASE_URL } from '../config/api.js'

// ---------------------------------------------
// CONFIG
// ---------------------------------------------
const FREE_SHIPPING_THRESHOLD = 5000
const MAX_PRICE = 20000
const ACCENT = '#D97706'
// Purane links (e.g. ?category=Jubbe & Abaya) bhi kaam karein
const LEGACY_CATEGORY_MAP = {
  Jubbe: 'Jubbe & Abaya',
  Abaya: 'Jubbe & Abaya',
  Watches: 'Watches & Glasses',
  Glasses: 'Watches & Glasses',
}

// ---------------------------------------------
// CATALOG DATA
// ---------------------------------------------
const toShopProduct = (product) => ({
  ...product,
  productId: product._id || product.id,
  rating: Number.isFinite(product.rating) ? product.rating : 0,
  reviews: Number.isFinite(product.reviews) ? product.reviews : 0,
  priceFormatted: formatPrice(product.price),
  originalPriceFormatted: product.oldPrice ? formatPrice(product.oldPrice) : '',
  images: product.gallery?.length ? product.gallery : product.image ? [product.image] : [PRODUCT_FALLBACK_IMAGE],
  colorOptions: product.colors || [],
  sizeOptions: product.sizes || [],
  color: product.colors?.[0] || '',
  description: product.description || '',
})

const PRODUCT_FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#e8dfd5"/><path d="M0 700h800v300H0z" fill="#d8c9bb"/><text x="50%" y="48%" text-anchor="middle" fill="#6f4e37" font-family="Georgia,serif" font-size="54" letter-spacing="8">VEXORA</text><text x="50%" y="55%" text-anchor="middle" fill="#6f4e37" font-family="Arial,sans-serif" font-size="22" letter-spacing="3">IMAGE UNAVAILABLE</text></svg>'
)}`

const navLinks = primaryNavigation
const { quickLinks, customerCare, whyVexora } = footerNavigation

// ---------------------------------------------
// HELPERS
// ---------------------------------------------
const loadFromStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const saveToStorage = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

const getInitialCategory = () => {
  const requested = new URLSearchParams(window.location.search).get('category')
  return LEGACY_CATEGORY_MAP[requested] || requested || 'All'
}

// ---------------------------------------------
// ANIMATION VARIANTS
// ---------------------------------------------
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

// ---------------------------------------------
// SKELETON COMPONENTS
// ---------------------------------------------
function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e2d7cf] dark:border-[#33251e] bg-white/70 dark:bg-[#241a15] p-4 shadow-sm">
      <div className="relative overflow-hidden rounded-xl bg-[#efe8e2] dark:bg-[#261d18] h-[240px] animate-pulse">
        <div className="absolute left-3 top-3 h-5 w-16 rounded-full bg-black/20" />
        <div className="absolute right-3 top-3 h-6 w-6 rounded-full bg-black/20" />
      </div>
      <div className="pt-4">
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

// ---------------------------------------------
// SCROLL PROGRESS LINE (top of page)
// ---------------------------------------------
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX, backgroundColor: ACCENT }}
      className="fixed top-0 left-0 right-0 z-[120] h-[3px] origin-left shadow-[0_0_8px_rgba(217,119,6,0.6)]"
    />
  )
}

// ---------------------------------------------
// SHARED (Home-matching) HEADER PIECES
// ---------------------------------------------

function AnnouncementBar() {
  return (
    <div className="bg-[#5c4a3a] text-[#f3efe9] py-2 text-center text-[12px] tracking-wider uppercase font-medium">
      ✨ Free Nationwide Shipping Across Pakistan on Orders Over PKR 5,000 | Cash on Delivery Available 🚚
    </div>
  )
}

function Header({
  cartCount,
  wishlistCount,
  darkMode,
  setDarkMode,
  onCartClick,
  onWishlistClick,
  search,
  setSearch,
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 90)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Centered Logo Bar */}
      <div className="bg-[#f3efe9] dark:bg-[#1a1512] border-b border-[#e2d7cf]/60 dark:border-[#33251e] py-4 px-4 text-center">
        <h6 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-coffee-900 dark:text-white">
          VEXORA
        </h6>
      </div>

      {/* Sticky Nav Header */}
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
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden text-coffee-900 dark:text-[#f3efe9]"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium uppercase tracking-widest text-coffee-700 dark:text-[#d1c2b5]">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`hover:text-coffee-900 dark:hover:text-white transition ${link.label === 'Shop' ? 'text-coffee-900 dark:text-white border-b-2 border-coffee-900 dark:border-white pb-0.5' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className={`transition-all duration-300 ${isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <span className="font-display text-xl font-bold tracking-tight text-coffee-900 dark:text-white">VEXORA</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] text-coffee-900 dark:text-[#f3efe9] transition hover:bg-black/5 dark:hover:bg-white/10"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative hidden sm:block">
              <input
                type="text"
                aria-label="Search products"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] bg-transparent pl-3 pr-8 py-1.5 text-[12px] text-coffee-900 dark:text-white focus:outline-none focus:border-[#D97706] w-36 lg:w-48 transition"
              />
              {search ? (
                <button onClick={() => setSearch('')} aria-label="Clear product search" className="absolute right-3 top-2 text-coffee-600 dark:text-gray-400">
                  <X size={13} />
                </button>
              ) : (
                <Search size={13} className="absolute right-3 top-2 text-coffee-600 dark:text-gray-400" />
              )}
            </div>
            <button
              onClick={onWishlistClick}
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
              className="relative p-2 rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] text-coffee-900 dark:text-white"
              title="Wishlist"
            >
              <Heart size={16} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8c6d53] text-[9px] text-white">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={onCartClick}
              aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}
              className="relative p-2 rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] text-coffee-900 dark:text-white"
              title="Cart"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-coffee-900 dark:bg-white dark:text-coffee-900 text-[9px] text-white">
                  {cartCount}
                </span>
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
              className="lg:hidden border-b border-[#e2d7cf] dark:border-[#33251e] bg-[#f3efe9] dark:bg-[#1a1512] px-6 py-6 overflow-hidden"
            >
              <div className="relative mb-5 sm:hidden">
                <input
                  type="text"
                  aria-label="Search products"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] bg-transparent pl-4 pr-9 py-2 text-[13px] text-coffee-900 dark:text-white focus:outline-none focus:border-[#D97706]"
                />
                <Search size={14} className="absolute right-4 top-3 text-coffee-600 dark:text-gray-400" />
              </div>
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

function Footer() {
  return (
    <footer className="bg-[#f3efe9] dark:bg-[#1a1512] border-t border-[#e2d7cf] dark:border-[#2b201d] pt-12 pb-8">
      <div className="mx-auto max-w-[1380px] px-4 lg:px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 text-coffee-900 dark:text-gray-300">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold">VEXORA</h2>
          <p className="mt-3 text-xs text-coffee-600 dark:text-gray-400 max-w-sm leading-relaxed">
            Modest meets modern. Crafting premium quality apparel, jubbas, abayas, and accessories.
          </p>
          <div className="mt-5 flex gap-4 text-coffee-700 dark:text-gray-400">
            <a href="/contact" className="hover:text-coffee-900 dark:hover:text-white"><Instagram size={18} /></a>
            <a href="/contact" className="hover:text-coffee-900 dark:hover:text-white"><Facebook size={18} /></a>
            <a href="/contact" className="hover:text-coffee-900 dark:hover:text-white"><Twitter size={18} /></a>
          </div>
        </div>
        <FooterColumn title="Quick Links" items={quickLinks} />
        <FooterColumn title="Customer Care" items={customerCare} />
        <FooterColumn title="Why Vexora" items={whyVexora} />
      </div>
      <div className="mx-auto max-w-[1380px] px-4 lg:px-6 mt-10 pt-4 border-t border-[#e2d7cf] dark:border-[#2b201d] flex flex-col sm:flex-row justify-between gap-3 text-[11px] text-coffee-600 dark:text-gray-500">
        <p>© 2026 Vexora Pakistan. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:underline">Privacy Policy</a>
          <a href="/terms" className="hover:underline">Terms & Conditions</a>
        </div>
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
// OTHER SUB-COMPONENTS
// ---------------------------------------------

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
  const handleClick = () => {
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent('Hi Vexora, I want to place an order.')}`, '_blank', 'noopener,noreferrer')
  }
  return (
    <motion.button
      onClick={handleClick}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20ba5a] transition"
      title="Order via WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" className="text-white" />
    </motion.button>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl hover:opacity-90 transition"
          style={{ backgroundColor: ACCENT }}
          title="Back to top"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemove,
  onCheckout,
  checkoutLoading,
  checkoutError,
}) {
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '', address: '' })
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)

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
              <h3 className="font-display text-xl font-bold text-coffee-900 dark:text-white">
                Your Cart ({cart.reduce((a, c) => a + c.quantity, 0)})
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-coffee-900 dark:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Free shipping progress */}
            {cart.length > 0 && (
              <div className="px-5 pt-4">
                <div className="flex items-center gap-2 text-[12px] text-coffee-700 dark:text-gray-300">
                  {remaining === 0 ? (
                    <>
                      <Check size={14} style={{ color: ACCENT }} />
                      <span className="font-semibold">Mubarak! Aapko FREE shipping mil gayi 🎉</span>
                    </>
                  ) : (
                    <>
                      <Truck size={14} style={{ color: ACCENT }} />
                      <span>
                        Sirf <strong>PKR {remaining.toLocaleString()}</strong> aur — free shipping unlock karein
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#e2d7cf] dark:bg-[#33251e]">
                  <motion.div
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', damping: 20, stiffness: 120 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-coffee-600 dark:text-gray-400">
                  <ShoppingBag size={48} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">Your cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartLineId || item.id} className="flex gap-4 items-center bg-white/80 dark:bg-[#241a15] p-3 rounded-xl border border-[#e2d7cf] dark:border-[#33251e]">
                    <img src={item.images?.[0] || PRODUCT_FALLBACK_IMAGE} alt={item.name} onError={(event) => { event.currentTarget.src = PRODUCT_FALLBACK_IMAGE }} className="h-16 w-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase text-coffee-900 dark:text-white">{item.name}</h4>
                      <p className="text-xs text-coffee-600 dark:text-gray-400 mt-0.5">{item.priceFormatted}</p>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="mt-1 text-[10px] text-coffee-600 dark:text-gray-400">
                          {[item.selectedSize && `Size ${item.selectedSize}`, item.selectedColor && `Color ${item.selectedColor}`].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-[#e2d7cf] dark:border-[#33251e] rounded-md">
                          <button type="button" disabled={checkoutLoading} onClick={() => onUpdateQty(item.cartLineId || item.id, -1)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 dark:text-white disabled:opacity-50"><Minus size={12} /></button>
                          <span className="px-2 text-xs font-semibold dark:text-white">{item.quantity}</span>
                          <button type="button" disabled={checkoutLoading} onClick={() => onUpdateQty(item.cartLineId || item.id, 1)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 dark:text-white disabled:opacity-50"><Plus size={12} /></button>
                        </div>
                        <button type="button" disabled={checkoutLoading} onClick={() => onRemove(item.cartLineId || item.id)} className="text-red-500 hover:text-red-700 disabled:opacity-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {cart.length > 0 && (
                <form
                  id="checkout-form"
                  className="space-y-3 border-t border-[#e2d7cf] pt-5 dark:border-[#33251e]"
                  onSubmit={(event) => {
                    event.preventDefault()
                    onCheckout(customerInfo)
                  }}
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-coffee-900 dark:text-white">
                    Delivery details
                  </h4>
                  <p className="text-xs leading-5 text-coffee-600 dark:text-gray-400">
                    Guest checkout is available. You do not need to sign in; enter your delivery details to place an order.
                  </p>
                  <label className="block text-xs font-medium text-coffee-700 dark:text-gray-300">
                    Full name
                    <input
                      autoComplete="name"
                      className="mt-1.5 w-full rounded-lg border border-[#e2d7cf] bg-white/70 px-3 py-2.5 text-sm text-coffee-900 outline-none focus:border-coffee-600 dark:border-[#3d2a1f] dark:bg-[#241a15] dark:text-white"
                      maxLength={100}
                      onChange={(event) => setCustomerInfo((info) => ({ ...info, name: event.target.value }))}
                      name="customer-name"
                      required
                      value={customerInfo.name}
                    />
                  </label>
                  <label className="block text-xs font-medium text-coffee-700 dark:text-gray-300">
                    WhatsApp Number
                    <input
                      autoComplete="tel"
                      className="mt-1.5 w-full rounded-lg border border-[#e2d7cf] bg-white/70 px-3 py-2.5 text-sm text-coffee-900 outline-none focus:border-coffee-600 dark:border-[#3d2a1f] dark:bg-[#241a15] dark:text-white"
                      maxLength={20}
                      onChange={(event) => setCustomerInfo((info) => ({ ...info, phone: event.target.value }))}
                      name="customer-phone"
                      pattern="[+0-9][0-9 ]{7,19}"
                      placeholder="e.g. 03213794233"
                      required
                      value={customerInfo.phone}
                    />
                  </label>
                  <label className="block text-xs font-medium text-coffee-700 dark:text-gray-300">
                    Email address
                    <input
                      autoComplete="email"
                      className="mt-1.5 w-full rounded-lg border border-[#e2d7cf] bg-white/70 px-3 py-2.5 text-sm text-coffee-900 outline-none focus:border-coffee-600 dark:border-[#3d2a1f] dark:bg-[#241a15] dark:text-white"
                      maxLength={254}
                      onChange={(event) => setCustomerInfo((info) => ({ ...info, email: event.target.value }))}
                      name="customer-email"
                      placeholder="you@example.com"
                      required
                      type="email"
                      value={customerInfo.email}
                    />
                  </label>
                  <label className="block text-xs font-medium text-coffee-700 dark:text-gray-300">
                    Delivery address
                    <textarea
                      autoComplete="street-address"
                      className="mt-1.5 w-full resize-y rounded-lg border border-[#e2d7cf] bg-white/70 px-3 py-2.5 text-sm text-coffee-900 outline-none focus:border-coffee-600 dark:border-[#3d2a1f] dark:bg-[#241a15] dark:text-white"
                      maxLength={500}
                      onChange={(event) => setCustomerInfo((info) => ({ ...info, address: event.target.value }))}
                      name="customer-address"
                      required
                      rows={2}
                      value={customerInfo.address}
                    />
                  </label>
                  {checkoutError && (
                    <p aria-live="polite" className="text-xs text-red-700 dark:text-red-300">
                      {checkoutError}
                    </p>
                  )}
                </form>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t border-[#e2d7cf] dark:border-[#33251e] bg-white/40 dark:bg-[#241a15]">
                <div className="flex justify-between items-center mb-4 text-sm font-bold text-coffee-900 dark:text-white">
                  <span>Subtotal:</span>
                  <span>PKR {subtotal.toLocaleString()}</span>
                </div>
                <button
                  form="checkout-form"
                  type="submit"
                  disabled={checkoutLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-coffee-900 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-lg transition hover:opacity-95 disabled:cursor-wait disabled:opacity-60 dark:bg-white dark:text-coffee-900"
                >
                  {checkoutLoading && <LoaderCircle size={15} className="animate-spin" />}
                  {checkoutLoading ? 'Sending order...' : 'Check Out'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function WishlistDrawer({ isOpen, onClose, items, onRemove, onAddToCart }) {
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
              <h3 className="font-display text-xl font-bold text-coffee-900 dark:text-white">
                Wishlist ({items.length})
              </h3>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-coffee-900 dark:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-20 text-coffee-600 dark:text-gray-400">
                  <Heart size={48} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium">Abhi koi favourite nahi hai</p>
                  <p className="text-xs mt-1">Kisi bhi product ke heart par click karein ❤️</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white/80 dark:bg-[#241a15] p-3 rounded-xl border border-[#e2d7cf] dark:border-[#33251e]">
                    <img src={item.images?.[0] || PRODUCT_FALLBACK_IMAGE} alt={item.name} onError={(event) => { event.currentTarget.src = PRODUCT_FALLBACK_IMAGE }} className="h-16 w-16 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold uppercase text-coffee-900 dark:text-white truncate">{item.name}</h4>
                      <p className="text-xs text-coffee-600 dark:text-gray-400 mt-0.5">{item.priceFormatted}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => onAddToCart(item)}
                          className="rounded-full bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider"
                        >
                          Add to Cart
                        </button>
                        <button onClick={() => onRemove(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function QuickViewModal({ product, onClose, isWishlisted, onToggleWishlist, onAddToCart }) {
  if (!product) return null

  return (
    <QuickViewDialog
      key={product.id}
      product={product}
      onClose={onClose}
      isWishlisted={isWishlisted}
      onToggleWishlist={onToggleWishlist}
      onAddToCart={onAddToCart}
    />
  )
}

function QuickViewDialog({ product, onClose, isWishlisted, onToggleWishlist, onAddToCart }) {
  const images = product.images.length ? product.images : [PRODUCT_FALLBACK_IMAGE]
  const [activeImage, setActiveImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(product.colorOptions.length === 1 ? 0 : -1)
  const [selectedSize, setSelectedSize] = useState(product.sizeOptions.length === 1 ? product.sizeOptions[0] : '')
  const [quantity, setQuantity] = useState(1)
  const [validationMessage, setValidationMessage] = useState('')
  const [imageExpanded, setImageExpanded] = useState(false)
  const dialogRef = useRef(null)
  const imageExpandedRef = useRef(false)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    imageExpandedRef.current = imageExpanded
    onCloseRef.current = onClose
  }, [imageExpanded, onClose])

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const dialog = dialogRef.current
    dialog?.querySelector('button, a, input')?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        if (imageExpandedRef.current) setImageExpanded(false)
        else onCloseRef.current()
      }
      if (event.key === 'Tab' && dialog) {
        const focusable = [...dialog.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled)')]
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
      if (event.key === 'ArrowRight') setActiveImage((index) => (index + 1) % images.length)
      if (event.key === 'ArrowLeft') setActiveImage((index) => (index - 1 + images.length) % images.length)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [images.length])

  const selectedColorValue = selectedColor >= 0 ? product.colorOptions[selectedColor] : ''
  const hasRequiredSize = !product.sizeOptions.length || Boolean(selectedSize)
  const hasRequiredColor = product.colorOptions.length <= 1 || selectedColor >= 0

  const handleAdd = () => {
    if (!hasRequiredSize || !hasRequiredColor) {
      setValidationMessage('Please select a color and size before adding this item.')
      return
    }
    setValidationMessage('')
    onAddToCart(product, {
      color: selectedColorValue,
      size: selectedSize,
      quantity,
    })
  }

  const handleWhatsApp = () => {
    if (!hasRequiredSize || !hasRequiredColor) {
      setValidationMessage('Please select a color and size before continuing to WhatsApp.')
      return
    }
    const productUrl = `${window.location.origin}/product/${encodeURIComponent(product.id)}`
    const colorLabel = selectedColorValue ? `#${selectedColorValue.replace('#', '')}` : 'Not applicable'
    const sizeLabel = selectedSize || 'Not applicable'
    const msg = [
      'Hi Vexora, I would like to ask about this product:',
      product.name,
      `Product: ${productUrl}`,
      `Size: ${sizeLabel}`,
      `Color: ${colorLabel}`,
      `Quantity: ${quantity}`,
      `Price: ${product.priceFormatted}`,
    ].join('\n')
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 p-0 sm:p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-view-title"
          data-quick-view-dialog
          className="relative grid h-[100dvh] w-full max-w-5xl grid-cols-1 overflow-y-auto bg-[#f3efe9] text-[#1a1512] shadow-2xl dark:bg-[#1a1512] dark:text-[#f3efe9] sm:max-h-[min(820px,92vh)] sm:grid-cols-2 sm:overflow-hidden sm:rounded-[18px]"
        >
          <button onClick={onClose} aria-label="Close product quick view" className="absolute right-3 top-3 z-20 rounded-full bg-black/65 p-2 text-white transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <X size={16} />
          </button>
          <div className="relative flex min-h-[260px] flex-col bg-[#e8dfd5] dark:bg-[#241a15] sm:min-h-0">
            <button
              type="button"
              onClick={() => setImageExpanded(true)}
              className="min-h-[260px] flex-1 overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#6f4e37] sm:min-h-0"
              aria-label="Enlarge product image"
            >
              <img
                src={images[activeImage]}
                alt={`${product.name} product view ${activeImage + 1}`}
                onError={(event) => { event.currentTarget.src = PRODUCT_FALLBACK_IMAGE }}
                className="h-full max-h-[46vh] w-full object-contain sm:max-h-none"
              />
            </button>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3 sm:p-4" aria-label="Product image gallery">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Show product image ${index + 1}`}
                    aria-pressed={activeImage === index}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-md border-2 ${activeImage === index ? 'border-[#6f4e37]' : 'border-transparent'}`}
                  >
                    <img src={image} alt="" onError={(event) => { event.currentTarget.src = PRODUCT_FALLBACK_IMAGE }} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex min-h-0 flex-col overflow-y-auto p-5 pb-8 text-[#1a1512] dark:text-white sm:p-7">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6f4e37] dark:text-[#c9b6a3]">{product.category}</span>
            <h2 id="quick-view-title" className="mt-2 font-display text-2xl font-semibold leading-tight sm:text-3xl">{product.name}</h2>
            {Number.isFinite(product.rating) && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                <Star size={13} fill="currentColor" />
                <span>{product.rating}</span>
                {Number.isFinite(product.reviews) && <span className="text-[#6f6257] dark:text-gray-400">({product.reviews} reviews)</span>}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3">
              <span className="text-xl font-bold">{product.priceFormatted}</span>
              {product.oldPrice > product.price && (
                <>
                  <span className="text-sm text-[#75695f] line-through dark:text-gray-400">{product.originalPriceFormatted}</span>
                  <span className="rounded-full bg-[#6f4e37] px-2 py-0.5 text-[10px] font-semibold text-white">
                    {Math.round((1 - product.price / product.oldPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {product.description && <p className="mt-4 text-sm leading-6 text-[#51463e] dark:text-gray-300">{product.description}</p>}
            <p className="mt-3 text-xs text-[#6f6257] dark:text-gray-400">Stock levels are not connected to this catalogue.</p>

            {product.colorOptions.length > 0 && (
              <fieldset className="mt-5">
                <legend className="text-xs font-semibold uppercase tracking-wider">Color {selectedColor >= 0 && <span className="font-normal normal-case">selected</span>}</legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  {product.colorOptions.map((color, index) => (
                    <button
                      key={`${color}-${index}`}
                      type="button"
                      onClick={() => { setSelectedColor(index); setValidationMessage('') }}
                      aria-label={`Select color option ${index + 1}, ${color}`}
                      aria-pressed={selectedColor === index}
                      className={`h-8 w-8 rounded-full border border-[#b8aa9d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] ${selectedColor === index ? 'ring-2 ring-[#6f4e37] ring-offset-2 dark:ring-offset-[#1a1512]' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </fieldset>
            )}

            {product.sizeOptions.length > 1 && (
              <fieldset className="mt-5">
                <div className="flex items-center justify-between">
                  <legend className="text-xs font-semibold uppercase tracking-wider">Size</legend>
                  <a href="/size-guide" className="text-xs font-medium text-[#6f4e37] underline underline-offset-2 dark:text-[#d7c7b8]">Size guide</a>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => { setSelectedSize(size); setValidationMessage('') }}
                      aria-pressed={selectedSize === size}
                      className={`min-w-11 rounded-md border px-3 py-2 text-xs transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] ${selectedSize === size ? 'border-[#1a1512] bg-[#1a1512] text-white dark:border-[#f3efe9] dark:bg-[#f3efe9] dark:text-[#1a1512]' : 'border-[#d8cfc5] hover:border-[#6f4e37]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {product.sizeOptions.length === 1 && <p className="mt-4 text-xs text-[#51463e] dark:text-gray-300">Size: {product.sizeOptions[0]}</p>}

            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Quantity</span>
              <div className="inline-flex items-center rounded-md border border-[#d8cfc5] dark:border-[#51463e]">
                <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="p-2 disabled:opacity-40">
                  <Minus size={14} />
                </button>
                <span aria-live="polite" className="min-w-8 text-center text-sm">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((current) => current + 1)} className="p-2">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {validationMessage && <p role="alert" className="mt-3 text-xs text-red-700 dark:text-red-300">{validationMessage}</p>}
            <div className="mt-auto space-y-2 pt-6">
              <div className="flex gap-2">
                <button type="button" onClick={handleAdd} className="flex-1 rounded-full bg-[#1a1512] py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#3a2a21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] dark:bg-[#f3efe9] dark:text-[#1a1512]">
                  Add to Cart
                </button>
                <button type="button" onClick={() => onToggleWishlist(product.id)} aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={isWishlisted} className={`rounded-full border p-3 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] ${isWishlisted ? 'border-[#8c6d53] bg-[#8c6d53] text-white' : 'border-[#d8cfc5] dark:border-[#51463e]'}`}>
                  <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>
              <button type="button" onClick={handleWhatsApp} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#6f4e37] py-3 text-xs font-semibold uppercase tracking-widest text-[#4b3628] transition hover:bg-[#6f4e37] hover:text-white dark:text-[#f3efe9]">
                <MessageCircle size={15} /> Ask about this on WhatsApp
              </button>
              {/* <a href={`/product/${encodeURIComponent(product.id)}`} className="block py-2 text-center text-xs font-semibold text-[#6f4e37] underline underline-offset-4 dark:text-[#d7c7b8]">
                View full details
              </a> */}
            </div>
          </div>
        </motion.div>
        {imageExpanded && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4" onClick={(event) => { event.stopPropagation(); setImageExpanded(false) }}>
            <button type="button" aria-label="Close enlarged image" onClick={() => setImageExpanded(false)} className="absolute right-5 top-5 rounded-full bg-white/15 p-3 text-white"><X size={20} /></button>
            <img src={images[activeImage]} alt={`${product.name} enlarged`} onError={(event) => { event.currentTarget.src = PRODUCT_FALLBACK_IMAGE }} className="max-h-[90vh] max-w-full object-contain" />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// ---------------------------------------------
// MAIN SHOP COMPONENT
// ---------------------------------------------

export default function Shop() {
  const [products, setProducts] = useState([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [shopHeroImage, setShopHeroImage] = useState(defaultShopHeroImage)
  const CATEGORIES = useMemo(() => ['All', ...new Set(products.map((product) => product.category).filter(Boolean))], [products])
  const [darkMode, setDarkMode] = useState(() => loadFromStorage('vexora-dark', false))
  const [category, setCategory] = useState(getInitialCategory)
  const [sort, setSort] = useState('Featured')
  const [priceRange, setPriceRange] = useState(MAX_PRICE)
  const [minPrice, setMinPrice] = useState(0)
  const [selectedSize, setSelectedSize] = useState('All')
  const [selectedColor, setSelectedColor] = useState('All')
  const [saleOnly, setSaleOnly] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [search, setSearch] = useState('')

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  const [wishlist, setWishlist] = useState(() => loadFromStorage('vexora-wishlist', []))
  const [cart, setCart] = useState(() => loadFromStorage('vexora-cart', []))
  const [isCartOpen, setIsCartOpen] = useState(() => new URLSearchParams(window.location.search).get('checkout') === '1')
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [toastMsg, setToastMsg] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [hoveredImageMap, setHoveredImageMap] = useState({})
  const mobileFilterRef = useRef(null)

  const loadProducts = async () => {
    setProductsLoading(true)
    setProductsError('')
    try {
      if (!API_BASE_URL) throw new Error('The product catalog API is not configured.')
      const apiBase = `${API_BASE_URL}/api`
      const catalog = []
      let page = 1
      let totalPages = 1
      const timestamp = Date.now()
      do {
        const response = await fetch(`${apiBase}/products?limit=100&page=${page}&sort=newest&_t=${timestamp}`)
        const body = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(body.message || 'The product catalog could not be loaded.')
        if (!Array.isArray(body.rows)
          || body.rows.some((product) => !product || typeof product !== 'object'
            || typeof product.category !== 'string' || !product.category.trim())) {
          throw new Error('The product catalog response contains invalid product categories.')
        }
        catalog.push(...body.rows)
        totalPages = Math.max(1, Number(body.totalPages) || 1)
        page += 1
      } while (page <= totalPages)
      setProducts(catalog.map(toShopProduct))
    } catch (error) {
      setProductsError(error instanceof Error ? error.message : 'The product catalog could not be loaded.')
    } finally {
      setProductsLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  useEffect(() => {
    if (!API_BASE_URL) return undefined
    const apiBase = `${API_BASE_URL}/api`
    let active = true
    fetch(`${apiBase}/content/shop`)
      .then(async (response) => {
        if (response.status === 404) return null
        const body = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(body.message || 'Shop banner image could not be loaded.')
        return body.content?.heroImage
      })
      .then((image) => {
        if (active && typeof image === 'string' && image.trim()) setShopHeroImage(image)
      })
      .catch((error) => {
        if (active) console.error(error.message || 'Shop banner image could not be loaded.')
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!productsLoading && category !== 'All' && !CATEGORIES.includes(category)) setCategory('All')
  }, [CATEGORIES, category, productsLoading])

  const sizes = useMemo(
    () => [...new Set(products.flatMap((product) => product.sizeOptions))],
    [products]
  )
  const colors = useMemo(
    () => [...new Set(products.flatMap((product) => product.colorOptions))].map((hex) => ({
      name: `Color ${hex}`,
      hex,
    })),
    [products]
  )
  const availableSizes = useMemo(
    () => new Set(products.filter((product) => category === 'All' || product.category === category).flatMap((product) => product.sizeOptions)),
    [category, products]
  )
  const availableColors = useMemo(
    () => new Set(products.filter((product) => category === 'All' || product.category === category).flatMap((product) => product.colorOptions)),
    [category, products]
  )

  // Category -> product count (sidebar + pills)
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length }
    CATEGORIES.slice(1).forEach((c) => {
      counts[c] = products.filter((p) => p.category === c).length
    })
    return counts
  }, [CATEGORIES, products])

  // Persist theme / cart / wishlist
  useEffect(() => saveToStorage('vexora-dark', darkMode), [darkMode])
  useEffect(() => saveToStorage('vexora-cart', cart), [cart])
  useEffect(() => saveToStorage('vexora-wishlist', wishlist), [wishlist])

  // Loader skeleton + URL sync
  useEffect(() => {
    const params = new URLSearchParams()
    if (category !== 'All') params.set('category', category)
    if (selectedSize !== 'All') params.set('size', selectedSize)
    if (minPrice > 0) params.set('minPrice', minPrice)
    if (priceRange < MAX_PRICE) params.set('maxPrice', priceRange)
    if (saleOnly) params.set('sale', 'true')
    const query = params.toString()
    window.history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : ''))
  }, [category, sort, minPrice, priceRange, selectedSize, selectedColor, saleOnly])

  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    document.title = category === 'All' ? 'Shop VEXORA | Premium Modest Wear' : `${category} | Shop VEXORA`
    if (description) description.content = `Explore ${category === 'All' ? 'VEXORA premium modest wear and contemporary essentials' : category + ' from VEXORA'}. Shop curated clothing and accessories online.`
    return () => {
      document.title = previousTitle
      if (description && previousDescription !== undefined) description.content = previousDescription
    }
  }, [category])

  // Toast auto-hide
  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(''), 1800)
    return () => clearTimeout(t)
  }, [toastMsg])

  // ESC closes any open overlay
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false)
        setIsWishlistOpen(false)
        setMobileFilterOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!mobileFilterOpen) return undefined
    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const drawer = mobileFilterRef.current
    drawer?.querySelector('button, input, select')?.focus()

    const trapFocus = (event) => {
      if (event.key !== 'Tab' || !drawer) return
      const focusable = [...drawer.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled)')]
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', trapFocus)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', trapFocus)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [mobileFilterOpen])

  const visibleProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    const result = products.filter((p) => {
      const matchCat = category === 'All' || p.category === category
      const matchPrice = p.price >= minPrice && p.price <= priceRange
      const matchSale = !saleOnly || p.oldPrice > p.price
      const matchSize = selectedSize === 'All' || p.sizeOptions.includes(selectedSize)
      const matchColor = selectedColor === 'All' || p.colorOptions.includes(selectedColor)
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      return matchCat && matchPrice && matchSale && matchSize && matchColor && matchSearch
    })
    return [...result].sort((a, b) => {
      if (sort === 'Price: Low to High') return a.price - b.price
      if (sort === 'Price: High to Low') return b.price - a.price
      if (sort === 'Top Rated') return b.rating - a.rating
      return 0
    })
  }, [products, category, sort, minPrice, priceRange, saleOnly, selectedSize, selectedColor, search])

  const wishlistProducts = useMemo(() => products.filter((p) => wishlist.includes(p.id)), [wishlist])

  const handleToggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
    setToastMsg(wishlist.includes(productId) ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  const handleAddToCart = (product, variant = {}) => {
    const selectedSize = variant.size || (product.sizeOptions?.length === 1 ? product.sizeOptions[0] : '')
    const selectedColor = variant.color || (product.colorOptions?.length === 1 ? product.colorOptions[0] : '')
    const quantity = Number.isInteger(variant.quantity) && variant.quantity > 0 ? variant.quantity : 1

    if ((product.sizeOptions?.length > 1 && !selectedSize) || (product.colorOptions?.length > 1 && !selectedColor)) {
      setIsWishlistOpen(false)
      handleQuickView(product)
      setToastMsg('Choose your size and color to continue.')
      return
    }

    const cartLineId = `${product.id}:${selectedSize}:${selectedColor}`
    setCart((prev) => {
      const existing = prev.find((item) => (item.cartLineId || item.id) === cartLineId)
      if (existing) {
        return prev.map((item) => ((item.cartLineId || item.id) === cartLineId ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prev, {
        ...product,
        productId: product.productId || product._id || product.id,
        cartLineId,
        selectedSize,
        selectedColor,
        quantity,
      }]
    })
    setToastMsg(`${product.name} added to cart`)
    setQuickViewProduct(null)
    setIsWishlistOpen(false)
    setIsCartOpen(true)
  }

  const handleUpdateQty = (cartLineId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if ((item.cartLineId || item.id) === cartLineId) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean)
    )
  }

  const handleRemoveFromCart = (cartLineId) => {
    setCart((prev) => prev.filter((item) => (item.cartLineId || item.id) !== cartLineId))
  }

  const handleQuickView = (product) => {
    setQuickViewProduct(product)
    setRecentlyViewed((prev) => {
      if (prev.some((p) => p.id === product.id)) return prev
      return [product, ...prev].slice(0, 4)
    })
  }

  const handleCheckout = async (customerInfo) => {
    if (checkoutLoading || cart.length === 0) return

    setCheckoutLoading(true)
    setCheckoutError('')
    try {
      if (!API_BASE_URL) throw new Error('Checkout is not configured. Set VITE_API_URL to the backend URL.')
      const apiBase = `${API_BASE_URL}/api`
      const response = await fetch(`${apiBase}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          cartItems: cart.map((item) => ({
            productId: item.productId || item._id || item.id,
            name: item.name,
            qty: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            selectedSize: item.selectedSize || '',
            selectedColor: item.selectedColor || '',
          })),
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'We could not send your order. Please try again.')
      }

      setCart([])
      setIsCartOpen(false)
      // Redirect to order success page with orderId
      window.location.href = `/order-success?orderId=${result.orderId}`
    } catch (error) {
      const message = error instanceof Error ? error.message : 'We could not send your order. Please try again.'
      setCheckoutError(message)
    } finally {
      setCheckoutLoading(false)
    }
  }

  const resetAllFilters = () => {
    setCategory('All')
    setPriceRange(MAX_PRICE)
    setMinPrice(0)
    setSelectedSize('All')
    setSelectedColor('All')
    setSaleOnly(false)
    setSort('Featured')
    setSearch('')
  }

  const hasActiveFilters =
    category !== 'All' || selectedSize !== 'All' || selectedColor !== 'All' || minPrice > 0 || priceRange < MAX_PRICE || saleOnly || search.trim() !== ''

  return (
    <div className={darkMode ? 'dark bg-[#1a1512] text-white min-h-screen flex flex-col' : 'bg-[#f3efe9] text-coffee-900 min-h-screen flex flex-col'}>

      <ScrollProgress />
      <AnnouncementBar />
      <Header
        cartCount={cart.reduce((a, c) => a + c.quantity, 0)}
        wishlistCount={wishlist.length}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        search={search}
        setSearch={setSearch}
      />

      {/* SHOP HERO BANNER */}
      <section className="relative overflow-hidden bg-[#543f32]">
        <div
          className="mx-auto flex min-h-[230px] max-w-[1380px] items-center px-5 py-9 sm:min-h-[265px] lg:px-10"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(31,21,17,0.78) 0%, rgba(31,21,17,0.56) 42%, rgba(31,21,17,0.18) 75%), url(${shopHeroImage})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        >
          <div className="max-w-[510px] text-[#f5f0ea]">
            <nav aria-label="Breadcrumb" className="mb-4 text-[10px] font-medium uppercase tracking-[0.16em] text-[#e9dccf]">
              <a href="/" className="hover:text-white">Home</a><span className="mx-2" aria-hidden="true">/</span>
              <a href="/shop" className="hover:text-white">Shop</a>
              {category !== 'All' && <><span className="mx-2" aria-hidden="true">/</span><span aria-current="page">{category}</span></>}
            </nav>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e9dccf]">
              {category === 'All' ? 'Shop our collection' : `Shop · ${category}`}
            </p>
            <h1 className="mt-2 font-display text-4xl sm:text-6xl font-semibold leading-[.95] tracking-[-.04em]">
              Premium Modest Wear<br />for Every Style.
            </h1>
            <p className="mt-5 max-w-[410px] text-sm leading-6 text-[#ece3dc]">
              Traditional roots. Modern attitude. Discover premium quality clothing, accessories and more.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <div className="mx-auto grid max-w-[1380px] gap-8 px-5 py-10 lg:grid-cols-[240px_1fr] lg:px-10 flex-1 w-full">

        {/* STICKY FILTER SIDEBAR (Desktop) */}
        <aside className="hidden rounded-[8px] border border-[#e2d7cf] dark:border-[#33251e] bg-white/60 dark:bg-[#241a15] p-5 lg:block h-fit sticky top-32">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm">Filters</h2>
            <button onClick={resetAllFilters} className="text-[11px] text-coffee-600 dark:text-gray-400 underline hover:text-coffee-900 dark:hover:text-white">Reset All</button>
          </div>

          <div className="mt-6 border-t border-[#e2d7cf] dark:border-[#33251e] pt-5">
            <p className="text-xs font-semibold uppercase tracking-[.14em]">Category</p>
            <div className="mt-3 space-y-2.5">
              {CATEGORIES.map((item) => (
                <label key={item} className="flex cursor-pointer items-center justify-between gap-2 text-xs text-coffee-700 dark:text-gray-300">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="category-sidebar"
                      checked={category === item}
                      onChange={() => setCategory(item)}
                      style={{ accentColor: ACCENT }}
                    />
                    {item}
                  </span>
                  <span className="text-[10px] text-coffee-500 dark:text-gray-500">({categoryCounts[item]})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-[#e2d7cf] dark:border-[#33251e] pt-5">
            <p className="text-xs font-semibold uppercase tracking-[.14em]">Price range (PKR)</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="text-[10px] text-coffee-600 dark:text-gray-400">Minimum
                <input type="number" min="0" max={priceRange} step="500" value={minPrice} onChange={(event) => setMinPrice(Math.max(0, Math.min(Number(event.target.value) || 0, priceRange)))} className="mt-1 w-full rounded border border-[#e2d7cf] bg-white/70 px-2 py-1.5 text-xs text-coffee-900 dark:border-[#3d2a1f] dark:bg-[#1a1512] dark:text-white" />
              </label>
              <label className="text-[10px] text-coffee-600 dark:text-gray-400">Maximum
                <input type="number" min={minPrice} max={MAX_PRICE} step="500" value={priceRange} onChange={(event) => setPriceRange(Math.max(minPrice, Math.min(Number(event.target.value) || MAX_PRICE, MAX_PRICE)))} className="mt-1 w-full rounded border border-[#e2d7cf] bg-white/70 px-2 py-1.5 text-xs text-coffee-900 dark:border-[#3d2a1f] dark:bg-[#1a1512] dark:text-white" />
              </label>
            </div>
            <input
              type="range"
              min={Math.max(minPrice, 1000)}
              max={MAX_PRICE}
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Math.max(minPrice, Number(e.target.value)))}
              className="w-full mt-3 cursor-pointer"
              style={{ accentColor: ACCENT }}
            />
          </div>

          <div className="mt-6 border-t border-[#e2d7cf] dark:border-[#33251e] pt-5">
            <p className="text-xs font-semibold uppercase tracking-[.14em]">Size</p>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  disabled={!availableSizes.has(size)}
                  onClick={() => setSelectedSize(selectedSize === size ? 'All' : size)}
                  className={`border py-1.5 text-xs transition rounded disabled:cursor-not-allowed disabled:opacity-35 ${selectedSize === size ? 'bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white border-coffee-900' : 'border-[#e2d7cf] dark:border-[#3d2a1f] hover:border-coffee-700'}`}
                >
                  {size}
                </button>
              ))}
            </div>
            <label className="mt-6 flex items-center gap-2 border-t border-[#e2d7cf] pt-5 text-xs text-coffee-700 dark:border-[#33251e] dark:text-gray-300">
              <input type="checkbox" checked={saleOnly} onChange={(event) => setSaleOnly(event.target.checked)} className="accent-[#6f4e37]" />
              On-sale products
            </label>
          </div>

          <div className="mt-6 border-t border-[#e2d7cf] dark:border-[#33251e] pt-5">
            <p className="text-xs font-semibold uppercase tracking-[.14em]">Color</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  disabled={!availableColors.has(c.hex)}
                  onClick={() => setSelectedColor(selectedColor === c.hex ? 'All' : c.hex)}
                  aria-label={c.name}
                  aria-pressed={selectedColor === c.hex}
                  className={`h-6 w-6 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-30 ${selectedColor === c.hex ? 'ring-2 ring-coffee-900 dark:ring-white scale-110' : 'border-[#e2d7cf] dark:border-[#3d2a1f]'}`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <section>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-coffee-700 dark:text-gray-300">
              Showing <strong>{visibleProducts.length}</strong> of {products.length} products
              {search.trim() && (
                <> for “<span style={{ color: ACCENT }} className="font-semibold">{search.trim()}</span>”</>
              )}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                aria-expanded={mobileFilterOpen}
                aria-controls="shop-filter-drawer"
                className="flex items-center gap-2 border border-[#e2d7cf] dark:border-[#3d2a1f] bg-white/70 dark:bg-[#241a15] px-3 py-2 text-xs lg:hidden rounded-md shadow-sm"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>

              <div className="hidden sm:flex border border-[#e2d7cf] dark:border-[#3d2a1f] rounded-md bg-white/70 dark:bg-[#241a15] overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white' : 'text-coffee-700 dark:text-gray-300'}`}
                  title="Grid View"
                >
                  <Grid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                  className={`p-2 ${viewMode === 'list' ? 'bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white' : 'text-coffee-700 dark:text-gray-300'}`}
                  title="List View"
                >
                  <List size={14} />
                </button>
              </div>

              <label className="flex items-center gap-2 border border-[#e2d7cf] dark:border-[#3d2a1f] bg-white/70 dark:bg-[#241a15] px-3 py-2 text-xs rounded-md shadow-sm">
                Sort by
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="bg-transparent font-semibold outline-none cursor-pointer"
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
                <ChevronDown size={13} />
              </label>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap gap-2 items-center">
              <span className="text-[11px] text-coffee-600 dark:text-gray-400 font-medium">Active Filters:</span>
              {search.trim() && (
                <span className="inline-flex items-center gap-1 bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white text-[11px] px-2.5 py-1 rounded-full">
                  “{search.trim()}” <X size={12} className="cursor-pointer" onClick={() => setSearch('')} />
                </span>
              )}
              {category !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white text-[11px] px-2.5 py-1 rounded-full">
                  {category} <X size={12} className="cursor-pointer" onClick={() => setCategory('All')} />
                </span>
              )}
              {selectedSize !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white text-[11px] px-2.5 py-1 rounded-full">
                  Size: {selectedSize} <X size={12} className="cursor-pointer" onClick={() => setSelectedSize('All')} />
                </span>
              )}
              {selectedColor !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white text-[11px] px-2.5 py-1 rounded-full">
                  Color {selectedColor} <X size={12} className="cursor-pointer" onClick={() => setSelectedColor('All')} />
                </span>
              )}
              {minPrice > 0 && <button onClick={() => setMinPrice(0)} className="rounded-full bg-coffee-900 px-2.5 py-1 text-[11px] text-white dark:bg-white dark:text-coffee-900">From PKR {minPrice.toLocaleString()} ×</button>}
              {priceRange < MAX_PRICE && (
                <span className="inline-flex items-center gap-1 bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white text-[11px] px-2.5 py-1 rounded-full">
                  Under PKR {priceRange.toLocaleString()} <X size={12} className="cursor-pointer" onClick={() => setPriceRange(MAX_PRICE)} />
                </span>
              )}
              {saleOnly && <button onClick={() => setSaleOnly(false)} className="rounded-full bg-coffee-900 px-2.5 py-1 text-[11px] text-white dark:bg-white dark:text-coffee-900">On sale ×</button>}
              <button onClick={resetAllFilters} className="text-[11px] text-coffee-700 dark:text-gray-300 underline ml-2">Clear All</button>
            </div>
          )}

          {productsError ? (
            <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-900">
              <h3 className="font-display text-xl font-bold">Products could not be loaded</h3>
              <p className="mt-2 text-sm">{productsError}</p>
              <button onClick={loadProducts} className="mt-5 rounded-full bg-[#1a1512] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white">Try again</button>
            </div>
          ) : productsLoading ? (
            <div aria-live="polite" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, index) => <ProductCardSkeleton key={index} />)}</div>
          ) : visibleProducts.length === 0 ? (
            <div className="text-center py-20 bg-white/60 dark:bg-[#241a15] rounded-2xl border border-[#e2d7cf] dark:border-[#33251e] p-8">
              <ShoppingBag size={48} className="mx-auto mb-3 text-coffee-400 dark:text-gray-500" />
              <h3 className="font-display text-xl font-bold">No products match your filters</h3>
              <p className="text-xs text-coffee-600 dark:text-gray-400 mt-1 max-w-sm mx-auto">Try adjusting your search, category, or price range to view more items.</p>
              <button
                onClick={resetAllFilters}
                className="mt-5 rounded-full bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div
              key={`${category}-${sort}-${viewMode}`}
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3' : 'flex flex-col gap-4'}
            >
              {visibleProducts.map((product) => {
                const isWishlisted = wishlist.includes(product.id)
                const currentImg = hoveredImageMap[product.id] || product.images[0] || PRODUCT_FALLBACK_IMAGE

                return (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    className={`group relative overflow-hidden rounded-[16px] border border-[#e2d7cf] dark:border-[#33251e] bg-white/70 dark:bg-[#1a1512] p-3 shadow-sm transition hover:shadow-md hover:-translate-y-0.5 ${viewMode === 'list' ? 'flex gap-4 items-center' : ''}`}
                  >
                    <div
                      className={`relative overflow-hidden rounded-[12px] bg-[#efe8e2] dark:bg-[#261d18] ${viewMode === 'list' ? 'w-40 h-40 flex-shrink-0' : 'h-[260px]'}`}
                      onMouseEnter={() => product.images[1] && setHoveredImageMap((prev) => ({ ...prev, [product.id]: product.images[1] }))}
                      onMouseLeave={() => setHoveredImageMap((prev) => ({ ...prev, [product.id]: product.images[0] }))}
                    >
                      {product.oldPrice > product.price && (
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#6f4e37] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          Sale · {Math.round((1 - product.price / product.oldPrice) * 100)}% off
                        </span>
                      )}
                      <button type="button" onClick={() => handleQuickView(product)} aria-label={`Quick view ${product.name}`} className="absolute inset-0 z-0 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#6f4e37]">
                        <img
                          src={currentImg}
                          alt={product.name}
                          onError={(event) => { event.currentTarget.src = PRODUCT_FALLBACK_IMAGE }}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/20">
                          <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-coffee-900 opacity-0 shadow transition group-hover:opacity-100">
                            <Eye size={12} /> Quick View
                          </span>
                        </span>
                      </button>

                      <button
                        onClick={() => handleToggleWishlist(product.id)}
                        aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                        className={`absolute right-3 top-3 z-10 rounded-full p-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${isWishlisted ? 'bg-[#8c6d53] text-white' : 'bg-black/55 text-white hover:bg-black/75'}`}
                      >
                        <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className={`pt-3 flex-1 ${viewMode === 'list' ? 'pt-0' : ''}`}>
                      <div className="flex justify-between items-center gap-2 text-xs font-bold uppercase text-[#1a1512] dark:text-white">
                        <a href={`/product/${encodeURIComponent(product.id)}`} className="truncate hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37]">{product.name}</a>
                        {Number.isFinite(product.rating) && <span className="text-amber-700 dark:text-amber-400 flex items-center gap-0.5 flex-shrink-0"><Star size={11} fill="currentColor" /> {product.rating}</span>}
                      </div>
                      <p className="text-[11px] text-coffee-700 dark:text-gray-300 mt-0.5">
                        {product.category}{product.colorOptions.length ? ` · ${product.colorOptions.length} color${product.colorOptions.length === 1 ? '' : 's'}` : ''}{product.sizeOptions.length ? ` · ${product.sizeOptions.join(', ')}` : ''}
                      </p>
                      {Number.isFinite(product.reviews) && <p className="mt-1 text-[10px] text-coffee-600 dark:text-gray-400">{product.reviews} reviews</p>}

                      {viewMode === 'list' && (
                        <p className="text-xs text-coffee-700 dark:text-gray-300 mt-2 line-clamp-2">{product.description}</p>
                      )}

                      <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#e2d7cf]/40 dark:border-[#33251e]">
                        <span className="flex flex-wrap items-center gap-x-2 text-sm font-bold text-[#1a1512] dark:text-white">
                          {product.priceFormatted}
                          {product.oldPrice > product.price && <span className="text-[11px] font-normal text-coffee-600 line-through dark:text-gray-400">{product.originalPriceFormatted}</span>}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          className="rounded-full bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider hover:opacity-95 transition shadow-sm"
                        >
                          Add to Cart
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {recentlyViewed.length > 0 && (
            <div className="mt-14 border-t border-[#e2d7cf] dark:border-[#33251e] pt-8">
              <h3 className="font-display text-lg font-semibold mb-4">Continue Browsing (Recently Viewed)</h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {recentlyViewed.map((item) => (
                  <div key={item.id} onClick={() => handleQuickView(item)} className="min-w-[160px] bg-white/70 dark:bg-[#241a15] p-2.5 rounded-xl border border-[#e2d7cf] dark:border-[#33251e] cursor-pointer shadow-sm">
                    <img src={item.images?.[0] || PRODUCT_FALLBACK_IMAGE} alt={item.name} onError={(event) => { event.currentTarget.src = PRODUCT_FALLBACK_IMAGE }} className="h-24 w-full object-cover rounded-lg" loading="lazy" />
                    <h4 className="text-[11px] font-bold mt-2 truncate">{item.name}</h4>
                    <p className="text-[10px] text-coffee-600 dark:text-gray-400">{item.priceFormatted}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <Footer />

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              id="shop-filter-drawer"
              ref={mobileFilterRef}
              role="dialog"
              aria-modal="true"
              aria-label="Shop filters"
              className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-[#f3efe9] dark:bg-[#1a1512] rounded-t-[24px] p-6 overflow-y-auto lg:hidden shadow-2xl border-t border-[#e2d7cf] dark:border-[#33251e]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#e2d7cf] dark:border-[#33251e]">
                <h3 className="font-display text-lg font-bold">Filters & Sorting</h3>
                <button onClick={() => setMobileFilterOpen(false)} aria-label="Close filters" className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-[.14em]">Category</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {CATEGORIES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setCategory(item)}
                      className={`border py-2 text-xs rounded-lg transition ${category === item ? 'bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white border-coffee-900 font-semibold' : 'border-[#e2d7cf] dark:border-[#3d2a1f]'}`}
                    >
                      {item} ({categoryCounts[item]})
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[.14em]">Price range (PKR)</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <label className="text-[10px] text-coffee-600 dark:text-gray-400">Minimum
                    <input type="number" min="0" max={priceRange} step="500" value={minPrice} onChange={(event) => setMinPrice(Math.max(0, Math.min(Number(event.target.value) || 0, priceRange)))} className="mt-1 w-full rounded border border-[#e2d7cf] bg-white/70 px-2 py-2 text-xs text-coffee-900 dark:border-[#3d2a1f] dark:bg-[#241a15] dark:text-white" />
                  </label>
                  <label className="text-[10px] text-coffee-600 dark:text-gray-400">Maximum
                    <input type="number" min={minPrice} max={MAX_PRICE} step="500" value={priceRange} onChange={(event) => setPriceRange(Math.max(minPrice, Math.min(Number(event.target.value) || MAX_PRICE, MAX_PRICE)))} className="mt-1 w-full rounded border border-[#e2d7cf] bg-white/70 px-2 py-2 text-xs text-coffee-900 dark:border-[#3d2a1f] dark:bg-[#241a15] dark:text-white" />
                  </label>
                </div>
                <input
                  type="range"
                  min={Math.max(minPrice, 1000)}
                  max={MAX_PRICE}
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Math.max(minPrice, Number(e.target.value)))}
                  className="w-full mt-3"
                  style={{ accentColor: ACCENT }}
                />
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[.14em]">Size</p>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      disabled={!availableSizes.has(size)}
                      onClick={() => setSelectedSize(selectedSize === size ? 'All' : size)}
                      className={`border py-2 text-xs rounded-lg disabled:cursor-not-allowed disabled:opacity-35 ${selectedSize === size ? 'bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white border-coffee-900 font-semibold' : 'border-[#e2d7cf] dark:border-[#3d2a1f]'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <label className="mt-6 flex items-center gap-2 text-xs text-coffee-700 dark:text-gray-300">
                  <input type="checkbox" checked={saleOnly} onChange={(event) => setSaleOnly(event.target.checked)} className="accent-[#6f4e37]" />
                  On-sale products
                </label>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-[.14em]">Color</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.hex}
                      disabled={!availableColors.has(c.hex)}
                      onClick={() => setSelectedColor(selectedColor === c.hex ? 'All' : c.hex)}
                      aria-label={c.name}
                      aria-pressed={selectedColor === c.hex}
                      className={`h-8 w-8 rounded-full border transition disabled:cursor-not-allowed disabled:opacity-30 ${selectedColor === c.hex ? 'ring-2 ring-coffee-900 dark:ring-white scale-110' : 'border-[#e2d7cf] dark:border-[#3d2a1f]'}`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#e2d7cf] dark:border-[#33251e] flex gap-3">
                <button
                  onClick={resetAllFilters}
                  className="flex-1 rounded-full border border-[#e2d7cf] dark:border-[#3d2a1f] py-3 text-xs font-semibold uppercase tracking-widest"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-[2] rounded-full bg-coffee-900 dark:bg-white dark:text-coffee-900 text-white py-3 text-xs font-semibold uppercase tracking-widest shadow"
                >
                  Apply Filters ({visibleProducts.length} Results)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <QuickViewModal
        product={quickViewProduct}
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
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
        checkoutError={checkoutError}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistProducts}
        onRemove={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />

      <BackToTop />
      <WhatsAppButton />
      <Toast message={toastMsg} />
    </div>
  )
}