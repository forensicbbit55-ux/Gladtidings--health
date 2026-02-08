import ProductsClient from './ProductsClient'
;
;// SEO metadata for products page
export const metadata = {
  title: 'Natural Health Products - Medical Missionary Store',
  description: 'Shop our selection of natural health remedies, herbal supplements, and wellness products. All natural, ethically sourced for your holistic health journey.',
  keywords: [
    'natural health products',
    'herbal remedies',
    'medical missionary store',
    'natural supplements',
    'wellness products',
    'herbal medicine',
    'alternative health',
    'natural healing',
    'health supplements',
    'medical missionary products'
  ],
  openGraph: {
    title: 'Natural Health Products - Medical Missionary Store',
    description: 'Shop our selection of natural health remedies, herbal supplements, and wellness products. All natural, ethically sourced for your holistic health journey.',
    type: 'website',
    images: [
      {
        url: '/images/products-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Natural Health Products - Medical Missionary Store',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Natural Health Products - Medical Missionary Store',
    description: 'Shop our selection of natural health remedies, herbal supplements, and wellness products.',
    images: ['/images/products-og-image.jpg'],
  },
  alternates: {
    canonical: '/products',
  },
}

async function getCategories() {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL 
      : 'http://localhost:3001'
    
    const response = await fetch(`${baseUrl}/api/public/categories`)
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    const data = await response.json()
    return data.success ? data.categories : []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
};

async function getRemedies(categoryId = null) {
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BASE_URL 
      : 'http://localhost:3001'
    
    const url = new URL(`${baseUrl}/api/public/remedies`)
    if (categoryId) {
      url.searchParams.set('category_id', categoryId)
    }
    
    const response = await fetch(url.toString())
    if (!response.ok) {
      throw new Error('Failed to fetch remedies')
    }
    const data = await response.json()
    return data.success ? data.remedies : []
  } catch (error) {
    console.error('Error fetching remedies:', error)
    return []
  }
}

export default async function ProductsPage({ searchParams }) {
  const selectedCategory = searchParams.category || 'all'
  
  // Fetch data server-side
  const [categories, remedies] = await Promise.all([
    getCategories(),
    getRemedies(selectedCategory !== 'all' ? selectedCategory : null)
  ])

  return (
    <ProductsClient 
      categories={categories}
      remedies={remedies}
      initialCategory={selectedCategory}
    />
  )
}
