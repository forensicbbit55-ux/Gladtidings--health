// Sample products for testing M-Pesa integration

export const sampleProducts = [
  {
    id: 'moringa-capsules',
    title: 'Moringa Capsules',
    price: 500,
    image_url: '/images/products/moringa.jpg',
    description: 'Premium Moringa capsules for natural energy and immune support',
    category: 'herbal-remedies',
    inStock: true
  },
  {
    id: 'neem-tea',
    title: 'Neem Tea',
    price: 300,
    image_url: '/images/products/neem-tea.jpg',
    description: 'Pure Neem leaves tea for blood purification and skin health',
    category: 'herbal-remedies',
    inStock: true
  },
  {
    id: 'aloe-vera-gel',
    title: 'Aloe Vera Gel',
    price: 450,
    image_url: '/images/products/aloe-vera.jpg',
    description: '100% pure Aloe Vera gel for digestive health and wound healing',
    category: 'wellness-products',
    inStock: true
  },
  {
    id: 'turmeric-powder',
    title: 'Turmeric Powder',
    price: 350,
    image_url: '/images/products/turmeric.jpg',
    description: 'Organic Turmeric powder with anti-inflammatory properties',
    category: 'natural-supplements',
    inStock: true
  },
  {
    id: 'vitamin-c-complex',
    title: 'Vitamin C Complex',
    price: 600,
    image_url: '/images/products/vitamin-c.jpg',
    description: 'High potency Vitamin C with bioflavonoids for immune support',
    category: 'natural-supplements',
    inStock: true
  },
  {
    id: 'neem-soap',
    title: 'Neem Soap',
    price: 200,
    image_url: '/images/products/neem-soap.jpg',
    description: 'Antibacterial Neem soap for clear and healthy skin',
    category: 'wellness-products',
    inStock: true
  },
  {
    id: 'garlic-extract',
    title: 'Garlic Extract',
    price: 400,
    image_url: '/images/products/garlic.jpg',
    description: 'Potent Garlic extract for cardiovascular health and immunity',
    category: 'natural-supplements',
    inStock: true
  },
  {
    id: 'coconut-oil',
    title: 'Coconut Oil',
    price: 250,
    image_url: '/images/products/coconut-oil.jpg',
    description: 'Pure cold-pressed Coconut oil for skin and hair care',
    category: 'wellness-products',
    inStock: true
  }
]

export function getProducts() {
  return sampleProducts
}

export function getProductById(id) {
  return sampleProducts.find(product => product.id === id)
}

export function getProductsByCategory(category) {
  return sampleProducts.filter(product => product.category === category)
}

export function getCategories() {
  const categories = [
    {
      id: 'herbal-remedies',
      name: 'Herbal Remedies',
      description: 'Natural healing solutions for common ailments',
      image: '/images/products/herbal-remedies.jpg'
    },
    {
      id: 'natural-supplements',
      name: 'Natural Supplements',
      description: 'Vitamins and minerals for optimal health',
      image: '/images/products/supplements.jpg'
    },
    {
      id: 'wellness-products',
      name: 'Wellness Products',
      description: 'Essential oils and personal care items',
      image: '/images/products/wellness.jpg'
    }
  ]
  
  return categories.map(category => ({
    ...category,
    productCount: sampleProducts.filter(p => p.category === category.id).length
  }))
}
