# Backend Setup - Netlify Functions + Neon Postgres

## 🚀 Deployment Architecture

This project uses Netlify Functions for serverless backend API endpoints with Neon Postgres as the database.

## 📁 Project Structure

```
gladtiding/
├── netlify/
│   └── functions/
│       └── api/
│           └── health.js          # Health check endpoint
├── netlify.toml                   # Netlify configuration
├── package.json                   # Dependencies (includes @neondatabase/serverless)
└── .env.example                   # Environment variables template
```

## 🔧 Environment Variables

### Required for Netlify Deployment

Set these in your Netlify dashboard under **Site settings > Environment variables**:

```bash
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

**Important**: Get your `DATABASE_URL` from Neon dashboard:
1. Go to your Neon project
2. Navigate to **Project Settings** > **Connection Details**
3. Copy the connection string
4. Ensure it includes `?sslmode=require` for secure connections

## 📡 API Endpoints

### Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Purpose**: Tests database connectivity and returns server status
- **Response**:
  ```json
  {
    "status": "ok",
    "time": "2024-02-16T22:00:00.000Z",
    "timestamp": "2024-02-16T22:00:00.000Z",
    "message": "Health check passed - database connection successful"
  }
  ```

## 🛠 Development Setup

### Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual DATABASE_URL
   ```

3. **Test functions locally** (requires Netlify CLI):
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

4. **Test health endpoint**:
   ```bash
   curl http://localhost:8888/api/health
   ```

### Adding New Endpoints

1. Create new files in `netlify/functions/api/`
2. Example: `netlify/functions/api/users.js`
3. Access at: `/api/users`

## 🔍 Monitoring & Debugging

### Netlify Function Logs
- View logs in Netlify dashboard under **Functions > Logs**
- Console.log statements from your functions appear here

### Common Issues

1. **DATABASE_URL not found**:
   - Ensure environment variable is set in Netlify dashboard
   - Check variable name matches exactly (case-sensitive)

2. **Connection timeouts**:
   - Verify DATABASE_URL includes `?sslmode=require`
   - Check if Neon database is active

3. **CORS errors**:
   - All functions include CORS headers
   - For custom domains, update `Access-Control-Allow-Origin`

## 📦 Dependencies

Key packages for backend:
- `@neondatabase/serverless`: Neon Postgres driver
- Netlify Functions runtime (included automatically)

## 🚀 Deployment

1. **Push to Git** (connected to Netlify)
2. **Automatic deployment** triggers
3. **Functions deploy** to `/.netlify/functions/`
4. **API redirects** configured in `netlify.toml`

## 🧪 Testing

```bash
# Test health endpoint after deployment
curl https://your-site.netlify.app/api/health

# Expected response
{"status":"ok","time":"2024-02-16T22:00:00.000Z","timestamp":"2024-02-16T22:00:00.000Z","message":"Health check passed - database connection successful"}
```

## 📚 Next Steps

1. Add authentication endpoints
2. Implement CRUD operations for your data models
3. Add input validation and error handling
4. Set up monitoring and alerting
5. Consider rate limiting for production
