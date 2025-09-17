export interface FileUpload {
  id: number;
  name: string;
  size: number;
  type: string;
  file: File;
}

export interface Submitter {
  submitterType: "INDIVIDUAL" | "COMPANY" | "RESEARCH_INSTITUTION";
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  // Doanh nghiệp fields
  taxCode: string;
  businessLicense: string;
  legalRepresentative: string;
  productionCapacity: string;
  // Viện/Trường fields
  unitCode: string;
  managingAgency: string;
  researchTaskCode: string;
  acceptanceReport: string;
  researchTeam: string;
}

export interface Owner {
  ownerType: "INDIVIDUAL" | "COMPANY" | "RESEARCH_INSTITUTION";
  ownerName: string;
  ownershipPercentage: number;
}

export interface IPDetail {
  ipType: string;
  ipNumber: string;
  status: string;
  territory: string;
}

export interface LegalTerritory {
  protectionTerritories: string[];
  certifications: string[];
  localCertificationFiles: FileUpload[];
}

export interface Pricing {
  pricingType: "ASK" | "APPRAISAL" | "AUCTION" | "OFFER";
  askingPrice: string;
  currency: "VND" | "USD" | "EUR";
  priceType: string;
  appraisalPurpose: string;
  appraisalScope: string;
  appraisalDeadline: string;
  // Auction fields
  auctionType: string;
  reservePrice: string;
  auctionStartDate: string;
  auctionEndDate: string;
  bidIncrement: string;
}

export interface InvestmentTransfer {
  investmentStage: string;
  commercializationMethods: string[];
  transferMethods: string[];
  territoryScope: string;
  financialMethods: string[];
  usageLimitations: string;
  currentPartners: string;
  potentialPartners: string;
}

export interface OptionalInfo {
  team: string;
  testResults: string;
  economicSocialImpact: string;
  financialSupport: string;
}

export interface Classification {
  field: string;
  industry: string;
  specialty: string;
}

export interface TechnologyFormData {
  title: string;
  publicSummary: string;
  confidentialDetail: string;
  trlLevel: string;
  categoryId: string;
  visibilityMode: "PUBLIC_SUMMARY" | "PUBLIC_FULL" | "PRIVATE";
  submitter: Submitter;
  owners: Owner[];
  ipDetails: IPDetail[];
  legalTerritory: LegalTerritory;
  pricing: Pricing;
  investmentTransfer: InvestmentTransfer;
  optionalInfo: OptionalInfo;
  classification: Classification;
  documents: FileUpload[];
}

export interface ExpandedSections {
  investmentTransfer: boolean;
  visibilityNDA: boolean;
  pricing: boolean;
}

export interface OCRResult {
  success: boolean;
  fileInfo?: {
    name: string;
  };
  processingTime?: string;
  extractedData?: {
    title?: string;
    field?: string;
    industry?: string;
    specialty?: string;
    trlSuggestion?: string;
    confidence?: number;
  };
}

export interface TRLSuggestion {
  title: string;
  fields: string[];
}

export interface MasterDataItem {
  value: string;
  label: string;
  description?: string;
  tooltip?: string;
}

export interface MasterData {
  fields: MasterDataItem[];
  industries: MasterDataItem[];
  specialties: MasterDataItem[];
  trlLevels: MasterDataItem[];
  categories: MasterDataItem[];
  ipTypes: MasterDataItem[];
  ipStatuses: MasterDataItem[];
  protectionTerritories: MasterDataItem[];
  certifications: MasterDataItem[];
  commercializationMethods: MasterDataItem[];
  transferMethods: MasterDataItem[];
}