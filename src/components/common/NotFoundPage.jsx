import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./NotFoundPage.css";

export default function NotFoundPage({ onGoHome, onGoProducts, onSelectCategory, onSearchChange }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "404 - الصفحة غير موجودة | خضرة";
    window.scrollTo({ top: 0, behavior: "smooth" });
    return () => {
      document.title = prevTitle;
    };
  }, []);

  const handleHomeClick = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      navigate("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleProductsClick = () => {
    if (onGoProducts) {
      onGoProducts();
    } else {
      navigate("/products");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = localSearch.trim();
    if (onSearchChange) {
      onSearchChange(query);
    }
    if (onGoProducts) {
      onGoProducts();
    } else {
      navigate("/products");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickCatClick = (catId) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    if (onGoProducts) {
      onGoProducts();
    } else {
      navigate("/products");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="notfound-page-container" dir="rtl">
      {/* Background Decorative Blobs */}
      <div className="notfound-bg-shape notfound-blob-1" aria-hidden="true"></div>
      <div className="notfound-bg-shape notfound-blob-2" aria-hidden="true"></div>

      <div className="notfound-card">
        {/* Floating Organic Badges */}
        <div className="notfound-badge-top">
          <span className="notfound-pulse-dot"></span>
          <span>رمز الخطأ 404 • مسار غير معروف</span>
        </div>

        {/* 404 Big Creative Display */}
        <div className="notfound-numeral-display">
          <span className="notfound-digit">4</span>
          <div className="notfound-veggie-avatar" title="خضار مفقود!">
            <div className="notfound-veggie-icon-circle">
              <i className="fa-solid fa-seedling notfound-leaf-anim"></i>
            </div>
            <span className="notfound-emoji-badge">🥕</span>
          </div>
          <span className="notfound-digit">4</span>
        </div>

        {/* Content Heading */}
        <h1 className="notfound-title">عذراً! هذه الصفحة غير موجودة</h1>
        <p className="notfound-english-tag">Page Not Found</p>

        <p className="notfound-description">
          يبدو أنك سلكت مساراً غير معروف في حقول <strong>خضرة</strong>، أو أن الرابط المطلوب تم نقله أو حذفه.
        </p>

        {/* Path Info Pill */}
        <div className="notfound-path-pill" title="الرابط المطلوب غير موجود">
          <i className="fa-solid fa-link-slash"></i>
          <span>المسار المطلوب:</span>
          <code>{location.pathname || "/unknown"}</code>
        </div>

        {/* Quick Search inside 404 page */}
        <form className="notfound-search-form" onSubmit={handleSearchSubmit}>
          <div className="notfound-search-input-wrapper">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="ابحث عن خضار، ورقيات، أو بوكسات التوفير..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              aria-label="البحث عن منتج"
            />
            <button type="submit" className="notfound-search-btn">
              بحث
            </button>
          </div>
        </form>

        {/* Quick Action Buttons */}
        <div className="notfound-actions-group">
          <button
            type="button"
            className="notfound-btn notfound-btn-primary"
            onClick={handleHomeClick}
          >
            <i className="fa-solid fa-house"></i>
            <span>العودة للرئيسية</span>
          </button>

          <button
            type="button"
            className="notfound-btn notfound-btn-secondary"
            onClick={handleProductsClick}
          >
            <i className="fa-solid fa-store"></i>
            <span>تصفح كل الخضروات</span>
          </button>
        </div>

        {/* Quick Categories Discovery */}
        <div className="notfound-categories-discovery">
          <span className="discovery-label">
            <i className="fa-solid fa-compass"></i> جرّب تصفح أشهر الأقسام:
          </span>
          <div className="discovery-chips-list">
            <button
              type="button"
              className="discovery-chip"
              onClick={() => handleQuickCatClick("leafy")}
            >
              🥬 ورقيات طازجة
            </button>
            <button
              type="button"
              className="discovery-chip"
              onClick={() => handleQuickCatClick("boxes")}
            >
              📦 بوكسات التوفير
            </button>
            <button
              type="button"
              className="discovery-chip"
              onClick={() => handleQuickCatClick("organic")}
            >
              🌱 خضار عضوي فاخر
            </button>
            <button
              type="button"
              className="discovery-chip"
              onClick={() => handleQuickCatClick("basic")}
            >
              🍅 طماطم وخيار وبطاطس
            </button>
          </div>
        </div>

        {/* Support Note */}
        <div className="notfound-support-note">
          <i className="fa-solid fa-headset"></i>
          <span>
            تحتاج لمساعدة؟ فريق خدمة عملاء <strong>خضرة</strong> متواجد لدعمك وتوصيل طلبك طازجاً لبيتك.
          </span>
        </div>
      </div>
    </div>
  );
}
