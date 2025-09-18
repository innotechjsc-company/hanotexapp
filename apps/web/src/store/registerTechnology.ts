import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { devtools } from "zustand/middleware";
import {
  TechnologyFormData,
  Owner,
  IPDetail,
  FileUpload,
  ExpandedSections,
  OCRResult,
  Submitter,
  LegalTerritory,
  Pricing,
  InvestmentTransfer,
  OptionalInfo,
  Classification,
} from "@/screens/technology/register/types";
import { generateFileId } from "@/screens/technology/register/utils";

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

interface RegisterTechnologyState {
  // Form Data
  formData: TechnologyFormData;

  // UI State
  expandedSections: ExpandedSections;
  confirmUpload: boolean;
  showOptionalFields: boolean;

  // Loading States
  submitLoading: boolean;
  ocrLoading: boolean;
  ipSaveLoading: boolean;

  // Error States
  submitError: string | null;
  ocrError: string | null;
  ipSaveError: string | null;

  // Success States
  submitSuccess: string | null;

  // OCR Result
  ocrResult: OCRResult | null;

  // Draft Data
  ipDraftData: IPDetail[];
  hasUnsavedChanges: boolean;
}

interface RegisterTechnologyActions {
  // ========== Form Data Management ==========
  setFormData: (data: Partial<TechnologyFormData>) => void;
  updateFormField: <K extends keyof TechnologyFormData>(
    field: K,
    value: TechnologyFormData[K]
  ) => void;
  resetForm: () => void;

  // ========== Field Change Handlers ==========
  handleFieldChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;

  // ========== Owner Management ==========
  addOwner: () => void;
  removeOwner: (index: number) => void;
  updateOwner: (index: number, field: string, value: string | number) => void;
  validateOwners: () => boolean;

  // ========== IP Details Management ==========
  addIPDetail: () => void;
  removeIPDetail: (index: number) => void;
  updateIPDetail: (index: number, field: string, value: string) => void;
  saveIPAsDraft: () => boolean;
  loadIPFromDraft: () => IPDetail[];
  clearIPDraft: () => void;

  // ========== Document Management ==========
  addDocument: (file: File) => void;
  removeDocument: (index: number) => void;
  clearDocuments: () => void;

  // ========== Legal Territory Management ==========
  handleTerritoryChange: (territory: string, checked: boolean) => void;
  handleCertificationChange: (certification: string, checked: boolean) => void;
  addLocalCertificationFile: (file: File) => void;
  removeLocalCertificationFile: (index: number) => void;
  updateProtectionTerritories: (territories: string[]) => void;
  updateCertifications: (certifications: string[]) => void;

  // ========== Investment & Transfer Management ==========
  handleCommercializationMethodChange: (
    method: string,
    checked: boolean
  ) => void;
  handleTransferMethodChange: (method: string, checked: boolean) => void;
  updateInvestmentStage: (stage: string) => void;

  // ========== OCR Processing ==========
  processOCR: (file: File) => Promise<void>;
  updateFormDataFromOCR: (extractedData: any) => void;
  clearOCRResult: () => void;

  // ========== Form Submission ==========
  submitTechnology: () => Promise<boolean>;
  validateForm: () => { isValid: boolean; errors: string[] };
  prepareAPIPayload: () => any;

  // ========== UI State Management ==========
  toggleSection: (section: keyof ExpandedSections) => void;
  setConfirmUpload: (value: boolean) => void;
  setShowOptionalFields: (value: boolean) => void;

  // ========== Error & Success Management ==========
  clearMessages: () => void;
  setSubmitError: (error: string | null) => void;
  setSubmitSuccess: (message: string | null) => void;

  // ========== File Upload Handler ==========
  handleFileUpload: (
    files: FileList | null,
    onSuccess?: (file: File) => void,
    onError?: (error: any) => void
  ) => void;

  // ========== Utility Functions ==========
  setUnsavedChanges: (value: boolean) => void;
  checkUnsavedChanges: () => boolean;
}

type RegisterTechnologyStore = RegisterTechnologyState &
  RegisterTechnologyActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const createInitialFormData = (): TechnologyFormData => ({
  title: "",
  publicSummary: "",
  confidentialDetail: "",
  trlLevel: "",
  visibilityMode: "public_summary_with_nda_details",
  submitter: {
    submitterType: "INDIVIDUAL",
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    taxCode: "",
    businessLicense: "",
    legalRepresentative: "",
    productionCapacity: "",
    unitCode: "",
    managingAgency: "",
    researchTaskCode: "",
    acceptanceReport: "",
    researchTeam: "",
  },
  owners: [
    { ownerType: "INDIVIDUAL", ownerName: "", ownershipPercentage: 100 },
  ],
  ipDetails: [],
  legalTerritory: {
    protectionTerritories: [],
    certifications: [],
    localCertificationFiles: [],
  },
  pricing: {
    pricingType: "ASK",
    askingPrice: "",
    currency: "VND",
    priceType: "",
    appraisalPurpose: "",
    appraisalScope: "",
    appraisalDeadline: "",
    auctionType: "",
    reservePrice: "",
    auctionStartDate: "",
    auctionEndDate: "",
    bidIncrement: "",
  },
  investmentTransfer: {
    investmentStage: "",
    commercializationMethods: [],
    transferMethods: [],
    territoryScope: "",
    financialMethods: [],
    usageLimitations: "",
    currentPartners: "",
    potentialPartners: "",
  },
  optionalInfo: {
    team: "",
    testResults: "",
    economicSocialImpact: "",
    financialSupport: "",
  },
  classification: {
    field: "",
    parentCategory: "",
    childCategory: "",
  },
  documents: [],
});

const initialState: RegisterTechnologyState = {
  formData: createInitialFormData(),
  expandedSections: {
    investmentTransfer: false,
    visibilityNDA: false,
    pricing: false,
  },
  confirmUpload: false,
  showOptionalFields: false,
  submitLoading: false,
  ocrLoading: false,
  ipSaveLoading: false,
  submitError: null,
  ocrError: null,
  ipSaveError: null,
  submitSuccess: null,
  ocrResult: null,
  ipDraftData: [],
  hasUnsavedChanges: false,
};

// ============================================================================
// STORE CREATION
// ============================================================================

export const useRegisterTechnologyStore = create<RegisterTechnologyStore>()(
  devtools(
    subscribeWithSelector(
      persist(
        immer((set, get) => ({
          ...initialState,

          // ========== Form Data Management ==========
          setFormData: (data) =>
            set((state) => {
              Object.assign(state.formData, data);
              state.hasUnsavedChanges = true;
            }),

          updateFormField: (field, value) =>
            set((state) => {
              state.formData[field] = value;
              state.hasUnsavedChanges = true;
            }),

          resetForm: () =>
            set((state) => {
              state.formData = createInitialFormData();
              state.expandedSections = {
                investmentTransfer: false,
                visibilityNDA: false,
                pricing: false,
              };
              state.confirmUpload = false;
              state.showOptionalFields = false;
              state.hasUnsavedChanges = false;
              state.submitError = null;
              state.submitSuccess = null;
              state.ocrResult = null;
            }),

          // ========== Field Change Handlers ==========
          handleFieldChange: (e) => {
            const { name, value } = e.target;
            set((state) => {
              if (name.includes(".")) {
                const [parent, child] = name.split(".");
                const parentKey = parent as keyof TechnologyFormData;
                if (
                  state.formData[parentKey] &&
                  typeof state.formData[parentKey] === "object"
                ) {
                  (state.formData[parentKey] as any)[child] = value;
                }
              } else {
                (state.formData as any)[name] = value;
              }
              state.hasUnsavedChanges = true;
            });
          },

          // ========== Owner Management ==========
          addOwner: () =>
            set((state) => {
              state.formData.owners.push({
                ownerType: "INDIVIDUAL",
                ownerName: "",
                ownershipPercentage: 0,
              });
              state.hasUnsavedChanges = true;
            }),

          removeOwner: (index) =>
            set((state) => {
              state.formData.owners.splice(index, 1);
              state.hasUnsavedChanges = true;
            }),

          updateOwner: (index, field, value) =>
            set((state) => {
              const owner = state.formData.owners[index];
              if (owner) {
                (owner as any)[field] = value;
                state.hasUnsavedChanges = true;
              }
            }),

          validateOwners: () => {
            const { owners } = get().formData;
            const totalPercentage = owners.reduce(
              (sum, owner) => sum + (owner.ownershipPercentage || 0),
              0
            );
            return totalPercentage === 100;
          },

          // ========== IP Details Management ==========
          addIPDetail: () =>
            set((state) => {
              state.formData.ipDetails.push({
                ipType: "PATENT",
                ipNumber: "",
                status: "",
                territory: "",
              });
              state.hasUnsavedChanges = true;
            }),

          removeIPDetail: (index) =>
            set((state) => {
              state.formData.ipDetails.splice(index, 1);
              state.hasUnsavedChanges = true;
            }),

          updateIPDetail: (index, field, value) =>
            set((state) => {
              const ipDetail = state.formData.ipDetails[index];
              if (ipDetail) {
                (ipDetail as any)[field] = value;
                state.hasUnsavedChanges = true;
              }
            }),

          saveIPAsDraft: () => {
            const { ipDetails } = get().formData;
            set((state) => {
              state.ipDraftData = [...ipDetails];
              state.ipSaveLoading = false;
              state.ipSaveError = null;
            });
            localStorage.setItem("ipDraftData", JSON.stringify(ipDetails));
            return true;
          },

          loadIPFromDraft: () => {
            const savedData = localStorage.getItem("ipDraftData");
            if (savedData) {
              try {
                const parsedData = JSON.parse(savedData);
                set((state) => {
                  state.formData.ipDetails = parsedData;
                  state.ipDraftData = parsedData;
                });
                return parsedData;
              } catch (error) {
                console.error("Error loading IP draft:", error);
              }
            }
            return get().ipDraftData;
          },

          clearIPDraft: () => {
            localStorage.removeItem("ipDraftData");
            set((state) => {
              state.ipDraftData = [];
            });
          },

          // ========== Document Management ==========
          addDocument: (file) =>
            set((state) => {
              const newDocument: FileUpload = {
                id: generateFileId(),
                name: file.name,
                size: file.size,
                type: file.type,
                file: file,
              };
              state.formData.documents.push(newDocument);
              state.hasUnsavedChanges = true;
            }),

          removeDocument: (index) =>
            set((state) => {
              state.formData.documents.splice(index, 1);
              state.hasUnsavedChanges = true;
            }),

          clearDocuments: () =>
            set((state) => {
              state.formData.documents = [];
              state.hasUnsavedChanges = true;
            }),

          // ========== Legal Territory Management ==========
          handleTerritoryChange: (territory, checked) =>
            set((state) => {
              const territories =
                state.formData.legalTerritory.protectionTerritories;
              if (checked) {
                if (!territories.includes(territory)) {
                  territories.push(territory);
                }
              } else {
                const index = territories.indexOf(territory);
                if (index > -1) {
                  territories.splice(index, 1);
                }
              }
              state.hasUnsavedChanges = true;
            }),

          handleCertificationChange: (certification, checked) =>
            set((state) => {
              const certifications =
                state.formData.legalTerritory.certifications;
              if (checked) {
                if (!certifications.includes(certification)) {
                  certifications.push(certification);
                }
              } else {
                const index = certifications.indexOf(certification);
                if (index > -1) {
                  certifications.splice(index, 1);
                }
              }
              state.hasUnsavedChanges = true;
            }),

          addLocalCertificationFile: (file) =>
            set((state) => {
              const newFile: FileUpload = {
                id: generateFileId(),
                name: file.name,
                size: file.size,
                type: file.type,
                file: file,
              };
              state.formData.legalTerritory.localCertificationFiles.push(
                newFile
              );
              state.hasUnsavedChanges = true;
            }),

          removeLocalCertificationFile: (index) =>
            set((state) => {
              state.formData.legalTerritory.localCertificationFiles.splice(
                index,
                1
              );
              state.hasUnsavedChanges = true;
            }),

          updateProtectionTerritories: (territories) =>
            set((state) => {
              state.formData.legalTerritory.protectionTerritories = territories;
              state.hasUnsavedChanges = true;
            }),

          updateCertifications: (certifications) =>
            set((state) => {
              state.formData.legalTerritory.certifications = certifications;
              state.hasUnsavedChanges = true;
            }),

          // ========== Investment & Transfer Management ==========
          handleCommercializationMethodChange: (method, checked) =>
            set((state) => {
              const methods =
                state.formData.investmentTransfer.commercializationMethods;
              if (checked) {
                if (!methods.includes(method)) {
                  methods.push(method);
                }
              } else {
                const index = methods.indexOf(method);
                if (index > -1) {
                  methods.splice(index, 1);
                }
              }
              state.hasUnsavedChanges = true;
            }),

          handleTransferMethodChange: (method, checked) =>
            set((state) => {
              const methods = state.formData.investmentTransfer.transferMethods;
              if (checked) {
                if (!methods.includes(method)) {
                  methods.push(method);
                }
              } else {
                const index = methods.indexOf(method);
                if (index > -1) {
                  methods.splice(index, 1);
                }
              }
              state.hasUnsavedChanges = true;
            }),

          updateInvestmentStage: (stage) =>
            set((state) => {
              state.formData.investmentTransfer.investmentStage = stage;
              state.hasUnsavedChanges = true;
            }),

          // ========== OCR Processing ==========
          processOCR: async (file) => {
            set((state) => {
              state.ocrLoading = true;
              state.ocrError = null;
            });

            try {
              // Simulate OCR processing
              // TODO: Replace with actual OCR API call
              await new Promise((resolve) => setTimeout(resolve, 2000));

              const mockOCRResult: OCRResult = {
                success: true,
                fileInfo: {
                  name: file.name,
                },
                processingTime: "2.5s",
                extractedData: {
                  title: "Sample Technology Title from OCR",
                  field: "Information Technology",
                  trlSuggestion: "TRL-5",
                  confidence: 0.85,
                },
              };

              set((state) => {
                state.ocrResult = mockOCRResult;
                state.ocrLoading = false;
                if (mockOCRResult.extractedData) {
                  get().updateFormDataFromOCR(mockOCRResult.extractedData);
                }
              });
            } catch (error: any) {
              set((state) => {
                state.ocrError = error.message || "OCR processing failed";
                state.ocrLoading = false;
              });
            }
          },

          updateFormDataFromOCR: (extractedData) =>
            set((state) => {
              if (extractedData.title) {
                state.formData.title = extractedData.title;
              }
              if (extractedData.trlSuggestion) {
                state.formData.trlLevel = extractedData.trlSuggestion;
              }
              if (extractedData.field) {
                state.formData.classification.field = extractedData.field;
              }
              state.hasUnsavedChanges = true;
            }),

          clearOCRResult: () =>
            set((state) => {
              state.ocrResult = null;
              state.ocrError = null;
            }),

          // ========== Form Submission ==========
          submitTechnology: async () => {
            const store = get();
            const { isValid, errors } = store.validateForm();

            if (!isValid) {
              set((state) => {
                state.submitError = errors.join(", ");
              });
              return false;
            }

            set((state) => {
              state.submitLoading = true;
              state.submitError = null;
              state.submitSuccess = null;
            });

            try {
              const apiPayload = store.prepareAPIPayload();

              // TODO: Replace with actual API call
              console.log("Submitting technology:", apiPayload);
              await new Promise((resolve) => setTimeout(resolve, 2000));

              set((state) => {
                state.submitLoading = false;
                state.submitSuccess = "Technology registered successfully!";
                state.hasUnsavedChanges = false;
              });

              // Reset form after successful submission
              setTimeout(() => {
                store.resetForm();
              }, 3000);

              return true;
            } catch (error: any) {
              set((state) => {
                state.submitLoading = false;
                state.submitError = error.message || "Submission failed";
              });
              return false;
            }
          },

          validateForm: () => {
            const { formData, confirmUpload } = get();
            const errors: string[] = [];

            // Required field validation
            if (!formData.title) errors.push("Title is required");
            if (!formData.trlLevel) errors.push("TRL Level is required");
            if (!formData.submitter.email)
              errors.push("Submitter email is required");
            if (formData.owners.length === 0)
              errors.push("At least one owner is required");

            // Validate ownership percentage
            const totalOwnership = formData.owners.reduce(
              (sum, owner) => sum + (owner.ownershipPercentage || 0),
              0
            );
            if (totalOwnership !== 100) {
              errors.push("Total ownership percentage must equal 100%");
            }

            // Validate pricing
            if (
              formData.pricing.pricingType === "ASK" &&
              !formData.pricing.askingPrice
            ) {
              errors.push("Asking price is required");
            }

            if (!confirmUpload) {
              errors.push("Please confirm upload");
            }

            return {
              isValid: errors.length === 0,
              errors,
            };
          },

          prepareAPIPayload: () => {
            const { formData } = get();

            // Helper function to map investment stage to pricing type
            const getPricingType = (stage: string | undefined): string => {
              switch (stage) {
                case "SEED":
                case "GRANT":
                  return "GRANT_SEED";
                case "SERIES_A":
                case "JOINT_VENTURE":
                  return "VC_JOINT_VENTURE";
                case "GROWTH":
                case "IPO":
                  return "GROWTH_STRATEGIC";
                default:
                  return "GRANT_SEED";
              }
            };

            return {
              // Basic fields
              title: formData.title || "",
              documents: formData.documents?.map((doc) => doc.id) || [],
              category: formData.classification?.childCategory || "",
              confidential_detail: formData.confidentialDetail || "",
              trl_level: formData.trlLevel || "",
              submitter: formData.submitter?.email || "",
              status: "DRAFT",
              visibility_mode: formData.visibilityMode,

              // Technology Owners array
              owners:
                formData.owners?.map((owner) => ({
                  owner_type: owner.ownerType || "INDIVIDUAL",
                  owner_name: owner.ownerName || "",
                  ownership_percentage: Number(owner.ownershipPercentage) || 0,
                })) || [],

              // Intellectual Property array
              intellectual_properties:
                formData.ipDetails?.map((ip) => ({
                  technology: formData.title || "",
                  code: ip.ipNumber || "",
                  type: ip.ipType?.toLowerCase() || "patent",
                  status: ip.status?.toLowerCase() || "pending",
                })) || [],

              // Legal Certification group
              legal_certification: {
                protection_scope:
                  formData.legalTerritory?.protectionTerritories?.map(
                    (territory) => ({
                      scope: territory,
                    })
                  ) || [],
                standard_certifications:
                  formData.legalTerritory?.certifications?.map((cert) => ({
                    certification: cert,
                  })) || [],
                local_certification_url:
                  formData.legalTerritory?.localCertificationFiles?.[0]?.url ||
                  "",
              },

              // Investment Desire array
              investment_desire: [
                ...(
                  formData.investmentTransfer?.commercializationMethods || []
                ).map((method) => ({
                  investment_option: method,
                })),
                ...(formData.investmentTransfer?.transferMethods || []).map(
                  (method) => ({
                    investment_option: method,
                  })
                ),
              ],

              // Pricing group
              pricing: {
                pricing_type: getPricingType(
                  formData.investmentTransfer?.investmentStage
                ),
                price_from: Number(formData.pricing?.askingPrice) || 0,
                price_to:
                  Number(formData.pricing?.reservePrice) ||
                  Number(formData.pricing?.askingPrice) ||
                  0,
                currency: formData.pricing?.currency || "VND",
              },

              // Additional Data group
              additional_data: {
                test_results: formData.optionalInfo?.testResults || "",
                economic_social_impact:
                  formData.optionalInfo?.economicSocialImpact || "",
                financial_support_info:
                  formData.optionalInfo?.financialSupport || "",
              },

              // Display mode
              display_mode: formData.visibilityMode,
            };
          },

          // ========== UI State Management ==========
          toggleSection: (section) =>
            set((state) => {
              state.expandedSections[section] =
                !state.expandedSections[section];
            }),

          setConfirmUpload: (value) =>
            set((state) => {
              state.confirmUpload = value;
            }),

          setShowOptionalFields: (value) =>
            set((state) => {
              state.showOptionalFields = value;
            }),

          // ========== Error & Success Management ==========
          clearMessages: () =>
            set((state) => {
              state.submitError = null;
              state.submitSuccess = null;
              state.ocrError = null;
              state.ipSaveError = null;
            }),

          setSubmitError: (error) =>
            set((state) => {
              state.submitError = error;
            }),

          setSubmitSuccess: (message) =>
            set((state) => {
              state.submitSuccess = message;
            }),

          // ========== File Upload Handler ==========
          handleFileUpload: (files, onSuccess, onError) => {
            if (!files) return;

            try {
              Array.from(files).forEach((file) => {
                // Validate file
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (file.size > maxSize) {
                  throw new Error(
                    `File ${file.name} exceeds maximum size of 10MB`
                  );
                }

                // Add document to store
                get().addDocument(file);

                // Process OCR if applicable
                if (
                  file.type === "application/pdf" ||
                  file.type.startsWith("image/")
                ) {
                  get().processOCR(file);
                }

                // Call success callback
                if (onSuccess) {
                  onSuccess(file);
                }
              });
            } catch (error) {
              console.error("File upload error:", error);
              if (onError) {
                onError(error);
              }
            }
          },

          // ========== Utility Functions ==========
          setUnsavedChanges: (value) =>
            set((state) => {
              state.hasUnsavedChanges = value;
            }),

          checkUnsavedChanges: () => {
            return get().hasUnsavedChanges;
          },
        })),
        {
          name: "register-technology-store",
          partialize: (state) => ({
            ipDraftData: state.ipDraftData,
          }),
        }
      )
    ),
    { name: "RegisterTechnologyStore" }
  )
);

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

// Form Data Selectors
export const useFormData = () =>
  useRegisterTechnologyStore((state) => state.formData);
export const useOwners = () =>
  useRegisterTechnologyStore((state) => state.formData.owners);
export const useIPDetails = () =>
  useRegisterTechnologyStore((state) => state.formData.ipDetails);
export const useDocuments = () =>
  useRegisterTechnologyStore((state) => state.formData.documents);
export const useLegalTerritory = () =>
  useRegisterTechnologyStore((state) => state.formData.legalTerritory);
export const usePricing = () =>
  useRegisterTechnologyStore((state) => state.formData.pricing);
export const useInvestmentTransfer = () =>
  useRegisterTechnologyStore((state) => state.formData.investmentTransfer);
export const useClassification = () =>
  useRegisterTechnologyStore((state) => state.formData.classification);

// UI State Selectors
export const useExpandedSections = () =>
  useRegisterTechnologyStore((state) => state.expandedSections);
export const useConfirmUpload = () =>
  useRegisterTechnologyStore((state) => state.confirmUpload);
export const useShowOptionalFields = () =>
  useRegisterTechnologyStore((state) => state.showOptionalFields);

// Loading State Selectors
export const useSubmitLoading = () =>
  useRegisterTechnologyStore((state) => state.submitLoading);
export const useOCRLoading = () =>
  useRegisterTechnologyStore((state) => state.ocrLoading);
export const useIPSaveLoading = () =>
  useRegisterTechnologyStore((state) => state.ipSaveLoading);

// Error & Success State Selectors
export const useSubmitError = () =>
  useRegisterTechnologyStore((state) => state.submitError);
export const useSubmitSuccess = () =>
  useRegisterTechnologyStore((state) => state.submitSuccess);
export const useOCRError = () =>
  useRegisterTechnologyStore((state) => state.ocrError);
export const useOCRResult = () =>
  useRegisterTechnologyStore((state) => state.ocrResult);

// Actions Selectors
export const useRegisterActions = () => {
  const store = useRegisterTechnologyStore();

  return {
    // Form Management
    setFormData: store.setFormData,
    updateFormField: store.updateFormField,
    resetForm: store.resetForm,
    handleFieldChange: store.handleFieldChange,

    // Owner Management
    addOwner: store.addOwner,
    removeOwner: store.removeOwner,
    updateOwner: store.updateOwner,

    // IP Management
    addIPDetail: store.addIPDetail,
    removeIPDetail: store.removeIPDetail,
    updateIPDetail: store.updateIPDetail,
    saveIPAsDraft: store.saveIPAsDraft,
    loadIPFromDraft: store.loadIPFromDraft,

    // Document Management
    addDocument: store.addDocument,
    removeDocument: store.removeDocument,
    handleFileUpload: store.handleFileUpload,

    // Legal Territory
    handleTerritoryChange: store.handleTerritoryChange,
    handleCertificationChange: store.handleCertificationChange,
    addLocalCertificationFile: store.addLocalCertificationFile,
    removeLocalCertificationFile: store.removeLocalCertificationFile,

    // Investment & Transfer
    handleCommercializationMethodChange:
      store.handleCommercializationMethodChange,
    handleTransferMethodChange: store.handleTransferMethodChange,

    // OCR
    processOCR: store.processOCR,
    updateFormDataFromOCR: store.updateFormDataFromOCR,

    // Submission
    submitTechnology: store.submitTechnology,

    // UI Management
    toggleSection: store.toggleSection,
    setConfirmUpload: store.setConfirmUpload,
    setShowOptionalFields: store.setShowOptionalFields,
    clearMessages: store.clearMessages,
  };
};
