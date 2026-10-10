import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Phone,
  ShieldCheck,
  Droplet,
  Package,
  RotateCcw,
  CheckCircle2,
  Star,
  ChevronDown,
} from "lucide-react";

// Mock delivery function based on other files
const getDeliveryCharge = (subtotal: number, area: string) => area === "inside" ? 60 : 120;

type Tier = {
  id: string;
  pieces: number;
  price: number;
  oldPrice: number;
  label: string;
  badge?: string;
  productId: string;
};

const tiers: Tier[] = [
  { id: "10pcs", pieces: 10, price: 450, oldPrice: 600, label: "১০ পিস প্যাক", productId: "6a9d00910bd7e968040beba7" },
  { id: "20pcs", pieces: 20, price: 720, oldPrice: 900, label: "২০ পিস প্যাক", productId: "6a6f52536841324a31c8530e" },
  { id: "30pcs", pieces: 30, price: 950, oldPrice: 1200, label: "৩০ পিস প্যাক", productId: "6a6f51bb6841324a31c844df" },
  { id: "50pcs", pieces: 50, price: 1350, oldPrice: 1800, label: "৫০ পিস প্যাক", badge: "হট ডিল", productId: "6a6f51346841324a31c83307" },
  { id: "100pcs", pieces: 100, price: 1950, oldPrice: 2500, label: "১০০ পিস প্যাক", badge: "সুপার সেভার", productId: "6a6f500b6841324a31c808d5" },
];

export default function MagicFoamLanding() {
  const [selectedTierId, setSelectedTierId] = useState<string>("20pcs");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("outside");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const selectedTier = tiers.find((t) => t.id === selectedTierId)!;
  const deliveryCharge = getDeliveryCharge(selectedTier.price, deliveryArea);
  const grandTotal = selectedTier.price + deliveryCharge;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = "আপনার নাম লিখুন";
    if (!/^01[3-9]\d{8}$/.test(mobile.replace(/\D/g, ""))) err.mobile = "সঠিক মোবাইল নাম্বার দিন";
    if (!address.trim()) err.address = "সম্পূর্ণ ঠিকানা দিন";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    setErrors({});

    try {
      const combinedNote = [
        `প্যাকেজ: ${selectedTier.label}`,
        note.trim() ? `নোট: ${note.trim()}` : "",
        "উৎস: /lp/magic-foam",
      ].filter(Boolean).join("\n");

      const orderData = {
          name: name.trim(),
          phone_no: mobile.replace(/\D/g, ""),
          shipping_address: address.trim(),
          division: deliveryArea === "inside" ? "inside-dhaka" : "outside-dhaka",
          product_id: selectedTier.productId,
          quantity: 1,
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
      } catch(err) {
          throw new Error("সার্ভার ত্রুটি");
      }

      if (!response.ok || !result.success) {
          throw new Error(result.message || "অর্ডার ব্যর্থ হয়েছে");
      }
      
      window.location.href = "/success-order?orderId=" + (result.data?.orderId || "12345") + "&value=" + grandTotal;
    } catch (err: any) {
      setErrors({ submit: err?.message || "অর্ডার পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন" });
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white text-slate-800 font-sans selection:bg-amber-100">
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-500 text-white py-2 px-4 text-center text-sm md:text-base font-medium flex flex-wrap items-center justify-center gap-3 shadow-md relative z-50">
        <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" /> বিশেষ অফার
        </span>
        <span>আজই অর্ডারে পাচ্ছেন <b className="text-yellow-200">ফ্রি হোম ডেলিভারি ও বিশেষ ছাড়!</b></span>
      </div>

      {/* Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900">Griha <span className="text-amber-500">Nova</span></span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Premium Quality</span>
            </div>
          </div>
          <a href="#order" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            অর্ডার করুন
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            যে কোনো জেদি দাগ পরিষ্কারের সেরা সমাধান
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-500">ম্যাজিক স্পঞ্জ (Magic Foam)</span><br/>
            শুধু পানিতেই দাগ গায়েব!
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed font-medium">
            দেয়ালের দাগ, জুতায় ময়লা, রান্নাঘরের তেলতেলে জেদি দাগ থেকে শুরু করে বাথরুমের টাইলস—সবকিছু একদম নতুনের মতো ঝকঝকে করুন কোনো সাবান বা ডিটারজেন্ট ছাড়াই!
          </p>

          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-slate-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>কোনো ডিটারজেন্ট প্রয়োজন নেই, শুধু পানিতে ভিজিয়ে ঘষলেই ম্যাজিক।</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>দেয়ালের লেখা, জুতার দাগ, কিবোর্ড, টাইলস, সিংক পরিষ্কারে অনবদ্য।</span>
            </li>
            <li className="flex items-start gap-3 text-slate-700 font-medium">
              <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <span>ইকো-ফ্রেন্ডলি মেলামাইন ফোম, হাত ও পরিবেশের জন্য ১০০% নিরাপদ।</span>
            </li>
          </ul>

          <div className="pt-4 flex flex-wrap gap-4">
            <a href="#order" className="flex-1 min-w-[200px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-all hover:-translate-y-1">
              <Package className="w-5 h-5" />
              সরাসরি অর্ডার করুন
            </a>
            <a href="tel:01602867954" className="flex-1 min-w-[200px] bg-white border-2 border-slate-200 hover:border-amber-500 hover:text-amber-600 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-sm">
              <Phone className="w-5 h-5" />
              01602867954
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-200 to-yellow-100 rounded-[3rem] transform rotate-3 scale-105 -z-10 blur-xl opacity-50"></div>
          <div className="bg-white p-4 rounded-[2rem] shadow-2xl border border-white/50 relative overflow-hidden group">
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg z-10 animate-bounce">
              স্টক সীমিত! 🔥
            </div>
            <img src="/lp/magic-foam/images/foam-20pcs-new.jpg" alt="Magic Foam Main" className="w-full aspect-square object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105" />
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-2 block">কেন এটি স্পেশাল?</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">ম্যাজিক স্পঞ্জ-এর অবিশ্বাস্য ৫টি গুণ</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all group">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Droplet className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">শুধুমাত্র পানি দিয়ে দাগ দূর</h3>
              <p className="text-slate-600">কোনো ধরনের ক্ষতিকর কেমিক্যাল বা ডিটারজেন্টের প্রয়োজন নেই। পানি দিয়ে ভিজিয়ে ঘষলেই দাগ গায়েব।</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all group">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">পরিবেশবান্ধব ও নিরাপদ</h3>
              <p className="text-slate-600">ইকো-ফ্রেন্ডলি মেলামাইন ফোম দিয়ে তৈরি, যা হাত ও পরিবেশের জন্য ১০০% নিরাপদ।</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-amber-200 transition-all group">
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <RotateCcw className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">একাধিক ব্যবহারের সুবিধা</h3>
              <p className="text-slate-600">বাড়ি, অফিস, রান্নাঘর, বাথরুম, জুতা, সোফা থেকে শুরু করে গাড়ির সিট পর্যন্ত পরিষ্কার করা যায়।</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section using new images */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">যেভাবে ম্যাজিকের মতো কাজ করে</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img src="/lp/magic-foam/images/foam-50pcs-new.jpg" alt="Usage" className="rounded-2xl shadow-md w-full aspect-square object-cover hover:scale-105 transition-transform" />
            <img src="/lp/magic-foam/images/foam-100pcs-new.jpg" alt="Usage" className="rounded-2xl shadow-md w-full aspect-square object-cover hover:scale-105 transition-transform" />
            <img src="/lp/magic-foam/images/foam-4.jpg" alt="Usage" className="rounded-2xl shadow-md w-full aspect-square object-cover hover:scale-105 transition-transform" />
            <img src="/lp/magic-foam/images/foam-5.png" alt="Usage" className="rounded-2xl shadow-md w-full aspect-square object-cover hover:scale-105 transition-transform" />
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="order" className="py-20 bg-slate-900 text-slate-50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-12 gap-8 lg:gap-12 relative z-10">
          
          {/* Order Summary */}
          <div className="md:col-span-5 space-y-8">
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-4">অর্ডার কনফার্ম করুন</h2>
              <p className="text-slate-400">নিচের ফর্মটি পূরণ করুন। আমাদের প্রতিনিধি কল করে কনফার্ম করবেন।</p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-300 uppercase tracking-wider block">প্যাকেজ নির্বাচন করুন</label>
              <div className="space-y-3">
                {tiers.map((tier) => (
                  <label key={tier.id} className={`relative flex items-center justify-between p-4 rounded-xl cursor-pointer border-2 transition-all ${selectedTierId === tier.id ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
                    <input type="radio" name="package" value={tier.id} checked={selectedTierId === tier.id} onChange={() => setSelectedTierId(tier.id)} className="sr-only" />
                    <div className="flex flex-col">
                      <span className={`font-bold text-lg ${selectedTierId === tier.id ? 'text-amber-400' : 'text-white'}`}>{tier.label}</span>
                      {tier.badge && <span className="absolute top-0 right-4 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{tier.badge}</span>}
                    </div>
                    <div className="text-right flex flex-col">
                      <span className={`font-bold text-xl ${selectedTierId === tier.id ? 'text-white' : 'text-slate-300'}`}>৳{tier.price}</span>
                      <span className="text-xs text-slate-500 line-through">৳{tier.oldPrice}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-3">
              <div className="flex justify-between text-slate-300">
                <span>প্যাকেজ মূল্য:</span>
                <span className="font-bold text-white">৳{selectedTier.price}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold text-white">৳{deliveryCharge}</span>
              </div>
              <div className="h-px bg-slate-700 w-full my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-300">সর্বমোট:</span>
                <span className="text-3xl font-black text-amber-400">৳{grandTotal}</span>
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="md:col-span-7">
            <div className="bg-white p-6 md:p-8 rounded-3xl text-slate-800 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">ডেলিভারি ইনফরমেশন</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">আপনার নাম *</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium" placeholder="সম্পূর্ণ নাম লিখুন" />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">মোবাইল নাম্বার *</label>
                  <input type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium font-sans" placeholder="01XXXXXXXXX" />
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">সম্পূর্ণ ঠিকানা *</label>
                  <textarea value={address} onChange={e=>setAddress(e.target.value)} rows={3} className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all font-medium resize-none" placeholder="বাসা নং, রাস্তা, এলাকা, থানা, জেলা"></textarea>
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ডেলিভারি এরিয়া *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer border-2 rounded-xl p-3 text-center font-bold transition-all ${deliveryArea === 'inside' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                      <input type="radio" name="area" checked={deliveryArea === 'inside'} onChange={() => setDeliveryArea('inside')} className="sr-only" />
                      ঢাকার ভিতরে (৳৬০)
                    </label>
                    <label className={`cursor-pointer border-2 rounded-xl p-3 text-center font-bold transition-all ${deliveryArea === 'outside' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}>
                      <input type="radio" name="area" checked={deliveryArea === 'outside'} onChange={() => setDeliveryArea('outside')} className="sr-only" />
                      ঢাকার বাইরে (৳১২০)
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={submitting} className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed text-white text-xl font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all">
                    {submitting ? (
                      <span className="flex items-center gap-2"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> প্রসেসিং...</span>
                    ) : (
                      <span className="flex items-center gap-2">অর্ডার কনফার্ম করুন <ChevronDown className="w-6 h-6 -rotate-90" /></span>
                    )}
                  </button>
                  {errors.submit && <p className="text-red-500 text-center font-bold mt-4">{errors.submit}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-10 text-center text-xs text-slate-500 pt-8">
        Developed by <a href="https://wa.me/8801560007230?text=Hello%20HaqPlus%20IT!%20I%20saw%20Griha%20Nova%20website%20and%20want%20to%20build%20a%20project." target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-700 font-semibold">Haq Plus IT</a>
      </div>
    </div>
    </>
  );
}
