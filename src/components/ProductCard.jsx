import { Heart, Plus, Star } from 'lucide-react'
import { formatPrice } from '../data/catalog'

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="group overflow-hidden rounded-[8px] border border-[#e2d8cf] bg-[#faf7f3] shadow-card">
      <div className="relative aspect-[0.92] overflow-hidden bg-[#e8ddd3]">
        <a href={`/product/${product.id}`} className="block h-full w-full"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /></a>
        <button aria-label={`Save ${product.name}`} className="absolute right-3 top-3 rounded-full bg-white/85 p-2 text-coffee-900 backdrop-blur-sm transition hover:bg-white">
          <Heart size={15} />
        </button>
        {product.id === 'vexora-jubbe' && <span className="absolute left-3 top-3 bg-[#4d3021] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">New</span>}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-coffee-900"><a href={`/product/${product.id}`} className="hover:underline">{product.name}</a></h3>
            <p className="mt-1 text-[11px] text-coffee-600">{product.subtitle}</p>
          </div>
          <span className="flex items-center gap-1 text-[11px] text-coffee-700"><Star size={12} fill="currentColor" /> {product.rating}</span>
        </div>
        <p className="mt-3 font-semibold text-coffee-900">{formatPrice(product.price)}</p>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {product.colors.slice(0, 3).map((color) => <span key={color} className="h-3.5 w-3.5 rounded-full border border-black/10" style={{ backgroundColor: color }} />)}
          </div>
          <button onClick={() => onAdd(product)} aria-label={`Add ${product.name} to cart`} className="flex items-center gap-1 rounded-[4px] bg-coffee-700 px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-coffee-900">
            <Plus size={13} /> Add
          </button>
        </div>
      </div>
    </article>
  )
}
