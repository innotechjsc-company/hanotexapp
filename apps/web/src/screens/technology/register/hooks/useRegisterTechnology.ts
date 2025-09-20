import { useState, useCallback } from "react";
import { TechnologyFormData } from "../types";
import { validateFileSize, validateFileType } from "../utils";
import { createIntellectualProperty } from "@/api/intellectual-properties";
import { IntellectualProperty } from "@/types/IntellectualProperty";

export const useRegisterTechnology = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const submitTechnology = useCallback(
    async (formData: TechnologyFormData): Promise<boolean> => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        // TODO: Implement technology registration API call
        console.log("Submitting technology:", formData);

        // Simulate API call for technology registration
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock technology ID - in real implementation, this would come from the API response
        const mockTechnologyId = `tech_${Date.now()}`;
        console.log("Technology registered with ID:", mockTechnologyId);

        // Save IP details after technology is registered
        if (formData.ipDetails && formData.ipDetails.length > 0) {
          console.log("Saving IP details...");

          for (const ipDetail of formData.ipDetails) {
            if (ipDetail.ipType && ipDetail.ipNumber) {
              try {
                const ipData = {
                  technology: mockTechnologyId, // Link to technology
                  code: ipDetail.ipNumber,
                  type: ipDetail.ipType,
                  status: ipDetail.status || "PENDING",
                };

                await createIntellectualProperty(
                  ipData as Partial<IntellectualProperty>
                );
                console.log("IP detail saved:", ipData);
              } catch (ipError: any) {
                console.error("Error saving IP detail:", ipError);
                // Continue with other IP details even if one fails
              }
            }
          }
        }

        setSuccess(
          "Công nghệ và thông tin sở hữu trí tuệ đã được đăng ký thành công! Đang chờ phê duyệt."
        );
        return true;
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra khi đăng ký công nghệ");
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleFileUpload = useCallback(
    (
      files: FileList | null,
      onAddFile: (file: File) => void,
      onError: (error: string) => void
    ) => {
      if (!files) return;

      const allowedTypes = [".pdf", ".jpg", ".jpeg", ".png", ".mp4"];
      const maxSize = 10 * 1024 * 1024; // 10MB

      for (const file of Array.from(files)) {
        // Validate file size
        if (!validateFileSize(file, maxSize)) {
          onError(`File ${file.name} quá lớn. Kích thước tối đa là 10MB.`);
          continue;
        }

        // Validate file type
        if (!validateFileType(file, allowedTypes)) {
          onError(
            `File ${file.name} không được hỗ trợ. Chỉ chấp nhận: PDF, JPG, PNG, MP4.`
          );
          continue;
        }

        onAddFile(file);
      }
    },
    []
  );

  const clearMessages = useCallback(() => {
    setError("");
    setSuccess("");
  }, []);

  return {
    loading,
    error,
    success,
    showOptionalFields,
    setShowOptionalFields,
    submitTechnology,
    handleFileUpload,
    clearMessages,
  };
};
