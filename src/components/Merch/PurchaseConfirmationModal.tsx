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
