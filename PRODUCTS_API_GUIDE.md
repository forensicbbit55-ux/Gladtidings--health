# Products API Usage Guide

Complete REST API for managing herbal remedies and wellness products in your wellness store.

## 🛠 API Endpoints

### Base URL
```
https://your-app.vercel.app/api/products
```

## 📋 Product Schema

```typescript
interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number;
  created_at: string;
}
```

## 🔗 Endpoints

### 1. Get All Products
**GET** `/api/products`

#### Query Parameters (Optional)
- `category` - Filter by category (e.g., "herbal-remedies", "supplements")
- `limit` - Number of results (default: 50, max: 100)
- `offset` - Pagination offset (default: 0)

#### Examples
```javascript
// Get all products
fetch('/api/products')

// Get products from specific category
fetch('/api/products?category=herbal-remedies')

// Get 10 products with pagination
fetch('/api/products?limit=10&offset=20')
```

#### Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Echinacea Extract",
      "description": "Immune system support supplement",
      "price": 24.99,
      "category": "herbal-remedies",
      "image_url": "https://example.com/echinacea.jpg",
      "stock": 150,
      "created_at": "2024-02-16T22:30:00.000Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "offset": 0
  }
}
```

### 2. Get Single Product
**GET** `/api/products/[id]`

#### Example
```javascript
fetch('/api/products/1')
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Echinacea Extract",
    "description": "Immune system support supplement",
    "price": 24.99,
    "category": "herbal-remedies",
    "image_url": "https://example.com/echinacea.jpg",
    "stock": 150,
    "created_at": "2024-02-16T22:30:00.000Z"
  }
}
```

### 3. Create Product (Admin)
**POST** `/api/products`

#### Request Body
```json
{
  "name": "Turmeric Curcumin",
  "description": "Anti-inflammatory supplement with black pepper extract",
  "price": 29.99,
  "category": "supplements",
  "image_url": "https://example.com/turmeric.jpg",
  "stock": 100
}
```

#### Example
```javascript
const newProduct = {
  name: "Turmeric Curcumin",
  description: "Anti-inflammatory supplement with black pepper extract",
  price: 29.99,
  category: "supplements",
  image_url: "https://example.com/turmeric.jpg",
  stock: 100
};

fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(newProduct)
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Response
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Turmeric Curcumin",
    "description": "Anti-inflammatory supplement with black pepper extract",
    "price": 29.99,
    "category": "supplements",
    "image_url": "https://example.com/turmeric.jpg",
    "stock": 100,
    "created_at": "2024-02-16T22:35:00.000Z"
  },
  "message": "Product created successfully"
}
```

### 4. Update Product (Admin)
**PUT** `/api/products/[id]`

#### Request Body (Partial Update)
```json
{
  "price": 27.99,
  "stock": 75
}
```

#### Example
```javascript
const updates = {
  price: 27.99,
  stock: 75
};

fetch('/api/products/2', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(updates)
})
.then(response => response.json())
.then(data => console.log(data));
```

### 5. Delete Product (Admin)
**DELETE** `/api/products/[id]`

#### Example
```javascript
fetch('/api/products/2', {
  method: 'DELETE'
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🎯 Frontend Integration Examples

### React Component Example
```typescript
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  stock: number;
  created_at: string;
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (category?: string) => {
    try {
      setLoading(true);
      const url = category 
        ? `/api/products?category=${category}`
        : '/api/products';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: any) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProducts(prev => [data.data, ...prev]);
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error('Failed to create product:', err);
      throw err;
    }
  };

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Wellness Products</h2>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <p>Category: {product.category}</p>
          <p>In Stock: {product.stock}</p>
        </div>
      ))}
    </div>
  );
}
```

### Custom Hook Example
```typescript
import { useState, useEffect } from 'react';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = category 
          ? `/api/products?category=${encodeURIComponent(category)}`
          : '/api/products';
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.success) {
          setProducts(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return { products, loading, error };
}
```

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message description"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created (POST)
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

## 🔒 Authentication (Future Enhancement)

For admin endpoints (POST, PUT, DELETE), consider adding authentication:

```typescript
// Example with NextAuth.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({
      success: false,
      error: 'Unauthorized'
    }, { status: 401 });
  }
  
  // ... rest of the function
}
```

## 📝 Testing Examples

### Test with curl
```bash
# Get all products
curl https://your-app.vercel.app/api/products

# Get products by category
curl "https://your-app.vercel.app/api/products?category=herbal-remedies"

# Create product
curl -X POST https://your-app.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 19.99,
    "category": "test"
  }'

# Get single product
curl https://your-app.vercel.app/api/products/1
```

## 🎨 UI Components

### Product Card Component
```typescript
interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      {product.image_url && (
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold">${product.price}</span>
        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
      </div>
      {product.category && (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
          {product.category}
        </span>
      )}
      {onEdit && onDelete && (
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => onEdit(product)}
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(product.id)}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
```

Your Products API is now fully functional and ready for integration! 🎉
