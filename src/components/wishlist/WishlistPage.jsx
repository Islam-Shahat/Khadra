import { useState } from "react";
import ConfirmModal from "../common/ConfirmModal";
import "./Wishlist.css";

export default function WishlistPage({
  wishlist = [],
  cart = [],
  onRemoveFromWishlist,
  onClearWishlist,
  onAddToCart,
  onBuyNow,
  onBackToShopping,
  onQuickView,
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  return (
    <div className="esoo-wishlist-page-wrapper">
      <div className="esoo-wishlist-container">
        {/* Top Navigation Bar with Back & Clear Buttons */}
        <div className="wishlist-top-bar">
          <button
            className="wishlist-back-btn"
            onClick={onBackToShopping}
            title="العودة لصفحة المنتجات"
          >
            <i className="fa-solid fa-arrow-right"></i>
            <span>العودة لمتابعة التسوق</span>
          </button>

          {wishlist.length > 0 && (
            <button
              className="wishlist-clear-all-btn"
              onClick={() => setShowClearConfirm(true)}
              title="تفريغ قائمة المفضلة"
            >
              <i className="fa-regular fa-trash-can"></i>
              <span>حذف كل المفضلة ({wishlist.length})</span>
            </button>
          )}
        </div>

        {/* 1. Empty State */}
        {wishlist.length === 0 ? (
          <div className="wishlist-empty-box">
            <div className="wishlist-empty-icon-wrap">
              <i className="fa-regular fa-heart"></i>
            </div>
            <h2 className="wishlist-empty-title">قائمة المفضلة فارغة</h2>
            <p className="wishlist-empty-desc">
              لم تقم بإضافة أي منتجات إلى قائمة أمنياتك حتى الآن. تصفح أحدث المنتجات واضغط على علامة القلب لحفظ ما يعجبك!
            </p>
            <button className="wishlist-start-shopping-btn" onClick={onBackToShopping}>
              <i className="fa-solid fa-bag-shopping" style={{ marginLeft: "8px" }}></i>
              ابدأ التسوق واستكشف العروض
            </button>
          </div>
        ) : (
          /* 2. Active Wishlist Layout */
          <div className="wishlist-content-area">
            <div className="wishlist-header-info">
              <h1 className="wishlist-page-title">
                <i className="fa-solid fa-heart" style={{ color: "#dc2626", marginLeft: "10px" }}></i>
                قائمة المفضلة والأمنيات
                <span className="wishlist-count-badge">({wishlist.length} منتج)</span>
              </h1>
              <p className="wishlist-page-subtitle">
                المنتجات التي قمت بحفظها. يمكنك نقلها للسلة أو الشراء فوراً في أي وقت.
              </p>
            </div>

            {/* Grid of Wishlist Cards */}
            <div className="wishlist-grid">
              {wishlist.map((item) => {
                const isExpress = item.shippingInformation
                  ? item.shippingInformation.includes("1") || item.shippingInformation.includes("overnight") || item.id % 2 === 0
                  : item.id % 2 === 0;

                const originalPrice = item.discountPercentage > 0
                  ? (item.price / (1 - item.discountPercentage / 100)).toFixed(2)
                  : null;

                return (
                  <article key={item.id} className="wishlist-card">
                    {/* Delete button from Wishlist */}
                    <button
                      className="wishlist-item-delete-btn"
                      onClick={() => onRemoveFromWishlist(item.id)}
                      title="إزالة من المفضلة"
                      aria-label="Remove from wishlist"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>

                    {/* Image Box */}
                    <div
                      className="wishlist-card-img-wrap"
                      onClick={() => onQuickView && onQuickView(item)}
                      title="معاينة المنتج"
                    >
                      <img src={item.thumbnail} alt={item.title} />
                      {item.discountPercentage > 5 && (
                        <span className="wishlist-discount-pill">
                          خصم {Math.round(item.discountPercentage)}%
                        </span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="wishlist-card-body">
                      {item.brand && <span className="wishlist-card-brand">{item.brand}</span>}
                      <h3
                        className="wishlist-card-title"
                        onClick={() => onQuickView && onQuickView(item)}
                        title={item.title}
                      >
                        {item.title}
                      </h3>

                      {/* Price Row */}
                      <div className="wishlist-price-row">
                        <div className="wishlist-main-price">
                          <span className="wishlist-curr">ج.م</span>
                          <span className="wishlist-amount">{item.price}</span>
                        </div>
                        {originalPrice && (
                          <span className="wishlist-old-price">{originalPrice} ج.م</span>
                        )}
                      </div>

                      {/* Delivery badge */}
                      {isExpress ? (
                        <div className="wishlist-delivery-tag express">
                          <span className="express-pill">express</span>
                          <span>توصيل سريع مجاني غداً</span>
                        </div>
                      ) : (
                        <div className="wishlist-delivery-tag standard">
                          <i className="fa-solid fa-truck" style={{ marginLeft: "4px" }}></i>
                          <span>توصيل عادي (3 - 5 أيام)</span>
                        </div>
                      )}

                      {/* Stock availability */}
                      {item.stock !== undefined && (
                        <div className="wishlist-stock-row">
                          {item.stock === 0 ? (
                            <span className="wishlist-stock-tag out">
                              <i className="fa-solid fa-circle-xmark"></i> نفد من المخزون
                            </span>
                          ) : item.stock <= 5 ? (
                            <span className="wishlist-stock-tag low">
                              <i className="fa-solid fa-fire"></i> متبقي {item.stock} فقط بالمخزون!
                            </span>
                          ) : (
                            <span className="wishlist-stock-tag in">
                              <i className="fa-solid fa-circle-check"></i> متوفر ({item.stock} قطعة)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="wishlist-actions-row">
                        {(() => {
                          const inCart = cart.some((c) => c.id === item.id);
                          return (
                            <button
                              className={`wishlist-add-cart-btn ${inCart ? "in-cart" : ""}`}
                              onClick={() => onAddToCart && onAddToCart(item)}
                              title={inCart ? "المنتج مضاف بالسلة - اضغط لإضافة المزيد" : "إضافة للسلة"}
                            >
                              <i className={inCart ? "fa-solid fa-circle-check" : "fa-solid fa-cart-plus"}></i>
                              <span>{inCart ? "مضاف بالسلة ✓" : "أضف للسلة"}</span>
                            </button>
                          );
                        })()}

                        <button
                          className="wishlist-buy-now-btn"
                          onClick={() => onBuyNow && onBuyNow(item)}
                          title="شراء فوري الآن"
                        >
                          <i className="fa-solid fa-bolt"></i>
                          <span>شراء الآن</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Professional Confirmation Modal for Clearing Wishlist */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="تفريغ قائمة المفضلة"
        message="هل أنت متأكد من رغبتك في حذف جميع المنتجات من قائمة المفضلة؟"
        subMessage={`سيتم إزالة (${wishlist.length}) منتج من قائمة أمنياتك.`}
        confirmText="نعم، حذف كل المفضلة"
        cancelText="إلغاء والتراجع"
        confirmType="danger"
        confirmIcon="fa-solid fa-trash-can"
        onConfirm={() => {
          onClearWishlist();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
