import khadraLogo from "../../assets/khadra-logo-transparent.png";

export default function OrderReceipt({ order, onBackToShopping, onNewOrder }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const {
    orderId,
    date,
    customer,
    items,
    subtotal,
    discountAmount,
    discountPercent,
    shippingFee,
    grandTotal,
    paymentMethod,
  } = order;

  return (
    <div className="khadra-receipt-wrapper">
      {/* Non-printed action bar for screen only */}
      <div className="receipt-screen-actions no-print">
        <div className="receipt-success-badge">
          <div className="success-icon-pulse">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div>
            <h2 className="receipt-success-title">تم تأكيد طلبك بنجاح! 🎉</h2>
            <p className="receipt-success-subtitle">
              شكراً لتسوقك من خضرة. تم استلام طلبك وجارٍ تجهيزه ليصلك طازجاً من قلب المزرعة.
            </p>
          </div>
        </div>

        <div className="receipt-btns-group">
          <button className="receipt-print-btn" onClick={handlePrint} title="طباعة الفاتورة أو حفظها كـ PDF">
            <i className="fa-solid fa-print"></i>
            <span>طباعة الفاتورة / حفظ PDF</span>
          </button>

          <button className="receipt-continue-btn" onClick={onBackToShopping} title="متابعة التسوق">
            <i className="fa-solid fa-bag-shopping"></i>
            <span>متابعة التسوق</span>
          </button>
        </div>
      </div>

      {/* The Printable Official Receipt / Invoice */}
      <div className="khadra-invoice-sheet" id="printable-invoice">
        {/* Invoice Header */}
        <div className="invoice-header-bar">
          <div className="invoice-brand-col">
            <div className="invoice-logo-badge">
              <img src={khadraLogo} alt="خضرة KHADRA" className="invoice-logo-img" />
            </div>
            <div className="invoice-brand-text">
              <h1 className="invoice-company-name">خضرة | KHADRA</h1>
              <p className="invoice-company-tagline">من قلب المزرعة لبيتك — خضروات طازجة 100%</p>
            </div>
          </div>

          <div className="invoice-meta-col">
            <div className="invoice-type-pill">فاتورة شراء إلكترونية / إيصال استلام</div>
            <div className="invoice-meta-item">
              <span className="meta-label">رقم الطلب:</span>
              <strong className="meta-value order-num">{orderId}</strong>
            </div>
            <div className="invoice-meta-item">
              <span className="meta-label">التاريخ والوقت:</span>
              <span className="meta-value">{date}</span>
            </div>
            <div className="invoice-meta-item">
              <span className="meta-label">حالة الطلب:</span>
              <span className="meta-value status-badge confirmed">
                <i className="fa-solid fa-circle-check"></i> مؤكد — قيد التجهيز
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="invoice-divider"></div>

        {/* Customer & Shipping Details Grid */}
        <div className="invoice-details-grid">
          <div className="invoice-card-box">
            <h3 className="invoice-box-title">
              <i className="fa-solid fa-user-tag"></i> بيانات المشتري
            </h3>
            <div className="invoice-info-row">
              <span className="info-title">الاسم:</span>
              <span className="info-val">{customer.fullName}</span>
            </div>
            <div className="invoice-info-row">
              <span className="info-title">رقم الهاتف:</span>
              <span className="info-val" dir="ltr">{customer.phone}</span>
            </div>
            {customer.notes && (
              <div className="invoice-info-row">
                <span className="info-title">ملاحظات العميل:</span>
                <span className="info-val notes">{customer.notes}</span>
              </div>
            )}
          </div>

          <div className="invoice-card-box">
            <h3 className="invoice-box-title">
              <i className="fa-solid fa-location-dot"></i> تفاصيل التوصيل
            </h3>
            <div className="invoice-info-row">
              <span className="info-title">المحافظة / المدينة:</span>
              <span className="info-val">{customer.governorate}</span>
            </div>
            <div className="invoice-info-row">
              <span className="info-title">العنوان بالتفصيل:</span>
              <span className="info-val">{customer.address}</span>
            </div>
            <div className="invoice-info-row">
              <span className="info-title">الموعد المفضل:</span>
              <span className="info-val highlight-val">{customer.deliveryTime || "في أقرب وقت متاح"}</span>
            </div>
          </div>

          <div className="invoice-card-box">
            <h3 className="invoice-box-title">
              <i className="fa-solid fa-wallet"></i> طريقة الدفع
            </h3>
            <div className="invoice-info-row">
              <span className="info-title">وسيلة السداد:</span>
              <span className="info-val payment-tag">{paymentMethod}</span>
            </div>
            <div className="invoice-info-row">
              <span className="info-title">حالة السداد:</span>
              <span className="info-val">
                {paymentMethod.includes("عند الاستلام") ? "مستحق الدفع عند الاستلام" : "مدفوع إلكترونياً"}
              </span>
            </div>
            <div className="invoice-info-row">
              <span className="info-title">نوع التوصيل:</span>
              <span className="info-val">شحن خضرة إكسبريس (طازج)</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="invoice-items-table-wrapper">
          <table className="invoice-table">
            <thead>
              <tr>
                <th className="th-num">#</th>
                <th className="th-item">المنتج / الصنف</th>
                <th className="th-price">سعر الوحدة</th>
                <th className="th-qty">الكمية</th>
                <th className="th-total">الإجمالي</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                const itemTotal = (item.price * item.quantity).toFixed(2);
                return (
                  <tr key={item.id || index}>
                    <td className="td-num">{index + 1}</td>
                    <td className="td-item">
                      <div className="td-item-content">
                        {item.thumbnail && (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="td-item-thumb no-print"
                          />
                        )}
                        <div>
                          <strong className="td-item-name">{item.title}</strong>
                          {item.brand && <span className="td-item-brand">{item.brand}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="td-price">{item.price.toFixed(2)} ج.م</td>
                    <td className="td-qty">{item.quantity}</td>
                    <td className="td-total"><strong>{itemTotal} ج.م</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Stamp Footer */}
        <div className="invoice-bottom-section">
          {/* Terms & Stamp */}
          <div className="invoice-stamp-col">
            <div className="invoice-guarantee-box">
              <h4><i className="fa-solid fa-leaf"></i> ضمان جودة خضرة:</h4>
              <p>
                جميع منتجاتنا مقطوفة فجراً ومفروزة بعناية فائقة. يحق للعميل معاينة الطلبية والتأكد من جودة الخضروات فور الاستلام.
              </p>
            </div>

            <div className="invoice-official-stamp">
              <div className="stamp-circle">
                <span className="stamp-top">معتمد رسمي</span>
                <span className="stamp-brand">KHADRA خضرة</span>
                <span className="stamp-date">{date.split(" ")[0]}</span>
                <span className="stamp-bottom">100% طازج وعضوي</span>
              </div>
              <div className="invoice-barcode">
                <div className="barcode-lines"></div>
                <span className="barcode-text">*{orderId.replace("#", "")}*</span>
              </div>
            </div>
          </div>

          {/* Pricing Totals Box */}
          <div className="invoice-totals-col">
            <div className="totals-table">
              <div className="totals-row">
                <span>المجموع الفرعي ({items.reduce((s, i) => s + i.quantity, 0)} عناصر):</span>
                <span>{subtotal.toFixed(2)} ج.م</span>
              </div>

              {discountAmount > 0 && (
                <div className="totals-row discount">
                  <span>خصم كوبون التوفير ({discountPercent}%):</span>
                  <span>-{discountAmount.toFixed(2)} ج.م</span>
                </div>
              )}

              <div className="totals-row">
                <span>مصاريف الشحن والتوصيل:</span>
                <span>{shippingFee === 0 ? "مجاناً (عرض خضرة)" : `${shippingFee.toFixed(2)} ج.م`}</span>
              </div>

              <div className="totals-divider"></div>

              <div className="totals-row grand-total">
                <span>المبلغ الإجمالي المستحق:</span>
                <span className="grand-val">{grandTotal.toFixed(2)} ج.م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Footer Notes */}
        <div className="invoice-sheet-footer">
          <p>
            شكراً لثقتكم في خضرة — خدمة العملاء: 19842 | البريد: support@khadra.farm | القاهرة، مصر
          </p>
          <p className="no-print print-tip">
            <i className="fa-solid fa-circle-info"></i> نصيحة: يمكنك الضغط على زر "طباعة الفاتورة" بالأعلى لحفظ نسخة PDF أو طباعتها ورقياً.
          </p>
        </div>
      </div>
    </div>
  );
}
