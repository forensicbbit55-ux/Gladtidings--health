export default function SimpleAdmin() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#333', fontSize: '32px' }}>Simple Admin Dashboard</h1>
      <p style={{ color: '#666', marginTop: '10px' }}>This is a simple admin page without complex styling.</p>
      
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#333', fontSize: '24px' }}>Quick Links:</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}>
            <a 
              href="/admin/products" 
              style={{ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#10b981', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }}
            >
              Manage Products
            </a>
          </li>
          <li style={{ margin: '10px 0' }}>
            <a 
              href="/admin/blog" 
              style={{ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#3b82f6', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }}
            >
              Manage Blog
            </a>
          </li>
          <li style={{ margin: '10px 0' }}>
            <a 
              href="/admin/appointments" 
              style={{ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#8b5cf6', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }}
            >
              Manage Appointments
            </a>
          </li>
          <li style={{ margin: '10px 0' }}>
            <a 
              href="/admin/analytics" 
              style={{ 
                display: 'inline-block', 
                padding: '10px 20px', 
                backgroundColor: '#ef4444', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '5px' 
              }}
            >
              View Analytics
            </a>
          </li>
        </ul>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#333', fontSize: '24px' }}>System Status:</h2>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f0fdf4', 
          border: '1px solid #86efac', 
          borderRadius: '5px' 
        }}>
          <p style={{ margin: 0, color: '#166534' }}>
            <strong>All systems operational</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
