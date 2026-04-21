import type { Metadata } from 'next';
import FeaturesClient from './FeaturesClient';

export const metadata: Metadata = {
  title: 'Features',
  description: "Explore the features that power HEMLO's quantitative intelligence platform — live feeds, Mirofish consensus engine, divergence signals, and deep simulation reports.",
};

export default function FeaturesPage() {
  return <FeaturesClient />;
}
