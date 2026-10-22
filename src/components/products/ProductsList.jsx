import { useState, useEffect, useRef } from "react";
import NoonNavbar from "./NoonNavbar";
import FlashDealBanner from "./FlashDealBanner";
import ProductCard from "./ProductCard";
import ProductQuickViewModal from "./ProductQuickViewModal";
import LoadingSkeleton from "./LoadingSkeleton";
import EmptyState from "./EmptyState";
import CartPage from "../cart/CartPage";
import WishlistPage from "../wishlist/WishlistPage";
import HomePage from "../home/HomePage";
import ProductsPage from "./ProductsPage";
import FloatingCouponPopup from "../common/FloatingCouponPopup";
import { fetchVegetablesAPI, VEGETABLE_CATEGORIES } from "../../data/vegetablesData";
import "./Products.css";

const ITEMS_PER_PAGE = 12; // 3 rows * 4 columns = 12 products per page

export default function ProductsList() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // View state: "home", "products", "cart", or "wishlist" (Single Page Application SPA)
  const [currentView, setCurrentView] = useState("home");

  // Site-wide Floating Promo Coupon Popup (Dismissible with [X])
  const [isCouponPopupOpen, setIsCouponPopupOpen] = useState(true);

  // Dynamic Cart State (persisted to localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("esoo_cart_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Dynamic Wishlist State (persisted to localStorage)
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("esoo_wishlist_items");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("esoo_cart_items", JSON.stringify(cart));
  }, [cart]);

  // Sync wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("esoo_wishlist_items", JSON.stringify(wishlist));
  }, [wishlist]);

  const topAnchorRef = useRef(null);

  // Total items in cart for navbar badge
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Add to cart handler
  const handleAddToCart = (product, qty = 1, openCart = false) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [
        ...prevCart,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail,
          brand: product.brand,
          shippingInformation: product.shippingInformation,
          stock: product.stock,
          quantity: qty,
        },
      ];
    });

    if (openCart) {
      setCurrentView("cart");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Instant Buy Now handler (Adds to cart & immediately opens full cart page)
  const handleBuyNow = (product, qty = 1) => {
    handleAddToCart(product, qty, true);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Remove single item from cart
  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear all items in cart
  const handleClearCart = () => {
    setCart([]);
  };

  // Toggle item in Wishlist (Add if not present, Remove if present)
  const handleToggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        return prevWishlist.filter((item) => item.id !== product.id);
      }
      return [
        ...prevWishlist,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          discountPercentage: product.discountPercentage,
          thumbnail: product.thumbnail,
          brand: product.brand,
          rating: product.rating,
          shippingInformation: product.shippingInformation,
          stock: product.stock,
        },
      ];
    });
  };

  // Remove item from Wishlist
  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // Clear all items from Wishlist
  const handleClearWishlist = () => {
    setWishlist([]);
  };

  // Fetch products with pagination (Limit & Skip) - 100% Fresh Farm Vegetables
  const fetchProducts = async (page = currentPage, category = selectedCategory, search = searchQuery) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchVegetablesAPI({
        page,
        limit: ITEMS_PER_PAGE,
        category,
        search,
      });

      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
    } catch (err) {
      console.error("Error fetching vegetables:", err);
      setError("حدث خطأ أثناء تحميل الخضروات الطازجة. يرجى التحقق من اتصالك والمحاولة ثانية.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when page, category changes
  useEffect(() => {
    fetchProducts(currentPage, selectedCategory, searchQuery);
  }, [currentPage, selectedCategory]);

  // Handle Search Input
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    if (currentView !== "products") {
      setCurrentView("products");
    }
    const timer = setTimeout(() => {
      fetchProducts(1, selectedCategory, query);
    }, 400);
    return () => clearTimeout(timer);
  };

  // Handle Category selection
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    if (currentView !== "products") {
      setCurrentView("products");
    }
  };

  // Handle Page Change with smooth scroll
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (topAnchorRef.current) {
      topAnchorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div className="noon-app-wrapper" ref={topAnchorRef}>
      {/* 1. Authentic Noon-style Navbar */}
      <NoonNavbar
        categories={VEGETABLE_CATEGORIES}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        currentView={currentView}
        onOpenCart={() => {
          setCurrentView("cart");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenWishlist={() => {
          setCurrentView("wishlist");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onGoHome={() => {
          setCurrentView("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onGoProducts={() => {
          setCurrentView("products");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* 2. SPA View Routing */}
      {currentView === "home" ? (
        /* Home Page with custom hook, hero slider, flash deals, categories & best sellers */
        <HomePage
          onNavigateToProducts={() => {
            setCurrentView("products");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onSelectCategory={(catId) => {
            handleCategorySelect(catId);
          }}
          onAddToCart={(p) => handleAddToCart(p, 1, false)}
          onBuyNow={(p) => handleBuyNow(p, 1)}
          cart={cart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      ) : currentView === "cart" ? (
        /* Full Cart Page View */
        <CartPage
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onBackToShopping={() => {
            setCurrentView("products");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : currentView === "wishlist" ? (
        /* Full Wishlist / Favorites Page View */
        <WishlistPage
          wishlist={wishlist}
          cart={cart}
          onRemoveFromWishlist={handleRemoveFromWishlist}
          onClearWishlist={handleClearWishlist}
          onAddToCart={(p) => handleAddToCart(p, 1, false)}
          onBuyNow={(p) => handleBuyNow(p, 1)}
          onBackToShopping={() => {
            setCurrentView("products");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onQuickView={(p) => setQuickViewProduct(p)}
        />
      ) : (
        /* Products Catalog Page View (Independent SPA Page) */
        <ProductsPage
          products={products}
          totalProducts={totalProducts}
          totalPages={totalPages}
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          loading={loading}
          error={error}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          onPageChange={handlePageChange}
          onRefresh={() => fetchProducts(currentPage, selectedCategory, searchQuery)}
          onResetSearch={() => {
            setSearchQuery("");
            setSelectedCategory("all");
            fetchProducts(1, "all", "");
          }}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={(p) => handleAddToCart(p, 1, false)}
          onBuyNow={(p) => handleBuyNow(p, 1)}
          cart={cart}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onUpdateQuantity={handleUpdateQuantity}
        />
      )}

      {/* 5. Creative Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickViewModal
          product={quickViewProduct}
          isFavorite={wishlist.some((w) => w.id === quickViewProduct.id)}
          onToggleWishlist={handleToggleWishlist}
          cartQuantity={cart.find((item) => item.id === quickViewProduct.id)?.quantity || 0}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={(p, qty) => handleAddToCart(p, qty, false)}
          onBuyNow={(p, qty) => handleBuyNow(p, qty)}
        />
      )}

      {/* 6. Site-wide Floating Promo Coupon Popup (Dismissible with [X]) */}
      {isCouponPopupOpen && (
        <FloatingCouponPopup
          code="ESOO20"
          onUseCoupon={() => {
            if (cart.length > 0) {
              setCurrentView("cart");
            } else {
              setCurrentView("products");
            }
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onClose={() => setIsCouponPopupOpen(false)}
        />
      )}

      {/* Clean Minimal Footer */}
      <footer className="noon-footer">
        <div className="noon-footer-inner">
          <div className="noon-footer-feature">
            <div className="feat-icon">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <strong>دفع آمن 100%</strong>
              <p>بطاقات ائتمان أو الدفع عند الاستلام</p>
            </div>
          </div>

          <div className="noon-footer-feature">
            <div className="feat-icon">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <div>
              <strong>توصيل خضرة إكسبريس (KHADRA Express)</strong>
              <p>من قلب المزرعة لبيتك فائق السرعة</p>
            </div>
          </div>

          <div className="noon-footer-feature">
            <div className="feat-icon">
              <i className="fa-solid fa-arrow-rotate-left"></i>
            </div>
            <div>
              <strong>إرجاع سهل ومجاني</strong>
              <p>إمكانية الإرجاع خلال 14 يوماً بكل سهولة</p>
            </div>
          </div>
        </div>

        <div className="noon-footer-bottom">
          <p>© 2026 KHADRA | خضرة — من قلب المزرعة لبيتك. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
