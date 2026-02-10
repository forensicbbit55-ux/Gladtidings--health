export default function AdminTest() {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center', 
      backgroundColor: '#f0f9ff', 
      border: '2px solid #0ea5e9',
      borderRadius: '10px',
      margin: '50px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ 
        color: '#0ea5e9', 
        fontSize: '48px',
        marginBottom: '20px'
      }}>
        ADMIN ROUTE WORKING
      </h1>
      <p style={{ 
        color: '#64748b', 
        fontSize: '18px',
        lineHeight: '1.6'
      }}>
        This page confirms that admin routing is working correctly.
      </p>
      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e0f2fe',
        borderRadius: '8px',
        border: '1px solid #0ea5e9'
      }}>
        <h2 style={{ 
          color: '#0ea5e9',
          fontSize: '24px',
          marginBottom: '15px'
        }}>
          Test Navigation
        </h2>
        <div style={{ 
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <a 
            href="/admin/simple" 
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            Simple Admin
          </a>
          <a 
            href="/admin/analytics" 
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#3b82f6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            Analytics
          </a>
          <a 
            href="/admin/blog" 
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#8b5cf6',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            Blog Management
          </a>
        </div>
      </div>
    </div>
  )
}
