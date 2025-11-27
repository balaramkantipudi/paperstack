import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { analyzeDocument } from './services/azure-service';
import { createCheckoutSession, getStripe } from './services/stripe-service';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
// Middleware
app.use(cors());

// Use JSON parser for all routes EXCEPT webhook
app.use((req, res, next) => {
    if (req.originalUrl === '/api/webhooks/stripe') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

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

        // 3. Update Supabase with extracted data AND Smart Title
        const smartTitle = `${analysis.vendor} - ${analysis.date}`;

        const { error: dbError } = await (getSupabase()
            .from('documents') as any)
            .update({
                status: 'needs_review', // Ready for Immediate Review
                amount: analysis.amount,
                date: analysis.date,
                vendor: analysis.vendor,
                name: smartTitle, // Smart Title Update
                confidence: analysis.confidence,
                category: 'Invoice' // Default, can be improved with classification
            })
            .eq('id', documentId);

        if (dbError) throw dbError;

        res.json({ success: true, data: analysis });

    } catch (error: any) {
        console.error('Processing Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Stripe Checkout Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { planName, billingCycle, successUrl, cancelUrl, userId } = req.body;

        if (!planName || !billingCycle || !successUrl || !cancelUrl || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Map plan names + billing cycle to Stripe Price IDs
        const priceIds: { [key: string]: { [cycle: string]: string } } = {
            'Starter': {
                'monthly': process.env.STRIPE_PRICE_STARTER_MONTHLY || 'price_1SY35UBuBqG91d3XC2ZDAywM',
                'yearly': process.env.STRIPE_PRICE_STARTER_YEARLY || 'price_1SY3vRBuBqG91d3XsnY9TqX6'
            },
            'Professional': {
                'monthly': process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_1SY35nBuBqG91d3XuYNbS4ln',
                'yearly': process.env.STRIPE_PRICE_PRO_YEARLY || 'price_1SY3v5BuBqG91d3XN89pHQUt'
            }
        };

        const priceId = priceIds[planName]?.[billingCycle];
        if (!priceId) {
            return res.status(400).json({ error: 'Invalid plan or billing cycle' });
        }

        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            client_reference_id: userId,
            metadata: { planName, billingCycle }
        });

        res.json({ sessionId: session.id, url: session.url });

    } catch (error: any) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Stripe Webhook Endpoint
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
        return res.status(400).send('Missing signature or webhook secret');
    }

    let event;

    try {
        event = getStripe().webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const userId = session.client_reference_id;
        const subscriptionId = session.subscription;
        const customerId = session.customer;
        const planName = session.metadata?.planName || 'Starter'; // Get plan from metadata

        if (userId) {
            console.log(`Processing subscription for user: ${userId}, plan: ${planName}`);
            // Update Supabase
            const { error } = await (getSupabase()
                .from('subscriptions') as any)
                .upsert({
                    clerk_user_id: userId,
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    status: 'active',
                    plan_name: planName,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'clerk_user_id' });

            if (error) {
                console.error('Supabase Update Error:', error);
            } else {
                console.log(`✅ Subscription created: ${planName} for user ${userId}`);
            }
        }
    }

    res.json({ received: true });
});

// Email Endpoints
import { sendVendorEmail, sendWeeklyTaxSummary } from './services/email-service';

app.post('/api/email/vendor', async (req, res) => {
    const { to, vendorName, message } = req.body;
    if (!to || !vendorName || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const success = await sendVendorEmail(to, vendorName, message);
    if (success) return res.json({ success: true });
    return res.status(500).json({ error: 'Failed to send email' });
});

app.post('/api/email/weekly-summary', async (req, res) => {
    const { to, savings, docCount } = req.body;
    const success = await sendWeeklyTaxSummary(to, savings, docCount);
    if (success) return res.json({ success: true });
    return res.status(500).json({ error: 'Failed to send email' });
});

// Start Server
app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
