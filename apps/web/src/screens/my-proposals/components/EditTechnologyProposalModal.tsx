"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { TechnologyPropose } from "@/types/technology-propose";

interface EditTechnologyProposalModalProps {
  open: boolean;
  onClose: () => void;
  proposal: TechnologyPropose | null;
  onSubmit: (updatedProposal: Partial<TechnologyPropose>) => void;
}

export default function EditTechnologyProposalModal({
  open,
  onClose,
  proposal,
  onSubmit,
}: EditTechnologyProposalModalProps) {
  const [formData, setFormData] = useState({
    description: "",
    budget: "",
  });

  useEffect(() => {
    if (proposal) {
      setFormData({
        description: proposal.description || "",
        budget: proposal.budget?.toString() || "",
      });
    }
  }, [proposal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal) return;

    const updatedData: Partial<TechnologyPropose> = {
      description: formData.description,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
    };

    onSubmit(updatedData);
  };

  if (!open || !proposal) return null;

  const technology = proposal.technology;
  const technologyTitle =
    typeof technology === "string"
      ? "Công nghệ"
      : technology?.title || "Công nghệ";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Sửa đề xuất chuyển giao công nghệ
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Technology Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Công nghệ:</p>
            <p className="text-sm text-gray-600">{technologyTitle}</p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mô tả đề xuất *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập mô tả đề xuất của bạn..."
            />
          </div>

          {/* Budget */}
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngân sách dự kiến (VNĐ) *
            </label>
            <input
              id="budget"
              name="budget"
              type="number"
              required
              min="0"
              step="1000"
              value={formData.budget}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập ngân sách dự kiến..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Cập nhật đề xuất
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
