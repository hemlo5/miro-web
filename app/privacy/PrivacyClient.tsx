'use client';
import { motion } from 'motion/react';

export default function PrivacyClient() {
  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-bold mb-12">Privacy Policy</motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="prose prose-invert max-w-none text-white/70">
          <p className="text-lg mb-6">Last updated: April 2026</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your name, email address, and usage data.</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. Information Sharing</h2>
          <p className="mb-4">We do not share your personal information with third parties except as described in this privacy policy or with your consent.</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. Data Security</h2>
          <p className="mb-4">We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.</p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at privacy@hemlo.ai.</p>
        </motion.div>
      </div>
    </div>
  );
}
