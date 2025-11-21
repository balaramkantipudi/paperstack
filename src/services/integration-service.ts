export interface Integration {
    id: string;
    name: string;
    icon: string;
    status: 'connected' | 'disconnected' | 'error';
    lastSync?: string;
    description: string;
    company?: string;
    user?: string;
}

class IntegrationService {
    private integrations: Integration[] = [
        {
            id: 'quickbooks',
            name: 'QuickBooks Online',
            icon: 'simple-icons:quickbooks',
            status: 'disconnected',
            description: 'Sync invoices and expenses directly to QuickBooks.'
        },
        {
            id: 'xero',
            name: 'Xero',
            icon: 'simple-icons:xero',
            status: 'disconnected',
            description: 'Seamlessly export data to your Xero account.'
        },
        {
            id: 'sage',
            name: 'Sage Intacct',
            icon: 'simple-icons:sage',
            status: 'disconnected',
            description: 'Enterprise-grade integration for Sage Intacct.'
        },
        {
            id: 'procore',
            name: 'Procore',
            icon: 'simple-icons:procore',
            status: 'disconnected',
            description: 'Connect documents to Procore projects and commitments.'
        }
    ];

    async getIntegrations(): Promise<Integration[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...this.integrations];
    }

    async connect(id: string): Promise<Integration> {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const index = this.integrations.findIndex(i => i.id === id);
        if (index >= 0) {
            this.integrations[index] = {
                ...this.integrations[index],
                status: 'connected',
                lastSync: new Date().toISOString()
            };
            return this.integrations[index];
        }
        throw new Error("Integration not found");
    }

    async disconnect(id: string): Promise<Integration> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const index = this.integrations.findIndex(i => i.id === id);
        if (index >= 0) {
            this.integrations[index] = {
                ...this.integrations[index],
                status: 'disconnected',
                lastSync: undefined
            };
            return this.integrations[index];
        }
        throw new Error("Integration not found");
    }

    async sync(id: string): Promise<Integration> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const index = this.integrations.findIndex(i => i.id === id);
        if (index >= 0) {
            if (this.integrations[index].status !== 'connected') {
                throw new Error("Integration not connected");
            }

            this.integrations[index] = {
                ...this.integrations[index],
                lastSync: new Date().toISOString()
            };
            return this.integrations[index];
        }
        throw new Error("Integration not found");
    }

    // Alias methods for compatibility
    async connectIntegration(id: string): Promise<Integration> {
        return this.connect(id);
    }

    async disconnectIntegration(id: string): Promise<Integration> {
        return this.disconnect(id);
    }

    async syncNow(id: string): Promise<Integration> {
        return this.sync(id);
    }
}

export const integrationService = new IntegrationService();
