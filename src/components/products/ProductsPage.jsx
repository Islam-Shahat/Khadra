import React from "react";
import FlashDealBanner from "./FlashDealBanner";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";

export default function ProductsPage({
  products,
  totalProducts,
  totalPages,
  currentPage,
  itemsPerPage,
  loading,
  error,
  searchQuery,
  selectedCategory,
  onPageChange,
  onRefresh,
  onResetSearch,
  onQuickView,
  onAddToCart,
  onBuyNow,
  cart = [],
  wishlist = [],
  onToggleWishlist,
  onUpdateQuantity,
}) {
  const getCategoryTitle = () => {
    if (searchQuery.trim()) {
      return `نتائج البحث عن: "${searchQuery}"`;
    }
    switch (selectedCategory) {
      case "fruity":
        return "قسم الخضروات الثمرية (طماطم، خيار، فلفل)";
      case "leafy":
        return "قسم الورقيات الطازجة والسلطة";
      case "roots":
        return "قسم الجذور والدرنات (بطاطس، بصل، جزر)";
      case "organic":
        return "قسم الخضار العضوي وبكجات التوفير";
      default:
        return "جميع الخضروات الطازجة في خضرة (KHADRA)";
    }
  };

  return (
    <div className="noon-products-page-container">
      {/* 1. Flash Deals Announcement Strip */}
      <FlashDealBanner />

      {/* 2. Main Catalog Section */}
      <main className="noon-main-container">
        {/* Section Header Strip */}
        <div className="noon-section-header">
          <div className="noon-title-area">
            <h1 className="noon-section-title">
              <i className="fa-solid fa-boxes-stacked" style={{ color: "#000", marginLeft: "8px" }}></i>
              {getCategoryTitle()}
            </h1>
            <span className="noon-items-pill">
              {totalProducts} منتج متوفر
            </span>
          </div>

          {/* Minimal Controls */}
          <div className="noon-minimal-controls">
            <button
              className="noon-icon-tool-btn"
              onClick={onRefresh}
              title="تحديث قائمة المنتجات"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Error Banner */}
        {!loading && error && (
          <div className="noon-error-box">
            <i className="fa-solid fa-circle-exclamation" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}></i>
            <p>{error}</p>
            <button className="noon-btn-primary" onClick={onRefresh}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <EmptyState
            onRefresh={onRefresh}
            onResetSearch={onResetSearch}
          />
        )}

        {/* Products Grid (12 items per page) */}
        {!loading && !error && products.length > 0 && (
          <>
            <section className="noon-products-grid">
              {products.map((product) => {
                const isFav = wishlist.some((w) => w.id === product.id);
                const cartItem = cart.find((item) => item.id === product.id);
                const cartQty = cartItem ? cartItem.quantity : 0;

                return (
                  <ProductCard
                    key={`catalog-${product.id}`}
                    product={product}
                    onQuickView={onQuickView}
                    onAddToCart={onAddToCart}
                    onBuyNow={onBuyNow}
                    isFavorite={isFav}
                    onToggleWishlist={onToggleWishlist}
                    cartQuantity={cartQty}
                    onUpdateQuantity={onUpdateQuantity}
                  />
                );
              })}
            </section>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages || Math.ceil((totalProducts || 0) / (itemsPerPage || 12)) || 1}
              totalItems={totalProducts}
              itemsPerPage={itemsPerPage}
              onPageChange={onPageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}
