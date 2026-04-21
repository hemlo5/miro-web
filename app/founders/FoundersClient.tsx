'use client';
import { motion } from 'motion/react';

const story = [
  { chapter: "I.", text: `I'm 17, in Class 12, and I've never waited for permission to build things. While most people my age were figuring out entrance exams, I was building a backtesting engine from scratch for Indian equity markets. Fed it OHLC data, implemented Sharpe ratio tracking, win rate analysis, all of it. I thought I was building an edge. I wasn't. I was building a very sophisticated way to learn that strategy without structure is just noise.` },
  { chapter: "II.", text: `That lesson pushed me toward crypto and the places where real inefficiencies live. I built a flash loan arbitrage bot — not as a tutorial project, as an actual system I tried to run. Integrated with Aave, Uniswap V3, QuickSwap. Learned what MEV actually means in practice. Understood why latency isn't a footnote, it's the game. The idea was simple: stop predicting markets and start exploiting the gaps between them. The execution was brutal. But that's where you learn.` },
  { chapter: "III.", text: `Between those experiments I built Evercash — a budgeting app, my version of YNAB, because I was frustrated that good financial tooling was either expensive or ugly. So I made one that was free and simple enough to actually use. I used it myself. That matters. The best signal that something works is whether the builder lives in it.` },
  { chapter: "IV.", text: `Then came Broma — an AI agent that interacts with websites the way a human would. Clicks, reads the DOM, executes workflows. What I learned from that wasn't about AI — it was about interfaces. The real bottleneck isn't intelligence, it's the absence of standardization across the web. That realisation changed how I think. I stopped thinking in features and started thinking in systems.` },
  { chapter: "V.", text: `Everything I've built has come from the same belief: leverage is the point. Code, automation, systems that keep running without you — these are the only things that actually scale. I don't think most people are dumb. I think they overthink ideas and underestimate execution. They wait for conditions to be right. I've never found that useful.` },
  { chapter: "VI.", text: `Hemlo is the product all of that was pointing at. The question of "what will actually happen?" sits beneath every trade, every geopolitical bet, every strategic decision. And no one has a clean answer — not markets, not single-prompt AI, not punditry. So I built a machine to find it. This is just the opening move.` },
];

export default function FoundersClient() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-20">
          <p className="text-white/30 text-xs uppercase tracking-widest mb-5">The Founder</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">Aniket Vaishu</h1>
          <p className="text-white/40 text-sm uppercase tracking-widest">Founder · Hemlo</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.2 }} className="mb-20 p-8 md:p-12 border border-white/10 bg-white text-black relative">
          <span className="absolute -left-px -top-px block size-2 border-l-2 border-t-2 border-black/30" />
          <span className="absolute -right-px -top-px block size-2 border-r-2 border-t-2 border-black/30" />
          <span className="absolute -bottom-px -left-px block size-2 border-b-2 border-l-2 border-black/30" />
          <span className="absolute -bottom-px -right-px block size-2 border-b-2 border-r-2 border-black/30" />
          <p className="text-[10px] uppercase tracking-widest text-black/30 mb-6">Why I built Hemlo</p>
          <p className="text-2xl md:text-3xl font-bold leading-snug text-black mb-6 max-w-2xl">Every system I built kept running into the same wall: there was no reliable way to know what would actually happen next.</p>
          <div className="flex flex-col gap-4 max-w-2xl">
            <p className="text-sm md:text-base text-black/60 leading-relaxed">In algo trading, my backtests looked great in simulation and broke apart in live markets. In DeFi arbitrage, I could see the opportunity but couldn't model the cascade — what happens when you execute, who else reacts, what changes.</p>
            <p className="text-sm md:text-base text-black/60 leading-relaxed">The tools that existed were either single-prompt AI — which hallucinates its way to confidence — or prediction markets, which just price the crowd's existing bias. Neither is actually telling you what's likely.</p>
            <p className="text-sm md:text-base text-black/60 leading-relaxed">The answer wasn't a smarter prompt or a better betting pool — it was a fundamentally different approach to how AI should reason about uncertainty. I built Hemlo around that.</p>
          </div>
        </motion.div>

        <div className="flex flex-col gap-12">
          {story.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: i * 0.08 }} className="grid md:grid-cols-[80px_1fr] gap-4 md:gap-8">
              <span className="text-white/20 text-xs font-mono pt-1 tracking-widest">{s.chapter}</span>
              <p className="text-white/70 text-base md:text-lg leading-[1.9]">{s.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="mt-20 pt-10 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Aniket Vaishu</p>
            <p className="text-white/30 text-sm mt-1">17 · India · Builder</p>
          </div>
          <div className="flex gap-6">
            {[{ label: "First system built", value: "Age 15" }, { label: "Products shipped", value: "4+" }, { label: "Technologies broken into", value: "DeFi, AI, Automation, Finance" }].map(s => (
              <div key={s.label} className="border-l border-white/10 pl-4">
                <div className="text-white font-bold text-sm">{s.value}</div>
                <div className="text-white/30 text-[10px] mt-0.5 uppercase tracking-widest">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
