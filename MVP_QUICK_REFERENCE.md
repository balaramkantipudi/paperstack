# MVP Quick Reference Card

## 🎯 Goal
Build a working demo in 2 weeks to show a property owner

## 📅 Timeline Overview

```
Week 1: Core Functionality
├─ Day 0: Setup accounts (Azure, Supabase, Clerk, Vercel)
├─ Day 1: Database setup with tables
├─ Day 2: Azure OCR working
├─ Day 3: Clerk authentication
├─ Day 4: Backend API created
└─ Day 5: Full pipeline: Upload → OCR → Database ✅

Week 2: Integration & Polish
├─ Day 6: Frontend ↔ Backend connected
├─ Day 7: Real data in dashboard
├─ Day 8: Deploy to production (live!)
├─ Day 9: Polish for demo
└─ Day 10: QuickBooks sync (optional)
```

## ✅ Daily Checkpoints

### Day 1: Database
- [ ] Supabase project created
- [ ] Tables created (documents, vendors, projects)
- [ ] Sample data inserted
- [ ] Can query: `SELECT * FROM projects;`

### Day 2: OCR
- [ ] Azure Document Intelligence resource created
- [ ] API keys obtained
- [ ] Test script extracts invoice data
- [ ] See vendor name, amount, line items in console

### Day 3: Auth
- [ ] Clerk application created
- [ ] Sign-in button works in app
- [ ] Can log in with email
- [ ] UserButton shows in header

### Day 4: Backend
- [ ] Express server running on :3001
- [ ] `/health` endpoint returns "ok"
- [ ] File upload endpoint accepts files
- [ ] Can upload via curl

### Day 5: Processing
- [ ] Upload triggers OCR
- [ ] Extracted data saved to database
- [ ] Can see document in Supabase
- [ ] Response includes vendor, amount, items

### Day 6: Frontend Integration
- [ ] Frontend calls real API
- [ ] Upload button triggers backend
- [ ] See success message with extracted data
- [ ] No more mock data

### Day 7: Real Dashboard
- [ ] Dashboard loads documents from database
- [ ] Stats show real numbers
- [ ] Charts display actual data
- [ ] Search works on real documents

### Day 8: Deployment
- [ ] Frontend live on Vercel
- [ ] Backend live on Railway
- [ ] Can access app from phone
- [ ] Upload works on production

### Day 9: Demo Ready
- [ ] 5-10 sample documents uploaded
- [ ] Demo script practiced 3x
- [ ] Loading states look good
- [ ] Can complete demo in under 5 min

### Day 10: QuickBooks (Optional)
- [ ] QuickBooks app created
- [ ] OAuth flow working
- [ ] Can sync one invoice
- [ ] Shows in QuickBooks

## 🎬 3-Minute Demo Flow

```
1. Opening (30s)
   "Let me show you how Paperstack saves hours on paperwork"

2. Show Dashboard (30s)
   → Point out existing documents, totals, categories

3. Upload Invoice (1m)
   → Drag and drop PDF
   → Watch AI extract data
   → Show results: vendor, amount, line items

4. Show Insights (1m)
   → Financial dashboard
   → Spending by category
   → Project budget tracking

5. QuickBooks Sync (30s) [Optional]
   → Click sync button
   → "Done. No manual entry needed"

6. Close (30s)
   → "This handles all invoices automatically"
   → "Interested in trying it?"
```

## 🔑 Environment Variables Needed

```env
# Frontend (.env)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001

# Backend (.env)
AZURE_ENDPOINT=https://....cognitiveservices.azure.com/
AZURE_KEY=...
SUPABASE_URL=https://....supabase.co
SUPABASE_KEY=eyJ...
PORT=3001
```

## 📦 What Gets Built

```
Paperstack MVP
├── Frontend (Vercel)
│   ├── Landing page
│   ├── Dashboard with real data
│   ├── Document upload
│   └── Clerk authentication
│
├── Backend (Railway)
│   ├── POST /api/documents/upload
│   ├── GET /api/documents
│   ├── GET /api/documents/stats
│   └── Azure AI integration
│
└── Database (Supabase)
    ├── documents table
    ├── vendors table
    └── projects table
```

## 💰 Costs (Free Tier)

- Azure: $200 credit (500 pages/month free)
- Supabase: Free (500MB database)
- Clerk: Free (10,000 users)
- Vercel: Free (hobby tier)
- Railway: $5/month (includes $5 credit)

**Total: $0-5/month for MVP**

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| OCR fails | Check Azure credits, verify endpoint |
| Upload fails | Enable CORS, check file size < 10MB |
| Database error | Verify Supabase URL/key, check tables exist |
| Deploy fails | Check environment variables, view logs |
| Auth not working | Verify Clerk keys, check publishable key |

## 📞 Support Resources

- Azure AI: https://learn.microsoft.com/azure/ai-services/document-intelligence/
- Supabase: https://supabase.com/docs
- Clerk: https://clerk.com/docs
- Vercel: https://vercel.com/docs

## 🎯 Success Criteria

After 2 weeks, you should have:
- ✅ Live app on the internet
- ✅ Real document upload working
- ✅ AI extraction 90%+ accurate
- ✅ Data in database
- ✅ Smooth 3-minute demo
- ✅ Ready to show property owner

## 📈 Next Steps After Demo

If they're interested:
1. **Week 3**: Add batch upload, email forwarding
2. **Week 4**: Production hardening, tests
3. **Week 5**: Beta with 3-5 users
4. **Week 6**: Launch with payments

---

**Start with Day 0 in MVP_IMPLEMENTATION_GUIDE.md**
