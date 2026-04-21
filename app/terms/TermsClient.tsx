'use client';
import { motion } from 'motion/react';

export default function TermsClient() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-12">Terms of Service</motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="prose prose-invert max-w-none text-white/70">
          <p className="text-lg mb-6">Last updated: April 2026</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Use License</h2>
          <p className="mb-4">Permission is granted to temporarily download one copy of the materials on Hemlo's website for personal, non-commercial transitory viewing only.</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Disclaimer</h2>
          <p className="mb-4">The materials on Hemlo's website are provided on an 'as is' basis. Hemlo makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including implied warranties of merchantability or fitness for a particular purpose.</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Limitations</h2>
          <p className="mb-4">In no event shall Hemlo or its suppliers be liable for any damages (including loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Hemlo's website.</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Governing Law</h2>
          <p className="mb-4">These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
        </motion.div>
      </div>
    </div>
  );
}
