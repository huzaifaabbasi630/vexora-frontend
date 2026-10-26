import { useState, useEffect } from 'react'
import {
  ArrowRight,
  Check,
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  Sun,
  Moon,
  MessageCircle,
  ChevronRight,
  Mail,
  Clock3,
  MapPin,
  Shirt,
  Sparkles,
  Send,
  PackageCheck,
  Ruler,
  ShieldCheck,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { contentPages, footerNavigation, primaryNavigation } from '../data/navigation'
import { BUSINESS_EMAIL, BUSINESS_HOURS, BUSINESS_WHATSAPP } from '../data/contact'
import storyImage from '../../assets/heroimg/shopheroimg.png'
import { API_BASE_URL } from '../config/api'

const navLinks = primaryNavigation
const { quickLinks, customerCare, whyVexora } = footerNavigation

const actionRoutes = {
  'Shop Jubbe & Abaya': '/shop?category=Jubbe%20%26%20Abaya',
  'Shop Kurta Shalwar': '/shop?category=Kurta%20Shalwar',
  'Shop Accessories': '/shop?category=Watches%20%26%20Glasses',
  'Explore the shop': '/shop',
  'Explore collections': '/shop',
  'Start shopping': '/shop',
  'Browse accessories': '/shop?category=Watches%20%26%20Glasses',
  'See our quality promise': '/premium-quality',
  'Talk to our team': '/contact',
  'Contact support': '/contact',
  'Read shipping info': '/shipping-info',
  'Read returns policy': '/returns-exchanges',
  'Read the size guide': '/size-guide',
  'Check the size guide': '/size-guide',
  'Read the FAQ': '/faq',
  'Read COD details': '/cash-on-delivery',
  'View transfer options': '/online-transfer',
  'Read privacy policy': '/privacy',
  'Read terms': '/terms',
  'Chat on WhatsApp': `https://wa.me/${BUSINESS_WHATSAPP}`,
  'Email Vexora': `mailto:${BUSINESS_EMAIL}`,
}

const routeForLabel = (label) => {
  const allLinks = [
    ...primaryNavigation,
    ...footerNavigation.customerCare,
    ...footerNavigation.whyVexora,
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms & Conditions', path: '/terms' },
  ]
  return actionRoutes[label] || allLinks.find((link) => link.label === label)?.path || '/contact'
}

const crossLinkCandidates = [
  { label: 'About Us', path: '/about' },
  { label: 'Contact', path: '/contact' },
  { label: 'FAQ', path: '/faq' },
  { label: 'Shipping Info', path: '/shipping-info' },
  { label: 'Returns & Exchanges', path: '/returns-exchanges' },
  { label: 'Size Guide', path: '/size-guide' },
]

const contactSubjects = ['Product question', 'Sizing help', 'Order support', 'Shipping', 'Returns and exchanges', 'Other']

// ---------------------------------------------
// SHARED HEADER / FOOTER PIECES
// ---------------------------------------------

function AnnouncementBar() {
  return (
    <div className="bg-[#4a382a] dark:bg-[#2e2118] text-[#f8f5f0] py-2 text-center text-[12px] tracking-wider uppercase font-medium border-b border-[#3b2c21]">
      ✨ Free Nationwide Shipping Across Pakistan on Orders Over PKR 5,000 | Cash Available 🚚
    </div>
  )
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent">
      <div
        className="h-full transition-[width] duration-150"
        style={{ width: `${progress}%`, backgroundColor: '#8c6d53' }}
      />
    </div>
  )
}

function Header({ cartCount, wishlistCount, darkMode, setDarkMode, onCartClick, onWishlistClick, pageKey }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 90)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <div className="bg-[#f3efe9] dark:bg-[#1a1512] border-b border-[#e2d7cf] dark:border-[#33251e] py-4 px-4 text-center transition-colors">
        <h6 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#2c1d11] dark:text-white">
          VEXORA
        </h6>
      </div>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-md bg-[#f3efe9]/95 dark:bg-[#1a1512]/95 shadow-sm border-b border-[#e2d7cf] dark:border-[#33251e]'
            : 'bg-[#f3efe9] dark:bg-[#1a1512]'
        }`}
      >
        <div className="mx-auto max-w-[1380px] px-4 lg:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="lg:hidden text-[#2c1d11] dark:text-[#f3efe9]"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium uppercase tracking-widest text-[#5c4a3a] dark:text-[#d1c2b5]">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className={`hover:text-[#2c1d11] dark:hover:text-white transition ${
                    link.path === pageKey
                      ? 'text-[#2c1d11] dark:text-white border-b-2 border-[#2c1d11] dark:border-white pb-0.5 font-semibold'
                      : ''
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className={`transition-all duration-300 ${isScrolled ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
            <span className="font-display text-xl font-bold tracking-tight text-[#2c1d11] dark:text-white">VEXORA</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              className="p-2 rounded-full border border-[#d8c8bc] dark:border-[#3d2a1f] text-[#2c1d11] dark:text-[#f3efe9] transition hover:bg-black/5 dark:hover:bg-white/10"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative hidden sm:block">
              <input
                type="text"
                aria-label="Search"
                placeholder="Search..."
                className="rounded-full border border-[#d8c8bc] dark:border-[#3d2a1f] bg-white/80 dark:bg-[#241a15] px-3 py-1.5 text-[12px] text-[#2c1d11] dark:text-white placeholder-[#7a6858] dark:placeholder-gray-400 focus:outline-none w-36 lg:w-48"
              />
              <Search size={13} className="absolute right-3 top-2.5 text-[#7a6858] dark:text-gray-400" />
            </div>
            <button
              onClick={onWishlistClick}
              aria-label={`Wishlist${wishlistCount ? `, ${wishlistCount} items` : ''}`}
              className="relative p-2 rounded-full border border-[#d8c8bc] dark:border-[#3d2a1f] text-[#2c1d11] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
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
              className="relative p-2 rounded-full border border-[#d8c8bc] dark:border-[#3d2a1f] text-[#2c1d11] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              <ShoppingBag size={16} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2c1d11] dark:bg-white dark:text-[#2c1d11] text-[9px] text-white">
                  {cartCount}
                </span>
              )}
            </button>
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
              <div className="flex flex-col space-y-4 text-sm font-semibold uppercase tracking-widest text-[#2c1d11] dark:text-white">
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
    <footer className="bg-[#eaddcf] dark:bg-[#120e0c] border-t border-[#d8c8bc] dark:border-[#2b201d] pt-12 pb-8 transition-colors">
      <div className="mx-auto max-w-[1380px] px-4 lg:px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 text-[#2c1d11] dark:text-gray-300">
        <div className="lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-[#2c1d11] dark:text-white">VEXORA</h2>
          <p className="mt-3 text-xs text-[#5c4a3a] dark:text-gray-400 max-w-sm leading-relaxed">
            Modest wear, contemporary styling, and accessories selected for everyday personal style.
          </p>
          <div className="mt-5 flex gap-4 text-[#4a382a] dark:text-gray-400">
            <a href={`https://wa.me/${BUSINESS_WHATSAPP}`} aria-label="VEXORA on WhatsApp" className="rounded-sm hover:text-[#2c1d11] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6f4e37] dark:hover:text-white transition"><MessageCircle size={18} /></a>
            <a href={`mailto:${BUSINESS_EMAIL}`} aria-label="Email VEXORA" className="rounded-sm hover:text-[#2c1d11] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6f4e37] dark:hover:text-white transition"><Mail size={18} /></a>
          </div>
        </div>
        <FooterColumn title="Quick Links" items={quickLinks} />
        <FooterColumn title="Customer Care" items={customerCare} />
        <FooterColumn title="Why Vexora" items={whyVexora} />
      </div>
      <div className="mx-auto max-w-[1380px] px-4 lg:px-6 mt-10 pt-4 border-t border-[#d8c8bc] dark:border-[#2b201d] flex flex-col sm:flex-row justify-between gap-3 text-[11px] text-[#6e5a4b] dark:text-gray-500">
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
      <div className="text-[12px] font-semibold uppercase tracking-wider text-[#2c1d11] dark:text-white">{title}</div>
      <ul className="mt-3 space-y-2 text-[12px] text-[#5c4a3a] dark:text-gray-400">
        {items.map((item) => (
          <li key={item.path} className="cursor-pointer hover:text-[#2c1d11] dark:hover:text-white transition">
            <a href={item.path}>{item.label}</a>
          </li>
        ))}
      </ul>
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
          className="fixed bottom-6 left-1/2 z-[110] rounded-full bg-[#2c1d11] dark:bg-white dark:text-[#2c1d11] text-white px-5 py-2.5 text-[12px] font-semibold shadow-xl border border-[#4a382a]/20"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function WhatsAppButton() {
  const handleClick = () => {
    window.open(`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent('Hi Vexora, I have a question.')}`, '_blank', 'noopener,noreferrer')
  }
  return (
    <button
      onClick={handleClick}
      aria-label="Chat with VEXORA on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#187a43] text-white shadow-2xl transition hover:bg-[#126537] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1512]"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" className="text-white" />
    </button>
  )
}

function AboutContent({ content = {} }) {
  const values = [
    { title: 'Rooted Here', text: 'VEXORA is shaped by everyday life in Pakistan, with pieces chosen for the moments and routines that make up real days.', icon: MapPin, href: '/shop', action: 'Explore the shop' },
    { title: 'Designed with Intention', text: 'Modest silhouettes meet contemporary styling, giving you room to express your own sense of personal style.', icon: Shirt, href: '/premium-quality', action: 'Our quality approach' },
    { title: 'A Personal Standard', text: 'From browsing to delivery, we aim to make choosing, ordering and getting support feel straightforward.', icon: Sparkles, href: '/contact', action: 'Contact our team' },
  ]

  return (
    <main className="mx-auto max-w-[1380px] px-4 pb-20 pt-7 lg:px-8 lg:pt-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#514238] dark:text-[#d8c8bc]">
        <a href="/" className="rounded-sm hover:text-[#6f4e37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6f4e37]">Home</a>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page" className="text-[#1a1512] dark:text-white">About</span>
      </nav>

      <section className="mt-5 grid overflow-hidden rounded-[20px] border border-[#d8cfc5] bg-[#e8dfd5] dark:border-[#33251e] dark:bg-[#241a15] lg:min-h-[440px] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col justify-center px-6 py-9 sm:px-10 lg:px-12 lg:py-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6f4e37] dark:text-[#d8c8bc]">Our Story</p>
          <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-[1.02] tracking-tight text-[#1a1512] dark:text-[#f3efe9] sm:text-6xl">
            {content.title || 'Modest Meets Modern.'}
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-[#51463e] dark:text-[#d8cfc5] sm:text-base">
            {content.intro || 'VEXORA brings modest fashion and contemporary styling together through a considered edit of clothing and accessories for everyday life.'}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="/shop" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1a1512] px-6 text-xs font-semibold uppercase tracking-widest text-[#f3efe9] transition hover:bg-[#3b2a20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37]">
              Explore Our Collection <ArrowRight size={15} />
            </a>
            <a href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#6f4e37] px-6 text-xs font-semibold uppercase tracking-widest text-[#1a1512] transition hover:bg-[#6f4e37] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] dark:text-[#f3efe9]">
              Contact Us
            </a>
          </div>
        </div>
        <div className="relative min-h-[250px] sm:min-h-[350px] lg:min-h-full">
          <img src={storyImage} alt="Editorial VEXORA fashion campaign" fetchpriority="high" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1512]/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#1a1512]/10 lg:to-transparent" />
        </div>
      </section>

      <section className="mt-14 grid items-center gap-8 border-b border-[#d8cfc5] pb-14 dark:border-[#33251e] lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f4e37] dark:text-[#d8c8bc]">The VEXORA point of view</p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-[#1a1512] dark:text-[#f3efe9] sm:text-4xl">A more considered way to get dressed.</h2>
        </div>
        <div className="space-y-4 text-sm leading-7 text-[#51463e] dark:text-[#d8cfc5] sm:text-base">
          <p>We believe personal style can feel composed without feeling complicated. VEXORA brings together modest wear and modern essentials in one place, so you can explore pieces that feel like you.</p>
          <p>Our focus is the experience as much as the edit: clear product information, an easy way to ask questions, and support when you need help choosing or ordering.</p>
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f4e37] dark:text-[#d8c8bc]">What guides us</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[#1a1512] dark:text-[#f3efe9] sm:text-4xl">Values in the details.</h2>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {values.map(({ title, text, icon: Icon, href, action }) => (
            <article key={title} className="group flex min-h-[250px] flex-col rounded-xl border border-[#d8cfc5] bg-white/70 p-6 transition hover:-translate-y-1 hover:border-[#a38b78] hover:shadow-lg dark:border-[#3d2a1f] dark:bg-[#241a15]">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1512] text-[#f3efe9] dark:bg-[#f3efe9] dark:text-[#1a1512]"><Icon size={19} /></span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-[#1a1512] dark:text-[#f3efe9]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#51463e] dark:text-[#d8cfc5]">{text}</p>
              <a href={href} className="mt-auto inline-flex items-center gap-2 pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6f4e37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6f4e37] dark:text-[#d8c8bc]">
                {action}<ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 rounded-2xl bg-[#1a1512] p-6 text-[#f3efe9] sm:grid-cols-2 sm:p-9">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d8c8bc]">A considered approach</p>
          <h2 className="mt-3 font-display text-3xl font-semibold">No two days need the same look.</h2>
        </div>
        <div className="grid gap-4 text-sm leading-6 text-[#e0d6cc] sm:grid-cols-3">
          <p><strong className="block text-white">Modest</strong>Thoughtful coverage and comfort.</p>
          <p><strong className="block text-white">Modern</strong>Contemporary shapes and styling.</p>
          <p><strong className="block text-white">Personal</strong>Your wardrobe, your expression.</p>
        </div>
      </section>

      <section className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-[#d8cfc5] pt-9 dark:border-[#33251e] sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-3xl font-semibold text-[#1a1512] dark:text-[#f3efe9]">Find Your Everyday Style.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#51463e] dark:text-[#d8cfc5]">Discover thoughtfully selected pieces that bring modest style and contemporary design together.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="/shop" className="inline-flex min-h-11 items-center rounded-full bg-[#1a1512] px-5 text-xs font-semibold uppercase tracking-widest text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37]">Shop Collection</a>
          <a href="/contact" className="inline-flex min-h-11 items-center rounded-full border border-[#6f4e37] px-5 text-xs font-semibold uppercase tracking-widest text-[#1a1512] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] dark:text-white">Contact Us</a>
        </div>
      </section>
    </main>
  )
}

function ContactContent({ content = {} }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', orderNumber: '', message: '', website: '' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState({ type: '', message: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setResult({ type: '', message: '' })

    try {
      if (!API_BASE_URL) throw new Error('Contact form is not configured. Please use email or WhatsApp instead.')
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'We could not send your message. Please try again.')
      setResult({ type: 'success', message: data.message || 'Your message has been sent.' })
      setForm({ name: '', email: '', subject: '', orderNumber: '', message: '', website: '' })
    } catch (error) {
      setResult({ type: 'error', message: error instanceof Error ? error.message : 'We could not send your message. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'mt-1.5 w-full rounded-lg border border-[#cbbdaf] bg-white px-3.5 py-3 text-sm text-[#1a1512] placeholder:text-[#71645a] outline-none transition focus:border-[#6f4e37] focus:ring-2 focus:ring-[#6f4e37]/20 dark:border-[#51463e] dark:bg-[#241a15] dark:text-white dark:placeholder:text-[#c2b2a4]'

  return (
    <main className="mx-auto max-w-[1380px] px-4 pb-20 pt-7 lg:px-8 lg:pt-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#514238] dark:text-[#d8c8bc]">
        <a href="/" className="hover:text-[#6f4e37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6f4e37]">Home</a>
        <ChevronRight size={13} aria-hidden="true" />
        <span aria-current="page" className="text-[#1a1512] dark:text-white">Contact</span>
      </nav>

      <section className="mt-5 rounded-2xl bg-[#e8dfd5] px-6 py-9 dark:bg-[#241a15] sm:px-10 sm:py-12">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6f4e37] dark:text-[#d8c8bc]">We are here to help</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-[1.04] text-[#1a1512] dark:text-[#f3efe9] sm:text-6xl">{content.title || 'Let’s Make Your Next Order Easy.'}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[#51463e] dark:text-[#d8cfc5] sm:text-base">{content.intro || 'Questions about a product, sizing, delivery or an existing order? Contact our team using the channel that works best for you.'}</p>
        <a href="#contact-form" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#1a1512] px-5 text-xs font-semibold uppercase tracking-widest text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37]">
          Contact Support <ArrowRight size={14} />
        </a>
      </section>

      <section aria-label="Contact methods" className="mt-7 grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#d8cfc5] bg-white/75 p-5 dark:border-[#3d2a1f] dark:bg-[#241a15]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1512] text-white"><MessageCircle size={18} /></span>
          <h2 className="mt-4 font-display text-xl font-semibold text-[#1a1512] dark:text-white">WhatsApp</h2>
          <p className="mt-1 min-h-12 text-sm leading-6 text-[#51463e] dark:text-[#d8cfc5]">Ask about a product, fit or order directly.</p>
          <a href={`https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent('Hi Vexora, I have a question.')}`} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#6f4e37] px-4 text-[10px] font-bold uppercase tracking-wider text-[#1a1512] hover:bg-[#6f4e37] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] dark:text-white">Chat on WhatsApp <ArrowRight size={13} /></a>
        </article>
        <article className="rounded-xl border border-[#d8cfc5] bg-white/75 p-5 dark:border-[#3d2a1f] dark:bg-[#241a15]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1512] text-white"><Mail size={18} /></span>
          <h2 className="mt-4 font-display text-xl font-semibold text-[#1a1512] dark:text-white">Email</h2>
          <p className="mt-1 min-h-12 break-all text-sm leading-6 text-[#51463e] dark:text-[#d8cfc5]">{BUSINESS_EMAIL}</p>
          <a href={`mailto:${BUSINESS_EMAIL}`} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#6f4e37] px-4 text-[10px] font-bold uppercase tracking-wider text-[#1a1512] hover:bg-[#6f4e37] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] dark:text-white">Email VEXORA <ArrowRight size={13} /></a>
        </article>
        <article className="rounded-xl border border-[#d8cfc5] bg-white/75 p-5 dark:border-[#3d2a1f] dark:bg-[#241a15]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1512] text-white"><Clock3 size={18} /></span>
          <h2 className="mt-4 font-display text-xl font-semibold text-[#1a1512] dark:text-white">Business Hours</h2>
          <p className="mt-1 min-h-12 text-sm leading-6 text-[#51463e] dark:text-[#d8cfc5]">{BUSINESS_HOURS}</p>
          <a href="/shipping-info" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full border border-[#6f4e37] px-4 text-[10px] font-bold uppercase tracking-wider text-[#1a1512] hover:bg-[#6f4e37] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] dark:text-white">Shipping information <ArrowRight size={13} /></a>
        </article>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f4e37] dark:text-[#d8c8bc]">Order and customer support</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[#1a1512] dark:text-white">How can we help?</h2>
          <p className="mt-3 text-sm leading-6 text-[#51463e] dark:text-[#d8cfc5]">For tracking help, send your order number through the form or WhatsApp. There is no separate tracking portal on this site.</p>

          <div className="mt-6 space-y-2">
            {[
              { label: 'Ask about an order', href: '#contact-form', icon: PackageCheck },
              { label: 'Shipping information', href: '/shipping-info', icon: PackageCheck },
              { label: 'Returns & exchanges', href: '/returns-exchanges', icon: ShieldCheck },
              { label: 'Size guide', href: '/size-guide', icon: Ruler },
              { label: 'Frequently asked questions', href: '/faq', icon: Check },
            ].map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-[#d8cfc5] bg-white/60 px-4 text-sm font-medium text-[#1a1512] transition hover:border-[#6f4e37] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6f4e37] dark:border-[#3d2a1f] dark:bg-[#241a15] dark:text-white">
                <span className="flex items-center gap-3"><Icon size={16} className="text-[#6f4e37] dark:text-[#d8c8bc]" />{label}</span>
                <ArrowRight size={14} />
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-[#51463e] dark:text-[#d8cfc5]">We use the details you share to respond to your request. Please do not include passwords or payment card information.</p>
        </div>

        <form id="contact-form" onSubmit={handleSubmit} className="rounded-2xl border border-[#d8cfc5] bg-white/80 p-5 shadow-sm dark:border-[#3d2a1f] dark:bg-[#241a15] sm:p-7">
          <h2 className="font-display text-2xl font-semibold text-[#1a1512] dark:text-white">Send us a message</h2>
          <p className="mt-1 text-sm text-[#51463e] dark:text-[#d8cfc5]">Fields marked required must be completed.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-semibold text-[#30241d] dark:text-[#f3efe9]">Full name *
              <input className={inputClass} autoComplete="name" name="name" required minLength={2} maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </label>
            <label className="text-xs font-semibold text-[#30241d] dark:text-[#f3efe9]">Email address *
              <input className={inputClass} autoComplete="email" type="email" name="email" required maxLength={254} value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </label>
            <label className="text-xs font-semibold text-[#30241d] dark:text-[#f3efe9]">Subject *
              <select className={inputClass} required name="subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })}>
                <option value="">Select a subject</option>
                {contactSubjects.map((subject) => <option key={subject}>{subject}</option>)}
              </select>
            </label>
            <label className="text-xs font-semibold text-[#30241d] dark:text-[#f3efe9]">Order number <span className="font-normal">(optional)</span>
              <input className={inputClass} name="orderNumber" maxLength={80} value={form.orderNumber} onChange={(event) => setForm({ ...form, orderNumber: event.target.value })} />
            </label>
          </div>
          <label className="mt-4 block text-xs font-semibold text-[#30241d] dark:text-[#f3efe9]">Message *
            <textarea className={`${inputClass} resize-y`} name="message" required minLength={10} maxLength={3000} rows={5} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} />
            <span className="mt-1 block text-right text-[10px] font-normal text-[#71645a] dark:text-[#c2b2a4]">{form.message.length}/3000</span>
          </label>
          <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">Leave this field empty
            <input tabIndex={-1} autoComplete="off" name="website" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} />
          </label>
          {result.message && <p role={result.type === 'error' ? 'alert' : 'status'} aria-live="polite" className={`mt-4 text-sm ${result.type === 'error' ? 'text-red-700 dark:text-red-300' : 'text-green-800 dark:text-green-300'}`}>{result.message}</p>}
          <button type="submit" disabled={submitting} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#1a1512] px-6 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#3b2a20] disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6f4e37] sm:w-auto">
            {submitting ? 'Sending…' : 'Send Message'} <Send size={14} />
          </button>
        </form>
      </section>
    </main>
  )
}

// ---------------------------------------------
// MAIN INFO PAGE COMPONENT
// ---------------------------------------------

export default function InfoPage({ pageKey }) {
  const page = contentPages[pageKey] || contentPages['/contact']
  const [darkMode, setDarkMode] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [publishedContent, setPublishedContent] = useState(null)

  useEffect(() => {
    const slugByPath = {
      '/about': 'about',
      '/contact': 'contact',
      '/faq': 'faq',
      '/shipping-info': 'shipping',
      '/returns-exchanges': 'returns',
      '/privacy': 'privacy',
      '/terms': 'terms',
      '/size-guide': 'size-guide',
    }
    const slug = slugByPath[pageKey]
    if (!slug) return undefined

    const apiBase = API_BASE_URL
    if (!apiBase) return undefined
    const controller = new AbortController()
    fetch(`${apiBase}/content/${slug}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((result) => setPublishedContent(result?.content || null))
      .catch((error) => {
        if (error.name !== 'AbortError') console.error('Published page content could not be loaded.', error)
      })

    return () => controller.abort()
  }, [pageKey])

  useEffect(() => {
    if (!toastMsg) return
    const t = setTimeout(() => setToastMsg(''), 1800)
    return () => clearTimeout(t)
  }, [toastMsg])

  useEffect(() => {
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    const isAbout = pageKey === '/about'
    document.title = isAbout ? 'About VEXORA | Modest Meets Modern' : pageKey === '/contact' ? 'Contact VEXORA | Customer Support' : `${page.title} | VEXORA`
    if (description) {
      description.content = isAbout
        ? 'Discover the VEXORA point of view: modest fashion, contemporary styling and considered customer support.'
        : pageKey === '/contact'
          ? 'Contact VEXORA for product, sizing, delivery and order support through WhatsApp, email or our contact form.'
          : page.intro
    }
    return () => {
      document.title = previousTitle
      if (description && previousDescription !== undefined) description.content = previousDescription
    }
  }, [page.intro, page.title, pageKey])

  const otherPages = crossLinkCandidates.filter((link) => link.path !== pageKey)

  return (
    <div className={darkMode ? 'dark bg-[#1a1512] text-white min-h-screen' : 'bg-[#f3efe9] text-[#2c1d11] min-h-screen transition-colors'}>
      <ScrollProgressBar />
      <AnnouncementBar />
      <Header
        cartCount={0}
        wishlistCount={0}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        pageKey={pageKey}
        onCartClick={() => setToastMsg('Cart is empty — browse the shop')}
        onWishlistClick={() => setToastMsg('Wishlist opened')}
      />

      {pageKey === '/about' ? <AboutContent content={publishedContent || {}} /> : pageKey === '/contact' ? <ContactContent content={publishedContent || {}} /> : (
      <main className="mx-auto max-w-[1380px] px-4 pb-20 pt-10 lg:px-8 lg:pt-16">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#6e5a4b] dark:text-gray-400">
          <a href="/" className="hover:text-[#2c1d11] dark:hover:text-white transition">Home</a>
          <ChevronRight size={12} />
          <span className="text-[#2c1d11] dark:text-white font-bold">{publishedContent?.title || page.title}</span>
        </div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mt-6 max-w-3xl">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#8c6d53] dark:text-[#d1c2b5]">{page.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[1.05] sm:text-6xl text-[#2c1d11] dark:text-white">{publishedContent?.title || page.title}</h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-7 text-[#4a382a] dark:text-gray-300">{publishedContent?.intro || page.intro}</p>
        </motion.div>

        <div className="mt-12 grid gap-6 border-t border-[#d8c8bc] dark:border-[#33251e] pt-8 md:grid-cols-3">
          {page.sections.map((section, index) => (
            <motion.article
              key={section.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex min-h-[260px] flex-col rounded-2xl border border-[#d8c8bc] dark:border-[#33251e] bg-white dark:bg-[#241a15] p-6 shadow-sm"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4a382a] text-white dark:bg-[#3d2a1f] shadow-inner">
                <Check size={16} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold text-[#2c1d11] dark:text-white">{section.title}</h2>
              <p className="mt-2.5 text-sm font-medium leading-6 text-[#5c4a3a] dark:text-gray-300">{section.text}</p>
              <a
                href={section.href || routeForLabel(section.action)}
                className="mt-auto flex items-center gap-2 pt-6 text-[11px] font-bold uppercase tracking-[0.14em] text-[#2c1d11] dark:text-white hover:text-[#8c6d53] dark:hover:text-[#d1c2b5] transition"
              >
                {section.action} <ArrowRight size={14} />
              </a>
            </motion.article>
          ))}
        </div>

        {/* CROSS-LINKS TO OTHER INFO PAGES */}
        <div className="mt-16 border-t border-[#d8c8bc] dark:border-[#33251e] pt-8">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#6e5a4b] dark:text-gray-400">Looking for something else?</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {otherPages.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="rounded-full border border-[#d8c8bc] dark:border-[#3d2a1f] bg-white dark:bg-[#241a15] px-4 py-2 text-[12px] font-semibold text-[#4a382a] dark:text-gray-300 hover:bg-[#2c1d11] hover:text-white dark:hover:bg-white dark:hover:text-[#2c1d11] transition shadow-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </main>
      )}

      <Footer />
      <WhatsAppButton />
      <Toast message={toastMsg} />
    </div>
  )
}