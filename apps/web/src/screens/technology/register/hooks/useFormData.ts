import { useState, useCallback } from "react";
import { TechnologyFormData, Owner, IPDetail, FileUpload, ExpandedSections } from "../types";
import { generateFileId } from "../utils";

const createInitialFormData = (): TechnologyFormData => ({
  title: "",
  publicSummary: "",
  confidentialDetail: "",
  trlLevel: "",
  visibilityMode: "PUBLIC_SUMMARY",
  submitter: {
    submitterType: "INDIVIDUAL",
    fullName: "Nguyễn Văn A",
    email: "user@example.com",
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
  ipDetails: [{ ipType: "PATENT", ipNumber: "", status: "", territory: "" }],
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

export const useFormData = () => {
  const [formData, setFormData] = useState<TechnologyFormData>(createInitialFormData());
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    investmentTransfer: false,
    visibilityNDA: false,
    pricing: false,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as Record<string, any>),
            [child]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    },
    []
  );

  const addOwner = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      owners: [
        ...prev.owners,
        { ownerType: "INDIVIDUAL", ownerName: "", ownershipPercentage: 0 },
      ],
    }));
  }, []);

  const removeOwner = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      owners: prev.owners.filter((_, i) => i !== index),
    }));
  }, []);

  const updateOwner = useCallback((index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      owners: prev.owners.map((owner, i) =>
        i === index ? { ...owner, [field]: value } : owner
      ),
    }));
  }, []);

  const addIPDetail = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      ipDetails: [
        ...prev.ipDetails,
        { ipType: "PATENT", ipNumber: "", status: "", territory: "" },
      ],
    }));
  }, []);

  const removeIPDetail = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      ipDetails: prev.ipDetails.filter((_, i) => i !== index),
    }));
  }, []);

  const updateIPDetail = useCallback((index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      ipDetails: prev.ipDetails.map((ip, i) =>
        i === index ? { ...ip, [field]: value } : ip
      ),
    }));
  }, []);

  const handleTerritoryChange = useCallback((territory: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      legalTerritory: {
        ...prev.legalTerritory,
        protectionTerritories: checked
          ? [...prev.legalTerritory.protectionTerritories, territory]
          : prev.legalTerritory.protectionTerritories.filter((t) => t !== territory),
      },
    }));
  }, []);

  const handleCertificationChange = useCallback((certification: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      legalTerritory: {
        ...prev.legalTerritory,
        certifications: checked
          ? [...prev.legalTerritory.certifications, certification]
          : prev.legalTerritory.certifications.filter((c) => c !== certification),
      },
    }));
  }, []);

  // Investment & Transfer - checkbox handlers
  const handleCommercializationMethodChange = useCallback(
    (method: string, checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        investmentTransfer: {
          ...prev.investmentTransfer,
          commercializationMethods: checked
            ? [...prev.investmentTransfer.commercializationMethods, method]
            : prev.investmentTransfer.commercializationMethods.filter((m) => m !== method),
        },
      }));
    },
    []
  );

  const handleTransferMethodChange = useCallback(
    (method: string, checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        investmentTransfer: {
          ...prev.investmentTransfer,
          transferMethods: checked
            ? [...prev.investmentTransfer.transferMethods, method]
            : prev.investmentTransfer.transferMethods.filter((m) => m !== method),
        },
      }));
    },
    []
  );

  const addDocument = useCallback((file: File) => {
    const newDocument: FileUpload = {
      id: generateFileId(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    };

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newDocument],
    }));
  }, []);

  const removeDocument = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  }, []);

  const addLocalCertificationFile = useCallback((file: File) => {
    const newFile: FileUpload = {
      id: generateFileId(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    };

    setFormData((prev) => ({
      ...prev,
      legalTerritory: {
        ...prev.legalTerritory,
        localCertificationFiles: [
          ...prev.legalTerritory.localCertificationFiles,
          newFile,
        ],
      },
    }));
  }, []);

  const removeLocalCertificationFile = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      legalTerritory: {
        ...prev.legalTerritory,
        localCertificationFiles: prev.legalTerritory.localCertificationFiles.filter(
          (_, i) => i !== index
        ),
      },
    }));
  }, []);

  const updateProtectionTerritories = useCallback((territories: string[]) => {
    setFormData((prev) => ({
      ...prev,
      legalTerritory: {
        ...prev.legalTerritory,
        protectionTerritories: territories,
      },
    }));
  }, []);

  const updateCertifications = useCallback((certifications: string[]) => {
    setFormData((prev) => ({
      ...prev,
      legalTerritory: {
        ...prev.legalTerritory,
        certifications: certifications,
      },
    }));
  }, []);

  const handleLegalTerritoryFileUpload = useCallback((files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      addLocalCertificationFile(file);
    });
  }, [addLocalCertificationFile]);

  const toggleSection = useCallback((sectionName: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
    setExpandedSections({
      investmentTransfer: false,
      visibilityNDA: false,
      pricing: false,
    });
  }, []);

  const updateFormDataFromOCR = useCallback((extractedData: any) => {
    setFormData((prev) => ({
      ...prev,
      title: extractedData.title || prev.title,
      trlLevel: extractedData.trlSuggestion || prev.trlLevel,
      classification: {
        ...prev.classification,
        field: extractedData.field || prev.classification.field,
      },
    }));
  }, []);

  return {
    formData,
    setFormData,
    expandedSections,
    handleChange,
    addOwner,
    removeOwner,
    updateOwner,
    addIPDetail,
    removeIPDetail,
    updateIPDetail,
    handleTerritoryChange,
    handleCertificationChange,
    handleCommercializationMethodChange,
    handleTransferMethodChange,
    addDocument,
    removeDocument,
    addLocalCertificationFile,
    removeLocalCertificationFile,
    updateProtectionTerritories,
    updateCertifications,
    handleLegalTerritoryFileUpload,
    toggleSection,
    resetForm,
    updateFormDataFromOCR,
  };
};
