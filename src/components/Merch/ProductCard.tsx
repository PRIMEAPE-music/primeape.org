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
