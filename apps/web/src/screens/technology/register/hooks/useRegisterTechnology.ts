import { useState, useCallback } from "react";
import { TechnologyFormData } from "../types";
import { validateFileSize, validateFileType } from "../utils";

export const useRegisterTechnology = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const submitTechnology = useCallback(async (formData: TechnologyFormData): Promise<boolean> => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Implement technology registration API call
      console.log("Submitting technology:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess("Công nghệ đã được đăng ký thành công! Đang chờ phê duyệt.");
      return true;
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi đăng ký công nghệ");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

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