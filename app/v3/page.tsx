import Link from "next/link";
import { ArrowRight, Layers, BarChart3, Globe } from "lucide-react";

export default function V3LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C8102E] text-sm font-bold text-white">
              AX
            </span>
            <div>
              <p className="text-sm font-bold text-[#0A2540] leading-tight">APEX Studio</p>
              <p className="text-[11px] text-gray-400 leading-tight">by Engati</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/v3/demo/sample"
              className="text-sm font-medium text-gray-500 hover:text-[#0A2540] transition-colors"
            >
              View Sample
            </Link>
            <Link
              href="/v3/studio"
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#C8102E] px-4 text-sm font-semibold text-white hover:bg-[#a80e26] transition-colors"
            >
              Start Building
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C8102E]/20 bg-[#C8102E]/5 px-4 py-1.5 text-xs font-semibold text-[#C8102E] mb-8 uppercase tracking-wider">
            APEX by Engati
          </div>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-[#0A2540] mb-5">
            Build client-ready AI demos
            <br />
            <span className="text-[#C8102E]">that feel real.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
            Define the lead, design the journey, generate the demo. In one sitting.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/v3/studio"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#C8102E] px-8 text-base font-semibold text-white hover:bg-[#a80e26] transition-colors"
            >
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/v3/demo/sample"
              className="inline-flex h-12 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-sm font-medium text-[#0A2540] hover:bg-gray-50 transition-colors"
            >
              View Sample Demo
            </Link>
          </div>
        </section>

        {/* 3 value blocks */}
        <section className="border-t border-gray-100 bg-[#F5F7FB]">
          <div className="mx-auto max-w-5xl px-6 py-16">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/10 mb-5">
                  <Layers className="h-5 w-5 text-[#C8102E]" />
                </div>
                <p className="text-sm font-bold text-[#0A2540] mb-2">Define what converts</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Set your lead definition, select journeys, and configure qualification logic in minutes.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/10 mb-5">
                  <BarChart3 className="h-5 w-5 text-[#C8102E]" />
                </div>
                <p className="text-sm font-bold text-[#0A2540] mb-2">Build the narrative</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Choose APEX modes, configure the AI persona, and set the intelligence layer.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-7">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/10 mb-5">
                  <Globe className="h-5 w-5 text-[#C8102E]" />
                </div>
                <p className="text-sm font-bold text-[#0A2540] mb-2">Ship the demo</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Get a live demo site, visual mind map, and implementation brief — ready to present.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5-step strip */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-xl font-bold text-[#0A2540] text-center mb-2">5 steps. Complete package.</h2>
          <p className="text-sm text-gray-400 text-center mb-10">
            From blank page to client-ready demo in under 10 minutes.
          </p>
          <div className="grid gap-3 sm:grid-cols-5">
            {[
              { n: "1", label: "Client Vision", desc: "Name, industry, website, and lead definition" },
              { n: "2", label: "Journeys", desc: "Select the flows your AI will handle" },
              { n: "3", label: "Experience", desc: "Pick one APEX mode, configure the UI" },
              { n: "4", label: "Intelligence", desc: "Set the behavior prompt, analyze setup" },
              { n: "5", label: "Generate", desc: "Review and ship the demo package" },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C8102E] text-xs font-bold text-white mb-3">
                  {s.n}
                </div>
                <p className="text-sm font-semibold text-[#0A2540]">{s.label}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-xs text-gray-400">Powered by Engati APEX &middot; Enterprise AI for websites</p>
        </div>
      </footer>
    </div>
  );
}
