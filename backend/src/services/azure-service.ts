import { AzureKeyCredential, DocumentAnalysisClient } from "@azure/ai-form-recognizer";

const endpoint = process.env.AZURE_DOCUMENT_ENDPOINT || "";
const key = process.env.AZURE_DOCUMENT_KEY || "";

if (!endpoint || !key) {
    console.warn("Azure Document Intelligence credentials missing");
}

const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

export async function analyzeDocument(fileUrl: string) {
    try {
        console.log(`Analyzing document from URL: ${fileUrl}`);
        const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-invoice", fileUrl);
        const { documents } = await poller.pollUntilDone();

        if (!documents || documents.length === 0) {
            throw new Error("No documents found in analysis result");
        }

        const doc = documents[0];
        const fields = doc.fields;

        return {
            vendor: fields.VendorName?.content || "Unknown Vendor",
            date: (fields.InvoiceDate as any)?.value ? new Date((fields.InvoiceDate as any).value).toISOString() : new Date().toISOString(),
            amount: (fields.InvoiceTotal as any)?.value || 0,
            id: fields.InvoiceId?.content || "",
            items: ((fields.Items as any)?.values || []).map((item: any) => ({
                description: (item.properties.Description as any)?.content || "Item",
                quantity: (item.properties.Quantity as any)?.value || 1,
                unitPrice: (item.properties.UnitPrice as any)?.value || 0,
                amount: (item.properties.Amount as any)?.value || 0
            }))
        };
    } catch (error) {
        console.error("Azure Analysis Error:", error);
        throw error;
    }
}
