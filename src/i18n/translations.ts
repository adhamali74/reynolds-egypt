// Centralised translation dictionary for the Reynolds Egypt site.
//
// Structure: dictionary[lang][key] -> string.
// `key` uses a dotted "namespace.key" convention so keys stay collision-free
// across components. If a key is missing for a given language we fall back to
// English, and if that is also missing we return the key itself so it is
// obvious in the UI that something needs translating.

export type Lang = "en" | "ar";

export type Dict = Record<string, string>;

export const TRANSLATIONS: Record<Lang, Dict> = {
  en: {
    // ─── Navbar ───────────────────────────────────────────────────────────
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.howItWorks": "How It Works",
    "nav.contact": "Contact",
    "nav.getQuote": "Get a Quote",
    "nav.openMenu": "Open menu",
    "nav.closeMenu": "Close menu",
    "nav.toggleTheme": "Toggle theme",
    "nav.toggleLanguage": "Change language",

    // ─── Hero ─────────────────────────────────────────────────────────────
    "hero.headline.1": "Moving",
    "hero.headline.2": "Egypt.",
    "hero.headline.3": "Reaching",
    "hero.headline.4": "the",
    "hero.headline.5": "World.",
    "hero.copy":
      "Egypt's most trusted freight partner — built for speed, precision, and the future of global trade. Sea, air, land, and customs orchestrated from Alexandria to every port in between.",
    "hero.ctaPrimary": "Get a Quote",
    "hero.ctaSecondary": "Our Services",
    "hero.tag.sea": "Sea Freight",
    "hero.tag.air": "Air Freight",
    "hero.tag.land": "Land · Customs · Warehousing",
    "hero.scroll": "Scroll",

    // ─── Common ───────────────────────────────────────────────────────────
    "common.backToHome": "Back to Home",
    "common.enter": "Enter",
    "common.readyToMove": "Ready to move?",
    "common.viewProject": "View",

    // ─── Services ─────────────────────────────────────────────────────────
    "services.eyebrow": "Services",
    "services.title.part1": "A full-stack logistics",
    "services.title.highlight": "operator",
    "services.title.part2": ", not a middleman.",
    "services.intro":
      "Six integrated services, one accountable team. We orchestrate the entire chain — from the factory floor to your customer's door.",
    "services.sea.title": "Sea Freight",
    "services.sea.copy":
      "FCL & LCL container shipping via Alexandria, Damietta, and Sokhna. Reefer, DG, and breakbulk handled.",
    "services.sea.tag1": "Sea",
    "services.sea.tag2": "FCL / LCL",
    "services.air.title": "Air Freight",
    "services.air.copy":
      "Priority and economy air cargo with consolidation across Cairo and major European and Gulf hubs.",
    "services.air.tag1": "Air",
    "services.air.tag2": "Express",
    "services.land.title": "Land Transport",
    "services.land.copy":
      "Cross-border trucking across Egypt, Libya, Sudan, and the Gulf. Dedicated fleet plus vetted partners.",
    "services.land.tag1": "Road",
    "services.land.tag2": "FTL / LTL",
    "services.customs.title": "Customs Clearance",
    "services.customs.copy":
      "Licensed brokers at all Egyptian ports. HS-code advisory, duty optimisation, and compliance handled.",
    "services.customs.tag1": "Customs",
    "services.customs.tag2": "Brokerage",
    "services.warehousing.title": "Warehousing",
    "services.warehousing.copy":
      "Bonded and free-zone storage in Alexandria with pick, pack, cross-dock, and inventory visibility.",
    "services.warehousing.tag1": "3PL",
    "services.warehousing.tag2": "Bonded",
    "services.project.title": "Project Cargo",
    "services.project.copy":
      "Over-sized, heavy-lift, and turnkey project moves. Route surveys, permits, and escort coordination.",
    "services.project.tag1": "OOG",
    "services.project.tag2": "Heavy-lift",
    "services.cta.line": "Tell us the lane. We'll handle the rest.",
    "services.cta.button": "Get a quote",

    // ─── Why Reynolds ─────────────────────────────────────────────────────
    "why.eyebrow": "Why Reynolds",
    "why.title.part1": "Two decades of moving",
    "why.title.highlight": "cargo",
    "why.title.part2": "that matters.",
    "why.intro":
      "We combine old-school relationships with modern operations. The result: fewer surprises, better rates, and shipments that actually arrive when we said they would.",
    "why.stat.experience.label": "Years of Experience",
    "why.stat.experience.copy":
      "Founded in Alexandria in 2018 — moving fast, and only accelerating.",
    "why.stat.partners.label": "Global Partners",
    "why.stat.partners.copy":
      "Carrier, agent and customs networks across 80+ countries.",
    "why.stat.shipments.label": "Shipments Handled",
    "why.stat.shipments.copy":
      "From single pallets to full-vessel project cargo.",
    "why.stat.support.label": "Customer Support",
    "why.stat.support.copy": "Real humans on ops, not bots. Always reachable.",

    // ─── CEO Quote ────────────────────────────────────────────────────────
    "ceo.quote.1": "\u201CWe don't ship cargo. ",
    "ceo.quote.highlight": "We ship promises",
    "ceo.quote.2": " \u2014 and we keep them.\u201D",
    "ceo.name": "Hussien",
    "ceo.role": "Founder & CEO · Reynolds Egypt",
    "ceo.imageAlt": "Hussien — Founder & CEO of Reynolds Egypt",

    // ─── Team ─────────────────────────────────────────────────────────────
    "team.eyebrow": "Our team",
    "team.title.part1": "Meet the",
    "team.title.highlight": "people.",
    "team.intro":
      "The operators, planners, and problem-solvers behind Reynolds Egypt.",
    "team.member.hussien.name": "Hussien Ali",
    "team.member.hussien.role": "CEO",
    "team.member.israa.name": "Israa Muhammad",
    "team.member.israa.role": "Operations Manager",
    "team.member.abdalrahman.name": "Abdalrahman",
    "team.member.abdalrahman.role": "Accounting Manager",
    "team.member.tbd.name": "[Name TBD]",
    "team.member.tbd.role": "[Role TBD]",

    // ─── How It Works ─────────────────────────────────────────────────────
    "how.eyebrow": "How it works",
    "how.title.part1": "Three steps.",
    "how.title.highlight": "Zero friction.",
    "how.step1.title": "Request a Quote",
    "how.step1.copy":
      "Tell us what's moving, where, and when. We respond within the hour with a transparent, itemised price.",
    "how.step2.title": "We Plan the Route",
    "how.step2.copy":
      "Our team designs the optimal path — mode, carrier, customs flow — and locks it into a live operational plan.",
    "how.step3.title": "You Receive on Time",
    "how.step3.copy":
      "Real-time milestones to your inbox. Exceptions handled before they become problems. Delivery, signed and filed.",
    "how.cta.line": "Step 1 starts here",
    "how.cta.button": "Start a quote",

    // ─── Explore Nav ──────────────────────────────────────────────────────
    "explore.eyebrow": "Explore",
    "explore.title.part1": "Pick your",
    "explore.title.highlight": "destination.",
    "explore.intro":
      "Each part of Reynolds has its own page. Jump straight to what you came for.",
    "explore.services.kicker": "Six integrated pillars",
    "explore.services.copy":
      "Sea, air, land, customs, warehousing, and project cargo — run as one accountable team.",
    "explore.about.kicker": "Why Reynolds",
    "explore.about.copy":
      "Alexandria-founded since 2018. Why shippers across six continents route through us.",
    "explore.how.kicker": "From quote to delivery",
    "explore.how.copy":
      "A transparent five-step flow — the same playbook whether it's FCL from Shanghai or air express to JFK.",
    "explore.contact.kicker": "Get a quote",
    "explore.contact.copy":
      "Tell us the lane. We'll respond inside an hour with a plan, a price, and a named owner.",

    // ─── World Map ────────────────────────────────────────────────────────
    "world.eyebrow": "Live Network",
    "world.title.part1": "We connect Egypt",
    "world.title.highlight": "to the world.",
    "world.intro":
      "Established lanes out of every major Egyptian port — Alexandria, El Dekheila, Damietta, Port Said, East Port Said, Suez, Adabiya, Ain Sokhna, and Safaga — into the world's busiest trade hubs across six continents.",
    "world.opsLive": "OPS · LIVE",
    "world.egyptGlobal": "Egypt → Global",
    "world.summary": "{egyptian} Egyptian ports · {total} nodes · {routes} lanes",
    "world.hint": "Drag · Scroll to zoom · Click ports",
    "world.legend.egyptian": "Egyptian Ports",
    "world.legend.global": "Global Hubs",
    "world.stat.egyptian": "Egyptian Ports",
    "world.stat.world": "World Hubs",
    "world.stat.lanes": "Active Lanes",
    "world.stat.ontime": "On-Time",
    "world.tooltip.routes.one": "connected route",
    "world.tooltip.routes.many": "connected routes",
    "world.zoom.in": "Zoom in",
    "world.zoom.out": "Zoom out",
    "world.zoom.reset": "Reset view",

    // ─── Instagram ────────────────────────────────────────────────────────
    "ig.followAria": "Follow @{handle} on Instagram",
    "ig.title.part1": "From our",
    "ig.title.highlight": "feed.",
    "ig.intro":
      "Behind the scenes on the docks, in the warehouse, and up in the air — follow along for operations, lanes, and moments from the Reynolds team.",
    "ig.viewOn": "View on Instagram",
    "ig.post.1": "Project cargo lifted at Ain Sokhna — precision over power.",
    "ig.post.2": "Customs cleared at Port Said. Door-to-door in 72 hours.",
    "ig.post.3": "Sea freight out of Alexandria — FCL straight into Rotterdam.",
    "ig.post.4": "Reefer lane: Egyptian fresh produce north to Hamburg.",
    "ig.post.5": "Air freight ex-Cairo — wheels up, papers clean.",
    "ig.post.6": "Cross-dock day at the Alexandria 3PL floor.",
    "ig.post.7": "Breakbulk loading at Damietta — crane ballet, 6am.",
    "ig.post.8": "The team behind every shipment. Ops is always on.",
    "ig.post.9": "17+ hubs, six continents, one accountable team.",

    // ─── Contact / Get A Quote ────────────────────────────────────────────
    "contact.eyebrow": "Get a Quote",
    "contact.title.part1": "Let's move",
    "contact.title.highlight": "your cargo.",
    "contact.intro":
      "Tell us what's moving. We respond within the hour — usually sooner — with an itemised rate and a realistic timeline.",
    "contact.email.label": "Email",
    "contact.phone.label": "Phone",
    "contact.office.label": "Office",
    "contact.office.address":
      "6 Talaat Harb St., 3rd Floor, Al Attarin, Alexandria",
    "contact.form.fullName": "Full Name *",
    "contact.form.company": "Company",
    "contact.form.email": "Email *",
    "contact.form.phone": "Phone",
    "contact.form.shipmentType": "Shipment Type",
    "contact.form.origin": "Origin *",
    "contact.form.destination": "Destination *",
    "contact.form.message": "Message",
    "contact.form.shipment.sea": "Sea",
    "contact.form.shipment.air": "Air",
    "contact.form.shipment.land": "Land",
    "contact.form.shipment.customs": "Customs",
    "contact.form.searchPrefix": "Search",
    "contact.form.noMatches": "No matches for \u201C{query}\u201D",
    "contact.form.footnote":
      "We'll respond within the hour during business hours.",
    "contact.form.send": "Send Request",
    "contact.form.sending": "Sending...",
    "contact.form.sent": "Sent — we'll be in touch",

    // ─── Location Map ─────────────────────────────────────────────────────
    "location.eyebrow": "Find us",
    "location.title.part1": "Our",
    "location.title.highlight": "Alexandria office.",
    "location.intro":
      "Drop by in person — or just eyeball where we are on the map.",
    "location.popup.name": "Reynolds Egypt",
    "location.cta": "Get Directions",

    // ─── Google Reviews ───────────────────────────────────────────────────
    "reviews.eyebrow": "Client feedback",
    "reviews.title.part1": "What clients",
    "reviews.title.highlight": "say about us.",
    "reviews.intro":
      "Straight from the shippers and importers we work with every day — pulled from our Google Maps listing.",
    "reviews.outOf": "out of 5",
    "reviews.basedOn": "Based on {count} Google reviews",
    "reviews.source": "Google",
    "reviews.verified": "Verified via Google Maps",
    "reviews.ctaAll": "See all reviews on Google",
    "reviews.r1.name": "Ahmed Hassan",
    "reviews.r1.role": "Operations Manager",
    "reviews.r1.time": "2 weeks ago",
    "reviews.r1.text":
      "Reynolds handled our machinery shipment from Hamburg to Alexandria end-to-end. Clear paperwork, zero customs delays, and the ops team replied within minutes every time. Hard to find this level of service in freight.",
    "reviews.r2.name": "Mariam Saleh",
    "reviews.r2.role": "Import Director",
    "reviews.r2.time": "1 month ago",
    "reviews.r2.text":
      "We've been running FCL and LCL shipments with Reynolds for two years now. Rates are fair, customs brokerage is sharp, and they actually pick up the phone when something goes sideways. That's rare.",
    "reviews.r3.name": "Omar El-Sharkawy",
    "reviews.r3.role": "Procurement Lead",
    "reviews.r3.time": "3 months ago",
    "reviews.r3.text":
      "Used them for an urgent air shipment out of Cairo to Rotterdam. Booked on a Sunday, wheels-up Monday night. Reynolds gets logistics — not just forwarding.",

    // ─── Careers ──────────────────────────────────────────────────────────
    "careers.eyebrow": "Careers",
    "careers.title.part1": "Build a career that",
    "careers.title.highlight": "moves the world.",
    "careers.intro":
      "We're a fast-growing freight team based in Alexandria. If you thrive under pressure, care about precision, and want to be part of something real — we want to hear from you.",
    "careers.benefit.growth.title": "Grow Fast",
    "careers.benefit.growth.copy": "Hands-on responsibility from day one. No waiting two years for a real role.",
    "careers.benefit.impact.title": "Real Impact",
    "careers.benefit.impact.copy": "Your work moves containers, planes, and trucks — not slides in a deck.",
    "careers.benefit.culture.title": "Tight Team",
    "careers.benefit.culture.copy": "A small, sharp crew where everyone knows the mission and everyone matters.",
    "careers.benefit.perks.title": "Competitive Package",
    "careers.benefit.perks.copy": "Market salary, performance bonuses, health coverage, and paid training.",
    "careers.form.eyebrow": "Apply Now",
    "careers.form.title.part1": "Send us your",
    "careers.form.title.highlight": "application.",
    "careers.form.intro": "Fill in your details, attach your CV, and we'll be in touch within 3 business days.",
    "careers.form.fullName": "Full Name *",
    "careers.form.email": "Email Address *",
    "careers.form.phone": "Phone Number",
    "careers.form.position": "Position Interested In *",
    "careers.form.experience": "Years of Experience",
    "careers.form.linkedin": "LinkedIn / Portfolio URL",
    "careers.form.message": "Cover Letter / Message",
    "careers.form.cv": "Attach CV",
    "careers.form.cvDrop": "Drag & drop your CV here, or click to browse",
    "careers.form.cvHint": "PDF, DOC or DOCX · Max 5 MB",
    "careers.form.cvSelected": "CV attached:",
    "careers.form.cvRemove": "Remove",
    "careers.form.send": "Submit Application",
    "careers.form.sending": "Submitting…",
    "careers.form.sent": "Application received!",
    "careers.form.footnote": "We review every application personally and reply within 3 business days.",
    "careers.position.sea": "Sea Freight Operations",
    "careers.position.air": "Air Freight Coordinator",
    "careers.position.land": "Land Transport",
    "careers.position.customs": "Customs Clearance Officer",
    "careers.position.warehouse": "Warehouse Operations",
    "careers.position.sales": "Sales & Business Development",
    "careers.position.cs": "Customer Service",
    "careers.position.ops": "Operations Manager",
    "careers.position.finance": "Finance & Accounting",
    "careers.position.general": "General Application",
    "careers.experience.fresh": "Fresh Graduate (0–1 yr)",
    "careers.experience.1to3": "1–3 Years",
    "careers.experience.3to5": "3–5 Years",
    "careers.experience.5to10": "5–10 Years",
    "careers.experience.10plus": "10+ Years",

    // ─── Footer ───────────────────────────────────────────────────────────
    "footer.tagline":
      "Alexandria-based freight forwarders moving cargo between Egypt and the world since 2018.",
    "footer.section.company": "Company",
    "footer.section.services": "Services",
    "footer.section.contact": "Contact",
    "footer.address.line1": "6 Talaat Harb St., 3rd Floor,",
    "footer.address.line2": "Al Attarin, Alexandria",
    "footer.rights": "\u00A92026 Reynolds Egypt. All rights reserved.",
    "footer.crafted": "Crafted in Alexandria — moving the world since 2018.",

    // ─── Chatbot ──────────────────────────────────────────────────────────
    "chat.title": "Reynolds Assistant",
    "chat.status": "Online · Alexandria",
    "chat.open": "Open chat",
    "chat.close": "Close chat",
    "chat.send": "Send",
    "chat.placeholder": "Ask about quotes, customs, ports…",
    "chat.intro":
      "Hi — I'm the Reynolds ops assistant. Ask about quotes, lanes, customs, or warehousing.",
    "chat.quick.quote": "Get a quote",
    "chat.quick.lanes": "Lanes from Alexandria",
    "chat.quick.customs": "Customs clearance",
    "chat.quick.contact": "Contact a human",
    "chat.reply.quote":
      "For a tailored quote, scroll to the quote form below — origin, destination, and shipment type is enough to start. We respond within an hour.",
    "chat.reply.customs":
      "We hold broker licenses at every major Egyptian port — Alexandria, Port Said, Damietta, Ain Sokhna, Suez, and Safaga. HS-code advisory and duty optimisation included.",
    "chat.reply.lanes":
      "We run active lanes from six Egyptian ports into 17+ world hubs — Rotterdam, Hamburg, Antwerp, Jebel Ali, Singapore, Shanghai, New York, Los Angeles, and more.",
    "chat.reply.contact":
      "Reach our team at info@reynoldsegypt.com or 03-4838515 — ops is on 24/7.",
    "chat.reply.warehouse":
      "Bonded and free-zone warehousing in Alexandria: pick, pack, cross-dock, and inventory visibility included.",
    "chat.reply.hi": "Hey! What are you shipping, and where is it heading?",
    "chat.reply.fallback":
      "Got it — let me route you to a human for that one. Email info@reynoldsegypt.com or call 03-4838515, and the team will pick it up.",
  },

  ar: {
    // ─── Navbar ───────────────────────────────────────────────────────────
    "nav.home": "الرئيسية",
    "nav.services": "خدماتنا",
    "nav.about": "من نحن",
    "nav.howItWorks": "كيف نعمل",
    "nav.contact": "تواصل معنا",
    "nav.getQuote": "احصل على عرض سعر",
    "nav.openMenu": "فتح القائمة",
    "nav.closeMenu": "إغلاق القائمة",
    "nav.toggleTheme": "تبديل الوضع",
    "nav.toggleLanguage": "تغيير اللغة",

    // ─── Hero ─────────────────────────────────────────────────────────────
    "hero.headline.1": "نحرّك",
    "hero.headline.2": "مصر.",
    "hero.headline.3": "نصل",
    "hero.headline.4": "إلى",
    "hero.headline.5": "العالم.",
    "hero.copy":
      "شريك الشحن الأكثر ثقة في مصر — مبني على السرعة والدقة ومستقبل التجارة العالمية. شحن بحري وجوي وبري وتخليص جمركي، منسّق من الإسكندرية إلى كل ميناء في العالم.",
    "hero.ctaPrimary": "احصل على عرض سعر",
    "hero.ctaSecondary": "خدماتنا",
    "hero.tag.sea": "شحن بحري",
    "hero.tag.air": "شحن جوي",
    "hero.tag.land": "شحن بري · جمارك · تخزين",
    "hero.scroll": "للأسفل",

    // ─── Common ───────────────────────────────────────────────────────────
    "common.backToHome": "العودة للرئيسية",
    "common.enter": "ادخل",
    "common.readyToMove": "هل أنت مستعد؟",
    "common.viewProject": "عرض",

    // ─── Services ─────────────────────────────────────────────────────────
    "services.eyebrow": "الخدمات",
    "services.title.part1": "مشغّل لوجستي",
    "services.title.highlight": "متكامل",
    "services.title.part2": "، لا وسيط.",
    "services.intro":
      "ست خدمات متكاملة، وفريق واحد مسؤول. نُدير السلسلة كاملةً — من أرض المصنع إلى باب عميلك.",
    "services.sea.title": "الشحن البحري",
    "services.sea.copy":
      "شحن حاويات كاملة وجزئية عبر الإسكندرية ودمياط والسخنة. نتعامل مع المبرّدة والبضائع الخطرة والصب.",
    "services.sea.tag1": "بحري",
    "services.sea.tag2": "FCL / LCL",
    "services.air.title": "الشحن الجوي",
    "services.air.copy":
      "شحن جوي ممتاز واقتصادي مع تجميع عبر القاهرة وأهم مراكز أوروبا والخليج.",
    "services.air.tag1": "جوي",
    "services.air.tag2": "إكسبريس",
    "services.land.title": "النقل البري",
    "services.land.copy":
      "نقل بري عابر للحدود في مصر وليبيا والسودان والخليج. أسطول خاص إلى جانب شركاء موثوقين.",
    "services.land.tag1": "طرق",
    "services.land.tag2": "FTL / LTL",
    "services.customs.title": "التخليص الجمركي",
    "services.customs.copy":
      "مخلّصون مُرخَّصون في جميع الموانئ المصرية. استشارات ترميز HS وتحسين الرسوم والامتثال.",
    "services.customs.tag1": "جمارك",
    "services.customs.tag2": "وساطة",
    "services.warehousing.title": "التخزين",
    "services.warehousing.copy":
      "تخزين في المناطق الحرة والجمركية بالإسكندرية مع التجهيز والتعبئة والعبور ومتابعة المخزون.",
    "services.warehousing.tag1": "لوجستي 3PL",
    "services.warehousing.tag2": "جمركي",
    "services.project.title": "شحن المشاريع",
    "services.project.copy":
      "نقل البضائع الضخمة والثقيلة ومشاريع التسليم الكامل. معاينة المسار والتصاريح وتنسيق المرافقة.",
    "services.project.tag1": "OOG",
    "services.project.tag2": "حمولات ثقيلة",
    "services.cta.line": "أخبرنا بالخط البحري، ونحن نتولى الباقي.",
    "services.cta.button": "احصل على عرض سعر",

    // ─── Why Reynolds ─────────────────────────────────────────────────────
    "why.eyebrow": "لماذا رينولدز",
    "why.title.part1": "عقدان من نقل",
    "why.title.highlight": "البضائع",
    "why.title.part2": "التي تستحق.",
    "why.intro":
      "نجمع بين العلاقات التقليدية والعمليات الحديثة. النتيجة: مفاجآت أقل، وأسعار أفضل، وشحنات تصل في موعدها فعلاً.",
    "why.stat.experience.label": "سنوات من الخبرة",
    "why.stat.experience.copy":
      "تأسّست في الإسكندرية عام 2018 — ونسير بسرعة، ولا نتوقف عن التسارع.",
    "why.stat.partners.label": "شريك عالمي",
    "why.stat.partners.copy":
      "شبكات ناقلين ووكلاء وتخليص جمركي في أكثر من 80 دولة.",
    "why.stat.shipments.label": "شحنة منجزة",
    "why.stat.shipments.copy":
      "من طبلية واحدة إلى شحن مشاريع بسفن كاملة.",
    "why.stat.support.label": "دعم العملاء",
    "why.stat.support.copy":
      "فريق بشري حقيقي في العمليات، ليس روبوتات. متاح دائماً.",

    // ─── CEO Quote ────────────────────────────────────────────────────────
    "ceo.quote.1": "«نحن لا نشحن بضائع فقط. ",
    "ceo.quote.highlight": "نحن نشحن وعوداً",
    "ceo.quote.2": " — ونوفي بها.»",
    "ceo.name": "حسين",
    "ceo.role": "المؤسّس والرئيس التنفيذي · رينولدز مصر",
    "ceo.imageAlt": "حسين — مؤسّس رينولدز مصر ورئيسها التنفيذي",

    // ─── Team ─────────────────────────────────────────────────────────────
    "team.eyebrow": "فريقنا",
    "team.title.part1": "تعرّف على",
    "team.title.highlight": "الأشخاص.",
    "team.intro":
      "المشغّلون والمخطّطون وحلّالو المشكلات خلف رينولدز مصر.",
    "team.member.hussien.name": "حسين علي",
    "team.member.hussien.role": "الرئيس التنفيذي",
    "team.member.israa.name": "إسراء محمد",
    "team.member.israa.role": "مديرة العمليات",
    "team.member.abdalrahman.name": "عبد الرحمن",
    "team.member.abdalrahman.role": "مدير الحسابات",
    "team.member.tbd.name": "[الاسم لاحقاً]",
    "team.member.tbd.role": "[الدور لاحقاً]",

    // ─── How It Works ─────────────────────────────────────────────────────
    "how.eyebrow": "كيف نعمل",
    "how.title.part1": "ثلاث خطوات.",
    "how.title.highlight": "بلا تعقيد.",
    "how.step1.title": "اطلب عرض سعر",
    "how.step1.copy":
      "أخبرنا ما الذي يتحرك وإلى أين ومتى. نردّ خلال ساعة بعرض سعر شفاف ومُفصَّل.",
    "how.step2.title": "نخطّط المسار",
    "how.step2.copy":
      "يصمّم فريقنا المسار الأمثل — الوسيلة، الناقل، مسار الجمارك — ويحوّله إلى خطة تشغيل مباشرة.",
    "how.step3.title": "تستلم في الوقت",
    "how.step3.copy":
      "تحديثات لحظية إلى بريدك. نعالج المستجدات قبل أن تتحول إلى مشاكل. تسليم مُوثَّق ومُؤرشَف.",
    "how.cta.line": "الخطوة الأولى تبدأ هنا",
    "how.cta.button": "ابدأ عرض سعر",

    // ─── Explore Nav ──────────────────────────────────────────────────────
    "explore.eyebrow": "استكشف",
    "explore.title.part1": "اختر",
    "explore.title.highlight": "وجهتك.",
    "explore.intro":
      "لكل قسم من رينولدز صفحته الخاصة. اذهب مباشرة إلى ما تحتاجه.",
    "explore.services.kicker": "ست ركائز متكاملة",
    "explore.services.copy":
      "بحر، جو، بر، جمارك، تخزين، ومشاريع — يعمل الجميع كفريق واحد مسؤول.",
    "explore.about.kicker": "لماذا رينولدز",
    "explore.about.copy":
      "تأسّست في الإسكندرية عام 2018. لماذا يختارنا الشاحنون من ست قارات.",
    "explore.how.kicker": "من السعر إلى التسليم",
    "explore.how.copy":
      "تدفّق شفاف من خمس خطوات — نفس المنهجية سواء كانت حاوية من شانغهاي أو شحنة جوية إلى JFK.",
    "explore.contact.kicker": "احصل على سعر",
    "explore.contact.copy":
      "أخبرنا بالخط، وسنردّ خلال ساعة بخطة وسعر ومسؤول محدّد بالاسم.",

    // ─── World Map ────────────────────────────────────────────────────────
    "world.eyebrow": "شبكة مباشرة",
    "world.title.part1": "نربط مصر",
    "world.title.highlight": "بالعالم.",
    "world.intro":
      "خطوط منتظمة من كل ميناء مصري كبير — الإسكندرية والدخيلة ودمياط وبورسعيد وشرق بورسعيد والسويس والأدبية والعين السخنة وسفاجا — إلى أكثر مراكز التجارة ازدحاماً في ست قارات.",
    "world.opsLive": "العمليات · مباشر",
    "world.egyptGlobal": "مصر ← العالم",
    "world.summary": "{egyptian} ميناء مصري · {total} عقدة · {routes} خطاً",
    "world.hint": "اسحب · مرّر للتكبير · انقر الموانئ",
    "world.legend.egyptian": "الموانئ المصرية",
    "world.legend.global": "المراكز العالمية",
    "world.stat.egyptian": "الموانئ المصرية",
    "world.stat.world": "المراكز العالمية",
    "world.stat.lanes": "الخطوط النشطة",
    "world.stat.ontime": "الالتزام بالمواعيد",
    "world.tooltip.routes.one": "خط متّصل",
    "world.tooltip.routes.many": "خطوط متّصلة",
    "world.zoom.in": "تكبير",
    "world.zoom.out": "تصغير",
    "world.zoom.reset": "إعادة الضبط",

    // ─── Instagram ────────────────────────────────────────────────────────
    "ig.followAria": "تابع @{handle} على إنستغرام",
    "ig.title.part1": "من",
    "ig.title.highlight": "حسابنا.",
    "ig.intro":
      "خلف الكواليس على الأرصفة وفي المستودع وفي السماء — تابعنا للعمليات والخطوط ولحظات من فريق رينولدز.",
    "ig.viewOn": "عرض على إنستغرام",
    "ig.post.1": "رفع شحنة مشروع في العين السخنة — الدقة أهم من القوة.",
    "ig.post.2": "تخليص جمركي في بورسعيد. من الباب إلى الباب خلال 72 ساعة.",
    "ig.post.3": "شحن بحري من الإسكندرية — حاوية كاملة مباشرة إلى روتردام.",
    "ig.post.4": "خط مبرّد: خضروات مصرية طازجة شمالاً إلى هامبورغ.",
    "ig.post.5": "شحن جوي من القاهرة — إقلاع وأوراق نظيفة.",
    "ig.post.6": "يوم العبور في أرضية 3PL بالإسكندرية.",
    "ig.post.7": "تحميل صب في دمياط — باليه الرافعات، السادسة صباحاً.",
    "ig.post.8": "الفريق خلف كل شحنة. العمليات لا تتوقف.",
    "ig.post.9": "أكثر من 17 مركزاً، ست قارات، فريق واحد مسؤول.",

    // ─── Contact / Get A Quote ────────────────────────────────────────────
    "contact.eyebrow": "احصل على عرض سعر",
    "contact.title.part1": "لننقل",
    "contact.title.highlight": "شحنتك.",
    "contact.intro":
      "أخبرنا بما تريد نقله. نردّ خلال ساعة — وعادةً أسرع — بسعر مُفصَّل وجدول زمني واقعي.",
    "contact.email.label": "البريد الإلكتروني",
    "contact.phone.label": "الهاتف",
    "contact.office.label": "المكتب",
    "contact.office.address":
      "6 شارع طلعت حرب، الدور الثالث، العطارين، الإسكندرية",
    "contact.form.fullName": "الاسم الكامل *",
    "contact.form.company": "الشركة",
    "contact.form.email": "البريد الإلكتروني *",
    "contact.form.phone": "رقم الهاتف",
    "contact.form.shipmentType": "نوع الشحنة",
    "contact.form.origin": "المصدر *",
    "contact.form.destination": "الوجهة *",
    "contact.form.message": "رسالة",
    "contact.form.shipment.sea": "بحري",
    "contact.form.shipment.air": "جوي",
    "contact.form.shipment.land": "بري",
    "contact.form.shipment.customs": "جمارك",
    "contact.form.searchPrefix": "بحث عن",
    "contact.form.noMatches": "لا توجد نتائج لـ «{query}»",
    "contact.form.footnote":
      "نردّ خلال ساعة في أوقات العمل.",
    "contact.form.send": "إرسال الطلب",
    "contact.form.sending": "جارٍ الإرسال...",
    "contact.form.sent": "تم الإرسال — سنتواصل معك",

    // ─── Location Map ─────────────────────────────────────────────────────
    "location.eyebrow": "مكاننا",
    "location.title.part1": "مكتبنا في",
    "location.title.highlight": "الإسكندرية.",
    "location.intro":
      "مرّ بنا شخصياً — أو ألقِ نظرة على موقعنا على الخريطة.",
    "location.popup.name": "رينولدز مصر",
    "location.cta": "اعرض الاتجاهات",

    // ─── Google Reviews ───────────────────────────────────────────────────
    "reviews.eyebrow": "آراء العملاء",
    "reviews.title.part1": "ماذا يقول",
    "reviews.title.highlight": "عملاؤنا عنّا.",
    "reviews.intro":
      "مباشرةً من الشركات والمستوردين الذين نعمل معهم يومياً — منقولة من صفحة Google Maps الخاصة بنا.",
    "reviews.outOf": "من 5",
    "reviews.basedOn": "بناءً على {count} تقييمًا على Google",
    "reviews.source": "Google",
    "reviews.verified": "موثّق عبر Google Maps",
    "reviews.ctaAll": "اعرض كل التقييمات على Google",
    "reviews.r1.name": "أحمد حسن",
    "reviews.r1.role": "مدير عمليات",
    "reviews.r1.time": "منذ أسبوعين",
    "reviews.r1.text":
      "تولّى فريق رينولدز شحنة معداتنا من هامبورغ إلى الإسكندرية من الألف إلى الياء. أوراق واضحة، ولا تأخير في الجمارك، والفريق يردّ خلال دقائق. مستوى خدمة نادر في مجال الشحن.",
    "reviews.r2.name": "مريم صالح",
    "reviews.r2.role": "مديرة استيراد",
    "reviews.r2.time": "منذ شهر",
    "reviews.r2.text":
      "نشحن مع رينولدز شحنات FCL وLCL منذ عامين. الأسعار عادلة، والتخليص الجمركي محترف، والفريق يردّ على الهاتف فوراً عند أي طارئ. شيء نادر في السوق.",
    "reviews.r3.name": "عمر الشرقاوي",
    "reviews.r3.role": "مسؤول مشتريات",
    "reviews.r3.time": "منذ 3 أشهر",
    "reviews.r3.text":
      "استعنّا بهم في شحنة جوية عاجلة من القاهرة إلى روتردام. حجزنا يوم الأحد، والشحنة طارت ليلة الإثنين. رينولدز يفهمون اللوجستيات حقاً — ليس مجرد شحن.",

    // ─── Careers ──────────────────────────────────────────────────────────
    "careers.eyebrow": "وظائف",
    "careers.title.part1": "ابنِ مسيرة مهنية",
    "careers.title.highlight": "تحرّك العالم.",
    "careers.intro":
      "نحن فريق شحن سريع النمو مقرّه الإسكندرية. إذا كنت تعمل بكفاءة تحت الضغط وتهتم بالدقة وتريد أن تكون جزءاً من شيء حقيقي — نريد أن نسمع منك.",
    "careers.benefit.growth.title": "نموّ سريع",
    "careers.benefit.growth.copy": "مسؤولية حقيقية منذ اليوم الأول. لا انتظار سنتين لدور فعلي.",
    "careers.benefit.impact.title": "أثر حقيقي",
    "careers.benefit.impact.copy": "عملك يحرّك حاويات وطائرات وشاحنات — ليس شرائح عروض تقديمية.",
    "careers.benefit.culture.title": "فريق متماسك",
    "careers.benefit.culture.copy": "طاقم صغير وحاد — الجميع يعرف المهمة والجميع يُحسب له.",
    "careers.benefit.perks.title": "حزمة تنافسية",
    "careers.benefit.perks.copy": "راتب عادل، مكافآت أداء، تأمين صحي، وتدريب ممول.",
    "careers.form.eyebrow": "قدّم الآن",
    "careers.form.title.part1": "أرسِل لنا",
    "careers.form.title.highlight": "طلبك.",
    "careers.form.intro": "أدخِل بياناتك وأرفق سيرتك الذاتية، وسنتواصل معك خلال 3 أيام عمل.",
    "careers.form.fullName": "الاسم الكامل *",
    "careers.form.email": "البريد الإلكتروني *",
    "careers.form.phone": "رقم الهاتف",
    "careers.form.position": "الوظيفة المطلوبة *",
    "careers.form.experience": "سنوات الخبرة",
    "careers.form.linkedin": "رابط LinkedIn / الملف الشخصي",
    "careers.form.message": "خطاب تعريفي / رسالة",
    "careers.form.cv": "إرفاق السيرة الذاتية",
    "careers.form.cvDrop": "اسحب وأفلت سيرتك الذاتية هنا، أو انقر للاستعراض",
    "careers.form.cvHint": "PDF أو DOC أو DOCX · بحد أقصى 5 ميغابايت",
    "careers.form.cvSelected": "السيرة الذاتية مرفقة:",
    "careers.form.cvRemove": "إزالة",
    "careers.form.send": "إرسال الطلب",
    "careers.form.sending": "جارٍ الإرسال…",
    "careers.form.sent": "تم استلام طلبك!",
    "careers.form.footnote": "نراجع كل طلب شخصياً ونرد خلال 3 أيام عمل.",
    "careers.position.sea": "عمليات الشحن البحري",
    "careers.position.air": "منسّق الشحن الجوي",
    "careers.position.land": "النقل البري",
    "careers.position.customs": "مسؤول التخليص الجمركي",
    "careers.position.warehouse": "عمليات المستودع",
    "careers.position.sales": "المبيعات وتطوير الأعمال",
    "careers.position.cs": "خدمة العملاء",
    "careers.position.ops": "مدير العمليات",
    "careers.position.finance": "المالية والمحاسبة",
    "careers.position.general": "طلب عام",
    "careers.experience.fresh": "خريج حديث (0–1 سنة)",
    "careers.experience.1to3": "1–3 سنوات",
    "careers.experience.3to5": "3–5 سنوات",
    "careers.experience.5to10": "5–10 سنوات",
    "careers.experience.10plus": "أكثر من 10 سنوات",

    // ─── Footer ───────────────────────────────────────────────────────────
    "footer.tagline":
      "شركة شحن مقرّها الإسكندرية تنقل البضائع بين مصر والعالم منذ 2018.",
    "footer.section.company": "الشركة",
    "footer.section.services": "الخدمات",
    "footer.section.contact": "تواصل معنا",
    "footer.address.line1": "6 شارع طلعت حرب، الدور الثالث،",
    "footer.address.line2": "العطارين، الإسكندرية",
    "footer.rights": "\u00A92026 رينولدز مصر. جميع الحقوق محفوظة.",
    "footer.crafted":
      "صُنع في الإسكندرية — نحرّك العالم منذ 2018.",

    // ─── Chatbot ──────────────────────────────────────────────────────────
    "chat.title": "مساعد رينولدز",
    "chat.status": "متصل · الإسكندرية",
    "chat.open": "فتح المحادثة",
    "chat.close": "إغلاق المحادثة",
    "chat.send": "إرسال",
    "chat.placeholder": "اسأل عن الأسعار، الجمارك، الموانئ…",
    "chat.intro":
      "مرحباً — أنا مساعد عمليات رينولدز. اسألني عن الأسعار أو الخطوط أو الجمارك أو التخزين.",
    "chat.quick.quote": "احصل على عرض سعر",
    "chat.quick.lanes": "الخطوط من الإسكندرية",
    "chat.quick.customs": "تخليص جمركي",
    "chat.quick.contact": "التواصل مع شخص",
    "chat.reply.quote":
      "للحصول على عرض سعر مُخصَّص، مرّر إلى نموذج الأسعار أدناه — يكفي المصدر والوجهة ونوع الشحنة للبدء. نردّ خلال ساعة.",
    "chat.reply.customs":
      "لدينا رخص تخليص في جميع الموانئ المصرية الكبرى — الإسكندرية وبورسعيد ودمياط والعين السخنة والسويس وسفاجا. مع استشارات ترميز HS وتحسين الرسوم.",
    "chat.reply.lanes":
      "لدينا خطوط نشطة من ست موانئ مصرية إلى أكثر من 17 مركزاً عالمياً — روتردام، هامبورغ، أنتويرب، جبل علي، سنغافورة، شانغهاي، نيويورك، لوس أنجلوس، وغيرها.",
    "chat.reply.contact":
      "تواصل مع فريقنا عبر info@reynoldsegypt.com أو 03-4838515 — العمليات متاحة 24/7.",
    "chat.reply.warehouse":
      "تخزين في المناطق الحرة والجمركية بالإسكندرية: تجهيز وتعبئة وعبور ومتابعة مخزون.",
    "chat.reply.hi":
      "أهلاً! ما الذي تشحنه، وإلى أين هو متجه؟",
    "chat.reply.fallback":
      "تمام — دعني أحوّلك لشخص من الفريق. راسلنا على info@reynoldsegypt.com أو اتصل على 03-4838515، والفريق سيتولى الأمر.",
  },
};

/**
 * Resolve a translation key for a given language with a safe fallback chain:
 *   lang -> en -> key
 */
export function resolveTranslation(lang: Lang, key: string): string {
  return (
    TRANSLATIONS[lang]?.[key] ??
    TRANSLATIONS.en[key] ??
    key
  );
}
