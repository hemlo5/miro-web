import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the HEMLO Privacy Policy to understand how we handle your data.',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
