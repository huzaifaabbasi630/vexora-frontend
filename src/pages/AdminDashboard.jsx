import { useEffect, useState } from 'react';
import {
  AlertTriangle, BarChart3, CalendarDays, ChevronLeft, ChevronRight, FileText,
  LayoutDashboard, LogOut, Mail, Package, Plus, RefreshCw, Search, ShieldCheck,
  ShoppingCart, Users,
} from 'lucide-react';
import { defaultShopHeroImage, homeHeroImages, trendingCategoryDefaults } from '../data/brandMedia';
import { API_ORIGIN } from '../config/api';

const API = API_ORIGIN;
const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'messages', label: 'Contact messages', icon: Mail },
  { id: 'cms', label: 'Website content', icon: FileText },
  { id: 'reports', label: 'Analytics & reports', icon: BarChart3 },
  { id: 'security', label: 'Security & audit', icon: ShieldCheck },
];

const cardClass = 'rounded-2xl border border-[#e2d7cf] bg-white p-5 shadow-sm';
const controlClass = 'rounded-lg border border-[#d8cfc5] bg-white px-3 py-2 text-sm text-[#1a1512] outline-none focus:border-[#6f4e37] focus:ring-2 focus:ring-[#6f4e37]/20';
const buttonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#d8cfc5] px-3 py-2 text-sm font-semibold text-[#1a1512] transition hover:bg-[#f3efe9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6f4e37] disabled:cursor-not-allowed disabled:opacity-50';
const deleteButtonClass = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-800 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-700 disabled:cursor-not-allowed disabled:opacity-50';
const utcDateInputValue = (date) => date.toISOString().slice(0, 10);
const initialCustomFrom = utcDateInputValue(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000));
const initialCustomTo = utcDateInputValue(new Date());
const currency = (value) => `PKR ${Number(value || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 })}`;

export default function AdminDashboard({ owner, overview, onLogout }) {
  const [section, setSection] = useState('overview');
  const [data, setData] = useState(overview || null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cmsSlug, setCmsSlug] = useState('about');
  const [cmsText, setCmsText] = useState('{\n  "title": "",\n  "intro": ""\n}');
  const [cmsPreview, setCmsPreview] = useState(null);
  const [cmsVisuals, setCmsVisuals] = useState({
    heroImages: homeHeroImages,
    trendingCategoryImages: trendingCategoryDefaults.map(({ image }) => image),
    shopHeroImage: defaultShopHeroImage,
  });
  const [productEditorId, setProductEditorId] = useState(null);
  const [productSaving, setProductSaving] = useState(false);
  const [productForm, setProductForm] = useState(null);
  const [productSort, setProductSort] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [overviewRange, setOverviewRange] = useState('30d');
  const [customFrom, setCustomFrom] = useState(initialCustomFrom);
  const [customTo, setCustomTo] = useState(initialCustomTo);
  const [appliedCustomRange, setAppliedCustomRange] = useState({ from: initialCustomFrom, to: initialCustomTo });
  const [chartMetric, setChartMetric] = useState('orders');

  const request = async (path, options = {}) => {
    const response = await fetch(`${API}/api${path}`, {
      credentials: 'include',
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.message || `Request failed (${response.status}).`);
    return body;
  };

  const loadSection = async () => {
    setLoading(true);
    setError('');
    try {
      let result;
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (search.trim()) params.set('search', search.trim());
      if (filter) params.set('status', filter);

      if (section === 'overview') {
        const overviewParams = new URLSearchParams({ range: overviewRange });
        if (overviewRange === 'custom') {
          overviewParams.set('from', appliedCustomRange.from);
          overviewParams.set('to', appliedCustomRange.to);
        }
        result = await request(`/admin/overview?${overviewParams}`);
      }
      if (section === 'customers') result = await request(`/admin/customers?${params}`);
      if (section === 'orders') {
        if (filter) params.set('status', filter);
        result = await request(`/admin/orders?${params}`);
      }
      if (section === 'products') {
        params.set('sort', productSort);
        if (categoryFilter) params.set('category', categoryFilter);
        result = await request(`/admin/products?${params}`);
      }
      if (section === 'messages') result = await request(`/admin/messages?${params}`);
      if (section === 'reports') result = await request('/admin/reports');
      if (section === 'security') result = await request(`/admin/audit-logs?${params}`);
      if (section === 'cms') {
        result = await request(`/admin/cms/${cmsSlug}`);
        const draft = result.draft || result.publishedContent || {};
        setCmsText(JSON.stringify(draft, null, 2));
        setCmsVisuals({
          heroImages: Array.isArray(draft.heroImages) && draft.heroImages.length === homeHeroImages.length
            ? draft.heroImages
            : homeHeroImages,
          trendingCategoryImages: Array.isArray(draft.trendingCategoryImages) && draft.trendingCategoryImages.length === trendingCategoryDefaults.length
            ? draft.trendingCategoryImages
            : trendingCategoryDefaults.map(({ image }) => image),
          shopHeroImage: typeof draft.heroImage === 'string' && draft.heroImage.trim()
            ? draft.heroImage
            : defaultShopHeroImage,
        });
        setCmsPreview(null);
      }
      setData(result);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load this section.');
      if (section !== 'overview') setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSection(); }, [section, page, filter, cmsSlug, productSort, categoryFilter, overviewRange, appliedCustomRange]);

  useEffect(() => {
    if (section !== 'overview') return undefined;
    const refresh = () => {
      if (document.visibilityState === 'visible') loadSection();
    };
    const timer = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [section, overviewRange, appliedCustomRange]);

  const title = sections.find((item) => item.id === section)?.label || 'Overview';
  const liveOverview = section === 'overview' && data?.summary ? data : null;
  const summary = liveOverview?.summary || {};

  const runAction = async (action, successMessage) => {
    setError('');
    setNotice('');
    try {
      const result = await action();
      setNotice(result?.notificationMessage || successMessage);
      await loadSection();
    } catch (actionError) {
      setError(actionError.message || 'The action failed.');
    }
  };

  const loadCustomer = async (id) => {
    try {
      setSelectedCustomer(await request(`/admin/customers/${id}`));
    } catch (detailError) {
      setError(detailError.message);
    }
  };

  const openManagement = (target, statusValue = '') => {
    setPage(1);
    setSearch('');
    setFilter(statusValue);
    setSelectedCustomer(null);
    setSection(target);
  };

  const renderOverview = () => {
    if (!liveOverview) {
      return <p className="py-8 text-center text-sm text-[#695a50]">Overview data is unavailable until the API request succeeds.</p>;
    }
    const series = Array.isArray(liveOverview.orderSeries) ? liveOverview.orderSeries : [];
    const statusRows = Array.isArray(liveOverview.statusDistribution) ? liveOverview.statusDistribution : [];
    const activityRows = Array.isArray(liveOverview.recentActivity) ? liveOverview.recentActivity : [];
    const recentOrders = Array.isArray(liveOverview.recentOrders) ? liveOverview.recentOrders : [];
    const recentCustomers = Array.isArray(liveOverview.recentCustomers) ? liveOverview.recentCustomers : [];
    const chartValues = series.map((entry) => chartMetric === 'orders'
      ? Number(entry.orders) || 0
      : Number(entry.eligibleOrderValue) || 0);
    const chartMaximum = Math.max(...chartValues, 0);
    const chartPoints = chartValues.map((value, index) => {
      const x = series.length < 2 ? 50 : index * (100 / (series.length - 1));
      const y = chartMaximum === 0 ? 94 : 94 - (value / chartMaximum) * 84;
      return `${x},${y}`;
    }).join(' ');
    const formattedUpdatedAt = liveOverview.updatedAt
      ? new Date(liveOverview.updatedAt).toLocaleString()
      : 'Not available';
    const alertItems = [
      summary.awaitingConfirmation > 0 && {
        label: `${summary.awaitingConfirmation} order${summary.awaitingConfirmation === 1 ? '' : 's'} awaiting confirmation`,
        detail: 'These orders have not completed customer confirmation.',
        action: () => openManagement('orders', 'Pending Confirmation'),
      },
      summary.outOfStockProducts > 0 && {
        label: `${summary.outOfStockProducts} published product${summary.outOfStockProducts === 1 ? '' : 's'} out of stock`,
        detail: 'Inventory-tracked published products with no available units.',
        action: () => openManagement('products'),
      },
      summary.unreadMessages > 0 && {
        label: `${summary.unreadMessages} new contact message${summary.unreadMessages === 1 ? '' : 's'}`,
        detail: 'Messages with the stored status “New”.',
        action: () => openManagement('messages', 'New'),
      },
    ].filter(Boolean);
    const metricCards = [
      { label: 'Total customers', value: summary.totalCustomers, note: `${summary.newCustomers} registered in this range`, action: () => openManagement('customers') },
      { label: 'Orders in range', value: summary.totalOrders, note: `${summary.ordersToday} placed today`, action: () => openManagement('orders') },
      { label: 'Awaiting confirmation', value: summary.awaitingConfirmation, note: `${summary.confirmedOrders} confirmed in this range`, action: () => openManagement('orders', 'Pending Confirmation') },
      { label: 'Eligible order value', value: currency(summary.eligibleOrderValue), note: `${summary.eligibleOrderCount} confirmed-or-later orders; not collected revenue`, action: () => openManagement('orders') },
      { label: 'Collected revenue', value: summary.paymentTrackingAvailable ? currency(summary.collectedRevenue) : 'Unavailable', note: 'Requires verified payment and refund records', action: null },
      { label: 'Average order value', value: currency(summary.averageOrderValue), note: 'Eligible order value ÷ eligible orders in range', action: () => openManagement('orders') },
      { label: 'Published products', value: summary.publishedProducts, note: 'Publicly active products; archived/draft excluded', action: () => openManagement('products') },
      { label: 'Out of stock', value: summary.trackedProducts > 0 ? summary.outOfStockProducts : 'Unavailable', note: summary.trackedProducts > 0 ? `${summary.trackedProducts} published products have tracking enabled` : 'No published inventory is being tracked', action: summary.trackedProducts > 0 ? () => openManagement('products') : null },
    ];

    return <div className="space-y-7">
      <div className="flex flex-col justify-between gap-3 rounded-xl border border-[#eee4dc] bg-[#faf6f2] p-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold"><CalendarDays size={16} className="text-[#6f4e37]" /> Date range</div>
          <p className="mt-1 text-xs text-[#695a50]">Times and date boundaries use UTC. Selected range: {liveOverview.range?.from ? new Date(liveOverview.range.from).toLocaleDateString('en', { timeZone: 'UTC' }) : '—'} – {liveOverview.range?.to ? new Date(new Date(liveOverview.range.to).getTime() - 1).toLocaleDateString('en', { timeZone: 'UTC' }) : '—'}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className={controlClass} aria-label="Overview date range" value={overviewRange} onChange={(event) => setOverviewRange(event.target.value)}>
            <option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option>
            <option value="thisMonth">This month</option><option value="previousMonth">Previous month</option><option value="custom">Custom range</option>
          </select>
          {overviewRange === 'custom' && <>
            <label className="text-xs text-[#695a50]">From <input aria-label="Custom range start" className={controlClass} type="date" value={customFrom} max={customTo || initialCustomTo} onChange={(event) => setCustomFrom(event.target.value)} /></label>
            <label className="text-xs text-[#695a50]">To <input aria-label="Custom range end" className={controlClass} type="date" value={customTo} max={initialCustomTo} min={customFrom} onChange={(event) => setCustomTo(event.target.value)} /></label>
            <button className={buttonClass} disabled={!customFrom || !customTo || customFrom > customTo} onClick={() => setAppliedCustomRange({ from: customFrom, to: customTo })}>Apply</button>
          </>}
          <button className={buttonClass} onClick={loadSection} disabled={loading} aria-label="Refresh overview"><RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh</button>
        </div>
        <p className="text-xs text-[#76675c] sm:text-right">Updated {formattedUpdatedAt}{loading ? ' · Refreshing…' : ''}</p>
      </div>

      <div>
        <h2 className="mb-3 font-semibold">Store overview</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric) => {
            const content = <><div className="text-xs text-[#68574b]">{metric.label}</div><div className="mt-2 text-2xl font-semibold">{metric.value ?? 'Data unavailable'}</div><p className="mt-2 text-xs leading-5 text-[#76675c]">{metric.note}</p></>;
            return metric.action
              ? <button key={metric.label} className="rounded-xl border border-[#eee4dc] bg-[#faf6f2] p-4 text-left transition hover:border-[#bca18b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6f4e37]" onClick={metric.action}>{content}</button>
              : <div key={metric.label} className="rounded-xl border border-[#eee4dc] bg-[#faf6f2] p-4">{content}</div>;
          })}
        </div>
        <p className="mt-3 text-xs leading-5 text-[#695a50]">{liveOverview.metricDefinitions?.eligibleOrderValue} {liveOverview.metricDefinitions?.lowStock}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <article className="rounded-xl border border-[#eee4dc] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="font-semibold">Orders over time</h2><p className="mt-1 text-xs text-[#76675c]">Daily totals for the selected UTC range. No payment records are available.</p></div>
            <select className={controlClass} aria-label="Chart metric" value={chartMetric} onChange={(event) => setChartMetric(event.target.value)}>
              <option value="orders">Order count</option><option value="eligibleOrderValue">Eligible order value (PKR)</option>
            </select>
          </div>
          {series.length ? <div className="mt-4">
            <div className="mb-2 text-sm font-semibold">{chartMetric === 'orders' ? 'Orders' : 'Eligible order value'} · {chartMetric === 'orders' ? chartValues.reduce((sum, value) => sum + value, 0) : currency(chartValues.reduce((sum, value) => sum + value, 0))}</div>
            <svg viewBox="0 0 100 100" role="img" aria-label={`${chartMetric === 'orders' ? 'Daily order count' : 'Daily eligible order value'} line chart`} className="h-48 w-full overflow-visible">
              <line x1="0" y1="94" x2="100" y2="94" stroke="#e2d7cf" strokeWidth="0.8" />
              {series.length > 1 && chartMaximum > 0 && <polyline points={chartPoints} fill="none" stroke="#6f4e37" strokeWidth="1.8" vectorEffect="non-scaling-stroke" />}
              {series.map((entry, index) => {
                const value = chartValues[index];
                const x = series.length < 2 ? 50 : index * (100 / (series.length - 1));
                const y = chartMaximum === 0 ? 94 : 94 - (value / chartMaximum) * 84;
                return <circle key={entry._id} cx={x} cy={y} r="1.5" fill="#1a1512"><title>{`${entry._id}: ${chartMetric === 'orders' ? `${value} orders` : currency(value)}`}</title></circle>;
              })}
            </svg>
            <div className="flex justify-between text-[10px] text-[#76675c]"><span>{series[0]._id}</span><span>{series[series.length - 1]._id}</span></div>
          </div> : <p className="py-12 text-center text-sm text-[#76675c]">No orders in this date range.</p>}
        </article>

        <article className="rounded-xl border border-[#eee4dc] p-4">
          <h2 className="font-semibold">Orders by status</h2>
          <p className="mt-1 text-xs text-[#76675c]">Mutually exclusive saved order statuses in the selected range.</p>
          {statusRows.length ? <div className="mt-3 space-y-2">{statusRows.map(({ _id: status, count }) => {
            const supportedFilter = ['Pending Confirmation', 'Confirming', 'Confirmed', 'Dispatched', 'On The Way', 'Delivered'].includes(status);
            return <div key={status} className="flex items-center justify-between rounded-lg bg-[#faf6f2] px-3 py-2 text-sm">
              {supportedFilter ? <button className="text-left underline-offset-2 hover:underline" onClick={() => openManagement('orders', status)}>{status}</button> : <span>{status}</span>}
              <strong>{count}</strong>
            </div>;
          })}</div> : <p className="py-8 text-center text-sm text-[#76675c]">No orders in this date range.</p>}
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-xl border border-[#eee4dc] p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Recent orders</h2><button className={buttonClass} onClick={() => openManagement('orders')}>View all orders</button></div>
          {recentOrders.length ? <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-[#eee4dc] text-xs uppercase tracking-wide text-[#6f4e37]"><tr><th className="p-2">Order / customer</th><th className="p-2">Date</th><th className="p-2">Total</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
            <tbody>{recentOrders.map((order) => <tr key={order._id} className="cursor-pointer border-b border-[#f0e8e2] hover:bg-[#faf6f2]" onClick={() => openManagement('orders', order.status)}>
              <td className="p-2"><span className="font-semibold">#{String(order._id).slice(-8)}</span><span className="block text-xs text-[#695a50]">{order.customerInfo?.name || 'Customer details unavailable'}</span></td>
              <td className="p-2">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td><td className="p-2">{currency(order.total)}</td><td className="p-2">{order.status}</td>
              <td className="p-2"><button className={deleteButtonClass} onClick={async (event) => {
                event.stopPropagation();
                if (!window.confirm(`Permanently delete order #${String(order._id).slice(-8)} and all data in this order record? This cannot be undone.`)) return;
                if (window.prompt('Type DELETE to permanently remove this order:') !== 'DELETE') return;
                await runAction(() => request(`/admin/orders/${order._id}`, { method: 'DELETE', body: JSON.stringify({ confirmation: 'DELETE' }) }), 'Order permanently deleted.');
              }}>Delete permanently</button></td>
            </tr>)}</tbody>
          </table></div> : <p className="py-8 text-center text-sm text-[#76675c]">No orders have been placed.</p>}
        </article>

        <article className="rounded-xl border border-[#eee4dc] p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Recent registrations</h2><button className={buttonClass} onClick={() => openManagement('customers')}>View customers</button></div>
          {recentCustomers.length ? <div className="space-y-2">{recentCustomers.map((customer) => <div key={customer._id} className="flex items-center justify-between gap-3 rounded-lg bg-[#faf6f2] px-3 py-3 transition hover:bg-[#f3efe9]">
            <button className="min-w-0 flex-1 text-left" onClick={() => { openManagement('customers'); loadCustomer(customer._id); }}>
              <strong className="block text-sm">{customer.name || 'Name unavailable'}</strong><span className="text-xs text-[#695a50]">{customer.email}</span>
              <span className="block text-xs text-[#695a50]">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '—'} · {customer.isActive === false ? 'Inactive' : 'Active'}</span>
            </button>
            <button className={deleteButtonClass} aria-label={`Permanently delete customer ${customer.name || customer.email}`} onClick={async () => {
              if (!window.confirm(`Permanently delete customer account and profile for ${customer.name || customer.email}? Their order records will be retained.`)) return;
              if (window.prompt('Type DELETE to permanently remove this customer account:') !== 'DELETE') return;
              await runAction(() => request(`/admin/customers/${customer._id}`, { method: 'DELETE', body: JSON.stringify({ confirmation: 'DELETE' }) }), 'Customer account permanently deleted; order records retained.');
            }}>Delete</button>
          </div>)}</div> : <p className="py-8 text-center text-sm text-[#76675c]">No customer registrations found.</p>}
        </article>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-xl border border-[#eee4dc] p-4">
          <h2 className="mb-3 flex items-center gap-2 font-semibold"><AlertTriangle size={16} className="text-[#6f4e37]" /> Business alerts</h2>
          {alertItems.length ? <div className="space-y-2">{alertItems.map((item) => <button key={item.label} onClick={item.action} className="w-full rounded-lg border border-[#eee4dc] bg-[#faf6f2] p-3 text-left hover:border-[#bca18b]"><strong className="block text-sm">{item.label}</strong><span className="mt-1 block text-xs text-[#695a50]">{item.detail}</span></button>)}</div> : <p className="text-sm text-[#76675c]">No active alerts based on available records.</p>}
          <p className="mt-3 text-xs text-[#76675c]">{liveOverview.metricDefinitions?.lowStock}</p>
        </article>
        <article className="rounded-xl border border-[#eee4dc] p-4">
          <h2 className="mb-3 font-semibold">Quick actions</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            <button className={buttonClass} onClick={() => { setSection('products'); startProductCreate(); }}><Plus size={15} /> Add product</button>
            <button className={buttonClass} onClick={() => openManagement('orders')}><ShoppingCart size={15} /> View orders</button>
            <button className={buttonClass} onClick={() => openManagement('customers')}><Users size={15} /> View customers</button>
            <button className={buttonClass} onClick={() => openManagement('cms')}><FileText size={15} /> Website content</button>
            <button className={buttonClass} onClick={() => openManagement('messages')}><Mail size={15} /> Contact messages</button>
            <button className={buttonClass} onClick={() => openManagement('reports')}><BarChart3 size={15} /> Analytics & reports</button>
          </div>
        </article>
      </div>

      {activityRows.length > 0 && <article className="rounded-xl border border-[#eee4dc] p-4">
        <h2 className="mb-3 font-semibold">Recent admin activity</h2>
        <div className="space-y-2">{activityRows.map((activity) => <div key={activity._id} className="flex flex-col justify-between gap-1 rounded-lg bg-[#faf6f2] px-3 py-2 text-sm sm:flex-row">
          <span><strong>{activity.action}</strong> · {activity.targetType} {activity.targetId}<span className="block text-xs text-[#695a50]">{activity.actorEmail}</span></span>
          <time className="text-xs text-[#76675c]">{new Date(activity.createdAt).toLocaleString()}</time>
        </div>)}</div>
      </article>}
    </div>;
  };

  const emptyProductForm = () => ({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    sku: '',
    category: '',
    regularPrice: '',
    salePrice: '',
    imageLines: '',
    sizes: '',
    colors: '',
    colorImages: [],
    tags: '',
    stock: '0',
    trackInventory: true,
    featured: false,
    bestseller: false,
    newArrival: false,
    categoryFeatured: false,
    status: 'draft',
    variantsText: '[]',
    seoTitle: '',
    seoDescription: '',
  });

  const startProductCreate = () => {
    setProductEditorId('new');
    setProductForm(emptyProductForm());
    setError('');
    setNotice('');
  };

  const startProductEdit = async (id) => {
    setLoading(true);
    setError('');
    try {
      const { product } = await request(`/admin/products/${id}`);
      setProductEditorId(id);
      setProductForm({
        name: product.name || '',
        slug: product.slug || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        sku: product.sku || '',
        category: product.category || '',
        regularPrice: product.regularPrice ?? '',
        salePrice: product.salePrice ?? '',
        imageLines: (product.images || []).map((image) => image.url).join('\n'),
        sizes: (product.sizes || []).join(', '),
        colors: (product.colors || []).join(', '),
        colorImages: (product.colorImages || []).map((ci) => ({ color: ci.color, imageUrl: ci.imageUrl })),
        tags: (product.tags || []).join(', '),
        stock: String(product.stock ?? 0),
        trackInventory: Boolean(product.trackInventory),
        featured: Boolean(product.featured),
        bestseller: Boolean(product.bestseller),
        newArrival: Boolean(product.newArrival),
        categoryFeatured: Boolean(product.categoryFeatured),
        status: product.status || 'draft',
        variantsText: JSON.stringify(product.variants || [], null, 2),
        seoTitle: product.seoTitle || '',
        seoDescription: product.seoDescription || '',
      });
    } catch (editError) {
      setError(editError.message || 'Could not load product.');
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    if (!productForm || productSaving) return;
    setProductSaving(true);
    setError('');
    setNotice('');
    try {
      let variants;
      try { variants = JSON.parse(productForm.variantsText || '[]'); } catch { throw new Error('Variant stock must be valid JSON.'); }
      const payload = {
        name: productForm.name,
        slug: productForm.slug,
        description: productForm.description,
        shortDescription: productForm.shortDescription,
        sku: productForm.sku,
        category: productForm.category,
        regularPrice: productForm.regularPrice,
        salePrice: productForm.salePrice,
        images: productForm.imageLines.split(/\r?\n/).map((url) => url.trim()).filter(Boolean).map((url, index) => ({ url, alt: `${productForm.name} image ${index + 1}` })),
        sizes: productForm.sizes.split(',').map((item) => item.trim()).filter(Boolean),
        colors: productForm.colors.split(',').map((item) => item.trim()).filter(Boolean),
        colorImages: productForm.colorImages || [],
        tags: productForm.tags.split(',').map((item) => item.trim()).filter(Boolean),
        stock: productForm.stock,
        trackInventory: productForm.trackInventory,
        featured: productForm.featured,
        bestseller: productForm.bestseller,
        newArrival: productForm.newArrival,
        categoryFeatured: productForm.categoryFeatured,
        status: productForm.status,
        variants,
        seoTitle: productForm.seoTitle,
        seoDescription: productForm.seoDescription,
      };
      const isNew = productEditorId === 'new';
      await request(isNew ? '/admin/products' : `/admin/products/${productEditorId}`, {
        method: isNew ? 'POST' : 'PATCH',
        body: JSON.stringify(payload),
      });
      setProductEditorId(null);
      setProductForm(null);
      setNotice(isNew ? 'Product created.' : 'Product updated.');
      await loadSection();
    } catch (saveError) {
      setError(saveError.message || 'Product could not be saved.');
    } finally {
      setProductSaving(false);
    }
  };

  const setProductValue = (key, value) => setProductForm((current) => ({ ...current, [key]: value }));

  const getCmsContent = () => {
    if (cmsSlug === 'home') {
      return {
        heroImages: cmsVisuals.heroImages,
        trendingCategoryImages: cmsVisuals.trendingCategoryImages,
      };
    }
    if (cmsSlug === 'shop') return { heroImage: cmsVisuals.shopHeroImage };
    try {
      return JSON.parse(cmsText);
    } catch {
      throw new Error('CMS content must be valid JSON.');
    }
  };

  const saveCmsContent = async (publish) => {
    await request(`/admin/cms/${cmsSlug}`, {
      method: 'PUT',
      body: JSON.stringify({ content: getCmsContent(), publish }),
    });
  };

  const exportCustomers = async () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (filter) params.set('status', filter);
    const response = await fetch(`${API}/api/admin/customers/export.csv?${params}`, { credentials: 'include' });
    if (!response.ok) {
      const result = await response.json().catch(() => ({}));
      setError(result.message || 'Customer export failed.');
      return;
    }
    const url = URL.createObjectURL(await response.blob());
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vexora-customers.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const renderRows = () => {
    if (data?.total === 0 && ['customers', 'orders', 'messages', 'security'].includes(section)) {
      return <p className="py-8 text-center text-sm text-[#695a50]">No records match these filters.</p>;
    }
    if (section === 'products') {
      if (productForm) {
        const inputClass = `${controlClass} mt-1 w-full`;
        const field = (label, key, options = {}) => (
          <label className="block text-sm font-semibold">{label}
            {options.multiline
              ? <textarea className={`${inputClass} min-h-24`} value={productForm[key]} onChange={(event) => setProductValue(key, event.target.value)} maxLength={options.maxLength} required={options.required} />
              : <input className={inputClass} value={productForm[key]} onChange={(event) => setProductValue(key, event.target.value)} maxLength={options.maxLength} required={options.required} type={options.type || 'text'} min={options.min} step={options.step} />}
          </label>
        );
        const checkbox = (label, key) => <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={productForm[key]} onChange={(event) => setProductValue(key, event.target.checked)} />{label}</label>;
        return <form className="space-y-5" onSubmit={saveProduct}>
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-semibold">{productEditorId === 'new' ? 'Add product' : 'Edit product'}</h2><button type="button" className={buttonClass} onClick={() => { setProductEditorId(null); setProductForm(null); }}>Back to products</button></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {field('Product name *', 'name', { required: true, maxLength: 160 })}
            {field('Slug', 'slug', { maxLength: 180 })}
            {field('SKU', 'sku', { maxLength: 80 })}
            {field('Category * (type any category name)', 'category', { required: true, maxLength: 100 })}
            {field('Regular price *', 'regularPrice', { required: true, type: 'number', min: '0', step: '0.01' })}
            {field('Sale price (optional)', 'salePrice', { type: 'number', min: '0', step: '0.01' })}
            {field('Short description', 'shortDescription', { maxLength: 500 })}
            {field('Stock (unvaried products)', 'stock', { type: 'number', min: '0', step: '1' })}
            {field('Description', 'description', { multiline: true, maxLength: 10000 })}
            {field('Image URLs (one per line)', 'imageLines', { multiline: true, maxLength: 20000 })}
            {field('Sizes (comma separated)', 'sizes', { maxLength: 2000 })}
            {field('Colors (comma separated)', 'colors', { maxLength: 2000 })}
            <label className="block text-sm font-semibold col-span-2">
              Color-specific Images
              <div className="mt-2 space-y-3">
                {(productForm.colors || '').split(',').map((item) => item.trim()).filter(Boolean).map((color, idx) => {
                  const existingColorImage = productForm.colorImages?.find(ci => ci.color === color);
                  return (
                    <div key={`${color}-${idx}`} className="flex items-center gap-2 p-2 border border-[#e2d7cf] rounded-lg">
                      <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: color }} />
                      <input
                        type="text"
                        placeholder={`Image URL for ${color}`}
                        value={existingColorImage?.imageUrl || ''}
                        onChange={(e) => {
                          const newColorImages = [...(productForm.colorImages || [])];
                          const existingIndex = newColorImages.findIndex(ci => ci.color === color);
                          if (existingIndex >= 0) {
                            newColorImages[existingIndex] = { color, imageUrl: e.target.value };
                          } else {
                            newColorImages.push({ color, imageUrl: e.target.value });
                          }
                          setProductValue('colorImages', newColorImages);
                        }}
                        className="flex-1 rounded border border-[#e2d7cf] px-2 py-1 text-sm"
                      />
                    </div>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-[#695a50]">Add colors above first, then upload images for each color.</p>
            </label>
            {field('Tags (comma separated)', 'tags', { maxLength: 2000 })}
            {field('Variant inventory JSON', 'variantsText', { multiline: true, maxLength: 20000 })}
            {field('SEO title', 'seoTitle', { maxLength: 180 })}
            {field('SEO description', 'seoDescription', { multiline: true, maxLength: 320 })}
          </div>
          <fieldset className="flex flex-wrap gap-x-6 gap-y-3 rounded-xl border border-[#eee4dc] p-4">
            <legend className="px-1 text-sm font-semibold">Product options</legend>
            {checkbox('Track stock', 'trackInventory')}
            {checkbox('Featured (shows on home)', 'featured')}
            {checkbox('Bestseller', 'bestseller')}
            {checkbox('New arrival', 'newArrival')}
            {checkbox('Featured in Category (shows as category hero)', 'categoryFeatured')}
            <label className="flex items-center gap-2 text-sm font-semibold">Publication status
              <select className={controlClass} value={productForm.status} onChange={(event) => setProductValue('status', event.target.value)}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select>
            </label>
          </fieldset>
          <p className="text-xs leading-5 text-[#695a50]">Image uploads are not configured. Use existing asset paths or hosted HTTP(S) image URLs. Variant inventory accepts JSON objects like {`[{"size":"M","color":"Black","sku":"SKU-M-BLK","stock":3}]`}.</p>
          <div className="flex flex-wrap gap-2"><button className={`${buttonClass} border-[#1a1512] bg-[#1a1512] text-white hover:bg-[#3b2a20]`} disabled={productSaving} type="submit">{productSaving ? 'Saving…' : 'Save product'}</button><button className={buttonClass} type="button" onClick={() => { setProductEditorId(null); setProductForm(null); }}>Cancel</button></div>
        </form>;
      }
      return <>
        <div className="mb-4 flex justify-end"><button className={`${buttonClass} border-[#1a1512] bg-[#1a1512] text-white hover:bg-[#3b2a20]`} onClick={startProductCreate}><Plus size={15} /> Add product</button></div>
        {data?.total === 0 ? <p className="py-8 text-center text-sm text-[#695a50]">No products in MongoDB yet. Run the catalog migration after reviewing its dry run.</p> : <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-[#e9dfd7] text-xs uppercase tracking-wide text-[#6f4e37]"><tr><th className="p-3">Product</th><th className="p-3">SKU / Category</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
            <tbody>{(data?.rows || []).map((product) => <tr key={product._id} className="border-b border-[#f0e8e2] align-top">
              <td className="p-3"><div className="flex items-center gap-3"><div className="h-14 w-12 overflow-hidden rounded bg-[#eee5de]">{product.images?.[0]?.url && <img src={product.images[0].url} alt={product.images[0].alt || product.name} className="h-full w-full object-cover" />}</div><div><div className="font-semibold">{product.name}</div><div className="text-xs text-[#695a50]">/{product.slug}</div></div></div></td>
              <td className="p-3">{product.sku || '—'}<div className="text-xs text-[#695a50]">{product.category}</div></td>
              <td className="p-3">{product.salePrice != null && <div className="text-xs text-[#78695e] line-through">PKR {Number(product.regularPrice).toLocaleString()}</div>}PKR {Number(product.salePrice ?? product.regularPrice).toLocaleString()}</td>
              <td className="p-3">{product.trackInventory ? product.variants?.length ? product.variants.reduce((sum, variant) => sum + variant.stock, 0) : product.stock : 'Not tracked'}</td>
              <td className="p-3"><span className="capitalize">{product.status}</span>{product.featured && <div className="text-xs text-[#6f4e37]">Featured</div>}</td>
              <td className="p-3"><div className="flex flex-wrap gap-2">
                <button className={buttonClass} onClick={() => startProductEdit(product._id)}>Edit</button>
                {product.status === 'published' ? <button className={buttonClass} onClick={() => runAction(() => request(`/admin/products/${product._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'draft' }) }), 'Product unpublished.')}>Unpublish</button> : product.status === 'draft' ? <button className={buttonClass} onClick={() => runAction(() => request(`/admin/products/${product._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'published' }) }), 'Product published.')}>Publish</button> : null}
                {product.status !== 'archived' && <button className={buttonClass} onClick={async () => { if (!window.confirm(`Archive "${product.name}"? Historical order items will remain unchanged.`)) return; await runAction(() => request(`/admin/products/${product._id}`, { method: 'DELETE' }), 'Product archived.'); }}>Archive</button>}
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>}
      </>;
    }
    if (section === 'customers') return (
      <>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-b border-[#e9dfd7] text-xs uppercase tracking-wide text-[#6f4e37]"><tr><th className="p-3">Customer</th><th className="p-3">Registered</th><th className="p-3">Status</th><th className="p-3">Orders / spend</th><th className="p-3">Actions</th></tr></thead>
            <tbody>{(data?.rows || []).map((row) => <tr key={row._id} className="border-b border-[#f0e8e2] align-top">
              <td className="p-3"><div className="font-semibold">{row.name}</div><div className="text-xs text-[#6b5c51]">{row.email}</div><div className="mt-1 text-[10px] text-[#87776b]">{row._id}</div></td>
              <td className="p-3">{row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}</td>
              <td className="p-3">{row.isActive === false ? 'Inactive' : 'Active'}</td>
              <td className="p-3">{row.orderCount || 0} / PKR {Number(row.eligibleSpending || 0).toLocaleString()}</td>
              <td className="p-3"><div className="flex flex-wrap gap-2">
                <button className={buttonClass} onClick={() => loadCustomer(row._id)}>Details</button>
                <button className={buttonClass} onClick={() => runAction(() => request(`/admin/customers/${row._id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive: row.isActive === false }) }), row.isActive === false ? 'Customer reactivated.' : 'Customer deactivated.')}>{row.isActive === false ? 'Reactivate' : 'Deactivate'}</button>
                <button className={buttonClass} onClick={async () => {
                  if (!window.confirm(`Anonymize ${row.name} and linked order contact details? Orders will be retained.`)) return;
                  if (window.prompt('Type ANONYMIZE to confirm:') !== 'ANONYMIZE') return;
                  await runAction(() => request(`/admin/customers/${row._id}/anonymize`, { method: 'DELETE', body: JSON.stringify({ confirmation: 'ANONYMIZE' }) }), 'Customer data anonymized; order records retained.');
                  setSelectedCustomer(null);
                }}>Anonymize</button>
                <button className={deleteButtonClass} onClick={async () => {
                  if (!window.confirm(`Permanently delete customer account and profile for ${row.name}? Their order records will be retained.`)) return;
                  if (window.prompt('Type DELETE to permanently remove this customer account:') !== 'DELETE') return;
                  await runAction(() => request(`/admin/customers/${row._id}`, { method: 'DELETE', body: JSON.stringify({ confirmation: 'DELETE' }) }), 'Customer account permanently deleted; order records retained.');
                  setSelectedCustomer(null);
                }}>Delete permanently</button>
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>
        {selectedCustomer && <div className="mt-5 rounded-xl border border-[#ddcfc5] bg-[#faf6f2] p-4">
          <div className="flex items-center justify-between"><h3 className="font-semibold">Customer details: {selectedCustomer.customer?.name}</h3><button className={buttonClass} onClick={() => setSelectedCustomer(null)}>Close</button></div>
          <p className="mt-2 text-sm">{selectedCustomer.customer?.email} · {selectedCustomer.customer?.phone || 'No phone'} · {selectedCustomer.orderCount} orders · eligible spending PKR {Number(selectedCustomer.eligibleSpending || 0).toLocaleString()}</p>
          <h4 className="mt-4 text-sm font-semibold">Order history</h4>
          <div className="mt-2 space-y-2">{(selectedCustomer.orderHistory || []).map((order) => <div key={order._id} className="flex justify-between gap-3 text-sm"><span>#{String(order._id).slice(-8)} · {order.status}</span><span>PKR {Number(order.total).toLocaleString()}</span></div>)}</div>
        </div>}
      </>
    );

    if (section === 'orders') return <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
      <thead className="border-b border-[#e9dfd7] text-xs uppercase tracking-wide text-[#6f4e37]"><tr><th className="p-3">Order</th><th className="p-3">Customer / items</th><th className="p-3">Placed</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Advance</th><th className="p-3">Actions</th></tr></thead>
      <tbody>{(data?.rows || []).map((order) => {
        const next = { Confirmed: 'Dispatched', Dispatched: 'On The Way', 'On The Way': 'Delivered' }[order.status];
        return <tr key={order._id} className="border-b border-[#f0e8e2] align-top">
          <td className="p-3">#{String(order._id).slice(-8)}</td>
          <td className="p-3"><div className="font-semibold">{order.customerInfo?.name}</div><div className="text-xs">{order.customerInfo?.email}</div><div className="mt-2 text-xs">{(order.cartItems || []).map((item) => `${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ''} ×${item.qty}`).join(', ')}</div></td>
          <td className="p-3">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
          <td className="p-3">PKR {Number(order.total || 0).toLocaleString()}</td><td className="p-3">{order.status}</td>
          <td className="p-3">{next ? <button className={buttonClass} onClick={() => runAction(() => request(`/admin/orders/${order._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: next }) }), `Order advanced to ${next}.`)}>{next}</button> : '—'}</td>
          <td className="p-3"><button className={deleteButtonClass} onClick={async () => {
            if (!window.confirm(`Permanently delete order #${String(order._id).slice(-8)} and all data in this order record? This cannot be undone.`)) return;
            if (window.prompt('Type DELETE to permanently remove this order:') !== 'DELETE') return;
            await runAction(() => request(`/admin/orders/${order._id}`, { method: 'DELETE', body: JSON.stringify({ confirmation: 'DELETE' }) }), 'Order permanently deleted.');
          }}>Delete permanently</button></td>
        </tr>;
      })}</tbody></table></div>;

    if (section === 'messages') return <div className="space-y-3">{(data?.rows || []).map((item) => <article key={item._id} className="rounded-xl border border-[#eee4dc] p-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row"><div><h3 className="font-semibold">{item.subject}</h3><p className="text-sm">{item.name} · <a className="underline" href={`mailto:${item.email}`}>{item.email}</a>{item.orderNumber ? ` · Order ${item.orderNumber}` : ''}</p><time className="text-xs text-[#76675c]">{new Date(item.createdAt).toLocaleString()}</time></div>
        <select className={controlClass} aria-label={`Status for ${item.subject}`} value={item.status} onChange={(event) => runAction(() => request(`/admin/messages/${item._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: event.target.value }) }), 'Message status updated.')}>{['New', 'In Progress', 'Resolved', 'Archived'].map((status) => <option key={status}>{status}</option>)}</select>
      </div><p className="mt-3 whitespace-pre-wrap text-sm leading-6">{item.message}</p>
    </article>)}</div>;

    if (section === 'cms') {
      const isMediaPage = cmsSlug === 'home' || cmsSlug === 'shop';
      const saveButtons = <div className="mt-3 flex flex-wrap gap-2">
        <button className={buttonClass} onClick={() => runAction(() => saveCmsContent(false), 'CMS draft saved.')}>Save draft</button>
        <button className={`${buttonClass} border-[#1a1512] bg-[#1a1512] text-white hover:bg-[#3b2a20]`} onClick={() => runAction(() => saveCmsContent(true), 'Page published.')}>Publish</button>
      </div>;
      return <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
        <label className="text-sm font-semibold">Page<select value={cmsSlug} onChange={(event) => setCmsSlug(event.target.value)} className={`${controlClass} mt-2 w-full`}>{['home', 'shop', 'about', 'contact', 'faq', 'shipping', 'returns', 'privacy', 'terms', 'size-guide'].map((slug) => <option key={slug}>{slug}</option>)}</select>
          <p className="mt-3 text-xs font-normal leading-5 text-[#695a50]">{isMediaPage ? 'Paste a public HTTPS image URL or a root-relative public asset path. Image file uploads are not configured. Save as draft to stage changes, or publish to show them on the public page.' : 'Page copy is stored as structured JSON. Public pages use the published content where supported.'}</p>
        </label>
        <div>
          {cmsSlug === 'home' ? <div className="space-y-6">
            <section><h2 className="font-semibold">Homepage hero slideshow</h2><div className="mt-3 grid gap-4 sm:grid-cols-2">
              {cmsVisuals.heroImages.map((image, index) => <label key={`hero-${index}`} className="block text-sm font-medium">Slide {index + 1} image URL or asset path
                <input className={`${controlClass} mt-1 w-full`} maxLength={2048} value={image} onChange={(event) => setCmsVisuals((current) => ({ ...current, heroImages: current.heroImages.map((entry, entryIndex) => entryIndex === index ? event.target.value : entry) }))} />
                {image && <img src={image} alt={`Homepage hero slide ${index + 1} preview`} className="mt-2 h-28 w-full rounded-lg border border-[#e2d7cf] object-cover" />}
              </label>)}
            </div></section>
            <section><h2 className="font-semibold">Trending category images</h2><div className="mt-3 grid gap-4 sm:grid-cols-2">
              {trendingCategoryDefaults.map((category, index) => <label key={category.name} className="block text-sm font-medium">{category.name}
                <input className={`${controlClass} mt-1 w-full`} maxLength={2048} value={cmsVisuals.trendingCategoryImages[index] || ''} onChange={(event) => setCmsVisuals((current) => ({ ...current, trendingCategoryImages: current.trendingCategoryImages.map((entry, entryIndex) => entryIndex === index ? event.target.value : entry) }))} />
                {cmsVisuals.trendingCategoryImages[index] && <img src={cmsVisuals.trendingCategoryImages[index]} alt={`${category.name} preview`} className="mt-2 h-28 w-full rounded-lg border border-[#e2d7cf] object-cover" />}
              </label>)}
            </div></section>
          </div> : cmsSlug === 'shop' ? <label className="block text-sm font-semibold">Shop header image URL or asset path
            <input className={`${controlClass} mt-2 w-full`} maxLength={2048} value={cmsVisuals.shopHeroImage} onChange={(event) => setCmsVisuals((current) => ({ ...current, shopHeroImage: event.target.value }))} />
            {cmsVisuals.shopHeroImage && <img src={cmsVisuals.shopHeroImage} alt="Shop header image preview" className="mt-3 h-48 w-full rounded-xl border border-[#e2d7cf] object-cover" />}
          </label> : <>
            <label className="block text-sm font-semibold">Draft content (JSON)<textarea value={cmsText} onChange={(event) => setCmsText(event.target.value)} className={`${controlClass} mt-2 min-h-[280px] w-full font-mono text-xs`} spellCheck="false" /></label>
            <button className={`${buttonClass} mt-3`} onClick={() => {
              try { setCmsPreview(JSON.parse(cmsText)); } catch { setError('CMS content must be valid JSON before preview.'); }
            }}>Preview draft</button>
            {cmsPreview && <article className="mt-5 rounded-xl border border-[#d8cfc5] bg-[#f8f3ef] p-5">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f4e37]">Draft preview</div>
              <h3 className="mt-2 text-2xl font-semibold">{typeof cmsPreview.title === 'string' ? cmsPreview.title : cmsSlug}</h3>
              {typeof cmsPreview.intro === 'string' && <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm leading-6">{cmsPreview.intro}</p>}
              {typeof cmsPreview.story === 'string' && <p className="mt-3 max-w-2xl whitespace-pre-wrap text-sm leading-6">{cmsPreview.story}</p>}
            </article>}
          </>}
          {saveButtons}
          <p className="mt-3 text-xs text-[#695a50]">{data?.versions?.length || 0} recent saved versions retained.</p>
        </div>
      </div>;
    }

    if (section === 'reports') return <div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[['Eligible order value', `PKR ${Number(data?.eligibleOrderValue || 0).toLocaleString()}`], ['Confirmed+ order count', data?.completedOrConfirmedOrders ?? 0], ['Average eligible order', `PKR ${Number(data?.averageOrderValue || 0).toLocaleString()}`], ['New customers', data?.newCustomers ?? 0]].map(([label, value]) => <div key={label} className="rounded-xl border border-[#eee4dc] bg-[#faf6f2] p-4"><div className="text-xs text-[#68574b]">{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div></div>)}
      </div>
      <p className="mt-4 text-xs leading-5 text-[#695a50]">{data?.metricDefinitions?.eligibleOrderValue || 'Order-value metric.'} This is not payment settlement, collected cash, or profit.</p>
      <h3 className="mt-6 font-semibold">Orders by status</h3><div className="mt-2 space-y-2">{(data?.statusDistribution || []).map((item) => <div key={item._id} className="flex justify-between rounded-lg bg-[#faf6f2] px-3 py-2 text-sm"><span>{item._id}</span><strong>{item.count}</strong></div>)}</div>
      <h3 className="mt-6 font-semibold">Daily eligible order value</h3><div className="mt-2 space-y-2">{(data?.sales || []).map((item) => <div key={item._id} className="flex justify-between rounded-lg bg-[#faf6f2] px-3 py-2 text-sm"><span>{item._id} · {item.orders} orders</span><strong>PKR {Number(item.eligibleOrderValue).toLocaleString()}</strong></div>)}</div>
    </div>;

    if (section === 'security') return <div className="space-y-3">{(data?.rows || []).map((item) => <div key={item._id} className="flex flex-col justify-between gap-2 rounded-xl border border-[#eee4dc] p-4 sm:flex-row"><div><strong>{item.action}</strong><div className="text-xs">{item.actorEmail} · {item.targetType} {item.targetId}</div></div><time className="text-xs text-[#76675c]">{new Date(item.createdAt).toLocaleString()}</time></div>)}</div>;

    return null;
  };

  return <div className="min-h-screen bg-[#f3efe9] text-[#1a1512]">
    <header className="sticky top-0 z-30 border-b border-[#3a2c24] bg-[#1a1512] text-[#f3efe9]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 md:px-7">
        <div><div className="text-xs font-semibold uppercase tracking-[0.26em] text-[#d7c0ad]">VEXORA</div><div className="text-sm">Owner control center</div></div>
        <div className="flex items-center gap-3"><span className="hidden text-sm text-[#e0d6cc] sm:inline">{owner?.email}</span><button className="inline-flex items-center gap-2 rounded-lg border border-[#59483c] px-3 py-2 text-sm hover:bg-white/10" onClick={onLogout}><LogOut size={15} /> Sign out</button></div>
      </div>
    </header>
    <div className="mx-auto flex max-w-[1600px] flex-col md:flex-row">
      <aside className="border-b border-[#ded1c7] bg-[#eee5de] p-3 md:min-h-[calc(100vh-65px)] md:w-60 md:border-b-0 md:border-r md:p-4">
        <nav aria-label="Admin navigation" className="flex gap-2 overflow-x-auto md:sticky md:top-20 md:flex-col">
          {sections.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSection(id); setPage(1); setSearch(''); setFilter(''); setSelectedCustomer(null); setNotice(''); }} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${section === id ? 'bg-[#1a1512] text-[#f3efe9]' : 'text-[#3f332b] hover:bg-white'}`}><Icon size={16} />{label}</button>)}
        </nav>
        <p className="mt-6 hidden px-2 text-xs leading-5 text-[#6a5c52] md:block">Products, inventory, payments, returns, reviews and coupons are not exposed as controls because this project has no corresponding database collections or provider integrations.</p>
      </aside>
      <main className="min-w-0 flex-1 px-4 py-6 md:px-7 md:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6f4e37]">VEXORA / Admin / {title}</div><h1 className="mt-2 text-3xl font-semibold">{title}</h1></div>
          {['customers', 'orders', 'messages', 'security', 'products'].includes(section) && <div className="flex flex-wrap gap-2">
            <label className="relative"><span className="sr-only">Search {title}</span><Search size={15} className="absolute left-3 top-3 text-[#77685d]" /><input className={`${controlClass} pl-9`} value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { setPage(1); loadSection(); } }} placeholder="Search…" /></label>
            {(section === 'customers' || section === 'messages' || section === 'orders' || section === 'products') && <select className={controlClass} aria-label="Status filter" value={filter} onChange={(event) => { setFilter(event.target.value); setPage(1); }}><option value="">All status</option>{(section === 'customers' ? ['active', 'inactive'] : section === 'messages' ? ['New', 'In Progress', 'Resolved', 'Archived'] : section === 'orders' ? ['Pending Confirmation', 'Confirming', 'Confirmed', 'Dispatched', 'On The Way', 'Delivered'] : ['draft', 'published', 'archived']).map((item) => <option key={item} value={item}>{item}</option>)}</select>}
            {section === 'products' && <>
              <select className={controlClass} aria-label="Sort products" value={productSort} onChange={(event) => setProductSort(event.target.value)}><option value="newest">Newest</option><option value="name">Name</option><option value="price_asc">Price ascending</option><option value="price_desc">Price descending</option><option value="stock">Lowest stock</option></select>
              <select className={controlClass} aria-label="Filter products by category" value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }}><option value="">All categories</option>{(data?.categories || []).map((category) => <option key={category} value={category}>{category}</option>)}</select>
            </>}
            {section === 'customers' && <button className={buttonClass} onClick={exportCustomers}>Export CSV</button>}
          </div>}
        </div>
        {notice && <p role="status" className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-900">{notice}</p>}
        {error && <div role="alert" className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-900"><span>{error}</span><button className={buttonClass} onClick={loadSection}>Retry</button></div>}
        <section className={cardClass}>
          {loading && !(section === 'overview' && liveOverview)
            ? <div className="animate-pulse py-10 text-center text-sm text-[#695a50]" aria-live="polite">Loading {title.toLowerCase()}…</div>
            : section === 'overview'
              ? renderOverview()
              : renderRows() || <p className="py-8 text-center text-sm text-[#695a50]">No records found.</p>}
          {data?.totalPages > 1 && <div className="mt-5 flex items-center justify-between border-t border-[#eee4dc] pt-4 text-sm"><span>Page {data.page} of {data.totalPages} · {data.total} records</span><div className="flex gap-2"><button className={buttonClass} disabled={page <= 1} onClick={() => setPage((value) => value - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button><button className={buttonClass} disabled={page >= data.totalPages} onClick={() => setPage((value) => value + 1)} aria-label="Next page"><ChevronRight size={16} /></button></div></div>}
        </section>
        <p className="mt-4 text-xs text-[#6a5c52]">Signed in as {owner?.name || owner?.email}. Prices and order values are read from saved order records.</p>
      </main>
    </div>
  </div>;
}
