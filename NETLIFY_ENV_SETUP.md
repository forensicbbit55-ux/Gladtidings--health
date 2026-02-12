# Netlify Environment Variables Setup Guide

## Required Environment Variables for Netlify

Copy and paste these into your Netlify dashboard:

### 1. Go to Netlify Dashboard → Site Settings → Environment Variables

### 2. Add these variables:

```
DATABASE_URL
postgresql://neondb_owner:npg_IdA7HbwVk9Fo@ep-cool-dawn-ahordcwy-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEXTAUTH_URL
https://gladtidings-health.vercel.app

NEXTAUTH_SECRET
ed4cd4ba4c830d699b7bed11d7bae34c070117cfcae2237afd2e9350e5db65c8

NEXT_PUBLIC_APP_URL
https://gladtidings-health.vercel.app

NEXT_PUBLIC_BASE_URL
https://gladtidings-health.vercel.app

NODE_ENV
production
```

### 3. Optional Email Variables (for notifications):

```
EMAIL_HOST
smtp.gmail.com

EMAIL_PORT
587

EMAIL_USER
your-email@gmail.com

EMAIL_PASS
your-app-password

EMAIL_FROM
noreply@gladtidings-health.vercel.app
```

### 4. After adding variables:
- Click "Save"
- Trigger a new deploy from Netlify dashboard
- Or push a small change to trigger automatic deploy

### 5. Test the deployment:
- Visit your Netlify URL
- Test user registration
- Test login functionality
- Check database connectivity

## Security Notes:
- ✅ NEXTAUTH_SECRET is securely generated
- ⚠️ DATABASE_URL contains credentials - keep secure
- ⚠️ Email credentials should be set up separately
- ✅ All variables are production-ready

## Next Steps After Environment Setup:
1. Create sample content (blog posts, products)
2. Test all functionality
3. Set up email notifications (optional)
4. Monitor performance and errors
