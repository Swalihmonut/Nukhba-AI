# Nukhba AI Deployment Guide

## Overview
This guide covers deploying the Nukhba AI exam preparation app to production environments.

## Prerequisites
- Node.js 18+ installed
- Next.js 14+ project setup
- Environment variables configured
- Database connections established (Supabase/Convex)

## Environment Variables
Ensure these are set in your production environment:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

## Deployment Options

### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 2. Netlify
```bash
# Build command
npm run build

# Publish directory
out/
```

### 3. Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## CI/CD Pipeline (GitHub Actions)

### .github/workflows/deploy.yml
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
      env:
        NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
        NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Mobile App Deployment

### Flutter to Google Play Store
```bash
# Build release APK
flutter build apk --release

# Build App Bundle (recommended)
flutter build appbundle --release

# Upload to Google Play Console
# Follow Google Play Console upload process
```

### Flutter to Apple App Store
```bash
# Build iOS release
flutter build ios --release

# Archive in Xcode
# Upload via Xcode or Application Loader
```

## Performance Optimizations

### 1. Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Compress images before upload

### 2. Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Bundle analysis with `npm run analyze`

### 3. Caching Strategy
- Static assets caching
- API response caching
- Service worker implementation

## Monitoring & Analytics

### 1. Error Tracking
```bash
npm install @sentry/nextjs
```

### 2. Performance Monitoring
- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Lighthouse CI integration

### 3. Analytics
- Google Analytics 4
- Custom event tracking
- User behavior analysis

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API rate limiting implemented
- [ ] Input validation on all forms
- [ ] XSS protection enabled
- [ ] CSRF protection implemented
- [ ] Content Security Policy configured

## Post-Deployment

### 1. Health Checks
- API endpoints responding
- Database connections working
- Payment gateways functional
- Voice/AI services operational

### 2. Performance Testing
- Load testing with realistic traffic
- Mobile performance validation
- Accessibility compliance verification

### 3. User Acceptance Testing
- Multi-language functionality
- Payment flow validation
- Offline mode testing
- Voice interaction testing

## Rollback Strategy

### Vercel
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

### Manual Rollback
- Keep previous build artifacts
- Database migration rollback scripts
- Feature flag toggles for quick disabling

## Support & Maintenance

### 1. Monitoring Alerts
- Error rate thresholds
- Response time alerts
- Uptime monitoring

### 2. Regular Updates
- Security patches
- Dependency updates
- Performance optimizations

### 3. Backup Strategy
- Database backups
- User data exports
- Configuration backups

## Troubleshooting

### Common Issues
1. **Build failures**: Check environment variables
2. **API timeouts**: Implement retry logic
3. **Payment failures**: Verify webhook endpoints
4. **Voice issues**: Check API keys and quotas

### Debug Commands
```bash
# Check build logs
npm run build -- --debug

# Analyze bundle size
npm run analyze

# Test production build locally
npm run start
```

For additional support, contact the development team or refer to the project documentation.
