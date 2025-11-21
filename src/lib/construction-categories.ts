export interface CategoryDetails {
  description: string;
  subcategories: string[];
  tax_deductible: boolean;
  common_vendors: string[];
}

export interface ConstructionCategories {
  [key: string]: CategoryDetails;
}

export const CONSTRUCTION_CATEGORIES: ConstructionCategories = {
  'Materials': {
    description: 'Building materials and supplies',
    subcategories: ['Lumber', 'Concrete', 'Steel', 'Electrical Materials', 'Plumbing Materials', 'Roofing Materials'],
    tax_deductible: true,
    common_vendors: ['Home Depot', 'Lowe\'s', '84 Lumber', 'Ferguson']
  },
  'Labor': {
    description: 'Direct labor costs',
    subcategories: ['Hourly Labor', 'Contract Labor', 'Overtime'],
    tax_deductible: true,
    common_vendors: []
  },
  'Subcontractors': {
    description: 'Specialized trade work',
    subcategories: ['Electrical', 'Plumbing', 'HVAC', 'Roofing', 'Flooring'],
    tax_deductible: true,
    common_vendors: []
  },
  'Equipment Rental': {
    description: 'Heavy machinery and equipment rental',
    subcategories: ['Excavators', 'Cranes', 'Scaffolding', 'Generators'],
    tax_deductible: true,
    common_vendors: ['United Rentals', 'Sunbelt Rentals']
  },
  'Tools': {
    description: 'Hand tools and power tools',
    subcategories: ['Hand Tools', 'Power Tools', 'Safety Equipment'],
    tax_deductible: true,
    common_vendors: ['Home Depot', 'Grainger', 'Fastenal']
  },
  'Permits & Licenses': {
    description: 'Government permits and fees',
    subcategories: ['Building Permits', 'Trade Licenses', 'Inspection Fees'],
    tax_deductible: true,
    common_vendors: []
  },
  'Insurance': {
    description: 'Business and project insurance',
    subcategories: ['General Liability', 'Workers Comp', 'Project Insurance'],
    tax_deductible: true,
    common_vendors: []
  },
  'Office Expenses': {
    description: 'Administrative and office expenses',
    subcategories: ['Office Supplies', 'Software', 'Communications'],
    tax_deductible: true,
    common_vendors: []
  },
  'Utilities': {
    description: 'Job site utilities',
    subcategories: ['Electricity', 'Water', 'Gas', 'Internet'],
    tax_deductible: true,
    common_vendors: []
  },
  'Transportation': {
    description: 'Vehicle and transportation expenses',
    subcategories: ['Fuel', 'Vehicle Maintenance', 'Truck Rentals'],
    tax_deductible: true,
    common_vendors: []
  }
};

export function getCategoryByVendor(vendorName: string): string {
  const vendor = vendorName.toLowerCase();
  
  if (vendor.includes('home depot') || vendor.includes('lowes') || vendor.includes('84 lumber')) {
    return 'Materials';
  }
  if (vendor.includes('united rentals') || vendor.includes('sunbelt')) {
    return 'Equipment Rental';
  }
  if (vendor.includes('grainger') || vendor.includes('fastenal')) {
    return 'Tools';
  }
  if (vendor.includes('ferguson')) {
    return 'Materials';
  }
  
  return 'Office Expenses'; // Default category
}
