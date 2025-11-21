import OpenAI from 'openai';
import { ExtractedDocumentData } from './azure-document-intelligence';
import { CONSTRUCTION_CATEGORIES, getCategoryByVendor } from './construction-categories';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
if (!openaiApiKey) {
    throw new Error('Missing OpenAI API key. Please set VITE_OPENAI_API_KEY in your .env.local');
}

const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true // Allowing browser usage for client-side demo
});

export interface LineItemCategory {
    description: string;
    suggested_category: string;
    confidence: number;
    tax_deductible: boolean;
}

export interface EnhancedClassificationResult {
    suggested_category: string;
    confidence: number;
    tax_deductible: boolean;
    project_suggestions: string[];
    vendor_type: 'supplier' | 'contractor' | 'service' | 'government' | 'other';
    line_item_categories: LineItemCategory[];
    potential_tax_savings: number;
    business_expense_type: 'direct' | 'indirect' | 'administrative';
}

export interface ProjectAllocation {
    project_id: string;
    confidence: number;
    reasoning: string;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
}

export async function enhancedConstructionClassification(
    extractedData: ExtractedDocumentData
): Promise<EnhancedClassificationResult> {
    try {
        // First, try simple vendor-based classification
        const vendorCategory = extractedData.vendor_name ?
            getCategoryByVendor(extractedData.vendor_name) : null;

        // Create detailed prompt for OpenAI
        const prompt = `
As a construction accounting expert, analyze this invoice/receipt and provide detailed categorization:

DOCUMENT DETAILS:
Vendor: ${extractedData.vendor_name || 'Unknown'}
Total Amount: $${extractedData.total_amount || 0}
Date: ${extractedData.document_date || 'Unknown'}

LINE ITEMS:
${extractedData.line_items.map((item, index) =>
            `${index + 1}. ${item.description || 'No description'} - Qty: ${item.quantity || 1} - Unit: $${item.unit_price || 0} - Total: $${item.amount || 0}`
        ).join('\n')}

CONSTRUCTION CATEGORIES AVAILABLE:
${Object.entries(CONSTRUCTION_CATEGORIES).map(([category, details]) =>
            `- ${category}: ${details.description}`
        ).join('\n')}

ANALYSIS REQUIRED:
1. Categorize the overall document
2. Categorize each line item individually
3. Determine if this is a direct job cost, indirect cost, or administrative expense
4. Calculate potential tax savings (assume 25% tax rate for deductible expenses)
5. Suggest what type of construction projects this might relate to

Provide response in JSON format:
{
  "suggested_category": "primary category name",
  "confidence": 0.0-1.0,
  "tax_deductible": true/false,
  "project_suggestions": ["project type 1", "project type 2"],
  "vendor_type": "supplier/contractor/service/government/other",
  "line_item_categories": [
    {
      "description": "item description",
      "suggested_category": "category name",
      "confidence": 0.0-1.0,
      "tax_deductible": true/false
    }
  ],
  "potential_tax_savings": 0.00,
  "business_expense_type": "direct/indirect/administrative"
}
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a construction accounting expert with deep knowledge of IRS tax code for construction businesses. Always respond with valid JSON only. Be precise with categorization."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_tokens: 1000
        });

        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error('No response from OpenAI');
        }

        const result = JSON.parse(content) as EnhancedClassificationResult;

        // Validate and enhance result
        return {
            ...result,
            suggested_category: vendorCategory || result.suggested_category,
            confidence: Math.min(result.confidence + 0.1, 1.0), // Boost confidence if vendor matched
        };

    } catch (error) {
        console.error('Enhanced OpenAI classification error:', error);
        // Intelligent fallback based on vendor and amount
        const fallbackCategory = extractedData.vendor_name ?
            getCategoryByVendor(extractedData.vendor_name) : 'Office Expenses';
        const estimatedTaxSavings = (extractedData.total_amount || 0) * 0.25;
        return {
            suggested_category: fallbackCategory,
            confidence: 0.6,
            tax_deductible: true,
            project_suggestions: ['General Construction', 'Maintenance'],
            vendor_type: 'supplier',
            line_item_categories: extractedData.line_items.map(item => ({
                description: item.description || 'Unknown item',
                suggested_category: fallbackCategory,
                confidence: 0.6,
                tax_deductible: true
            })),
            potential_tax_savings: estimatedTaxSavings,
            business_expense_type: 'direct'
        };
    }
}

export async function suggestProjectAllocation(
    documentData: ExtractedDocumentData,
    organizationProjects: Project[]
): Promise<ProjectAllocation[]> {
    if (organizationProjects.length === 0) {
        return [];
    }
    try {
        const prompt = `
Given this construction document, suggest which projects it might belong to:

DOCUMENT:
Vendor: ${documentData.vendor_name}
Amount: $${documentData.total_amount}
Items: ${documentData.line_items.map(item => item.description).join(', ')}

AVAILABLE PROJECTS:
${organizationProjects.map(project =>
            `${project.id}: ${project.name} - ${project.description || 'No description'}`
        ).join('\n')}

Suggest up to 3 most likely projects with confidence scores and reasoning.
Respond in JSON format:
[
  {
    "project_id": "project_uuid",
    "confidence": 0.0-1.0,
    "reasoning": "why this project matches"
  }
]
`;
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are a construction project manager. Analyze documents and match them to appropriate projects based on context clues."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 500
        });
        const content = response.choices[0].message.content;
        if (!content) return [];
        return JSON.parse(content) as ProjectAllocation[];
    } catch (error) {
        console.error('Project allocation suggestion error:', error);
        return [];
    }
}
