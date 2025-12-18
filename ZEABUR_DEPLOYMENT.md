# Zeabur Deployment Guide for Otisium

## Prerequisites
- GitHub repository with your code
- Zeabur account

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Docker configuration for Zeabur"
git push origin main
```

### 2. Create New Project on Zeabur
1. Go to https://zeabur.com
2. Click "New Project"
3. Connect your GitHub repository
4. Select the Otisium repository

### 3. Configure Environment Variables
In Zeabur dashboard, add these environment variables:

**Frontend Variables:**
```
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_API_URL=https://your-app-name.zeabur.app
VITE_WEB3FORMS_KEY=<your-web3forms-key>
```

**Backend Variables:**
```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
PORT=3001
GEMINI_API_KEY=<your-gemini-api-key>
```

**Note:** Replace all `<placeholder>` values with your actual credentials from your local `.env` files.

### 4. Important: Set VITE_API_URL BEFORE First Deploy
**CRITICAL:** Before deploying, you need to know your Zeabur domain.

Option A - Use Zeabur's preview domain:
```
VITE_API_URL=https://your-service-name.zeabur.app
```

Option B - After first deploy, update and redeploy:
1. Deploy once to get your domain
2. Update `VITE_API_URL` to your actual domain
3. Trigger a redeploy

### 5. Update Google OAuth Redirect URIs
Go to Google Cloud Console and add these redirect URIs:
- `https://your-app.zeabur.app/auth/callback`
- `https://your-app.zeabur.app`

### 6. Deploy
Zeabur will automatically:
1. Detect the Dockerfile
2. Build the Docker image with environment variables
3. Deploy the container
4. Provide you with a public URL

## How It Works
- Single container runs on **Port 3001**
- Express server serves both:
  - Static frontend files (React app) from `/public`
  - API endpoints from `/api/*`
- Zeabur automatically routes traffic to port 3001

## Troubleshooting

### If build fails:
1. Check Zeabur build logs
2. Ensure all environment variables are set
3. Verify Dockerfile syntax

### If API calls fail:
1. Check that `VITE_API_URL` points to your Zeabur domain
2. Verify CORS is enabled in server.js
3. Check MongoDB connection string

### If Google OAuth fails:
1. Verify redirect URIs in Google Cloud Console
2. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

## Notes
- The Dockerfile uses multi-stage build for smaller image size
- Both frontend and backend run in the same container
- Frontend is served as static files using `serve`
- Backend runs as a Node.js process
