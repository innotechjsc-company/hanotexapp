"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { getTechnologyById } from "@/api/technologies";
import type { Technology, TechnologyStatus } from "@/types";

export interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
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
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

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
      } catch (e) {
        console.error("Failed to load technology detail", e);
        setError("Có lỗi xảy ra khi tải thông tin công nghệ");
        setTechnology(null);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id]);

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
      rejected: "bg-red-100 text-red-800",
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
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hook up to backend endpoint when available
    console.log("Contact form submitted:", contactForm);
    setShowContactForm(false);
    setContactForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
    });
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
    onOpenContact,
    onCloseContact,
    onContactChange,
    onSubmitContact,
  } as const;
}
