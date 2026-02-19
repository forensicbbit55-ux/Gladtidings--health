/**
 * Health Check API Route
 * Tests database connectivity and returns server status
 * 
 * GET /api/health
 * Returns: { status: "ok", time: "...", timestamp: "...", message: "..." }
 */

import { NextResponse } from 'next/server';
import { sql, testConnection } from '@/lib/db';

export async function GET() {
  console.log('Health check endpoint called');
  
  try {
    // Test database connection using our helper
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          status: 'error',
          message: 'Database connection failed',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    // Get current time from database
    const result = await sql`SELECT NOW() as current_time`;
    
    const response = {
      status: 'ok',
      time: result[0].current_time,
      timestamp: new Date().toISOString(),
      message: 'Health check passed - database connection successful',
      environment: process.env.NODE_ENV || 'development'
    };
    
    console.log('Health check response:', response);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json(
      { 
        status: 'error',
        error: 'Database connection failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
