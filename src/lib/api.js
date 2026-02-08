const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body)
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
};

// Products API
export const productsAPI = {
  getAll: (category = null) => {
    const query = category ? `?category=${encodeURIComponent(category)}` : ''
    return fetchAPI(`/products${query}`)
  },
  getById: (id) => fetchAPI(`/products/${id}`),
  create: (product, token) =>
    fetchAPI('/products', {
      method: 'POST',
      body: product,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  update: (id, product, token) =>
    fetchAPI(`/products/${id}`, {
      method: 'PUT',
      body: product,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  delete: (id, token) =>
    fetchAPI(`/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}

// Orders API
export const ordersAPI = {
  create: (order) =>
    fetchAPI('/orders', {
      method: 'POST',
      body: order,
    }),
  getAll: (token) =>
    fetchAPI('/orders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  getById: (id, token) =>
    fetchAPI(`/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  updateStatus: (id, status, token) =>
    fetchAPI(`/orders/${id}/status`, {
      method: 'PUT',
      body: { status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}

// Auth API
export const authAPI = {
  login: (email, password) =>
    fetchAPI('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  register: (username, email, password) =>
    fetchAPI('/auth/register', {
      method: 'POST',
      body: { username, email, password },
    }),
  getMe: (token) =>
    fetchAPI('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
}
