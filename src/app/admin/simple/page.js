export default function SimpleAdmin() {
  return (
    <div style={ padding: '20px', fontFamily: 'Arial, sans-serif' }>
      <h1 style={ color: '#333', fontSize: '32px' }>Simple Admin Dashboard</h1>
      <p style={ color: '#666', marginTop: '10px' }>This is a simple admin page without complex styling.</p>
      
      <div style={ marginTop: '30px' }>
        <h2 style={ color: '#333', fontSize: '24px' }>Quick Links:</h2>
        <ul style={ listStyle: 'none', padding: 0 }>
          <li style={ margin: '10px 0' }>
            <a 
              href="/admin/products" 
              style={ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#10b981', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }
            >
              Manage Products
            </a>
          </li>
          <li style={ margin: '10px 0' }>
            <a 
              href="/admin/products/add" 
              style={ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }
            >
              Add New Product
            </a>
          </li>
          <li style={ margin: '10px 0' }>
            <a 
              href="/" 
              style={ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#6b7280', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }
            >
              Back to Home
            </a>
          </li>
        </ul>
      </div>
      
      <div style={ marginTop: '30px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }>
        <h3 style={ color: '#333', fontSize: '20px' }>Admin Features:</h3>
        <ul style={ color: '#666', lineHeight: '1.6' }>
          <li>✅ Product Management</li>
          <li>✅ Add/Edit Products</li>
          <li>✅ Category Management</li>
          <li>✅ Stock Status Tracking</li>
        </ul>
      </div>
    </div>
  )
};;
