export interface Plan {
    id: string;
    name: string;
    price: number;
    interval: 'month' | 'year';
    features: string[];
    isPopular?: boolean;
}

export interface Subscription {
    planId: string;
    status: 'active' | 'trialing' | 'canceled' | 'past_due';
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
}

class SubscriptionService {
    private currentSubscription: Subscription = {
        planId: 'starter',
        status: 'trialing',
        currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
        cancelAtPeriodEnd: false
    };

    private plans: Plan[] = [
        {
            id: 'starter',
            name: 'Starter',
            price: 49,
            interval: 'month',
            features: [
                "Process up to 100 documents/month",
                "Basic data extraction",
                "Email support",
                "1 user license"
            ]
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 149,
            interval: 'month',
            isPopular: true,
            features: [
                "Process up to 500 documents/month",
                "Advanced data extraction & insights",
                "Priority support",
                "5 user licenses",
                "API access"
            ]
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 0, // Custom
            interval: 'month',
            features: [
                "Unlimited documents",
                "Custom AI training",
                "Dedicated account manager",
                "SSO & advanced security",
                "Custom integrations"
            ]
        }
    ];

    async getPlans(): Promise<Plan[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...this.plans];
    }

    async getCurrentSubscription(): Promise<Subscription> {
        await new Promise(resolve => setTimeout(resolve, 600));
        return { ...this.currentSubscription };
    }

    async upgradeSubscription(planId: string): Promise<Subscription> {
        // Simulate Stripe checkout flow delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        this.currentSubscription = {
            ...this.currentSubscription,
            planId,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        };

        return this.currentSubscription;
    }

    async cancelSubscription(): Promise<Subscription> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        this.currentSubscription = {
            ...this.currentSubscription,
            cancelAtPeriodEnd: true
        };

        return this.currentSubscription;
    }
}

export const subscriptionService = new SubscriptionService();
