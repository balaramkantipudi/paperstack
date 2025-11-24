import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

if (!stripeSecretKey) {
    console.warn("Stripe secret key missing");
}

const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-11-17.clover',
});

export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return { sessionId: session.id, url: session.url };
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        throw error;
    }
}
