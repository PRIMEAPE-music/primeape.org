import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import PurchaseConfirmationModal from './PurchaseConfirmationModal';
import { MERCH_PRODUCTS } from '@/data/merchProducts';
import type { MerchProduct, SelectedProductOptions } from '@/types';
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
  const [purchaseConfirmation, setPurchaseConfirmation] = useState<{
    product: MerchProduct;
    options: SelectedProductOptions;
  } | null>(null);
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
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

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

export default MerchSection;
