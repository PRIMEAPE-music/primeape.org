import type { MerchProduct } from '@/types';

/**
 * MERCH PRODUCT DATA
 *
 * Mock product data for the merch store.
 *
 * Images use placeholder service with 1:2 ratio (width:height).
 * Formula: width × 2 = height (e.g., 300×600, 400×800)
 *
 * PLACEHOLDER SERVICE URLS:
 * - https://placehold.co/300x600/1a1a1a/888888?text=Product+Name
 * - Format: /WIDTHxHEIGHT/BG_COLOR/TEXT_COLOR?text=YOUR_TEXT
 *
 * TO UPDATE WITH REAL IMAGES:
 * 1. Upload product photos to /public/merch/
 * 2. Update image URLs to: '/merch/product-name-1.jpg'
 * 3. Add multiple images per product as they become available
 */

export const MERCH_PRODUCTS: MerchProduct[] = [
  // ========== CLOTHING ==========
  {
    id: 'tshirt-foundation',
    name: 'FOUNDATION T-Shirt',
    description: 'Premium cotton t-shirt featuring the FOUNDATION album artwork. Unisex fit with high-quality screen print.',
    price: 29.99,
    category: 'clothing',
    images: [
      'https://placehold.co/300x600/1a1a1a/888888?text=FOUNDATION+Tee+Front',
      'https://placehold.co/300x600/2a2a2a/999999?text=FOUNDATION+Tee+Back',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    printfulUrl: 'https://www.printful.com/dashboard', // Replace with actual product URL
  },
  {
    id: 'hoodie-foundation',
    name: 'FOUNDATION Hoodie',
    description: 'Heavyweight hoodie with embroidered PRIMEAPE logo. Soft fleece interior, drawstring hood, and kangaroo pocket.',
    price: 54.99,
    category: 'clothing',
    images: [
      'https://placehold.co/300x600/1a1a1a/888888?text=FOUNDATION+Hoodie+Front',
      'https://placehold.co/300x600/2a2a2a/999999?text=FOUNDATION+Hoodie+Back',
      'https://placehold.co/300x600/3a3a3a/aaaaaa?text=FOUNDATION+Hoodie+Detail',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    printfulUrl: 'https://www.printful.com/dashboard', // Replace with actual product URL
  },

  // ========== MUSIC ==========
  {
    id: 'cd-foundation',
    name: 'FOUNDATION CD',
    description: 'Physical CD featuring all 16 tracks from FOUNDATION. Includes full-color booklet with lyrics and credits.',
    price: 15.99,
    category: 'music',
    images: [
      'https://placehold.co/300x600/1a1a1a/888888?text=FOUNDATION+CD+Front',
      'https://placehold.co/300x600/2a2a2a/999999?text=FOUNDATION+CD+Back',
      'https://placehold.co/300x600/3a3a3a/aaaaaa?text=FOUNDATION+CD+Open',
    ],
    printfulUrl: 'https://www.printful.com/dashboard', // Replace with actual product URL
  },

  // ========== ART ==========
  {
    id: 'print-foundation-artwork',
    name: 'FOUNDATION Album Art Print',
    description: 'Museum-quality giclée print of the FOUNDATION album artwork. Printed on premium matte paper with archival inks.',
    price: 34.99,
    category: 'art',
    images: [
      'https://placehold.co/300x600/1a1a1a/888888?text=Album+Art+Print',
      'https://placehold.co/300x600/2a2a2a/999999?text=Framed+Preview',
    ],
    dimensions: ['8x16"', '11x22"', '16x32"'],
    printfulUrl: 'https://www.printful.com/dashboard', // Replace with actual product URL
  },
];

/**
 * Helper function to get a product by ID
 */
export const getProductById = (id: string): MerchProduct | undefined => {
  return MERCH_PRODUCTS.find((product) => product.id === id);
};

/**
 * Helper function to get products by category
 */
export const getProductsByCategory = (category: MerchProduct['category']): MerchProduct[] => {
  return MERCH_PRODUCTS.filter((product) => product.category === category);
};
