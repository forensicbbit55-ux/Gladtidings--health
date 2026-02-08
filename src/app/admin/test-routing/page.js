export default function AdminTest() {
  return (
    <div style={ 
      padding: '50px', 
      textAlign: 'center', 
      backgroundColor: '#f0f9ff', 
      border: '2px solid #0ea5e9',
      borderRadius: '10px',
      margin: '50px',
      fontFamily: 'Arial, sans-serif'
    }>
      <h1 style={ 
        color: '#0ea5e9', 
        fontSize: '48px',
        marginBottom: '20px'
      }>
        ADMIN ROUTE WORKING
      </h1>
      <p style={ 
        color: '#64748b', 
        fontSize: '18px',
        marginBottom: '30px'
      }>
        If you can see this page, the admin routing is working correctly!
      </p>
      <div style={ 
        backgroundColor: '#10b981', 
        color: 'white', 
        padding: '15px 30px',
        borderRadius: '5px',
        display: 'inline-block',
        fontSize: '16px'
      }>
        ✅ No Redirects Detected
      </div>
      <div style={ marginTop: '30px' }>
        <a href="/" style={ 
          color: '#0ea5e9', 
          textDecoration: 'none',
          fontSize: '16px'
        }>
          ← Back to Home
        </a>
      </div>
    </div>
  )
};;
