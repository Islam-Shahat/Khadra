import { useState } from "react";
import ConfirmModal from "../common/ConfirmModal";
import CheckoutForm from "./CheckoutForm";
import OrderReceipt from "./OrderReceipt";
import "./Cart.css";

export default function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBackToShopping,
}) {
  // Step State: 'cart' | 'checkout' | 'receipt'
  const [currentStep, setCurrentStep] = useState("cart");

  // Promo code & discount state
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Confirmation modal for clearing cart
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Stored completed order for receipt
  const [completedOrder, setCompletedOrder] = useState(() => {
    try {
      const saved = localStorage.getItem("khadra_last_order");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const shippingFee = subtotal > 50 || subtotal === 0 ? 0 : 5.0; // Free shipping over 50 EGP
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError("");
    setPromoSuccess("");

    if (!promoCode.trim()) return;

    const code = promoCode.trim().toUpperCase();
    if (code === "KHADRA20" || code === "ESOO20") {
      setDiscountPercent(20);
      setPromoSuccess("تم تطبيق خصم 20% بنجاح! 🎉");
    } else {
      setPromoError("كود الخصم غير صالح. جرب كود: KHADRA20");
    }
  };

  // Switch to checkout step
  const handleProceedToCheckout = () => {
    setCurrentStep("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Back to cart step
  const handleBackToCart = () => {
    setCurrentStep("cart");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle final order confirmation
  const handleConfirmOrder = (orderData) => {
    setCompletedOrder(orderData);
    try {
      localStorage.setItem("khadra_last_order", JSON.stringify(orderData));
    } catch {
      // ignore storage errors
    }
    onClearCart();
    setCurrentStep("receipt");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="esoo-cart-page-wrapper">
      <div className="esoo-cart-container">
        {/* Step Indicator / Stepper Header (Only visible on screen, hidden in print) */}
        {((cart.length > 0 && currentStep !== "receipt") || currentStep === "receipt") && (
          <div className="cart-checkout-stepper no-print">
            <div
              className={`stepper-node ${currentStep === "cart" ? "active" : "completed"}`}
              onClick={() => cart.length > 0 && setCurrentStep("cart")}
              style={{ cursor: cart.length > 0 ? "pointer" : "default" }}
            >
              <div className="step-circle">
                {currentStep === "cart" ? "1" : <i className="fa-solid fa-check"></i>}
              </div>
              <span className="step-name">
                <span className="step-label-desktop">سلة المشتريات</span>
                <span className="step-label-mobile">السلة</span>
              </span>
            </div>

            <div className={`stepper-connector ${currentStep !== "cart" ? "completed" : ""}`}></div>

            <div
              className={`stepper-node ${
                currentStep === "checkout" ? "active" : currentStep === "receipt" ? "completed" : ""
              }`}
              onClick={() => cart.length > 0 && setCurrentStep("checkout")}
              style={{ cursor: cart.length > 0 ? "pointer" : "default" }}
            >
              <div className="step-circle">
                {currentStep === "receipt" ? <i className="fa-solid fa-check"></i> : "2"}
              </div>
              <span className="step-name">
                <span className="step-label-desktop">إتمام الشراء والشحن</span>
                <span className="step-label-mobile">الشحن</span>
              </span>
            </div>

            <div className={`stepper-connector ${currentStep === "receipt" ? "completed" : ""}`}></div>

            <div className={`stepper-node ${currentStep === "receipt" ? "active completed-glow" : ""}`}>
              <div className="step-circle">
                <i className="fa-solid fa-receipt"></i>
              </div>
              <span className="step-name">
                <span className="step-label-desktop">الفاتورة وتأكيد الطلب</span>
                <span className="step-label-mobile">الفاتورة</span>
              </span>
            </div>
          </div>
        )}

        {/* STEP 3: Order Receipt / Official Invoice */}
        {currentStep === "receipt" && completedOrder ? (
          <OrderReceipt
            order={completedOrder}
            onBackToShopping={() => {
              setCurrentStep("cart");
              onBackToShopping();
            }}
          />
        ) : currentStep === "checkout" && cart.length > 0 ? (
          /* STEP 2: Checkout Form & Shipping Info */
          <CheckoutForm
            cart={cart}
            subtotal={subtotal}
            discountAmount={discountAmount}
            discountPercent={discountPercent}
            shippingFee={shippingFee}
            grandTotal={grandTotal}
            onConfirmOrder={handleConfirmOrder}
            onBackToCart={handleBackToCart}
          />
        ) : (
          /* STEP 1: Shopping Cart Review */
          <>
            {/* Top Navigation Strip with Back Button */}
            <div className="cart-top-bar no-print">
              <button className="cart-back-btn" onClick={onBackToShopping} title="العودة لصفحة المنتجات">
                <i className="fa-solid fa-arrow-right"></i>
                <span>العودة لمتابعة التسوق</span>
              </button>

              {cart.length > 0 && (
                <button
                  className="cart-clear-all-btn"
                  onClick={() => setShowClearConfirm(true)}
                  title="حذف جميع العناصر"
                >
                  <i className="fa-regular fa-trash-can"></i>
                  <span>حذف كل المنتجات ({totalItemsCount})</span>
                </button>
              )}

              {cart.length === 0 && completedOrder && (
                <button
                  className="cart-view-last-receipt-btn"
                  onClick={() => setCurrentStep("receipt")}
                  title="عرض آخر فاتورة شراء"
                >
                  <i className="fa-solid fa-receipt"></i>
                  <span>عرض آخر فاتورة تم تأكيدها</span>
                </button>
              )}
            </div>

            {/* Empty Cart State */}
            {cart.length === 0 ? (
              <div className="cart-empty-box">
                <div className="cart-empty-icon-wrap">
                  <i className="fa-solid fa-cart-shopping"></i>
                </div>
                <h2 className="cart-empty-title">عربة التسوق فارغة</h2>
                <p className="cart-empty-desc">
                  لم تقم بإضافة أي منتجات إلى عربة التسوق بعد. تصفح أحدث الخضروات العضوية الطازجة وأضف طلباتك!
                </p>
                <div className="cart-empty-actions">
                  <button className="cart-start-shopping-btn" onClick={onBackToShopping}>
                    <i className="fa-solid fa-bag-shopping" style={{ marginLeft: "8px" }}></i>
                    ابدأ التسوق الآن
                  </button>
                  {completedOrder && (
                    <button
                      className="cart-start-shopping-btn secondary"
                      onClick={() => setCurrentStep("receipt")}
                    >
                      <i className="fa-solid fa-receipt" style={{ marginLeft: "8px" }}></i>
                      عرض آخر فاتورة للشراء ({completedOrder.orderId})
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Active Dynamic Cart Layout */
              <div className="cart-main-grid">
                {/* Products List Section */}
                <div className="cart-items-section">
                  <div className="cart-section-title-bar">
                    <h1 className="cart-page-title">
                      سلة المشتريات
                      <span className="cart-count-badge">({totalItemsCount} منتج)</span>
                    </h1>
                    <span className="cart-shipping-notice">
                      {subtotal > 50 ? (
                        <span className="free-ship-tag">
                          <i className="fa-solid fa-truck-fast"></i> مؤهل للشحن المجاني
                        </span>
                      ) : (
                        <span>
                          أضف خضروات بقيمة <strong>{(50 - subtotal).toFixed(2)} ج.م</strong> للحصول على شحن مجاني
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Items List */}
                  <div className="cart-items-list">
                    {cart.map((item) => {
                      const lineTotal = (item.price * item.quantity).toFixed(2);
                      return (
                        <div key={item.id} className="cart-item-card">
                          {/* Image */}
                          <div className="cart-item-img-wrap">
                            <img src={item.thumbnail} alt={item.title} />
                          </div>

                          {/* Info */}
                          <div className="cart-item-info">
                            {item.brand && <span className="cart-item-brand">{item.brand}</span>}
                            <h3 className="cart-item-title">{item.title}</h3>

                            <div className="cart-item-price-row">
                              <span className="cart-item-unit-price">{item.price} ج.م</span>
                              <span className="cart-item-calc">
                                × {item.quantity} = <strong>{lineTotal} ج.م</strong>
                              </span>
                            </div>

                            {item.stock !== undefined && (
                              <div className="cart-item-stock-notice">
                                {item.stock <= 5 ? (
                                  <span className="stock-alert low">
                                    <i className="fa-solid fa-fire"></i> متبقي {item.stock} فقط بالمخزون
                                  </span>
                                ) : (
                                  <span className="stock-alert in">
                                    <i className="fa-solid fa-circle-check"></i> متوفر بالمخزون ({item.stock} قطعة)
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Controls (Quantity + Remove) */}
                            <div className="cart-item-actions">
                              <div className="cart-qty-selector">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  aria-label="Decrease quantity"
                                >
                                  <i className="fa-solid fa-minus"></i>
                                </button>
                                <span className="cart-qty-val">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  disabled={item.stock && item.quantity >= item.stock}
                                  aria-label="Increase quantity"
                                  title={
                                    item.stock && item.quantity >= item.stock
                                      ? `أقصى كمية متاحة بالمخزون هي ${item.stock}`
                                      : ""
                                  }
                                >
                                  <i className="fa-solid fa-plus"></i>
                                </button>
                              </div>

                              <button
                                className="cart-item-remove-btn"
                                onClick={() => onRemoveItem(item.id)}
                                title="حذف هذا المنتج"
                              >
                                <i className="fa-regular fa-trash-can"></i>
                                <span>حذف</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Summary Sidebar */}
                <aside className="cart-summary-sidebar">
                  <div className="cart-summary-card">
                    <h2 className="summary-title">ملخص الطلبية</h2>

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
                      <span>
                        {shippingFee === 0 ? (
                          <strong className="free-text">مجاناً</strong>
                        ) : (
                          `${shippingFee.toFixed(2)} ج.م`
                        )}
                      </span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row grand-total">
                      <span>الإجمالي الكلي:</span>
                      <span className="total-val">{grandTotal.toFixed(2)} ج.م</span>
                    </div>

                    {/* Promo Code Form */}
                    <form className="cart-promo-form" onSubmit={handleApplyPromo}>
                      <div className="promo-input-group">
                        <input
                          type="text"
                          placeholder="كود الخصم (جرب: KHADRA20)"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button type="submit">تطبيق</button>
                      </div>
                      {promoSuccess && <p className="promo-msg success">{promoSuccess}</p>}
                      {promoError && <p className="promo-msg error">{promoError}</p>}
                    </form>

                    {/* Checkout Button: Switches to Checkout Form */}
                    <button
                      className="cart-checkout-btn"
                      onClick={handleProceedToCheckout}
                    >
                      <span>
                        <i className="fa-solid fa-lock" style={{ marginLeft: "8px" }}></i>
                        إتمام الطلب والدفع الآمن ({grandTotal.toFixed(2)} ج.م)
                      </span>
                    </button>

                    <div className="cart-guarantee-badges">
                      <div className="guarantee-item">
                        <i className="fa-solid fa-shield-halved"></i>
                        <span>دفع مشفر وآمن 100%</span>
                      </div>
                      <div className="guarantee-item">
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                        <span>إرجاع سهل وسريع مجاناً</span>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Modal for Clearing Cart */}
      <ConfirmModal
        isOpen={showClearConfirm}
        title="تفريغ سلة المشتريات"
        message="هل أنت متأكد من رغبتك في حذف جميع المنتجات من سلة التسوق؟"
        subMessage="لا يمكن التراجع عن هذا الإجراء وسيتم إفراغ محتويات السلة بالكامل."
        confirmText="نعم، إفراغ السلة"
        cancelText="إلغاء والاحتفاظ بالمنتجات"
        confirmIcon="fa-solid fa-trash-can"
        confirmType="danger"
        onConfirm={() => {
          onClearCart();
          setShowClearConfirm(false);
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
}
