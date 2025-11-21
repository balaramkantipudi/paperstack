# MVP Implementation Guide: 2-Week Sprint to Demo

**Goal**: Build a working MVP that you can demo to a property owner, showing real document processing with AI.

**Timeline**: 2 weeks (10 working days)
**End Result**: Upload a construction invoice → AI extracts data → Display results → Sync to QuickBooks

---

## 🎯 What You'll Demo

1. **Upload a construction invoice** (PDF or image)
2. **AI automatically extracts**:
   - Vendor name
   - Invoice number
   - Total amount
   - Line items (materials, labor, etc.)
   - Date
3. **Categorize expense** (Materials, Labor, Equipment)
4. **Assign to project** (e.g., "123 Main St Renovation")
5. **Show in dashboard** with charts and insights
6. **Sync to QuickBooks** (optional but impressive)

---

## 📋 Prerequisites (Day 0 - Setup Day)

### ✅ Checkpoint 0: Accounts Created
**Time**: 2-3 hours

Create these accounts (all have free tiers):

1. **Azure Account** (for OCR)
   - Go to: https://azure.microsoft.com/free
   - Sign up with your email
   - Get $200 free credit
   - ✅ **Checkpoint**: You can log into Azure Portal

2. **Supabase Account** (for database)
   - Go to: https://supabase.com
   - Sign up with GitHub
   - ✅ **Checkpoint**: You can create a new project

3. **Clerk Account** (for authentication)
   - Go to: https://clerk.com
   - Sign up with GitHub
   - ✅ **Checkpoint**: You can create a new application

4. **Vercel Account** (for deployment)
   - Go to: https://vercel.com
   - Sign up with GitHub
   - ✅ **Checkpoint**: You can see your dashboard

**Deliverable**: Screenshot of each dashboard showing you're logged in

---

## Week 1: Core Functionality

### Day 1: Database Setup
**Goal**: Get your database ready to store documents and transactions

#### Step 1.1: Create Supabase Project (30 min)
```bash
# 1. Go to https://supabase.com/dashboard
# 2. Click "New Project"
# 3. Fill in:
#    - Name: paperstack-mvp
#    - Database Password: [Save this securely!]
#    - Region: Choose closest to you
# 4. Wait 2-3 minutes for project to be created
```

✅ **Checkpoint 1.1**: You can see your project dashboard

#### Step 1.2: Run Database Schema (30 min)
```sql
-- Go to SQL Editor in Supabase dashboard
-- Copy and paste this entire schema:

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Clerk will manage users, we just reference them)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL, -- Clerk user ID
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  
  -- Extracted data
  vendor_name TEXT,
  invoice_number TEXT,
  invoice_date DATE,
  total_amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  
  -- Categorization
  category TEXT, -- Materials, Labor, Equipment, etc.
  project_name TEXT,
  
  -- Raw OCR data
  raw_ocr_data JSONB,
  line_items JSONB, -- Array of line items
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendors table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  status TEXT DEFAULT 'active', -- active, completed, on_hold
  budget DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create indexes for better performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Insert sample data for demo
INSERT INTO projects (user_id, name, address, budget) VALUES
  ('demo_user', '123 Main St Renovation', '123 Main St, Austin, TX', 150000.00),
  ('demo_user', 'Oak Avenue New Build', '456 Oak Ave, Austin, TX', 300000.00);

INSERT INTO vendors (user_id, name, email, phone) VALUES
  ('demo_user', 'BuildSupply Inc', 'orders@buildsupply.com', '555-0100'),
  ('demo_user', 'ConMaterials LLC', 'sales@conmaterials.com', '555-0200'),
  ('demo_user', 'Elite Contractors', 'info@elitecontractors.com', '555-0300');
```

✅ **Checkpoint 1.2**: Run `SELECT * FROM projects;` and see 2 projects

#### Step 1.3: Get Database Credentials (15 min)
```bash
# In Supabase dashboard:
# 1. Go to Settings → Database
# 2. Copy "Connection string" (URI format)
# 3. Save to .env file
```

✅ **Checkpoint 1.3**: You have DATABASE_URL saved

**Day 1 Deliverable**: Database is set up with tables and sample data

---

### Day 2: Azure AI Document Intelligence Setup
**Goal**: Get OCR working to extract data from invoices

#### Step 2.1: Create Azure Resource (45 min)
```bash
# 1. Go to https://portal.azure.com
# 2. Click "Create a resource"
# 3. Search for "Document Intelligence"
# 4. Click "Create"
# 5. Fill in:
#    - Resource group: Create new → "paperstack-resources"
#    - Region: Choose closest (e.g., East US)
#    - Name: paperstack-doc-intelligence
#    - Pricing tier: Free F0 (500 pages/month free)
# 6. Click "Review + Create"
# 7. Wait 2-3 minutes for deployment
```

✅ **Checkpoint 2.1**: Resource is deployed

#### Step 2.2: Get API Keys (15 min)
```bash
# 1. Go to your Document Intelligence resource
# 2. Click "Keys and Endpoint" in left sidebar
# 3. Copy:
#    - KEY 1 (save as AZURE_DOCUMENT_INTELLIGENCE_KEY)
#    - Endpoint (save as AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT)
```

✅ **Checkpoint 2.2**: You have both keys saved

#### Step 2.3: Test OCR with Sample Invoice (1 hour)
```bash
# Create a test file
cd /Users/balaramkantipudi/Desktop/paperstack
mkdir -p test-data
```

Create `test-azure-ocr.js`:
```javascript
const { DocumentAnalysisClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");

const endpoint = "YOUR_ENDPOINT";
const apiKey = "YOUR_KEY";

const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

async function testInvoiceOCR() {
  // Use a sample invoice URL (you can use any invoice image URL)
  const invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";
  
  console.log("🔍 Analyzing invoice...");
  
  const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-invoice", invoiceUrl);
  const result = await poller.pollUntilDone();
  
  const invoice = result.documents[0];
  
  console.log("\n✅ Extraction Results:");
  console.log("Vendor:", invoice.fields.VendorName?.value);
  console.log("Invoice #:", invoice.fields.InvoiceId?.value);
  console.log("Total:", invoice.fields.InvoiceTotal?.value);
  console.log("Date:", invoice.fields.InvoiceDate?.value);
  
  console.log("\nLine Items:");
  invoice.fields.Items?.values?.forEach((item, i) => {
    console.log(`  ${i + 1}. ${item.properties.Description?.value} - $${item.properties.Amount?.value}`);
  });
}

testInvoiceOCR().catch(console.error);
```

Run the test:
```bash
npm install @azure/ai-form-recognizer
node test-azure-ocr.js
```

✅ **Checkpoint 2.3**: You see extracted invoice data in console

**Day 2 Deliverable**: OCR is working and extracting invoice data

---

### Day 3: Clerk Authentication Setup
**Goal**: Add real user authentication to your app

#### Step 3.1: Create Clerk Application (30 min)
```bash
# 1. Go to https://dashboard.clerk.com
# 2. Click "Add application"
# 3. Name: Paperstack MVP
# 4. Enable: Email, Google (optional)
# 5. Click "Create application"
```

✅ **Checkpoint 3.1**: Application created

#### Step 3.2: Get API Keys (15 min)
```bash
# In Clerk dashboard:
# 1. Go to "API Keys"
# 2. Copy:
#    - Publishable key (starts with pk_test_)
#    - Secret key (starts with sk_test_)
```

✅ **Checkpoint 3.3**: Keys saved to .env

#### Step 3.3: Add Clerk to Frontend (1 hour)
```bash
# Install Clerk
npm install @clerk/clerk-react
```

Update `src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
```

Update `.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

Update `src/App.tsx` to add auth:
```typescript
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// In your header component, replace the mock user dropdown with:
<SignedIn>
  <UserButton />
</SignedIn>
<SignedOut>
  <SignInButton mode="modal">
    <Button color="primary">Sign In</Button>
  </SignInButton>
</SignedOut>
```

✅ **Checkpoint 3.3**: Run `npm run dev` and see Clerk sign-in

**Day 3 Deliverable**: Real authentication working in your app

---

### Day 4: Backend API - Document Upload
**Goal**: Create API endpoint to upload documents

#### Step 4.1: Set Up Backend Project (1 hour)
```bash
# Create backend directory
cd /Users/balaramkantipudi/Desktop
mkdir paperstack-api
cd paperstack-api

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express multer @azure/ai-form-recognizer @supabase/supabase-js dotenv cors
npm install -D typescript @types/express @types/node @types/multer ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

Create `src/index.ts`:
```typescript
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Paperstack API is running' });
});

app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('File uploaded:', req.file);
    res.json({ 
      success: true, 
      message: 'File received',
      file: req.file 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
```

Update `package.json`:
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

Start the API:
```bash
npm run dev
```

✅ **Checkpoint 4.1**: Visit http://localhost:3001/health and see "ok"

#### Step 4.2: Test File Upload (30 min)
```bash
# Test with curl
curl -X POST http://localhost:3001/api/documents/upload \
  -F "file=@/path/to/test-invoice.pdf"
```

✅ **Checkpoint 4.2**: File upload returns success

**Day 4 Deliverable**: Backend API running and accepting file uploads

---

### Day 5: Integrate OCR with Upload
**Goal**: Process uploaded documents with Azure AI

#### Step 5.1: Add OCR Processing (2 hours)
Update `src/index.ts`:
```typescript
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const azureClient = new DocumentAnalysisClient(
  process.env.AZURE_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_KEY!)
);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📄 Processing document:', req.file.originalname);

    // Read file as buffer
    const fileBuffer = fs.readFileSync(req.file.path);

    // Analyze with Azure AI
    console.log('🔍 Analyzing with Azure AI...');
    const poller = await azureClient.beginAnalyzeDocument(
      "prebuilt-invoice",
      fileBuffer
    );
    const result = await poller.pollUntilDone();

    const invoice = result.documents?.[0];
    if (!invoice) {
      throw new Error('No invoice data extracted');
    }

    // Extract data
    const extractedData = {
      vendorName: invoice.fields.VendorName?.value || 'Unknown',
      invoiceNumber: invoice.fields.InvoiceId?.value || '',
      invoiceDate: invoice.fields.InvoiceDate?.value || null,
      totalAmount: invoice.fields.InvoiceTotal?.value || 0,
      lineItems: invoice.fields.Items?.values?.map(item => ({
        description: item.properties?.Description?.value || '',
        quantity: item.properties?.Quantity?.value || 1,
        amount: item.properties?.Amount?.value || 0,
      })) || [],
    };

    console.log('✅ Extracted:', extractedData);

    // Save to database
    const { data: document, error } = await supabase
      .from('documents')
      .insert({
        user_id: req.body.userId || 'demo_user',
        file_name: req.file.originalname,
        file_url: `/uploads/${req.file.filename}`,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        status: 'completed',
        vendor_name: extractedData.vendorName,
        invoice_number: extractedData.invoiceNumber,
        invoice_date: extractedData.invoiceDate,
        total_amount: extractedData.totalAmount,
        line_items: extractedData.lineItems,
        raw_ocr_data: result,
      })
      .select()
      .single();

    if (error) throw error;

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      document,
      extracted: extractedData,
    });

  } catch (error) {
    console.error('❌ Processing error:', error);
    res.status(500).json({ error: 'Processing failed' });
  }
});
```

Create `.env`:
```env
AZURE_ENDPOINT=your_azure_endpoint
AZURE_KEY=your_azure_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
PORT=3001
```

✅ **Checkpoint 5.1**: Upload a test invoice and see extracted data in response

#### Step 5.2: Verify Database Storage (15 min)
```bash
# In Supabase dashboard, run:
SELECT * FROM documents ORDER BY created_at DESC LIMIT 1;
```

✅ **Checkpoint 5.2**: You see the uploaded document in database

**Day 5 Deliverable**: Full pipeline working: Upload → OCR → Database

---

## Week 2: Frontend Integration & Polish

### Day 6: Connect Frontend to Backend
**Goal**: Make the frontend upload real documents

#### Step 6.1: Update Document Service (1 hour)
Update `src/services/document-service.ts`:
```typescript
const API_URL = 'http://localhost:3001';

export class DocumentService {
  async uploadDocument(file: File, userId: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const response = await fetch(`${API_URL}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }

  async getDocuments(userId: string): Promise<any[]> {
    const response = await fetch(`${API_URL}/api/documents?userId=${userId}`);
    return response.json();
  }
}

export const documentService = new DocumentService();
```

#### Step 6.2: Update Dashboard to Use Real API (1 hour)
Update `src/components/dashboard-page.tsx`:
```typescript
import { useUser } from "@clerk/clerk-react";
import { documentService } from "../services/document-service";

export const DashboardPage = () => {
  const { user } = useUser();
  const [documents, setDocuments] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    
    setUploading(true);
    try {
      const result = await documentService.uploadDocument(file, user.id);
      console.log('Upload success:', result);
      
      // Refresh documents list
      loadDocuments();
      
      // Show success message
      alert(`✅ Extracted: ${result.extracted.vendorName} - $${result.extracted.totalAmount}`);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const loadDocuments = async () => {
    if (!user) return;
    const docs = await documentService.getDocuments(user.id);
    setDocuments(docs);
  };

  React.useEffect(() => {
    loadDocuments();
  }, [user]);

  // Rest of your component...
};
```

✅ **Checkpoint 6.2**: Upload a document in the UI and see real extracted data

**Day 6 Deliverable**: Frontend and backend fully connected

---

### Day 7: Add GET Documents Endpoint
**Goal**: Display real documents in dashboard

#### Step 7.1: Add GET Endpoint (30 min)
Add to `src/index.ts`:
```typescript
app.get('/api/documents', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

app.get('/api/documents/stats', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    
    const { data: documents } = await supabase
      .from('documents')
      .select('total_amount, category, created_at')
      .eq('user_id', userId);

    const stats = {
      totalDocuments: documents?.length || 0,
      totalAmount: documents?.reduce((sum, doc) => sum + (doc.total_amount || 0), 0) || 0,
      byCategory: documents?.reduce((acc, doc) => {
        const cat = doc.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + (doc.total_amount || 0);
        return acc;
      }, {} as Record<string, number>),
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
```

✅ **Checkpoint 7.1**: Visit http://localhost:3001/api/documents?userId=demo_user and see documents

**Day 7 Deliverable**: Dashboard shows real data from database

---

### Day 8: Deploy to Vercel
**Goal**: Get your app live on the internet

#### Step 8.1: Deploy Frontend (1 hour)
```bash
cd /Users/balaramkantipudi/Desktop/paperstack

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Follow prompts:
- Set up and deploy? Yes
- Which scope? Your account
- Link to existing project? No
- Project name? paperstack
- Directory? ./
- Override settings? No

✅ **Checkpoint 8.1**: You get a live URL (e.g., paperstack.vercel.app)

#### Step 8.2: Deploy Backend to Railway (1 hour)
```bash
cd /Users/balaramkantipudi/Desktop/paperstack-api

# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

✅ **Checkpoint 8.2**: Backend is live with a Railway URL

#### Step 8.3: Update Frontend to Use Production API (15 min)
Update `src/services/document-service.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

Add to Vercel environment variables:
```
VITE_API_URL=https://your-railway-app.railway.app
```

Redeploy:
```bash
vercel --prod
```

✅ **Checkpoint 8.3**: Live app uploads documents successfully

**Day 8 Deliverable**: App is live and working on the internet!

---

### Day 9: Polish for Demo
**Goal**: Make it look professional for the demo

#### Step 9.1: Add Loading States (1 hour)
- Add spinners during upload
- Show progress messages
- Add success/error notifications

#### Step 9.2: Create Demo Data (1 hour)
```bash
# Upload 5-10 sample construction invoices
# Categorize them properly
# Assign to different projects
```

#### Step 9.3: Test Demo Flow (1 hour)
Practice your demo:
1. Sign in
2. Show dashboard with existing data
3. Upload new invoice
4. Watch it process
5. Show extracted data
6. Point out categorization
7. Show financial insights

✅ **Checkpoint 9**: You can do the full demo smoothly

**Day 9 Deliverable**: Polished, demo-ready app

---

### Day 10: QuickBooks Integration (Optional)
**Goal**: Sync data to QuickBooks for extra wow factor

#### Step 10.1: Set Up QuickBooks Developer Account (30 min)
- Go to https://developer.intuit.com
- Create app
- Get Client ID and Secret

#### Step 10.2: Add OAuth Flow (2 hours)
- Implement QuickBooks OAuth
- Add sync button
- Test syncing one invoice

✅ **Checkpoint 10**: One invoice syncs to QuickBooks

**Day 10 Deliverable**: QuickBooks integration working

---

## 🎬 Demo Script

### Opening (30 seconds)
"Hi [Property Owner Name], thanks for your time. I want to show you how Paperstack can save you hours every week on paperwork."

### Problem (30 seconds)
"Right now, you probably spend hours manually entering invoice data, categorizing expenses, and updating QuickBooks. Let me show you a better way."

### Demo (3 minutes)

**1. Show Dashboard (30 sec)**
- "Here's your dashboard with all your documents"
- Point out total spent, categories, projects

**2. Upload Document (1 min)**
- "Let me upload this invoice from BuildSupply"
- Drag and drop PDF
- "Watch this... in about 10 seconds..."
- Show extracted data appearing

**3. Show Results (1 min)**
- "It automatically extracted:
  - Vendor: BuildSupply Inc
  - Amount: $4,523.50
  - All line items
  - Categorized as Materials
  - Assigned to 123 Main St project"

**4. Show Insights (30 sec)**
- "And here's where it gets powerful..."
- Show financial dashboard
- Point out spending by category, project budget tracking

**5. QuickBooks Sync (optional, 30 sec)**
- "One click and it's in QuickBooks"
- Click sync button
- "Done. No manual entry needed."

### Close (30 seconds)
"This is just the MVP. Imagine this handling all your invoices, receipts, and contracts automatically. Interested in trying it for your projects?"

---

## 📊 Success Metrics

After completing this guide, you should have:

- ✅ Working document upload
- ✅ AI extraction with 90%+ accuracy
- ✅ Data stored in database
- ✅ Live app on the internet
- ✅ Smooth 3-minute demo
- ✅ Real QuickBooks integration (optional)

---

## 🆘 Troubleshooting

### OCR Not Working
- Check Azure credits haven't run out
- Verify endpoint and key are correct
- Try with a clearer invoice image

### Upload Fails
- Check CORS is enabled on backend
- Verify file size is under 10MB
- Check backend logs for errors

### Database Connection Issues
- Verify Supabase URL and key
- Check if tables exist
- Try running schema again

### Deploy Fails
- Check all environment variables are set
- Verify build completes locally first
- Check Vercel/Railway logs

---

## 📝 Next Steps After Demo

If the property owner is interested:

1. **Week 3**: Add more features
   - Batch upload
   - Email forwarding
   - Mobile app

2. **Week 4**: Production hardening
   - Add tests
   - Improve error handling
   - Add monitoring

3. **Week 5**: Beta testing
   - Onboard 3-5 users
   - Gather feedback
   - Fix bugs

4. **Week 6**: Launch
   - Marketing site
   - Pricing page
   - Payment integration

---

## 💡 Pro Tips

1. **Practice the demo 3 times** before showing it
2. **Have backup sample data** in case upload fails
3. **Use a clear, high-quality invoice** for the demo
4. **Keep it under 5 minutes** - attention spans are short
5. **Focus on time saved** - "This saves you 10 hours/week"
6. **Have pricing ready** - "$49/month saves you $500/month in labor"

---

## ✅ Final Checklist

Before the demo:
- [ ] App is deployed and accessible
- [ ] You can sign in successfully
- [ ] Dashboard shows sample data
- [ ] Upload works smoothly
- [ ] OCR extracts data accurately
- [ ] You've practiced the demo 3x
- [ ] You have backup plan if internet fails
- [ ] You have pricing/next steps ready

**You're ready to demo! 🚀**
