# 🔐 Clerk Setup Instructions

## Quick Setup (5 minutes)

### Step 1: Create Clerk Account
1. Go to https://clerk.com
2. Sign up for free account
3. Create a new application named "Paperstack"

### Step 2: Get Your Publishable Key
1. In Clerk dashboard, go to: https://dashboard.clerk.com/last-active?path=api-keys
2. Select **React** from the framework dropdown
3. Copy your **Publishable Key** (starts with `pk_test_`)

### Step 3: Add to Your Project
Create a file `.env.local` in your project root:

```bash
# .env.local
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

**Replace `pk_test_YOUR_KEY_HERE` with your actual key from Step 2**

### Step 4: Restart Dev Server
```bash
# Stop your current dev server (Ctrl+C)
# Then restart it:
npm run dev
```

### Step 5: Test It!
1. Go to http://localhost:5173
2. Click "Try free" or "Log in"
3. Your custom pages should work with Clerk authentication!

---

## What's Been Integrated

✅ **ClerkProvider** wrapping your entire app  
✅ **UserButton** in header (shows when signed in)  
✅ **SignedIn/SignedOut** components controlling navigation  
✅ **Your custom login/signup pages** (UI stays the same!)  

---

## Next Steps

After you add your Clerk key and restart:

1. **Test signup flow** - Create an account
2. **Check email** - Verify your email
3. **Test login** - Sign in with your credentials
4. **See UserButton** - Click your avatar in header
5. **Test sign out** - Click sign out from menu

---

## Troubleshooting

**Error: "Missing Clerk Publishable Key"**
- Make sure `.env.local` exists in project root
- Check the key starts with `pk_test_`
- Restart dev server after adding the file

**UserButton not showing**
- Make sure you're signed in
- Check browser console for errors

**Can't sign up**
- Check your internet connection
- Verify Clerk dashboard shows your app is active

---

## What's Next

Once Clerk is working, you can:
- Connect to Supabase (use `user.id` from Clerk)
- Add OAuth (Google, Microsoft) in Clerk dashboard
- Customize UserButton appearance
- Add more protected routes

Your authentication is now production-ready! 🎉
