import { useEffect, useState } from 'react'

export default function OrderSuccess() {
  const [orderId, setOrderId] = useState('')
  const businessNumber = '923068939934'

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('orderId')
    if (id) {
      setOrderId(id)
    }
  }, [])

  const handleWhatsAppConfirm = () => {
    const message = `Please confirm my order #${orderId}`
    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3efe9]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A1512] mb-4">Order Not Found</h1>
          <p className="text-[#6D6259]">Please place an order first.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3efe9] px-4 py-12">
      <div className="max-w-lg w-full bg-white border border-[#E5DED5] shadow-lg">
        {/* Brand Header */}
        <div className="bg-[#1A1512] p-8 text-center">
          <h1 className="text-3xl font-bold text-[#F3EFE9] tracking-widest">VEXORA</h1>
          <p className="text-[#C9BDB0] text-xs tracking-widest mt-2">STREETWEAR. MODEST LUXURY.</p>
        </div>

        {/* Success Message */}
        <div className="bg-[#E8E2D9] p-6 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="text-[#6F4E37] text-xs font-bold tracking-widest mb-2">ORDER PLACED SUCCESSFULLY</p>
          <h2 className="text-2xl font-bold text-[#1A1512]">Thank You for Shopping with Vexora!</h2>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <p className="text-[#6D6259] mb-6">
            Your order has been placed successfully. Please confirm your order via WhatsApp to complete the process.
          </p>

          {/* Order ID Display */}
          <div className="inline-block bg-[#F3EFE9] border border-[#E5DED5] px-4 py-3 mb-8">
            <p className="text-xs text-[#75685D] tracking-wider mb-1">ORDER ID</p>
            <p className="text-[#1A1512] font-bold">#{orderId}</p>
          </div>

          {/* WhatsApp Confirm Button */}
          <button
            onClick={handleWhatsAppConfirm}
            className="w-full bg-[#1A1512] text-[#F3EFE9] py-4 px-6 font-bold tracking-wider hover:bg-[#2a2018] transition-colors"
          >
            ✅ Confirm My Order
          </button>

          <p className="mt-4 text-xs text-[#8A7D71]">
            Clicking this button will open WhatsApp with a pre-filled message to confirm your order.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-[#1A1512] p-6 text-center">
          <p className="text-[#C9BDB0] text-xs tracking-widest">WEAR YOUR STATEMENT.</p>
          <p className="text-[#A99B8E] text-xs mt-2">VEXORA © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
