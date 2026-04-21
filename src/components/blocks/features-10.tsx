'use client';

import { Card, CardContent, CardHeader } from '../ui/card'
import { cn } from '../../lib/utils'
import { Activity, LucideIcon, Network, ScanSearch, BarChart2, Globe, FileText } from 'lucide-react'
import { ReactNode } from 'react'
import { motion } from 'motion/react'

// ── HERO ───────────────────────────────────────────────────────────────────────
const FeaturesHero = () => (
  <div className="mx-auto max-w-3xl text-center mb-20">
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="text-xs uppercase tracking-widest text-white/30 mb-4"
    >
      Platform Capabilities
    </motion.p>
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
    >
      Every edge you need.<br />
      <span className="text-white/40">In one platform.</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed"
    >
      Hemlo combines real-time data ingestion, massively parallel AI consensus modelling, and prediction market integration to give analysts, traders, and strategists a genuine informational edge.
    </motion.p>
  </div>
)

// ── MAIN ───────────────────────────────────────────────────────────────────────
export function Features() {
  return (
    <section
      aria-labelledby="features-heading"
      className="bg-transparent py-16 md:py-28"
    >
      <div className="mx-auto max-w-2xl px-6 lg:max-w-6xl">
        <FeaturesHero />

        <div className="mx-auto grid gap-4 lg:grid-cols-2">

          {/* 1. Live Intelligence Feed — WHITE */}
          <FeatureCard white>
            <CardHeading
              icon={Activity}
              tag="Real-Time Ingestion"
              title="Live Intelligence Feed"
              description="Every signal, categorised instantly. Urgent, Breaking, and Hot news enriched with AI impact analysis the moment it lands — no lag, no noise."
              white
            />
            <div className="mt-6 px-6 pb-6 grid grid-cols-3 gap-3">
              {[
                { label: "Avg. latency", value: "< 2s" },
                { label: "Sources/day", value: "8,000+" },
                { label: "Categories", value: "3 tiers" },
              ].map(s => (
                <div key={s.label} className="bg-black/5 border border-black/10 rounded-xl p-3">
                  <div className="text-[10px] text-black/40 mb-1">{s.label}</div>
                  <div className="text-black font-bold text-sm">{s.value}</div>
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* 2. Mirofish Engine — DARK */}
          <FeatureCard white={false}>
            <CardHeading
              icon={Network}
              tag="AI Architecture"
              title="Mirofish Consensus Engine"
              description="Generators propose, Critics challenge, Arbiters decide. Three layers of specialised AI agents debate every possible outcome simultaneously before a final probability is written."
              white={false}
            />
            <div className="mt-4 px-6 pb-6">
              <div className="flex flex-col gap-2">
                {[
                  { role: "Generator", desc: "Proposes initial outcome hypothesis", color: "text-emerald-400" },
                  { role: "Critic", desc: "Challenges data and logic of proposals", color: "text-red-400" },
                  { role: "Arbiter", desc: "Weighs all positions, writes final verdict", color: "text-white" },
                ].map(r => (
                  <div key={r.role} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest pt-0.5 w-16 shrink-0", r.color)}>{r.role}</span>
                    <span className="text-xs text-white/50 leading-relaxed">{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* 3. Divergence — WHITE WIDE */}
          <FeatureCard white className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div>
                <CardHeading
                  icon={ScanSearch}
                  tag="Alpha Generation"
                  title="Discover Divergence"
                  description="The percentage spread between human betting odds and Hemlo's simulated AI probability. A high positive divergence is your signal that markets are mispriced — and where the edge lives."
                  white
                />
              </div>
              <div className="flex flex-col justify-center gap-3">
                {[
                  { label: "Trump re-elected 2028", hemlo: 71, market: 48, divergence: "+23%" },
                  { label: "BTC > $150k by Dec", hemlo: 64, market: 52, divergence: "+12%" },
                  { label: "Recession by Q3 2026", hemlo: 53, market: 31, divergence: "+22%" },
                  { label: "TSLA > $400 EOY", hemlo: 29, market: 41, divergence: "−12%" },
                ].map(m => (
                  <div key={m.label} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-black/60">{m.label}</span>
                      <span className="font-bold text-black">{m.divergence}</span>
                    </div>
                    <div className="h-1.5 bg-black/10 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 h-full rounded-full bg-black/20" style={{ width: `${m.market}%` }} />
                      <div className="absolute top-0 left-0 h-full rounded-full bg-black" style={{ width: `${m.hemlo}%` }} />
                    </div>
                    <div className="flex gap-3 text-[9px] text-black/40">
                      <span><span className="text-black">■</span> Hemlo {m.hemlo}%</span>
                      <span><span className="text-black/30">■</span> Market {m.market}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* 4. Stock Sentiment — DARK */}
          <FeatureCard white={false}>
            <CardHeading
              icon={BarChart2}
              tag="Equities & Crypto"
              title="Stock & Asset Sentiment"
              description="Feed any ticker into the engine. Hemlo analyses macro data, earnings catalysts, and social velocity to simulate how market sentiment will shift before the move happens."
              white={false}
            />
            <div className="px-6 pb-6 mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Tickers tracked", value: "5,000+" },
                { label: "Data sources", value: "News, X/Reddit, SEC" },
                { label: "Sim time", value: "~3 min avg" },
                { label: "Output", value: "Probability + Chart" },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <div className="text-[10px] text-white/30 mb-1">{s.label}</div>
                  <div className="text-white font-bold text-sm">{s.value}</div>
                </div>
              ))}
            </div>
          </FeatureCard>

          {/* 5. Geopolitical — WHITE */}
          <FeatureCard white>
            <CardHeading
              icon={Globe}
              tag="Strategic Analysis"
              title="Geopolitical War-gaming"
              description="Model cascading consequences across nation-states, alliances, supply chains, and commodity markets. Ask complex what-if questions and receive structured probability trees."
              white
            />
            <div className="px-6 pb-6 mt-4">
              <div className="flex flex-col gap-2">
                {[
                  { event: "Iranian regime collapse", p: 38 },
                  { event: "US-China Taiwan standoff", p: 27 },
                  { event: "EU energy crisis recurrence", p: 51 },
                ].map(e => (
                  <div key={e.event} className="flex items-center justify-between gap-4">
                    <span className="text-xs text-black/60 flex-1">{e.event}</span>
                    <div className="w-24 h-1.5 bg-black/10 rounded-full overflow-hidden">
                      <div className="h-full bg-black rounded-full" style={{ width: `${e.p}%` }} />
                    </div>
                    <span className="text-xs font-bold text-black w-8 text-right">{e.p}%</span>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* 6. Deep Reporting — DARK WIDE */}
          <FeatureCard white={false} className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div>
                <CardHeading
                  icon={FileText}
                  tag="Transparency"
                  title="Deep Simulation Reports"
                  description="Every simulation outputs a full audit trail — not just a probability. Hemlo documents every agent's position, every critic challenge, and the exact reasoning the Arbiter used. Explainability built-in."
                  white={false}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 content-start">
                {[
                  { label: "Avg. agent rounds", value: "4–7" },
                  { label: "Bias detection", value: "Built-in" },
                  { label: "Export formats", value: "JSON / PDF" },
                  { label: "Confidence score", value: "0–100%" },
                  { label: "Dissenting views", value: "Logged" },
                  { label: "Report structure", value: "Ranked verdicts" },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-[10px] text-white/30 mb-1">{s.label}</div>
                    <div className="text-white font-bold text-sm">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

        </div>
      </div>
    </section>
  )
}

// ── PRIMITIVES ─────────────────────────────────────────────────────────────────
interface FeatureCardProps {
  children: ReactNode
  className?: string
  white?: boolean
}

const FeatureCard = ({ children, className, white = false }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
  >
    <Card className={cn(
      'group relative rounded-none shadow-zinc-950/5',
      white
        ? 'bg-white border-white/20 text-black'
        : 'bg-[#050505] border-white/10 text-white',
      className
    )}>
      <CardDecorator white={white} />
      {children}
    </Card>
  </motion.div>
)

const CardDecorator = ({ white }: { white?: boolean }) => {
  const cls = white
    ? "border-black/30 absolute block size-2"
    : "border-white/30 absolute block size-2"
  return (
    <>
      <span className={cn(cls, "-left-px -top-px border-l-2 border-t-2")} />
      <span className={cn(cls, "-right-px -top-px border-r-2 border-t-2")} />
      <span className={cn(cls, "-bottom-px -left-px border-b-2 border-l-2")} />
      <span className={cn(cls, "-bottom-px -right-px border-b-2 border-r-2")} />
    </>
  )
}

interface CardHeadingProps {
  icon: LucideIcon
  tag: string
  title: string
  description: string
  white?: boolean
}

const CardHeading = ({ icon: Icon, tag, title, description, white = false }: CardHeadingProps) => (
  <div className="p-6">
    <div className="flex items-center gap-2 mb-5">
      <Icon className={cn("size-3.5 shrink-0", white ? "text-black/50" : "text-emerald-400")} />
      <span className={cn("text-[10px] font-bold uppercase tracking-widest", white ? "text-black/30" : "text-white/30")}>{tag}</span>
    </div>
    <h2 className={cn("text-2xl font-bold mb-3 leading-snug", white ? "text-black" : "text-white")}>{title}</h2>
    <p className={cn("text-sm leading-relaxed", white ? "text-black/50" : "text-white/50")}>{description}</p>
  </div>
)
