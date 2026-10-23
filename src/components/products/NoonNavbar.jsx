import { useState } from "react";
import EsooLogo from "./EsooLogo";
import { VEGETABLE_CATEGORIES } from "../../data/vegetablesData";

export default function NoonNavbar({
  categories = VEGETABLE_CATEGORIES,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  selectedCategory,
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onGoHome,
  onGoProducts,
  currentView = "home",
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Filter out 'all' from subnav loop since 'all' is explicitly rendered first
  const displayCategories = categories.filter((cat) => cat.id !== "all");

  const handleLogoClick = () => {
    onGoHome && onGoHome();
    setIsMenuOpen(false);
  };

  return (
    <header className="noon-header">
      {/* Main Top Bar */}
      <div className="noon-top-bar">
        <div className="noon-top-bar-inner">
          {/* 1. Brand Section (Right in RTL): Hamburger (Mobile only) + Logo */}
          <div className="noon-brand-section">
            <button
              className="noon-hamburger-btn"
              onClick={() => setIsMenuOpen(true)}
              title="القائمة الرئيسية"
              aria-label="القائمة الرئيسية"
            >
              <i className="fa-solid fa-bars"></i>
            </button>

            <div onClick={handleLogoClick} className="esoo-logo-clickable" title="الصفحة الرئيسية">
              <EsooLogo />
            </div>
          </div>

          {/* 2. Main Page Navigation Tabs: الرئيسية & المنتجات */}
          <nav className="noon-main-pages-nav" aria-label="الصفحات الرئيسية">
            <button
              className={`noon-page-nav-btn ${currentView === "home" ? "active" : ""}`}
              onClick={onGoHome}
              title="الانتقال إلى الصفحة الرئيسية"
            >
              <i className="fa-solid fa-house"></i>
              <span>الرئيسية</span>
            </button>

            <button
              className={`noon-page-nav-btn ${currentView === "products" ? "active" : ""}`}
              onClick={onGoProducts}
              title="الانتقال إلى صفحة المنتجات"
            >
              <i className="fa-solid fa-store"></i>
              <span>المنتجات</span>
            </button>
          </nav>

          {/* 3. Search Bar in the Middle */}
          <div className="noon-search-wrapper">
            <i className="fa-solid fa-magnifying-glass noon-search-icon"></i>
            <input
              type="text"
              className="noon-search-input"
              placeholder="ابحث عن الخضروات، الورقيات، وبوكسات التوفير في خضرة..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                className="noon-search-clear"
                onClick={() => onSearchChange("")}
                title="مسح البحث"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* 4. User, Wishlist & Cart Actions (Left in RTL) */}
          <div className="noon-user-actions">
            {/* User Login */}
            <button className="noon-action-btn" title="تسجيل الدخول">
              <i className="fa-regular fa-user action-icon"></i>
              <span className="action-text">دخول</span>
            </button>

            {/* Wishlist / Favorites */}
            <button
              className="noon-action-btn noon-wishlist-nav-btn"
              onClick={onOpenWishlist}
              title="قائمة المفضلة"
            >
              <div className="nav-icon-badge-wrapper">
                <i className="fa-regular fa-heart action-icon"></i>
                {wishlistCount > 0 && (
                  <span className="nav-badge wishlist-badge">{wishlistCount}</span>
                )}
              </div>
              <span className="action-text">المفضلة</span>
            </button>

            {/* Dynamic Cart */}
            <button
              className="noon-action-btn noon-cart-btn"
              onClick={onOpenCart}
              title="فتح عربة التسوق"
            >
              <div className="nav-icon-badge-wrapper">
                <i className="fa-solid fa-cart-shopping action-icon"></i>
                <span className="nav-badge cart-badge">{cartCount}</span>
              </div>
              <span className="action-text">السلة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slim Category Bar (PC and Mobile Horizontal Scroll) */}
      <nav className="noon-subnav">
        <div className="noon-subnav-inner">
          <div className="noon-cat-links">
            <span className="noon-cat-lead-icon" title="أقسام الخضار">
              <i className="fa-solid fa-seedling"></i>
            </span>

            {/* Mobile-only Home Button in subnav */}
            <button
              className={`noon-cat-link mobile-subnav-home-btn ${
                currentView === "home" ? "active" : ""
              }`}
              onClick={onGoHome}
            >
              <i className="fa-solid fa-house" style={{ marginLeft: "4px" }}></i>
              الرئيسية
            </button>

            {/* All Products / All Categories Button */}
            <button
              className={`noon-cat-link ${
                currentView === "products" && selectedCategory === "all" ? "active" : ""
              }`}
              onClick={() => {
                onSelectCategory && onSelectCategory("all");
                onGoProducts && onGoProducts();
              }}
            >
              كل الخضروات
            </button>

            {displayCategories.map((cat) => {
              const isBox = cat.id === "weekly_box";
              const isActive = currentView === "products" && selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  className={`noon-cat-link ${isBox ? "noon-cat-link-featured" : ""} ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() => {
                    onSelectCategory && onSelectCategory(cat.id);
                    onGoProducts && onGoProducts();
                  }}
                >
                  {isBox && (
                    <i className="fa-solid fa-box-archive" style={{ marginLeft: "5px" }}></i>
                  )}
                  {cat.label}
                  {isBox && <span className="cat-special-badge">وفر 35%</span>}
                </button>
              );
            })}
          </div>

          <div className="noon-express-promo">
            <span className="noon-express-pill">express</span>
            <span>
              <i className="fa-solid fa-bolt" style={{ color: "#eab308", marginLeft: "4px" }}></i>
              توصيل سريع ومجاني
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-in Drawer (Hamburger Menu) */}
      {isMenuOpen && (
        <div
          className="noon-mobile-drawer-backdrop"
          onClick={() => setIsMenuOpen(false)}
        >
          <aside
            className="noon-mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="drawer-header">
              <div onClick={handleLogoClick}>
                <EsooLogo />
              </div>
              <button
                className="drawer-close-btn"
                onClick={() => setIsMenuOpen(false)}
                title="إغلاق القائمة"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* User Greeting Card */}
            <div className="drawer-user-card">
              <div className="drawer-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="drawer-user-info">
                <strong>مرحباً بك في خضرة | KHADRA</strong>
                <p>تسجيل الدخول / إنشاء حساب</p>
              </div>
            </div>

            {/* Quick Actions (Cart & Wishlist) inside drawer */}
            <div className="drawer-quick-actions">
              <button
                className="drawer-action-btn"
                onClick={() => {
                  onOpenCart && onOpenCart();
                  setIsMenuOpen(false);
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <i className="fa-solid fa-cart-shopping"></i>
                  <span>عربة التسوق</span>
                </div>
                <span className="drawer-badge">{cartCount}</span>
              </button>

              <button
                className="drawer-action-btn wishlist"
                onClick={() => {
                  onOpenWishlist && onOpenWishlist();
                  setIsMenuOpen(false);
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <i className="fa-solid fa-heart" style={{ color: "#dc2626" }}></i>
                  <span>المفضلة</span>
                </div>
                <span className="drawer-badge wishlist-badge">{wishlistCount}</span>
              </button>
            </div>

            {/* Categories Section */}
            <div className="drawer-section-title">
              <i className="fa-solid fa-layer-group" style={{ marginLeft: "6px" }}></i>
              الأقسام والفئات
            </div>
            <nav className="drawer-categories-list">
              <button
                className={`drawer-cat-item ${currentView === "home" ? "active" : ""}`}
                onClick={() => {
                  onGoHome && onGoHome();
                  setIsMenuOpen(false);
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <i className="fa-solid fa-house" style={{ color: "#000" }}></i>
                  <span className="cat-name">الرئيسية</span>
                </div>
                <i className="fa-solid fa-chevron-left arrow-icon"></i>
              </button>

              <button
                className={`drawer-cat-item ${
                  currentView === "products" && selectedCategory === "all" ? "active" : ""
                }`}
                onClick={() => {
                  onSelectCategory && onSelectCategory("all");
                  onGoProducts && onGoProducts();
                  setIsMenuOpen(false);
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <i className="fa-solid fa-seedling" style={{ color: "#29572C" }}></i>
                  <span className="cat-name">كل الخضروات</span>
                </div>
                <i className="fa-solid fa-chevron-left arrow-icon"></i>
              </button>

              {displayCategories.map((cat) => {
                const isBox = cat.id === "weekly_box";
                const isActive = currentView === "products" && selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    className={`drawer-cat-item ${isBox ? "drawer-cat-item-featured" : ""} ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onGoProducts && onGoProducts();
                      setIsMenuOpen(false);
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      {isBox ? (
                        <i className="fa-solid fa-box-archive" style={{ color: "#d97706" }}></i>
                      ) : (
                        <span style={{ width: 4 }} />
                      )}
                      <span className="cat-name">{cat.label}</span>
                      {isBox && <span className="drawer-special-tag">توفير عائلي</span>}
                    </div>
                    <i className="fa-solid fa-chevron-left arrow-icon"></i>
                  </button>
                );
              })}
            </nav>

            {/* Quick Features */}
            <div className="drawer-section-title">
              <i className="fa-solid fa-star" style={{ marginLeft: "6px", color: "#eab308" }}></i>
              خدمات ومميزات المتجر
            </div>
            <div className="drawer-features-list">
              <div className="drawer-feat-item">
                <i className="fa-solid fa-bolt" style={{ color: "#eab308" }}></i>
                <span>توصيل إكسبريس السريع</span>
              </div>
              <div className="drawer-feat-item">
                <i className="fa-solid fa-shield-halved" style={{ color: "#38ae04" }}></i>
                <span>منتجات أصلية 100% مع ضمان</span>
              </div>
              <div className="drawer-feat-item">
                <i className="fa-solid fa-arrow-rotate-left" style={{ color: "#3b82f6" }}></i>
                <span>إرجاع سهل ومجاني خلال 40 - 50 دقيقة</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
