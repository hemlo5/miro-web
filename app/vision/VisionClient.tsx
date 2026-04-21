'use client';
import { motion } from 'motion/react';

export default function VisionClient() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-bold mb-12">
          Our Vision
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="prose prose-invert prose-lg max-w-none">
          <p className="text-2xl text-white/80 leading-relaxed mb-8">
            We believe the future shouldn't be a guessing game. By leveraging the power of massively parallel LLMs, we are building a cognitive engine that synthesizes the noise of the world into clear, actionable probability.
          </p>
          <div className="grid md:grid-cols-2 gap-12 mt-16">
            <div>
              <h3 className="text-2xl font-bold mb-4">The Problem</h3>
              <p className="text-white/60 leading-relaxed">Human consensus is fundamentally flawed. In traditional prediction markets and intelligence gathering, the loudest voices or highest capital dictate the supposed "truth". Single-prompt AI outputs are equally prone to hallucination and inherent bias.</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">The Ethics &amp; Solution</h3>
              <p className="text-white/60 leading-relaxed">We are committed to transparent, unbiased data processing. Our models are deliberately separated into Generators and Critics, forcing a rigorous battle-testing of every outcome specifically to combat inherent model bias and provide the most objective truth possible.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
