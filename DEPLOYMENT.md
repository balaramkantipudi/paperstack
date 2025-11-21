# Paperstack Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying Paperstack to production, including all required APIs, environment variables, and configuration steps.

## Prerequisites

### Required Accounts & API Keys

#### 1. **Authentication & User Management**
- **Clerk** (or Auth0/Firebase Auth)
  - Sign up at: https://clerk.com
  - Required for: User authentication, session management
  - API Keys needed:
    - `VITE_CLERK_PUBLISHABLE_KEY`
    - `CLERK_SECRET_KEY`

#### 2. **Document Processing & OCR**
- **Google Cloud Vision API** or **AWS Textract**
  - Google Cloud: https://cloud.google.com/vision
  - AWS Textract: https://aws.amazon.com/textract
  - Required for: Document scanning, data extraction
  - API Keys needed:
    - Google: `GOOGLE_CLOUD_API_KEY` + Service Account JSON
    - AWS: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`

#### 3. **Accounting Software Integrations**
- **QuickBooks Online API**
  - Developer Portal: https://developer.intuit.com
  - Required for: QuickBooks integration
  - Keys needed:
    - `QUICKBOOKS_CLIENT_ID`
    - `QUICKBOOKS_CLIENT_SECRET`
    - `QUICKBOOKS_REDIRECT_URI`

- **Xero API**
  - Developer Portal: https://developer.xero.com
  - Required for: Xero integration
  - Keys needed:
    - `XERO_CLIENT_ID`
    - `XERO_CLIENT_SECRET`
    - `XERO_REDIRECT_URI`

#### 4. **File Storage**
- **AWS S3** or **Google Cloud Storage**
  - AWS S3: https://aws.amazon.com/s3
  - GCS: https://cloud.google.com/storage
  - Required for: Document storage, backups
  - Keys needed:
    - AWS: `AWS_S3_BUCKET_NAME`, `AWS_S3_REGION`
    - GCS: `GCS_BUCKET_NAME`, `GCS_PROJECT_ID`

#### 5. **Email Service**
- **SendGrid** or **AWS SES**
  - SendGrid: https://sendgrid.com
  - AWS SES: https://aws.amazon.com/ses
  - Required for: Transactional emails, notifications
  - Keys needed:
    - SendGrid: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
    - AWS SES: `AWS_SES_REGION`, `AWS_SES_FROM_EMAIL`

#### 6. **Payment Processing**
- **Stripe**
  - Dashboard: https://dashboard.stripe.com
  - Required for: Subscription billing
  - Keys needed:
    - `VITE_STRIPE_PUBLISHABLE_KEY`
    - `STRIPE_SECRET_KEY`
    - `STRIPE_WEBHOOK_SECRET`

#### 7. **Database**
- **PostgreSQL** (Recommended) or **MongoDB**
  - Hosted options: Supabase, Neon, AWS RDS, MongoDB Atlas
  - Required for: User data, documents, transactions
  - Connection string needed:
    - `DATABASE_URL`

#### 8. **AI/ML Services** (Optional but Recommended)
- **OpenAI API**
  - Platform: https://platform.openai.com
  - Required for: Smart categorization, insights
  - Keys needed:
    - `OPENAI_API_KEY`

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# App Configuration
VITE_APP_NAME=Paperstack
VITE_APP_URL=https://your-domain.com
NODE_ENV=production

# Authentication (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# Database
DATABASE_URL=postgresql://user:password@host:5432/paperstack

# Document Processing (Google Cloud Vision)
GOOGLE_CLOUD_API_KEY=xxxxx
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET_NAME=paperstack-documents
AWS_S3_REGION=us-east-1

# QuickBooks Integration
QUICKBOOKS_CLIENT_ID=xxxxx
QUICKBOOKS_CLIENT_SECRET=xxxxx
QUICKBOOKS_REDIRECT_URI=https://your-domain.com/integrations/quickbooks/callback
QUICKBOOKS_ENVIRONMENT=production

# Xero Integration
XERO_CLIENT_ID=xxxxx
XERO_CLIENT_SECRET=xxxxx
XERO_REDIRECT_URI=https://your-domain.com/integrations/xero/callback

# Email Service (SendGrid)
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@your-domain.com

# Payment Processing (Stripe)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# AI Services (OpenAI)
OPENAI_API_KEY=sk-xxxxx

# Security
JWT_SECRET=your-super-secret-jwt-key
ENCRYPTION_KEY=your-encryption-key-for-sensitive-data

# Monitoring & Logging (Optional)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
LOGTAIL_SOURCE_TOKEN=xxxxx
```

## Deployment Steps

### 1. **Build the Application**

```bash
# Install dependencies
npm install

# Run type checking
npm run type-check

# Build for production
npm run build

# The build output will be in the `dist` directory
```

### 2. **Database Setup**

```bash
# Run database migrations
npm run db:migrate

# Seed initial data (optional)
npm run db:seed
```

### 3. **Deploy to Hosting Platform**

#### Option A: Vercel (Recommended for Frontend)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
# Settings → Environment Variables
```

#### Option B: AWS (Full Stack)

1. **Frontend (S3 + CloudFront)**
   - Upload `dist` folder to S3 bucket
   - Configure CloudFront distribution
   - Set up SSL certificate via ACM

2. **Backend API (EC2 or Lambda)**
   - Deploy Node.js backend to EC2 or Lambda
   - Configure API Gateway
   - Set up load balancer

#### Option C: Docker + Kubernetes

```bash
# Build Docker image
docker build -t paperstack:latest .

# Push to container registry
docker push your-registry/paperstack:latest

# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml
```

### 4. **Configure Webhooks**

#### Stripe Webhooks
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

#### QuickBooks Webhooks
1. Go to Intuit Developer Portal → Your App → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/quickbooks`
3. Select entities to monitor

### 5. **Set Up Monitoring**

#### Error Tracking (Sentry)
```bash
npm install @sentry/react @sentry/vite-plugin
```

#### Performance Monitoring
- Set up Google Analytics or Mixpanel
- Configure application performance monitoring (APM)

#### Logging
- Configure structured logging with Logtail or CloudWatch
- Set up log aggregation and alerts

### 6. **Security Checklist**

- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable CSP (Content Security Policy) headers
- [ ] Configure firewall rules
- [ ] Set up DDoS protection (Cloudflare)
- [ ] Enable database encryption at rest
- [ ] Implement backup strategy
- [ ] Set up security scanning (Snyk, Dependabot)
- [ ] Configure secrets management (AWS Secrets Manager, Vault)

### 7. **Performance Optimization**

- [ ] Enable CDN for static assets
- [ ] Configure caching headers
- [ ] Implement lazy loading for images
- [ ] Set up database indexing
- [ ] Enable gzip/brotli compression
- [ ] Optimize bundle size
- [ ] Configure service worker for offline support

### 8. **Post-Deployment Verification**

```bash
# Health check endpoint
curl https://your-domain.com/api/health

# Test authentication flow
# Test document upload
# Test accounting integrations
# Verify email delivery
# Test payment processing
```

## Continuous Integration/Deployment

### GitHub Actions Example

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
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## Maintenance & Updates

### Regular Tasks
- **Daily**: Monitor error logs and performance metrics
- **Weekly**: Review security alerts, update dependencies
- **Monthly**: Database backups verification, cost optimization review
- **Quarterly**: Security audit, performance optimization

### Backup Strategy
- Database: Automated daily backups with 30-day retention
- Documents: S3 versioning enabled with lifecycle policies
- Configuration: Version controlled in Git

## Support & Troubleshooting

### Common Issues

**Issue**: Document processing fails
- Check Google Cloud Vision API quota
- Verify service account permissions
- Check document file size limits

**Issue**: Integration sync errors
- Verify OAuth tokens are valid
- Check API rate limits
- Review webhook delivery logs

**Issue**: Payment failures
- Verify Stripe webhook endpoint
- Check customer payment method status
- Review Stripe dashboard for declined payments

## Scaling Considerations

### Traffic Thresholds
- **< 1,000 users**: Single server deployment
- **1,000 - 10,000 users**: Load balanced, auto-scaling
- **> 10,000 users**: Microservices architecture, distributed caching

### Database Scaling
- Implement read replicas for heavy read operations
- Consider sharding for multi-tenant isolation
- Use connection pooling (PgBouncer for PostgreSQL)

## Compliance & Data Privacy

- **GDPR**: Implement data export and deletion features
- **SOC 2**: Document security controls and audit logs
- **HIPAA** (if applicable): Enable encryption, access controls
- **Data Retention**: Configure automatic data purging policies

## Cost Estimation

### Monthly Costs (Estimated for 100 active users)
- **Hosting** (Vercel/AWS): $50-200
- **Database** (Managed PostgreSQL): $25-100
- **File Storage** (S3): $10-50
- **OCR/Document Processing**: $100-300
- **Email Service**: $10-30
- **Authentication**: $25-50
- **Monitoring & Logging**: $20-50
- **Total**: ~$240-780/month

Scale costs linearly based on user count and document volume.

## Additional Resources

- [Vite Production Build Guide](https://vitejs.dev/guide/build.html)
- [React Production Deployment](https://react.dev/learn/start-a-new-react-project#deploying-to-production)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [AWS Well-Architected Framework](https://aws.amazon.com/architecture/well-architected/)
