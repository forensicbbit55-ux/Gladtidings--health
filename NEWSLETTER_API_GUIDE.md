# Newsletter API Usage Guide

Simple newsletter subscription system for your wellness platform with email validation and duplicate prevention.

## 🛠 API Endpoints

### Base URL
```
https://your-app.vercel.app/api/subscribe
```

## 📋 Subscriber Schema

```typescript
interface Subscriber {
  id: number;
  email: string;
  subscribed_at: string; // ISO timestamp
}
```

## 🔗 Endpoints

### 1. Subscribe to Newsletter
**POST** `/api/subscribe`

#### Request Body
```json
{
  "email": "user@example.com"
}
```

#### Email Validation
- Must contain @ symbol and domain
- Case-insensitive (automatically converted to lowercase)
- Trims whitespace automatically

#### Examples
```javascript
// Subscribe to newsletter
fetch('/api/subscribe', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'wellness@example.com'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Successfully subscribed to our newsletter!",
  "data": {
    "id": 1,
    "email": "wellness@example.com",
    "subscribed_at": "2024-02-16T23:00:00.000Z"
  }
}
```

#### Error Responses

**Invalid Email (400 Bad Request)**
```json
{
  "success": false,
  "error": "Please provide a valid email address"
}
```

**Already Subscribed (409 Conflict)**
```json
{
  "success": false,
  "error": "This email address is already subscribed to our newsletter"
}
```

### 2. Get Subscriber Count (Admin)
**GET** `/api/subscribe`

#### Example
```javascript
fetch('/api/subscribe')
.then(response => response.json())
.then(data => console.log(data));
```

#### Response
```json
{
  "success": true,
  "message": "Total subscribers: 150",
  "data": {
    "count": 150,
    "message": "150 people subscribed to our newsletter"
  }
}
```

## 🎯 Frontend Integration Examples

### Newsletter Signup Component
```typescript
import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message || 'Successfully subscribed!');
        setEmail(''); // Clear input
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Subscription failed');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newsletter-signup">
      <h3>Subscribe to Our Newsletter</h3>
      <p>Get the latest wellness tips and herbal remedies delivered to your inbox.</p>
      
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={loading}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>

      {message && (
        <div className={`message ${isSuccess ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}
```

### Custom Hook for Newsletter
```typescript
import { useState } from 'react';

export function useNewsletter() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const subscribe = async (email: string) => {
    if (!email) {
      setMessage('Please enter your email address');
      setIsSuccess(false);
      return false;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message || 'Successfully subscribed!');
        return true;
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Subscription failed');
        return false;
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Something went wrong. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessage('');
    setIsSuccess(false);
    setLoading(false);
  };

  return {
    subscribe,
    loading,
    message,
    isSuccess,
    reset
  };
}
```

### Advanced Newsletter Component with Analytics
```typescript
import { useState, useEffect } from 'react';

export function NewsletterSection() {
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch subscriber count on component mount
  useEffect(() => {
    fetchSubscriberCount();
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch('/api/subscribe');
      const data = await response.json();
      
      if (data.success && data.data?.count) {
        setSubscriberCount(data.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch subscriber count:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message || 'Successfully subscribed!');
        setEmail('');
        // Refresh subscriber count
        fetchSubscriberCount();
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Subscription failed');
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-content">
        <h2>Join Our Wellness Community</h2>
        
        {subscriberCount !== null && (
          <p className="subscriber-count">
            <strong>{subscriberCount.toLocaleString()}</strong> people already subscribed
          </p>
        )}
        
        <p>
          Get weekly wellness tips, herbal remedy guides, and exclusive content 
          delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="input-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={loading}
              className="email-input"
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="subscribe-button"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {message && (
            <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'}`}>
              {message}
            </div>
          )}
        </form>

        <p className="privacy-note">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
```

## 🚨 Error Handling

### Common Error Scenarios

1. **Invalid Email Format**
   - Returns 400 Bad Request
   - User-friendly error message
   - Client-side validation recommended

2. **Duplicate Subscription**
   - Returns 409 Conflict
   - Clear message about existing subscription
   - Uses `ON CONFLICT DO NOTHING` for database safety

3. **Server Errors**
   - Returns 500 Internal Server Error
   - Generic error message for user
   - Detailed error logged server-side

### Database Safety
```sql
-- Uses safe insertion with conflict handling
INSERT INTO subscribers (email, subscribed_at)
VALUES ('user@example.com', NOW())
ON CONFLICT (email) DO NOTHING
RETURNING id, email, subscribed_at;
```

## 🛡️ Rate Limiting

### Vercel Built-in Protection
- Vercel provides basic rate limiting automatically
- Protects against abuse at the platform level

### Custom Rate Limiting (Optional)
For advanced rate limiting, consider implementing:

```typescript
// Example middleware for rate limiting
import { NextRequest, NextResponse } from 'next/server';

const RATE_LIMIT = 5; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(request: NextRequest) {
  const ip = request.ip || 'unknown';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return null;
  }

  if (record.count >= RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429 }
    );
  }

  record.count++;
  return null;
}
```

### Alternative: Upstash Redis
```typescript
// Using Upstash Redis for distributed rate limiting
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function checkRateLimit(ip: string) {
  const key = `rate_limit:${ip}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 60); // 1 minute
  }
  
  return current <= 5; // 5 requests per minute
}
```

## 📝 Testing Examples

### Test with curl
```bash
# Subscribe to newsletter
curl -X POST https://your-app.vercel.app/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Test duplicate subscription
curl -X POST https://your-app.vercel.app/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Get subscriber count
curl https://your-app.vercel.app/api/subscribe

# Test invalid email
curl -X POST https://your-app.vercel.app/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email"}'
```

### Test with JavaScript
```javascript
// Test subscription
async function testSubscription() {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

testSubscription();
```

## 📊 Analytics and Monitoring

### Track Subscription Events
```typescript
// Example with analytics tracking
export async function POST(request: NextRequest) {
  // ... existing code ...

  if (result.length > 0) {
    // Track successful subscription
    // analytics.track('newsletter_subscribed', {
    //   email: email,
    //   timestamp: new Date().toISOString()
    // });

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      data: result[0]
    }, { status: 201 });
  }
}
```

### Monitor Performance
- Track subscription rates
- Monitor error rates
- Set up alerts for high failure rates

## 🎨 UI/UX Best Practices

### Form Design
- Clear email input field with proper type
- Loading states during submission
- Success/error feedback messages
- Mobile-responsive design

### User Experience
- Auto-focus email field
- Clear call-to-action button
- Privacy policy link
- Easy unsubscribe option

### Accessibility
- Proper form labels
- ARIA attributes
- Keyboard navigation support
- Screen reader compatibility

Your newsletter API is now fully functional with proper validation, duplicate prevention, and comprehensive frontend integration examples! 🎉
