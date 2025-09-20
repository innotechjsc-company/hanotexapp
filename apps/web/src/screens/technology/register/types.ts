// Types for Technology Registration Form

// IP Detail interface for form data
export interface IPDetail {
  ipType: string;
  ipNumber: string;
  status: string;
  territory: string;
}

// Owner interface for form data
export interface Owner {
  ownerType: "INDIVIDUAL" | "COMPANY" | "RESEARCH_INSTITUTION";
  ownerName: string;
  ownershipPercentage: number;
}

// File upload interface
export interface FileUpload {
  id: number;
  name: string;
  size: number;
  type: string;
  file: File;
}

// Submitter information interface
export interface SubmitterInfo {
  submitterType: "INDIVIDUAL" | "COMPANY" | "RESEARCH_INSTITUTION";
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  taxCode: string;
  businessLicense: string;
  legalRepresentative: string;
  productionCapacity: string;
  unitCode: string;
  managingAgency: string;
  researchTaskCode: string;
  acceptanceReport: string;
  researchTeam: string;
}

// Legal territory interface
export interface LegalTerritory {
  protectionTerritories: string[];
  certifications: string[];
  localCertificationFiles: FileUpload[];
}

// Pricing interface
export interface Pricing {
  pricingType: "ASK" | "APPRAISAL" | "AUCTION" | "OFFER";
  askingPrice: string;
  currency: "VND" | "USD" | "EUR";
  priceType: string;
  appraisalPurpose: string;
  appraisalScope: string;
  appraisalDeadline: string;
  auctionType: string;
  reservePrice: string;
  auctionStartDate: string;
  auctionEndDate: string;
  bidIncrement: string;
}

// Investment and transfer interface
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

// Optional information interface
export interface OptionalInfo {
  team: string;
  testResults: string;
  economicSocialImpact: string;
  financialSupport: string;
}

// Classification interface
export interface Classification {
  field: string;
  parentCategory: string;
  childCategory: string;
}

// Expanded sections interface
export interface ExpandedSections {
  investmentTransfer: boolean;
  visibilityNDA: boolean;
  pricing: boolean;
}

// Main technology form data interface
export interface TechnologyFormData {
  title: string;
  publicSummary: string;
  confidentialDetail: string;
  trlLevel: string;
  visibilityMode: "PUBLIC_SUMMARY" | "PRIVATE" | "RESTRICTED";
  submitter: SubmitterInfo;
  owners: Owner[];
  ipDetails: IPDetail[];
  legalTerritory: LegalTerritory;
  pricing: Pricing;
  investmentTransfer: InvestmentTransfer;
  optionalInfo: OptionalInfo;
  classification: Classification;
  documents: FileUpload[];
}

// Master data interfaces
export interface MasterDataItem {
  value: string;
  label: string;
  description?: string;
}

export interface MasterData {
  fields?: MasterDataItem[];
  trlLevels?: MasterDataItem[];
  categories?: MasterDataItem[];
  ipTypes?: MasterDataItem[];
  ipStatuses?: MasterDataItem[];
  protectionTerritories?: MasterDataItem[];
  certifications?: MasterDataItem[];
  commercializationMethods?: MasterDataItem[];
  transferMethods?: MasterDataItem[];
}

// TRL suggestion interface
export interface TRLSuggestion {
  title: string;
  fields: string[];
}

// OCR result interface
export interface OCRResult {
  text: string;
  confidence: number;
}
