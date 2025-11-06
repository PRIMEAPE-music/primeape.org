# PHASE 7 - PART 2: MerchSection Component & Product Grid

## Part Overview
**Purpose**: Build the main MerchSection component with responsive product display (desktop grid, mobile carousel).

**What This Part Covers**:
- MerchSection wrapper component
- ProductCard component for individual products
- Desktop: 2-column responsive grid
- Mobile: Horizontal carousel with swipe/navigation
- Click-to-open modal functionality (modal built in Part 3)

**Estimated Time**: 45-60 minutes  
**Complexity**: Moderate

---

## Dependencies
This part builds on:
- ✅ Part 1: Product data and types
- ✅ Phase 6: ContentSections structure

**Required Before Starting**:
- `src/data/merchProducts.ts` must exist with product data
- `src/types/index.ts` must have `MerchProduct` interface

---

## Architecture Overview

```
MerchSection (wrapper)
├── Section header with title
├── Desktop view (≥768px): Grid of ProductCards
└── Mobile view (<768px): Carousel with ProductCards
    ├── Swipeable horizontal scroll
    ├── Navigation arrows
    └── Dot indicators

ProductCard (reusable)
├── Product image (primary/first image)
├── Product name
├── Price display
├── Category badge
└── Click handler → opens modal
```

---

## File 1: ProductCard Component

### 📁 File: `src/components/Merch/ProductCard.tsx`

**Action Required**: Create this new file.

**Complete File Content**:

```typescript
import React from 'react';
import type { MerchProduct } from '@/types';
import './ProductCard.css';

interface ProductCardProps {
  product: MerchProduct;
  onClick: (product: MerchProduct) => void;
}

/**
 * ProductCard Component
 * 
 * Displays a single merch product with image, name, price, and category.
 * Clicking the card opens the product detail modal.
 * 
 * @param product - The product data to display
 * @param onClick - Callback when card is clicked
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const handleClick = () => {
    onClick(product);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(product);
    }
  };

  // Format price with dollar sign and 2 decimals
  const formattedPrice = `$${product.price.toFixed(2)}`;

  // Get category display name
  const categoryLabels: Record<MerchProduct['category'], string> = {
    clothing: 'Apparel',
    music: 'Music',
    art: 'Art Print',
  };

  return (
    <div
      className="product-card"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${product.name}, ${formattedPrice}`}
    >
      {/* Category Badge */}
      <span className="product-card__category" aria-label={`Category: ${categoryLabels[product.category]}`}>
        {categoryLabels[product.category]}
      </span>

      {/* Product Image */}
      <div className="product-card__image-wrapper">
        <img
          src={product.images[0]}
          alt={product.name}
          className="product-card__image"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="product-card__info">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{formattedPrice}</p>
      </div>

      {/* Hover indicator */}
      <div className="product-card__overlay">
        <span className="product-card__cta">View Details</span>
      </div>
    </div>
  );
};

export default ProductCard;
```

---

## File 2: ProductCard Styles

### 📁 File: `src/components/Merch/ProductCard.css`

**Action Required**: Create this new file.

**Complete File Content**:

```css
/* ============================================================================
   PRODUCT CARD
   ============================================================================ */

.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-normal);
}

.product-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.product-card:focus-visible {
  outline: 2px solid var(--color-active);
  outline-offset: 2px;
}

.product-card:active {
  transform: translateY(-2px);
}

/* ============================================================================
   CATEGORY BADGE
   ============================================================================ */

.product-card__category {
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  z-index: 2;
  padding: var(--space-xs) var(--space-sm);
  background-color: rgba(0, 0, 0, 0.8);
  color: var(--color-accent);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  backdrop-filter: blur(4px);
}

/* ============================================================================
   IMAGE
   ============================================================================ */

.product-card__image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 2; /* Match 1:2 ratio of product images */
  overflow: hidden;
  background-color: var(--color-bg);
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.product-card:hover .product-card__image {
  transform: scale(1.05);
}

/* ============================================================================
   PRODUCT INFO
   ============================================================================ */

.product-card__info {
  padding: var(--space-md);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.product-card__name {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.3;
}

.product-card__price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  margin: 0;
}

/* ============================================================================
   HOVER OVERLAY
   ============================================================================ */

.product-card__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.7) 50%,
    transparent 100%
  );
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: var(--space-md);
  opacity: 0;
  transition: opacity var(--transition-normal);
  pointer-events: none;
}

.product-card:hover .product-card__overlay {
  opacity: 1;
}

.product-card__cta {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: var(--space-sm) var(--space-lg);
  border: 2px solid var(--color-accent);
  border-radius: var(--radius-md);
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  transform: translateY(10px);
  transition: transform var(--transition-normal);
}

.product-card:hover .product-card__cta {
  transform: translateY(0);
}

/* ============================================================================
   MOBILE ADJUSTMENTS
   ============================================================================ */

@media (max-width: 767px) {
  .product-card__info {
    padding: var(--space-sm);
  }

  .product-card__name {
    font-size: var(--font-size-sm);
  }

  .product-card__price {
    font-size: var(--font-size-base);
  }

  /* Simplify hover effects on mobile */
  .product-card:hover {
    transform: none;
  }

  .product-card__overlay {
    display: none; /* Hide overlay on mobile - tap to open instead */
  }
}
```

---

## File 3: MerchSection Component

### 📁 File: `src/components/Merch/MerchSection.tsx`

**Action Required**: Create this new file.

**Complete File Content**:

```typescript
import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import { MERCH_PRODUCTS } from '@/data/merchProducts';
import type { MerchProduct } from '@/types';
import './MerchSection.css';

/**
 * MerchSection Component
 * 
 * Displays merch products in a responsive layout:
 * - Desktop (≥768px): 2-column grid
 * - Mobile (<768px): Horizontal carousel with navigation
 * 
 * Clicking a product card will open the ProductModal (implemented in Part 3).
 */
const MerchSection: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<MerchProduct | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Mobile carousel navigation
  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;

    const cards = carouselRef.current.querySelectorAll('.product-card');
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setCurrentIndex(index);
    }
  };

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : MERCH_PRODUCTS.length - 1;
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < MERCH_PRODUCTS.length - 1 ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
  };

  // Track scroll position to update current index
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.querySelector('.product-card')?.clientWidth || 0;
      const gap = 16; // var(--space-md) = 16px
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setCurrentIndex(Math.min(index, MERCH_PRODUCTS.length - 1));
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  const handleProductClick = (product: MerchProduct) => {
    setSelectedProduct(product);
    // Modal will be opened in Part 3
    console.log('Product clicked:', product.name);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <section className="merch-section" aria-labelledby="merch-heading">
      <div className="merch-section__container">
        {/* Section Header */}
        <div className="merch-section__header">
          <h2 id="merch-heading" className="merch-section__title">
            Merch
          </h2>
          <p className="merch-section__subtitle">
            Official PRIMEAPE merchandise
          </p>
        </div>

        {/* Desktop Grid (≥768px) */}
        <div className="merch-section__grid">
          {MERCH_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={handleProductClick}
            />
          ))}
        </div>

        {/* Mobile Carousel (<768px) */}
        <div className="merch-section__carousel-wrapper">
          <div
            ref={carouselRef}
            className="merch-section__carousel"
            role="region"
            aria-label="Product carousel"
          >
            {MERCH_PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className="merch-section__nav merch-section__nav--prev"
            onClick={handlePrevious}
            aria-label="Previous product"
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
            className="merch-section__nav merch-section__nav--next"
            onClick={handleNext}
            aria-label="Next product"
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

          {/* Dot Indicators */}
          <div className="merch-section__indicators">
            {MERCH_PRODUCTS.map((_, index) => (
              <button
                key={index}
                className={`merch-section__indicator ${
                  index === currentIndex ? 'merch-section__indicator--active' : ''
                }`}
                onClick={() => scrollToIndex(index)}
                aria-label={`Go to product ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : 'false'}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ProductModal will be added in Part 3 */}
      {selectedProduct && (
        <div style={{ display: 'none' }}>
          {/* Placeholder for modal - will be replaced in Part 3 */}
          <p>Modal for {selectedProduct.name} will appear here</p>
        </div>
      )}
    </section>
  );
};

export default MerchSection;
```

---

## File 4: MerchSection Styles

### 📁 File: `src/components/Merch/MerchSection.css`

**Action Required**: Create this new file.

**Complete File Content**:

```css
/* ============================================================================
   MERCH SECTION
   ============================================================================ */

.merch-section {
  width: 100%;
  padding: var(--space-2xl) var(--space-md);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  transition: 
    background-color var(--transition-normal),
    border-color var(--transition-normal);
}

.merch-section__container {
  max-width: var(--player-max-width);
  margin: 0 auto;
}

/* ============================================================================
   HEADER
   ============================================================================ */

.merch-section__header {
  text-align: center;
  margin-bottom: var(--space-2xl);
}

.merch-section__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--space-sm) 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.merch-section__subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

/* ============================================================================
   DESKTOP GRID (≥768px)
   ============================================================================ */

.merch-section__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
}

/* ============================================================================
   MOBILE CAROUSEL (<768px)
   ============================================================================ */

.merch-section__carousel-wrapper {
  display: none; /* Hidden on desktop */
  position: relative;
}

.merch-section__carousel {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  padding: var(--space-sm) 0;
}

.merch-section__carousel::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.merch-section__carousel .product-card {
  flex: 0 0 85%; /* Each card takes 85% of viewport width */
  max-width: 400px;
  scroll-snap-align: center;
}

/* ============================================================================
   NAVIGATION ARROWS
   ============================================================================ */

.merch-section__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  border: 2px solid var(--color-accent);
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all var(--transition-fast);
  backdrop-filter: blur(4px);
}

.merch-section__nav:hover {
  background-color: var(--color-accent);
  border-color: var(--color-hover);
  transform: translateY(-50%) scale(1.1);
}

.merch-section__nav:active {
  transform: translateY(-50%) scale(0.95);
}

.merch-section__nav--prev {
  left: var(--space-sm);
}

.merch-section__nav--next {
  right: var(--space-sm);
}

.merch-section__nav svg {
  width: 24px;
  height: 24px;
}

/* ============================================================================
   DOT INDICATORS
   ============================================================================ */

.merch-section__indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-lg);
}

.merch-section__indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-border);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
}

.merch-section__indicator--active {
  background-color: var(--color-accent);
  width: 24px;
  border-radius: 4px;
}

.merch-section__indicator:hover {
  background-color: var(--color-accent);
  opacity: 0.7;
}

/* ============================================================================
   RESPONSIVE BREAKPOINTS
   ============================================================================ */

/* Tablet: Show 2 columns but smaller gap */
@media (max-width: 1024px) {
  .merch-section__grid {
    gap: var(--space-lg);
  }
}

/* Mobile: Switch to carousel */
@media (max-width: 767px) {
  .merch-section {
    padding: var(--space-xl) 0;
  }

  .merch-section__header {
    padding: 0 var(--space-md);
    margin-bottom: var(--space-xl);
  }

  .merch-section__title {
    font-size: var(--font-size-2xl);
  }

  .merch-section__grid {
    display: none; /* Hide grid on mobile */
  }

  .merch-section__carousel-wrapper {
    display: block; /* Show carousel on mobile */
  }
}
```

---

## Integration Instructions

This component will be integrated into the app in Part 5, but here's a preview of where it will go:

### Location: Between AboutSection and ShowsSection

The integration will happen in `src/components/ContentSections/ContentSections.tsx`:

```typescript
// Future integration (Part 5):
import MerchSection from '../Merch/MerchSection';

// In the render:
<AboutSection />
<MerchSection />  {/* ← New */}
<ShowsSection onBookMeClick={handleBookMeClick} />
```

---

## Technical Notes

### Mobile Carousel Implementation
- **Scroll snapping**: Each card snaps to center when scrolling
- **Touch gestures**: Native browser swipe support via `overflow-x: scroll`
- **Arrow navigation**: Programmatic scrolling with smooth animation
- **Dot indicators**: Visual feedback of current position
- **Auto-tracking**: Scroll event listener updates current index

### Responsive Strategy
- **Desktop (≥768px)**: CSS Grid with 2 columns
- **Mobile (<768px)**: Flexbox horizontal carousel
- **Media query toggle**: Grid hidden on mobile, carousel hidden on desktop
- **No JavaScript breakpoint detection**: Pure CSS responsive design

### Accessibility Features
- **Keyboard navigation**: All interactive elements are focusable
- **ARIA labels**: Navigation buttons and indicators have descriptive labels
- **Role attributes**: Carousel has `role="region"` for screen readers
- **Focus visible**: Outline on keyboard focus (`:focus-visible`)
- **Semantic HTML**: Proper heading hierarchy and section landmarks

### Performance Considerations
- **Lazy loading**: Product images use `loading="lazy"` attribute
- **Smooth scrolling**: Hardware-accelerated CSS transitions
- **Event listener cleanup**: useEffect cleanup prevents memory leaks
- **Minimal re-renders**: useState only updates on actual scroll events

---

## Validation Checklist

After completing this part, verify:

- [ ] TypeScript compiles without errors
- [ ] `ProductCard.tsx` displays product image, name, price, category
- [ ] `ProductCard.css` provides hover effects and responsive styling
- [ ] `MerchSection.tsx` renders all 4 products
- [ ] Desktop view shows 2-column grid
- [ ] Mobile view (resize browser <768px) shows carousel
- [ ] Mobile carousel allows swiping left/right
- [ ] Navigation arrows work on mobile
- [ ] Dot indicators update as you scroll
- [ ] Clicking a product card logs to console
- [ ] All images load from placeholder service
- [ ] Keyboard navigation works (Tab, Enter, Space)

---

## Testing Instructions

### Desktop Testing (≥768px)
1. Open browser at full width
2. Verify 2-column grid layout
3. Hover over cards to see scale animation and "View Details" CTA
4. Click cards to verify console log
5. Tab through cards with keyboard
6. Press Enter/Space to activate cards

### Mobile Testing (<768px)
1. Resize browser to <768px width or use device emulator
2. Verify carousel displays with one card centered
3. Swipe left/right to navigate
4. Click arrow buttons to navigate
5. Verify dot indicators update with scroll
6. Tap directly on dot indicators to jump to product
7. Verify cards are still clickable in carousel mode

---

## Next Steps

Once this part is complete and validated:
1. Proceed to **Part 3** to build the ProductModal with image carousel
2. The `selectedProduct` state is already set up for modal integration
3. The `handleCloseModal` function is ready to be passed to the modal

---

## Common Issues & Solutions

### Issue: Carousel not scrolling smoothly on mobile
**Solution**: Ensure `-webkit-overflow-scrolling: touch` is applied to `.merch-section__carousel`

### Issue: Cards not snapping to center
**Solution**: Verify `scroll-snap-type: x mandatory` and `scroll-snap-align: center` are applied

### Issue: Navigation arrows not visible
**Solution**: Check z-index and positioning. Arrows should be `position: absolute` with high z-index

### Issue: Grid columns not equal width
**Solution**: Ensure `grid-template-columns: repeat(2, 1fr)` is applied to `.merch-section__grid`

### Issue: Hover effects not working
**Solution**: Check CSS specificity and ensure transitions are defined on base class

### Issue: Images not loading
**Solution**: Check placeholder URLs - they should be accessible without CORS issues
