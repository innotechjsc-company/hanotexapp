"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, ReloadOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { getServiceTickets, createServiceTicket, deleteServiceTicket } from "@/api/service-ticket";
import { getServices } from "@/api/services";
import type { Service } from "@/types/services";
import type { ServiceTicket } from "@/types/service-ticket";
import { useAuthStore } from "@/store/auth";
import dayjs from "dayjs";

type EditableServiceTicket = Partial<ServiceTicket> & { id?: string };

type PaginationState = {
  current: number;
  pageSize: number;
  total?: number;
};

const statusColorMap: Record<string, string> = {
  pending: "gold",
  processing: "blue",
  completed: "green",
  cancelled: "red",
  PENDING: "gold",
  PROCESSING: "blue",
  COMPLETED: "green",
};

export default function MyServiceTicketsPage() {
  const user = useAuthStore((state) => state.user);

  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [current, setCurrent] = useState<EditableServiceTicket | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ current: 1, pageSize: 10 });
  const [search, setSearch] = useState("");

  const [form] = Form.useForm();

  const fetchServices = useCallback(async () => {
    try {
      const res = await getServices({ search: "" }, { limit: 100, page: 1, sort: "-createdAt" });
      const list = (res as any)?.docs || (res as any)?.data || (Array.isArray(res) ? res : []) || [];
      setServices(list as Service[]);
    } catch (err) {
      // ignore quietly
    }
  }, []);

  const fetchTickets = useCallback(
    async (page = 1, pageSize = 10) => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const res = await getServiceTickets(
          { userId: String(user.id), search: search.trim() || undefined },
          { page, limit: pageSize, sort: "-createdAt" }
        );
        const anyRes = res as any;
        const list: ServiceTicket[] = anyRes?.docs || anyRes?.data || (Array.isArray(res) ? (res as any) : []) || [];
        setTickets(list);
        setPagination((p) => ({ ...p, current: page, pageSize, total: anyRes?.totalDocs || list?.length }));
      } catch (error: any) {
        message.error(error?.message || "Không thể tải danh sách phiếu dịch vụ");
      } finally {
        setLoading(false);
      }
    },
    [user?.id, search]
  );

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    fetchTickets(pagination.current, pagination.pageSize);
  }, [fetchTickets]);

  const onCreate = async () => {
    try {
      const values = await form.validateFields();
      if (!user?.id) {
        message.warning("Bạn cần đăng nhập để tạo phiếu dịch vụ");
        return;
      }
      setCreating(true);
      // Backend (Payload) fields: service, user, description, optional others.
      const payload: any = {
        service: values.service,
        user: user.id,
        description: values.description,
        // Provide minimal required fields if backend schema enforces them
        responsible_user: user.id,
        implementers: [user.id],
        status: "pending",
      };
      await createServiceTicket(payload);
      message.success("Tạo phiếu dịch vụ thành công");
      setCreateModalOpen(false);
      form.resetFields();
      fetchTickets(pagination.current, pagination.pageSize);
    } catch (error: any) {
      if (error?.errorFields) return; // form validation error
      message.error(error?.message || "Tạo phiếu dịch vụ thất bại");
    } finally {
      setCreating(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteServiceTicket(id);
      message.success("Đã xoá phiếu dịch vụ");
      fetchTickets(pagination.current, pagination.pageSize);
    } catch (error: any) {
      message.error(error?.message || "Xoá thất bại");
    }
  };

  const onTableChange = (pag: any) => {
    const { current, pageSize } = pag;
    setPagination((p) => ({ ...p, current, pageSize }));
    fetchTickets(current, pageSize);
  };

  const columns: ColumnsType<ServiceTicket & { key: string }> = useMemo(
    () => [
      {
        title: "Dịch vụ",
        dataIndex: ["service"],
        key: "service",
        render: (value: any) => {
          if (!value) return "-";
          if (typeof value === "string") {
            const svc = services.find((s) => String(s.id) === String(value));
            return svc?.name || value;
          }
          return value?.name || "-";
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status?: string) => (
          <Tag color={status ? statusColorMap[status] : undefined}>{status || "pending"}</Tag>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (d?: string) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "-"),
      },
      {
        title: "Hành động",
        key: "action",
        render: (_, record) => (
          <Space>
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrent(record);
                setViewModalOpen(true);
              }}
            >
              Xem
            </Button>
            <Popconfirm
              title="Xoá phiếu này?"
              okText="Xoá"
              cancelText="Huỷ"
              onConfirm={() => record?.id && onDelete(String(record.id))}
            >
              <Button danger icon={<DeleteOutlined />}>Xoá</Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [services]
  );

  const dataSource = useMemo(
    () =>
      (tickets || []).map((t) => ({
        key: String((t as any).id || (t as any)._id || Math.random()),
        ...t,
      })),
    [tickets]
  );

  return (
    <div style={{ padding: 16 }}>
      <Card
        title="Phiếu dịch vụ của tôi"
        extra={
          <Space>
            <Input.Search
              placeholder="Tìm theo mô tả"
              allowClear
              onSearch={(val) => {
                setSearch(val);
                setPagination((p) => ({ ...p, current: 1 }));
                fetchTickets(1, pagination.pageSize);
              }}
              style={{ width: 260 }}
            />
            <Button icon={<ReloadOutlined />} onClick={() => fetchTickets(pagination.current, pagination.pageSize)}>
              Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalOpen(true)}>
              Tạo phiếu
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total }}
          onChange={onTableChange}
          rowKey={(r) => String((r as any).id || (r as any)._id || r.key)}
        />
      </Card>

      <Modal
        title="Tạo phiếu dịch vụ"
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={onCreate}
        okText="Tạo"
        confirmLoading={creating}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="service" label="Dịch vụ" rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}>
            <Select
              placeholder="Chọn dịch vụ"
              showSearch
              optionFilterProp="label"
              options={services.map((s) => ({ label: s.name, value: String(s.id) }))}
            />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input.TextArea rows={4} placeholder="Mô tả yêu cầu của bạn" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết phiếu dịch vụ"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={<Button onClick={() => setViewModalOpen(false)}>Đóng</Button>}
        destroyOnClose
      >
        {current ? (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <strong>Dịch vụ:</strong> {(() => {
                const sv = current.service as any;
                if (!sv) return "-";
                if (typeof sv === "string") {
                  const svc = services.find((s) => String(s.id) === String(sv));
                  return svc?.name || sv;
                }
                return (sv as any)?.name || "-";
              })()}
            </div>
            <div>
              <strong>Trạng thái:</strong> {current.status || "pending"}
            </div>
            {Boolean((current as any)?.description) && (
              <div>
                <strong>Mô tả:</strong> {(current as any).description}
              </div>
            )}
            <div>
              <strong>Ngày tạo:</strong> {current.createdAt ? dayjs(current.createdAt as any).format("DD/MM/YYYY HH:mm") : "-"}
            </div>
          </Space>
        ): null}
      </Modal>
    </div>
  );
}
