import { useState, useEffect } from "react";

export default function ProductQuickViewModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isFavorite = false,
  onToggleWishlist,
  cartQuantity = 0,
}) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [product.thumbnail];

  const handleAdd = () => {
    setAdded(true);
    onAddToCart && onAddToCart(product, quantity);
    setTimeout(() => setAdded(false), 1500);
  };

  const originalPrice = product.discountPercentage > 0
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div className="esoo-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="esoo-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Floating Close Button */}
        <button
          className="esoo-modal-close-btn"
          onClick={onClose}
          aria-label="إغلاق النافذة"
          title="إغلاق (Esc)"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="esoo-modal-grid">
          {/* 1. Image Gallery Column */}
          <div className="modal-gallery-col">
            <div className="modal-main-image-wrap">
              {/* Wishlist Heart Button Floating on Image */}
              <button
                className={`modal-img-wishlist-btn ${isFavorite ? "active" : ""}`}
                onClick={() => onToggleWishlist && onToggleWishlist(product)}
                title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                aria-label="Wishlist"
              >
                <i className={isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
              </button>

              <img
                src={images[selectedImageIndex] || product.thumbnail}
                alt={product.title}
                className="modal-main-image"
              />

              {product.discountPercentage > 5 && (
                <span className="modal-discount-pill">
                  خصم {Math.round(product.discountPercentage)}%
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="modal-thumb-strip">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`modal-thumb-btn ${selectedImageIndex === idx ? "active" : ""}`}
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Product Details Column */}
          <div className="modal-info-col">
            {/* Category & Brand Badges */}
            <div className="modal-top-tags">
              {product.brand && <span className="modal-brand-tag">{product.brand}</span>}
              <span className="modal-cat-tag">{product.category}</span>
              {product.stock === 0 ? (
                <span className="modal-stock-badge out">
                  <i className="fa-solid fa-circle-xmark"></i> غير متاح (نفد من المخزون)
                </span>
              ) : product.stock <= 5 ? (
                <span className="modal-stock-badge low">
                  <i className="fa-solid fa-fire"></i> أوشك على النفاد (متبقي {product.stock} فقط!)
                </span>
              ) : (
                <span className="modal-stock-badge in">
                  <i className="fa-solid fa-circle-check"></i> متاح في المخزون ({product.stock} قطعة)
                </span>
              )}
            </div>

            {/* Product Title */}
            <h2 className="modal-product-title">{product.title}</h2>

            {/* Rating & Reviews */}
            <div className="modal-rating-row">
              <div className="modal-rating-badge">
                <span>{product.rating?.toFixed(1) || "4.5"}</span>
                <i className="fa-solid fa-star"></i>
              </div>
              <span className="modal-reviews-count">
                ({product.reviews?.length || 5} تقييمات موثقة من المشترين)
              </span>
            </div>

            {/* Price Box */}
            <div className="modal-price-box">
              <div className="modal-price-main-group">
                <div className="modal-current-price">
                  <span className="currency">ج.م</span>
                  <span className="amount">{product.price}</span>
                </div>
                {originalPrice && (
                  <span className="modal-original-price">{originalPrice} ج.م</span>
                )}
                {product.discountPercentage > 5 && (
                  <span className="modal-save-tag">
                    وفر {(originalPrice - product.price).toFixed(2)} ج.م
                  </span>
                )}
              </div>
              <div className="modal-vat-notice">
                <i className="fa-solid fa-circle-info"></i>
                <span>السعر شامل ضريبة القيمة المضافة</span>
              </div>
            </div>

            {/* Product Description */}
            <div className="modal-desc-box">
              <p className="modal-desc">{product.description}</p>
            </div>

            {/* Value Guarantees / Features Chips */}
            <div className="modal-features-chips">
              <div className="modal-chip-item">
                <i className="fa-solid fa-shield-halved"></i>
                <div>
                  <strong>ضمان أصلي 100%</strong>
                  <p>منتج مضمون بجودة عالية</p>
                </div>
              </div>

              <div className="modal-chip-item">
                <i className="fa-solid fa-truck-fast"></i>
                <div>
                  <strong>شحن فوري إكسبريس</strong>
                  <p>توصيل سريع مجاني غداً</p>
                </div>
              </div>

              <div className="modal-chip-item">
                <i className="fa-solid fa-arrow-rotate-left"></i>
                <div>
                  <strong>إرجاع واستبدال مجاني</strong>
                  <p>خلال 40 - 50 دقيقة بكل سهولة</p>
                </div>
              </div>
            </div>

            {/* Purchase Controls Row */}
            <div className="modal-purchase-footer">
              {product.stock === 0 ? (
                <button className="modal-out-of-stock-btn" disabled>
                  <i className="fa-solid fa-ban"></i>
                  <span>المنتج غير متاح حالياً (نفد من المخزون)</span>
                </button>
              ) : (
                <>
                  <div className="quantity-control-wrap">
                    <span className="qty-label">الكمية:</span>
                    <div className="quantity-control">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <span className="qty-number">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                        disabled={quantity >= (product.stock || 1)}
                        aria-label="Increase quantity"
                        title={quantity >= (product.stock || 1) ? `أقصى كمية متاحة بالمخزون هي ${product.stock}` : ""}
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>

                  <div className="modal-actions-buttons">
                    <button
                      className={`modal-add-cart-btn ${added || cartQuantity > 0 ? "added" : ""}`}
                      onClick={handleAdd}
                    >
                      <i className={added || cartQuantity > 0 ? "fa-solid fa-circle-check" : "fa-solid fa-cart-plus"}></i>
                      <span>
                        {added
                          ? "تمت الإضافة بنجاح! ✓"
                          : cartQuantity > 0
                          ? `مضاف في السلة (${cartQuantity}) - أضف المزيد +`
                          : "أضف للسلة"}
                      </span>
                    </button>

                    <button
                      className="modal-buy-now-btn"
                      onClick={() => {
                        onBuyNow && onBuyNow(product, quantity);
                        onClose();
                      }}
                    >
                      <i className="fa-solid fa-bolt"></i>
                      <span>شراء الآن</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
