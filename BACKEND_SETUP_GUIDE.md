# Backend Setup Guide - Vercel + Neon Postgres

## 🎯 Project Overview

**Frontend Type**: Next.js 14 with App Router (TypeScript)
**Backend**: Next.js API Routes with Vercel serverless functions
**Database**: Neon Postgres with pooled connection string
**ORM**: Prisma (already configured)

## 📁 Project Structure

```
gladtiding/
├── src/
│   ├── app/
│   │   └── api/                    # Next.js API routes
│   │       ├── health/
│   │       │   └── route.ts        # Health check endpoint ✅
│   │       ├── auth/               # Authentication endpoints
│   │       ├── products/           # Product management
│   │       ├── blog/               # Blog posts
│   │       └── newsletter/         # Newsletter subscriptions
│   └── lib/
│       ├── db.ts                   # Database helper ✅
│       ├── prisma.ts               # Prisma client
│       └── auth.ts                 # Authentication utilities
├── vercel.json                     # Vercel configuration ✅
├── package.json                    # Dependencies
└── tsconfig.json                   # TypeScript config with paths ✅
```

## 🔧 Database Setup

### 1. Database Helper (`src/lib/db.ts`)

```typescript
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT NOW()`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
```

### 2. Environment Variables

**Required for Vercel:**
```bash
DATABASE_URL=postgresql://neondb_owner:password@ep-host-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Optional:**
```bash
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-app.vercel.app
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 📡 API Endpoints

### Health Check ✅
- **URL**: `GET /api/health`
- **Purpose**: Test database connectivity
- **Response**:
  ```json
  {
    "status": "ok",
    "time": "2024-02-16T22:25:00.000Z",
    "timestamp": "2024-02-16T22:25:00.000Z",
    "message": "Health check passed - database connection successful",
    "environment": "production"
  }
  ```

### Example API Route Structure

```typescript
// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `;
    
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
```

## 🚀 Deployment Steps

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Connect Project
```bash
vercel login
vercel link
```

### 3. Set Environment Variables
In Vercel dashboard:
- Go to **Project Settings** → **Environment Variables**
- Add `DATABASE_URL` with your Neon connection string
- Add other required variables

### 4. Deploy
```bash
vercel --prod
```

## 🧪 Testing

### Local Development
```bash
npm install
npm run dev
```

### Test Health Endpoint
```bash
curl http://localhost:3000/api/health
```

### Production Testing
```bash
curl https://your-app.vercel.app/api/health
```

## 📝 Creating New API Routes

### 1. Create Route File
```bash
# Create new endpoint
mkdir -p src/app/api/newsletter
touch src/app/api/newsletter/route.ts
```

### 2. Basic Route Template
```typescript
import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Insert into database
    const result = await sql`
      INSERT INTO newsletter_subscriptions (email, created_at)
      VALUES (${email}, NOW())
      RETURNING id
    `;

    return NextResponse.json({ 
      success: true, 
      id: result[0].id 
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
```

## 🔍 Best Practices

### Database Queries
- Use parameterized queries with `sql` template literals
- Always handle errors in try-catch blocks
- Log errors for debugging

### API Responses
- Use consistent JSON response format
- Include appropriate HTTP status codes
- Handle CORS with OPTIONS method

### Environment Variables
- Never commit secrets to git
- Use Vercel environment variables for production
- Use `.env.local` for local development

## 🛠 Development Workflow

### 1. Local Development
```bash
# Start development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/health
```

### 2. Database Operations
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View database
npx prisma studio
```

### 3. Deployment
```bash
# Deploy to production
vercel --prod

# View logs
vercel logs
```

## 📚 Next Steps

1. **Set up authentication** with NextAuth.js
2. **Create CRUD operations** for products, blog posts
3. **Implement file upload** for product images
4. **Add rate limiting** for API endpoints
5. **Set up monitoring** and error tracking
6. **Create admin dashboard** for content management

## 🆘 Troubleshooting

### Common Issues

1. **DATABASE_URL not found**
   - Check environment variables in Vercel dashboard
   - Ensure variable name matches exactly

2. **Connection timeout**
   - Verify Neon database is active
   - Check connection string includes `?sslmode=require`

3. **TypeScript import errors**
   - Ensure `tsconfig.json` has path mappings
   - Restart development server after config changes

### Debug Commands
```bash
# Check environment variables
vercel env ls

# View function logs
vercel logs

# Test database connection
curl https://your-app.vercel.app/api/health
```

Your backend is now properly configured for Vercel deployment with Neon Postgres! 🎉
