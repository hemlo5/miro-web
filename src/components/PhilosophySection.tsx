'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

const PolymarketLogo = ({ className }: { className?: string }) => (
  <img src="/polymarket.webp" alt="Polymarket Logo" className={className} />
);

const NewsLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="40" fill="#E50000"/>
    <text x="100" y="145" fontFamily="serif" fontSize="130" fontWeight="bold" fill="white" textAnchor="middle">N</text>
  </svg>
);

const BloombergLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="40" fill="#222"/>
    <text x="100" y="145" fontFamily="sans-serif" fontSize="130" fontWeight="900" fill="white" textAnchor="middle">B</text>
  </svg>
);

const XLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="200" height="200" rx="40" fill="black"/>
    <path transform="scale(5.5) translate(6, 6)" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="white"/>
  </svg>
);

const scenarios = [
  {
    title: "Polymarkets",
    description: "Track prediction markets and collective intelligence in real-time to anticipate global shifts.",
    icon: PolymarketLogo,
    color: "from-blue-500/20 to-purple-500/20",
    border: "border-blue-500/20"
  },
  {
    title: "Realtime Headlines",
    description: "Ingest breaking news and global events as they happen to stay ahead of the curve.",
    icon: NewsLogo,
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20"
  },
  {
    title: "Stock Insides",
    description: "Analyze market movements, insider trades, and financial shifts with precision.",
    icon: BloombergLogo,
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/20"
  },
  {
    title: "Tweets",
    description: "Monitor social sentiment and viral trends instantly to gauge public perception.",
    icon: XLogo,
    color: "from-sky-500/20 to-blue-500/20",
    border: "border-sky-500/20"
  }
];

export default function PhilosophySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-black py-28 md:py-40 px-6">
      <div className="max-w-6xl mx-auto" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl lg:text-7xl text-white tracking-tight mb-16 md:mb-24"
        >
          Connect to any <br className="hidden md:block" />
          <span className="text-white/40 italic">real world</span> scenario
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {scenarios.map((scenario, index) => {
            const Icon = scenario.icon;
            return (
              <motion.div
                key={scenario.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                className={`group relative overflow-hidden rounded-3xl bg-white/5 border ${scenario.border} p-8 md:p-10 transition-colors`}
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-full h-full" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{scenario.title}</h3>
                  <p className="text-white/60 text-lg leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
