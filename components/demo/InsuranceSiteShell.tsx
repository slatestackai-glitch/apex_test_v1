"use client";

import { Shield, Star, Clock, HeartHandshake } from "lucide-react";

const INTENTS = [
  {
    id: "buy",
    emoji: "🚗",
    title: "Buy insurance",
    subtitle: "Motor, health, home & more",
  },
  {
    id: "renew",
    emoji: "🔄",
    title: "Renew policy",
    subtitle: "Quick renewal in 2 minutes",
  },
  {
    id: "copy",
    emoji: "📄",
    title: "Get policy copy",
    subtitle: "Download instantly",
  },
  {
    id: "advisor",
    emoji: "💬",
    title: "Talk to advisor",
    subtitle: "Available 9 AM – 8 PM",
  },
];

export function InsuranceSiteShell({
  clientName,
  onIntent,
  dimmed = false,
}: {
  clientName: string;
  onIntent: (intent: string) => void;
  dimmed?: boolean;
}) {
  const shortName = clientName.replace(/insurance/i, "").trim();

  return (
    <div className={`min-h-screen bg-white font-sans transition-all duration-500 ${dimmed ? "opacity-30 pointer-events-none select-none" : ""}`}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C8102E]">
              <Shield className="text-white" style={{ width: 18, height: 18 }} />
            </div>
            <span className="text-base font-bold text-[#0A2540] tracking-tight">{shortName || clientName}</span>
          </div>
          <div className="hidden items-center gap-7 sm:flex">
            {["Plans", "Claims", "Renew", "About"].map((item) => (
              <span key={item} className="text-sm text-gray-500 cursor-default">{item}</span>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-gray-500 sm:block cursor-default">Login</span>
            <button
              type="button"
              onClick={() => onIntent("buy")}
              className="rounded-xl bg-[#C8102E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a00d24] transition-colors"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-[#0A2540] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 40%, #3B82F6 0%, transparent 60%), radial-gradient(circle at 20% 80%, #C8102E 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-20 text-center">
          <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-blue-200 tracking-wide uppercase">
            Trusted by 20 million customers
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white mb-5">
            Insurance that moves
            <br />
            <span className="text-[#C8102E]">with you.</span>
          </h1>
          <p className="text-lg text-blue-200 mb-10 max-w-xl mx-auto">
            Cover your car, health, and home — all in one place. Fast quotes. Easy claims. Real protection.
          </p>

          {/* Intent tiles */}
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto sm:grid-cols-4 sm:max-w-2xl">
            {INTENTS.map((intent) => (
              <button
                key={intent.id}
                type="button"
                onClick={() => onIntent(intent.id)}
                className="flex flex-col items-center rounded-2xl bg-white/10 border border-white/10 px-4 py-5 text-center hover:bg-white/20 hover:border-white/30 transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="text-2xl mb-2">{intent.emoji}</span>
                <p className="text-sm font-semibold text-white leading-tight">{intent.title}</p>
                <p className="mt-1 text-[11px] text-blue-300 leading-relaxed">{intent.subtitle}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-gray-100 bg-gray-50">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-6 py-5">
          {[
            { icon: Star, label: "4.8 / 5 rating", sub: "1.2M reviews" },
            { icon: Clock, label: "Claims in 2 days", sub: "Average settlement" },
            { icon: HeartHandshake, label: "24/7 support", sub: "Always available" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A2540]/5">
                <Icon className="h-4 w-4 text-[#0A2540]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A2540]">{label}</p>
                <p className="text-[11px] text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold text-[#0A2540] mb-2 text-center">Explore our plans</h2>
        <p className="text-gray-400 text-center mb-10 text-sm">Comprehensive coverage for every stage of life</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Motor Insurance", sub: "Cars, bikes, and commercial vehicles", icon: "🚗", from: "₹2,400" },
            { label: "Health Insurance", sub: "Individual, family floater plans", icon: "🏥", from: "₹3,200" },
            { label: "Home Insurance", sub: "Structure, content, and liability", icon: "🏡", from: "₹1,800" },
          ].map((product) => (
            <div
              key={product.label}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-default"
            >
              <span className="text-3xl block mb-3">{product.icon}</span>
              <p className="font-semibold text-[#0A2540] mb-1">{product.label}</p>
              <p className="text-xs text-gray-400 mb-4">{product.sub}</p>
              <p className="text-xs text-gray-400">
                Starting from <strong className="text-[#0A2540]">{product.from}</strong>/year
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C8102E]">
              <Shield className="text-white" style={{ width: 14, height: 14 }} />
            </div>
            <span className="text-sm font-bold text-[#0A2540]">{shortName || clientName}</span>
          </div>
          <p className="text-xs text-gray-400">IRDAI Approved · CIN U66010DL2001PLC108620</p>
        </div>
      </footer>
    </div>
  );
}
