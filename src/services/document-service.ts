export interface Document {
    id: string;
    name: string;
    type: 'invoice' | 'receipt' | 'contract' | 'other';
    status: 'processing' | 'needs_review' | 'approved' | 'exported';
    amount?: number;
    date: string;
    vendor?: string;
    confidence?: number;
    fileUrl?: string;
}

export interface DocumentStats {
    totalProcessed: number;
    needsReview: number;
    approved: number;
    totalValue: number;
}

class DocumentService {
    private documents: Document[] = [
        {
            id: 'doc_1',
            name: 'Home Depot - Lumber',
            type: 'invoice',
            status: 'approved',
            amount: 1250.45,
            date: '2023-10-15',
            vendor: 'Home Depot',
            confidence: 0.98
        },
        {
            id: 'doc_2',
            name: 'Sunbelt Rentals - Excavator',
            type: 'invoice',
            status: 'needs_review',
            amount: 850.00,
            date: '2023-10-18',
            vendor: 'Sunbelt Rentals',
            confidence: 0.75
        },
        {
            id: 'doc_3',
            name: 'Sherwin Williams - Paint',
            type: 'receipt',
            status: 'processing',
            date: '2023-10-20',
            confidence: 0
        },
        {
            id: 'doc_4',
            name: 'Subcontractor Agreement',
            type: 'contract',
            status: 'approved',
            date: '2023-10-10',
            vendor: 'ABC Plumbing',
            confidence: 0.99
        }
    ];

    async getDocuments(): Promise<Document[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        return [...this.documents];
    }

    async getRecentDocuments(limit: number = 5): Promise<Document[]> {
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.documents.slice(0, limit);
    }

    async getStats(): Promise<DocumentStats> {
        await new Promise(resolve => setTimeout(resolve, 600));
        return {
            totalProcessed: 145,
            needsReview: 3,
            approved: 138,
            totalValue: 45250.00
        };
    }

    async uploadDocument(file: File): Promise<Document> {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newDoc: Document = {
            id: `doc_${Date.now()}`,
            name: file.name,
            type: 'invoice', // Default for now
            status: 'processing',
            date: new Date().toISOString().split('T')[0],
            confidence: 0
        };

        this.documents.unshift(newDoc);
        return newDoc;
    }

    async processDocument(id: string): Promise<Document> {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const docIndex = this.documents.findIndex(d => d.id === id);
        if (docIndex >= 0) {
            this.documents[docIndex] = {
                ...this.documents[docIndex],
                status: 'needs_review',
                amount: Math.floor(Math.random() * 1000) + 100,
                vendor: 'Detected Vendor',
                confidence: 0.85
            };
            return this.documents[docIndex];
        }
        throw new Error("Document not found");
    }
}

export const documentService = new DocumentService();
