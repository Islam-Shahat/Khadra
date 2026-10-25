import { useState, useMemo, useRef } from "react";
import "./AboutPage.css";

export default function AboutPage({ onNavigateToProducts, onNavigateToHome }) {
  // Video Player Ref
  const videoRef = useRef(null);
  const [videoSrc] = useState("/videos/about-video.mp4");
  const [videoError, setVideoError] = useState(false);
  const [videoName] = useState(() => {
    try {
      return localStorage.getItem("khadra_about_video_name") || "khadraWeb#1080.mp4";
    } catch {
      return "khadraWeb#1080.mp4";
    }
  });

  // FAQ Active Accordion Item (-1 means none or start with first one open)
  const [activeFaq, setActiveFaq] = useState(0);
  const [faqCategory, setFaqCategory] = useState("all");
  const [faqSearch, setFaqSearch] = useState("");

  // Team Members Data (7 Members across 4 Tracks)
  const teamMembers = [
    {
      id: 1,
      nameAr: "م. إسلام شحات",
      nameEn: "Islam Shahat",
      roleAr: "مهندس برمجيات (قائد الفريق)",
      roleEn: "Software Engineer (Lead)",
      trackId: "martiec",
      trackName: "تراك هندسة البرمجيات (Martiec)",
      trackBadge: "Martiec",
      avatarIcon: "fa-solid fa-laptop-code",
      bio: "بناء الهيكل البرمجي للمنصة، وإدارة الحالة وتكامل الأنظمة وتطوير واجهات المستخدم التفاعلية.",
      skills: ["React 19", "Software Architecture", "State Management", "Full-Stack Web"],
      isLead: true,
    },
    {
      id: 2,
      nameAr: "م. حسناء أحمد",
      nameEn: "Hassna Ahmed",
      roleAr: "مهندسة برمجيات",
      roleEn: "Software Engineer",
      trackId: "martiec",
      trackName: "تراك هندسة البرمجيات (Martiec)",
      trackBadge: "Martiec",
      avatarIcon: "fa-solid fa-code",
      bio: "تطوير ميزات الكتالوج وسلة المشتريات والتحقق من صحة المدخلات وضمان استجابة وتوافق الواجهات.",
      skills: ["Frontend Web", "React Hooks", "Clean Code", "UI Components"],
      isLead: false,
    },
    {
      id: 3,
      nameAr: "م. نسمة أحمد",
      nameEn: "Nesma Ahmed",
      roleAr: "مهندسة برمجيات",
      roleEn: "Software Engineer",
      trackId: "martiec",
      trackName: "تراك هندسة البرمجيات (Martiec)",
      trackBadge: "Martiec",
      avatarIcon: "fa-solid fa-terminal",
      bio: "برمجة تدفق البيانات والفلترة اللحظية وتحسين سرعة استجابة المنصة واختبارات الجودة البرمجية.",
      skills: ["UI Engineering", "Performance", "State Sync", "Testing & Debugging"],
      isLead: false,
    },
    {
      id: 4,
      nameAr: "يحيى زكريا",
      nameEn: "Yahia Zakria",
      roleAr: "أخصائي تسويق رقمي",
      roleEn: "Marketing Specialist",
      trackId: "marketing",
      trackName: "تراك التسويق الرقمي (Marketing)",
      trackBadge: "Marketing",
      avatarIcon: "fa-solid fa-bullhorn",
      bio: "إدارة الحملات التسويقية، دراسة سوق الخضار العضوي، وتحليل تفاعل العملاء وتوسيع انتشار المنصة.",
      skills: ["Digital Marketing", "Campaign Management", "Market Growth", "Analytics"],
      isLead: false,
    },
    {
      id: 5,
      nameAr: "سلمى محمد",
      nameEn: "Salma Mohamed",
      roleAr: "مونتير ومحررة فيديو",
      roleEn: "Video Editor & Motion Creator",
      trackId: "video",
      trackName: "تراك المونتاج والفيديو (Video)",
      trackBadge: "Video",
      avatarIcon: "fa-solid fa-film",
      bio: "صناعة وتعديل الفيديوهات الترويجية للمزارع والمنتجات الطازجة، وتنسيق المحتوى البصري الجذاب للمنصة.",
      skills: ["Video Editing", "Motion Graphics", "Visual Storytelling", "Post-Production"],
      isLead: false,
    },
    {
      id: 6,
      nameAr: "نعمة أمين",
      nameEn: "Neama Amin",
      roleAr: "مصممة واجهات وتجربة مستخدم",
      roleEn: "UI/UX Designer",
      trackId: "design",
      trackName: "تراك التصميم الإبداعي (Design)",
      trackBadge: "Design",
      avatarIcon: "fa-solid fa-bezier-curve",
      bio: "تصميم رحلة المستخدم التفاعلية (UX/UI)، وبناء واجهات مريحة للعين ومتوافقة مع المعايير العالمية.",
      skills: ["UI/UX Design", "Figma", "User Journey", "Wireframing"],
      isLead: false,
    },
    {
      id: 7,
      nameAr: "آية عبد الناصر",
      nameEn: "Aya Abdelnaser",
      roleAr: "مصممة جرافيك وواجهات",
      roleEn: "Graphic & UI Designer",
      trackId: "design",
      trackName: "تراك التصميم الإبداعي (Design)",
      trackBadge: "Design",
      avatarIcon: "fa-solid fa-wand-magic-sparkles",
      bio: "ابتكار الهوية البصرية، تصميم البانرات الترويجية والعناصر الجمالية لضمان تجربة بصرية متكاملة.",
      skills: ["Graphic Design", "Visual Identity", "Branding Assets", "Creative Direction"],
      isLead: false,
    },
  ];

  // FAQ Data with categories
  const faqList = [
    {
      id: 1,
      category: "quality",
      question: "كيف تضمن منصة خضرة أن الخضروات طازجة اليوم وليست مبيتة؟",
      answer:
        "نحن نعتمد نظام القطاف اليومي المباشر فجراً بالتعاون مع شبكة مزارعنا الشريكة. لا نقوم بتخزين الخضروات في ثلاجات لأيام، بل يُحصد المحصول فجر كل يوم ويُفرز يدوياً ويُنقل مباشرة إلى مطبخك في نفس اليوم بأعلى درجات النضارة والقيمة الغذائية.",
    },
    {
      id: 2,
      category: "delivery",
      question: "ما هي مدة وتكلفة توصيل خضرة إكسبريس (KHADRA Express)؟",
      answer:
        "يتميز أسطولنا بالنقل السريع المجهز بحقائب حرارية لحفظ برودة ونضارة الورقيات. التوصيل يتم عادة خلال 40 إلى 50 دقيقة فقط من تأكيد الطلب، كما أن الشحن مجاني للطلبات التي تتجاوز قيمتها 200 ج.م أو عند استخدام كوبون الشحن المجاني.",
    },
    {
      id: 3,
      category: "guarantee",
      question: "هل يحق لي معاينة وفحص الخضار أمام الكابتن قبل الاستلام والدفع؟",
      answer:
        "نعم 100%! سياستنا الصارمة ترتكز على 'حق المعاينة بالكامل'. لك كامل الحرية في فتح البوكس ومراجعة نقاء وخضار كل صنف قبل الاستلام أو السداد، ورضاك التام هو أولويتنا الأولى دائماً.",
    },
    {
      id: 4,
      category: "offers",
      question: "كيف أستفيد من كود الخصم (ESOO20) وكوبونات التوفير؟",
      answer:
        "ببساطة أضف المنتجات إلى سلة المشتريات، وعند الذهاب لصفحة السلة قم بكتابة كود الخصم ESOO20 في خانة الكوبون واضغط 'تطبيق الكوبون'. سيتم خصم 20% فوراً على إجمالي فاتورتك بدون حد أدنى معقد.",
    },
    {
      id: 5,
      category: "guarantee",
      question: "ماذا أفعل إذا وصلني صنف غير مطابق أو ثمرة تالفة؟",
      answer:
        "نوفر لك 'ضمان الرضا الذهبي'. في حال وجود أي ملاحظة على أي ثمرة، يمكنك استبدالها فوراً مع الكابتن أو التواصل معنا عبر الواتساب لتعويضك الفوري برد المبلغ لمحفظتك أو إرسال صنف بديل طازج مجاناً بدون أي جدال.",
    },
    {
      id: 6,
      category: "offers",
      question: "هل توفر خضرة بوكسات أسبوعية عائلية وبأسعار مخفضة؟",
      answer:
        "نعم! وفرنا قسم 'بوكس التوفير الأسبوعي' المصمم خصيصاً لاحتياجات البيت اليومية (طماطم، خيار، بطاطس، بصل، ليمون، وجرجير وخضروات طهي) بخصم توفيري يصل إلى 35% مقارنة بشراء الأصناف منفصلة.",
    },
    {
      id: 7,
      category: "delivery",
      question: "ما هي وسائل الدفع المقبولة في المنصة؟",
      answer:
        "نقبل الدفع نقداً عند الاستلام (Cash on Delivery)، والمحافظ الإلكترونية الذكية (فودافون كاش، اتصالات كاش، أورانج كاش، وي باي)، بالإضافة إلى بطاقات الدفع البنكية وفيزا وماستركارد وكارت ميزة الوطني بأعلى معايير التشفير والأمان.",
    },
    {
      id: 8,
      category: "quality",
      question: "كيف يتم تغليف الخضروات والورقيات الحساسة أثناء النقل؟",
      answer:
        "نستخدم عبوات صديقة للبيئة مصنوعة من ورق الكرافت الصحي المسامي القابل للتحلل، مع عزل ورقي خاص للورقيات الخضراء يحافظ على رطوبتها الطبيعية ويمنع ذبولها أو احتباس الحرارة بداخلها حتى تصلك كأنك قطفتها بنفسك.",
    },
  ];

  // Filter FAQ items
  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const matchCategory = faqCategory === "all" || item.category === faqCategory;
      const matchSearch =
        !faqSearch.trim() ||
        item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
        item.answer.toLowerCase().includes(faqSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [faqCategory, faqSearch]);

  const toggleAccordion = (index) => {
    setActiveFaq((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className="about-page-container">
      {/* 1. Hero Showcase Section (Split 50% / 50% with Video Player) */}
      <section className="about-hero-section">
        <div className="about-hero-split-grid">
          {/* Right Column: Hero Content & CTAs */}
          <div className="about-hero-content-col">
            <div className="about-badge-chip">
              <i className="fa-solid fa-leaf"></i>
              <span>من نحن | قصة خضرة ورؤيتنا</span>
            </div>

            <h1 className="about-hero-title">
              من قلب التربة الخصبة إلى مائدتكم..
              <span className="about-title-highlight"> نَقاء، طزاجة، وشغف مستمر </span>
            </h1>

            <p className="about-hero-desc">
              انطلقت منصة <strong>خضرة (KHADRA)</strong> كجسر مباشر يربط بين المزارع المصرية
              الأصيلة والمنازل الباحثة عن الصحة والنضارة الحقيقية. ألغينا الوسطاء وسلاسل
              التخزين الطويلة، لنضمن لك خضاراً مقطوفاً فجر اليوم يصل باب بيتك خلال دقائق معدودة.
            </p>

            <div className="about-hero-actions">
              <button
                className="about-btn-primary"
                onClick={() => {
                  onNavigateToProducts && onNavigateToProducts();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <i className="fa-solid fa-basket-shopping"></i>
                <span>تصفح خضروات اليوم الطازجة</span>
              </button>

              <button
                className="about-btn-secondary"
                onClick={() => {
                  const el = document.getElementById("faq-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <i className="fa-solid fa-circle-question"></i>
                <span>الأسئلة الشائعة</span>
              </button>
            </div>
          </div>

          {/* Left Column: Local Video Player Card */}
          <div className="about-hero-video-col">
            <div className="hero-video-card-frame">
              {/* Header Bar */}
              <div className="video-card-top-bar">
                <div className="video-pill-tag">
                  <span className="recording-dot"></span>
                  <i className="fa-solid fa-play"></i>
                  <span>فيديو تعريفي عن خضرة</span>
                </div>
              </div>

              {/* Video Player Display */}
              {!videoError ? (
                <div className="hero-video-player-wrapper">
                  <video
                    ref={videoRef}
                    key={videoSrc}
                    controls
                    playsInline
                    preload="metadata"
                    className="hero-native-video"
                    onError={() => setVideoError(true)}
                  >
                    <source src="/videos/about-video.mp4" type="video/mp4" />
                    <source src="/videos/khadraWeb%231080.mp4" type="video/mp4" />
                    <source src={videoSrc} type="video/mp4" />
                    متصفحك لا يدعم تشغيل هذا الفيديو.
                  </video>
                  {videoName && (
                    <div className="video-file-name-chip">
                      <i className="fa-solid fa-film"></i>
                      <span>{videoName}</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback when video file not loaded */
                <div className="hero-video-placeholder">
                  <div className="video-play-pulse-circle">
                    <i className="fa-solid fa-play"></i>
                  </div>
                  <h4 className="placeholder-title">فيديو تعريفي عن قصة ومزارع خضرة</h4>
                  <p className="placeholder-sub">
                    شاهد رحلة الحصاد الفجري وجودة التغليف من قلب المزرعة
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Quick Stat Metrics */}
        <div className="about-stats-grid">
          <div className="about-stat-card">
            <div className="about-stat-icon">
              <i className="fa-solid fa-seedling"></i>
            </div>
            <div className="about-stat-info">
              <span className="stat-number">100%</span>
              <span className="stat-label">قطاف فجر يومي طازج</span>
            </div>
          </div>

          <div className="about-stat-card">
            <div className="about-stat-icon">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <div className="about-stat-info">
              <span className="stat-number">40-50</span>
              <span className="stat-label">دقيقة متوسط التوصيل</span>
            </div>
          </div>

          <div className="about-stat-card">
            <div className="about-stat-icon">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="about-stat-info">
              <span className="stat-number">99.4%</span>
              <span className="stat-label">نسبة رضا وتقييمات إيجابية</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Team Members Showcase (فريق العمل والتطوير والتراكات) */}
      <section className="about-team-section" id="team-section">
        <div className="about-section-header">
          <span className="section-eyebrow">
            <i className="fa-solid fa-users"></i>
            فريق العمل والتطوير
          </span>
          <h2 className="section-title">فريق عمل خضرة | نخبة الكفاءات والتخصصات</h2>
          <p className="section-subtitle">
            تعرّف على العقول والشغف وراء منصة خضرة، أدوارهم، وتراكاتهم التخصصية لبناء تجربة تسوق استثنائية
          </p>
        </div>

        {/* Team Grid (All 7 Members) */}
        <div className="team-members-grid">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`team-member-card ${member.trackId} ${member.isLead ? "is-lead" : ""}`}
            >
              {/* Header Badges */}
              <div className="team-card-top-meta">
                <span className={`team-track-badge ${member.trackId}`}>
                  {member.trackBadge}
                </span>
                {member.isLead && (
                  <span className="team-lead-pill">
                    <i className="fa-solid fa-crown"></i> قائد الفريق
                  </span>
                )}
              </div>

              {/* Avatar Frame */}
              <div className="member-avatar-wrapper">
                <div className={`member-avatar-circle ${member.trackId}`}>
                  <i className={member.avatarIcon}></i>
                </div>
                <div className="member-status-dot" title="عضو نشط في الفريق"></div>
              </div>

              {/* Names & Role */}
              <div className="member-info-header">
                <h3 className="member-name-ar">{member.nameAr}</h3>
                <span className="member-name-en">{member.nameEn}</span>
                <div className="member-role-title">
                  <i className="fa-solid fa-briefcase"></i>
                  <span>{member.roleAr}</span>
                </div>
              </div>

              {/* Track Info Box */}
              <div className={`member-track-box ${member.trackId}`}>
                <i className="fa-solid fa-diagram-project"></i>
                <div className="track-box-text">
                  <small>التراك التخصصي</small>
                  <strong>{member.trackName}</strong>
                </div>
              </div>

              {/* Bio & Contribution */}
              <p className="member-bio-text">{member.bio}</p>

              {/* Skill Pills */}
              <div className="member-skills-list">
                {member.skills.map((skill, idx) => (
                  <span key={idx} className="member-skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Vision, Mission & Core Values */}
      <section className="about-values-section">
        <div className="about-section-header">
          <span className="section-eyebrow">
            <i className="fa-solid fa-compass"></i>
            نهجنا ورسالتنا
          </span>
          <h2 className="section-title">المبادئ الراسخة التي تحركنا كل صباح</h2>
          <p className="section-subtitle">
            نضع الشفافية والأمانة في قلب كل خطوة نقوم بها لخدمة مائدتكم
          </p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon-box vision">
              <i className="fa-solid fa-eye"></i>
            </div>
            <h3 className="value-title">رؤيتنا المستقبلية</h3>
            <p className="value-desc">
              أن نكون المنصة الخضراء الرقمية الأولى والأكثر ثقة في الشرق الأوسط في توفير
              محاصيل زراعية نقية 100% طازجة، وخلق حلقة مستدامة وعادلة من المزارع إلى البيت.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box mission">
              <i className="fa-solid fa-bullseye"></i>
            </div>
            <h3 className="value-title">رسالتنا اليومية</h3>
            <p className="value-desc">
              تمكين الأسر من التغذية الصحية السليمة بتوفير خضروات عالية النقاء، والارتقاء
              بمعيشة المزارع المصري عبر أسعار عادلة وبدون وسطاء يستنزفون جهده وموارده.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon-box values">
              <i className="fa-solid fa-hand-holding-heart"></i>
            </div>
            <h3 className="value-title">قيمنا ومبادئنا</h3>
            <p className="value-desc">
              الصدق المطلق مع العميل، ضمان الرضا الكامل بدون نقاش، الالتزام بالاستدامة
              البيئية والتغليف الصحي، والسرعة الفائقة التي لا تساوم على الجودة.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Features & Advantages (مميزاتنا) */}
      <section className="about-features-section">
        <div className="about-section-header">
          <span className="section-eyebrow">
            <i className="fa-solid fa-star"></i>
            لماذا يختارنا الجميع؟
          </span>
          <h2 className="section-title">مميزات استثنائية تجعل "خضرة" خيارك الأول</h2>
          <p className="section-subtitle">
            صممنا كل تفصيلة في خدمتنا لنمنحك راحة البال وجودة لا تقبل المساومة
          </p>
        </div>

        <div className="features-showcase-grid">
          {/* Feature 1 */}
          <div className="feature-item-card">
            <div className="feat-card-badge">طازج 100%</div>
            <div className="feat-icon-container harvest">
              <i className="fa-solid fa-sun"></i>
            </div>
            <h3 className="feat-title">قطاف فجر كل يوم</h3>
            <p className="feat-text">
              لا نستخدم ثلاجات تجميد أو تخزين مبيت. خضارك يُقطف مع شروق شمس اليوم ويفرز
              طازجاً، لتصلك الورقيات حية والخضار غنياً بالفيتامينات والنكهة الأصلية.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-item-card">
            <div className="feat-card-badge">من المزرعة فوراً</div>
            <div className="feat-icon-container direct">
              <i className="fa-solid fa-tractor"></i>
            </div>
            <h3 className="feat-title">مباشرة من المزارع بدون وسطاء</h3>
            <p className="feat-text">
              ألغينا جميع تجار الجملة وحلقات السماسرة، مما يحقق معادلة مستحيلة: أفضل سعر
              توفيري للعميل، وأعلى دعم مالي للمزارع الشريف.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-item-card">
            <div className="feat-card-badge">فائق السرعة</div>
            <div className="feat-icon-container speed">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3 className="feat-title">توصيل خضرة إكسبريس (40-50 دقيقة)</h3>
            <p className="feat-text">
              أسطول كباتن محترف ومجهز بحقائب مبردة ومعزولة حرارياً لحماية الخضار من الشمس
              والحرارة، ليصلك ببرودته الطبيعية في زمن قياسي.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-item-card">
            <div className="feat-card-badge">فرز دقيق</div>
            <div className="feat-icon-container quality">
              <i className="fa-solid fa-magnifying-glass-chart"></i>
            </div>
            <h3 className="feat-title">فحص جودة يدوي حبة بحبة</h3>
            <p className="feat-text">
              يمر كل صنف بمرحلة فحص صارمة على أيدي خبراء؛ نستبعد أي ثمرة غير مثالية
              لضمان أن ما يصلك هو أنقى وأجمل ما جاد به المحصول.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="feature-item-card">
            <div className="feat-card-badge">صديق للبيئة</div>
            <div className="feat-icon-container eco">
              <i className="fa-solid fa-recycle"></i>
            </div>
            <h3 className="feat-title">تغليف كرافت صحي وبيئي</h3>
            <p className="feat-text">
              استبدلنا الأكياس البلاستيكية الضارة بكرتون وأكياس كرافت طبيعية تسمح بتنفس
              الخضار وتمنع الرطوبة وتساهم في الحفاظ على بيئتنا الخضراء.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="feature-item-card">
            <div className="feat-card-badge">حقك مضمون</div>
            <div className="feat-icon-container guarantee">
              <i className="fa-solid fa-handshake"></i>
            </div>
            <h3 className="feat-title">ضمان الرضا والمعاينة بالباب</h3>
            <p className="feat-text">
              افحص طلبك بالكامل مع الكابتن؛ وإن لم يعجبك أي صنف يحق لك إرجاعه فوراً أو
              استبداله أو استرداد قيمته دون أي جدال أو شروط معقدة.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Farm-to-Table Journey Workflow */}
      <section className="about-journey-section">
        <div className="about-section-header">
          <span className="section-eyebrow">
            <i className="fa-solid fa-route"></i>
            دورة العمل
          </span>
          <h2 className="section-title">رحلة الخضار من الأرض الخضراء إلى مائدتك</h2>
          <p className="section-subtitle">4 محطات متناغمة تضمن وصول الخضروات في قمة رونقها</p>
        </div>

        <div className="journey-steps-timeline">
          <div className="journey-step-card">
            <div className="step-number-tag">01</div>
            <div className="step-icon">
              <i className="fa-solid fa-seedling"></i>
            </div>
            <h4 className="step-title">القطاف الفجري</h4>
            <p className="step-desc">
              مع صلاة الفجر، يبدأ مزارعونا قطاف الخضار الناضج طبيعياً دون أي مواد كيميائية مسرعة.
            </p>
          </div>

          <div className="journey-step-divider">
            <i className="fa-solid fa-arrow-left"></i>
          </div>

          <div className="journey-step-card">
            <div className="step-number-tag">02</div>
            <div className="step-icon">
              <i className="fa-solid fa-clipboard-check"></i>
            </div>
            <h4 className="step-title">الفرز اليدوي الدقيق</h4>
            <p className="step-desc">
              فحص حبة بحبة، وتنظيف مبدئي لطيف وتعبئة في عبوات كرافت صحية تسمح بالتنفس الطبيعي.
            </p>
          </div>

          <div className="journey-step-divider">
            <i className="fa-solid fa-arrow-left"></i>
          </div>

          <div className="journey-step-card">
            <div className="step-number-tag">03</div>
            <div className="step-icon">
              <i className="fa-solid fa-motorcycle"></i>
            </div>
            <h4 className="step-title">انطلاق كابتن خضرة</h4>
            <p className="step-desc">
              تحميل الشحنة في حقائب عازلة ومبردة، والانطلاق بأسرع مسار ملاحة لتفادي أي تأخير.
            </p>
          </div>

          <div className="journey-step-divider">
            <i className="fa-solid fa-arrow-left"></i>
          </div>

          <div className="journey-step-card">
            <div className="step-number-tag">04</div>
            <div className="step-icon">
              <i className="fa-solid fa-face-smile-beam"></i>
            </div>
            <h4 className="step-title">الاستلام والمعاينة</h4>
            <p className="step-desc">
              تصلك الطلبية طازجة ومبهجة، تعاين خضارك وتستمتع بطعم الطبيعة الصافي في منزلك.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Interactive FAQ Accordion (الأسئلة الشائعة) */}
      <section className="about-faq-section" id="faq-section">
        <div className="about-section-header">
          <span className="section-eyebrow">
            <i className="fa-solid fa-circle-question"></i>
            إجابات واضحة
          </span>
          <h2 className="section-title">الأسئلة الشائعة والمعلومات الهامة</h2>
          <p className="section-subtitle">
            جمعنا لك إجابات شافية ووافية عن كل ما يدور في ذهنك حول الشراء والمنتجات والتوصيل
          </p>
        </div>

        {/* FAQ Controls: Search & Category Chips */}
        <div className="faq-controls-bar">
          <div className="faq-search-wrapper">
            <i className="fa-solid fa-magnifying-glass faq-search-icon"></i>
            <input
              type="text"
              className="faq-search-input"
              placeholder="ابحث في الأسئلة الشائعة (مثلاً: التوصيل، الإرجاع، كود الخصم)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
            />
            {faqSearch && (
              <button
                className="faq-search-clear"
                onClick={() => setFaqSearch("")}
                title="مسح البحث"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          <div className="faq-category-filters">
            <button
              className={`faq-cat-pill ${faqCategory === "all" ? "active" : ""}`}
              onClick={() => setFaqCategory("all")}
            >
              <i className="fa-solid fa-border-all"></i>
              الكل ({faqList.length})
            </button>
            <button
              className={`faq-cat-pill ${faqCategory === "quality" ? "active" : ""}`}
              onClick={() => setFaqCategory("quality")}
            >
              <i className="fa-solid fa-seedling"></i>
              الجودة والطزاجة
            </button>
            <button
              className={`faq-cat-pill ${faqCategory === "delivery" ? "active" : ""}`}
              onClick={() => setFaqCategory("delivery")}
            >
              <i className="fa-solid fa-truck-fast"></i>
              التوصيل والشحن
            </button>
            <button
              className={`faq-cat-pill ${faqCategory === "guarantee" ? "active" : ""}`}
              onClick={() => setFaqCategory("guarantee")}
            >
              <i className="fa-solid fa-shield-halved"></i>
              الضمان والمعاينة
            </button>
            <button
              className={`faq-cat-pill ${faqCategory === "offers" ? "active" : ""}`}
              onClick={() => setFaqCategory("offers")}
            >
              <i className="fa-solid fa-percent"></i>
              الخصومات والبوكسات
            </button>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-accordion-list">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty-state">
              <i className="fa-solid fa-circle-exclamation empty-icon"></i>
              <h3>لا توجد نتائج مطابقة لبحثك</h3>
              <p>جرّب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً من الأعلى.</p>
              <button
                className="faq-reset-btn"
                onClick={() => {
                  setFaqSearch("");
                  setFaqCategory("all");
                }}
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={faq.id}
                  className={`faq-accordion-item ${isOpen ? "open" : ""}`}
                >
                  <button
                    className="faq-question-btn"
                    onClick={() => toggleAccordion(index)}
                    aria-expanded={isOpen}
                  >
                    <div className="question-left-side">
                      <span className="faq-q-badge">س {faq.id}</span>
                      <span className="faq-question-text">{faq.question}</span>
                    </div>
                    <span className="faq-toggle-icon">
                      <i className={`fa-solid ${isOpen ? "fa-minus" : "fa-plus"}`}></i>
                    </span>
                  </button>

                  <div className={`faq-answer-collapse ${isOpen ? "expanded" : ""}`}>
                    <div className="faq-answer-inner">
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* 7. Bottom CTA & Quick Help Desk Card */}
      <section className="about-cta-section">
        <div className="about-cta-banner">
          <div className="cta-banner-content">
            <span className="cta-tag">جرّب الفرق بنفسك اليوم!</span>
            <h2 className="cta-headline">
              جاهز لتذوق الخضار الحقيقي برائحته الطبيعية وطعمه الأصلي؟
            </h2>
            <p className="cta-sub">
              استمتع بخصم <strong>20%</strong> على طلبك الأول باستخدام كود <strong>ESOO20</strong> مع
              توصيل سريع مجاني لباب منزلك.
            </p>

            <div className="cta-actions-group">
              <button
                className="cta-shop-now-btn"
                onClick={() => {
                  onNavigateToProducts && onNavigateToProducts();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <i className="fa-solid fa-basket-shopping"></i>
                <span>تسوق الآن من الكتالوج</span>
              </button>

              <button
                className="cta-home-btn"
                onClick={() => {
                  onNavigateToHome && onNavigateToHome();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <i className="fa-solid fa-house"></i>
                <span>الصفحة الرئيسية</span>
              </button>
            </div>
          </div>

          {/* Quick Help Desk Floating Box */}
          <div className="cta-helpdesk-box">
            <div className="helpdesk-header">
              <i className="fa-solid fa-headset help-icon"></i>
              <div>
                <h4>فريق الدعم وخدمة العملاء</h4>
                <p>متاحون يومياً من 7:00 ص إلى 11:00 م</p>
              </div>
            </div>

            <div className="helpdesk-contact-list">
              <a href="tel:+201557523934" className="helpdesk-item">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <small>الاتصال المباشر</small>
                  <strong>01557523934</strong>
                </div>
              </a>

              <a
                href="https://wa.me/201557523934"
                target="_blank"
                rel="noreferrer"
                className="helpdesk-item"
              >
                <i className="fa-brands fa-whatsapp whatsapp-color"></i>
                <div>
                  <small>محادثة واتساب سريعة</small>
                  <strong>دردشة فورية</strong>
                </div>
              </a>

              <div className="helpdesk-item">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <small>مقر التوزيع والمزارع</small>
                  <strong>مصر - قنا - مركز قنا</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
