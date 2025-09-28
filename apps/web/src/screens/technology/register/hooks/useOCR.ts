import { useState, useCallback } from "react";
import { OCRResult } from "../types";

export const useOCR = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string>("");

  const processOCR = useCallback(async (file: File): Promise<OCRResult | null> => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      // Create FormData to upload file
      const formData = new FormData();
      formData.append("file", file);

      // Call OCR API
      const response = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:4000/api'}/ocr/process`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("OCR processing failed");
      }

      const ocrResult = await response.json();
      setResult(ocrResult);
      return ocrResult;
    } catch (error) {
      console.error("OCR Error:", error);
      const errorMessage = "Không thể xử lý OCR. Vui lòng thử lại.";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResult(null);
    setError("");
  }, []);

  return {
    loading,
    result,
    error,
    processOCR,
    clearResults,
  };
};