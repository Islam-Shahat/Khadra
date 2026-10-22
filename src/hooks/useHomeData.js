import { useState, useEffect, useCallback, useRef } from "react";
import { VEGETABLES_DATABASE, VEGETABLE_CATEGORIES } from "../data/vegetablesData";

const HERO_SLIDES = [
  {
    id: 1,
    tag: "حصاد اليوم من مزارعنا",
    title: "مهرجان الخضروات الطازجة والعضوية",
    subtitle: "أفضل أنواع الطماطم، الخيار، الورقيات والخضار المقطوفة صباح اليوم مباشرة من الأرض إلى مائدتك مع توصيل سريع.",
    badge: "وفر حتى 30%",
    badgeColor: "#29572C",
    accent: "#8DA432",
    category: "all",
    image: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1200&q=80",
    cta: "تسوق خضار اليوم",
    highlight: "شحن فوري طازج لنفس اليوم",
  },
  {
    id: 2,
    tag: "خضروات ثمرية مقرمشة",
    title: "طماطم بلدي، خيار صوبة وفلفل ألوان",
    subtitle: "نكهة المزرعة الأصلية وقرمشة لا تقاوم، خالية تماماً من المبيدات الكيميائية ومضمونة الجودة 100%.",
    badge: "خصم حصري 20%",
    badgeColor: "#8DA432",
    accent: "#8DA432",
    category: "fruity",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=80",
    cta: "اكتشف الخضار الثمري",
    highlight: "مقطوف فجراً من الشجر",
  },
  {
    id: 3,
    tag: "ورقيات وسلطات خضراء",
    title: "جرجير، خس كابوتشا، سبانخ ونعناع بلدي",
    subtitle: "حزم ورقية طازجة تروى بمياه نقية، غنية بالفيتامينات والمعادن لإعداد أشهى أطباق السلطة الصحية يومياً.",
    badge: "طازج 100%",
    badgeColor: "#365006",
    accent: "#8DA432",
    category: "leafy",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
    cta: "تصفح الورقيات الطازجة",
    highlight: "مغسولة ومفرزة بعناية فائقة",
  },
  {
    id: 4,
    tag: "عروض التوفير العائلية",
    title: "صندوق خضار الأسبوع الاقتصادي",
    subtitle: "تشكيلة متكاملة من البطاطس والبصل والجزر والطماطم تكفي احتياجات الأسرة لمدة أسبوع كامل بأفضل سعر.",
    badge: "توفير عائلي 25%",
    badgeColor: "#925E08",
    accent: "#8DA432",
    category: "weekly_box",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    cta: "اطلب بوكس العائلة",
    highlight: "شحن مجاني للبوكسات الكبيرة",
  },
];

const CATEGORIES_DATA = [
  {
    id: "all",
    name: "كل الخضروات",
    icon: "fa-solid fa-seedling",
    badge: "كل الأصناف",
    color: "#29572C",
    textColor: "#ffffff",
  },
  {
    id: "fruity",
    name: "طماطم وخيار وفلفل",
    icon: "fa-solid fa-apple-whole",
    badge: "طازج ومقرمش",
    color: "#e8f5e9",
    textColor: "#29572C",
  },
  {
    id: "leafy",
    name: "ورقيات وسلطة",
    icon: "fa-solid fa-leaf",
    badge: "حصاد الفجر",
    color: "#f1f8e9",
    textColor: "#365006",
  },
  {
    id: "roots",
    name: "بطاطس وبصل وجزر",
    icon: "fa-solid fa-carrot",
    badge: "أساس المطبخ",
    color: "#fff3e0",
    textColor: "#925E08",
  },
  {
    id: "organic",
    name: "عضوي ومميز",
    icon: "fa-solid fa-box-open",
    badge: "طبيعي 100%",
    color: "#e0f2f1",
    textColor: "#1b5e20",
  },
  {
    id: "weekly_box",
    name: "البوكس الأسبوعي",
    icon: "fa-solid fa-box-archive",
    badge: "وفر حتى 35%",
    color: "#fef3c7",
    textColor: "#92400e",
  },
];

export default function useHomeData() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [flashDeals, setFlashDeals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [activeTab, setActiveTab] = useState("flash"); // "flash", "bestSellers", "topRated"

  // Live countdown timer for Flash Deals (counts down to 8h 45m 00s cycle)
  const [countdown, setCountdown] = useState({
    hours: "08",
    minutes: "42",
    seconds: "15",
  });

  const timerRef = useRef(null);

  // 1. Load featured farm vegetables for the home page showcase
  useEffect(() => {
    let isMounted = true;

    async function loadHomeContent() {
      setLoading(true);
      setError(null);
      try {
        // Use authentic KHADRA fresh vegetables database
        await new Promise((resolve) => setTimeout(resolve, 80));

        if (isMounted) {
          const allProds = [...VEGETABLES_DATABASE];

          // 1. Flash Deals / Clearance: Vegetables with highest discount percentage or limited harvest stock
          const lowStockDeals = allProds
            .filter((p) => (p.discountPercentage && p.discountPercentage >= 15) || p.stock <= 25)
            .sort((a, b) => b.discountPercentage - a.discountPercentage)
            .slice(0, 8);

          // 2. Best Sellers: Popular top-rated farm vegetables (rating >= 4.8)
          const topBestSellers = allProds
            .filter((p) => (p.rating || 0) >= 4.75)
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8);

          setFlashDeals(lowStockDeals);
          setBestSellers(topBestSellers.length > 0 ? topBestSellers : allProds.slice(0, 8));
        }
      } catch (err) {
        if (isMounted) {
          console.error("Home data error:", err);
          setError("تعذر تحميل الخضروات المميزة، يرجى إعادة المحاولة.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadHomeContent();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Banner Slider Auto-play timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // 3. Live countdown calculation
  useEffect(() => {
    // End target: 8 hours from initial load
    const targetTime = new Date().getTime() + 8 * 60 * 60 * 1000 + 42 * 60 * 1000 + 15 * 1000;

    timerRef.current = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance <= 0) {
        clearInterval(timerRef.current);
        setCountdown({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        hours: String(h).padStart(2, "0"),
        minutes: String(m).padStart(2, "0"),
        seconds: String(s).padStart(2, "0"),
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Slider navigation functions
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setActiveSlide(index);
  }, []);

  // Copy coupon handler
  const copyCouponCode = useCallback((code = "KHADRA20") => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        setCopiedCoupon(true);
        setTimeout(() => setCopiedCoupon(false), 2500);
      });
    } else {
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2500);
    }
  }, []);

  return {
    slides: HERO_SLIDES,
    activeSlide,
    nextSlide,
    prevSlide,
    goToSlide,
    isPaused,
    setIsPaused,
    categories: CATEGORIES_DATA,
    flashDeals,
    bestSellers,
    countdown,
    loading,
    error,
    copiedCoupon,
    copyCouponCode,
    activeTab,
    setActiveTab,
  };
}
