export default function EmptyState({ onRefresh, onResetSearch }) {
  return (
    <div className="noon-empty-state">
      <div className="noon-empty-icon">
        <i className="fa-solid fa-box-open" style={{ fontSize: "2.5rem", color: "#64748b" }}></i>
      </div>

      <h3 className="noon-empty-title">مفيش منتجات</h3>
      <p className="noon-empty-desc">
        لم نتمكن من العثور على أي منتجات مطابقة لطلبك في الوقت الحالي.
      </p>

      <div className="noon-empty-actions">
        {onResetSearch && (
          <button className="noon-btn-primary" onClick={onResetSearch}>
            <i className="fa-solid fa-arrow-rotate-right" style={{ marginLeft: "6px" }}></i>
            إعادة تعيين البحث
          </button>
        )}
        {onRefresh && (
          <button className="noon-btn-secondary" onClick={onRefresh}>
            <i className="fa-solid fa-rotate" style={{ marginLeft: "6px" }}></i>
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  );
}
