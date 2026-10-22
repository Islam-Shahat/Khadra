import React, { useState } from "react";
import "./FloatingCouponPopup.css";

export default function FloatingCouponPopup({
  code = "KHADRA20",
  onUseCoupon,
  onClose,
}) {
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    setIsMinimized(false);
  };

  const handlePermanentlyClose = (e) => {
    e.stopPropagation();
    setIsDismissed(true);
    onClose && onClose();
  };

  if (isDismissed) return null;

  // 1. Minimized State: Sleek floating discount badge (Like Zara / Noon / Shein)
  if (isMinimized) {
    return (
      <div
        className="floating-coupon-minimized"
        onClick={handleExpand}
        title="انقر لعرض كود الخصم 20%"
        role="button"
        aria-label="عرض كود الخصم"
      >
        <div className="minimized-pill-pulse"></div>
        <i className="fa-solid fa-ticket-simple minimized-icon"></i>
        <span className="minimized-tag">خصم 20%</span>
        <button
          className="minimized-close-btn"
          onClick={handlePermanentlyClose}
          title="إغلاق نهائي"
          aria-label="إغلاق نهائي"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    );
  }

  // 2. Compact Pill State: Slim single-line capsule that takes almost zero screen space
  return (
    <aside
      className="floating-coupon-capsule"
      role="complementary"
      aria-label="قسيمة التوفير"
    >
      {/* Yellow Accent Discount Tag */}
      <div className="capsule-discount-tag">
        <i className="fa-solid fa-bolt-lightning"></i>
        <span>خصم 20%</span>
      </div>

      {/* Code with One-Click Copy */}
      <div className="capsule-code-wrap">
        <span className="capsule-code">{code}</span>
        <button
          className={`capsule-copy-btn ${copied ? "copied" : ""}`}
          onClick={handleCopy}
          title="نسخ كود الخصم"
        >
          {copied ? (
            <>
              <i className="fa-solid fa-check"></i>
              <span>تم النسخ!</span>
            </>
          ) : (
            <>
              <i className="fa-regular fa-copy"></i>
              <span>نسخ</span>
            </>
          )}
        </button>
      </div>

      {/* Fast CTA */}
      <button
        className="capsule-use-link"
        onClick={(e) => {
          handleCopy(e);
          onUseCoupon && onUseCoupon();
        }}
        title="تفعيل الخصم والتسوق"
      >
        <span>تطبيق</span>
        <i className="fa-solid fa-chevron-left"></i>
      </button>

      {/* Discreet Close Button [X] */}
      <button
        className="capsule-close-btn"
        onClick={handleMinimize}
        title="تصغير الإشعار"
        aria-label="تصغير الإشعار"
      >
        <i className="fa-solid fa-xmark"></i>
      </button>
    </aside>
  );
}
