'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { NeuralNetwork } from './NeuralNetwork';

export default function FeaturedVideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-black px-6 w-full">
      <div className="max-w-6xl mx-auto w-full" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl overflow-hidden h-[75vh] md:h-[80vh] w-full border border-slate-200 shadow-xl"
        >
          {/* Mirofish-style panel header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200">
            <span className="text-slate-700 text-sm font-semibold font-sans">Graph Relationship Visualization</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono bg-slate-100 px-2 py-1 rounded">Graph</span>
              <span className="text-xs text-emerald-600 font-semibold">● Simulating</span>
            </div>
          </div>

          {/* Graph canvas — starts below the header */}
          <NeuralNetwork className="absolute inset-0 top-[43px] w-full h-[calc(100%-43px)] bg-white" />
        </motion.div>

        {/* Caption below */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-white/40 text-sm mt-5 text-center tracking-wide"
        >
          Live entity-relationship graph — powered by the Mirofish simulation engine
        </motion.p>
      </div>
    </section>
  );
}
