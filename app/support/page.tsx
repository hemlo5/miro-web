import type { Metadata } from 'next';
import SupportClient from './SupportClient';

export const metadata: Metadata = {
  title: 'Support & FAQ',
  description: 'Get help with HEMLO — read our FAQ and contact support for your account, API access, or enterprise deployment.',
};

export default function SupportPage() {
  return <SupportClient />;
}
