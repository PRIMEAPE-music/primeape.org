# PHASE 7 - PART 1: Data Structure & Mock Products

## Part Overview
**Purpose**: Set up the foundational data structures and mock product data for the merch system.

**What This Part Covers**:
- Create mock product data file with 4 placeholder products
- Verify/extend TypeScript types for merch products
- Set up placeholder image URLs
- Establish product data patterns for future expansion

**Estimated Time**: 20-30 minutes  
**Complexity**: Simple

---

## Dependencies
This part builds on:
- ✅ Phase 1: Base TypeScript types in `src/types/index.ts`
- ✅ Phase 6: Content sections structure

**Required Before Starting**:
- TypeScript compilation should be working
- `src/types/index.ts` should contain the `MerchProduct` interface

---

## File 1: Verify/Update Type Definitions

### 📁 File: `src/types/index.ts`

**Action Required**: Verify that the `MerchProduct` interface exists and matches this exact structure. If it doesn't exist or differs, add/update it.

**Location in file**: After the `UserPreferences` interface, in the "MERCH TYPES" section.

🔍 **FIND:**
```typescript
// ============================================================================
// MERCH TYPES (for Phase 7)
// ============================================================================

export interface MerchProduct {
  id: string;
  name: string;
  price: number;
  category: 'clothing' | 'music' | 'art';
  images: string[]; // array of image URLs
  sizes?: string[]; // for clothing
  dimensions?
```

✏️ **REPLACE WITH:**
```typescript
// ============================================================================
// MERCH TYPES (for Phase 7)
// ============================================================================

export interface MerchProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'clothing' | 'music' | 'art';
  images: string[]; // array of image URLs (first image is primary)
  sizes?: string[]; // for clothing items
  dimensions?: string[]; // for art prints
  printfulUrl: string; // direct link to Printful product page
}

export type MerchCategory = 'clothing' | 'music' | 'art';

export interface SelectedProductOptions {
  size?: string;
  dimension?: string;
}
```

**If the types don't exist at all**, add them after the `UserPreferences` interface.

---

## File 2: Create Product Data

### 📁 File: `src/data/merchProducts.ts`

**Action Required**: Create this new file with mock product data.

**Complete File Content**:

```typescript
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
```

---

## File 3: Create Placeholder Images Directory

### 📁 Directory: `public/merch/`

**Action Required**: Create this directory structure for future real product images.

**Terminal Command**:
```bash
mkdir -p public/merch
```

**Add a .gitkeep file** to preserve the empty directory:

### 📁 File: `public/merch/.gitkeep`

**Complete File Content**:
```
# Placeholder for merch product images
# Upload product photos here and update src/data/merchProducts.ts
```

---

## Technical Notes

### Placeholder Image Service
We're using `placehold.co` which:
- Generates images on-the-fly
- Supports custom dimensions, colors, and text
- Uses format: `https://placehold.co/WIDTHxHEIGHT/BGCOLOR/TEXTCOLOR?text=YOUR+TEXT`
- 1:2 ratio (300×600, 400×800) matches typical product photography
- Dark background (#1a1a1a) matches site theme

### Image Array Pattern
- **First image** in the array is the primary/thumbnail image
- **Additional images** are for the carousel in the product modal
- Support for unlimited images per product (just keep adding to the array)
- When adding real images, maintain the 1:2 aspect ratio for consistency

### Type Safety
- `MerchProduct` interface enforces required fields
- Optional fields (`sizes?`, `dimensions?`) only apply to relevant categories
- Category type is strictly typed to `'clothing' | 'music' | 'art'`
- TypeScript will catch missing fields at compile time

### Price Format
- Prices stored as numbers (29.99, not "29.99")
- Will be formatted with dollar sign in UI components
- Allows for easy calculations if needed in future

---

## Validation Checklist

After completing this part, verify:

- [ ] TypeScript compiles without errors (`npm run dev` should work)
- [ ] `src/types/index.ts` contains updated `MerchProduct` interface
- [ ] `src/data/merchProducts.ts` exists and exports `MERCH_PRODUCTS` array
- [ ] All 4 products have required fields populated
- [ ] Each product has at least 1 image URL
- [ ] Clothing items have `sizes` array
- [ ] Art print has `dimensions` array
- [ ] `public/merch/` directory exists with `.gitkeep`
- [ ] No TypeScript errors related to merch types

---

## Next Steps

Once this part is complete and validated:
1. Proceed to **Part 2** to build the MerchSection component and product grid
2. The data structure established here will be consumed by all merch UI components
3. Product images can be swapped to real images later without code changes

---

## Common Issues & Solutions

### Issue: TypeScript can't find `@/types`
**Solution**: Ensure your `tsconfig.json` or `vite.config.ts` has path alias configured:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Issue: Placeholder images not loading
**Solution**: 
- Verify URL format is correct (no spaces except `+` in text parameter)
- Check network tab in browser dev tools
- Try a simpler URL first: `https://placehold.co/300x600`

### Issue: Want to add more products now
**Solution**: Copy the product object structure and update the fields. Follow the naming conventions:
- `id`: lowercase-with-hyphens
- `name`: Title Case with brand name
- Keep consistent pricing ($XX.99 format)
