import { useState, useEffect } from "react";

export default function FlashDealBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText("ESOO20");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const padZero = (n) => String(n).padStart(2, "0");

  return (
    <div className="esoo-flash-bar">
      <div className="esoo-flash-inner">
        <div className="flash-tag">
          <i className="fa-solid fa-bolt-lightning"></i>
          <span>عروض اليوم الحصرية</span>
        </div>

        <div className="flash-countdown">
          <span className="countdown-label">ينتهي العرض خلال:</span>
          <div className="countdown-boxes">
            <span className="time-box">{padZero(timeLeft.hours)}</span>:
            <span className="time-box">{padZero(timeLeft.minutes)}</span>:
            <span className="time-box">{padZero(timeLeft.seconds)}</span>
          </div>
        </div>

        <div className="flash-coupon">
          <span className="coupon-text">خصم 20% إضافي بكود:</span>
          <button className={`coupon-badge ${copied ? "copied" : ""}`} onClick={handleCopyCode}>
            <strong>ESOO20</strong>
            <i className={copied ? "fa-solid fa-check" : "fa-regular fa-copy"}></i>
            <span className="copy-tooltip">{copied ? "تم النسخ!" : "نسخ"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
