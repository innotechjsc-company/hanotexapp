"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Propose } from "@/types/propose";

interface EditDemandProposalModalProps {
  open: boolean;
  onClose: () => void;
  proposal: Propose | null;
  onSubmit: (updatedProposal: Partial<Propose>) => void;
}

export default function EditDemandProposalModal({
  open,
  onClose,
  proposal,
  onSubmit,
}: EditDemandProposalModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    estimated_cost: "",
    execution_time: "",
  });

  useEffect(() => {
    if (proposal) {
      setFormData({
        title: proposal.title || "",
        description: proposal.description || "",
        estimated_cost: proposal.estimated_cost?.toString() || "",
        execution_time: proposal.execution_time || "",
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

    const updatedData: Partial<Propose> = {
      title: formData.title,
      description: formData.description,
      estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : undefined,
      execution_time: formData.execution_time,
    };

    onSubmit(updatedData);
  };

  if (!open || !proposal) return null;

  const demand = proposal.demand;
  const technology = proposal.technology;
  const demandTitle = typeof demand === "string" ? "Nhu cầu" : demand?.title || "Nhu cầu";
  const technologyTitle = typeof technology === "string" ? "Công nghệ" : technology?.title || "Công nghệ";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Sửa đề xuất nhu cầu
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Demand & Technology Info */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Nhu cầu:</p>
              <p className="text-sm text-gray-600">{demandTitle}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Công nghệ:</p>
              <p className="text-sm text-gray-600">{technologyTitle}</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tiêu đề đề xuất *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập tiêu đề đề xuất..."
            />
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

          {/* Estimated Cost */}
          <div>
            <label
              htmlFor="estimated_cost"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chi phí ước tính (VNĐ) *
            </label>
            <input
              id="estimated_cost"
              name="estimated_cost"
              type="number"
              required
              min="0"
              step="1000"
              value={formData.estimated_cost}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập chi phí ước tính..."
            />
          </div>

          {/* Execution Time */}
          <div>
            <label
              htmlFor="execution_time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Thời gian thực hiện *
            </label>
            <input
              id="execution_time"
              name="execution_time"
              type="text"
              required
              value={formData.execution_time}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ví dụ: 3 tháng, 6 tuần..."
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
