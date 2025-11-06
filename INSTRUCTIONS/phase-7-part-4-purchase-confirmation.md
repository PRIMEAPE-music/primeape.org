# PHASE 7 - PART 4: Purchase Confirmation Modal

## Part Overview
**Purpose**: Build a confirmation modal that appears after clicking "Buy Now", providing final order details before redirecting to Printful.

**What This Part Covers**:
- PurchaseConfirmationModal component
- Order summary display (product, options, price)
- "Confirm & Go to Printful" button
- "Cancel" button to return to product modal
- Same animation style as ProductModal (fade + scale)
- Opens in same window (not new tab)

**Estimated Time**: 30-40 minutes  
**Complexity**: Simple-Moderate

---

## Dependencies
This part builds on:
- ✅ Part 1: Product data types
- ✅ Part 3: ProductModal with purchase handler

**Required Before Starting**:
- `ProductModal.tsx` should have `onPurchase` callback
- Product types should include `printfulUrl`

---

## Architecture Overview

```
PurchaseConfirmationModal
├── Modal backdrop (click-to-close)
├── Modal content container
│   ├── Header ("Confirm Your Order")
│   ├── Product summary
│   │   ├── Product name
│   │   ├── Selected options (size/dimension)
│   │   └── Price
│   ├── Info message about Printful redirect
│   └── Action buttons
│       ├── Cancel button
│       └── Confirm button (redirects to Printful)
```

---

## File 1: PurchaseConfirmationModal Component

### 📁 File: `src/components/Merch/PurchaseConfirmationModal.tsx`

**Action Required**: Create this new file.

**Complete File Content**:

```typescript
import React, { useEffect, useRef } from 'react';
import type { MerchProduct, SelectedProductOptions } from '@/types';
import './PurchaseConfirmationModal.css';

interface PurchaseConfirmationModalProps {
  product: MerchProduct;
  options: SelectedProductOptions;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * PurchaseConfirmationModal Component
 * 
 * Confirmation dialog before redirecting to Printful.
 * Shows order summary and provides cancel/confirm actions.
 * 
 * - Cancel: Returns to product modal
 * - Confirm: Redirects to Printful in same window
 */
const PurchaseConfirmationModal: React.FC<PurchaseConfirmationModalProps> = ({
  product,
  options,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management and keyboard handlers
  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button when modal opens
    confirmButtonRef.current?.focus();

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

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onClose]);

  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Format price
  const formattedPrice = `$${product.price.toFixed(2)}`;

  // Get selected option display
  const selectedOption = options.size || options.dimension || null;

  return (
    <div
      className="purchase-confirmation-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div className="purchase-confirmation" ref={modalRef}>
        {/* Header */}
        <div className="purchase-confirmation__header">
          <h2 id="confirmation-title" className="purchase-confirmation__title">
            Confirm Your Order
          </h2>
        </div>

        {/* Order Summary */}
        <div className="purchase-confirmation__content">
          <div className="purchase-confirmation__product">
            <img
              src={product.images[0]}
              alt={product.name}
              className="purchase-confirmation__image"
            />
            <div className="purchase-confirmation__details">
              <h3 className="purchase-confirmation__product-name">
                {product.name}
              </h3>
              {selectedOption && (
                <p className="purchase-confirmation__option">
                  Size: <strong>{selectedOption}</strong>
                </p>
              )}
              <p className="purchase-confirmation__price">
                {formattedPrice}
              </p>
            </div>
          </div>

          {/* Info Message */}
          <div className="purchase-confirmation__info">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="purchase-confirmation__info-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <p className="purchase-confirmation__info-text">
              You'll be redirected to our fulfillment partner, Printful, to complete your purchase securely.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="purchase-confirmation__actions">
          <button
            className="purchase-confirmation__button purchase-confirmation__button--cancel"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            ref={confirmButtonRef}
            className="purchase-confirmation__button purchase-confirmation__button--confirm"
            onClick={onConfirm}
            type="button"
          >
            Confirm & Go to Printful
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmationModal;
```

---

## File 2: PurchaseConfirmationModal Styles

### 📁 File: `src/components/Merch/PurchaseConfirmationModal.css`

**Action Required**: Create this new file.

**Complete File Content**:

```css
/* ============================================================================
   CONFIRMATION MODAL BACKDROP
   ============================================================================ */

.purchase-confirmation-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1100; /* Higher than ProductModal (1000) */
  background-color: rgba(0, 0, 0, 0.9);
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
   CONFIRMATION MODAL CONTAINER
   ============================================================================ */

.purchase-confirmation {
  position: relative;
  max-width: 500px;
  width: 100%;
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
   HEADER
   ============================================================================ */

.purchase-confirmation__header {
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
}

.purchase-confirmation__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  text-align: center;
}

/* ============================================================================
   CONTENT
   ============================================================================ */

.purchase-confirmation__content {
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ============================================================================
   PRODUCT SUMMARY
   ============================================================================ */

.purchase-confirmation__product {
  display: flex;
  gap: var(--space-md);
  align-items: center;
  padding: var(--space-md);
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.purchase-confirmation__image {
  width: 80px;
  height: 160px; /* 1:2 ratio */
  object-fit: cover;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.purchase-confirmation__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.purchase-confirmation__product-name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
}

.purchase-confirmation__option {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.purchase-confirmation__option strong {
  color: var(--color-text-primary);
}

.purchase-confirmation__price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  margin: 0;
}

/* ============================================================================
   INFO MESSAGE
   ============================================================================ */

.purchase-confirmation__info {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-md);
  background-color: rgba(var(--color-accent-rgb, 218, 165, 32), 0.1);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  align-items: flex-start;
}

.purchase-confirmation__info-icon {
  flex-shrink: 0;
  color: var(--color-accent);
  margin-top: 2px;
}

.purchase-confirmation__info-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* ============================================================================
   ACTION BUTTONS
   ============================================================================ */

.purchase-confirmation__actions {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg);
}

.purchase-confirmation__button {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.purchase-confirmation__button:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

/* Cancel Button */
.purchase-confirmation__button--cancel {
  background-color: transparent;
  border: 2px solid var(--color-border);
  color: var(--color-text-secondary);
}

.purchase-confirmation__button--cancel:hover {
  border-color: var(--color-text-primary);
  color: var(--color-text-primary);
}

.purchase-confirmation__button--cancel:active {
  transform: scale(0.98);
}

/* Confirm Button */
.purchase-confirmation__button--confirm {
  background-color: var(--color-accent);
  border: 2px solid var(--color-accent);
  color: var(--color-bg);
}

.purchase-confirmation__button--confirm:hover {
  background-color: var(--color-hover);
  border-color: var(--color-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.purchase-confirmation__button--confirm:active {
  transform: translateY(0);
}

/* ============================================================================
   MOBILE ADJUSTMENTS
   ============================================================================ */

@media (max-width: 767px) {
  .purchase-confirmation {
    max-width: 100%;
    margin: 0 var(--space-md);
  }

  .purchase-confirmation__header {
    padding: var(--space-md);
  }

  .purchase-confirmation__title {
    font-size: var(--font-size-lg);
  }

  .purchase-confirmation__content {
    padding: var(--space-md);
  }

  .purchase-confirmation__actions {
    flex-direction: column;
    padding: var(--space-md);
  }

  .purchase-confirmation__button {
    width: 100%;
  }
}
```

---

## File 3: Update MerchSection to Handle Confirmation

### 📁 File: `src/components/Merch/MerchSection.tsx`

**Action Required**: Update existing file to integrate the confirmation modal.

🔍 **FIND:**
```typescript
import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { MERCH_PRODUCTS } from '@/data/merchProducts';
import type { MerchProduct, SelectedProductOptions } from '@/types';
import './MerchSection.css';
```

✏️ **REPLACE WITH:**
```typescript
import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import PurchaseConfirmationModal from './PurchaseConfirmationModal';
import { MERCH_PRODUCTS } from '@/data/merchProducts';
import type { MerchProduct, SelectedProductOptions } from '@/types';
import './MerchSection.css';
```

🔍 **FIND:**
```typescript
const MerchSection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
```

✏️ **REPLACE WITH:**
```typescript
const MerchSection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(null);
  const [purchaseConfirmation, setPurchaseConfirmation] = useState<{
    product: MerchProduct;
    options: SelectedProductOptions;
  } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
```

🔍 **FIND:**
```typescript
  const handlePurchase = (product: MerchProduct, options: SelectedProductOptions) => {
    // Purchase confirmation modal will be opened in Part 4
    console.log('Purchase initiated:', { product: product.name, options });
    // For now, just close the product modal
    setSelectedProduct(null);
  };
```

✏️ **REPLACE WITH:**
```typescript
  const handlePurchase = (product: MerchProduct, options: SelectedProductOptions) => {
    // Open confirmation modal
    setPurchaseConfirmation({ product, options });
  };

  const handleCloseConfirmation = () => {
    setPurchaseConfirmation(null);
  };

  const handleConfirmPurchase = () => {
    if (!purchaseConfirmation) return;

    // Close both modals
    setSelectedProduct(null);
    setPurchaseConfirmation(null);

    // Redirect to Printful in same window
    window.location.href = purchaseConfirmation.product.printfulUrl;
  };
```

🔍 **FIND:**
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
    </section>
  );
};
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

      {/* Purchase Confirmation Modal */}
      {purchaseConfirmation && (
        <PurchaseConfirmationModal
          product={purchaseConfirmation.product}
          options={purchaseConfirmation.options}
          isOpen={!!purchaseConfirmation}
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </section>
  );
};
```

---

## Technical Notes

### Z-Index Strategy
- **ProductModal backdrop**: `z-index: 1000`
- **PurchaseConfirmationModal backdrop**: `z-index: 1100`
- This ensures confirmation modal appears above product modal

### Window Redirect
- Using `window.location.href` instead of `window.open()` to redirect in same window
- This is the expected e-commerce pattern (not opening new tab)
- User can use browser back button to return if needed

### State Management
- `purchaseConfirmation` holds both product and selected options
- Both modals can be open simultaneously (product modal in background)
- Confirming purchase closes both modals before redirect
- Canceling only closes confirmation modal (product modal stays open)

### Focus Management
- Confirmation button receives focus when modal opens
- Focus trap prevents tabbing outside modal
- Escape key closes confirmation modal
- Same accessibility pattern as ProductModal

### Visual Hierarchy
- Darker backdrop (0.9 opacity) emphasizes importance
- Product summary shows thumbnail for visual confirmation
- Info message explains the Printful redirect
- Accent color on confirm button for clear call-to-action

---

## Validation Checklist

After completing this part, verify:

- [ ] TypeScript compiles without errors
- [ ] Clicking "Buy Now" in ProductModal opens confirmation
- [ ] Confirmation modal displays product summary
- [ ] Selected size/dimension is shown (if applicable)
- [ ] Price is displayed correctly
- [ ] Info message about Printful is visible
- [ ] "Cancel" button closes confirmation (keeps ProductModal open)
- [ ] "Confirm" button redirects to Printful URL
- [ ] Confirmation modal appears above ProductModal
- [ ] Escape key closes confirmation modal
- [ ] Clicking backdrop closes confirmation modal
- [ ] Focus trap works correctly
- [ ] Animation matches ProductModal style
- [ ] Mobile layout is responsive

---

## Testing Instructions

### Desktop Testing
1. Open a product modal
2. Select a size/dimension (if applicable)
3. Click "Buy Now"
4. Verify confirmation modal appears
5. Check product summary displays correctly
6. Test "Cancel" button:
   - Should close confirmation
   - Should keep product modal open
7. Click "Buy Now" again
8. Test "Confirm & Go to Printful" button:
   - Should redirect to Printful URL
   - Should open in same window
9. Test close mechanisms:
   - Escape key
   - Backdrop click
10. Test keyboard navigation:
    - Tab between buttons
    - Enter/Space to activate

### Mobile Testing (<768px)
1. Follow same flow as desktop
2. Verify buttons stack vertically
3. Verify modal is centered and sized appropriately
4. Test touch interactions

### Edge Cases
1. Test with product that has no size/dimension options (CD):
   - Confirmation should not show "Size:" line
2. Test rapid clicking:
   - Should not open multiple confirmations
3. Test browser back button after redirect:
   - Should return to site properly

---

## Next Steps

Once this part is complete and validated:
1. Proceed to **Part 5** to integrate MerchSection into the app
2. All merch functionality is now complete
3. Part 5 will focus on final integration and styling adjustments

---

## Common Issues & Solutions

### Issue: Confirmation modal appears behind product modal
**Solution**: Verify `z-index: 1100` on `.purchase-confirmation-backdrop` (higher than ProductModal's 1000)

### Issue: Cancel button closes both modals
**Solution**: Ensure `handleCloseConfirmation` only sets `setPurchaseConfirmation(null)`, not `setSelectedProduct(null)`

### Issue: Redirect opens in new tab
**Solution**: Use `window.location.href` instead of `window.open()` or `<a target="_blank">`

### Issue: Selected option not displaying
**Solution**: Check that `options.size || options.dimension` is being accessed correctly

### Issue: Can't click through to confirmation from product modal
**Solution**: Verify `handlePurchase` is setting `purchaseConfirmation` state correctly

### Issue: Focus not trapped in confirmation modal
**Solution**: Check that focus trap logic matches ProductModal implementation

### Issue: Info icon not displaying
**Solution**: Verify SVG code is complete and CSS color is set correctly
