import Head from 'next/head'
;
;export default function OpenGraphMeta({ 
  title, 
  description, 
  image, 
  url, 
  type = 'website',
  siteName = 'Glad Tidings',
  locale = 'en_US'
};;) {
  const fullUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const fullImageUrl = image ? (image.startsWith('http') ? image : `${process.env.NEXT_PUBLIC_APP_URL}${image}`) : ''

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="natural health, wellness, herbal remedies, consultations, holistic healing" />
      <meta name="author" content="Glad Tidings" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@gladtidings" />
      <meta name="twitter:creator" content="@gladtidings" />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="theme-color" content="#10b981" />
      <meta name="msapplication-TileColor" content="#10b981" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": type === 'article' ? "Article" : "WebPage",
            "name": title,
            "description": description,
            "image": fullImageUrl,
            "url": fullUrl,
            "publisher": {
              "@type": "Organization",
              "name": "Glad Tidings",
              "url": process.env.NEXT_PUBLIC_APP_URL,
              "logo": {
                "@type": "ImageObject",
                "url": `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`
              }
            },
            "datePublished": type === 'article' ? new Date().toISOString() : undefined,
            "dateModified": new Date().toISOString()
          })
        }
      />
    </Head>
  )
}
