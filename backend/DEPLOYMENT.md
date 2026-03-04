# Boarding Buddy - Production Deployment Checklist

## Pre-Deployment Checklist

### 1. Environment Configuration

- [ ] Create `.env.production` from `.env.production` template
- [ ] Set `NODE_ENV=production`
- [ ] Generate secure `JWT_SECRET` (64+ characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- [ ] Configure MongoDB Atlas connection string
- [ ] Set `CORS_ORIGIN` to your frontend domain(s)
- [ ] Configure cookie settings (`COOKIE_SECURE=true`, `COOKIE_SAME_SITE=strict`)

### 2. Security Checklist

- [ ] All sensitive data in environment variables (not in code)
- [ ] JWT secret is at least 32 characters
- [ ] Rate limiting configured appropriately
- [ ] CORS whitelist only trusted domains
- [ ] Helmet security headers enabled
- [ ] Input validation on all routes
- [ ] NoSQL injection prevention active
- [ ] XSS protection enabled
- [ ] Cookie `secure` flag enabled for HTTPS
- [ ] Cookie `httpOnly` flag enabled
- [ ] Password hashing (bcrypt) implemented

### 3. Database

- [ ] MongoDB Atlas configured with:
  - [ ] IP whitelist (or allow from anywhere with strong auth)
  - [ ] Database user with minimal required permissions
  - [ ] Connection string uses `mongodb+srv://`
  - [ ] Network peering/PrivateLink for production (optional)
- [ ] Indexes created for frequently queried fields
- [ ] Database backups configured

### 4. Logging & Monitoring

- [ ] Winston logger configured for file output
- [ ] Log rotation set up (daily, max 30 days)
- [ ] Error logs separate from combined logs
- [ ] Consider adding external monitoring:
  - [ ] Application Performance Monitoring (APM)
  - [ ] Error tracking (Sentry, LogRocket)
  - [ ] Uptime monitoring

### 5. Code Quality

- [ ] All console.log statements removed or replaced with logger
- [ ] No hardcoded secrets or credentials
- [ ] Dependencies updated (`npm audit`)
- [ ] ESLint passes with no errors
- [ ] Tests passing (`npm test`)

---

## Deployment Steps

### Option A: Deploy to Railway/Render/Heroku

1. **Connect Repository**

   ```bash
   # Push to GitHub first
   git push origin main
   ```

2. **Configure Environment Variables**
   - Add all variables from `.env.production`
   - Set `NODE_ENV=production`

3. **Build Command**

   ```bash
   npm install
   ```

4. **Start Command**
   ```bash
   npm start
   ```

### Option B: Deploy to VPS (Ubuntu)

1. **Install Node.js**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone Repository**

   ```bash
   git clone https://github.com/your-repo/boarding-buddy.git
   cd boarding-buddy/backend
   ```

3. **Install Dependencies**

   ```bash
   npm ci --production
   ```

4. **Set Up PM2**

   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name boarding-buddy
   pm2 startup
   pm2 save
   ```

5. **Set Up Nginx Reverse Proxy**

   ```nginx
   server {
       listen 80;
       server_name api.your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Set Up SSL (Let's Encrypt)**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.your-domain.com
   ```

### Option C: Deploy with Docker

1. **Dockerfile** (create in backend folder)

   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --production
   COPY . .
   EXPOSE 5000
   CMD ["node", "server.js"]
   ```

2. **Build & Run**
   ```bash
   docker build -t boarding-buddy-api .
   docker run -d -p 5000:5000 --env-file .env.production boarding-buddy-api
   ```

---

## Post-Deployment Checklist

### Verification

- [ ] Health check endpoint responds: `GET /health`
- [ ] API root responds: `GET /`
- [ ] Authentication works: `POST /api/auth/login`
- [ ] CORS allows frontend requests
- [ ] Cookies set correctly (check browser dev tools)
- [ ] Rate limiting works (test with rapid requests)

### Monitoring Setup

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom)
- [ ] Configure alerting for errors
- [ ] Monitor server resources (CPU, Memory, Disk)
- [ ] Set up log aggregation (optional)

### Database Maintenance

- [ ] Enable MongoDB Atlas monitoring
- [ ] Configure automated backups
- [ ] Set up alerts for:
  - [ ] Connection issues
  - [ ] Slow queries
  - [ ] Storage limits

---

## Environment Variables Reference

| Variable                  | Required | Description                           |
| ------------------------- | -------- | ------------------------------------- |
| `NODE_ENV`                | Yes      | Set to `production`                   |
| `PORT`                    | No       | Server port (default: 5000)           |
| `MONGO_URI`               | Yes      | MongoDB connection string             |
| `JWT_SECRET`              | Yes      | Secret for signing JWTs               |
| `JWT_EXPIRE`              | No       | Token expiry (default: 30d)           |
| `CORS_ORIGIN`             | Yes      | Allowed frontend origins              |
| `COOKIE_SECURE`           | No       | Set to `true` for HTTPS               |
| `COOKIE_SAME_SITE`        | No       | Cookie SameSite policy                |
| `RATE_LIMIT_WINDOW_MS`    | No       | Rate limit window                     |
| `RATE_LIMIT_MAX_REQUESTS` | No       | Max requests per window               |
| `LOG_LEVEL`               | No       | Logging level (info/debug/warn/error) |

---

## Troubleshooting

### Common Issues

**CORS Errors**

- Check `CORS_ORIGIN` matches frontend URL exactly
- Include protocol (https://)
- For multiple origins, use comma-separated values

**Cookie Not Setting**

- Ensure `COOKIE_SECURE=true` only with HTTPS
- Check `sameSite` policy matches your setup
- Verify domain settings

**Database Connection Failed**

- Check IP whitelist in MongoDB Atlas
- Verify connection string format
- Check network connectivity

**Rate Limiting Too Aggressive**

- Adjust `RATE_LIMIT_MAX_REQUESTS`
- Consider different limits for different endpoints

---

## Security Reminders

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Rotate JWT secret periodically** - Invalidates all sessions
3. **Update dependencies regularly** - `npm audit fix`
4. **Monitor for suspicious activity** - Check logs regularly
5. **Back up database** - Before any major changes
