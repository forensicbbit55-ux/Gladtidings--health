/**
 * Newsletter Subscription API Endpoint
 * 
 * POST /api/subscribe - Subscribe to newsletter
 * 
 * Request Body:
 * {
 *   "email": "user@example.com"
 * }
 * 
 * Note: Vercel has built-in rate limiting. For custom rate limiting,
 * consider implementing middleware or using a service like Upstash Redis.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { SubscribeRequest, SubscribeResponse } from '@/types/newsletter';

/**
 * Simple email validation function
 * @param email - Email address to validate
 * @returns boolean - True if email appears valid
 */
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * POST /api/subscribe
 * Subscribe to newsletter with email validation and duplicate checking
 */
export async function POST(request: NextRequest): Promise<NextResponse<SubscribeResponse>> {
  try {
    const body: SubscribeRequest = await request.json();

    // Validate email exists
    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Email address is required'
      }, { status: 400 });
    }

    // Trim and validate email format
    const email = body.email.trim().toLowerCase();
    
    if (!validateEmail(email)) {
      return NextResponse.json({
        success: false,
        error: 'Please provide a valid email address'
      }, { status: 400 });
    }

    console.log(`Processing newsletter subscription for: ${email}`);

    // Check if email already exists
    const existingSubscriber = await sql`
      SELECT id, email, subscribed_at FROM newsletter_subscribers WHERE email = ${email} LIMIT 1
    `;

    if (existingSubscriber.length > 0) {
      console.log(`Email already subscribed: ${email}`);
      return NextResponse.json({
        success: false,
        error: 'This email address is already subscribed to our newsletter'
      }, { status: 409 });
    }

    // Insert new subscriber using ON CONFLICT DO NOTHING for safety
    const result = await sql`
      INSERT INTO newsletter_subscribers (email, subscribed_at)
      VALUES (${email}, NOW())
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, subscribed_at
    `;

    // Check if insertion was successful (result will be empty if conflict occurred)
    if (result.length === 0) {
      console.log(`Subscription failed due to conflict: ${email}`);
      return NextResponse.json({
        success: false,
        error: 'This email address is already subscribed to our newsletter'
      }, { status: 409 });
    }

    const newSubscriber = result[0];

    console.log(`Newsletter subscription successful: ${email}, ID: ${newSubscriber.id}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      data: {
        id: newSubscriber.id,
        email: newSubscriber.email,
        subscribed_at: newSubscriber.subscribed_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
        return NextResponse.json({
          success: false,
          error: 'This email address is already subscribed to our newsletter'
        }, { status: 409 });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to subscribe to newsletter. Please try again later.'
    }, { status: 500 });
  }
}

/**
 * GET /api/subscribe
 * Get subscription count (optional endpoint for admin)
 */
export async function GET(): Promise<NextResponse<SubscribeResponse>> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count FROM newsletter_subscribers
    `;
    
    const count = result[0].count;

    return NextResponse.json({
      success: true,
      message: `Total subscribers: ${count}`,
      data: {
        count: parseInt(count),
        message: `${count} people subscribed to our newsletter`
      }
    });

  } catch (error) {
    console.error('Error fetching subscriber count:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch subscriber information'
    }, { status: 500 });
  }
}

/**
 * OPTIONS /api/subscribe
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
