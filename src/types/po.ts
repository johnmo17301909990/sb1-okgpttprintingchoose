export interface FoilMapping {
  companyCode: string;
  supplierCodes: Array<{
    code: string;
    series: string;
    category: string;
    usage: string;
    mainApplication: string;
    suitableSize: string;
    tension: string;
    uvCompatible: boolean;
    color: string;
  }>;
}

export interface FoilCriteria {
  foilArea: 'small' | 'medium' | 'large';
  foilPattern: 'fine' | 'halftone' | 'normal' | 'textured';
  surfaceTreatment: string;
  processOrder: string;
  color?: string;
  application?: string;
  requiresUV?: boolean;
}

export interface SelectedFoil {
  companyCode: string;
  supplierCode: string;
  series: string;
  category: string;
  usage: string;
  mainApplication: string;
  suitableSize: string;
  tension: string;
  uvCompatible: boolean;
  color: string;
}