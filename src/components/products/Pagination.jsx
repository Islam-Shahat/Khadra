export default function Pagination({
  currentPage = 1,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 12,
}) {
  // Calculate reliable pages count with fallback from totalItems and itemsPerPage
  const pagesCount = Math.max(
    1,
    Number(totalPages) || Math.ceil((totalItems || 0) / (itemsPerPage || 12)) || 1
  );

  if (!totalItems || totalItems === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Helper to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (pagesCount <= maxVisible + 2) {
      for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(pagesCount - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < pagesCount - 2) {
        pages.push("...");
      }
      if (!pages.includes(pagesCount)) {
        pages.push(pagesCount);
      }
    }

    // Strict filter to guarantee no undefined, null, or NaN buttons
    return pages.filter(
      (p) => (typeof p === "number" && !isNaN(p) && p > 0) || p === "..."
    );
  };

  return (
    <nav className="noon-pagination-container" aria-label="Products Pagination">
      <div className="noon-pagination-info">
        عرض <strong>{startItem} - {endItem}</strong> من إجمالي <strong>{totalItems}</strong> منتج
      </div>

      <div className="noon-pagination-controls">
        {/* Previous Button (RTL: right arrow goes previous) */}
        <button
          className="noon-page-btn noon-page-nav"
          onClick={() => onPageChange && onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous Page"
        >
          <i className="fa-solid fa-chevron-right" style={{ fontSize: "0.8rem" }}></i>
          <span className="noon-nav-text">السابق</span>
        </button>

        {/* Page Numbers */}
        <div className="noon-page-numbers">
          {getPageNumbers().map((page, idx) =>
            page === "..." ? (
              <span key={`dots-${idx}`} className="noon-page-dots">
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                className={`noon-page-btn noon-page-number ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => onPageChange && onPageChange(page)}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next Button (RTL: left arrow goes next) */}
        <button
          className="noon-page-btn noon-page-nav"
          onClick={() => onPageChange && onPageChange(currentPage + 1)}
          disabled={currentPage >= pagesCount}
          aria-label="Next Page"
        >
          <span className="noon-nav-text">التالي</span>
          <i className="fa-solid fa-chevron-left" style={{ fontSize: "0.8rem" }}></i>
        </button>
      </div>
    </nav>
  );
}
