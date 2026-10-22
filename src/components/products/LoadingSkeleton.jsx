export default function LoadingSkeleton() {
  const skeletonCards = Array.from({ length: 12 });

  return (
    <div className="noon-loading-container">
      <div className="noon-spinner-row">
        <div className="noon-spinner"></div>
        <span className="noon-loading-text">جاري تحميل أحدث المنتجات من متجر خضرة (KHADRA)...</span>
      </div>

      <div className="noon-products-grid">
        {skeletonCards.map((_, index) => (
          <div key={index} className="noon-skeleton-card">
            <div className="noon-skeleton-img shimmer"></div>
            <div className="noon-skeleton-body">
              <div className="noon-skeleton-line short shimmer"></div>
              <div className="noon-skeleton-line title shimmer"></div>
              <div className="noon-skeleton-line price shimmer"></div>
              <div className="noon-skeleton-line button shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
