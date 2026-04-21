import type { Metadata } from 'next';
import VisionClient from './VisionClient';

export const metadata: Metadata = {
  title: 'Vision',
  description: "HEMLO's vision for AI-driven quantitative intelligence — replacing guesswork with structured consensus.",
};

export default function VisionPage() {
  return <VisionClient />;
}
