import { create } from "zustand";
import {
  Technology,
  TechnologyOwner,
  InvestmentDesire,
  TransferType,
  LegalCertification,
  PricingInfo,
  TechnologyStatus,
  VisibilityMode,
  OwnerType,
  PricingType,
  Currency,
} from "@/types/technologies";
import { TRL } from "@/types/trl";
import { Category } from "@/types/categories";
import { Media } from "@/types/media";
import { ID } from "@/types/common";

// State interface cho register technology form
interface RegisterTechnologyState {
  // Form data
  formData: Partial<Technology>;

  // UI states
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  currentStep: number;
  maxSteps: number;

  // Validation
  validationErrors: Record<string, string>;
  isValid: boolean;
}

// Store interface
interface RegisterTechnologyStore extends RegisterTechnologyState {
  // Form actions
  updateFormData: (data: Partial<Technology>) => void;
  updateOwners: (owners: TechnologyOwner[]) => void;
  updateLegalCertification: (legal: Partial<LegalCertification>) => void;
  updateInvestmentDesire: (investments: InvestmentDesire[]) => void;
  updateTransferType: (transfers: TransferType[]) => void;
  updatePricing: (pricing: Partial<PricingInfo>) => void;

  // Step management
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;

  // Form management
  resetForm: () => void;
  submitForm: () => Promise<boolean>;
  validateForm: () => boolean;
  setError: (error: string | null) => void;
  clearValidationErrors: () => void;
  setValidationError: (field: string, error: string) => void;
  clearValidationError: (field: string) => void;

  // Utility
  getFormDataForSubmission: () => Partial<Technology>;
  isStepValid: (step: number) => boolean;
}

// Initial form data với giá trị mặc định
const initialFormData: Partial<Technology> = {
  title: "",
  description: "",
  confidential_detail: "",
  documents: [],
  category: undefined,
  trl_level: undefined,
  owners: [
    {
      owner_type: "individual" as OwnerType,
      owner_name: "",
      ownership_percentage: 100,
    },
  ],
  legal_certification: {
    protection_scope: [],
    standard_certifications: [],
    files: [],
  },
  investment_desire: [],
  transfer_type: [],
  pricing: {
    pricing_type: "grant_seed" as PricingType,
    price_from: 0,
    price_to: 0,
    currency: "vnd" as Currency,
  },
  status: "draft" as TechnologyStatus,
  visibility_mode: "public" as VisibilityMode,
};

// Create the store
export const useRegisterTechnologyStore = create<RegisterTechnologyStore>(
  (set, get) => ({
    // Initial state
    formData: initialFormData,
    isLoading: false,
    isSubmitting: false,
    error: null,
    currentStep: 1,
    maxSteps: 6, // Điều chỉnh số bước theo form của bạn
    validationErrors: {},
    isValid: false,

    // Form data updates
    updateFormData: (data: Partial<Technology>) => {
      const currentData = get().formData;
      const newFormData = { ...currentData, ...data };

      set({
        formData: newFormData,
      });

      // Validate after update
      get().validateForm();
    },

    updateOwners: (owners: TechnologyOwner[]) => {
      get().updateFormData({ owners });
    },

    updateLegalCertification: (legal: Partial<LegalCertification>) => {
      const currentLegal = get().formData.legal_certification || {};
      get().updateFormData({
        legal_certification: { ...currentLegal, ...legal },
      });
    },

    updateInvestmentDesire: (investments: InvestmentDesire[]) => {
      get().updateFormData({ investment_desire: investments });
    },

    updateTransferType: (transfers: TransferType[]) => {
      get().updateFormData({ transfer_type: transfers });
    },

    updatePricing: (pricing: Partial<PricingInfo>) => {
      const currentPricing = get().formData.pricing || {
        pricing_type: "grant_seed" as PricingType,
        price_from: 0,
        price_to: 0,
        currency: "vnd" as Currency,
      };
      get().updateFormData({
        pricing: { ...currentPricing, ...pricing },
      });
    },

    // Step management
    nextStep: () => {
      const { currentStep, maxSteps } = get();
      if (currentStep < maxSteps) {
        set({ currentStep: currentStep + 1 });
      }
    },

    prevStep: () => {
      const { currentStep } = get();
      if (currentStep > 1) {
        set({ currentStep: currentStep - 1 });
      }
    },

    goToStep: (step: number) => {
      const { maxSteps } = get();
      if (step >= 1 && step <= maxSteps) {
        set({ currentStep: step });
      }
    },

    // Form management
    resetForm: () => {
      set({
        formData: initialFormData,
        currentStep: 1,
        error: null,
        validationErrors: {},
        isValid: false,
        isLoading: false,
        isSubmitting: false,
      });
    },

    submitForm: async () => {
      set({ isSubmitting: true, error: null });

      try {
        // Validate trước khi submit
        const isValidForm = get().validateForm();
        if (!isValidForm) {
          set({ isSubmitting: false });
          return false;
        }

        const formDataForSubmission = get().getFormDataForSubmission();

        // TODO: Implement API call here
        // const response = await apiClient.createTechnology(formDataForSubmission);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        set({
          isSubmitting: false,
          // Reset form sau khi submit thành công nếu muốn
          // formData: initialFormData,
          // currentStep: 1,
        });

        return true;
      } catch (error: any) {
        console.error("Submit technology error:", error);
        set({
          error: error.message || "Đăng ký công nghệ thất bại",
          isSubmitting: false,
        });
        return false;
      }
    },

    validateForm: () => {
      const { formData } = get();
      const errors: Record<string, string> = {};

      // Validate required fields
      if (!formData.title || formData.title.trim() === "") {
        errors.title = "Tiêu đề công nghệ là bắt buộc";
      }

      if (!formData.category) {
        errors.category = "Danh mục công nghệ là bắt buộc";
      }

      if (!formData.trl_level) {
        errors.trl_level = "Mức TRL là bắt buộc";
      }

      if (!formData.owners || formData.owners.length === 0) {
        errors.owners = "Phải có ít nhất một chủ sở hữu";
      } else {
        // Validate owners
        formData.owners.forEach((owner, index) => {
          if (!owner.owner_name || owner.owner_name.trim() === "") {
            errors[`owners.${index}.owner_name`] = "Tên chủ sở hữu là bắt buộc";
          }
          if (
            owner.ownership_percentage <= 0 ||
            owner.ownership_percentage > 100
          ) {
            errors[`owners.${index}.ownership_percentage`] =
              "Tỷ lệ sở hữu phải từ 1-100%";
          }
        });
      }

      // Validate pricing if exists
      if (formData.pricing) {
        if (formData.pricing.price_from < 0) {
          errors["pricing.price_from"] = "Giá từ không được âm";
        }
        if (formData.pricing.price_to < formData.pricing.price_from) {
          errors["pricing.price_to"] = "Giá đến phải lớn hơn hoặc bằng giá từ";
        }
      }

      const isValid = Object.keys(errors).length === 0;

      set({
        validationErrors: errors,
        isValid,
      });

      return isValid;
    },

    setError: (error: string | null) => {
      set({ error });
    },

    clearValidationErrors: () => {
      set({ validationErrors: {} });
    },

    setValidationError: (field: string, error: string) => {
      const currentErrors = get().validationErrors;
      set({
        validationErrors: { ...currentErrors, [field]: error },
      });
    },

    clearValidationError: (field: string) => {
      const currentErrors = get().validationErrors;
      const newErrors = { ...currentErrors };
      delete newErrors[field];
      set({ validationErrors: newErrors });
    },

    // Utility functions
    getFormDataForSubmission: () => {
      const { formData } = get();

      // Clean up form data before submission
      const cleanData: Partial<Technology> = {
        ...formData,
        // Set default status if not provided
        status: formData.status || "draft",
        visibility_mode: formData.visibility_mode || "public",
      };

      // Remove empty arrays or undefined values if needed
      if (!cleanData.owners || cleanData.owners.length === 0) {
        delete cleanData.owners;
      }

      if (
        !cleanData.investment_desire ||
        cleanData.investment_desire.length === 0
      ) {
        delete cleanData.investment_desire;
      }

      if (!cleanData.transfer_type || cleanData.transfer_type.length === 0) {
        delete cleanData.transfer_type;
      }

      return cleanData;
    },

    isStepValid: (step: number) => {
      const { formData, validationErrors } = get();

      // Implement step-specific validation logic
      switch (step) {
        case 1: // Basic info
          return (
            !!(formData.title && formData.category && formData.trl_level) &&
            !validationErrors.title &&
            !validationErrors.category &&
            !validationErrors.trl_level
          );

        case 2: // Owners
          return (
            !!(formData.owners && formData.owners.length > 0) &&
            !Object.keys(validationErrors).some((key) =>
              key.startsWith("owners.")
            )
          );

        case 3: // Legal certification
          return true; // Optional step

        case 4: // Investment & Transfer
          return true; // Optional step

        case 5: // Pricing
          return !Object.keys(validationErrors).some((key) =>
            key.startsWith("pricing.")
          );

        case 6: // Additional data
          return true; // Optional step

        default:
          return false;
      }
    },
  })
);

// Selectors for easier use
export const useFormData = () =>
  useRegisterTechnologyStore((state) => state.formData);
export const useCurrentStep = () =>
  useRegisterTechnologyStore((state) => state.currentStep);
export const useIsLoading = () =>
  useRegisterTechnologyStore((state) => state.isLoading);
export const useIsSubmitting = () =>
  useRegisterTechnologyStore((state) => state.isSubmitting);
export const useFormError = () =>
  useRegisterTechnologyStore((state) => state.error);
export const useValidationErrors = () =>
  useRegisterTechnologyStore((state) => state.validationErrors);
export const useIsFormValid = () =>
  useRegisterTechnologyStore((state) => state.isValid);

// Action selectors
export const useRegisterTechnologyActions = () =>
  useRegisterTechnologyStore((state) => ({
    updateFormData: state.updateFormData,
    updateOwners: state.updateOwners,
    updateLegalCertification: state.updateLegalCertification,
    updateInvestmentDesire: state.updateInvestmentDesire,
    updateTransferType: state.updateTransferType,
    updatePricing: state.updatePricing,
    nextStep: state.nextStep,
    prevStep: state.prevStep,
    goToStep: state.goToStep,
    resetForm: state.resetForm,
    submitForm: state.submitForm,
    validateForm: state.validateForm,
    setError: state.setError,
    clearValidationErrors: state.clearValidationErrors,
    setValidationError: state.setValidationError,
    clearValidationError: state.clearValidationError,
    isStepValid: state.isStepValid,
  }));
