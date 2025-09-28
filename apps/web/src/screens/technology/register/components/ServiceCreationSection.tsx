"use client";

/**
 * ServiceCreationSection Component
 * 
 * This component uses CMS APIs exclusively via /src/api/services
 * No calls to /app/api routes are made from this component.
 */

import React, { forwardRef, useImperativeHandle, useState, useCallback, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Chip } from "@heroui/react";
import { Form, Input, Select, message } from "antd";
import { Plus, X, Trash2 } from "lucide-react";
import { getServices } from "@/api/services";
import type { Service } from "@/types/services";
import { ServiceTicket } from "@/types/service-ticket";

export interface ServiceCreationData {
  name: string;
  description: string;
  category?: string;
  price?: number;
  duration?: string;
  requirements?: string;
}

export interface ServiceCreationSectionRef {
  getData: () => ServiceCreationData[] | null;
  getCreatedServices: () => Service[];
  reset: () => void;
}

interface ServiceCreationSectionProps {
  onChange?: (data: ServiceTicket[] | null) => void;
}

const ServiceCreationSection = forwardRef<ServiceCreationSectionRef, ServiceCreationSectionProps>(
  ({ onChange }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [form] = Form.useForm();

  // Fetch available services (from CMS)
  const fetchServices = useCallback(async () => {
    try {
      console.log('✅ ServiceCreationSection: Fetching services from CMS API');
      const res = await getServices({ search: "" }, { limit: 100, page: 1, sort: "-createdAt" });
        const list = (res as any)?.docs || (res as any)?.data || (Array.isArray(res) ? res : []) || [];
        setAvailableServices(list as Service[]);
      } catch (err) {
        // ignore quietly
      }
    }, []);

    // Load data on mount
    React.useEffect(() => {
      fetchServices();
    }, [fetchServices]);

    useImperativeHandle(ref, () => ({
      getData: () => {
        if (selectedServices.length === 0) {
          return null;
        }
        return selectedServices.map(service => ({
          name: service.name,
          description: service.description,
        }));
      },
      getCreatedServices: () => selectedServices,
      reset: () => {
        form.resetFields();
        setSelectedServices([]);
        setIsExpanded(false);
      },
    }));

    const handleSelectService = () => {
      try {
        const values = form.getFieldsValue();
        if (!values.service) {
          message.warning("Vui lòng chọn dịch vụ");
          return;
        }

        const selectedService = availableServices.find(s => String(s.id) === String(values.service));
        if (!selectedService) {
          message.error("Không tìm thấy dịch vụ đã chọn");
          return;
        }

        // Check if service already selected
        if (selectedServices.some(s => s.id === selectedService.id)) {
          message.warning("Dịch vụ này đã được chọn");
          return;
        }

        // Add to selected services list
        setSelectedServices(prev => [...prev, selectedService]);
        
        // Reset form
        form.resetFields();
        setIsExpanded(false);
        
        message.success("Đã thêm dịch vụ thành công!");
        console.log("Selected service:", selectedService);
      } catch (error: any) {
        console.error("Select service error:", error);
        message.error(error?.message || "Có lỗi xảy ra khi chọn dịch vụ");
      }
    };

    useEffect(() => {
      if(selectedServices.length === 0) {
        onChange?.([]);
      } else {
        onChange?.(selectedServices.map(service => ({
          service: service.id ?? service.name,
          user: service.description,
          status: "pending",
          responsible_user: "pending",
          implementers: [],
          technologies: [],
          project: undefined,
          description: service.description,
        })));
      }
    }, [selectedServices]);

    const handleCancel = () => {
      form.resetFields();
      setIsExpanded(false);
    };

    const handleRemoveService = (serviceId: string) => {
      setSelectedServices(prev => prev.filter(service => service.id !== serviceId));
      onChange?.(selectedServices.filter(service => service.id !== serviceId).map(service => ({
        service: service.id ?? service.name,
        user: service.description,
        status: "pending",
        responsible_user: "pending",
        implementers: [],
        technologies: [],
        project: undefined,
        description: service.description,
      })));
    };


    return (
      <Card className="sticky top-4 z-40">
        <CardHeader className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chọn dịch vụ (Tùy chọn)
                </h3>
                {selectedServices.length > 0 && (
                  <Chip size="sm" color="primary" variant="flat">
                    {selectedServices.length}
                  </Chip>
                )}
              </div>
              <p className="text-sm text-gray-600">
                Chọn dịch vụ hỗ trợ cho công nghệ này 
              </p>
            </div>
          </div>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:bg-gray-100"
          >
            {isExpanded ? (
              <X className="h-4 w-4 text-gray-600" />
            ) : (
              <Plus className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </CardHeader>

        {/* Selected Services List */}
        {selectedServices.length > 0 && (
          <CardBody className="px-6 py-4 border-t border-gray-200">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Dịch vụ đã chọn:</h4>
              {selectedServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">{service.name}</h5>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                  </div>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => service.id && handleRemoveService(service.id)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardBody>
        )}

        {isExpanded && (
          <CardBody className="px-6 py-4 border-t border-gray-200">
            <Form form={form} layout="vertical">
              <Form.Item 
                name="service" 
                label="Chọn dịch vụ" 
                rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
              >
                <Select
                  placeholder="Chọn dịch vụ"
                  showSearch
                  optionFilterProp="label"
                  allowClear
                  options={availableServices.map((s) => ({ 
                    label: s.name, 
                    value: String(s.id),
                    disabled: selectedServices.some(selected => selected.id === s.id)
                  }))}
                />
              </Form.Item>
              {/* mô tả */}
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={4} placeholder="Nhập mô tả dịch vụ" />
              </Form.Item>

              <div className="flex justify-end space-x-3 pt-2">
                <Button
                  variant="bordered"
                  size="sm"
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  size="sm"
                  onClick={handleSelectService}
                  startContent={<Plus className="h-4 w-4" />}
                >
                  Thêm dịch vụ
                </Button>
              </div>
            </Form>
          </CardBody>
        )}
      </Card>
    );
  }
);

ServiceCreationSection.displayName = "ServiceCreationSection";

export default ServiceCreationSection;
