const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
  console.log('Health check endpoint called');
  
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('Attempting to connect to Neon database...');
    
    // Get DATABASE_URL from environment variables
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('DATABASE_URL environment variable is not set');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Database configuration error',
          message: 'DATABASE_URL environment variable is not set'
        })
      };
    }

    // Create Neon connection
    const sql = neon(databaseUrl);
    
    console.log('Executing SELECT NOW() query...');
    const result = await sql`SELECT NOW() as current_time`;
    
    console.log('Database query successful:', result);
    
    const response = {
      status: 'ok',
      time: result[0].current_time,
      timestamp: new Date().toISOString(),
      message: 'Health check passed - database connection successful'
    };
    
    console.log('Health check response:', response);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        status: 'error',
        error: 'Database connection failed',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
