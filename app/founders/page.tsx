import type { Metadata } from 'next';
import FoundersClient from './FoundersClient';

export const metadata: Metadata = {
  title: 'Founder',
  description: 'Meet Aniket Vaishu — the 17-year-old builder behind HEMLO who built algo-trading bots, DeFi arbitrage engines, and AI agents before building Hemlo.',
};

export default function FoundersPage() {
  return <FoundersClient />;
}
