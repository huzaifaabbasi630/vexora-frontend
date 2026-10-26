import Home from './pages/Home'
import Shop from './pages/Shop'
import Account from './pages/Account'
import About from './pages/About'
import Contact from './pages/Contact'
import HelpCenter from './pages/HelpCenter'
import ShippingInfo from './pages/ShippingInfo'
import ReturnsExchanges from './pages/ReturnsExchanges'
import SizeGuide from './pages/SizeGuide'
import Faq from './pages/Faq'
import PremiumQuality from './pages/PremiumQuality'
import SecurePayments from './pages/SecurePayments'
import CashOnDelivery from './pages/CashOnDelivery'
import OnlineTransfer from './pages/OnlineTransfer'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import ProductDetail from './pages/ProductDetail'
import Rameez from './pages/Rameez'
import OrderSuccess from './pages/OrderSuccess'

const routes = {
  '/login': <Account />,
  '/signup': <Account />,
  '/about': <About />,
  '/contact': <Contact />,
  '/help-center': <HelpCenter />,
  '/shipping-info': <ShippingInfo />,
  '/returns-exchanges': <ReturnsExchanges />,
  '/size-guide': <SizeGuide />,
  '/faq': <Faq />,
  '/premium-quality': <PremiumQuality />,
  '/secure-payments': <SecurePayments />,
  '/cash-on-delivery': <CashOnDelivery />,
  '/online-transfer': <OnlineTransfer />,
  '/privacy': <Privacy />,
  '/terms': <Terms />,
  '/order-success': <OrderSuccess />,
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const page = path === '/shop'
    ? <Shop />
    : path === '/rameez'
      ? <Rameez />
      : path.startsWith('/product/')
        ? <ProductDetail />
        : routes[path] || <Home />

  return (
    <div className="min-h-screen bg-[#f3efe9] text-coffee-900">
      {page}
    </div>
  )
}
