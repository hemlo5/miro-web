'use client';
// This thin wrapper lives in a Client Component, which is the ONLY place
// next/dynamic with ssr:false is allowed in Next.js App Router.
import dynamic from 'next/dynamic';

const App = dynamic(() => import('../../src/App'), { ssr: false });

export default function HomeClient() {
  return <App />;
}
