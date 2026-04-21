'use client';
// FeaturesClient wraps the heavy motion/interactive FeaturesBlock component.
// The dynamic import with ssr:false MUST live inside a 'use client' component.
import dynamic from 'next/dynamic';

const FeaturesBlock = dynamic(
  () => import('../../src/components/blocks/features-10').then(m => ({ default: m.Features })),
  { ssr: false }
);

export default function FeaturesClient() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20">
      <FeaturesBlock />
    </div>
  );
}
