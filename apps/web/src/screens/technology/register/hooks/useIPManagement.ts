import { useState, useCallback } from "react";
import {
  createIntellectualProperty,
  updateIntellectualProperty,
  deleteIntellectualProperty,
  getIntellectualPropertiesByTechnology,
} from "@/api/intellectual-properties";
import { IPDetail } from "../types";
import {
  IntellectualProperty,
  IPStatus,
  IPType,
} from "@/types/IntellectualProperty";

interface UseIPManagementProps {
  technologyId?: string;
  onIPDetailsChange?: (ipDetails: IPDetail[]) => void;
}

export const useIPManagement = ({
  technologyId,
  onIPDetailsChange,
}: UseIPManagementProps = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [savedIPDetails, setSavedIPDetails] = useState<IntellectualProperty[]>(
    []
  );

  // Convert API IP to form IP detail
  const convertAPIToFormIP = useCallback(
    (apiIP: IntellectualProperty): IPDetail => ({
      ipType: apiIP.type,
      ipNumber: apiIP.code,
      status: apiIP.status,
      territory: "", // Territory is not stored in IntellectualProperty, handled separately
    }),
    []
  );

  // Convert form IP detail to API format
  const convertFormToAPIIP = useCallback(
    (formIP: IPDetail, techId?: string): Partial<IntellectualProperty> => ({
      technology: techId || technologyId || "",
      code: formIP.ipNumber,
      type: formIP.ipType as IPType,
      status: formIP.status as IPStatus,
    }),
    [technologyId]
  );

  // Load existing IP details for a technology
  const loadIPDetails = useCallback(
    async (techId: string) => {
      if (!techId) return;

      setLoading(true);
      setError("");

      try {
        const response = await getIntellectualPropertiesByTechnology(techId);
        if (response.docs) {
          setSavedIPDetails(response.docs);

          // Convert to form format and notify parent
          const formIPDetails = response.docs.map(convertAPIToFormIP);
          onIPDetailsChange?.(formIPDetails);
        }
      } catch (err: any) {
        setError(err.message || "Không thể tải thông tin sở hữu trí tuệ");
        console.error("Load IP details error:", err);
      } finally {
        setLoading(false);
      }
    },
    [convertAPIToFormIP, onIPDetailsChange]
  );

  // Save a single IP detail
  const saveIPDetail = useCallback(
    async (
      ipDetail: IPDetail,
      techId?: string
    ): Promise<IntellectualProperty | null> => {
      setLoading(true);
      setError("");

      try {
        const apiData = convertFormToAPIIP(ipDetail, techId || technologyId);
        const result = await createIntellectualProperty(apiData);

        setSavedIPDetails((prev) => [...prev, result]);
        return result;
      } catch (err: any) {
        setError(err.message || "Không thể lưu thông tin sở hữu trí tuệ");
        console.error("Save IP detail error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [convertFormToAPIIP, technologyId]
  );

  // Save multiple IP details
  const saveAllIPDetails = useCallback(
    async (
      ipDetails: IPDetail[],
      techId?: string
    ): Promise<IntellectualProperty[]> => {
      setLoading(true);
      setError("");

      const results: IntellectualProperty[] = [];

      try {
        for (const ipDetail of ipDetails) {
          const apiData = convertFormToAPIIP(ipDetail, techId || technologyId);
          const result = await createIntellectualProperty(apiData);
          results.push(result);
        }

        setSavedIPDetails((prev) => [...prev, ...results]);
        return results;
      } catch (err: any) {
        setError(err.message || "Không thể lưu các thông tin sở hữu trí tuệ");
        console.error("Save all IP details error:", err);
        return results; // Return partial results
      } finally {
        setLoading(false);
      }
    },
    [convertFormToAPIIP, technologyId]
  );

  // Update an existing IP detail
  const updateIPDetail = useCallback(
    async (
      ipId: string,
      ipDetail: IPDetail
    ): Promise<IntellectualProperty | null> => {
      setLoading(true);
      setError("");

      try {
        const apiData = convertFormToAPIIP(ipDetail);
        const result = await updateIntellectualProperty(ipId, apiData);

        setSavedIPDetails((prev) =>
          prev.map((ip) => (ip.id === ipId ? result : ip))
        );
        return result;
      } catch (err: any) {
        setError(err.message || "Không thể cập nhật thông tin sở hữu trí tuệ");
        console.error("Update IP detail error:", err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [convertFormToAPIIP]
  );

  // Delete an IP detail
  const deleteIPDetail = useCallback(async (ipId: string): Promise<boolean> => {
    setLoading(true);
    setError("");

    try {
      await deleteIntellectualProperty(ipId);
      setSavedIPDetails((prev) => prev.filter((ip) => ip.id !== ipId));
      return true;
    } catch (err: any) {
      setError(err.message || "Không thể xóa thông tin sở hữu trí tuệ");
      console.error("Delete IP detail error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Save IP details as draft (for temporary storage)
  const saveAsDraft = useCallback(
    async (ipDetails: IPDetail[], techId?: string): Promise<boolean> => {
      // For draft saving, we might want to store in localStorage or a draft API endpoint
      // For now, let's save to localStorage
      try {
        const draftKey = `ip_draft_${techId || technologyId || "new"}`;
        localStorage.setItem(draftKey, JSON.stringify(ipDetails));
        return true;
      } catch (err) {
        console.error("Save draft error:", err);
        return false;
      }
    },
    [technologyId]
  );

  // Load IP details from draft
  const loadFromDraft = useCallback(
    (techId?: string): IPDetail[] => {
      try {
        const draftKey = `ip_draft_${techId || technologyId || "new"}`;
        const draftData = localStorage.getItem(draftKey);

        if (draftData) {
          return JSON.parse(draftData) as IPDetail[];
        }
        return [];
      } catch (err) {
        console.error("Load draft error:", err);
        return [];
      }
    },
    [technologyId]
  );

  // Clear draft data
  const clearDraft = useCallback(
    (techId?: string) => {
      try {
        const draftKey = `ip_draft_${techId || technologyId || "new"}`;
        localStorage.removeItem(draftKey);
      } catch (err) {
        console.error("Clear draft error:", err);
      }
    },
    [technologyId]
  );

  const clearError = useCallback(() => {
    setError("");
  }, []);

  return {
    loading,
    error,
    savedIPDetails,
    loadIPDetails,
    saveIPDetail,
    saveAllIPDetails,
    updateIPDetail,
    deleteIPDetail,
    saveAsDraft,
    loadFromDraft,
    clearDraft,
    clearError,
  };
};
