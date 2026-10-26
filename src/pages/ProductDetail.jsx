import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Heart, Minus, Plus, ShoppingBag, Star, Send, X } from 'lucide-react'
import { formatPrice } from '../data/catalog'
import { API_BASE_URL } from '../config/api.js'

const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#e8dfd5"/><text x="50%" y="48%" text-anchor="middle" fill="#6f4e37" font-family="Georgia,serif" font-size="54" letter-spacing="8">VEXORA</text><text x="50%" y="55%" text-anchor="middle" fill="#6f4e37" font-family="Arial,sans-serif" font-size="22" letter-spacing="3">IMAGE UNAVAILABLE</text></svg>'
)}`

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export default function ProductDetail() {
  const productId = decodeURIComponent(window.location.pathname.split('/').pop() || '')
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [imageIndex, setImageIndex] = useState(0)
  const [size, setSize] = useState('')
  const [colorIndex, setColorIndex] = useState(-1)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const [wishlisted, setWishlisted] = useState(false)
  const [useColorImage, setUseColorImage] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [showReviewsModal, setShowReviewsModal] = useState(false)
  const [reviewData, setReviewData] = useState({ rating: 5, title: '', comment: '' })
  const [reviews, setReviews] = useState([])
  const images = product ? (product.gallery?.length ? product.gallery : product.image ? [product.image] : []) : []
  const selectedColor = colorIndex >= 0 ? product?.colors?.[colorIndex] : product?.colors?.[0] || ''
  
  // Check for color-specific image
  const colorSpecificImage = selectedColor && product?.colorImages?.length > 0
    ? product.colorImages.find(ci => ci.color === selectedColor)?.imageUrl
    : null
  
  const currentImage = useColorImage && colorSpecificImage ? colorSpecificImage : (images[imageIndex] || FALLBACK_IMAGE)
  const selectedVariant = product?.variants?.find((variant) =>
    variant.size === (size || product.sizes?.[0] || '') && variant.color === selectedColor
  )
  const availableStock = product?.trackInventory
    ? product.variants?.length ? selectedVariant?.stock ?? 0 : product.stock
    : Number.POSITIVE_INFINITY
  const salePercent = useMemo(
    () => product?.oldPrice > product.price ? Math.round((1 - product.price / product.oldPrice) * 100) : 0,
    [product]
  )

  useEffect(() => {
    let active = true
    const loadProduct = async () => {
      setLoading(true)
      setLoadError('')
      try {
        if (!API_BASE_URL) throw new Error('The product catalog API is not configured.')
        const apiBase = `${API_BASE_URL}/api`
        const response = await fetch(`${apiBase}/products/${encodeURIComponent(productId)}`)
        const body = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(body.message || 'This product could not be loaded.')
        if (active) setProduct(body.product)
        
        // Load reviews
        const reviewsResponse = await fetch(`${apiBase}/reviews/product/${body.product._id || body.product.id}`)
        const reviewsBody = await reviewsResponse.json().catch(() => ({ reviews: [] }))
        if (active) setReviews(reviewsBody.reviews || [])
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : 'This product could not be loaded.')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadProduct()
    return () => { active = false }
  }, [productId])

  useEffect(() => {
    if (!product) return
    setSize(product.sizes?.length === 1 ? product.sizes[0] : '')
    setColorIndex(product.colors?.length === 1 ? 0 : -1)
    setImageIndex(0)
    setUseColorImage(false)
    setWishlisted(readStorage('vexora-wishlist', []).includes(product.id))
  }, [product])

  // Update color image when color changes
  useEffect(() => {
    if (!product || colorIndex < 0) return
    const selectedColor = product.colors[colorIndex]
    const hasColorImage = product?.colorImages?.some(ci => ci.color === selectedColor)
    console.log('Color selected:', selectedColor, 'Has color image:', hasColorImage, 'Color images:', product.colorImages)
    setUseColorImage(hasColorImage)
    setImageIndex(0)
  }, [colorIndex, product])

  useEffect(() => {
    if (!product) return
    const previousTitle = document.title
    const description = document.querySelector('meta[name="description"]')
    const previousDescription = description?.content
    document.title = `${product.name} | VEXORA`
    if (description) description.content = `${product.name} from VEXORA. ${product.description}`
    return () => {
      document.title = previousTitle
      if (description && previousDescription !== undefined) description.content = previousDescription
    }
  }, [product])

  if (loading) {
    return <main aria-live="polite" className="flex min-h-screen items-center justify-center bg-[#f3efe9] px-5 text-[#1a1512]">Loading product…</main>
  }

  if (loadError || !product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#f3efe9] px-5 text-center text-[#1a1512]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6f4e37]">VEXORA</p>
        <h1 className="mt-3 font-display text-3xl">{loadError ? 'Product unavailable' : 'Product not found'}</h1>
        {loadError && <p role="alert" className="mt-3 max-w-md text-sm text-[#51463e]">{loadError}</p>}
        <a href="/shop" className="mt-6 rounded-full bg-[#1a1512] px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white">Back to Shop</a>
      </main>
    )
  }

  const toggleWishlist = () => {
    const current = readStorage('vexora-wishlist', [])
    const next = current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id]
    try {
      window.localStorage.setItem('vexora-wishlist', JSON.stringify(next))
      setWishlisted(next.includes(product.id))
      setMessage(next.includes(product.id) ? 'Saved to your wishlist.' : 'Removed from your wishlist.')
    } catch {
      setMessage('Your browser could not save this wishlist change.')
    }
  }

  const addToCart = () => {
    if (product.sizes?.length > 1 && !size) {
      setMessage('Please select a size.')
      return
    }
    if (product.colors?.length > 1 && colorIndex < 0) {
      setMessage('Please select a color.')
      return
    }
    if (quantity > availableStock) {
      setMessage('The selected quantity is not available.')
      return
    }

    const selectedSize = size || product.sizes?.[0] || ''
    const selectedColor = colorIndex >= 0 ? product.colors[colorIndex] : product.colors?.[0] || ''
    const cartLineId = `${product.id}:${selectedSize}:${selectedColor}`
    const existingCart = readStorage('vexora-cart', [])
    const existing = existingCart.find((item) => (item.cartLineId || item.id) === cartLineId)
    const cart = existing
      ? existingCart.map((item) => (item.cartLineId || item.id) === cartLineId ? { ...item, quantity: item.quantity + quantity } : item)
      : [...existingCart, {
        ...product,
        productId: product._id || product.id,
        images: images.length ? images : [FALLBACK_IMAGE],
        priceFormatted: formatPrice(product.price),
        cartLineId,
        selectedSize,
        selectedColor,
        quantity,
      }]

    try {
      window.localStorage.setItem('vexora-cart', JSON.stringify(cart))
      setMessage(`${product.name} added to your cart.`)
    } catch {
      setMessage('Your browser could not save this cart change.')
    }
  }

  const submitReview = async () => {
    if (!reviewData.comment.trim()) {
      setMessage('Please write a review comment.')
      return
    }
    try {
      if (!API_BASE_URL) throw new Error('The product catalog API is not configured.')
      const apiBase = `${API_BASE_URL}/api`
      
      const response = await fetch(`${apiBase}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id || product.id,
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
        }),
      })
      
      if (response.ok) {
        setMessage('Review submitted for approval!')
        setShowReviewForm(false)
        setReviewData({ rating: 5, title: '', comment: '' })
      } else {
        const body = await response.json().catch(() => ({}))
        setMessage(body.message || 'Failed to submit review.')
      }
    } catch (error) {
      setMessage('Failed to submit review. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-[#f3efe9] text-[#1a1512]">
      <header className="border-b border-[#e2d7cf] px-5 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <a href="/shop" aria-label="Back to shop" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6f4e37]">
            <ArrowLeft size={16} /> Back to shop
          </a>
          <a href="/" className="font-display text-xl font-bold tracking-[0.15em]">VEXORA</a>
          <a href="/shop" aria-label="Open shop cart" className="rounded-full border border-[#d8cfc5] p-2"><ShoppingBag size={17} /></a>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-8 md:grid-cols-2 md:gap-12 md:py-12">
        <section aria-label={`${product.name} photos`}>
          <div className="aspect-[4/5] overflow-hidden bg-[#e8dfd5]">
            <img src={currentImage} alt={product.name} onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} className="h-full w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button key={`${image}-${index}`} type="button" onClick={() => setImageIndex(index)} aria-label={`View image ${index + 1}`} aria-pressed={imageIndex === index} className={`h-16 w-16 shrink-0 overflow-hidden border-2 ${imageIndex === index ? 'border-[#6f4e37]' : 'border-transparent'}`}>
                  <img src={image} alt="" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE }} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col py-2">
          <nav aria-label="Breadcrumb" className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6f4e37]">
            <a href="/">Home</a><span className="mx-2">/</span><a href="/shop">Shop</a><span className="mx-2">/</span><span aria-current="page">{product.category}</span>
          </nav>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6f4e37]">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-amber-700">
            <Star size={14} fill="currentColor" /> {Number.isFinite(product.rating) ? product.rating : 'No ratings yet'}
            <button 
              onClick={() => setShowReviewsModal(true)}
              className="text-xs text-[#6f4e37] hover:underline cursor-pointer"
            >
              ({reviews.length} reviews)
            </button>
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="text-xl font-semibold">{formatPrice(product.price)}</span>
            {salePercent > 0 && <><span className="text-sm text-[#75695f] line-through">{formatPrice(product.oldPrice)}</span><span className="rounded-full bg-[#6f4e37] px-2 py-1 text-[10px] font-semibold text-white">{salePercent}% OFF</span></>}
          </div>
          <p className="mt-5 text-sm leading-7 text-[#51463e]">{product.description}</p>
          {product.trackInventory && <p className="mt-4 text-xs text-[#6f6257]">{availableStock} available for this option</p>}

          {product.colors?.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-xs font-semibold uppercase tracking-wider">Color</legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {product.colors.map((color, index) => (
                  <button key={`${color}-${index}`} type="button" onClick={() => setColorIndex(index)} aria-label={`Select color option ${index + 1}`} aria-pressed={colorIndex === index} className={`h-8 w-8 rounded-full border border-[#b8aa9d] ${colorIndex === index ? 'ring-2 ring-[#6f4e37] ring-offset-2' : ''}`} style={{ backgroundColor: color }} />
                ))}
              </div>
            </fieldset>
          )}

          {product.sizes?.length > 1 && (
            <fieldset className="mt-6">
              <div className="flex items-center justify-between">
                <legend className="text-xs font-semibold uppercase tracking-wider">Size</legend>
                <a href="/size-guide" className="text-xs text-[#6f4e37] underline underline-offset-2">Size guide</a>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((availableSize) => (
                  <button key={availableSize} type="button" onClick={() => setSize(availableSize)} aria-pressed={size === availableSize} className={`rounded-md border px-4 py-2 text-xs ${size === availableSize ? 'border-[#1a1512] bg-[#1a1512] text-white' : 'border-[#d8cfc5]'}`}>
                    {availableSize}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {product.sizes?.length === 1 && <p className="mt-5 text-xs">Size: {product.sizes[0]}</p>}

          <div className="mt-6 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Quantity</span>
            <div className="inline-flex items-center rounded-md border border-[#d8cfc5]">
              <button type="button" disabled={quantity === 1} aria-label="Decrease quantity" onClick={() => setQuantity((current) => Math.max(1, current - 1))} className="p-2 disabled:opacity-40"><Minus size={14} /></button>
              <span className="min-w-8 text-center text-sm">{quantity}</span>
              <button type="button" aria-label="Increase quantity" disabled={quantity >= availableStock} onClick={() => setQuantity((current) => Math.min(availableStock, current + 1))} className="p-2 disabled:opacity-40"><Plus size={14} /></button>
            </div>
          </div>

          <div className="mt-7 flex gap-2">
            <button type="button" onClick={addToCart} disabled={availableStock < 1} className="flex-1 rounded-full bg-[#1a1512] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-50">{availableStock < 1 ? 'Out of Stock' : 'Add to Cart'}</button>
            <button type="button" onClick={toggleWishlist} aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wishlisted} className={`rounded-full border border-[#d8cfc5] p-3 ${wishlisted ? 'bg-[#6f4e37] text-white' : ''}`}>
              <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>
          {message && <p role="status" aria-live="polite" className="mt-3 text-xs text-[#6f4e37]">{message}</p>}
        </section>
      </div>

      {/* Reviews Section */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold">Customer Reviews ({reviews.length})</h2>
          <button 
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6f4e37]"
          >
            <Send size={14} /> {showReviewForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        {showReviewForm && (
          <div className="mb-8 rounded-xl border border-[#e2d7cf] bg-white/60 p-6">
            <h3 className="font-semibold mb-4">Submit Your Review</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`text-2xl ${reviewData.rating >= star ? 'text-amber-500' : 'text-gray-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Title (Optional)</label>
                <input
                  type="text"
                  value={reviewData.title}
                  onChange={(e) => setReviewData({ ...reviewData, title: e.target.value })}
                  className="w-full rounded-lg border border-[#e2d7cf] px-3 py-2 text-sm"
                  placeholder="Summarize your experience"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2">Your Review</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="w-full rounded-lg border border-[#e2d7cf] px-3 py-2 text-sm min-h-24"
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>
              <button
                onClick={submitReview}
                className="rounded-full bg-[#1a1512] px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white"
              >
                Submit Review
              </button>
            </div>
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="rounded-xl border border-[#e2d7cf] bg-white/60 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{review.customerName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-sm ${review.rating >= star ? 'text-amber-500' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {review.verifiedPurchase && (
                    <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Purchase</span>
                  )}
                </div>
                {review.title && <p className="font-semibold text-sm mt-2">{review.title}</p>}
                <p className="text-sm text-[#51463e] mt-1">{review.comment}</p>
                <p className="text-xs text-[#6f6257] mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-[#6f6257] py-8">No reviews yet. Be the first to review this product!</p>
        )}
      </section>

      {/* All Reviews Modal */}
      {showReviewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowReviewsModal(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-semibold">All Reviews for {product?.name}</h3>
              <button onClick={() => setShowReviewsModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="rounded-xl border border-[#e2d7cf] bg-[#f9f6f2] p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm">{review.customerName}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`text-sm ${review.rating >= star ? 'text-amber-500' : 'text-gray-300'}`}>★</span>
                          ))}
                        </div>
                      </div>
                      {review.verifiedPurchase && (
                        <span className="text-[10px] bg-green-100 text-green-800 px-2 py-1 rounded-full">Verified Purchase</span>
                      )}
                    </div>
                    {review.title && <p className="font-semibold text-sm mt-2">{review.title}</p>}
                    <p className="text-sm text-[#51463e] mt-1">{review.comment}</p>
                    <p className="text-xs text-[#6f6257] mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-[#6f6257] py-8">No reviews yet.</p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
