import React from "react";
import useHomeData from "../../hooks/useHomeData";
import ProductCard from "../products/ProductCard";
import "./Home.css";

export default function HomePage({
  onNavigateToProducts,
  onSelectCategory,
  onAddToCart,
  onBuyNow,
  cart = [],
  wishlist = [],
  onToggleWishlist,
  onQuickView,
}) {
  const {
    slides,
    activeSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    setIsPaused,
    categories,
    flashDeals,
    bestSellers,
    countdown,
    loading,
    error,
    copiedCoupon,
    copyCouponCode,
    activeTab,
    setActiveTab,
  } = useHomeData();

  const currentSlide = slides[activeSlide];

  const handleSlideCtaClick = (category) => {
    onSelectCategory && onSelectCategory(category);
    onNavigateToProducts && onNavigateToProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (catId) => {
    onSelectCategory && onSelectCategory(catId);
    onNavigateToProducts && onNavigateToProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="noon-home-page">
      {/* 1. Hero Promotional Section (Main Slider + 2 Side Cards) */}
      <section className="home-hero-section">
        <div className="home-hero-container">
          {/* Main Slider */}
          <div
            className="hero-slider"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div
              className="hero-slide-card"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.3) 100%), url(${currentSlide.image})`,
              }}
            >
              <div className="hero-slide-content">
                <span className="hero-tag-badge" style={{ backgroundColor: currentSlide.badgeColor }}>
                  {currentSlide.tag}
                </span>

                <h1 className="hero-slide-title">{currentSlide.title}</h1>
                <p className="hero-slide-desc">{currentSlide.subtitle}</p>

                <div className="hero-slide-highlights">
                  <span className="hero-highlight-chip">
                    <i className="fa-solid fa-truck-fast"></i>
                    {currentSlide.highlight}
                  </span>
                  <span className="hero-highlight-chip discount">
                    <i className="fa-solid fa-percent"></i>
                    {currentSlide.badge}
                  </span>
                </div>

                <div className="hero-slide-actions">
                  <button
                    className="hero-cta-btn"
                    onClick={() => handleSlideCtaClick(currentSlide.category)}
                  >
                    <span>{currentSlide.cta}</span>
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>

                  <button
                    className="hero-secondary-btn"
                    onClick={() => handleCategoryClick("all")}
                  >
                    تصفح الكتالوج الكامل
                  </button>
                </div>
              </div>

              {/* Slider Arrows */}
              <button
                className="hero-slider-nav prev"
                onClick={prevSlide}
                title="الشريحة السابقة"
                aria-label="الشريحة السابقة"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
              <button
                className="hero-slider-nav next"
                onClick={nextSlide}
                title="الشريحة التالية"
                aria-label="الشريحة التالية"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              {/* Slide Dots Indicator */}
              <div className="hero-dots-container">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    className={`hero-dot ${idx === activeSlide ? "active" : ""}`}
                    onClick={() => goToSlide(idx)}
                    title={`انتقل للشريحة ${idx + 1}`}
                    aria-label={`انتقل للشريحة ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Side Promotional Cards */}
          <aside className="hero-side-cards">
            {/* Side Card 1: Family Vegetable Box Deal */}
            <div
              className="hero-promo-card deal-of-day"
              onClick={() => handleCategoryClick("weekly_box")}
            >
              <div className="promo-card-badge">عرض الأسبوع العائلي</div>
              <div className="promo-card-body">
                <h3>صندوق خضار الأسبوع بخصم 25%</h3>
                <p>تشكيلة متكاملة من البطاطس والطماطم والبصل والجزر</p>
                <span className="promo-card-link">
                  اطلب الآن <i className="fa-solid fa-arrow-left"></i>
                </span>
              </div>
              <div className="promo-card-icon-bg">
                <i className="fa-solid fa-box-archive"></i>
              </div>
            </div>

            {/* Side Card 2: Express Fresh Harvest */}
            <div
              className="hero-promo-card express-delivery"
              onClick={() => handleCategoryClick("fruity")}
            >
              <div className="promo-card-badge express">
                <i className="fa-solid fa-bolt"></i> خضرة إكسبريس
              </div>
              <div className="promo-card-body">
                <h3>خضار المزرعة مقطوف فجراً</h3>
                <p>طماطم وخيار وفلفل طازج مقرمش يوصلك اليوم</p>
                <span className="promo-card-link">
                  تسوق الآن <i className="fa-solid fa-arrow-left"></i>
                </span>
              </div>
              <div className="promo-card-icon-bg">
                <i className="fa-solid fa-apple-whole"></i>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* 2. Quick Circular Categories Bar */}
      <section className="home-categories-section">
        <div className="home-section-header-compact">
          <h2 className="home-section-heading">
            <i className="fa-solid fa-layer-group" style={{ color: "#000" }}></i>
            تسوق حسب القسم
          </h2>
          <button
            className="home-view-all-link"
            onClick={() => handleCategoryClick("all")}
          >
            عرض الكل <i className="fa-solid fa-chevron-left"></i>
          </button>
        </div>

        <div className="home-categories-grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="home-category-bubble"
              onClick={() => handleCategoryClick(cat.id)}
            >
              <div
                className="category-circle"
                style={{ backgroundColor: cat.color, color: cat.textColor }}
              >
                <i className={cat.icon}></i>
              </div>
              <span className="category-bubble-title">{cat.name}</span>
              <span className="category-bubble-badge">{cat.badge}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Best Sellers & Trending Showcase (Moved Above Flash Deals) */}
      <section className="home-bestsellers-section">
        <div className="bestsellers-header">
          <div>
            <h2 className="home-section-heading">
              <i className="fa-solid fa-crown" style={{ color: "#eab308" }}></i>
              المنتجات الأكثر مبيعاً وتقييماً
            </h2>
            <p className="section-subtext">اختيارات عملائنا المفضلة والأعلى تقييماً لهذا الأسبوع مع توفر كامل بالمخزون</p>
          </div>

          {/* Tab Filter */}
          <div className="bestsellers-tabs">
            <button
              className={`bestseller-tab-btn ${activeTab === "flash" ? "active" : ""}`}
              onClick={() => setActiveTab("flash")}
            >
              الأكثر مبيعاً
            </button>
            <button
              className={`bestseller-tab-btn ${activeTab === "bestSellers" ? "active" : ""}`}
              onClick={() => setActiveTab("bestSellers")}
            >
              الأعلى تقييماً ★
            </button>
          </div>
        </div>

        {/* Best Sellers Grid */}
        <div className="home-products-showcase-grid">
          {bestSellers.map((product) => {
            const isFav = wishlist.some((w) => w.id === product.id);
            const cartItem = cart.find((item) => item.id === product.id);
            const cartQty = cartItem ? cartItem.quantity : 0;

            return (
              <ProductCard
                key={`best-${product.id}`}
                product={product}
                onQuickView={onQuickView}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                isFavorite={isFav}
                onToggleWishlist={onToggleWishlist}
                cartQuantity={cartQty}
                onUpdateQuantity={() => {}}
              />
            );
          })}
        </div>
      </section>

      {/* 4. Mega Flash Deals & Low Stock Clearance Section */}
      <section className="home-flash-deals-section">
        <div className="flash-deals-header-box">
          <div className="flash-title-with-badge">
            <span className="flash-live-badge">
              <span className="live-pulse"></span>
              أوشكت على النفاد 🔥
            </span>
            <div className="flash-title-text">
              <h2>
                <i className="fa-solid fa-fire-flame-curved" style={{ color: "#e11d48" }}></i>
                عروض البرق وتصفية المخزون
              </h2>
              <p>خصومات استثنائية على آخر القطع المتبقية في المخازن - تنتهي بنفاد الكمية!</p>
            </div>
          </div>

          {/* Live Dynamic Countdown */}
          <div className="flash-countdown-container">
            <span className="countdown-label">ينتهي العرض خلال:</span>
            <div className="countdown-timer-units">
              <div className="time-unit-box">
                <span className="time-val">{countdown.hours}</span>
                <span className="time-lbl">ساعة</span>
              </div>
              <span className="time-sep">:</span>
              <div className="time-unit-box">
                <span className="time-val">{countdown.minutes}</span>
                <span className="time-lbl">دقيقة</span>
              </div>
              <span className="time-sep">:</span>
              <div className="time-unit-box seconds">
                <span className="time-val">{countdown.seconds}</span>
                <span className="time-lbl">ثانية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Authentic Claimed & Low Stock Urgency Indicator */}
        <div className="flash-progress-bar-strip">
          <div className="flash-progress-info">
            <span>🔥 <strong>تصفية نهائية:</strong> منتجات عليها خصم كبير ومتبقي أقل من 10 قطع في المستودع!</span>
            <span className="flash-urgency">أسرع بالطلب قبل نفاد المخزون تماماً</span>
          </div>
          <div className="flash-progress-track">
            <div className="flash-progress-fill" style={{ width: "88%" }}></div>
          </div>
        </div>

        {/* Flash Deals Products Grid (Strictly Low Stock & Deals) */}
        {loading ? (
          <div className="home-loading-box">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>جاري تحميل عروض التصفية المتبقية...</p>
          </div>
        ) : error ? (
          <div className="home-error-box">
            <i className="fa-solid fa-circle-exclamation"></i>
            <p>{error}</p>
          </div>
        ) : (
          <div className="home-products-showcase-grid">
            {flashDeals.map((product) => {
              const isFav = wishlist.some((w) => w.id === product.id);
              const cartItem = cart.find((item) => item.id === product.id);
              const cartQty = cartItem ? cartItem.quantity : 0;

              return (
                <ProductCard
                  key={`flash-${product.id}`}
                  product={product}
                  onQuickView={onQuickView}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                  isFavorite={isFav}
                  onToggleWishlist={onToggleWishlist}
                  cartQuantity={cartQty}
                  onUpdateQuantity={() => {}}
                />
              );
            })}
          </div>
        )}

        <div className="flash-view-more-container">
          <button
            className="flash-view-more-btn"
            onClick={() => handleCategoryClick("all")}
          >
            <span>عرض كافة العروض والتخفيضات بالكتالوج</span>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
      </section>

      {/* 5. Interactive Promo Coupon Strip */}
      <section className="home-coupon-banner">
        <div className="coupon-banner-inner">
          <div className="coupon-text-side">
            <div className="coupon-icon-wrap">
              <i className="fa-solid fa-ticket"></i>
            </div>
            <div>
              <h3>وفر 20% إضافية على كل مشترياتك!</h3>
              <p>استخدم كود الخصم الحصري عند إتمام الطلب واحصل على توفير فوري</p>
            </div>
          </div>

          <div className="coupon-action-side">
            <div className="coupon-code-chip">
              <span className="code-text">ESOO20</span>
              <button
                className={`copy-code-btn ${copiedCoupon ? "copied" : ""}`}
                onClick={() => copyCouponCode("ESOO20")}
                title="نسخ كود الخصم"
              >
                {copiedCoupon ? (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <i className="fa-regular fa-copy"></i>
                    <span>نسخ الكود</span>
                  </>
                )}
              </button>
            </div>

            <button
              className="coupon-shop-btn"
              onClick={() => handleCategoryClick("all")}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              <span>استخدمه الآن</span>
            </button>
          </div>
        </div>
      </section>

      {/* 6. Trust & Guarantee Badges Bar */}
      <section className="home-trust-guarantees">
        <div className="trust-grid">
          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <div className="trust-info">
              <h4>شحن فوري إكسبريس</h4>
              <p>توصيل آمن وسريع حتى باب منزلك مع تتبع مباشر للطلب</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-award"></i>
            </div>
            <div className="trust-info">
              <h4>أصلي ومضمون 100%</h4>
              <p>جميع المنتجات معتمدة ومختارة بعناية من أفضل الماركات</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-rotate-left"></i>
            </div>
            <div className="trust-info">
              <h4>إرجاع واستبدال مجاني</h4>
              <p>استرجاع سهل خلال 14 يوماً بكل مرونة وبدون أي تعقيد</p>
            </div>
          </div>

          <div className="trust-card">
            <div className="trust-icon-box">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="trust-info">
              <h4>دفع آمن ومحمي</h4>
              <p>تشفير بنكي متكامل 256-bit وإمكانية الدفع عند الاستلام</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Big Catalog Link Banner */}
      <section className="home-catalog-cta-wrapper">
        <div className="home-catalog-cta-box">
          <div className="cta-box-text">
            <h3>لم تجد نوع الخضار الذي تبحث عنه؟</h3>
            <p>تصفح أكثر من 25 صنفاً من الخضروات الطازجة، الورقيات، الجذور وبكجات التوفير من مزارع خضرة مباشرة</p>
          </div>
          <button
            className="cta-box-btn"
            onClick={() => handleCategoryClick("all")}
          >
            <span>الانتقال لكتالوج الخضروات الكامل</span>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
        </div>
      </section>
    </div>
  );
}
