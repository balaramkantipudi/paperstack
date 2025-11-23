# Clerk Integration Guide for Paperstack

**Official Clerk + React (Vite) Integration**

Reference: https://clerk.com/docs/quickstarts/react

---

## Step 1: Install Clerk React SDK

```bash
cd /Users/balaramkantipudi/Desktop/paperstack
npm install @clerk/clerk-react@latest
```

---

## Step 2: Get Your Publishable Key

1. Go to https://dashboard.clerk.com/last-active?path=api-keys
2. Select **React** from the framework dropdown
3. Copy your **Publishable Key** (starts with `pk_test_`)

---

## Step 3: Add Environment Variable

Create or update `.env.local`:

```bash
# .env.local
VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

**Important:** 
- Use `.env.local` for local development
- The `VITE_` prefix is required for Vite
- Replace `YOUR_PUBLISHABLE_KEY` with your actual key from Clerk dashboard

---

## Step 4: Update main.tsx

Replace your existing `src/main.tsx` with:

```typescript
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>
);
```

---

## Step 5: Update Your Login Page (Keep Your UI!)

Update `src/components/login-page.tsx` to use Clerk's authentication:

```typescript
import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@heroui/react";

export function LoginPage() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.errors?.[0]?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Keep all your existing beautiful UI!
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            color="primary"
            className="w-full"
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
```

---

## Step 6: Update Your Signup Page (Keep Your UI!)

Update `src/components/signup-page.tsx`:

```typescript
import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@heroui/react";

export function SignupPage() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setLoading(true);
    setError("");

    try {
      await signUp.create({
        emailAddress: email,
        password: password,
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || "",
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ 
        strategy: "email_code" 
      });

      setVerifying(true);
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.errors?.[0]?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.errors?.[0]?.message || "Invalid code");
    } finally {
      setLoading(false);
    }
  };

  // Keep all your existing beautiful UI!
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-8">Verify Email</h1>
          
          <p className="text-center mb-6">
            We sent a verification code to {email}
          </p>

          <form onSubmit={handleVerify} className="space-y-6">
            <Input
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              color="primary"
              className="w-full"
              isLoading={loading}
            >
              Verify Email
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button
            type="submit"
            color="primary"
            className="w-full"
            isLoading={loading}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
```

---

## Step 7: Add UserButton to Header

Update `src/components/header.tsx`:

```typescript
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Paperstack
        </Link>

        <nav className="flex items-center gap-4">
          <SignedOut>
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button color="primary">Get Started</Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/settings">Settings</Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
}
```

---

## Step 8: Protect Routes

Update `src/App.tsx`:

```typescript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

// Your pages
import { LandingPage } from "./components/landing-page";
import { LoginPage } from "./components/login-page";
import { SignupPage } from "./components/signup-page";
import { DashboardPage } from "./components/dashboard-page";
import { SettingsPage } from "./components/settings-page";
import { Header } from "./components/header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <DashboardPage />
            </SignedIn>
          }
        />
        <Route
          path="/settings"
          element={
            <SignedIn>
              <SettingsPage />
            </SignedIn>
          }
        />

        {/* Redirect to login if not signed in */}
        <Route
          path="*"
          element={
            <SignedOut>
              <Navigate to="/login" replace />
            </SignedOut>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## Step 9: Use User Data in Your App

Access the current user anywhere in your app:

```typescript
import { useUser } from "@clerk/clerk-react";

function DashboardPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <p>Email: {user?.emailAddresses[0].emailAddress}</p>
      
      {/* Use user.id to save data to Supabase */}
      <p>User ID: {user?.id}</p>
    </div>
  );
}
```

---

## Step 10: Update .gitignore

Ensure `.env.local` is not committed:

```bash
# .gitignore
.env.local
.env*.local
```

---

## Testing Your Integration

1. **Start your dev server:**
```bash
npm run dev
```

2. **Test signup flow:**
   - Go to http://localhost:5173/signup
   - Create account with email
   - Check email for verification code
   - Enter code and verify

3. **Test login flow:**
   - Go to http://localhost:5173/login
   - Sign in with your credentials
   - Should redirect to dashboard

4. **Test UserButton:**
   - Click on user avatar in header
   - Should see profile menu
   - Try "Manage account" to see Clerk's user portal

---

## What You Get

✅ **Your custom UI** (login/signup pages stay beautiful)  
✅ **Clerk's security** (password hashing, sessions)  
✅ **Email verification** (automatic)  
✅ **User management portal** (via UserButton)  
✅ **Password reset** (handled by Clerk)  
✅ **OAuth ready** (can add Google, Microsoft later)  
✅ **2FA ready** (can enable later)  

---

## Next Steps

1. **Connect to Supabase:** Use `user.id` to save business data
2. **Add OAuth:** Enable Google/Microsoft in Clerk dashboard
3. **Customize appearance:** Style UserButton to match your design
4. **Add webhooks:** Sync user creation to your backend

---

## Troubleshooting

**Error: "Missing Clerk Publishable Key"**
- Check `.env.local` has `VITE_CLERK_PUBLISHABLE_KEY`
- Restart dev server after adding env variable

**UserButton not showing**
- Make sure you're signed in
- Check `<SignedIn>` wrapper is in place

**Redirect loop**
- Check your route protection logic
- Ensure `afterSignOutUrl` is set correctly

---

## Official Documentation

- Clerk React Quickstart: https://clerk.com/docs/quickstarts/react
- Clerk Components: https://clerk.com/docs/components/overview
- useUser Hook: https://clerk.com/docs/references/react/use-user
