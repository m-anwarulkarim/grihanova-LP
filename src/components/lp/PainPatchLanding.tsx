import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Leaf,
  Clock,
  Flame,
  CheckCircle2,
  Star,
  Truck,
  RotateCcw,
  Headphones,
  Package,
  Users,
  Loader2,
  PartyPopper,
  Phone,
  Sparkles,
  BadgeCheck,
  ChevronDown,
  HelpCircle,
  Award,
  Zap,
} from "lucide-react";
// Mock delivery functions
const getDeliveryCharge = (subtotal: number, dhakaConfig: any, area: string) => area === "inside" ? 60 : 120;

const trackInitiateCheckout = (a: any, b: any, c: any) => {};
const trackAddToCart = (a: any, b: any, c: any) => {};
const trackPurchase = (a: any, b: any, c: any, d: any, e: any) => {};
const trackViewContent = (a: any, b: any, c: any, d: any) => {};
// Hosted on Cloud storage so images work on any deployment target (Cloudflare Pages included)
const heroAsset = { url: "/lp/assets/pain-patch-hero.webp" };
const neckAsset = { url: "/lp/assets/pain-patch-neck.webp" };
const infoAsset = { url: "/lp/assets/pain-patch-info.webp" };


const PHONE_RE = /^01[3-9]\d{8}$/;
const phone = "+8801708356800";

function bn(n: number | string) {
  const map: Record<string, string> = { "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪", "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯" };
  return String(n).split("").map((c) => map[c] ?? c).join("");
}

type Tier = {
  packs: number;
  pieces: number;
  price: number;
  oldPrice: number;
  label: string;
  badge?: string;
  ribbon?: string;
  highlight?: boolean;
  perks: string[];
};

const tiers: Tier[] = [
  {
    packs: 1,
    pieces: 5,
    price: 550,
    oldPrice: 750,
    label: "১ প্যাক",
    perks: ["৫ পিস প্যাচ", "হোম ডেলিভারি", "ক্যাশ অন ডেলিভারি"],
  },
  {
    packs: 2,
    pieces: 10,
    price: 880,
    oldPrice: 1100,
    label: "২ প্যাক",
    badge: "জনপ্রিয়",
    perks: ["১০ পিস প্যাচ", "প্রতি পিস মাত্র ৮৮৳", "ফ্রি ডেলিভারি সুবিধা*"],
  },
  {
    packs: 3,
    pieces: 15,
    price: 1390,
    oldPrice: 1650,
    label: "৩ প্যাক",
    badge: "সবচেয়ে সাশ্রয়ী",
    ribbon: "BEST VALUE",
    highlight: true,
    perks: ["১৫ পিস প্যাচ", "সর্বোচ্চ সাশ্রয়", "পুরো পরিবারের জন্য"],
  },
];

const painAreas = ["ঘাড়ের ব্যথা", "কোমরের ব্যথা", "হাঁটুর ব্যথা", "কাঁধের ব্যথা", "পেশির ব্যথা"];

const benefits = [
  { icon: Leaf, title: "১০০% হারবাল উপাদান", desc: "প্রাকৃতিক ভেষজ নির্যাসে তৈরি — কোনো পার্শ্বপ্রতিক্রিয়া নেই।" },
  { icon: Clock, title: "১২ ঘণ্টা পর্যন্ত আরাম", desc: "একবার লাগালেই দীর্ঘসময় ধরে ব্যথা উপশমে কাজ করে।" },
    { icon: Zap, title: "দ্রুত কার্যকর", desc: "লাগানোর মাত্র ১৫-২০ মিনিটের মধ্যেই এর কার্যক্রম শুরু হয়ে যায় এবং আপনি আরাম অনুভব করবেন।" },
    { icon: ShieldCheck, title: "নিরাপদ ও সহজ ব্যবহার", desc: "শুধু খুলে ব্যথার স্থানে লাগান — ওষুধ খাওয়ার ঝামেলা নেই।" },
];

const steps = [
  { n: 1, title: "পরিষ্কার ও শুকনো স্থানে", desc: "ব্যথার জায়গাটি পরিষ্কার ও শুকনো করে নিন।" },
  { n: 2, title: "প্যাচ খুলে লাগান", desc: "কভার সরিয়ে সরাসরি ব্যথার স্থানে চেপে বসান।" },
  { n: 3, title: "১২ ঘণ্টা রাখুন", desc: "সর্বোচ্চ ১২ ঘণ্টা পর্যন্ত রেখে আরাম উপভোগ করুন।" },
];

const reviews = [
  { name: "আব্দুল মালেক", city: "ঢাকা", rating: 5, text: "কোমরের ব্যথায় বছরখানেক ভুগছিলাম। এই প্যাচ লাগানোর পর রাতে আরামে ঘুমাতে পারছি।" },
  { name: "রুবিনা ইয়াসমিন", city: "চট্টগ্রাম", rating: 5, text: "ঘাড়ের ব্যথার জন্য নিয়েছিলাম। গন্ধ নেই, লাগাতেও সহজ। ২ প্যাক আবার অর্ডার করেছি।" },
  { name: "শাহাদাত হোসেন", city: "সিলেট", rating: 5, text: "হাঁটুর ব্যথায় হাঁটতে কষ্ট হতো। এখন অনেকটাই ভালো লাগছে, ধন্যবাদ।" },
  { name: "নাজমা বেগম", city: "রাজশাহী", rating: 4, text: "ডেলিভারি দ্রুত পেয়েছি। মায়ের জন্য নিয়েছিলাম, উনি খুব উপকার পেয়েছেন।" },
];

const stats = [
  { icon: Package, value: 9400, suffix: "+", label: "প্যাক বিক্রি" },
  { icon: Star, value: 4.9, decimals: 1, suffix: "/৫", label: "গড় রেটিং" },
  { icon: Truck, value: 7200, suffix: "+", label: "সফল ডেলিভারি" },
  { icon: Users, value: 6100, suffix: "+", label: "সন্তুষ্ট গ্রাহক" },
];

const trustBadges = [
  { icon: Truck, title: "ক্যাশ অন ডেলিভারি", desc: "পণ্য হাতে পেয়ে পেমেন্ট" },
  { icon: RotateCcw, title: "সহজ রিটার্ন", desc: "৭ দিনের রিটার্ন সুবিধা" },
  { icon: Headphones, title: "২৪/৭ সাপোর্ট", desc: "যেকোনো সময় যোগাযোগ" },
];

const faqs = [
  { q: "এটি কি সত্যিই কাজ করে?", a: "হ্যাঁ। প্রাকৃতিক ভেষজ উপাদান ত্বকের মাধ্যমে কাজ করে রক্ত চলাচল বাড়ায় ও পেশির টান কমায়, ফলে ব্যথা উপশম হয়।" },
  { q: "কোনো পার্শ্বপ্রতিক্রিয়া আছে?", a: "হারবাল উপাদানে তৈরি বলে সাধারণত কোনো পার্শ্বপ্রতিক্রিয়া নেই। খুব সংবেদনশীল ত্বকে সামান্য লালচে ভাব হলে ব্যবহার বন্ধ করুন।" },
  { q: "দিনে কতবার ব্যবহার করা যাবে?", a: "দিনে ১ বার, একটানা সর্বোচ্চ ১২ ঘণ্টা পর্যন্ত ব্যবহার করা যাবে।" },
  { q: "ডেলিভারি কতদিনে পাবো?", a: "ঢাকার ভেতরে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৩ দিনের মধ্যে ডেলিভারি হয়। পণ্য হাতে পেয়ে টাকা দিন।" },
];

function RevealSection({ children, className, delay = 0, onClick }: { children: React.ReactNode; className?: string; delay?: number; onClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setIsVisible(true);
            io.unobserve(el);
          }
        });
      },
      { 
        threshold: 0.01, 
        rootMargin: "0px 0px -50px 0px" 
      }
    );
    
    io.observe(el);

    // Fail-safe: show after 1.5s
    const timer = setTimeout(() => setIsVisible(true), 1500);

    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      ref={ref} 
      className={`${className || ""} ${isVisible ? "pp-in" : ""}`}
      onClick={onClick}

      style={{ 
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : "translateY(10px)",
        transition: `opacity .4s ease-out ${delay}ms, transform .4s ease-out ${delay}ms`,
        willChange: "opacity, transform"
      }}
    >
      {children}
    </div>
  );
}

function CountUp({ end, decimals = 0, suffix = "" }: { end: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const t0 = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - t0) / 1500);
            setVal(end * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(tick);
            else setVal(end);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [end]);
  const formatted = decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString("en-US");
  return <span ref={ref}>{bn(formatted)}{suffix}</span>;
}

const OFFER_MS = 24 * 60 * 60 * 1000;

function OfferTimer() {
  const [remaining, setRemaining] = useState(OFFER_MS);
  useEffect(() => {
    const KEY = "pp_offer_deadline";
    const now = Date.now();
    let dl = Number(localStorage.getItem(KEY) || 0);
    if (!dl || dl - now <= 0 || dl - now > OFFER_MS) {
      dl = now + OFFER_MS;
      localStorage.setItem(KEY, String(dl));
    }
    const tick = () => setRemaining(Math.max(0, dl - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  const t = Math.floor(remaining / 1000);
  const parts = [
    { v: Math.floor(t / 3600), l: "ঘণ্টা" },
    { v: Math.floor((t % 3600) / 60), l: "মিনিট" },
    { v: t % 60, l: "সেকেন্ড" },
  ];
  return (
    <div className="flex items-center justify-center gap-2">
      {parts.map((p, i) => (
        <div key={i} className="pp-timer-box">
          <span className="text-xl md:text-2xl font-extrabold tabular-nums leading-none">{bn(String(p.v).padStart(2, "0"))}</span>
          <span className="text-[10px] opacity-80">{p.l}</span>
        </div>
      ))}
    </div>
  );
}

export default function PainPatchLanding() {
  // useReveal was replaced by RevealSection component wrapper
  const formRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [packs, setPacks] = useState<number>(3);
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("outside");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | { orderId: string }>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const submitLockRef = useRef(false);

  const selected = tiers.find((t) => t.packs === packs) ?? tiers[2];
  const subtotal = selected.price;
  const deliveryCharge = getDeliveryCharge(subtotal, undefined, deliveryArea);
  const grandTotal = subtotal + deliveryCharge;
  const saved = selected.oldPrice - selected.price;

  const viewFired = useRef(false);
  useEffect(() => {
    if (viewFired.current) return;
    viewFired.current = true;
    try {
      trackViewContent("lp-pain-patch", "Pain Relief Patch", selected.price, "BDT");
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const atcFired = useRef(false);
  const fireAddToCart = (price: number) => {
    if (atcFired.current) return;
    atcFired.current = true;
    try {
      trackAddToCart("lp-pain-patch", price, "BDT");
    } catch {}
  };

  const scrollToForm = (p?: number) => {
    if (p) setPacks(p);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30);
  };

  const chooseTier = (t: Tier) => {
    setPacks(t.packs);
    fireAddToCart(t.price);
    scrollToForm(t.packs);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = "সঠিক নাম দিন";
    const m = mobile.replace(/\D/g, "");
    if (!PHONE_RE.test(m)) e.mobile = "সঠিক মোবাইল নম্বর দিন (০১XXXXXXXXX)";
    if (!address.trim() || address.trim().length < 5) e.address = "সম্পূর্ণ ঠিকানা লিখুন";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const icFired = useRef(false);
  const handleFieldFocus = () => {
    fireAddToCart(selected.price);
    if (icFired.current) return;
    icFired.current = true;
    try {
      trackInitiateCheckout(subtotal, 1, "BDT");
    } catch {}
  };

  const handleSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();
    if (submitLockRef.current || submitting) return;
    if (!validate()) return;
    submitLockRef.current = true;
    setSubmitting(true);
    try {
      const productName = `Pain Relief Patch — ${selected.packs} প্যাক (${selected.pieces} পিস)`;
      const combinedNote = [
        `প্যাকেজ: ${selected.packs} প্যাক / ${selected.pieces} পিস`,
        note.trim() ? `নোট: ${note.trim()}` : "",
        "উৎস: /lp/pain-patch",
      ].filter(Boolean).join("\n");

      const orderData = {
          name: name.trim(),
          phone_no: mobile.replace(/\D/g, ""),
          shipping_address: address.trim(),
          division: deliveryArea === "inside" ? "inside-dhaka" : "outside-dhaka",
          product_id: "PAIN_PATCH_PRODUCT_ID", // TODO: Update with real Pain Patch Product ID
          quantity: 1, // Quantity of the package
          deliveryCharge: deliveryCharge,
          note: combinedNote
      };

      const response = await fetch('/api/place-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
      });

      let result;
      try {
          result = await response.json();
      } catch(e) {
          throw new Error("Server error");
      }

      if (!response.ok || !result.success) {
          throw new Error(result.message || "Order failed");
      }
      
      // Redirect to Thank You page smoothly
      window.location.href = "/success-order?orderId=" + (result.data?.orderId || "12345");
    } catch (err: any) {
      submitLockRef.current = false;
      console.error("[pain-patch] order submit failed:", err);
      setErrors({ submit: err?.message || "অর্ডার পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pp-root min-h-screen text-slate-800">


      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anek+Bangla:wght@400;500;600;700;800&display=swap');
        .pp-root { background: linear-gradient(180deg,#ffffff 0%, #f6fdf9 20%, #ffffff 55%, #f6fdf9 100%); font-family:'Anek Bangla','Hind Siliguri',system-ui,sans-serif; }
        .pp-root, .pp-root * { font-family:'Anek Bangla','Hind Siliguri',system-ui,sans-serif; }
        .pp-hero { position:relative; overflow:hidden; color:#fff;
          background: radial-gradient(1200px 620px at 15% -10%, #34d399 0%, #059669 42%, #0d5c3f 100%); }
        .pp-hero::after { content:""; position:absolute; inset:0; background:
          radial-gradient(700px 320px at 85% 15%, rgba(250,204,21,.18), transparent 65%); pointer-events:none; }
        .pp-leaf { position:absolute; color:rgba(255,255,255,.14); animation: pp-float linear infinite; }
        @keyframes pp-float { 0%{ transform: translateY(-10vh) rotate(0deg); opacity:0;} 12%{opacity:1;} 100%{ transform: translateY(115vh) rotate(320deg); opacity:0;} }
        /* Reveal classes handled via RevealSection component styles */

        .pp-img-container { position: relative; background: rgba(16, 185, 129, 0.05); overflow: hidden; }
        .pp-img-container img { width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease; }
        .pp-img-container img:not([src]), .pp-img-container img[src=""] { opacity: 0; }
        .pp-cta { position:relative; overflow:hidden; border:none; cursor:pointer; color:#0b2b20; font-weight:800;
          background: linear-gradient(90deg,#fde047,#facc15,#fbbf24,#facc15,#fde047); background-size:300% 100%;
          box-shadow: 0 10px 24px -8px rgba(250,204,21,.65);
          animation: pp-shift 6s linear infinite, pp-glow 3s ease-in-out infinite, pp-zoom 1.8s ease-in-out infinite;
          transition: filter .2s ease; }
        .pp-cta:hover { filter: brightness(1.07); }
        .pp-cta:disabled { animation:none; opacity:.7; cursor:not-allowed; }
        @keyframes pp-shift { to { background-position:300% 50%; } }
        @keyframes pp-glow { 0%,100%{ box-shadow:0 10px 24px -8px rgba(250,204,21,.6), 0 0 0 0 rgba(250,204,21,.5);} 50%{ box-shadow:0 14px 28px -8px rgba(250,204,21,.7), 0 0 0 14px rgba(250,204,21,0);} }
        @keyframes pp-zoom { 0%,100%{ transform:scale(1);} 50%{ transform:scale(1.045);} }
        .pp-card { background:#fff; border:1px solid rgba(5,150,105,.18); border-radius:1.25rem;
          box-shadow:0 12px 34px -18px rgba(4,120,87,.45); transition: transform .3s ease, box-shadow .3s ease; }
        .pp-card:hover { transform: translateY(-6px); box-shadow:0 22px 46px -18px rgba(4,120,87,.55); }
        .pp-tier { position:relative; border-radius:1.4rem; background:#fff; border:2px solid rgba(5,150,105,.18);
          transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
        .pp-tier:hover { transform: translateY(-8px) scale(1.01); border-color:#059669; box-shadow:0 26px 50px -22px rgba(4,120,87,.6); }
        .pp-tier-active { border-color:#f59e0b; box-shadow:0 0 0 4px rgba(245,158,11,.18), 0 24px 44px -20px rgba(245,158,11,.55); }
        .pp-tier-best { background: linear-gradient(180deg,#fffbeb,#ffffff); }
        .pp-tier-best::before { content:""; position:absolute; inset:-2px; border-radius:1.5rem; padding:2px;
          background: linear-gradient(120deg,#f59e0b,#fde047,#10b981,#f59e0b); background-size:300% 300%;
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor; mask-composite: exclude; animation: pp-shift 5s linear infinite; pointer-events:none; }
        .pp-ribbon { position:absolute; top:14px; right:-34px; transform:rotate(38deg); background:linear-gradient(90deg,#ef4444,#f97316);
          color:#fff; font-size:10px; font-weight:800; letter-spacing:.08em; padding:5px 40px; box-shadow:0 6px 14px -6px rgba(0,0,0,.4); }
        .pp-save { animation: pp-pop 1.6s ease-in-out infinite; }
        @keyframes pp-pop { 0%,100%{ transform:scale(1);} 50%{ transform:scale(1.08);} }
        .pp-timer-box { display:flex; flex-direction:column; align-items:center; min-width:56px; padding:.4rem .6rem; border-radius:.75rem;
          background: rgba(0,0,0,.35); color:#fff; border:1px solid rgba(255,255,255,.2); backdrop-filter: blur(4px); }
        .pp-shine { position:relative; overflow:hidden; }
        .pp-shine::after { content:""; position:absolute; top:0; bottom:0; width:40%; left:-60%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.55), transparent); animation: pp-shine 3.2s ease-in-out infinite; }
        @keyframes pp-shine { 0%{ left:-60%; } 60%,100%{ left:130%; } }
        @media (prefers-reduced-motion: reduce){ .pp-cta,.pp-save,.pp-shine::after,.pp-leaf{ animation:none !important; } }
      `}</style>

      {/* HERO */}
      <section className="pp-hero pt-8 pb-10 md:pt-14 md:pb-20">
        {Array.from({ length: 10 }).map((_, i) => (
          <Leaf
            key={i}
            className="pp-leaf w-6 h-6"
            style={{ left: `${(i * 11 + 4) % 96}%`, animationDuration: `${9 + (i % 5) * 2.5}s`, animationDelay: `${i * 1.3}s` }}
            aria-hidden
          />
        ))}
        <RevealSection className="relative max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-white/15 ring-1 ring-white/25 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold">
              <Leaf className="w-3.5 h-3.5 text-lime-300" /> ১০০% herbal • নিরাপদ ও কার্যকর
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold leading-tight">
              ব্যথা নয়,<br />
              <span className="text-lime-300">চলুন স্বস্তির জীবনে</span>
            </h1>
            <p className="mt-3 text-lg md:text-xl font-bold text-white/95">Pain Relief Patch — হারবাল পেইন রিলিফ প্যাচ</p>
            <p className="mt-2 text-white/80 text-sm md:text-base max-w-md">
              ঘাড়, কোমর, হাঁটু, কাঁধ ও পেশির ব্যথায় প্রাকৃতিক ভেষজ উপাদানে তৈরি নিরাপদ সমাধান। ১২ ঘণ্টা পর্যন্ত আরাম।
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {painAreas.map((p) => (
                <span key={p} className="text-xs font-semibold bg-white/12 ring-1 ring-white/20 px-2.5 py-1 rounded-full">{p}</span>
              ))}
            </div>

            <div className="mt-6 inline-flex items-baseline gap-3 bg-white/10 ring-1 ring-white/20 rounded-2xl px-4 py-3">
              <span className="text-3xl font-extrabold text-lime-300">৳{bn(550)}</span>
              <span className="text-sm line-through text-white/60">৳{bn(750)}</span>
              <span className="text-[11px] font-extrabold bg-red-500 px-2 py-0.5 rounded-full pp-save">সেভ ৳{bn(200)}</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={() => scrollToForm()} className="pp-cta inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-base">
                <Flame className="w-5 h-5" /> এখনই অর্ডার করুন
              </button>
              <a href={`tel:${phone}`} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold bg-white/15 ring-1 ring-white/30 hover:bg-white/25 transition">
                <Phone className="w-4 h-4" /> কল করুন
              </a>
            </div>
          </div>


          <div className="relative">
            <div className="absolute -inset-6 bg-lime-300/10 blur-3xl rounded-full" aria-hidden />
            <div className="pp-img-container aspect-[16/10] w-full rounded-3xl ring-1 ring-white/25 shadow-2xl">
              <img
                src={heroAsset.url}
                alt="Pain Relief Patch — herbal ব্যথা উপশম প্যাচ প্যাকেজ"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </RevealSection>

      </section>

      {/* TRUST STRIP */}
      <RevealSection className="bg-emerald-900 text-white/90 py-3">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-3 text-center text-[11px] md:text-sm font-semibold">
          {trustBadges.map((b) => (
            <div key={b.title} className="flex items-center justify-center gap-2">
              <b.icon className="w-4 h-4 text-lime-300 flex-shrink-0" />
              <span>{b.title}</span>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* BENEFITS */}
      <section className="py-10 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <RevealSection className="text-center mb-6 md:mb-10">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
              <BadgeCheck className="w-3.5 h-3.5" /> কেন এই প্যাচ
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-emerald-900">কার্যকারিতা যা আপনার জীবনে পরিবর্তন আনবে</h2>
          </RevealSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b, i) => (
              <RevealSection key={b.title} className="pp-card p-5" delay={i * 90}>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-lg">
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-3 font-bold text-emerald-900">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>


      {/* PAIN AREAS + IMAGE */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <RevealSection>
            <div className="pp-img-container aspect-[4/3] w-full rounded-3xl shadow-2xl ring-1 ring-emerald-100/50">
              <img
                src={infoAsset.url}
                alt="ব্যথা উপশম প্যাচ — যেসব ব্যথায় কাজ করে"
                loading="lazy"
                decoding="async"
              />
            </div>
          </RevealSection>
          <RevealSection delay={100}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900">যেসব ব্যথায় কাজ করে</h2>
            <ul className="mt-5 space-y-3">
              {[
                "ঘাড় ও কাঁধের ব্যথা উপশম করে",
                "কোমর ও পিঠের ব্যথায় স্বস্তি দেয়",
                "হাঁটু ও জয়েন্টের ব্যথা কমায়",
                "পেশির টান ও খিঁচুনি কমায়",
                "রক্ত চলাচল উন্নত করে",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 bg-emerald-50/70 rounded-xl px-4 py-3 ring-1 ring-emerald-100">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base font-semibold text-emerald-950">{t}</span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => scrollToForm()} className="pp-cta mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full">
              <Flame className="w-5 h-5" /> অর্ডার করতে চাই
            </button>
          </RevealSection>
        </div>
      </section>

      {/* OFFERS */}
      <section className="py-10 md:py-20 bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <RevealSection className="text-center mb-6 md:mb-8">
            <span className="inline-flex items-center gap-2 bg-red-500 px-3 py-1 rounded-full text-xs font-extrabold pp-save">
              <Flame className="w-3.5 h-3.5" /> সীমিত সময়ের অফার
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold">যত বেশি প্যাক, তত বেশি সাশ্রয়</h2>
            <p className="mt-2 text-white/70 text-sm">অফার শেষ হতে বাকি</p>
            <div className="mt-3"><OfferTimer /></div>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-5">
            {tiers.map((t, i) => {
              const active = packs === t.packs;
              return (
                <RevealSection
                  key={t.packs}
                  delay={i * 110}
                  onClick={() => setPacks(t.packs)}
                  className={`pp-tier overflow-hidden text-slate-800 p-6 cursor-pointer ${t.highlight ? "pp-tier-best" : ""} ${active ? "pp-tier-active" : ""}`}
                >
                  {t.ribbon && <span className="pp-ribbon">{t.ribbon}</span>}
                  {t.badge && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" /> {t.badge}
                    </span>
                  )}
                  <h3 className="mt-3 text-2xl font-extrabold text-emerald-900">{t.label}</h3>
                  <p className="text-sm font-semibold text-emerald-700">{bn(t.pieces)} পিস প্যাচ</p>

                  <div className="mt-4 flex items-end gap-2">
                    <span className="text-4xl font-extrabold text-emerald-900">৳{bn(t.price)}</span>
                    <span className="text-sm line-through text-slate-400 mb-1">৳{bn(t.oldPrice)}</span>
                  </div>
                  <span className="mt-2 inline-block text-[11px] font-extrabold bg-red-500 text-white px-2 py-0.5 rounded-full pp-save">
                    সেভ ৳{bn(t.oldPrice - t.price)}
                  </span>

                  <ul className="mt-4 space-y-2">
                    {t.perks.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> {p}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); chooseTier(t); }}
                    className="pp-cta pp-shine mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full"
                  >
                    <Flame className="w-4 h-4" /> অর্ডার করুন
                  </button>
                </RevealSection>
              );
            })}
          </div>



          <p className="mt-4 text-center text-xs text-white/60">*ডেলিভারি চার্জ অর্ডারের পরিমাণ ও এলাকা অনুযায়ী প্রযোজ্য।</p>
        </div>
      </section>

      {/* HOW TO USE */}
      <section className="py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4">
          <RevealSection className="text-center mb-6 md:mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900">ব্যবহারবিধি — মাত্র ৩ ধাপে</h2>
          </RevealSection>
          <div className="grid sm:grid-cols-3 gap-5">
            {steps.map((s, i) => (
              <RevealSection key={s.n} className="pp-card p-6 text-center" delay={i * 100}>
                <div className="mx-auto w-14 h-14 rounded-full bg-emerald-600 text-white text-xl font-extrabold flex items-center justify-center shadow-lg">
                  {bn(s.n)}
                </div>
                <h3 className="mt-3 font-bold text-emerald-900">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 bg-emerald-900 text-white">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {stats.map((s) => (
            <RevealSection key={s.label}>
              <s.icon className="w-7 h-7 mx-auto text-lime-300" />
              <div className="mt-2 text-3xl font-extrabold">
                <CountUp end={s.value} decimals={(s as any).decimals || 0} suffix={s.suffix} />
              </div>
              <div className="text-xs text-white/70 mt-1">{s.label}</div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-10 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <RevealSection className="text-center mb-6 md:mb-8">
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold">
              <Award className="w-3.5 h-3.5" /> কাস্টমার রিভিউ
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-emerald-900">গ্রাহকরা কী বলছেন</h2>
          </RevealSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((r, i) => (
              <RevealSection key={i} className="pp-card p-5 flex flex-col" delay={i * 90}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold flex items-center justify-center text-lg">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-emerald-900 text-sm leading-tight">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.city}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className={`w-4 h-4 ${k < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">"{r.text}"</p>
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ভেরিফায়েড ক্রেতা
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER FORM */}
      <section ref={formRef} className="py-10 md:py-20 bg-gradient-to-b from-emerald-50 to-white scroll-mt-4">
        <div className="max-w-3xl mx-auto px-4">
          <RevealSection className="text-center mb-5 md:mb-7">
            <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900">অর্ডার করতে ফর্মটি পূরণ করুন</h2>
            <p className="mt-2 text-slate-600 text-sm">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন — ক্যাশ অন ডেলিভারি</p>
          </RevealSection>

          {success ? (
            <div className="pp-card p-8 text-center" >
              <PartyPopper className="w-14 h-14 mx-auto text-emerald-600" />
              <h3 className="mt-3 text-2xl font-extrabold text-emerald-900">অর্ডার সফল হয়েছে!</h3>
              <p className="mt-2 text-slate-600">আপনার অর্ডার আইডি: <span className="font-bold text-emerald-800">{success.orderId}</span></p>
              <p className="mt-1 text-sm text-slate-500">আমাদের প্রতিনিধি শীঘ্রই আপনাকে কল করে অর্ডার কনফার্ম করবেন।</p>
              <a href={`tel:${phone}`} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white font-bold">
                <Phone className="w-4 h-4" /> সহায়তা প্রয়োজন?
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pp-card p-5 md:p-8 space-y-4" data-reveal>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {tiers.map((t) => (
                  <button
                    key={t.packs}
                    type="button"
                    onClick={() => { setPacks(t.packs); fireAddToCart(t.price); }}
                    className={`flex-1 min-w-0 rounded-xl px-2 py-3 text-center ring-2 transition ${packs === t.packs ? "ring-emerald-600 bg-emerald-50" : "ring-slate-200 hover:ring-emerald-300"}`}
                  >
                    <span className="block text-xs font-extrabold text-emerald-900 sm:inline">{t.label} • {bn(t.pieces)} পিস</span>
                    <span className="block text-xs text-slate-600 sm:inline sm:ml-1.5">৳{bn(t.price)} <span className="line-through text-slate-400">৳{bn(t.oldPrice)}</span></span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-1">আপনার নাম *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={handleFieldFocus}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="পুরো নাম লিখুন"
                />
                {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-1">মোবাইল নম্বর *</label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onFocus={handleFieldFocus}
                  inputMode="numeric"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="০১XXXXXXXXX"
                />
                {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-1">সম্পূর্ণ ঠিকানা *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={handleFieldFocus}
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="গ্রাম/বাসা, রোড, থানা, জেলা"
                />
                {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-1">ডেলিভারি এলাকা</label>
                <div className="grid grid-cols-2 gap-2">
                  {([["inside", "ঢাকার মধ্যে"], ["outside", "ঢাকার বাইরে"]] as const).map(([v, l]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setDeliveryArea(v)}
                      className={`rounded-xl px-3 py-2.5 text-sm font-bold ring-2 transition ${deliveryArea === v ? "ring-emerald-600 bg-emerald-50 text-emerald-900" : "ring-slate-200 text-slate-600"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-1">নোট (ঐচ্ছিক)</label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="বিশেষ কোনো নির্দেশনা"
                />
              </div>

              <div className="rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 p-4 text-sm space-y-1.5">
                <div className="flex justify-between"><span>প্যাকেজ</span><span className="font-bold">{selected.label} ({bn(selected.pieces)} পিস)</span></div>
                <div className="flex justify-between"><span>সাবটোটাল</span><span className="font-bold">৳{bn(subtotal)}</span></div>
                <div className="flex justify-between text-emerald-700"><span>আপনি সেভ করছেন</span><span className="font-bold">৳{bn(saved)}</span></div>
                <div className="flex justify-between"><span>ডেলিভারি চার্জ</span><span className="font-bold">৳{bn(deliveryCharge)}</span></div>
                <div className="flex justify-between text-base pt-2 border-t border-emerald-200"><span className="font-extrabold text-emerald-900">সর্বমোট</span><span className="font-extrabold text-emerald-900">৳{bn(grandTotal)}</span></div>
              </div>

              {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}

              <button type="submit" disabled={submitting} className="pp-cta pp-shine w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-lg">
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> পাঠানো হচ্ছে...</> : <><Flame className="w-5 h-5" /> অর্ডার কনফার্ম করুন</>}
              </button>
              <p className="text-center text-xs text-slate-500">অর্ডার করতে সমস্যা হলে কল করুন — {phone}</p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <RevealSection className="text-center mb-6 md:mb-8">
            <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" /> সাধারণ প্রশ্ন
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-emerald-900">আপনার প্রশ্নের উত্তর</h2>
          </RevealSection>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <RevealSection key={f.q} className="pp-card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span className="font-bold text-emerald-900 text-sm md:text-base">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && <p className="px-5 pb-4 text-sm text-slate-600 leading-relaxed">{f.a}</p>}
              </RevealSection>

            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-950 text-white text-center">
        <RevealSection className="max-w-3xl mx-auto px-4">
          <ShieldCheck className="w-14 h-14 mx-auto text-lime-300" />
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold">আজই অর্ডার করুন, স্বস্তিতে থাকুন</h2>
          <p className="mt-2 text-white/80">১০০% হারবাল • ক্যাশ অন ডেলিভারি • সারা বাংলাদেশে ডেলিভারি</p>
          <button type="button" onClick={() => scrollToForm()} className="pp-cta mt-6 inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg">
            <Flame className="w-5 h-5" /> অর্ডার করুন
          </button>
        </RevealSection>
      </section>

      {/* STICKY CTA — always visible on every screen */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-emerald-950/95 to-emerald-900/90 backdrop-blur-md border-t border-emerald-400/30 shadow-[0_-8px_30px_rgba(0,0,0,0.25)]">
        <div className="mx-auto max-w-3xl px-3 py-3 flex items-center gap-3">
          <a
            href={`tel:${phone}`}
            aria-label="কল করুন"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 border border-white/25 text-white flex items-center justify-center flex-shrink-0 hover:bg-white/20 transition-colors"
          >
            <Phone className="w-5 h-5" />
          </a>
          <div className="hidden sm:block text-white leading-tight">
            <p className="text-[11px] uppercase tracking-wide text-emerald-200/80">সীমিত সময়ের অফার</p>
            <p className="text-sm font-bold">৳{bn(selected.price)} <span className="text-emerald-300/70 line-through text-xs">৳{bn(selected.oldPrice)}</span></p>
          </div>
          <button
            type="button"
            onClick={() => scrollToForm()}
            className="pp-cta flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 md:py-4 rounded-full text-sm md:text-base font-extrabold"
          >
            <Flame className="w-4 h-4 md:w-5 md:h-5" /> এখনই অর্ডার করুন
          </button>
        </div>
      </div>
      <div className="h-24" />

    </div>
  );
}
