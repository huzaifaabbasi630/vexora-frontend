import { BUSINESS_EMAIL, BUSINESS_WHATSAPP } from './contact'

export const primaryNavigation = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export const footerNavigation = {
  quickLinks: primaryNavigation,
  customerCare: [
    { label: 'Help Center', path: '/help-center' },
    { label: 'Shipping Info', path: '/shipping-info' },
    { label: 'Returns & Exchanges', path: '/returns-exchanges' },
    { label: 'Size Guide', path: '/size-guide' },
    { label: 'FAQ', path: '/faq' },
  ],
  whyVexora: [
    { label: 'Premium Quality', path: '/premium-quality' },
    { label: 'Secure Payments', path: '/secure-payments' },
    { label: 'Cash on Delivery', path: '/cash-on-delivery' },
    { label: 'Online Transfer', path: '/online-transfer' },
  ],
}

export const contentPages = {
  '/about': {
    eyebrow: 'Our story',
    title: 'Modest meets modern.',
    intro: 'Vexora is a Pakistan-based label built around thoughtful clothing, honest quality, and a more considered way to get dressed.',
    sections: [
      { title: 'Rooted here', text: 'We design for real days in Pakistan: changing weather, long commutes, family gatherings, and the moments in between.', action: 'Explore the shop' },
      { title: 'Designed to last', text: 'Every piece is selected for its fabric, finish, and ability to stay useful beyond a single season.', action: 'See our quality promise' },
      { title: 'A personal standard', text: 'From first click to final delivery, we want Vexora to feel clear, warm, and dependable.', action: 'Talk to our team' },
    ],
  },
  '/contact': {
    eyebrow: 'We are here to help',
    title: 'Let us make your next order easy.',
    intro: 'Questions about a product, fit, delivery, or an existing order? Reach us through the channel that works best for you.',
    sections: [
      { title: 'WhatsApp', text: 'Message us for product, size, delivery, and order support.', action: 'Chat on WhatsApp', href: `https://wa.me/${BUSINESS_WHATSAPP}` },
      { title: 'Email', text: `For detailed questions, write to ${BUSINESS_EMAIL}.`, action: 'Email Vexora', href: `mailto:${BUSINESS_EMAIL}` },
      { title: 'Hours', text: 'Monday to Saturday, 10:00 AM to 7:00 PM PKT. We are based in Karachi and deliver nationwide.', action: 'View shipping info' },
    ],
  },
  '/help-center': {
    eyebrow: 'Customer care',
    title: 'Answers before and after you order.',
    intro: 'Find straightforward guidance for choosing, ordering, receiving, and caring for your Vexora pieces.',
    sections: [
      { title: 'Before you order', text: 'Need help choosing? Send us your usual size, height, and preferred fit on WhatsApp.', action: 'Contact support' },
      { title: 'After you order', text: 'Keep your order details handy and we can help with tracking, changes, and delivery questions.', action: 'Read shipping info' },
      { title: 'Need a return?', text: 'Our support team will guide you through the simple seven-day return and exchange process.', action: 'Read returns policy' },
    ],
  },
  '/shipping-info': {
    eyebrow: 'Customer care',
    title: 'Nationwide delivery, clearly explained.',
    intro: 'We deliver across Pakistan with cash on delivery available on eligible orders.',
    sections: [
      { title: 'Delivery time', text: 'Orders usually arrive in 3 to 5 working days. Remote areas may need a little longer.', action: 'Contact us about an order' },
      { title: 'Delivery fee', text: 'Enjoy free nationwide shipping on orders over PKR 5,000. A calculated fee applies below that amount.', action: 'Start shopping' },
      { title: 'At the door', text: 'Please inspect your parcel before accepting it and keep your order confirmation until everything is settled.', action: 'Read the FAQ' },
    ],
  },
  '/returns-exchanges': {
    eyebrow: 'Customer care',
    title: 'A simple seven-day return window.',
    intro: 'If the fit is not right or something is not as expected, we are here to make the next step clear.',
    sections: [
      { title: 'Eligibility', text: 'Contact us within seven days of delivery. Items must be unused, unwashed, and returned with original tags and packaging.', action: 'Contact support' },
      { title: 'Exchange', text: 'Size exchanges are subject to stock availability. We will confirm the replacement before arranging collection.', action: 'Check the size guide' },
      { title: 'Refunds', text: 'Approved refunds are processed after inspection through the original payment method or agreed bank transfer.', action: 'Read the FAQ' },
    ],
  },
  '/size-guide': {
    eyebrow: 'Find your fit',
    title: 'Comfort first, always.',
    intro: 'Use these starting points, then message us if you prefer a relaxed or more tailored fit.',
    sections: [
      { title: 'S to M', text: 'Best for a chest measurement around 36 to 40 inches. Choose M for an easier, layered fit.', action: 'Ask for sizing help' },
      { title: 'L to XL', text: 'Best for a chest measurement around 41 to 46 inches. Tell us your height for more tailored guidance.', action: 'Ask for sizing help' },
      { title: 'One size', text: 'Caps, watches, and sunglasses are listed with their fit details on each product page.', action: 'Browse accessories' },
    ],
  },
  '/faq': {
    eyebrow: 'Customer care',
    title: 'The questions we hear most.',
    intro: 'A quick reference for shipping, payment, product care, and returns.',
    sections: [
      { title: 'Can I pay cash?', text: 'Yes. Cash on delivery is available across Pakistan on eligible orders.', action: 'Read about COD' },
      { title: 'How do I track my order?', text: 'Once your order is dispatched, our team shares the courier and tracking details with you.', action: 'Contact support' },
      { title: 'Can I change my order?', text: 'Message us as soon as possible. We can update an order before it enters dispatch.', action: 'Contact support' },
    ],
  },
  '/premium-quality': {
    eyebrow: 'Why Vexora',
    title: 'Quality you can feel in the details.',
    intro: 'We look for dependable fabrics, clean finishing, and silhouettes that stay relevant beyond one drop.',
    sections: [
      { title: 'Fabric first', text: 'Materials are chosen for breathability, hand feel, and the way they hold up to everyday wear.', action: 'Explore collections' },
      { title: 'Made for movement', text: 'Our fits leave room to move while keeping a composed, intentional shape.', action: 'Find your fit' },
      { title: 'Checked before dispatch', text: 'Every order is reviewed for finish, sizing, and presentation before it leaves us.', action: 'Read shipping info' },
    ],
  },
  '/secure-payments': {
    eyebrow: 'Why Vexora',
    title: 'Payment that feels straightforward.',
    intro: 'Choose the payment option that fits your order, with clear confirmation at every step.',
    sections: [
      { title: 'Cash on delivery', text: 'Pay when your parcel arrives. Please keep the exact or closest amount ready for the courier.', action: 'Read COD details' },
      { title: 'Online transfer', text: 'We accept verified bank and wallet transfers. Our team confirms your payment before dispatch.', action: 'View transfer options' },
      { title: 'Your information', text: 'We only ask for details needed to process and deliver your order, and we never sell customer information.', action: 'Read privacy policy' },
    ],
  },
  '/cash-on-delivery': {
    eyebrow: 'Payment options',
    title: 'Pay when your Vexora order arrives.',
    intro: 'Cash on delivery is available across Pakistan for a simple, familiar checkout experience.',
    sections: [
      { title: 'How it works', text: 'Place your order online, confirm your phone number, and pay the courier at delivery.', action: 'Start shopping' },
      { title: 'Before accepting', text: 'Check the parcel seal and product count at the door. Contact us immediately if anything looks wrong.', action: 'Contact support' },
      { title: 'Order confirmation', text: 'Our team may call to confirm larger or unusual orders before dispatch.', action: 'Read the FAQ' },
    ],
  },
  '/online-transfer': {
    eyebrow: 'Payment options',
    title: 'Fast, verified online payment.',
    intro: 'Prefer to pay ahead? Our team can share the latest bank, JazzCash, or Easypaisa details for your order.',
    sections: [
      { title: 'Place your order', text: 'Send us the product names, sizes, and delivery address so we can calculate the final total.', action: 'Contact support' },
      { title: 'Share confirmation', text: 'After transfer, send the receipt or transaction reference on WhatsApp for quick verification.', action: 'Chat on WhatsApp' },
      { title: 'Dispatch', text: 'Once verified, your order moves to packing and you receive the dispatch update.', action: 'Read shipping info' },
    ],
  },
  '/privacy': {
    eyebrow: 'Vexora policies',
    title: 'Your information stays yours.',
    intro: 'This short policy explains what we collect to process orders and how we use it.',
    sections: [
      { title: 'What we use', text: 'We use your name, contact details, address, and order information to confirm, pack, and deliver your purchase.', action: 'Contact support' },
      { title: 'What we do not do', text: 'We do not sell customer data or use it for unrelated marketing without your consent.', action: 'Read terms' },
      { title: 'Questions', text: 'For a copy, correction, or deletion request, email hello@vexora.pk.', action: 'Email Vexora', href: 'mailto:hello@vexora.pk' },
    ],
  },
  '/terms': {
    eyebrow: 'Vexora policies',
    title: 'Clear terms for a better experience.',
    intro: 'By ordering from Vexora, you agree to the product, payment, delivery, and returns information shared on this site.',
    sections: [
      { title: 'Products', text: 'Colors may vary slightly by screen. Availability, pricing, and product details can change between drops.', action: 'Browse the shop' },
      { title: 'Orders', text: 'An order is confirmed once our team verifies the details. We may contact you before dispatch.', action: 'Read shipping info' },
      { title: 'Returns', text: 'Returns and exchanges follow the eligibility and timing described in our returns policy.', action: 'Read returns policy' },
    ],
  },
}
