'use client';
// Thin client component wrapper for the Header dynamic import with ssr:false.
import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../../src/components/Header'), { ssr: false });

export default function HeaderClient() {
  return <Header />;
}
