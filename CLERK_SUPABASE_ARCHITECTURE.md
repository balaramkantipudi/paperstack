# Clerk + Supabase Architecture Guide

## 🤔 Your Questions Answered

### Q1: Can we remove our signup/login pages?
**YES! Absolutely.**

Clerk provides:
- ✅ Pre-built sign-up/sign-in components
- ✅ User profile management UI
- ✅ Password reset flows
- ✅ Email verification
- ✅ OAuth (Google, Microsoft, etc.)
- ✅ Multi-factor authentication

**You should DELETE:**
- `src/components/login-page.tsx` (use Clerk's `<SignIn />`)
- `src/components/signup-page.tsx` (use Clerk's `<SignUp />`)
- `src/components/profile-page.tsx` (use Clerk's `<UserProfile />`)

**You keep:**
- Your dashboard, settings, document pages (business logic)
- Just add Clerk's `<UserButton />` in header for quick access

---

### Q2: What about Clerk's billing feature (beta)?
**Skip it for now. Use Stripe directly.**

**Why:**
- Clerk's billing is in beta (not production-ready)
- Stripe is industry standard, well-documented
- You need custom logic anyway (usage-based pricing, project limits)
- Easier to migrate later if needed

**Recommendation:**
- Use Clerk for: Authentication only
- Use Stripe for: Payments, subscriptions, billing
- Keep them separate (cleaner architecture)

---

### Q3: Does Clerk have its own database?
**YES - Clerk manages its own user database.**

**What Clerk stores:**
- User credentials (email, password hash)
- Profile data (name, photo, metadata)
- Session tokens
- OAuth connections
- MFA settings

**You DON'T need to store in Supabase:**
- ❌ Passwords
- ❌ Email verification status
- ❌ Session management
- ❌ OAuth tokens

**You DO need to store in Supabase:**
- ✅ Business data (documents, projects, vendors)
- ✅ User preferences (settings, categories)
- ✅ Subscription info (plan, usage limits)
- ✅ Clerk User ID (to link Clerk user to your data)

---

### Q4: How do Clerk and Supabase connect?

**They DON'T directly connect. Your app is the bridge.**

```
┌─────────────────────────────────────────────────────────┐
│                     Your Frontend                        │
│                  (React + Vite)                          │
└──────────────┬─────────────────────┬────────────────────┘
               │                     │
               │                     │
       ┌───────▼────────┐    ┌──────▼──────────┐
       │     Clerk      │    │    Supabase     │
       │  (Auth Only)   │    │  (Business DB)  │
       └────────────────┘    └─────────────────┘
       
       Stores:                Stores:
       - Users                - Documents
       - Sessions             - Projects
       - Passwords            - Vendors
       - OAuth                - Settings
                              - clerk_user_id ← Link!
```

**The Flow:**

1. **User signs up** → Clerk creates user, returns `user.id`
2. **Your app** → Creates profile in Supabase with `clerk_user_id`
3. **User uploads document** → Your app uses Clerk `user.id` to save to Supabase
4. **User views dashboard** → Your app queries Supabase WHERE `clerk_user_id = user.id`

---

## 🏗️ Recommended Architecture

### What to Use Clerk For

**Authentication & User Management:**
- ✅ Sign up / Sign in
- ✅ Password reset
- ✅ Email verification
- ✅ OAuth (Google, Microsoft)
- ✅ User profile (name, email, photo)
- ✅ Session management
- ✅ Multi-factor authentication

**Pre-built Components:**
```tsx
import { SignIn, SignUp, UserButton, UserProfile } from "@clerk/clerk-react";

// Instead of your custom login page
<SignIn routing="path" path="/sign-in" />

// Instead of your custom signup page
<SignUp routing="path" path="/sign-up" />

// Instead of your custom profile page
<UserProfile routing="path" path="/profile" />

// In your header
<UserButton afterSignOutUrl="/" />
```

---

### What to Use Supabase For

**Business Data Storage:**
- ✅ Documents (invoices, receipts)
- ✅ Projects (construction projects)
- ✅ Vendors (suppliers, contractors)
- ✅ Categories (expense categories)
- ✅ Settings (user preferences)
- ✅ Subscription data (plan, usage)

**Database Schema:**
```sql
-- Profiles table (links to Clerk)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL, -- ← Link to Clerk
  company_name TEXT,
  subscription_plan TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT NOT NULL, -- ← Link to Clerk user
  file_name TEXT NOT NULL,
  vendor_name TEXT,
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT NOT NULL, -- ← Link to Clerk user
  name TEXT NOT NULL,
  budget DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Key Point:** Use `clerk_user_id` (string) instead of creating your own user table.

---

## 🔄 How They Work Together

### Step 1: User Signs Up (Clerk)

```tsx
// Your app - no custom code needed!
import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return <SignUp routing="path" path="/sign-up" />;
}
```

Clerk handles:
- Email validation
- Password strength
- Email verification
- Creating user account

---

### Step 2: Create Profile in Supabase (Your Code)

```tsx
// Listen for new Clerk user
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";

function App() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Create profile in Supabase if doesn't exist
      createProfileIfNeeded(user.id, user.emailAddresses[0].emailAddress);
    }
  }, [user]);

  return <YourApp />;
}

async function createProfileIfNeeded(clerkUserId: string, email: string) {
  // Check if profile exists
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (!existing) {
    // Create new profile
    await supabase.from('profiles').insert({
      clerk_user_id: clerkUserId,
      email: email,
      subscription_plan: 'free',
    });
  }
}
```

---

### Step 3: Save Business Data (Your Code)

```tsx
// When user uploads document
import { useUser } from "@clerk/clerk-react";

function DocumentUpload() {
  const { user } = useUser();

  const handleUpload = async (file: File) => {
    // Upload to your backend
    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'X-Clerk-User-Id': user.id, // ← Pass Clerk user ID
      },
    });
  };
}
```

**Backend (Node.js):**
```typescript
// Save to Supabase with Clerk user ID
app.post('/api/documents/upload', async (req, res) => {
  const clerkUserId = req.headers['x-clerk-user-id'];
  
  // Process document with Azure AI...
  
  // Save to Supabase
  const { data } = await supabase
    .from('documents')
    .insert({
      clerk_user_id: clerkUserId, // ← Link to Clerk user
      file_name: file.name,
      vendor_name: extractedData.vendor,
      total_amount: extractedData.amount,
    });
});
```

---

### Step 4: Query User's Data (Your Code)

```tsx
// Dashboard - show user's documents
import { useUser } from "@clerk/clerk-react";

function Dashboard() {
  const { user } = useUser();
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    loadDocuments();
  }, [user]);

  const loadDocuments = async () => {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('clerk_user_id', user.id) // ← Filter by Clerk user ID
      .order('created_at', { ascending: false });
    
    setDocuments(data);
  };

  return <DocumentList documents={documents} />;
}
```

---

## 🎯 What You Should Do

### Immediate Actions (MVP)

**1. Use Clerk for Auth Only**
```bash
npm install @clerk/clerk-react
```

**2. Remove Your Custom Auth Pages**
- ❌ Delete `login-page.tsx`
- ❌ Delete `signup-page.tsx`
- ❌ Delete `profile-page.tsx`
- ✅ Use Clerk's pre-built components

**3. Update Your Routes**
```tsx
// src/App.tsx
import { SignIn, SignUp, UserProfile } from "@clerk/clerk-react";

<Routes>
  <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
  <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />
  <Route path="/profile/*" element={<UserProfile routing="path" path="/profile" />} />
  
  {/* Your business pages */}
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/documents" element={<DocumentsPage />} />
  <Route path="/settings" element={<SettingsPage />} />
</Routes>
```

**4. Update Supabase Schema**
```sql
-- Use clerk_user_id instead of creating users table
ALTER TABLE documents ADD COLUMN clerk_user_id TEXT NOT NULL;
ALTER TABLE projects ADD COLUMN clerk_user_id TEXT NOT NULL;
ALTER TABLE vendors ADD COLUMN clerk_user_id TEXT NOT NULL;

-- Create index for fast queries
CREATE INDEX idx_documents_clerk_user ON documents(clerk_user_id);
CREATE INDEX idx_projects_clerk_user ON projects(clerk_user_id);
```

**5. Skip Clerk Billing (For Now)**
- Use Stripe directly for payments
- Clerk billing is beta, not production-ready
- You need custom logic anyway

---

## 🔐 Security: Row Level Security (RLS)

**Problem:** Anyone can query Supabase and see all data.

**Solution:** Enable Row Level Security in Supabase.

```sql
-- Enable RLS on all tables
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own data
CREATE POLICY "Users can view own documents"
  ON documents
  FOR SELECT
  USING (clerk_user_id = current_setting('app.clerk_user_id'));

-- In your backend, set the user ID before queries
await supabase.rpc('set_config', {
  setting: 'app.clerk_user_id',
  value: clerkUserId,
});
```

**Better approach for MVP:** Use backend API (not direct Supabase from frontend).

---

## 📊 Comparison: What Each Service Does

| Feature | Clerk | Supabase | Your App |
|---------|-------|----------|----------|
| **User signup** | ✅ Handles | ❌ | ❌ |
| **Login/logout** | ✅ Handles | ❌ | ❌ |
| **Password reset** | ✅ Handles | ❌ | ❌ |
| **Email verification** | ✅ Handles | ❌ | ❌ |
| **OAuth (Google, etc)** | ✅ Handles | ❌ | ❌ |
| **Session management** | ✅ Handles | ❌ | ❌ |
| **User profile UI** | ✅ Pre-built | ❌ | ❌ |
| **Store documents** | ❌ | ✅ Stores | ✅ Manages |
| **Store projects** | ❌ | ✅ Stores | ✅ Manages |
| **Business logic** | ❌ | ❌ | ✅ Handles |
| **AI processing** | ❌ | ❌ | ✅ Handles |
| **QuickBooks sync** | ❌ | ❌ | ✅ Handles |
| **Payments** | ⚠️ Beta | ❌ | ✅ Use Stripe |

---

## 🎯 Recommended Setup (MVP)

### Frontend (React)
```tsx
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_KEY}>
      <Header>
        <SignedIn>
          <UserButton /> {/* Clerk's pre-built user menu */}
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in">Sign In</Link>
        </SignedOut>
      </Header>
      
      <Routes>
        {/* Clerk handles these */}
        <Route path="/sign-in/*" element={<SignIn />} />
        <Route path="/sign-up/*" element={<SignUp />} />
        
        {/* You handle these */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/documents" element={<Documents />} />
      </Routes>
    </ClerkProvider>
  );
}
```

### Backend (Node.js)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.post('/api/documents/upload', async (req, res) => {
  // Get Clerk user ID from header
  const clerkUserId = req.headers['authorization']?.split(' ')[1];
  
  // Verify with Clerk (optional but recommended)
  const user = await clerkClient.users.getUser(clerkUserId);
  
  // Process document...
  
  // Save to Supabase
  await supabase.from('documents').insert({
    clerk_user_id: clerkUserId,
    // ... other fields
  });
});
```

### Database (Supabase)
```sql
-- Simple schema linking to Clerk
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT NOT NULL, -- ← Link to Clerk
  file_name TEXT,
  vendor_name TEXT,
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ Summary: What to Do

### Use Clerk For:
1. ✅ Sign up / Sign in (delete your custom pages)
2. ✅ User profile management (use `<UserProfile />`)
3. ✅ Session management (automatic)
4. ✅ OAuth (Google, Microsoft)
5. ✅ Password reset (automatic)

### Use Supabase For:
1. ✅ Documents storage
2. ✅ Projects storage
3. ✅ Vendors storage
4. ✅ Settings storage
5. ✅ Link to Clerk via `clerk_user_id`

### Use Stripe For:
1. ✅ Payments
2. ✅ Subscriptions
3. ✅ Billing
4. ❌ NOT Clerk billing (it's beta)

### Your App Handles:
1. ✅ Business logic
2. ✅ AI document processing
3. ✅ QuickBooks integration
4. ✅ Dashboard / Analytics
5. ✅ Bridging Clerk ↔ Supabase

---

## 🚀 Next Steps

1. **Install Clerk**: `npm install @clerk/clerk-react`
2. **Delete custom auth pages**: Remove login/signup/profile pages
3. **Update routes**: Use Clerk's `<SignIn />`, `<SignUp />`, `<UserProfile />`
4. **Update Supabase schema**: Add `clerk_user_id` to all tables
5. **Test the flow**: Sign up → Create profile → Upload document

**This architecture is simpler, more secure, and production-ready.** ✅

---

## 💡 Why This is Better

**Before (Custom Auth):**
- ❌ You build login/signup forms
- ❌ You handle password hashing
- ❌ You manage sessions
- ❌ You build password reset
- ❌ You handle email verification
- ❌ You store passwords in Supabase
- ❌ Security risks if done wrong

**After (Clerk + Supabase):**
- ✅ Clerk handles all auth (pre-built, secure)
- ✅ You focus on business logic
- ✅ Supabase stores only business data
- ✅ Faster development
- ✅ Better security
- ✅ Professional UI out of the box

**You save 2-3 weeks of development time and get better security.** 🎉
