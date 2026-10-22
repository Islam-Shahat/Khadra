import { useState } from "react";

const EGYPT_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "القليوبية",
  "الشرقية",
  "الدقهلية",
  "الغربية",
  "المنوفية",
  "البحيرة",
  "دمياط",
  "الإسماعيلية",
  "السويس",
  "بورسعيد",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
];

const DELIVERY_TIMES = [
  { id: "asap", label: "في أقرب وقت ممكن (شحن فوري خلال 60-90 دقيقة)", icon: "fa-solid fa-bolt" },
  { id: "morning", label: "الفترة الصباحية (9:00 ص - 1:00 ظهراً)", icon: "fa-solid fa-sun" },
  { id: "afternoon", label: "فترة الظهيرة (2:00 ظ - 6:00 مساءً)", icon: "fa-solid fa-cloud-sun" },
  { id: "evening", label: "الفترة المسائية (7:00 م - 10:00 مساءً)", icon: "fa-solid fa-moon" },
];

const PAYMENT_METHODS = [
  {
    id: "cod",
    name: "الدفع عند الاستلام (كاش أو فيزا)",
    desc: "ادفع بأمان عند استلام ومعاينة الخضروات طازجة على باب منزلك",
    icon: "fa-solid fa-money-bill-wave",
    popular: true,
  },
  {
    id: "wallet",
    name: "محفظة إلكترونية / إنستاباي (InstaPay)",
    desc: "فودافون كاش، أورنج كاش، اتصالات كاش، وي باي، أو إنستاباي",
    icon: "fa-solid fa-mobile-screen-button",
    badge: "سريع وآمن",
  },
  {
    id: "card",
    name: "بطاقة ائتمان / ميزة (Online Card)",
    desc: "فيزا، ماستركارد، أو بطاقة ميزة الوطنية بتشفير آمن 100%",
    icon: "fa-solid fa-credit-card",
  },
];

export default function CheckoutForm({
  cart,
  subtotal,
  discountAmount,
  discountPercent,
  shippingFee,
  grandTotal,
  onConfirmOrder,
  onBackToCart,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    governorate: "القاهرة",
    address: "",
    deliveryTime: DELIVERY_TIMES[0].label,
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("الدفع عند الاستلام (كاش أو فيزا)");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "يرجى كتابة الاسم بالكامل";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "الاسم يجب ألا يقل عن 3 أحرف";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "يرجى إدخال رقم الهاتف للتواصل";
    } else {
      const cleanPhone = formData.phone.trim().replace(/\s+/g, "");
      if (!/^01[0125][0-9]{8}$/.test(cleanPhone) && cleanPhone.length < 10) {
        newErrors.phone = "يرجى كتابة رقم هاتف مصري صحيح (مثال: 01557523934)";
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = "يرجى كتابة العنوان بالتفصيل (الشارع، رقم العمارة، رقم الشقة)";
    } else if (formData.address.trim().length < 6) {
      newErrors.address = "يرجى كتابة تفاصيل أكثر للعنوان لتسهيل وصول المندوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      const firstErrorEl = document.querySelector(".checkout-input-error");
      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    // Generate Unique Order ID & Time
    const timestamp = Date.now();
    const orderNumber = `#KD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const formattedDate = new Intl.DateTimeFormat("ar-EG", {
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date());

    const orderData = {
      orderId: orderNumber,
      timestamp,
      date: formattedDate,
      customer: { ...formData },
      items: [...cart],
      subtotal,
      discountAmount,
      discountPercent,
      shippingFee,
      grandTotal,
      paymentMethod,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onConfirmOrder(orderData);
    }, 600);
  };

  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="checkout-page-container">
      {/* Top Navigation */}
      <div className="checkout-top-header">
        <button className="cart-back-btn" onClick={onBackToCart} title="العودة لمراجعة السلة">
          <i className="fa-solid fa-arrow-right"></i>
          <span>العودة لتعديل السلة</span>
        </button>
        <div className="checkout-badge-secure">
          <i className="fa-solid fa-shield-halved"></i>
          <span>إتمام الطلب بأمان وخصوصية تامة</span>
        </div>
      </div>

      <form className="checkout-main-grid" onSubmit={handleSubmit} noValidate>
        {/* Left / Main Section: Forms */}
        <div className="checkout-form-section">
          {/* 1. Shipping Details Card */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <span className="card-step-badge">1</span>
              <div>
                <h2 className="checkout-card-title">بيانات الشحن وعنوان التوصيل</h2>
                <p className="checkout-card-subtitle">أدخل تفاصيل المستلم لضمان وصول الخضروات طازجة وسريعة</p>
              </div>
            </div>

            <div className="checkout-fields-grid">
              {/* Full Name */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="fullName">
                  الاسم بالكامل <span className="req">*</span>
                </label>
                <div className="input-icon-wrapper">
                  <i className="fa-regular fa-user"></i>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="إسلام شحات رسلي"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`form-input ${errors.fullName ? "is-invalid" : ""}`}
                  />
                </div>
                {errors.fullName && <p className="checkout-input-error">{errors.fullName}</p>}
              </div>

              {/* Phone */}
              <div className="form-group col-span-1">
                <label className="form-label" htmlFor="phone">
                  رقم الهاتف المحمول <span className="req">*</span>
                </label>
                <div className="input-icon-wrapper">
                  <i className="fa-solid fa-phone"></i>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01557523934"
                    value={formData.phone}
                    onChange={handleChange}
                    dir="ltr"
                    className={`form-input ${errors.phone ? "is-invalid" : ""}`}
                  />
                </div>
                {errors.phone && <p className="checkout-input-error">{errors.phone}</p>}
              </div>

              {/* Governorate */}
              <div className="form-group col-span-1">
                <label className="form-label" htmlFor="governorate">
                  المحافظة <span className="req">*</span>
                </label>
                <div className="input-icon-wrapper select-wrapper">
                  <i className="fa-solid fa-map-location-dot"></i>
                  <select
                    id="governorate"
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleChange}
                    className="form-input form-select"
                  >
                    {EGYPT_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Detailed Address */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="address">
                  العنوان بالتفصيل <span className="req">*</span>
                </label>
                <div className="input-icon-wrapper">
                  <i className="fa-solid fa-house"></i>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="اسم الشارع، رقم العمارة، رقم الشقة أو علامة مميزة"
                    value={formData.address}
                    onChange={handleChange}
                    className={`form-input ${errors.address ? "is-invalid" : ""}`}
                  />
                </div>
                {errors.address && <p className="checkout-input-error">{errors.address}</p>}
              </div>

              {/* Delivery Window */}
              <div className="form-group col-span-2">
                <label className="form-label">موعد التوصيل المفضل</label>
                <div className="delivery-time-options">
                  {DELIVERY_TIMES.map((time) => (
                    <label
                      key={time.id}
                      className={`delivery-time-radio-card ${formData.deliveryTime === time.label ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="deliveryTime"
                        value={time.label}
                        checked={formData.deliveryTime === time.label}
                        onChange={handleChange}
                      />
                      <i className={time.icon}></i>
                      <span>{time.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="form-group col-span-2">
                <label className="form-label" htmlFor="notes">
                  ملاحظات إضافية للتوصيل (اختياري)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="2"
                  placeholder="مثال: يرجى الاتصال قبل الوصول بـ 15 دقيقة، أو ترك الطلب لدى الأمن..."
                  value={formData.notes}
                  onChange={handleChange}
                  className="form-input form-textarea"
                ></textarea>
              </div>
            </div>
          </div>

          {/* 2. Payment Method Card */}
          <div className="checkout-card">
            <div className="checkout-card-header">
              <span className="card-step-badge">2</span>
              <div>
                <h2 className="checkout-card-title">طريقة الدفع والسداد</h2>
                <p className="checkout-card-subtitle">اختر وسيلة الدفع الأكثر ملاءمة لك</p>
              </div>
            </div>

            <div className="payment-methods-list">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = paymentMethod === method.name;
                return (
                  <label
                    key={method.id}
                    className={`payment-method-card ${isSelected ? "selected" : ""}`}
                  >
                    <div className="payment-card-right">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.name}
                        checked={isSelected}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <div className="payment-icon-box">
                        <i className={method.icon}></i>
                      </div>
                      <div className="payment-text-box">
                        <div className="payment-title-row">
                          <strong className="payment-title">{method.name}</strong>
                          {method.popular && <span className="payment-badge popular">الأكثر طلباً</span>}
                          {method.badge && <span className="payment-badge">{method.badge}</span>}
                        </div>
                        <p className="payment-desc">{method.desc}</p>
                      </div>
                    </div>
                    <div className="payment-check-circle">
                      <i className="fa-solid fa-check"></i>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Section: Order Summary Review */}
        <aside className="checkout-summary-sidebar">
          <div className="checkout-summary-card">
            <h3 className="summary-title">مراجعة الطلبية</h3>

            {/* Quick Items Preview */}
            <div className="checkout-mini-items-list">
              {cart.map((item) => (
                <div key={item.id} className="mini-item-row">
                  <div className="mini-item-img">
                    <img src={item.thumbnail} alt={item.title} />
                    <span className="mini-item-qty">{item.quantity}</span>
                  </div>
                  <div className="mini-item-info">
                    <span className="mini-item-title">{item.title}</span>
                    <span className="mini-item-price">
                      {item.price.toFixed(2)} ج.م × {item.quantity}
                    </span>
                  </div>
                  <strong className="mini-item-total">
                    {(item.price * item.quantity).toFixed(2)} ج.م
                  </strong>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            {/* Cost Breakdown */}
            <div className="summary-row">
              <span>المجموع الفرعي ({totalItemsCount} عناصر):</span>
              <span>{subtotal.toFixed(2)} ج.م</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row discount">
                <span>خصم الكوبون ({discountPercent}%):</span>
                <span>-{discountAmount.toFixed(2)} ج.م</span>
              </div>
            )}

            <div className="summary-row">
              <span>الشحن والتوصيل:</span>
              <span>{shippingFee === 0 ? <strong className="free-text">مجاناً</strong> : `${shippingFee.toFixed(2)} ج.م`}</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row grand-total">
              <span>المجموع النهائي:</span>
              <span className="total-val">{grandTotal.toFixed(2)} ج.م</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="checkout-place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>
                  <i className="fa-solid fa-spinner fa-spin"></i> جارٍ تأكيد الطلب...
                </span>
              ) : (
                <span>
                  <i className="fa-solid fa-circle-check"></i> تأكيد الشراء الآن ({grandTotal.toFixed(2)} ج.م)
                </span>
              )}
            </button>

            <div className="checkout-trust-points">
              <div className="trust-point">
                <i className="fa-solid fa-shield-heart"></i>
                <span>ضمان جودة الخضار طازج 100%</span>
              </div>
              <div className="trust-point">
                <i className="fa-solid fa-hand-holding-dollar"></i>
                <span>معاينة الطلب والدفع عند الاستلام</span>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
