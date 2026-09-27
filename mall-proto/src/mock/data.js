/**
 * Mock Data - Media Equipment Mall (Overseas)
 * Categories: Audio / Microphones / Stage Lighting
 * Images: picsum.photos placeholders
 */

// ── Banners ──────────────────────────────────────────────
export const banners = [
  {
    id: 1,
    title: 'Pro Audio Sale',
    subtitle: 'Up to 40% off premium sound gear',
    image: 'https://picsum.photos/seed/audio-sale/800/400',
    gradient: 'linear-gradient(135deg, #0F2027, #203A43, #2C5364)',
  },
  {
    id: 2,
    title: 'Stage Lighting Collection',
    subtitle: 'Illuminate your next performance',
    image: 'https://picsum.photos/seed/stage-light/800/400',
    gradient: 'linear-gradient(135deg, #1A1A2E, #16213E, #0F3460)',
  },
  {
    id: 3,
    title: 'Studio Microphones',
    subtitle: 'Capture every detail with clarity',
    image: 'https://picsum.photos/seed/studio-mic/800/400',
    gradient: 'linear-gradient(135deg, #0D1117, #1B2838, #2A3F5F)',
  },
  {
    id: 4,
    title: 'New Arrivals 2026',
    subtitle: 'Latest media equipment just landed',
    image: 'https://picsum.photos/seed/new-gear/800/400',
    gradient: 'linear-gradient(135deg, #141E30, #243B55, #2F80ED)',
  },
]

// ── Categories ────────────────────────────────────────────
export const categories = [
  {
    id: 'audio',
    name: 'Audio',
    icon: 'speaker',
    color: '#00E5FF',
  },
  {
    id: 'mic',
    name: 'Microphones',
    icon: 'mic',
    color: '#2F80ED',
  },
  {
    id: 'lighting',
    name: 'Lighting',
    icon: 'light',
    color: '#A855F7',
  },
  {
    id: 'all',
    name: 'All Products',
    icon: 'grid',
    color: '#64FFDA',
  },
]

// ── Products ──────────────────────────────────────────────
export const products = [
  {
    id: 1,
    name: 'Professional Studio Monitor Speaker SR-8X',
    price: 899,
    originalPrice: 1299,
    currency: '$',
    sales: 3200,
    tag: 'New',
    category: 'audio',
    image: 'https://picsum.photos/seed/speaker-8x/400/400',
    supplierId: 1,
    rating: 4.9,
    desc: '8-inch near-field studio monitor with bi-amp design, 120W total power. Flat frequency response from 38Hz to 22kHz.',
  },
  {
    id: 2,
    name: 'Condenser Microphone CM-200 Pro',
    price: 349,
    originalPrice: 499,
    currency: '$',
    sales: 8600,
    tag: 'Hot',
    category: 'mic',
    image: 'https://picsum.photos/seed/mic-cm200/400/400',
    supplierId: 2,
    rating: 4.8,
    desc: 'Large-diaphragm condenser microphone with cardioid polar pattern. Gold-plated diaphragm, low noise floor.',
  },
  {
    id: 3,
    name: 'LED Moving Head Light MH-380',
    price: 599,
    originalPrice: 899,
    currency: '$',
    sales: 1500,
    tag: 'Best Seller',
    category: 'lighting',
    image: 'https://picsum.photos/seed/light-mh380/400/400',
    supplierId: 3,
    rating: 4.7,
    desc: '380W LED moving head with 7R brightness, 16-bit dimming, pan/tilt movement. DMX512 control supported.',
  },
  {
    id: 4,
    name: 'Portable Bluetooth Speaker BT-12',
    price: 159,
    originalPrice: 239,
    currency: '$',
    sales: 12000,
    tag: '',
    category: 'audio',
    image: 'https://picsum.photos/seed/speaker-bt12/400/400',
    supplierId: 1,
    rating: 4.6,
    desc: 'IPX7 waterproof Bluetooth speaker, 30W output, 24-hour battery life. Perfect for outdoor events.',
  },
  {
    id: 5,
    name: 'Dynamic Vocal Microphone DM-58S',
    price: 129,
    originalPrice: 189,
    currency: '$',
    sales: 9800,
    tag: 'Hot',
    category: 'mic',
    image: 'https://picsum.photos/seed/mic-dm58s/400/400',
    supplierId: 2,
    rating: 4.8,
    desc: 'Professional dynamic microphone for live vocals. Neodymium magnet, cardioid pattern, shock-mounted capsule.',
  },
  {
    id: 6,
    name: 'RGBW Par Light PL-196',
    price: 89,
    originalPrice: 139,
    currency: '$',
    sales: 5400,
    tag: '',
    category: 'lighting',
    image: 'https://picsum.photos/seed/light-pl196/400/400',
    supplierId: 3,
    rating: 4.5,
    desc: '196x 10W RGBW LED par light, DMX-512, auto/sound-active/master-slave modes. IP65 outdoor rated.',
  },
  {
    id: 7,
    name: 'Subwoofer SW-18 Pro Sub',
    price: 1299,
    originalPrice: 1799,
    currency: '$',
    sales: 890,
    tag: 'New',
    category: 'audio',
    image: 'https://picsum.photos/seed/sub-sw18/400/400',
    supplierId: 1,
    rating: 4.9,
    desc: '18-inch active subwoofer, 1000W RMS Class-D amplifier, 30Hz-150Hz response. Built-in DSP processing.',
  },
  {
    id: 8,
    name: 'USB Podcast Microphone PM-01',
    price: 79,
    originalPrice: 119,
    currency: '$',
    sales: 21000,
    tag: 'Best Seller',
    category: 'mic',
    image: 'https://picsum.photos/seed/mic-pm01/400/400',
    supplierId: 2,
    rating: 4.7,
    desc: 'Plug-and-play USB microphone for podcasting and streaming. Cardioid pattern, built-in headphone jack.',
  },
  {
    id: 9,
    name: 'Laser Projector Light FX-2000',
    price: 749,
    originalPrice: 999,
    currency: '$',
    sales: 670,
    tag: '',
    category: 'lighting',
    image: 'https://picsum.photos/seed/light-fx2000/400/400',
    supplierId: 3,
    rating: 4.6,
    desc: 'RGB laser projector with 2000mW output, ILDA interface, auto/sound modes. Create stunning aerial effects.',
  },
  {
    id: 10,
    name: 'Line Array Speaker LA-210',
    price: 2499,
    originalPrice: 3299,
    currency: '$',
    sales: 420,
    tag: 'Pro',
    category: 'audio',
    image: 'https://picsum.photos/seed/speaker-la210/400/400',
    supplierId: 1,
    rating: 5.0,
    desc: 'Dual 10-inch line array speaker system, 1400W peak power, 70° horizontal coverage. Flying hardware included.',
  },
  {
    id: 11,
    name: 'Wireless Lavalier Mic Set WL-4',
    price: 199,
    originalPrice: 299,
    currency: '$',
    sales: 3500,
    tag: 'New',
    category: 'mic',
    image: 'https://picsum.photos/seed/mic-wl4/400/400',
    supplierId: 2,
    rating: 4.5,
    desc: '4-channel wireless lavalier microphone system. UHF band, 300ft range, OLED display, rechargeable.',
  },
  {
    id: 12,
    name: 'Strobe Light Bar SB-300',
    price: 129,
    originalPrice: 199,
    currency: '$',
    sales: 2600,
    tag: '',
    category: 'lighting',
    image: 'https://picsum.photos/seed/light-sb300/400/400',
    supplierId: 3,
    rating: 4.4,
    desc: 'LED strobe bar light, 300x SMD LEDs, variable speed, DMX512. Ideal for stage and dance floor.',
  },
]

// ── Suppliers ─────────────────────────────────────────────
export const suppliers = [
  {
    id: 1,
    name: 'SoundTech Pro Audio',
    location: 'Shenzhen, China',
    verified: true,
    rating: 4.9,
    yearsOnPlatform: 8,
    mainProducts: 'Studio Monitors, Subwoofers, Line Arrays',
    mainCategory: 'audio',
    avatar: 'https://picsum.photos/seed/supplier-soundtech/100/100',
    cover: 'https://picsum.photos/seed/supplier-soundtech-cover/800/300',
    description: 'SoundTech Pro Audio has been manufacturing professional audio equipment for over 15 years. We specialize in studio monitors, subwoofers, and line array systems for venues, studios, and live events worldwide.',
    contacts: {
      phone: '+86 755 8888 1234',
      email: 'sales@soundtech-pro.com',
      whatsapp: '+86 138 0013 8000',
    },
    productCount: 4,
  },
  {
    id: 2,
    name: 'MicMaster Studio Gear',
    location: 'Los Angeles, USA',
    verified: true,
    rating: 4.8,
    yearsOnPlatform: 6,
    mainProducts: 'Condenser Mics, Dynamic Mics, Wireless Systems',
    mainCategory: 'mic',
    avatar: 'https://picsum.photos/seed/supplier-micmaster/100/100',
    cover: 'https://picsum.photos/seed/supplier-micmaster-cover/800/300',
    description: 'MicMaster Studio Gear designs and manufactures premium microphones for recording studios, broadcast, and live performance. Our products are trusted by Grammy-winning engineers and podcasters alike.',
    contacts: {
      phone: '+1 323 555 0192',
      email: 'info@micmaster.studio',
      whatsapp: '+1 323 555 0192',
    },
    productCount: 4,
  },
  {
    id: 3,
    name: 'StageBright Lighting Co.',
    location: 'Guangzhou, China',
    verified: true,
    rating: 4.7,
    yearsOnPlatform: 10,
    mainProducts: 'Moving Heads, Par Lights, Laser Projectors',
    mainCategory: 'lighting',
    avatar: 'https://picsum.photos/seed/supplier-stagebright/100/100',
    cover: 'https://picsum.photos/seed/supplier-stagebright-cover/800/300',
    description: 'StageBright Lighting Co. is a leading manufacturer of professional stage lighting equipment. With 10+ years on the platform, we supply moving heads, LED par lights, and laser projectors to events companies in 40+ countries.',
    contacts: {
      phone: '+86 20 6666 8888',
      email: 'export@stagebright-lighting.com',
      whatsapp: '+86 159 8888 7777',
    },
    productCount: 4,
  },
]

// ── Detail Page: Image Gallery (mix of images + video) ────
export const productGallery = [
  { type: 'image', src: 'https://picsum.photos/seed/detail-img-1/800/800', thumb: 'https://picsum.photos/seed/detail-img-1/120/120' },
  { type: 'image', src: 'https://picsum.photos/seed/detail-img-2/800/800', thumb: 'https://picsum.photos/seed/detail-img-2/120/120' },
  { type: 'video', src: '', thumb: 'https://picsum.photos/seed/detail-video-3/120/120', poster: 'https://picsum.photos/seed/detail-video-poster/800/800' },
  { type: 'image', src: 'https://picsum.photos/seed/detail-img-4/800/800', thumb: 'https://picsum.photos/seed/detail-img-4/120/120' },
]

// ── Detail Page: Rich Text + Image content blocks ─────────
export const productContentBlocks = [
  {
    type: 'heading',
    text: 'Product Overview',
  },
  {
    type: 'text',
    text: 'Engineered for professional audio production environments, this device delivers studio-grade sound reproduction with exceptional clarity and precision. The advanced bi-amplification system ensures accurate frequency separation for true-to-life audio monitoring.',
  },
  {
    type: 'image',
    src: 'https://picsum.photos/seed/content-overview/800/450',
  },
  {
    type: 'heading',
    text: 'Key Features',
  },
  {
    type: 'text',
    text: 'Featuring a custom-designed driver with neodymium magnet, rear bass reflex port, and premium Class-D amplification. The DSP processor provides parametric EQ, crossover adjustment, and limiter functions.',
  },
  {
    type: 'image',
    src: 'https://picsum.photos/seed/content-features/800/450',
  },
  {
    type: 'heading',
    text: 'Technical Specifications',
  },
  {
    type: 'text',
    text: 'Frequency Response: 38Hz - 22kHz (-3dB). SPL: 114dB peak. Input: Balanced XLR/TRS. Power: 120W (bi-amp). Cabinet: MDF with piano-grade finish.',
  },
  {
    type: 'image',
    src: 'https://picsum.photos/seed/content-specs/800/450',
  },
]

// ── Helper Functions ──────────────────────────────────────
export function getProductsByCategory(categoryId) {
  if (categoryId === 'all' || !categoryId) return products
  return products.filter((p) => p.category === categoryId)
}

export function getProductById(id) {
  return products.find((p) => p.id === Number(id))
}

export function getSupplierById(id) {
  return suppliers.find((s) => s.id === Number(id))
}

export function getProductsBySupplier(supplierId) {
  return products.filter((p) => p.supplierId === Number(supplierId))
}

export function getSuppliersByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return suppliers
  return suppliers.filter((s) => s.mainCategory === categoryId)
}

export function sortProducts(productList, sortBy) {
  const list = [...productList]
  switch (sortBy) {
    case 'price-asc':
      return list.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return list.sort((a, b) => b.price - a.price)
    case 'newest':
      return list.sort((a, b) => b.id - a.id)
    case 'sales':
      return list.sort((a, b) => b.sales - a.sales)
    default:
      return list
  }
}
