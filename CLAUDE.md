# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

247Ignite AI Consult - A React-based AI consulting website with Node.js/Express backend.

## Git Configuration

```bash
# User config
git config user.email "jbriner@gmail.com"
git config user.name "Jason Briner"

# Push to GitHub with authentication token (token stored in real-web/CLAUDE.md)
git push https://jbriner:<TOKEN>@github.com/jbriner/ai-consult.git main
```

## Deployment

### Production
- **Domain**: https://247ignite.com
- **Server**: DigitalOcean Droplet 146.190.38.177
- **Deploy Script**: `./deploy-prod.sh deploy`

```bash
# Deploy to production (use 5-minute timeout)
./deploy-prod.sh deploy

# Check status
./deploy-prod.sh status

# View logs
./deploy-prod.sh logs
```

### Local Development
```bash
# Start frontend dev server
cd frontend && npm run dev
# Access at http://localhost:5173/
```

## Project Structure

- `frontend/` - React + Vite + TypeScript + Tailwind CSS
- `server.js` - Express backend
- `controllers/` - API route handlers
- `services/` - Business logic (email service)
- `config/` - Configuration files

## Key Files

- `frontend/src/pages/HomePage.tsx` - Main landing page
- `frontend/src/pages/PrivacyPage.tsx` - Privacy policy
- `frontend/src/pages/FunnelPage.tsx` - Lead capture funnel (/free-guide)
- `frontend/index.html` - HTML template with meta tags
- `.env.production` - Production environment variables

## Routes

- `/` - Home page
- `/privacy` - Privacy policy
- `/free-guide` - Lead capture funnel page
