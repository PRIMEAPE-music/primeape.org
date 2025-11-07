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
