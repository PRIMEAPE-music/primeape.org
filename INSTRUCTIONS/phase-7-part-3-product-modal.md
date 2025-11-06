# PHASE 7 - PART 3: Product Modal with Image Carousel

## Part Overview
**Purpose**: Build the product detail modal that opens when a product card is clicked, featuring image carousel, size/dimension selectors, and purchase button.

**What This Part Covers**:
- ProductModal component with fade + scale animation
- Image carousel with navigation and thumbnails
- Size selector for clothing
- Dimension selector for art prints
- "Buy Now" button (opens confirmation modal in Part 4)
- Modal backdrop with click-to-close
- Keyboard focus trapping
- Mobile full-screen optimization

**Estimated Time**: 60-75 minutes  
**Complexity**: Moderate-Complex

---

## Dependencies
This part builds on:
- ✅ Part 1: Product data types
- ✅ Part 2: MerchSection and ProductCard components

**Required Before Starting**:
- `MerchSection.tsx` should have `selectedProduct` state
- Product types should include `sizes` and `dimensions` optional arrays

---

## Architecture Overview

```
ProductModal
├── Modal backdrop (click-to-close)
├── Modal content container
│   ├── Close button (×)
│   ├── Image carousel
│   │   ├── Main image display
│   │   ├── Navigation arrows (prev/next)
│   │   └── Thumbnail strip
│   └── Product details panel
│       ├── Product name & category
│       ├── Price display
│       ├── Description text
│       ├── Size/Dimension selector (conditional)
│       └── Buy Now button
└── Focus trap for accessibility
```

---

## File 1: ProductModal Component

### 📁 File: `src/components/Merch/ProductModal.tsx`

**Action Required**: Create this new file.

**Complete File Content**:

```typescript
import React, { useState, useEffect, useRef } from 'react';
import type { MerchProduct, SelectedProductOptions } from '@/types';
import './ProductModal.css';

interface ProductModalProps {
  product: MerchProduct;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (product: MerchProduct, options: SelectedProductOptions) => void;
}

/**
 * ProductModal Component
 * 
 * Full-featured product detail modal with:
 * - Image carousel with thumbnails
 * - Size/dimension selectors
 * - Purchase button
 * - Keyboard navigation and focus trapping
 * - Click-outside-to-close
 * - Fade + scale animation
 * 
 * Mobile: Full-screen overlay
 * Desktop: Centered modal with backdrop
 */
const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onPurchase,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<SelectedProductOptions>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset state when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedOptions({
      size: product.sizes?.[0],
      dimension: product.dimensions?.[0],
    });
  }, [product]);

  // Focus trap and escape key handler
  useEffect(() => {
    if (!isOpen) return;

    // Focus close button when modal opens
    closeButtonRef.current?.focus();

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Trap focus within modal
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Image carousel navigation
  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : product.images.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < product.images.length - 1 ? prev + 1 : 0
    );
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Option selection handlers
  const handleSizeSelect = (size: string) => {
    setSelectedOptions((prev) => ({ ...prev, size }));
  };

  const handleDimensionSelect = (dimension: string) => {
    setSelectedOptions((prev) => ({ ...prev, dimension }));
  };

  // Purchase handler
  const handlePurchaseClick = () => {
    onPurchase(product, selectedOptions);
  };

  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const hasMultipleImages = product.images.length > 1;
  const categoryLabels: Record<MerchProduct['category'], string> = {
    clothing: 'Apparel',
    music: 'Music',
    art: 'Art Print',
  };

  return (
    <div
      className="product-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="product-modal" ref={modalRef}>
        {/* Close Button */}
        <button
          ref={closeButtonRef}
          className="product-modal__close"
          onClick={onClose}
          aria-label="Close product details"
          type="button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="product-modal__content">
          {/* Image Carousel Section */}
          <div className="product-modal__gallery">
            {/* Main Image */}
            <div className="product-modal__main-image">
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Image ${currentImageIndex + 1}`}
                className="product-modal__image"
              />

              {/* Navigation Arrows (only if multiple images) */}
              {hasMultipleImages && (
                <>
                  <button
                    className="product-modal__image-nav product-modal__image-nav--prev"
                    onClick={handlePreviousImage}
                    aria-label="Previous image"
                    type="button"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button
                    className="product-modal__image-nav product-modal__image-nav--next"
                    onClick={handleNextImage}
                    aria-label="Next image"
                    type="button"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip (only if multiple images) */}
            {hasMultipleImages && (
              <div className="product-modal__thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`product-modal__thumbnail ${
                      index === currentImageIndex
                        ? 'product-modal__thumbnail--active'
                        : ''
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-current={index === currentImageIndex ? 'true' : 'false'}
                    type="button"
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="product-modal__thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="product-modal__details">
            {/* Category Badge */}
            <span className="product-modal__category">
              {categoryLabels[product.category]}
            </span>

            {/* Product Name */}
            <h2 id="modal-title" className="product-modal__title">
              {product.name}
            </h2>

            {/* Price */}
            <p className="product-modal__price">
              ${product.price.toFixed(2)}
            </p>

            {/* Description */}
            <p className="product-modal__description">
              {product.description}
            </p>

            {/* Size Selector (for clothing) */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-modal__options">
                <label className="product-modal__options-label">
                  Select Size
                </label>
                <div className="product-modal__options-grid">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`product-modal__option-button ${
                        selectedOptions.size === size
                          ? 'product-modal__option-button--active'
                          : ''
                      }`}
                      onClick={() => handleSizeSelect(size)}
                      aria-pressed={selectedOptions.size === size}
                      type="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dimension Selector (for art prints) */}
            {product.dimensions && product.dimensions.length > 0 && (
              <div className="product-modal__options">
                <label className="product-modal__options-label">
                  Select Size
                </label>
                <div className="product-modal__options-grid">
                  {product.dimensions.map((dimension) => (
                    <button
                      key={dimension}
                      className={`product-modal__option-button ${
                        selectedOptions.dimension === dimension
                          ? 'product-modal__option-button--active'
                          : ''
                      }`}
                      onClick={() => handleDimensionSelect(dimension)}
                      aria-pressed={selectedOptions.dimension === dimension}
                      type="button"
                    >
                      {dimension}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buy Now Button */}
            <button
              className="product-modal__buy-button"
              onClick={handlePurchaseClick}
              type="button"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
```

---

## File 2: ProductModal Styles

### 📁 File: `src/components/Merch/ProductModal.css`

**Action Required**: Create this new file.

**Complete File Content**:

```css
/* ============================================================================
   MODAL BACKDROP
   ============================================================================ */

.product-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-md);
  animation: fadeIn 200ms ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* ============================================================================
   MODAL CONTAINER
   ============================================================================ */

.product-modal {
  position: relative;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  animation: modalEnter 250ms ease-out;
}

@keyframes modalEnter {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ============================================================================
   CLOSE BUTTON
   ============================================================================ */

.product-modal__close {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid var(--color-border);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  backdrop-filter: blur(4px);
}

.product-modal__close:hover {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  transform: scale(1.1);
}

.product-modal__close:active {
  transform: scale(0.95);
}

.product-modal__close:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* ============================================================================
   MODAL CONTENT LAYOUT
   ============================================================================ */

.product-modal__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-height: 90vh;
  overflow: hidden;
}

/* ============================================================================
   GALLERY SECTION
   ============================================================================ */

.product-modal__gallery {
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  padding: var(--space-lg);
  gap: var(--space-md);
}

.product-modal__main-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 2;
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.product-modal__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* ============================================================================
   IMAGE NAVIGATION ARROWS
   ============================================================================ */

.product-modal__image-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid var(--color-accent);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  backdrop-filter: blur(4px);
}

.product-modal__image-nav:hover {
  background-color: var(--color-accent);
  border-color: var(--color-hover);
  transform: translateY(-50%) scale(1.1);
}

.product-modal__image-nav:active {
  transform: translateY(-50%) scale(0.95);
}

.product-modal__image-nav--prev {
  left: var(--space-sm);
}

.product-modal__image-nav--next {
  right: var(--space-sm);
}

/* ============================================================================
   THUMBNAIL STRIP
   ============================================================================ */

.product-modal__thumbnails {
  display: flex;
  gap: var(--space-sm);
  overflow-x: auto;
  padding: var(--space-xs) 0;
  scrollbar-width: thin;
  scrollbar-color: var(--color-accent) var(--color-bg);
}

.product-modal__thumbnails::-webkit-scrollbar {
  height: 6px;
}

.product-modal__thumbnails::-webkit-scrollbar-track {
  background: var(--color-bg);
}

.product-modal__thumbnails::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: var(--radius-sm);
}

.product-modal__thumbnail {
  flex: 0 0 80px;
  height: 80px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
  background: transparent;
}

.product-modal__thumbnail:hover {
  border-color: var(--color-accent);
  transform: scale(1.05);
}

.product-modal__thumbnail--active {
  border-color: var(--color-accent);
}

.product-modal__thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ============================================================================
   DETAILS SECTION
   ============================================================================ */

.product-modal__details {
  padding: var(--space-xl);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.product-modal__details::-webkit-scrollbar {
  width: 8px;
}

.product-modal__details::-webkit-scrollbar-track {
  background: var(--color-surface);
}

.product-modal__details::-webkit-scrollbar-thumb {
  background: var(--color-accent);
  border-radius: var(--radius-sm);
}

.product-modal__category {
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  background-color: var(--color-bg);
  color: var(--color-accent);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  width: fit-content;
}

.product-modal__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
}

.product-modal__price {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  margin: 0;
}

.product-modal__description {
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
}

/* ============================================================================
   OPTIONS (SIZE/DIMENSION SELECTORS)
   ============================================================================ */

.product-modal__options {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.product-modal__options-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-modal__options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
  gap: var(--space-sm);
}

.product-modal__option-button {
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.product-modal__option-button:hover {
  border-color: var(--color-accent);
  color: var(--color-text-primary);
}

.product-modal__option-button--active {
  background-color: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-bg);
}

.product-modal__option-button:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* ============================================================================
   BUY BUTTON
   ============================================================================ */

.product-modal__buy-button {
  width: 100%;
  padding: var(--space-md) var(--space-xl);
  background-color: var(--color-accent);
  border: none;
  border-radius: var(--radius-md);
  color: var(--color-bg);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: auto;
}

.product-modal__buy-button:hover {
  background-color: var(--color-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.product-modal__buy-button:active {
  transform: translateY(0);
}

.product-modal__buy-button:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* ============================================================================
   MOBILE LAYOUT (<768px)
   ============================================================================ */

@media (max-width: 767px) {
  .product-modal-backdrop {
    padding: 0;
  }

  .product-modal {
    max-width: 100%;
    max-height: 100vh;
    height: 100vh;
    border-radius: 0;
    border: none;
  }

  .product-modal__content {
    grid-template-columns: 1fr;
    max-height: 100vh;
    overflow-y: auto;
  }

  .product-modal__gallery {
    padding: var(--space-md);
  }

  .product-modal__details {
    padding: var(--space-md);
  }

  .product-modal__close {
    top: var(--space-sm);
    right: var(--space-sm);
    width: 36px;
    height: 36px;
  }

  .product-modal__title {
    font-size: var(--font-size-xl);
  }

  .product-modal__price {
    font-size: var(--font-size-2xl);
  }
}
```

---

## Integration with MerchSection

### 📁 File: `src/components/Merch/MerchSection.tsx`

**Action Required**: Update the existing file to integrate the ProductModal.

🔍 **FIND:**
```typescript
import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import { MERCH_PRODUCTS } from '@/data/merchProducts';
import type { MerchProduct } from '@/types';
import './MerchSection.css';
```

✏️ **REPLACE WITH:**
```typescript
import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { MERCH_PRODUCTS } from '@/data/merchProducts';
import type { MerchProduct, SelectedProductOptions } from '@/types';
import './MerchSection.css';
```

🔍 **FIND:**
```typescript
  const handleProductClick = (product: MerchProduct) => {
    setSelectedProduct(product);
    // Modal will be opened in Part 3
    console.log('Product clicked:', product.name);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };
```

✏️ **REPLACE WITH:**
```typescript
  const handleProductClick = (product: MerchProduct) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handlePurchase = (product: MerchProduct, options: SelectedProductOptions) => {
    // Purchase confirmation modal will be opened in Part 4
    console.log('Purchase initiated:', { product: product.name, options });
    // For now, just close the product modal
    setSelectedProduct(null);
  };
```

🔍 **FIND:**
```typescript
      {/* ProductModal will be added in Part 3 */}
      {selectedProduct && (
        <div style={{ display: 'none' }}>
          {/* Placeholder for modal - will be replaced in Part 3 */}
          <p>Modal for {selectedProduct.name} will appear here</p>
        </div>
      )}
```

✏️ **REPLACE WITH:**
```typescript
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
          onPurchase={handlePurchase}
        />
      )}
```

---

## Technical Notes

### Animation Strategy
- **Fade + Scale**: Modal fades in with opacity 0→1 while scaling from 0.95→1.0
- **Duration**: 250ms for smooth but snappy entrance
- **Easing**: `ease-out` for natural deceleration
- **Backdrop**: Separate 200ms fade animation for backdrop
- **Exit**: CSS handles exit animation automatically

### Focus Management
- **Initial focus**: Close button receives focus when modal opens
- **Focus trap**: Tab cycles through focusable elements within modal
- **Escape key**: Closes modal
- **Body scroll lock**: Prevents background scrolling when modal is open

### Image Carousel Logic
- **State management**: `currentImageIndex` tracks active image
- **Navigation**: Arrows cycle through images with wrap-around
- **Thumbnails**: Click to jump to specific image
- **Active indicator**: Visual feedback on current thumbnail
- **Conditional rendering**: Arrows/thumbnails only show if multiple images exist

### Option Selectors
- **Auto-selection**: First option auto-selected on modal open
- **Toggle buttons**: Visual feedback for selected option
- **Conditional display**: Only show size selector for clothing, dimension selector for art
- **ARIA attributes**: `aria-pressed` for toggle state

### Mobile Optimization
- **Full-screen**: Modal takes entire viewport on mobile
- **Scrollable**: Vertical scroll for content that doesn't fit
- **Touch-friendly**: Larger hit targets for buttons
- **No padding**: Uses full screen space efficiently

---

## Validation Checklist

After completing this part, verify:

- [ ] TypeScript compiles without errors
- [ ] Clicking a product card opens the modal
- [ ] Modal displays product image, name, price, description
- [ ] Image carousel navigation works (if multiple images)
- [ ] Thumbnails display and are clickable (if multiple images)
- [ ] Size selector appears for clothing items
- [ ] Dimension selector appears for art prints
- [ ] First option is auto-selected for selectors
- [ ] Clicking option buttons updates selection
- [ ] "Buy Now" button logs to console
- [ ] Close button (×) closes modal
- [ ] Clicking backdrop closes modal
- [ ] Escape key closes modal
- [ ] Tab key cycles through focusable elements
- [ ] Focus doesn't escape modal while open
- [ ] Body scroll is locked when modal is open
- [ ] Modal animation (fade + scale) is smooth
- [ ] Mobile view shows full-screen modal

---

## Testing Instructions

### Desktop Testing
1. Click any product card
2. Verify modal opens with fade + scale animation
3. Verify product details display correctly
4. Test image carousel (if product has multiple images):
   - Click left/right arrows
   - Click thumbnails
   - Verify active thumbnail highlight
5. Test option selectors (clothing/art):
   - Click different size/dimension buttons
   - Verify visual feedback (active state)
6. Test close functionality:
   - Click × button
   - Click backdrop (outside modal)
   - Press Escape key
7. Test keyboard navigation:
   - Tab through all focusable elements
   - Verify focus doesn't escape modal
   - Verify focus trap cycles correctly

### Mobile Testing (<768px)
1. Click product card in carousel
2. Verify full-screen modal
3. Scroll through modal content
4. Verify all interactive elements are touch-friendly
5. Test image carousel with touch
6. Test close functionality
7. Verify body doesn't scroll behind modal

---

## Next Steps

Once this part is complete and validated:
1. Proceed to **Part 4** to build the PurchaseConfirmationModal
2. The `handlePurchase` function is already set up to trigger the confirmation
3. The modal closing logic is already in place

---

## Common Issues & Solutions

### Issue: Modal doesn't close when clicking backdrop
**Solution**: Ensure `onClick={handleBackdropClick}` is on `.product-modal-backdrop` and check the `e.target === e.currentTarget` condition

### Issue: Focus escapes the modal
**Solution**: Verify the Tab key handler is working and that `focusableElements` query is correct

### Issue: Body scrolls behind modal
**Solution**: Check that `document.body.style.overflow = 'hidden'` is being set and cleaned up properly

### Issue: Animation looks jumpy
**Solution**: Verify both `fadeIn` and `modalEnter` animations are defined and have appropriate durations

### Issue: Thumbnails don't scroll horizontally
**Solution**: Ensure `.product-modal__thumbnails` has `overflow-x: auto` and `flex-wrap: nowrap` (implicitly from flex)

### Issue: Options not updating selection
**Solution**: Check that `selectedOptions` state is being updated correctly in `handleSizeSelect` and `handleDimensionSelect`

### Issue: Close button not visible
**Solution**: Verify z-index is high enough and check background color contrast

### Issue: Modal doesn't display on mobile
**Solution**: Check media query breakpoint and ensure grid is switching to single column
