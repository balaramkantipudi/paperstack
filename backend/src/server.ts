import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { analyzeDocument } from './services/azure-service';
import { createCheckoutSession } from './services/stripe-service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
// Initialize Supabase Lazily
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
    if (supabaseInstance) return supabaseInstance;

    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Supabase credentials missing. Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.");
    }

    supabaseInstance = createClient(supabaseUrl, supabaseServiceKey);
    return supabaseInstance;
}

// Health Check
app.get('/', (req, res) => {
    res.send('Paperstack Backend is Running!');
});

// Document Processing Endpoint
app.post('/api/process-document', async (req, res) => {
    try {
        const { fileUrl, userId, documentId } = req.body;

        if (!fileUrl || !userId || !documentId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Analyze with Azure
        const analysis = await analyzeDocument(fileUrl);

        // 2. Update Supabase
        const { error } = await getSupabase()
            .from('documents')
            .update({
                vendor: analysis.vendor,
                amount: analysis.amount,
                date: analysis.date,
                status: 'needs_review', // Update status to indicate processing is done
                // Store line items if you have a separate table, otherwise store in a JSON column
                // line_items: analysis.items 
            })
            .eq('id', documentId);

        if (error) throw error;

        res.json({ success: true, data: analysis });

    } catch (error: any) {
        console.error('Processing Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Stripe Checkout Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { priceId, successUrl, cancelUrl } = req.body;

        if (!priceId || !successUrl || !cancelUrl) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const session = await createCheckoutSession(priceId, successUrl, cancelUrl);
        res.json(session);

    } catch (error: any) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
