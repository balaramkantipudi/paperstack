import { supabaseAdmin } from './supabase'

export interface ExtractedData {
  vendor_name?: string;
  vendor_address?: string;
  vendor_phone?: string;
  vendor_email?: string;
  [key: string]: unknown;
}

export interface VendorMatchResult {
  vendor_id: string | null;
  vendor_name: string;
  confidence: number;
  match_type: 'exact' | 'fuzzy' | 'new';
  suggested_info: {
    phone?: string;
    address?: string;
    email?: string;
  };
}

interface Vendor {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  [key: string]: unknown;
}

export class VendorRecognitionEngine {
  private static commonConstructionVendors = [
    'Home Depot', 'Lowe\'s', 'Ferguson', 'Grainger', 'Fastenal',
    'United Rentals', 'Sunbelt Rentals', '84 Lumber', 'Sherwin-Williams',
    'McMaster-Carr', 'W.W. Grainger', 'HD Supply', 'Menards'
  ];

  static async recognizeVendor(
    organizationId: string,
    extractedVendorName: string,
    extractedData: ExtractedData
  ): Promise<VendorMatchResult> {

    if (!extractedVendorName) {
      return {
        vendor_id: null,
        vendor_name: 'Unknown Vendor',
        confidence: 0,
        match_type: 'new',
        suggested_info: {}
      };
    }

    // 1. Exact match check
    const { data: exactMatch } = await (supabaseAdmin as any)
      .from('vendors')
      .select('id, name, phone, email, address')
      .eq('organization_id', organizationId)
      .ilike('name', extractedVendorName)
      .single();

    if (exactMatch) {
      return {
        vendor_id: exactMatch.id,
        vendor_name: exactMatch.name,
        confidence: 1.0,
        match_type: 'exact',
        suggested_info: {
          phone: exactMatch.phone,
          email: exactMatch.email,
          address: extractedData.vendor_address
        }
      };
    }

    // 2. Fuzzy match check
    const { data: allVendors } = await (supabaseAdmin as any)
      .from('vendors')
      .select('id, name, phone, email, address')
      .eq('organization_id', organizationId);

    if (allVendors) {
      for (const vendor of allVendors) {
        const similarity = this.calculateStringSimilarity(
          extractedVendorName.toLowerCase(),
          vendor.name.toLowerCase()
        );

        if (similarity > 0.8) {
          return {
            vendor_id: vendor.id,
            vendor_name: vendor.name,
            confidence: similarity,
            match_type: 'fuzzy',
            suggested_info: {
              phone: vendor.phone,
              email: vendor.email,
              address: extractedData.vendor_address
            }
          };
        }
      }
    }

    // 3. Check against common construction vendors
    const commonMatch = this.commonConstructionVendors.find(common =>
      extractedVendorName.toLowerCase().includes(common.toLowerCase()) ||
      common.toLowerCase().includes(extractedVendorName.toLowerCase())
    );

    return {
      vendor_id: null,
      vendor_name: commonMatch || extractedVendorName,
      confidence: commonMatch ? 0.9 : 0.7,
      match_type: 'new',
      suggested_info: {
        address: extractedData.vendor_address,
        phone: extractedData.vendor_phone
      }
    };
  }

  private static calculateStringSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;

    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  static async createVendorFromExtraction(
    organizationId: string,
    createdBy: string,
    vendorMatch: VendorMatchResult,
    extractedData: ExtractedData
  ): Promise<string | null> {
    try {
      const { data: newVendor, error } = await (supabaseAdmin as any)
        .from('vendors')
        .insert({
          organization_id: organizationId,
          name: vendorMatch.vendor_name,
          phone: vendorMatch.suggested_info.phone,
          email: vendorMatch.suggested_info.email,
          address: vendorMatch.suggested_info.address,
          created_by: createdBy,
          notes: `Auto-created from document processing (confidence: ${(vendorMatch.confidence * 100).toFixed(1)}%)`
        })
        .select('id')
        .single();

      if (error) {
        console.error('Failed to create vendor:', error);
        return null;
      }

      return newVendor.id;
    } catch (error) {
      console.error('Vendor creation error:', error);
      return null;
    }
  }
}
