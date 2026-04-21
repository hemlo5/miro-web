import type { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, honest pricing for HEMLO. Start free, upgrade when the stakes get real.',
};

export default function PricingPage() {
  return <PricingClient />;
}
