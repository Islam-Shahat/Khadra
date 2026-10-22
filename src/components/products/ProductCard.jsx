import { useState } from "react";

export default function ProductCard({
  product,
  onQuickView,
  onAddToCart,
  onBuyNow,
  isFavorite = false,
  onToggleWishlist,
  cartQuantity = 0,
  onUpdateQuantity,
}) {
  const [added, setAdded] = useState(false);

  const {
    id,
    title,
    price,
    discountPercentage,
    rating,
    brand,
    thumbnail,
    shippingInformation,
    stock = 0,
  } = product;

  // Realistically alternate delivery: Some express, some standard
  const isExpress = shippingInformation
    ? shippingInformation.includes("1") || shippingInformation.includes("overnight") || id % 2 === 0
    : id % 2 === 0;

  // Calculate original price if discount exists
  const originalPrice = discountPercentage > 0
    ? (price / (1 - discountPercentage / 100)).toFixed(2)
    : null;

  const handleAddToCartClick = (e) => {
    e.stopPropagation();
    setAdded(true);
    onAddToCart && onAddToCart(product);
  };

  const handleBuyNowClick = (e) => {
    e.stopPropagation();
    onBuyNow && onBuyNow(product);
  };

  const handleOpenQuickView = (e) => {
    e.stopPropagation();
    onQuickView && onQuickView(product);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    onToggleWishlist && onToggleWishlist(product);
  };

  return (
    <article className="noon-product-card" onClick={handleOpenQuickView}>
      {/* Wishlist toggle */}
      <button
        className={`noon-wishlist-btn ${isFavorite ? "active" : ""}`}
        onClick={handleWishlistClick}
        title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
        aria-label="Wishlist"
      >
        <i className={isFavorite ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
      </button>

      {/* Image container */}
      <div className={`noon-card-img-box ${stock === 0 ? "out-of-stock" : ""}`}>
        <img
          src={thumbnail}
          alt={title}
          loading="lazy"
          className="noon-card-img"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/300x300/f7f7fa/7e859b?text=esoo+product";
          }}
        />

        {stock === 0 && (
          <span className="noon-sold-out-badge">
            <i className="fa-solid fa-ban"></i> نفد من المخزون
          </span>
        )}

        {/* Quick View Hover Button */}
        <button
          className="noon-card-quick-btn"
          onClick={handleOpenQuickView}
          title="معاينة سريعة"
        >
          <i className="fa-regular fa-eye"></i>
          <span>معاينة سريعة</span>
        </button>

        {discountPercentage > 5 && stock > 0 && (
          <span className="noon-discount-badge">
            خصم {Math.round(discountPercentage)}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="noon-card-body">
        {brand && <span className="noon-card-brand">{brand}</span>}
        <h3 className="noon-card-title" title={title}>
          {title}
        </h3>

        {/* Price Section */}
        <div className="noon-price-row">
          <div className="noon-main-price">
            <span className="noon-currency">ج.م</span>
            <span className="noon-amount">{price}</span>
          </div>
          {originalPrice && (
            <span className="noon-old-price">{originalPrice} ج.م</span>
          )}
        </div>

        {/* Rating and Express Badge Row */}
        <div className="noon-badges-row">
          <div className="noon-rating-pill">
            <span className="rating-num">{rating?.toFixed(1) || "4.5"}</span>
            <i className="fa-solid fa-star rating-star"></i>
            <span className="rating-count">({Math.floor((rating || 4) * 23)})</span>
          </div>

          {/* Only show express tag for express eligible items */}
          {isExpress && stock > 0 && (
            <div className="noon-express-tag" title="توصيل خضرة إكسبريس (KHADRA Express)">
              <span className="express-text">express</span>
            </div>
          )}
        </div>

        {/* Stock Status & Quantity Indicator */}
        <div className="noon-stock-status-row">
          {stock === 0 ? (
            <span className="noon-stock-status out">
              <i className="fa-solid fa-circle-xmark"></i>
              غير متاح (نفد من المخزون)
            </span>
          ) : stock <= 10 ? (
            <span className="noon-stock-status low">
              <i className="fa-solid fa-fire"></i>
              أوشك على النفاد (متبقي {stock} فقط!)
            </span>
          ) : (
            <span className="noon-stock-status in">
              <i className="fa-solid fa-circle-check"></i>
              متاح بالمخزون ({stock} قطعة)
            </span>
          )}
        </div>

        {/* Shipping notice */}
        {stock > 0 && (
          isExpress ? (
            <div className="noon-delivery-text express">
              <i className="fa-solid fa-bolt delivery-icon"></i>
              <span>توصيل سريع مجاني غداً</span>
            </div>
          ) : (
            <div className="noon-delivery-text standard">
              <i className="fa-solid fa-truck delivery-icon"></i>
              <span>توصيل عادي (3 - 5 أيام)</span>
            </div>
          )
        )}

        {/* Actions Row */}
        <div className="noon-card-actions-row">
          {stock === 0 ? (
            <button className="noon-out-of-stock-btn" disabled title="هذا المنتج غير متوفر حالياً">
              <i className="fa-solid fa-ban"></i>
              <span>نفد من المخزون</span>
            </button>
          ) : cartQuantity > 0 ? (
            <div className="noon-card-stepper" onClick={(e) => e.stopPropagation()}>
              <button
                className="noon-stepper-btn"
                onClick={() => onUpdateQuantity && onUpdateQuantity(product.id, cartQuantity - 1)}
                title="إنقاص الكمية"
                aria-label="إنقاص الكمية"
              >
                <i className="fa-solid fa-minus"></i>
              </button>

              <span className="noon-stepper-text">
                <i className="fa-solid fa-check"></i>
                في السلة ({cartQuantity})
              </span>

              <button
                className="noon-stepper-btn"
                onClick={() => onUpdateQuantity && onUpdateQuantity(product.id, cartQuantity + 1)}
                disabled={cartQuantity >= stock}
                title={cartQuantity >= stock ? `الحد الأقصى المتاح (${stock})` : "زيادة الكمية"}
                aria-label="زيادة الكمية"
              >
                <i className="fa-solid fa-plus"></i>
              </button>
            </div>
          ) : (
            <button
              className="noon-add-cart-btn"
              onClick={handleAddToCartClick}
              title="إضافة إلى السلة"
            >
              <i className="fa-solid fa-cart-plus"></i>
              <span>أضف للسلة</span>
            </button>
          )}

          {stock > 0 && (
            <button
              className="noon-buy-now-btn"
              onClick={handleBuyNowClick}
              title="شراء فوري والانتقال للسلة"
            >
              <i className="fa-solid fa-bolt"></i>
              <span>شراء الآن</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
