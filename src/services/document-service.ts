export interface Document {
    id: string;
    name: string;
    type: 'Invoice' | 'Receipt' | 'Contract' | 'Permit' | 'Change Order';
    status: 'processing' | 'needs_review' | 'approved' | 'exported';
    amount: number;
    date: string;
    vendor: string;
    project: string;
    category?: string;
    confidence?: number;
    fileUrl?: string;
}

export interface DocumentStats {
    totalProcessed: number;
    needsReview: number;
    approved: number;
    totalValue: number;
    timeSaved: number; // in hours
}

export interface CategoryStat {
    name: string;
    count: number;
    color: string;
}

export interface VendorStat {
    name: string;
    amount: number;
    count: number;
}

import { supabase } from "../lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export interface VendorStat {
    name: string;
    amount: number;
    count: number;
}

class DocumentService {
    private client: SupabaseClient = supabase;

    setClient(client: SupabaseClient) {
        this.client = client;
    }

    // Keep mock data for seeding purposes
    private mockDocuments: Document[] = [
        // Recent Documents (Jan 2024)
        { id: '1', name: "BuildSupply Inc. Invoice", type: "Invoice", vendor: "BuildSupply Inc.", amount: 2450.00, date: "2024-01-15", status: "approved", project: "Downtown Office Tower" },
        { id: '2', name: "Hardware Store Receipt", type: "Receipt", vendor: "Hardware Store", amount: 156.75, date: "2024-01-14", status: "approved", project: "Westside Residential" },
        { id: '3', name: "Subcontractor Agreement", type: "Contract", vendor: "ABC Contractors", amount: 15000.00, date: "2024-01-13", status: "needs_review", project: "Harbor Bridge" },
        { id: '4', name: "City Building Permit", type: "Permit", vendor: "City Hall", amount: 850.00, date: "2024-01-12", status: "approved", project: "Downtown Office Tower" },
        { id: '5', name: "Material Change Order", type: "Change Order", vendor: "BuildSupply Inc.", amount: 3200.00, date: "2024-01-11", status: "approved", project: "City Center Mall" },
        { id: '6', name: "Equipment Rental Invoice", type: "Invoice", vendor: "Equipment Rentals Co.", amount: 1200.00, date: "2024-01-10", status: "approved", project: "Westside Residential" },
        { id: '7', name: "Lumber Receipt", type: "Receipt", vendor: "Lumber Yard", amount: 4500.00, date: "2024-01-09", status: "approved", project: "Harbor Bridge" },
        { id: '8', name: "Insurance Certificate", type: "Contract", vendor: "Insurance Co.", amount: 2400.00, date: "2024-01-08", status: "approved", project: "Downtown Office Tower" },
        // Older Documents (Dec 2023)
        { id: '9', name: "Concrete Pour Invoice", type: "Invoice", vendor: "Metro Concrete", amount: 8500.00, date: "2023-12-28", status: "exported", project: "Downtown Office Tower" },
        { id: '10', name: "Electrical Wiring Receipt", type: "Receipt", vendor: "City Electric Supply", amount: 1250.00, date: "2023-12-27", status: "exported", project: "Westside Residential" },
        { id: '11', name: "Plumbing Services", type: "Invoice", vendor: "PlumbPro Services", amount: 3400.00, date: "2023-12-25", status: "exported", project: "City Center Mall" },
        { id: '12', name: "Crane Rental", type: "Invoice", vendor: "ConstructEquip Rentals", amount: 5600.00, date: "2023-12-22", status: "exported", project: "Harbor Bridge" },
        { id: '13', name: "Steel Beams Order", type: "Invoice", vendor: "BuildSupply Inc.", amount: 12000.00, date: "2023-12-20", status: "exported", project: "Downtown Office Tower" },
        { id: '14', name: "Safety Equipment", type: "Receipt", vendor: "Hardware Store", amount: 450.00, date: "2023-12-18", status: "exported", project: "Westside Residential" },
        { id: '15', name: "Labor Contract - Team A", type: "Contract", vendor: "ABC Contractors", amount: 25000.00, date: "2023-12-15", status: "exported", project: "City Center Mall" },
        // More Historical Data
        { id: '16', name: "Foundation Permit", type: "Permit", vendor: "City Hall", amount: 1200.00, date: "2023-11-30", status: "exported", project: "Westside Residential" },
        { id: '17', name: "Excavation Services", type: "Invoice", vendor: "Metro Concrete", amount: 15000.00, date: "2023-11-25", status: "exported", project: "Harbor Bridge" },
        { id: '18', name: "Roofing Materials", type: "Invoice", vendor: "BuildSupply Inc.", amount: 8900.00, date: "2023-11-20", status: "exported", project: "Downtown Office Tower" },
        { id: '19', name: "Electrical Fixtures", type: "Receipt", vendor: "City Electric Supply", amount: 3200.00, date: "2023-11-15", status: "exported", project: "City Center Mall" },
        { id: '20', name: "HVAC Installation", type: "Invoice", vendor: "PlumbPro Services", amount: 18000.00, date: "2023-11-10", status: "exported", project: "Westside Residential" },
        { id: '21', name: "Paint Supplies", type: "Receipt", vendor: "Hardware Store", amount: 850.00, date: "2023-11-05", status: "exported", project: "Downtown Office Tower" },
        { id: '22', name: "Change Order #1", type: "Change Order", vendor: "ABC Contractors", amount: 4500.00, date: "2023-11-01", status: "exported", project: "Harbor Bridge" },
        { id: '23', name: "Generator Rental", type: "Invoice", vendor: "ConstructEquip Rentals", amount: 1500.00, date: "2023-10-28", status: "exported", project: "City Center Mall" },
        { id: '24', name: "Insulation", type: "Invoice", vendor: "BuildSupply Inc.", amount: 5600.00, date: "2023-10-25", status: "exported", project: "Westside Residential" },
        { id: '25', name: "Flooring Contract", type: "Contract", vendor: "ABC Contractors", amount: 22000.00, date: "2023-10-20", status: "exported", project: "Downtown Office Tower" }
    ];

    async seedData(userId: string) {
        console.log("Starting seed for user:", userId);

        // 1. Seed Vendors
        const uniqueVendors = Array.from(new Set(this.mockDocuments.map(d => d.vendor)));
        for (const vendorName of uniqueVendors) {
            const { error } = await this.client.from('vendors').insert({
                clerk_user_id: userId,
                name: vendorName,
                category: 'Supplier',
                status: 'active'
            });
            if (error) {
                console.error("Error seeding vendor:", vendorName, error);
            } else {
                console.log("Seeded vendor:", vendorName);
            }
        }

        // 2. Seed Projects
        const uniqueProjects = Array.from(new Set(this.mockDocuments.map(d => d.project)));
        for (const projectName of uniqueProjects) {
            const { error } = await this.client.from('projects').insert({
                clerk_user_id: userId,
                name: projectName,
                status: 'active',
                budget: 100000
            });
            if (error) {
                console.error("Error seeding project:", projectName, error);
            } else {
                console.log("Seeded project:", projectName);
            }
        }

        // 3. Seed Documents
        // Wait a bit for triggers/propagation if any (though await insert should be enough)
        await new Promise(resolve => setTimeout(resolve, 1000));

        const { data: vendors } = await this.client.from('vendors').select('id, name').eq('clerk_user_id', userId);
        const { data: projects } = await this.client.from('projects').select('id, name').eq('clerk_user_id', userId);

        console.log("Fetched vendors for linking:", vendors?.length);
        console.log("Fetched projects for linking:", projects?.length);

        if (!vendors || !projects) {
            console.error("Failed to fetch vendors or projects for linking");
            return;
        }

        for (const doc of this.mockDocuments) {
            const vendorId = vendors.find(v => v.name === doc.vendor)?.id;
            const projectId = projects.find(p => p.name === doc.project)?.id;

            if (vendorId && projectId) {
                const { error } = await this.client.from('documents').insert({
                    clerk_user_id: userId,
                    name: doc.name,
                    type: doc.type,
                    status: doc.status,
                    amount: doc.amount,
                    date: doc.date,
                    vendor_id: vendorId,
                    project_id: projectId
                });
                if (error) console.error("Error seeding document:", doc.name, error);
            } else {
                console.warn("Skipping document due to missing vendor/project link:", doc.name);
            }
        }
        console.log("Seeding complete!");
    }

    async getDocuments(): Promise<Document[]> {
        const { data, error } = await this.client
            .from('documents')
            .select(`
                *,
                vendors (name),
                projects (name)
            `)
            .order('date', { ascending: false });

        if (error) {
            console.error("Error fetching documents:", error);
            return [];
        }

        // Map Supabase result to Document interface
        return data.map((d: any) => ({
            id: d.id,
            name: d.name,
            type: d.type,
            status: d.status,
            amount: d.amount,
            date: d.date,
            vendor: d.vendors?.name || 'Unknown',
            project: d.projects?.name || 'Unknown',
            fileUrl: d.file_url
        }));
    }

    async getRecentDocuments(limit: number = 5): Promise<Document[]> {
        const docs = await this.getDocuments();
        return docs.slice(0, limit);
    }

    async getStats(): Promise<DocumentStats> {
        const docs = await this.getDocuments();

        const totalProcessed = docs.length;
        const needsReview = docs.filter(d => d.status === 'needs_review' || d.status === 'processing').length;
        const approved = docs.filter(d => d.status === 'approved' || d.status === 'exported').length;
        const totalValue = docs.reduce((sum, doc) => sum + (doc.amount || 0), 0);
        const timeSaved = Math.round(totalProcessed * 0.25 * 0.90);

        return {
            totalProcessed,
            needsReview,
            approved,
            totalValue,
            timeSaved
        };
    }
    async getCategoryStats(): Promise<CategoryStat[]> {
        const docs = await this.getDocuments();

        const categories = [
            { name: "Invoice", color: "primary" },
            { name: "Receipt", color: "secondary" },
            { name: "Contract", color: "success" },
            { name: "Permit", color: "warning" },
            { name: "Change Order", color: "danger" }
        ];

        return categories.map(cat => ({
            name: cat.name + "s", // Pluralize for display
            count: docs.filter(d => d.type === cat.name).length,
            color: cat.color
        }));
    }

    async getTopVendors(limit: number = 5): Promise<VendorStat[]> {
        const docs = await this.getDocuments();

        const vendorMap = new Map<string, { amount: number, count: number }>();

        docs.forEach(doc => {
            if (!doc.vendor) return;
            const current = vendorMap.get(doc.vendor) || { amount: 0, count: 0 };
            vendorMap.set(doc.vendor, {
                amount: current.amount + (doc.amount || 0),
                count: current.count + 1
            });
        });

        return Array.from(vendorMap.entries())
            .map(([name, stats]) => ({
                name,
                amount: stats.amount,
                count: stats.count
            }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, limit);
    }

    async getVendors(): Promise<any[]> {
        const { data, error } = await this.client.from('vendors').select('*');
        if (error) {
            console.error("Error fetching vendors:", error);
            return [];
        }

        // We need to calculate spent and invoices count from documents
        const docs = await this.getDocuments();

        return data.map((v: any) => {
            const vendorDocs = docs.filter(d => d.vendor === v.name);
            const spent = vendorDocs.reduce((sum, d) => sum + (d.amount || 0), 0);
            const invoices = vendorDocs.length;

            return {
                id: v.id,
                name: v.name,
                category: v.category,
                contact: 'Pending', // Placeholder as we don't have this in simple schema yet
                email: 'pending@example.com', // Placeholder
                spent,
                invoices,
                status: v.status
            };
        });
    }

    async getProjects(): Promise<any[]> {
        const { data, error } = await this.client.from('projects').select('*');
        if (error) {
            console.error("Error fetching projects:", error);
            return [];
        }

        const docs = await this.getDocuments();

        return data.map((p: any) => {
            const projectDocs = docs.filter(d => d.project === p.name);
            const spent = projectDocs.reduce((sum, d) => sum + (d.amount || 0), 0);

            return {
                id: p.id,
                name: p.name,
                client: 'Internal', // Placeholder
                budget: p.budget,
                spent,
                status: p.status,
                progress: Math.min(Math.round((spent / p.budget) * 100), 100),
                startDate: p.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                endDate: "",
                documents: projectDocs.length,
                expenses: [] // Placeholder
            };
        });
    }

    async getNotifications(): Promise<any[]> {
        // Return empty array by default until we have a real notifications table
        // or logic to derive them from document status changes
        return [];
    }

    async uploadDocument(file: File, userId: string): Promise<Document> {
        // For MVP, we'll just insert a placeholder record
        // In production, this would upload to Storage bucket first

        if (!userId) throw new Error("User ID is required for upload");

        const newDoc = {
            clerk_user_id: userId,
            name: file.name,
            type: 'Invoice',
            status: 'processing',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            // We need to link to a vendor/project. For now, we'll leave them null or use a default if exists.
        };

        const { data, error } = await this.client.from('documents').insert(newDoc).select().single();

        if (error) throw error;

        return {
            id: data.id,
            name: data.name,
            type: data.type,
            status: data.status,
            amount: data.amount,
            date: data.date,
            vendor: 'Pending',
            project: 'Unassigned',
            fileUrl: data.file_url
        };
    }
}

export const documentService = new DocumentService();

