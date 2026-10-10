import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
import {
  Droplets,
  ShieldCheck,
  Wrench,
  Sparkles,
  Phone,
  MessageCircle,
  Gift,
  CheckCircle2,
  Flame,
  Package,
  Loader2,
  PartyPopper,
  Star,
  Truck,
  RotateCcw,
  Headphones,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Zap,
  ArrowRight,
  Frown,
  Smile,
  BadgeCheck,
  HelpCircle,
  ChevronDown,
  Play,
  X,
} from "lucide-react";
// Mock delivery functions
const getDeliveryCharge = (subtotal: number, dhakaConfig: any, area: string) =>
  area === "inside" ? 60 : 120;
const getDhakaConfig = () => ({ enabled: true, inside: 60, outside: 120 });

const trackInitiateCheckout = (
  price: number,
  qty: number,
  currency: string,
) => {
  if (typeof window !== "undefined" && (window as any).trackEvent) {
    (window as any).trackEvent("InitiateCheckout", {
      value: price,
      num_items: qty,
      currency,
    });
  }
};
const trackAddToCart = (name: string, price: number, currency: string) => {
  if (typeof window !== "undefined" && (window as any).trackEvent) {
    (window as any).trackEvent("AddToCart", {
      content_name: name,
      value: price,
      currency,
    });
  }
};
const trackPurchase = (price: number, currency: string) => {
  if (typeof window !== "undefined" && (window as any).trackEvent) {
    (window as any).trackEvent("Purchase", { value: price, currency });
  }
};
const trackViewContent = (
  id: string,
  name: string,
  price: number,
  currency: string,
) => {
  if (typeof window !== "undefined" && (window as any).trackEvent) {
    (window as any).trackEvent("ViewContent", {
      content_name: name,
      value: price,
      currency,
    });
  }
};
const imgBefore = "/lp/tap-filter/before-poster.webp";
const imgAfter = "/lp/tap-filter/after-poster.webp";

type Tier = {
  pieces: number;
  price: number; // BDT per package
  freebies: string[];
  badge?: string;
  highlight?: boolean;
  ribbon?: string;
  image?: string;
  alt?: string;
  productId: string;
};

const tapFilterPackageImages = [
  "/lp/tap-filter/package-25-v20260830.webp",
  "/lp/tap-filter/package-50-v20260830.webp",
  "/lp/tap-filter/package-100-v20260830.webp",
  "/lp/tap-filter/package-200-v20260830.webp",
] as const;

const tiers: Tier[] = [
  {
    pieces: 25,
    price: 390,
    freebies: ["ভেলক্রো ব্যান্ড 10 পিস"],
    image: tapFilterPackageImages[0],
    alt: "২৫ পিস Premium water faucet filter প্যাকেজ",
    productId: "6a9955125f81c2adfbdc51d3",
  },
  {
    pieces: 50,
    price: 650,
    freebies: ["ভেলক্রো ব্যান্ড 20 পিস"],
    image: tapFilterPackageImages[1],
    alt: "৫০ পিস Premium water faucet filter প্যাকেজ",
    productId: "6a9954a85f81c2adfbdc4570",
  },
  {
    pieces: 100,
    price: 880,
    freebies: ["ভেলক্রো ব্যান্ড ৪০ পিস"],
    badge: "সবচেয়ে জনপ্রিয়",
    highlight: true,
    ribbon: "BEST VALUE",
    image: tapFilterPackageImages[2],
    alt: "১০০ পিস Premium water faucet filter বেস্ট ভ্যালু কম্বো",
    productId: "6a9954a35f81c2adfbdc44dc",
  },
  {
    pieces: 200,
    price: 1180,
    freebies: ["ভেলক্রো ব্যান্ড ৮০ পিস"],
    badge: "COMBO",
    image: tapFilterPackageImages[3],
    alt: "২০০ পিস Premium water faucet filter কম্বো",
    productId: "6a6f7b716841324a31ccb46b",
  },
];

const trustItems = [
  { icon: Droplets, label: "পরিস্কার ও বিশুদ্ধ পানি" },
  { icon: ShieldCheck, label: "অন্তদ্ধতা অপসারণে কার্যকর" },
  { icon: Wrench, label: "সহজে ইনস্টল করা যায়" },
];

const reviews = [
  {
    name: "রাশেদা বেগম",
    city: "ঢাকা",
    rating: 5,
    text: "পানি অনেক পরিস্কার আসে এখন। ইনস্টল করাও অনেক সহজ ছিল। পরিবারের সবাই খুশি।",
  },
  {
    name: "মোঃ ইমরান হোসেন",
    city: "চট্টগ্রাম",
    rating: 5,
    text: "দাম অনুযায়ী প্রোডাক্টের কোয়ালিটি অসাধারণ। ট্যাপের ময়লা একদম আটকে ফেলে।",
  },
  {
    name: "সুমাইয়া আক্তার",
    city: "সিলেট",
    rating: 4,
    text: "ডেলিভারি দ্রুত পেয়েছি, প্যাকেজিং ভালো ছিল। কাজ করছে ভালোভাবেই, রেকমেন্ড করব।",
  },
  {
    name: "আব্দুল করিম",
    city: "খুলনা",
    rating: 5,
    text: "কম্বো প্যাকেজ নিয়েছিলাম — পুরো ফ্যামিলিতে বিলিয়ে দিয়েছি। সবাই পজিটিভ ফিডব্যাক দিয়েছে।",
  },
];

const stats = [
  { icon: Package, value: 12500, suffix: "+", label: "মোট বিক্রি" },
  { icon: Star, value: 4.9, decimals: 1, suffix: "/৫", label: "গড় রেটিং" },
  { icon: Truck, value: 9800, suffix: "+", label: "সফল ডেলিভারি" },
  { icon: Users, value: 8600, suffix: "+", label: "সন্তুষ্ট কাস্টমার" },
];

const trustBadges = [
  { icon: Truck, title: "ক্যাশ অন ডেলিভারি", desc: "পণ্য হাতে পেয়ে পেমেন্ট" },
  { icon: RotateCcw, title: "সহজ রিটার্ন", desc: "৭ দিনের রিটার্ন গ্যারান্টি" },
  { icon: Headphones, title: "২৪/৭ সাপোর্ট", desc: "যেকোনো সময় যোগাযোগ" },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "মজবুত ও টেকসই",
    desc: "উন্নত মানের ম্যাটেরিয়ালে তৈরি, দীর্ঘদিন ব্যবহারের জন্য উপযোগী।",
  },
  {
    icon: Wrench,
    title: "সহজে লাগানো ও খুলে ফেলা যায়",
    desc: "কোনো টুলস ছাড়াই ঘরের যেকোনো ট্যাপে সহজে সংযোগ করা যায়।",
  },
  {
    icon: Sparkles,
    title: "দীর্ঘস্থায়ী ব্যবহার উপযোগী",
    desc: "বার বার পরিষ্কার করে ব্যবহার করা যায়, খরচ সাশ্রয়ী।",
  },
];

const districts = [
  "ঢাকা",
  "চট্টগ্রাম",
  "খুলনা",
  "রাজশাহী",
  "সিলেট",
  "বরিশাল",
  "রংপুর",
  "ময়মনসিংহ",
  "কুমিল্লা",
  "নারায়ণগঞ্জ",
  "গাজীপুর",
  "নরসিংদী",
  "টাঙ্গাইল",
  "কক্সবাজার",
  "বগুড়া",
  "যশোর",
  "ফরিদপুর",
  "দিনাজপুর",
  "পাবনা",
  "কুষ্টিয়া",
  "নোয়াখালী",
  "ফেনী",
  "চাঁদপুর",
  "মৌলভীবাজার",
  "হবিগঞ্জ",
  "সুনামগঞ্জ",
  "অন্যান্য",
];

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("tf-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const phone = "+8801860229546";
const waHref = `https://wa.me/8801860229546?text=হ্যালো%20Griha%20Nova!%20আমি%20অ্যাডভান্সড%20ট্যাপ%20ফিল্টার%20সম্পর্কে%20বিস্তারিত%20জানতে%20চাই।`;

function BengaliNum(n: number | string) {
  const map: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return String(n)
    .split("")
    .map((c) => map[c] ?? c)
    .join("");
}

function CountUp({
  end,
  decimals = 0,
  suffix = "",
  duration = 1600,
}: {
  end: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const t0 = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - t0) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(end * eased);
              if (p < 1) requestAnimationFrame(tick);
              else setVal(end);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [end, duration]);
  const formatted =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString("en-US");
  return (
    <span ref={ref}>
      {BengaliNum(formatted)}
      {suffix}
    </span>
  );
}

const OFFER_DURATION_MS = 24 * 60 * 60 * 1000; // 24h rolling window

function UrgencyBar({ onCta }: { onCta: () => void }) {
  // Rolling 24h countdown anchored per-browser (localStorage) so refresh doesn't reset weirdly.
  const targetRef = useRef<number>(0);
  const [remaining, setRemaining] = useState<number>(OFFER_DURATION_MS);
  const [viewers, setViewers] = useState<number>(
    () => 38 + Math.floor(Math.random() * 24),
  );

  useEffect(() => {
    const KEY = "tf_offer_deadline";
    const now = Date.now();
    let dl = Number(localStorage.getItem(KEY) || 0);
    if (!dl || dl - now <= 0 || dl - now > OFFER_DURATION_MS) {
      dl = now + OFFER_DURATION_MS;
      localStorage.setItem(KEY, String(dl));
    }
    targetRef.current = dl;
    const tick = () =>
      setRemaining(Math.max(0, targetRef.current - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () => {
      setViewers((v) => {
        // -5..+5, occasional bigger swing of -8..+8 for more noticeable movement
        const big = Math.random() < 0.25;
        const range = big ? 9 : 6;
        const delta = Math.floor(Math.random() * range) - Math.floor(range / 2);
        const next = v + delta;
        return Math.max(22, Math.min(84, next));
      });
    };
    // randomized interval between ~1.8s and ~3.2s so it doesn't feel mechanical
    let id: number;
    const loop = () => {
      tick();
      id = window.setTimeout(loop, 1800 + Math.random() * 1400);
    };
    id = window.setTimeout(loop, 1500);
    return () => window.clearTimeout(id);
  }, []);

  const totalSec = Math.floor(remaining / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return null;
}

function ReviewsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-review-card]");
    const w = card?.offsetWidth ?? 300;
    el.scrollBy({ left: dir * (w + 16), behavior: "smooth" });
  };
  return (
    <section className="py-14 md:py-20 bg-gradient-to-b from-sky-50/70 via-white to-sky-50/40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8" data-reveal>
          <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
            <Award className="w-3.5 h-3.5" /> কাস্টমার রিভিউ
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-sky-900">
            আমাদের গ্রাহকরা কী বলছেন
          </h2>
          <p className="mt-2 text-slate-600 text-sm md:text-base">
            হাজারো সন্তুষ্ট পরিবারের ভরসার নাম
          </p>
        </div>

        <div className="relative" data-reveal>
          <button
            type="button"
            aria-label="আগের রিভিউ"
            onClick={() => scrollBy(-1)}
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md ring-1 ring-sky-100 items-center justify-center text-sky-700 hover:bg-sky-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="পরবর্তী রিভিউ"
            onClick={() => scrollBy(1)}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md ring-1 ring-sky-100 items-center justify-center text-sky-700 hover:bg-sky-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 -mx-4 px-4 tf-review-track"
          >
            {reviews.map((r, i) => (
              <article
                key={i}
                data-review-card
                className="tf-card rounded-2xl p-5 snap-start flex-shrink-0 w-[85%] sm:w-[46%] md:w-[31%] lg:w-[24%] flex flex-col"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 text-white font-bold flex items-center justify-center text-lg shadow">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sky-900 text-sm leading-tight">
                      {r.name}
                    </div>
                    <div className="text-xs text-slate-500">{r.city}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star
                      key={k}
                      className={`w-4 h-4 ${k < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  "{r.text}"
                </p>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ভেরিফায়েড ক্রেতা
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const PHONE_RE = /^01[3-9]\d{8}$/;

export default function TapFilterLanding() {
  useReveal();
  const [droplets] = useState(() => Array.from({ length: 14 }, (_, i) => i));

  // form state
  const formRef = useRef<HTMLDivElement>(null);
  const tierScrollRef = useRef<HTMLDivElement>(null);
  const isAutoScrollingRef = useRef(false);
  const [activeTierIdx, setActiveTierIdx] = useState(0);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");
  const [tierPieces, setTierPieces] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">(
    "outside",
  );
  const dhakaCfg = getDhakaConfig();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  // State updates are async; this synchronous lock prevents two rapid submit
  // taps from creating two orders and therefore two Purchase events.
  const submitLockRef = useRef(false);
  const [success, setSuccess] = useState<null | { orderId: string }>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(false);

  // Auto-slide pricing tiers with robust manual-interaction pause
  useEffect(() => {
    const el = tierScrollRef.current;
    if (!el) return;
    let hoverPaused = false;
    let interactUntil = 0;
    const IDLE_MS = 7000;
    const bumpIdle = () => {
      interactUntil = Date.now() + IDLE_MS;
    };
    // Only bump idle from USER-initiated scroll (ignore programmatic auto-scroll)
    const onUserScroll = () => {
      if (!isAutoScrollingRef.current) bumpIdle();
      updateActiveIdx();
    };
    const onEnter = () => {
      hoverPaused = true;
    };
    const onLeave = () => {
      hoverPaused = false;
    };

    const getStep = () => {
      const first = el.children[0] as HTMLElement | undefined;
      if (!first) return 0;
      const style = window.getComputedStyle(el);
      const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      return first.offsetWidth + gap;
    };
    const updateActiveIdx = () => {
      const step = getStep();
      if (!step) return;
      const idx = Math.round(el.scrollLeft / step);
      setActiveTierIdx(Math.max(0, Math.min(tiers.length - 1, idx)));
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("pointerdown", bumpIdle);
    el.addEventListener("pointerup", bumpIdle);
    el.addEventListener("touchstart", bumpIdle, { passive: true });
    el.addEventListener("touchmove", bumpIdle, { passive: true });
    el.addEventListener("touchend", bumpIdle, { passive: true });
    el.addEventListener("wheel", bumpIdle, { passive: true });
    el.addEventListener("scroll", onUserScroll, { passive: true });

    const id = window.setInterval(() => {
      if (!el) return;
      if (hoverPaused) return;
      if (Date.now() < interactUntil) return;
      const step = getStep();
      if (!step) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const next = el.scrollLeft + step;
      const target = next > maxScroll - 4 ? 0 : next;
      isAutoScrollingRef.current = true;
      el.scrollTo({ left: target, behavior: "smooth" });
      window.setTimeout(() => {
        isAutoScrollingRef.current = false;
        updateActiveIdx();
      }, 700);
    }, 3600);

    updateActiveIdx();

    return () => {
      window.clearInterval(id);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("pointerdown", bumpIdle);
      el.removeEventListener("pointerup", bumpIdle);
      el.removeEventListener("touchstart", bumpIdle);
      el.removeEventListener("touchmove", bumpIdle);
      el.removeEventListener("touchend", bumpIdle);
      el.removeEventListener("wheel", bumpIdle);
      el.removeEventListener("scroll", onUserScroll);
    };
  }, []);

  const scrollTierTo = (idx: number) => {
    const el = tierScrollRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    if (!first) return;
    const style = window.getComputedStyle(el);
    const gap = parseFloat(style.columnGap || style.gap || "0") || 0;
    const step = first.offsetWidth + gap;
    isAutoScrollingRef.current = true;
    el.scrollTo({ left: step * idx, behavior: "smooth" });
    window.setTimeout(() => {
      isAutoScrollingRef.current = false;
      setActiveTierIdx(idx);
    }, 700);
  };

  const selectedTier = tiers.find((t) => t.pieces === tierPieces) ?? tiers[3];
  const subtotal = selectedTier.price * Math.max(1, quantity);
  const deliveryCharge = getDeliveryCharge(subtotal, undefined, deliveryArea);
  const grandTotal = subtotal + deliveryCharge;

  // ViewContent — once on mount (helper already pushes view_item to dataLayer)
  const viewContentFiredRef = useRef(false);
  useEffect(() => {
    if (viewContentFiredRef.current) return;
    viewContentFiredRef.current = true;
    try {
      trackViewContent(
        "lp-tap-filter",
        "Water faucet tap filter",
        selectedTier.price,
        "BDT",
      );
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // AddToCart — exactly once on real checkout intent. Package browsing is not
  // an add-to-cart action and previously caused extra events before form use.
  const addToCartFiredRef = useRef(false);
  const fireAddToCart = (pieces: number, price: number) => {
    if (addToCartFiredRef.current) return;
    addToCartFiredRef.current = true;
    try {
      // helper fires Pixel + CAPI + dataLayer add_to_cart (single push)
      trackAddToCart(`lp-tap-filter-${pieces}pcs`, price, "BDT");
    } catch (e) {
      console.warn("AddToCart track failed", e);
    }
  };
  const hasFiredInitiateCheckoutRef = useRef(false);
  const handleFormFieldInteract = () => {
    if (hasFiredInitiateCheckoutRef.current) return;
    hasFiredInitiateCheckoutRef.current = true;
    // Ensure AddToCart always precedes InitiateCheckout (even if user never switched package)
    fireAddToCart(tierPieces, selectedTier.price);
    try {
      // helper fires Pixel + CAPI + dataLayer begin_checkout (single push)
      trackInitiateCheckout(subtotal, Math.max(1, quantity), "BDT");
    } catch (err) {
      console.warn("InitiateCheckout track failed", err);
    }
  };

  const scrollToForm = (pieces?: number) => {
    if (pieces) setTierPieces(pieces);
    const tierToTrack = pieces
      ? tiers.find((t) => t.pieces === pieces)
      : selectedTier;
    if (tierToTrack) {
      fireAddToCart(tierToTrack.pieces, tierToTrack.price);
    }
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 30);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "নাম দিন";
    else if (name.trim().length < 2) e.name = "নাম কমপক্ষে ২ অক্ষরের হতে হবে";
    const m = mobile.replace(/\D/g, "");
    if (!m) e.mobile = "মোবাইল নম্বর দিন";
    else if (!PHONE_RE.test(m))
      e.mobile = "সঠিক মোবাইল নম্বর দিন (০১XXXXXXXXX)";
    if (!address.trim()) e.address = "ঠিকানা দিন";
    else if (address.trim().length < 5) e.address = "সম্পূর্ণ ঠিকানা লিখুন";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const isFormFilled = () => {
    const m = mobile.replace(/\D/g, "");
    return (
      name.trim().length >= 2 && PHONE_RE.test(m) && address.trim().length >= 5
    );
  };

  const handleFloatingCta = () => {
    if (isFormFilled() && !submitting) {
      handleSubmit();
    } else {
      scrollToForm();
    }
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (submitLockRef.current || submitting) return;
    if (!validate()) return;

    submitLockRef.current = true;
    setSubmitting(true);
    try {
      const combinedNote = [
        `প্যাকেজ: ${selectedTier.pieces} পিস`,
        `পরিমাণ: ${quantity} প্যাকেজ`,
        `ফ্রি গিফট: ${selectedTier.freebies.join(" + ")}`,
        note.trim() ? `নোট: ${note.trim()}` : "",
        "উৎস: /lp/tap-filter",
      ]
        .filter(Boolean)
        .join("\n");

      const orderData = {
        name: name.trim(),
        phone_no: mobile.replace(/\D/g, ""),
        shipping_address: address.trim(),
        division: deliveryArea === "inside" ? "inside-dhaka" : "outside-dhaka",
        product_id: selectedTier.productId,
        quantity: quantity,
        deliveryCharge: deliveryCharge,
        note: combinedNote,
      };

      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      let result;
      try {
        result = await response.json();
      } catch (e) {
        throw new Error("Server error");
      }

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Order failed");
      }

      // Redirect to Thank You page smoothly
      window.location.href =
        "/success-order?orderId=" + (result.data?.orderId || "12345") + "&value=" + grandTotal;
    } catch (err: any) {
      submitLockRef.current = false;
      const msg =
        err?.message ||
        err?.error_description ||
        err?.details ||
        err?.hint ||
        (typeof err === "string" ? err : JSON.stringify(err));
      console.error("[tap-filter] order submit failed:", err);
      setErrors({
        submit: msg || "অর্ডার পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tf-root min-h-screen text-slate-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800&display=swap');
        .tf-root { background: linear-gradient(180deg, #eaf6ff 0%, #f7fbff 40%, #ffffff 100%); font-family: 'Anek Bangla', 'Hind Siliguri', system-ui, sans-serif; }
        .tf-root, .tf-root * { font-family: 'Anek Bangla', 'Hind Siliguri', system-ui, sans-serif; }
        .tf-hero { position: relative; overflow: hidden; background: radial-gradient(1200px 500px at 50% -10%, #7dd3fc 0%, #38bdf8 30%, #0369a1 80%); color: #fff; }
        .tf-hero::before { content:""; position:absolute; inset:0; background: radial-gradient(600px 300px at 80% 20%, rgba(255,255,255,.25), transparent 60%); }
        .tf-drop { position: absolute; top: -20px; width: 10px; height: 14px; background: rgba(255,255,255,.7); border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; filter: blur(.3px); animation: tf-fall linear infinite; }
        @keyframes tf-fall { 0%{ transform: translateY(-40px) scale(.8); opacity:0; } 10%{opacity:1;} 100% { transform: translateY(110vh) scale(1); opacity:0; } }
        @keyframes tf-ripple { 0% { transform: scale(.6); opacity:.6; } 100% { transform: scale(2.2); opacity:0; } }
        .tf-ripple { position:absolute; inset:auto; width: 120px; height: 120px; border-radius: 999px; border: 2px solid rgba(255,255,255,.5); animation: tf-ripple 2.4s ease-out infinite; }
        @keyframes tf-play-pulse { 0%,100% { transform: scale(1); box-shadow: 0 10px 40px rgba(0,0,0,.35); } 50% { transform: scale(1.08); box-shadow: 0 14px 48px rgba(56,189,248,.55); } }
        .tf-play-btn { animation: tf-play-pulse 1.8s ease-in-out infinite; }
        @keyframes tf-play-ring { 0% { transform: scale(1); opacity:.7; } 100% { transform: scale(1.9); opacity:0; } }
        .tf-play-ring { position:absolute; inset:0; border-radius:999px; border:2px solid rgba(255,255,255,.85); animation: tf-play-ring 1.8s ease-out infinite; }
        .tf-hero-video-btn:hover .tf-play-btn { transform: scale(1.12); }
        @keyframes tf-bounce { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-6px);} }
        .tf-bounce { animation: tf-bounce 1.6s ease-in-out infinite; }
        @keyframes tf-pulse { 0%,100%{ box-shadow: 0 0 0 0 rgba(56,189,248,.6);} 50%{ box-shadow: 0 0 0 14px rgba(56,189,248,0);} }
        .tf-pulse { animation: tf-pulse 2s ease-out infinite; }
        /* Animations disabled for faster loading */
        .tf-card { background: linear-gradient(180deg, rgba(255,255,255,.9), rgba(240,249,255,.9)); backdrop-filter: blur(6px); border: 1px solid rgba(56,189,248,.25); box-shadow: 0 10px 30px -12px rgba(2,132,199,.25); transition: transform .3s ease, box-shadow .3s ease; }
        .tf-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px -12px rgba(2,132,199,.4); }
        .tf-card-best { background: linear-gradient(180deg, #fff7ed, #fff); border: 2px solid #f97316; box-shadow: 0 20px 40px -10px rgba(249,115,22,.35); }
        .tf-cta { position: relative; overflow: hidden; background: linear-gradient(90deg, #f97316, #ef4444, #f59e0b, #ef4444, #f97316); background-size: 300% 100%; color: #fff; box-shadow: 0 8px 20px -6px rgba(239,68,68,.45); border: none; cursor: pointer; animation: tf-cta-glow 3.6s ease-in-out infinite, tf-cta-shift 6s linear infinite, tf-cta-zoom 1.6s ease-in-out infinite; transition: filter .25s ease, box-shadow .25s ease; transform-origin: center; }
        .tf-cta::before { content: none; }
        .tf-cta::after { content:""; position:absolute; inset:0; border-radius:inherit; background: radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,.35), transparent 60%); pointer-events:none; opacity:.55; }
        .tf-cta > * { position: relative; z-index: 1; }
        .tf-cta:hover { filter: brightness(1.08); box-shadow: 0 14px 28px -8px rgba(239,68,68,.6); }
        .tf-cta:active { animation-play-state: paused; filter: brightness(.95); }
        .tf-cta:disabled { opacity: .7; cursor: not-allowed; animation: none; }
        @keyframes tf-cta-shift { 0%{ background-position: 0% 50%;} 100%{ background-position: 300% 50%;} }
        @keyframes tf-cta-glow { 0%,100%{ box-shadow: 0 8px 20px -6px rgba(239,68,68,.45), 0 0 0 0 rgba(249,115,22,.45);} 50%{ box-shadow: 0 12px 26px -6px rgba(239,68,68,.55), 0 0 0 12px rgba(249,115,22,0);} }
        @keyframes tf-cta-shine { 0%{ left:-60%;} 55%,100%{ left:130%;} }
        @keyframes tf-cta-zoom { 0%,100%{ transform: scale(1);} 50%{ transform: scale(1.06);} }
        @media (prefers-reduced-motion: reduce) { .tf-cta, .tf-cta::before { animation: none !important; } }

        .tf-ribbon { position:absolute; top:10px; right:10px; background:linear-gradient(135deg,#ef4444,#f97316); color:#fff; font-weight:800; font-size:10px; padding: 4px 10px; letter-spacing: .5px; border-radius: 999px; box-shadow: 0 4px 12px -2px rgba(239,68,68,.5); z-index: 2; }
        .tf-water-fill { background: linear-gradient(180deg, #7dd3fc 0%, #0284c7 100%); position:relative; overflow:hidden; }
        .tf-water-fill::after { content:""; position:absolute; left:0; right:0; top:-8px; height:16px; background: radial-gradient(circle at 10% 50%, #fff 2px, transparent 3px) repeat-x; background-size: 24px 16px; animation: tf-wave 3s linear infinite; opacity:.55; }
        @keyframes tf-wave { 0%{ background-position: 0 0;} 100%{ background-position: 24px 0;} }
        .tf-tier-scroll { scrollbar-width: none; -ms-overflow-style: none; touch-action: pan-x pan-y; -webkit-overflow-scrolling: touch; overscroll-behavior-x: contain; scroll-padding-left: 16px; padding-top: 26px; padding-bottom: 12px; padding-left: 4px; padding-right: 4px; }
        .tf-tier-scroll::-webkit-scrollbar { display: none; }
        .tf-tier-card { width: 82vw; max-width: 360px; scroll-snap-align: start; }
        .tf-tier-image { height: 240px; }
        @media (min-width: 640px) { .tf-tier-card { width: 58vw; max-width: 380px; } .tf-tier-image { height: 270px; } }
        @media (min-width: 768px) { .tf-tier-card { width: calc((100% - 48px) / 1.9); max-width: 360px; scroll-snap-align: start; } .tf-tier-image { height: 280px; } }
        @media (min-width: 1024px) { .tf-tier-card { width: calc((100% - 96px) / 3.3); max-width: 320px; } .tf-tier-image { height: 260px; } }
        .tf-tier-dot { width: 8px; height: 8px; border-radius: 999px; background: #cbd5e1; transition: all .25s ease; }
        .tf-tier-dot.active { background: linear-gradient(135deg,#0284c7,#0ea5e9); width: 24px; }
        .tf-tier-arrow { width:44px; height:44px; border-radius:999px; background:#fff; border:1px solid #e2e8f0; color:#0369a1; display:inline-flex; align-items:center; justify-content:center; box-shadow: 0 8px 20px -8px rgba(2,132,199,.35); transition: all .2s; }
        .tf-tier-arrow:hover { background:#f0f9ff; transform: scale(1.06); }
        .tf-tier-arrow:disabled { opacity:.4; cursor:not-allowed; }
        .tf-input { width:100%; border:1.5px solid #bae6fd; background:#fff; border-radius:12px; padding:12px 14px; font-size:15px; transition: border-color .2s, box-shadow .2s; }
        .tf-input:focus { outline:none; border-color:#0284c7; box-shadow: 0 0 0 3px rgba(2,132,199,.15); }
        .tf-input-err { border-color:#ef4444 !important; }
        .tf-label { display:block; font-size:13px; font-weight:600; color:#0c4a6e; margin-bottom:6px; }
        .tf-err { color:#dc2626; font-size:12px; margin-top:4px; font-weight:500; }
        @keyframes tf-pop { 0% { transform: scale(.4); opacity:0;} 60% { transform: scale(1.08);} 100% { transform: scale(1); opacity:1;} }
        .tf-pop { animation: tf-pop .5s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes tf-check-draw { to { stroke-dashoffset: 0; } }
        .tf-review-track { scrollbar-width: none; -ms-overflow-style: none; }
        .tf-review-track::-webkit-scrollbar { display: none; }

        /* Urgency bar */
        .tf-urgency-wrap { background: linear-gradient(180deg, #eaf6ff 0%, #f7fbff 100%); }
        .tf-urgency-card { background: linear-gradient(90deg, #0369a1 0%, #0284c7 45%, #0891b2 100%); color:#fff; border:1px solid rgba(255,255,255,.15); box-shadow: 0 18px 40px -18px rgba(2,132,199,.55); position:relative; overflow:hidden; }
        .tf-urgency-card::before { content:""; position:absolute; inset:0; background: radial-gradient(600px 200px at 90% 0%, rgba(255,255,255,.18), transparent 60%); pointer-events:none; }
        .tf-clock { font-variant-numeric: tabular-nums; }
        .tf-clock-seg { min-width: 52px; text-align:center; background: rgba(2,6,23,.55); color:#e0f2fe; border:1px solid rgba(125,211,252,.35); border-radius: 10px; padding: 6px 8px; box-shadow: inset 0 -2px 0 rgba(0,0,0,.25), 0 0 0 1px rgba(255,255,255,.05); }
        .tf-clock-num { font-family: 'Courier New', ui-monospace, monospace; font-weight: 800; font-size: 22px; line-height: 1; letter-spacing: 1px; text-shadow: 0 0 8px rgba(125,211,252,.55); animation: tf-clock-pulse 1s ease-in-out infinite; }
        .tf-clock-lbl { margin-top: 3px; font-size: 9px; font-weight: 700; letter-spacing: .5px; color: #bae6fd; text-transform: uppercase; }
        .tf-clock-colon { font-family: 'Courier New', monospace; font-weight: 800; font-size: 20px; color: #7dd3fc; animation: tf-blink 1s steps(2, start) infinite; }
        @keyframes tf-clock-pulse { 0%,100%{ text-shadow: 0 0 6px rgba(125,211,252,.45);} 50%{ text-shadow: 0 0 14px rgba(125,211,252,.9);} }
        @keyframes tf-blink { 50% { opacity: .25; } }
        @media (min-width: 768px){ .tf-clock-seg { min-width: 62px; padding: 8px 10px; } .tf-clock-num { font-size: 26px; } .tf-clock-lbl { font-size: 10px; } .tf-clock-colon { font-size: 24px; } }

        .tf-live-badge { display:inline-flex; align-items:center; gap:6px; background: rgba(255,255,255,.95); color:#0c4a6e; border:1px solid rgba(255,255,255,.7); border-radius: 999px; padding: 5px 11px; font-size: 12px; font-weight: 600; box-shadow: 0 4px 12px -4px rgba(0,0,0,.25); }
        .tf-live-dot { width: 8px; height: 8px; border-radius: 999px; background: #ef4444; box-shadow: 0 0 0 0 rgba(239,68,68,.6); animation: tf-live-pulse 1.4s ease-out infinite; flex-shrink:0; }
        @keyframes tf-live-pulse { 0%{ box-shadow: 0 0 0 0 rgba(239,68,68,.7);} 70%{ box-shadow: 0 0 0 8px rgba(239,68,68,0);} 100%{ box-shadow: 0 0 0 0 rgba(239,68,68,0);} }
        .tf-stock-badge { display:inline-flex; align-items:center; gap:5px; background: linear-gradient(90deg,#f59e0b,#ef4444); color:#fff; border-radius:999px; padding: 5px 11px; font-size:12px; font-weight:700; box-shadow: 0 4px 12px -4px rgba(239,68,68,.55); animation: tf-stock-shake 2.4s ease-in-out infinite; }
        @keyframes tf-stock-shake { 0%,92%,100%{ transform: rotate(0deg);} 94%{ transform: rotate(-3deg);} 96%{ transform: rotate(3deg);} 98%{ transform: rotate(-2deg);} }
        .tf-guarantee-pulse { animation: tf-guarantee-pulse 2.4s ease-in-out infinite; }
        @keyframes tf-guarantee-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.55), 0 10px 30px -8px rgba(8,47,73,0.35); } 50% { box-shadow: 0 0 0 14px rgba(255,255,255,0), 0 10px 30px -8px rgba(8,47,73,0.35); } }
      `}</style>

      {/* HERO */}
      <section className="tf-hero pt-14 pb-20 md:pt-20 md:pb-28">
        {droplets.map((i) => (
          <span
            key={i}
            className="tf-drop"
            style={{
              left: `${(i * 7 + 5) % 100}%`,
              animationDuration: `${3 + (i % 5)}s`,
              animationDelay: `${(i % 6) * 0.4}s`,
            }}
          />
        ))}
        <div className="relative max-w-5xl mx-auto px-4 flex flex-col items-center text-center gap-8 md:gap-10">
          <div>
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-400 text-white shadow-lg px-4 py-1.5 rounded-full text-[13px] font-bold tracking-wide">
              <Sparkles className="w-4 h-4" /> আল্ট্রা-প্রিমিয়াম কালেকশন
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight drop-shadow-xl mx-auto max-w-3xl">
              ১০০% বিশুদ্ধ পানির নিশ্চয়তায় <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-teal-200">
                প্রিমিয়াম ট্যাপ ফিল্টার
              </span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-cyan-50 font-medium leading-relaxed max-w-2xl mx-auto">
              ক্ষতিকর আয়রন, জীবাণু ও দুর্গন্ধ দূর করে আপনার পরিবারকে দিন
              সম্পূর্ণ নিরাপদ পানির গ্যারান্টি। পানি ফোটানোর ঝামেলা এবার ভুলে
              যান!
            </p>
          </div>

          <div className="relative w-full max-w-[280px] md:max-w-xs mx-auto">
            <div
              className="absolute -inset-4 rounded-3xl bg-white/10 blur-2xl"
              aria-hidden
            />
            <div
              className="relative w-full rounded-2xl overflow-hidden ring-1 ring-white/30 shadow-2xl bg-black"
              style={{ aspectRatio: "9 / 16" }}
            >
              {!isHeroVideoPlaying ? (
                <button
                  onClick={() => setIsHeroVideoPlaying(true)}
                  className="absolute inset-0 w-full h-full group outline-none flex items-center justify-center"
                  aria-label="Play video"
                >
                  <img
                    src="https://i.ytimg.com/vi/3tqlGvIhxpA/hqdefault.jpg"
                    alt="Tap Filter Demo"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/50 group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                </button>
              ) : (
                <iframe
                  src="https://www.youtube.com/embed/JdIvHLqJCQU?autoplay=1&mute=0&loop=1&playlist=JdIvHLqJCQU"
                  title="Tap Filter Demo Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              )}
            </div>
          </div>

          <div className="w-full flex flex-col items-center">
            <button
              type="button"
              onClick={() => scrollToForm()}
              className="tf-cta tf-pulse inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-xl w-full justify-center md:w-auto shadow-xl"
            >
              <Flame className="w-6 h-6" /> এখনই অর্ডার করুন
            </button>
            <div className="mt-8 grid grid-cols-3 gap-3 md:gap-4 max-w-lg mx-auto w-full">
              {trustItems.map((t) => (
                <div
                  key={t.label}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors rounded-2xl p-3 md:p-4 text-center border border-white/20 shadow-lg"
                >
                  <t.icon className="w-7 h-7 md:w-8 md:h-8 mx-auto mb-2 text-cyan-200 drop-shadow-md" />
                  <div className="text-[11px] md:text-sm font-bold leading-tight text-white">
                    {t.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* URGENCY BAR */}
      <UrgencyBar onCta={() => scrollToForm()} />

      {/* VIDEO MODAL */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in"
          onClick={() => setVideoOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Water faucet tap filter — লাইভ ডেমো ভিডিও"
        >
          <button
            type="button"
            onClick={() => setVideoOpen(false)}
            aria-label="বন্ধ করুন"
            className="absolute top-4 right-4 md:top-6 md:right-6 w-11 h-11 rounded-full bg-white/95 text-slate-900 flex items-center justify-center shadow-lg hover:scale-105 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/20 bg-black w-full"
            style={{ maxWidth: 360, aspectRatio: "9 / 16" }}
          >
            <iframe
              src="https://www.youtube.com/embed/JdIvHLqJCQU?autoplay=1&mute=0&loop=1&playlist=JdIvHLqJCQU"
              title="Tap Filter Demo Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      )}

      {/* BEFORE / AFTER */}
      <section className="py-14 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10" data-reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-sky-900">
              পার্থক্য দেখুন নিজেই
            </h2>
            <p className="mt-4 text-slate-700 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
              আপনার ট্যাপের পানি দেখতে যতই পরিষ্কার মনে হোক না কেন, তার ভেতরে লুকিয়ে থাকে প্রচুর অদৃশ্য ময়লা ও আয়রন। 
              <br className="hidden md:block" /> 
              নিচের ছবিটি দেখুন— ফিল্টার লাগানোর আগে পানি পরিষ্কার মনে হলেও, ব্যবহারের পর ফিল্টারটি কত পরিমাণ ময়লা আটকেছে তা স্পষ্ট!
            </p>
          </div>

          <div className="flex justify-center" data-reveal>
            <img 
              src="/lp/tap-filter/before-after-proof.jpg" 
              alt="ফিল্টার ব্যবহারের আগে ও পরে"
              width={800}
              height={800}
              loading="lazy"
              className="w-full max-w-2xl rounded-2xl shadow-2xl ring-4 ring-sky-100 object-cover"
            />
          </div>

          <div className="mt-8 flex justify-center" data-reveal>
            <button
              type="button"
              onClick={() => scrollToForm()}
              className="tf-cta inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-base"
            >
              <Flame className="w-5 h-5" /> এখনই অর্ডার করুন
            </button>
          </div>

          {/* GUARANTEE BADGE */}
          <div className="mt-12" data-reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-sky-500 to-cyan-500 text-white p-6 md:p-8 shadow-xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-cyan-300/20 blur-2xl" />
              <div className="relative flex flex-col md:flex-row items-center gap-5 md:gap-7">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-white text-sky-600 flex items-center justify-center shadow-lg ring-4 ring-white/40 tf-guarantee-pulse">
                    <ShieldCheck className="w-12 h-12 md:w-14 md:h-14" />
                  </div>
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    100%
                  </span>
                </div>
                <div className="text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-2">
                    <BadgeCheck className="w-3.5 h-3.5" /> আমাদের প্রতিশ্রুতি
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold">
                    ১০০% মানি ব্যাক গ্যারান্টি
                  </h3>
                  <p className="mt-1.5 text-sm md:text-base text-sky-50">
                    পণ্য পছন্দ না হলে বা কোনো সমস্যা থাকলে ৭ দিনের মধ্যে
                    সম্পূর্ণ টাকা ফেরত। মান ও বিশুদ্ধতার নিশ্চয়তা আমাদের।
                  </p>
                  <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2 text-[11px] font-bold">
                    <span className="bg-white/20 backdrop-blur px-2.5 py-1 rounded-full">
                      ✓ ৭ দিন রিটার্ন
                    </span>
                    <span className="bg-white/20 backdrop-blur px-2.5 py-1 rounded-full">
                      ✓ ক্যাশ অন ডেলিভারি
                    </span>
                    <span className="bg-white/20 backdrop-blur px-2.5 py-1 rounded-full">
                      ✓ বিশ্বস্ত ব্র্যান্ড
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewsSection />

      {/* PRICING */}
      <section id="pricing" className="py-14 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10" data-reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-sky-900">
              প্যাকেজ ও কম্বো অফার
            </h2>
            <p className="mt-2 text-slate-600">
              যত বেশি নিবেন — তত বেশি ফ্রি গিফট! সীমিত সময়ের অফার।
            </p>
          </div>

          <div className="relative">
            {/* Desktop arrows */}
            <button
              type="button"
              aria-label="আগের প্যাকেজ"
              onClick={() => scrollTierTo(Math.max(0, activeTierIdx - 1))}
              disabled={activeTierIdx === 0}
              className="tf-tier-arrow hidden md:inline-flex absolute -left-2 lg:-left-5 top-1/2 -translate-y-1/2 z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="পরের প্যাকেজ"
              onClick={() =>
                scrollTierTo(Math.min(tiers.length - 1, activeTierIdx + 1))
              }
              disabled={activeTierIdx >= tiers.length - 1}
              className="tf-tier-arrow hidden md:inline-flex absolute -right-2 lg:-right-5 top-1/2 -translate-y-1/2 z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div
              ref={tierScrollRef}
              className="tf-tier-scroll flex gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth"
            >
              {tiers.map((t, idx) => (
                <div
                  key={t.pieces}
                  className={`tf-tier-card relative rounded-2xl p-6 pt-9 flex flex-col snap-start flex-shrink-0 ${t.highlight ? "tf-card-best" : "tf-card"}`}
                >
                  {t.highlight && <div className="tf-ribbon">{t.ribbon}</div>}

                  <div className="absolute -top-3 -left-3 tf-bounce z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-extrabold text-base shadow-lg border-4 border-white">
                      ফ্রি!
                    </div>
                  </div>

                  {t.badge && !t.highlight && (
                    <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">
                      {t.badge}
                    </span>
                  )}

                  {t.image && (
                    <div className="tf-tier-image rounded-xl overflow-hidden bg-white ring-1 ring-sky-100 mb-4 flex items-center justify-center">
                      <img
                        src={t.image}
                        alt={t.alt || ""}
                        width={600}
                        height={600}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}

                  <div className="mt-5 flex-1">
                    <div className="mb-2 text-base md:text-lg font-extrabold text-sky-900 leading-tight">
                      Premium water faucet filter {BengaliNum(t.pieces)}ps
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 mb-2">
                      <Gift className="w-4 h-4" /> ফ্রি গিফট
                    </div>
                    <ul className="space-y-2">
                      {t.freebies.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm md:text-base text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToForm(t.pieces)}
                    className="tf-cta mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-bold text-base w-full"
                  >
                    এখনই অর্ডার করুন
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-5 flex justify-center items-center gap-2">
            {tiers.map((t, i) => (
              <button
                key={t.pieces}
                type="button"
                aria-label={`প্যাকেজ ${i + 1}`}
                onClick={() => scrollTierTo(i)}
                className={`tf-tier-dot ${i === activeTierIdx ? "active" : ""}`}
              />
            ))}
          </div>

          <div className="mt-3 flex justify-center gap-1.5 text-xs text-sky-700 md:hidden">
            <span className="inline-flex items-center gap-1 bg-sky-50 border border-sky-200 px-3 py-1 rounded-full">
              ← স্লাইড করুন →
            </span>
          </div>

          <div className="mt-8 text-center" data-reveal>
            <span className="inline-flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-full text-sm font-semibold">
              <Flame className="w-4 h-4" /> সীমিত সময়ের অফার — স্টক শেষ হওয়ার
              আগেই অর্ডার করুন!
            </span>
          </div>
        </div>
      </section>

      {/* ORDER FORM */}
      <section
        id="order"
        ref={formRef}
        className="py-14 md:py-20 bg-gradient-to-b from-sky-50 to-white"
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-8" data-reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-sky-900">
              অর্ডার ফর্ম
            </h2>
            <p className="mt-2 text-slate-600">
              নিচের ফর্মটি পূরণ করে সাবমিট করুন — আমরা দ্রুত যোগাযোগ করব।
            </p>
          </div>

          <div className="tf-card rounded-3xl p-6 md:p-8" data-reveal>
            {success ? (
              <div className="tf-pop text-center py-8">
                <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <svg viewBox="0 0 52 52" className="w-12 h-12">
                    <circle
                      cx="26"
                      cy="26"
                      r="24"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                    />
                    <path
                      d="M14 27 L23 36 L39 18"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        strokeDasharray: 50,
                        strokeDashoffset: 50,
                        animation: "tf-check-draw .6s .2s ease-out forwards",
                      }}
                    />
                  </svg>
                </div>
                <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                  <PartyPopper className="w-6 h-6" />
                  <h3 className="text-2xl md:text-3xl font-extrabold">
                    ধন্যবাদ!
                  </h3>
                </div>
                <p className="text-lg font-semibold text-slate-800">
                  আপনার অর্ডার পাওয়া গেছে ✅
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  অর্ডার আইডি:{" "}
                  <span className="font-mono font-bold text-sky-700">
                    {success.orderId}
                  </span>
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  আমরা শীঘ্রই আপনার নম্বরে যোগাযোগ করব ইনশাআল্লাহ।
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(null)}
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sky-700 border-2 border-sky-200 hover:bg-sky-50"
                >
                  আরেকটি অর্ডার দিন
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                {/* Package selector — 3 per row */}
                <div className="mb-5">
                  <label className="tf-label mb-2 block">
                    প্যাকেজ নির্বাচন করুন
                  </label>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {tiers.map((t) => {
                      const selected = t.pieces === tierPieces;
                      const regular = Math.round(t.price * 1.35);
                      return (
                        <button
                          type="button"
                          key={t.pieces}
                          onClick={() => setTierPieces(t.pieces)}
                          className={`relative text-left rounded-xl border-2 p-2.5 sm:p-3 transition-all ${
                            selected
                              ? "border-orange-500 bg-orange-50 shadow-md"
                              : "border-slate-200 bg-white hover:border-orange-300"
                          }`}
                          aria-pressed={selected}
                        >
                          {t.badge && (
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-500 text-white whitespace-nowrap">
                              {t.badge}
                            </span>
                          )}
                          <div className="text-[11px] sm:text-xs font-semibold text-slate-800 leading-tight">
                            {t.pieces} পিস প্যাকেজ
                          </div>
                          <div className="mt-1.5 flex items-baseline gap-1 flex-wrap">
                            <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                              ৳{regular.toLocaleString("en-US")}
                            </span>
                            <span className="text-sm sm:text-base font-extrabold text-orange-600">
                              ৳{t.price.toLocaleString("en-US")}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="grid gap-4">
                  <div>
                    <label className="tf-label">
                      নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`tf-input ${errors.name ? "tf-input-err" : ""}`}
                      placeholder="আপনার পূর্ণ নাম"
                      value={name}
                      onFocus={handleFormFieldInteract}
                      onChange={(e) => {
                        handleFormFieldInteract();
                        setName(e.target.value);
                      }}
                      maxLength={80}
                    />
                    {errors.name && <div className="tf-err">{errors.name}</div>}
                  </div>
                  <div>
                    <label className="tf-label">
                      মোবাইল নম্বর <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      className={`tf-input ${errors.mobile ? "tf-input-err" : ""}`}
                      placeholder="০১XXXXXXXXX"
                      value={mobile}
                      onFocus={handleFormFieldInteract}
                      onChange={(e) => {
                        handleFormFieldInteract();
                        setMobile(e.target.value);
                      }}
                      maxLength={14}
                    />
                    {errors.mobile && (
                      <div className="tf-err">{errors.mobile}</div>
                    )}
                  </div>
                  <div>
                    <label className="tf-label">
                      সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className={`tf-input ${errors.address ? "tf-input-err" : ""}`}
                      rows={2}
                      placeholder="বাসা, রোড, থানা, জেলা"
                      value={address}
                      onFocus={handleFormFieldInteract}
                      onChange={(e) => {
                        handleFormFieldInteract();
                        setAddress(e.target.value);
                      }}
                      maxLength={300}
                    />
                    {errors.address && (
                      <div className="tf-err">{errors.address}</div>
                    )}
                  </div>
                </div>

                {/* Delivery Area */}
                {dhakaCfg.enabled && (
                  <div className="mt-5">
                    <label className="tf-label mb-2 block">
                      ডেলিভারি এরিয়া
                    </label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {[
                        {
                          value: "inside" as const,
                          label: "ঢাকার মধ্যে",
                          charge: dhakaCfg.inside,
                        },
                        {
                          value: "outside" as const,
                          label: "ঢাকার বাইরে",
                          charge: dhakaCfg.outside,
                        },
                      ].map((opt) => {
                        const sel = deliveryArea === opt.value;
                        return (
                          <button
                            type="button"
                            key={opt.value}
                            onClick={() => setDeliveryArea(opt.value)}
                            className={`rounded-xl border-2 p-3 text-left transition-all ${
                              sel
                                ? "border-orange-500 bg-orange-50 shadow-md"
                                : "border-slate-200 bg-white hover:border-orange-300"
                            }`}
                            aria-pressed={sel}
                          >
                            <div className="text-sm font-semibold text-slate-800">
                              {opt.label}
                            </div>
                            <div className="text-xs text-orange-600 font-bold mt-0.5">
                              ডেলিভারি চার্জ ৳{opt.charge}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity stepper */}
                <div className="mt-4 rounded-2xl border-2 border-sky-200 bg-white p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">
                      পরিমাণ (কতটি প্যাকেজ)
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {selectedTier.pieces} পিস প্যাকেজ × {BengaliNum(quantity)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="পরিমাণ কমান"
                      className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 font-bold text-xl flex items-center justify-center hover:bg-sky-200 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span className="min-w-[2.5rem] text-center text-lg font-extrabold text-sky-900">
                      {BengaliNum(quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      disabled={quantity >= 99}
                      aria-label="পরিমাণ বাড়ান"
                      className="w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-xl flex items-center justify-center hover:bg-orange-600 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-5 rounded-2xl bg-sky-50 border border-sky-200 p-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-700">প্যাকেজ:</span>
                    <span className="font-semibold text-sky-900">
                      {selectedTier.pieces} পিস × {quantity}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-start justify-between text-xs text-emerald-700">
                    <span className="flex items-center gap-1">
                      <Gift className="w-3.5 h-3.5" /> ফ্রি গিফট:
                    </span>
                    <span className="text-right font-medium">
                      {selectedTier.freebies.join(", ")}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-center text-sm">
                    <span className="text-slate-700">সাবটোটাল:</span>
                    <span className="font-semibold text-sky-900">
                      ৳ {subtotal.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between items-center text-sm">
                    <span className="text-slate-700">
                      ডেলিভারি চার্জ (
                      {deliveryArea === "inside"
                        ? "ঢাকার মধ্যে"
                        : "ঢাকার বাইরে"}
                      ):
                    </span>
                    <span className="font-semibold text-sky-900">
                      ৳ {deliveryCharge.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-sky-200 flex justify-between items-center">
                    <span className="font-bold text-slate-800">সর্বমোট:</span>
                    <span className="text-2xl font-extrabold text-orange-600">
                      ৳ {grandTotal.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>

                {errors.submit && (
                  <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-medium">
                    {errors.submit}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="tf-cta mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> পাঠানো
                      হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Flame className="w-5 h-5" /> অর্ডার কনফার্ম করুন
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-slate-500">
                  সাবমিট করার সাথে সাথে আপনার অর্ডার সেভ হবে এবং আমরা যোগাযোগ
                  করব।
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10" data-reveal>
            <h2 className="text-3xl md:text-4xl font-extrabold text-sky-900">
              কেন Water faucet tap filter?
            </h2>
            <p className="mt-2 text-slate-600">
              দৈনন্দিন ব্যবহারের জন্য সেরা সমাধান
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                data-reveal
                className="tf-card rounded-2xl p-6 text-center"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center mb-4 shadow-md">
                  <b.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-lg text-sky-900">{b.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO USE */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10" data-reveal>
            <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold tracking-wide">
              সহজ ইনস্টলেশন
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-sky-900">
              কীভাবে ব্যবহার করবেন?
            </h2>
            <p className="mt-2 text-slate-600">
              মাত্র ৩টি সহজ ধাপে ইনস্টল করুন — কোনো টুলস বা টেকনিশিয়ান লাগবে
              না!
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 relative">
            {[
              {
                icon: Wrench,
                title: "পুরনো ফিল্টার/অ্যারেটর খুলুন",
                desc: "আপনার ট্যাপের সামনের অংশ (aerator) হাত দিয়েই ঘুরিয়ে সহজে খুলে ফেলুন।",
                step: "১",
              },
              {
                icon: Droplets,
                title: "Water faucet tap filter লাগান",
                desc: "নতুন Water faucet tap filterটি ট্যাপের মুখে বসিয়ে হালকাভাবে ঘুরিয়ে টাইট করে নিন।",
                step: "২",
              },
              {
                icon: Sparkles,
                title: "বিশুদ্ধ পানি উপভোগ করুন",
                desc: "ট্যাপ চালু করুন — ময়লা, বালু ও অপদ্রব্য মুক্ত পরিষ্কার পানি সরাসরি!",
                step: "৩",
              },
            ].map((s, i) => (
              <div
                key={i}
                data-reveal
                style={{ transitionDelay: `${i * 100}ms` }}
                className="relative rounded-2xl bg-white ring-1 ring-sky-100 shadow-sm p-6 pt-10 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className="absolute -top-5 left-6 w-11 h-11 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white flex items-center justify-center font-extrabold text-lg shadow-lg ring-4 ring-white">
                  {s.step}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-4">
                  <s.icon className="w-7 h-7 text-sky-600" />
                </div>
                <h3 className="text-lg font-bold text-sky-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-slate-500" data-reveal>
            <Clock className="inline w-4 h-4 mr-1 -mt-0.5" />
            মোট সময়:{" "}
            <span className="font-bold text-sky-700">১ মিনিটেরও কম!</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-white to-sky-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10" data-reveal>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" /> সাধারণ প্রশ্ন
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-sky-900">
              আপনার যা জানা দরকার
            </h2>
            <p className="mt-2 text-slate-600">
              অর্ডার করার আগে কমন প্রশ্নগুলোর উত্তর দেখে নিন
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "ইনস্টল করতে কি টেকনিশিয়ান লাগবে?",
                a: "না, একদমই না! Water faucet tap filter ইনস্টল করতে কোনো টুলস বা টেকনিশিয়ান লাগে না। পুরনো অ্যারেটর হাত দিয়ে খুলে নতুন ফিল্টারটি ঘুরিয়ে লাগিয়ে দিলেই কাজ শেষ — মাত্র ১ মিনিটে।",
              },
              {
                q: "সব ধরনের ট্যাপে কি ফিট হবে?",
                a: "বাংলাদেশের প্রায় ৯৫% স্ট্যান্ডার্ড কিচেন ও বাথরুম ট্যাপে সরাসরি ফিট হয়। প্যাকেজের সাথে বিভিন্ন সাইজের অ্যাডাপ্টার/রাবার রিং দেওয়া থাকে, ফলে থ্রেডেড ও নন-থ্রেডেড দুই ধরনের ট্যাপেই লাগানো যায়।",
              },
              {
                q: "ওয়ারেন্টি ও রিটার্ন পলিসি কী?",
                a: "প্রতিটি Water faucet tap filterে ১০০% মানি ব্যাক গ্যারান্টি রয়েছে। পণ্য পছন্দ না হলে বা কোনো সমস্যা থাকলে ৭ দিনের মধ্যে সম্পূর্ণ টাকা ফেরত পাবেন। কোনো প্রশ্ন ছাড়াই।",
              },
              {
                q: "ডেলিভারি কত দিনে পাবো?",
                a: "ঢাকার মধ্যে ২৪-৪৮ ঘণ্টা এবং ঢাকার বাইরে ২-৪ কার্যদিবসের মধ্যে পণ্য পৌঁছে যাবে। পুরো বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে — পণ্য হাতে পেয়ে টাকা দিন।",
              },
              {
                q: "একটি ফিল্টার কতদিন ব্যবহার করা যায়?",
                a: "সাধারণ ব্যবহারে প্রতিটি ফিল্টার ৩-৬ মাস কার্যকর থাকে (পানির মানের উপর নির্ভর করে)। তাই কম্বো প্যাকেজ নিলে অনেকদিন নিশ্চিন্তে ব্যবহার করতে পারবেন — বারবার অর্ডার করার ঝামেলা নেই।",
              },
            ].map((item, i) => (
              <details
                key={i}
                data-reveal
                style={{ transitionDelay: `${i * 60}ms` }}
                className="group rounded-2xl bg-white ring-1 ring-sky-100 hover:ring-sky-300 shadow-sm hover:shadow-md transition-all open:ring-sky-400 open:shadow-md"
              >
                <summary className="flex items-center justify-between gap-3 cursor-pointer list-none p-5 select-none">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 text-white font-bold text-sm flex items-center justify-center shadow">
                      {BengaliNum(i + 1)}
                    </span>
                    <span className="font-bold text-sky-900 text-sm md:text-base pt-1">
                      {item.q}
                    </span>
                  </div>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center group-open:bg-sky-500 group-open:text-white transition-all group-open:rotate-180">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="px-5 pb-5 pl-16 -mt-1">
                  <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed border-l-2 border-sky-200 pl-4">
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center text-sm text-slate-600" data-reveal>
            আরও প্রশ্ন?{" "}
            <a
              href="tel:01708356800"
              className="font-bold text-sky-700 hover:underline"
            >
              কল করুন — 01708356800
            </a>
            &nbsp;
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4" data-reveal>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-600 via-cyan-500 to-sky-700 text-white p-8 md:p-10 text-center shadow-2xl">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, #fff 0, transparent 40%), radial-gradient(circle at 80% 60%, #fff 0, transparent 40%)",
              }}
            />
            <Droplets className="w-10 h-10 mx-auto mb-3" />
            <h3 className="text-2xl md:text-3xl font-extrabold">
              স্বাস্থ্যকর জীবন শুরু হোক বিশুদ্ধ পানি দিয়ে
            </h3>
            <p className="mt-2 text-cyan-50 text-sm md:text-base">
              প্রতিদিনের রান্না, পান আর ব্যবহার — সব কিছুতে নিরাপদ পানি নিশ্চিত
              করুন।
            </p>
            <button
              type="button"
              onClick={() => scrollToForm()}
              className="tf-cta mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold"
            >
              <Package className="w-5 h-5" /> এখনই অর্ডার করুন
            </button>
          </div>
        </div>
      </section>

      <div className="pb-28 md:pb-16 text-center text-xs text-slate-500">
        Developed by{" "}
        <a
          href="https://wa.me/8801560007230?text=Hello%20HaqPlus%20IT!%20I%20saw%20Griha%20Nova%20website%20and%20want%20to%20build%20a%20project."
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-sky-700 font-semibold animate-pulse hover:animate-none inline-block"
        >
          Haq Plus IT
        </a>
      </div>

      {/* STICKY BOTTOM CTA */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:bottom-4">
        <div className="mx-auto max-w-2xl md:rounded-2xl bg-white/95 backdrop-blur border-t md:border border-sky-200 shadow-2xl px-3 py-2.5 flex items-center gap-2">

          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <button
            type="button"
            onClick={handleFloatingCta}
            disabled={submitting}
            className="tf-cta flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full font-bold text-sm disabled:opacity-70"
          >
            <Flame className="w-4 h-4" />{" "}
            {submitting
              ? "অর্ডার হচ্ছে..."
              : isFormFilled()
                ? "অর্ডার কনফার্ম করুন"
                : "এখনই অর্ডার করুন"}
          </button>
        </div>
      </div>
    </div>
  );
}
