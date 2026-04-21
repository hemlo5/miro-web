import type { Metadata } from 'next';
import HeaderClient from './_client/HeaderClient';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'HEMLO', template: '%s | HEMLO' },
  description: 'HEMLO is an AI automation agent and algorithmic market simulation platform that allows users to predict future scenarios.',
  metadataBase: new URL('https://hemloai.com'),
  openGraph: {
    type: 'website',
    url: 'https://hemloai.com',
    title: 'HEMLO',
    description: 'HEMLO is an AI automation agent and algorithmic market simulation platform that allows users to predict future scenarios.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'HEMLO' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HEMLO',
    description: 'HEMLO is an AI automation agent and algorithmic market simulation platform that allows users to predict future scenarios.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MH3VYHXZM5" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MH3VYHXZM5');`,
          }}
        />
      </head>
      <body className="bg-black text-white font-sans antialiased overflow-x-hidden">
        <HeaderClient />
        {children}
      </body>
    </html>
  );
}
