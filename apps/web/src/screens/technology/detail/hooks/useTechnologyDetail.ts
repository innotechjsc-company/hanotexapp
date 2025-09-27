"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { getTechnologyById } from "@/api/technologies";
import { technologyProposeApi } from "@/api/technology-propose";
import { uploadFile } from "@/api/media";
import toastService from "@/services/toastService";
import type { Technology, TechnologyStatus } from "@/types";

export interface ContactFormState {
  description: string;
  document: File | null;
  budget: number | string;
}

export function useTechnologyDetail(id?: string) {
  const { isAuthenticated, user } = useAuthStore();
  const [technology, setTechnology] = useState<
    (Partial<Technology> & Record<string, any>) | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [contactForm, setContactForm] = useState<ContactFormState>({
    description: "",
    document: null,
    budget: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState<boolean>(false);
  const [hasContacted, setHasContacted] = useState<boolean>(false);

  useEffect(() => {
    const run = async () => {
      if (!id) {
        setLoading(false);
        setError("Không tìm thấy công nghệ");
        setTechnology(null);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const data = await getTechnologyById(String(id));
        setTechnology(data as any);

        // Check if user has already contacted about this technology
        if (user?.id) {
          try {
            const existingContacts = await technologyProposeApi.list({
              technology: id,
              user: user.id,
            });

            console.log("Raw API response:", existingContacts);

            // PayloadCMS returns data in 'docs' field, fallback to 'data' field
            let contactsList = [];

            if (existingContacts) {
              // Try different possible response structures
              if (
                (existingContacts as any).docs &&
                Array.isArray((existingContacts as any).docs)
              ) {
                contactsList = (existingContacts as any).docs;
              } else if (
                existingContacts.data &&
                Array.isArray(existingContacts.data)
              ) {
                contactsList = existingContacts.data;
              } else if (Array.isArray(existingContacts)) {
                contactsList = existingContacts;
              }
            }

            console.log("Processed contacts list:", contactsList);
            console.log("Has contacts:", contactsList.length > 0);

            if (contactsList.length > 0) {
              console.log(
                "Setting hasContacted to TRUE - found contacts:",
                contactsList
              );
              setHasContacted(true);
            } else {
              console.log("Setting hasContacted to FALSE - no contacts found");
              setHasContacted(false);
            }
          } catch (contactError) {
            console.error("Failed to check existing contacts:", contactError);
            // Don't show error for this, just assume no contact exists
            console.log("Setting hasContacted to FALSE due to error");
            setHasContacted(false);
          }
        } else {
          console.log("No user ID, setting hasContacted to FALSE");
          setHasContacted(false);
        }
      } catch (e) {
        console.error("Failed to load technology detail", e);
        setError("Có lỗi xảy ra khi tải thông tin công nghệ");
        setTechnology(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, user?.id]);

  const getTrlLabel = (level?: number) => {
    const trlLabels: Record<number, string> = {
      1: "Nguyên lý cơ bản",
      2: "Khái niệm công nghệ",
      3: "Bằng chứng khái niệm",
      4: "Xác thực trong phòng thí nghiệm",
      5: "Xác thực trong môi trường liên quan",
      6: "Trình diễn trong môi trường liên quan",
      7: "Trình diễn trong môi trường vận hành",
      8: "Hệ thống hoàn chỉnh và đủ điều kiện",
      9: "Hệ thống thực tế được chứng minh",
    };
    return level ? trlLabels[level] || `TRL ${level}` : undefined;
  };

  const getStatusLabel = (status: TechnologyStatus) => {
    const statusLabels: Record<TechnologyStatus, string> = {
      draft: "Bản nháp",
      pending: "Chờ phê duyệt",
      approved: "Đã phê duyệt",
      rejected: "Đã từ chối",
      active: "Đang hoạt động",
      inactive: "Không hoạt động",
    };
    return statusLabels[status] || status || "";
  };

  const getStatusColor = (status: TechnologyStatus) => {
    const statusColors: Record<TechnologyStatus, string> = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-gray-100 text-gray-800",
      active: "bg-blue-100 text-blue-800",
      inactive: "bg-gray-100 text-gray-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  const onOpenContact = () => setShowContactForm(true);
  const onCloseContact = () => setShowContactForm(false);

  const onContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target as HTMLInputElement;
    if (name === "document") {
      const input = e.target as HTMLInputElement;
      const file =
        input.files && input.files.length > 0 ? input.files[0] : null;
      setContactForm((prev) => ({ ...prev, document: file }));
      return;
    }
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      if (!id) throw new Error("Thiếu ID công nghệ");

      let documentId: number | string | undefined;
      if (contactForm.document) {
        const uploaded = await uploadFile(contactForm.document);
        documentId = (uploaded as any)?.id ?? (uploaded as any)?._id;
      }

      await technologyProposeApi.create({
        technology: id as any,
        user: (user as any)?.id,
        description: contactForm.description,
        document: documentId as any,
        budget: Number(contactForm.budget) || 0,
      } as any);

      // Show success toast
      toastService.success(
        "Gửi liên hệ thành công!",
        "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất."
      );

      setHasContacted(true);
      setShowContactForm(false);
      setContactForm({
        description: "",
        document: null,
        budget: "",
      });
    } catch (err) {
      console.error("Gửi liên hệ thất bại:", err);
      // Show error toast
      toastService.error(
        "Gửi liên hệ thất bại!",
        "Có lỗi xảy ra. Vui lòng thử lại sau."
      );
    } finally {
      setContactSubmitting(false);
    }
  };

  const categoryName = useMemo(() => {
    const t: any = technology || {};
    return (
      t?.category?.name ||
      t?.category_name ||
      t?.categoryName ||
      t?.category ||
      ""
    );
  }, [technology]);

  return {
    // state
    technology,
    loading,
    error,
    isAuthenticated,
    user,

    // derived
    categoryName,

    // helpers
    getTrlLabel,
    getStatusLabel,
    getStatusColor,

    // contact modal
    showContactForm,
    contactForm,
    contactSubmitting,
    hasContacted,
    onOpenContact,
    onCloseContact,
    onContactChange,
    onSubmitContact,
  } as const;
}
