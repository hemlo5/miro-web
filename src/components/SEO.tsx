import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
}

export function SEO({ 
  title = "HEMLO", 
  description = "HEMLO is an AI automation agent and algorithmic market simulation platform that allows users to predict future scenarios.", 
  path = "" 
}: SEOProps) {
  const url = `https://hemloai.com${path}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* If the user provides a real image later, they can just swap this path in public folder */}
      <meta property="og:image" content="https://hemloai.com/og-image.jpg" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://hemloai.com/og-image.jpg" />
    </Helmet>
  );
}
