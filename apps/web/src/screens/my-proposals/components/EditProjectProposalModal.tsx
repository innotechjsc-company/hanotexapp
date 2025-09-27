"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { ProjectPropose } from "@/types/project-propose";
import { InputNumber } from "antd";

interface EditProjectProposalModalProps {
  open: boolean;
  onClose: () => void;
  proposal: ProjectPropose | null;
  onSubmit: (updatedProposal: Partial<ProjectPropose>) => void;
}

export default function EditProjectProposalModal({
  open,
  onClose,
  proposal,
  onSubmit,
}: EditProjectProposalModalProps) {
  const [formData, setFormData] = useState({
    investor_capacity: "",
    investment_amount: undefined as number | undefined,
    investment_ratio: undefined as number | undefined,
    investment_type: "",
    investment_benefits: "",
  });

  useEffect(() => {
    if (proposal) {
      setFormData({
        investor_capacity: proposal.investor_capacity || "",
        investment_amount: proposal.investment_amount || undefined,
        investment_ratio: proposal.investment_ratio || undefined,
        investment_type: proposal.investment_type || "",
        investment_benefits: proposal.investment_benefits || "",
      });
    }
  }, [proposal]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (name: string, value: number | null) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal) return;

    const updatedData: Partial<ProjectPropose> = {
      investor_capacity: formData.investor_capacity,
      investment_amount: formData.investment_amount,
      investment_ratio: formData.investment_ratio,
      investment_type: formData.investment_type,
      investment_benefits: formData.investment_benefits,
    };

    onSubmit(updatedData);
  };

  if (!open || !proposal) return null;

  const project = proposal.project;
  const projectTitle =
    typeof project === "string"
      ? "Dự án"
      : project?.name || "Dự án";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Sửa đề xuất đầu tư dự án
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Project Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700">Dự án:</p>
            <p className="text-sm text-gray-600">{projectTitle}</p>
          </div>

          {/* Investor Capacity */}
          <div>
            <label
              htmlFor="investor_capacity"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Năng lực nhà đầu tư
            </label>
            <textarea
              id="investor_capacity"
              name="investor_capacity"
              rows={3}
              value={formData.investor_capacity}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mô tả năng lực tài chính và kinh nghiệm của nhà đầu tư..."
            />
          </div>

          {/* Investment Amount and Ratio Row */}
          <div className="flex gap-4">
            {/* Investment Amount */}
            <div className="flex-1">
              <label
                htmlFor="investment_amount"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số tiền đầu tư (VNĐ) *
              </label>
              <InputNumber
                id="investment_amount"
                name="investment_amount"
                required
                min={0}
                step={1000000}
                style={{ width: "100%" }}
                formatter={(value: any) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: any) =>
                  Number(value!.replace(/\$\s?|(,*)/g, "")) as any
                }
                value={formData.investment_amount}
                onChange={(value) => handleNumberChange("investment_amount", value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số tiền đầu tư..."
              />
            </div>

            {/* Investment Ratio */}
            <div className="flex-1">
              <label
                htmlFor="investment_ratio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tỷ lệ sở hữu (%) *
              </label>
              <InputNumber
                id="investment_ratio"
                name="investment_ratio"
                required
                min={0}
                max={100}
                step={0.1}
                value={formData.investment_ratio}
                onChange={(value) => handleNumberChange("investment_ratio", value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tỷ lệ sở hữu..."
              />
            </div>
          </div>

          {/* Investment Type */}
          <div>
            <label
              htmlFor="investment_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Hình thức đầu tư
            </label>
            <textarea
              id="investment_type"
              name="investment_type"
              rows={3}
              value={formData.investment_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập hình thức đầu tư..."
            />
          </div>

          {/* Investment Benefits */}
          <div>
            <label
              htmlFor="investment_benefits"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lợi ích đầu tư
            </label>
            <textarea
              id="investment_benefits"
              name="investment_benefits"
              rows={3}
              value={formData.investment_benefits}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mô tả lợi ích và giá trị mang lại cho dự án..."
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
              Cập nhật đề xuất đầu tư
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
