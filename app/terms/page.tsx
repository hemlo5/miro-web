import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the HEMLO Terms of Service and understand the conditions of using our platform.',
};

export default function TermsPage() {
  return <TermsClient />;
}
