'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const services = [
  {
    tag: "MIROFISH ENGINE",
    title: "Multi-Agent Simulation",
    description: "You define the scenario. Hemlo does the rest. Our Mirofish engine deploys parallel networks of specialised AI agents — Generators, Critics, and Arbiters — that independently analyse every angle of your question, debate each other over multiple rounds, and converge on the most defensible probability. It's not a single LLM guess. It's a structured argument between dozens of models, calibrated for bias elimination.",
    bullets: [
      "4–7 agent debate rounds per simulation",
      "Bias detection & dissenting view logging",
      "Full audit trail on every verdict",
    ],
    meta: "SIMULATIONS",
  },
  {
    tag: "ALPHA GENERATION",
    title: "Discover Market Divergence",
    description: "Prediction markets price the crowd's consensus. Hemlo prices the truth. We continuously ingest live Polymarket order books, breaking global news, and macro signals — then run simulations against them. The output is a single number: Divergence. The gap between what the market believes and what our AI calculates. A consistently high divergence is where edge is found.",
    bullets: [
      "Live Polymarket integration",
      "Divergence scoring across all active markets",
      "Alerts when AI-to-market spread exceeds thresholds",
    ],
    meta: "MARKET INTELLIGENCE",
  },
  {
    tag: "LIVE INTELLIGENCE",
    title: "Real-Time Global Feed",
    description: "Hemlo monitors thousands of news sources, financial feeds, and social sentiment streams around the clock. Every incoming signal is automatically classified as Urgent, Breaking, or Hot, then enriched with AI-generated impact analysis — who it affects, which markets it moves, and how much probability it shifts. You never need to manually sift through noise again.",
    bullets: [
      "< 2 second ingestion latency",
      "Auto-categorised into 3 urgency tiers",
      "AI impact score on every article",
    ],
    meta: "INTELLIGENCE FEED",
  },
  {
    tag: "STRATEGIC ANALYSIS",
    title: "Geopolitical & Macro War-gaming",
    description: "The most dangerous risks are the ones that cascade. Hemlo lets you model complex, interdependent scenarios — what happens to supply chains if a regime falls, how equity markets react when a central bank surprises, what shifts if two major powers escalate. Unlike a chatbot response, these are structured probability trees with ranked outcomes and confidence intervals at every node.",
    bullets: [
      "Multi-variable scenario modelling",
      "Cascading event probability trees",
      "Ranked outcome lists with confidence bands",
    ],
    meta: "WAR-GAMING",
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-black py-28 md:py-40 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10" ref={ref}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <p className="text-white/30 text-xs uppercase tracking-widest mb-5">What we do</p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="text-4xl md:text-6xl text-white tracking-tight leading-[1.1] max-w-xl">
              The only platform built<br />
              <span className="text-white/40 italic">to find the truth first.</span>
            </h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Hemlo replaces single-prompt AI guesswork with structured, multi-agent consensus — purpose-built for analysts, traders, and strategists who need to be right.
            </p>
          </div>
        </motion.div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: index * 0.12 }}
              className={`group relative flex flex-col justify-between p-8 md:p-10 border rounded-none ${
                index % 2 === 0
                  ? 'bg-white text-black border-white/20'
                  : 'bg-[#050505] text-white border-white/10'
              }`}
            >
              {/* Corner decorators */}
              <span className={`absolute -left-px -top-px block size-2 border-l-2 border-t-2 ${index % 2 === 0 ? 'border-black/30' : 'border-white/30'}`} />
              <span className={`absolute -right-px -top-px block size-2 border-r-2 border-t-2 ${index % 2 === 0 ? 'border-black/30' : 'border-white/30'}`} />
              <span className={`absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 ${index % 2 === 0 ? 'border-black/30' : 'border-white/30'}`} />
              <span className={`absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 ${index % 2 === 0 ? 'border-black/30' : 'border-white/30'}`} />

              <div>
                {/* Tag + arrow */}
                <div className="flex items-center justify-between mb-8">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${index % 2 === 0 ? 'text-black/30' : 'text-white/30'}`}>
                    {service.tag}
                  </span>
                  <div className={`rounded-full p-2 border transition-colors duration-300 group-hover:border-current ${index % 2 === 0 ? 'border-black/10 text-black/40 group-hover:text-black' : 'border-white/10 text-white/40 group-hover:text-white'}`}>
                    <ArrowUpRight size={14} />
                  </div>
                </div>

                {/* Title */}
                <h3 className={`text-2xl md:text-3xl font-bold mb-5 tracking-tight leading-snug ${index % 2 === 0 ? 'text-black' : 'text-white'}`}>
                  {service.title}
                </h3>

                {/* Description */}
                <p className={`text-sm leading-relaxed mb-8 ${index % 2 === 0 ? 'text-black/55' : 'text-white/50'}`}>
                  {service.description}
                </p>
              </div>

              {/* Bullets */}
              <div className={`flex flex-col gap-2 pt-6 border-t ${index % 2 === 0 ? 'border-black/10' : 'border-white/10'}`}>
                {service.bullets.map((b, bi) => (
                  <div key={bi} className="flex items-baseline gap-3">
                    <span className={`text-[9px] shrink-0 mt-1 ${index % 2 === 0 ? 'text-black/30' : 'text-white/30'}`}>◆</span>
                    <span className={`text-xs leading-relaxed ${index % 2 === 0 ? 'text-black/50' : 'text-white/40'}`}>{b}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "4–7", label: "Agent debate rounds per sim" },
            { value: "< 2s", label: "News ingestion latency" },
            { value: "8,000+", label: "Sources monitored daily" },
            { value: "100%", label: "Simulation audit trail coverage" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-none p-5">
              <div className="text-white text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-white/30 text-xs leading-relaxed">{stat.label}</div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
