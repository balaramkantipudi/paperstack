
import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
    if (stripe) return stripe;

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
        throw new Error("Stripe secret key missing. Please check STRIPE_SECRET_KEY environment variable.");
    }

    stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2025-11-17.clover',
    });
    return stripe;
}

export async function createCheckoutSession(priceId: string, successUrl: string, cancelUrl: string) {
    try {
        const session = await getStripe().checkout.sessions.create({
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
