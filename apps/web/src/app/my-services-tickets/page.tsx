"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message, Upload, Tabs } from "antd";
import type { ColumnsType } from "antd/es/table";
import { PlusOutlined, ReloadOutlined, EyeOutlined, DeleteOutlined, UploadOutlined, EditOutlined, MessageOutlined } from "@ant-design/icons";
import { getServiceTickets, createServiceTicket, deleteServiceTicket, updateServiceTicket } from "@/api/service-ticket";
import { getServices } from "@/api/services";
import { getTechnologiesByUser } from "@/api/technologies";
import { getProjectsByUser } from "@/api/projects";
import { uploadFiles } from "@/api/media";
import type { Service } from "@/types/services";
import type { ServiceTicket } from "@/types/service-ticket";
import type { Technology } from "@/types/technologies";
import type { Project } from "@/types/project";
import { useAuthStore } from "@/store/auth";
import dayjs from "dayjs";
import { getUserByRoleAdmin, getUsers } from "@/api/user";
import { useRouter } from "next/navigation";
import FileUpload, { type FileUploadItem } from "@/components/input/FileUpload";
import downloadService from "@/services/downloadService";

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
  CANCELLED: "red",
};

const statusLabelMap: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
};

export default function MyServiceTicketsPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [processingTickets, setProcessingTickets] = useState<ServiceTicket[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [userTechnologies, setUserTechnologies] = useState<Technology[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingLoading, setProcessingLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState<EditableServiceTicket | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({ current: 1, pageSize: 10 });
  const [processingPagination, setProcessingPagination] = useState<PaginationState>({ current: 1, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [processingSearch, setProcessingSearch] = useState("");

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchServices = useCallback(async () => {
    try {
      const res = await getServices({ search: "" }, { limit: 100, page: 1, sort: "-createdAt" });
      const list = (res as any)?.docs || (res as any)?.data || (Array.isArray(res) ? res : []) || [];
      setServices(list as Service[]);
    } catch (err) {
      // ignore quietly
    }
  }, []);

  const fetchUserTechnologies = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getTechnologiesByUser(String(user.id), { limit: 100, page: 1, sort: "-createdAt" });
      const list = (res as any)?.docs || (res as any)?.data || (Array.isArray(res) ? res : []) || [];
      setUserTechnologies(list as Technology[]);
    } catch (err) {
      // ignore quietly
    }
  }, [user?.id]);

  const fetchUserProjects = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getProjectsByUser(String(user.id), { limit: 100, page: 1, sort: "-createdAt" });
      const list = (res as any)?.docs || (res as any)?.data || (Array.isArray(res) ? res : []) || [];
      setUserProjects(list as Project[]);
    } catch (err) {
      // ignore quietly
    }
  }, [user?.id]);

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

  const fetchProcessingTickets = useCallback(
    async (page = 1, pageSize = 10) => {
      if (!user?.id) return;
      setProcessingLoading(true);
      try {
        const res = await getServiceTickets(
          { implementerId: String(user.id), search: processingSearch.trim() || undefined },
          { page, limit: pageSize, sort: "-createdAt" }
        );
        const anyRes = res as any;
        const list: ServiceTicket[] = anyRes?.docs || anyRes?.data || (Array.isArray(res) ? (res as any) : []) || [];
        setProcessingTickets(list);
        setProcessingPagination((p) => ({ ...p, current: page, pageSize, total: anyRes?.totalDocs || list?.length }));
      } catch (error: any) {
        message.error(error?.message || "Không thể tải danh sách phiếu dịch vụ cần xử lý");
      } finally {
        setProcessingLoading(false);
      }
    },
    [user?.id, processingSearch]
  );

  useEffect(() => {
    fetchServices();
    fetchUserTechnologies();
    fetchUserProjects();
  }, [fetchServices, fetchUserTechnologies, fetchUserProjects]);

  useEffect(() => {
    fetchTickets(pagination.current, pagination.pageSize);
  }, [fetchTickets]);

  useEffect(() => {
    fetchProcessingTickets(processingPagination.current, processingPagination.pageSize);
  }, [fetchProcessingTickets]);

  const onCreate = async () => {
    try {
      const values = await form.validateFields();
      if (!user?.id) {
        message.warning("Bạn cần đăng nhập để tạo phiếu dịch vụ");
        return;
      }
      // get user role admin
      const userAdmin = await getUserByRoleAdmin();
      const userAdminList = (userAdmin as any)?.docs || (userAdmin as any)?.data || (Array.isArray(userAdmin) ? userAdmin : []) || [];
      const userAdminId = userAdminList[0]?.id;

      setCreating(true);
      // Backend (Payload) fields: service, user, description, optional others.
      const payload: any = {
        service: values.service,
        user: user.id,
        description: values.description,
        // Provide minimal required fields if backend schema enforces them
        responsible_user: user.id,
        implementers: [userAdminId],
        status: "pending",
        // Add new fields
        technologies: values.technologies || [],
        project: values.project || undefined,
        document: values.documentId || undefined,
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

  const onEdit = async () => {
    try {
      const values = await editForm.validateFields();
      if (!current?.id) {
        message.error("Không tìm thấy ID phiếu dịch vụ");
        return;
      }
      setEditing(true);
      
      const payload: any = {
        service: values.service,
        description: values.description,
        technologies: values.technologies || [],
        project: values.project || undefined,
        document: values.documentId || undefined,
      };
      
      await updateServiceTicket(String(current.id), payload);
      message.success("Cập nhật phiếu dịch vụ thành công");
      setEditModalOpen(false);
      editForm.resetFields();
      fetchTickets(pagination.current, pagination.pageSize);
    } catch (error: any) {
      if (error?.errorFields) return; // form validation error
      message.error(error?.message || "Cập nhật phiếu dịch vụ thất bại");
    } finally {
      setEditing(false);
    }
  };

  const openEditModal = (record: ServiceTicket) => {
    setCurrent(record);
    setEditModalOpen(true);
    // Populate form with current values
    editForm.setFieldsValue({
      service: typeof record.service === 'string' ? record.service : record.service?.id,
      description: record.description,
      technologies: Array.isArray(record.technologies) 
        ? record.technologies.map(tech => typeof tech === 'string' ? tech : tech?.id).filter(Boolean)
        : [],
      project: typeof record.project === 'string' ? record.project : record.project?.id,
      document: record.document,
    });
  };

  const onTableChange = (pag: any) => {
    const { current, pageSize } = pag;
    setPagination((p) => ({ ...p, current, pageSize }));
    fetchTickets(current, pageSize);
  };

  const onProcessingTableChange = (pag: any) => {
    const { current, pageSize } = pag;
    setProcessingPagination((p) => ({ ...p, current, pageSize }));
    fetchProcessingTickets(current, pageSize);
  };

  const updateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      await updateServiceTicket(ticketId, { status: newStatus as any });
      message.success("Cập nhật trạng thái thành công");
      fetchProcessingTickets(processingPagination.current, processingPagination.pageSize);
    } catch (error: any) {
      message.error(error?.message || "Cập nhật trạng thái thất bại");
    }
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
        title: "Công nghệ",
        dataIndex: "technologies",
        key: "technologies",
        render: (value: any) => {
          if (!value || !Array.isArray(value) || value.length === 0) return "-";
          return value.map((tech: any, index: number) => {
            const techName = typeof tech === "string" 
              ? userTechnologies.find((t) => String(t.id) === String(tech))?.title || tech
              : tech?.title || "-";
            return (
              <Tag key={index} color="blue">
                {techName}
              </Tag>
            );
          });
        },
      },
      {
        title: "Dự án",
        dataIndex: "project",
        key: "project",
        render: (value: any) => {
          if (!value) return "-";
          if (typeof value === "string") {
            const proj = userProjects.find((p) => String(p.id) === String(value));
            return proj?.name || value;
          }
          return value?.name || "-";
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status?: string) => (
          <Tag color={status ? statusColorMap[status] : undefined}>
            {status ? statusLabelMap[status] || status : "Chờ xử lý"}
          </Tag>
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
            <Button
              icon={<MessageOutlined />}
              onClick={() => {
                if (record?.id) {
                  router.push(`/my-services-tickets/negotiations/${record.id}`);
                }
              }}
            >
              Trao đổi
            </Button>
            {record.status === "pending" && (
              <Button
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
              >
                Sửa
              </Button>
            )}
            {
              // status is completed or cancelled
              (record.status !== "completed" && record.status !== "cancelled") && (
                <Popconfirm
              title="Xoá phiếu này?"
              okText="Xoá"
              cancelText="Huỷ"
              onConfirm={() => record?.id && onDelete(String(record.id))}
            >
              <Button danger icon={<DeleteOutlined />}>Xoá</Button>
            </Popconfirm>
              )
            }
           
          </Space>
        ),
      },
    ],
    [services, userTechnologies, userProjects]
  );

  const processingColumns: ColumnsType<ServiceTicket & { key: string }> = useMemo(
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
        title: "Người yêu cầu",
        dataIndex: "user",
        key: "user",
        render: (value: any) => {
          if (!value) return "-";
          if (typeof value === "string") {
            return "Người dùng";
          }
          return value?.name || value?.email || "Người dùng";
        },
      },
      {
        title: "Công nghệ",
        dataIndex: "technologies",
        key: "technologies",
        render: (value: any) => {
          if (!value || !Array.isArray(value) || value.length === 0) return "-";
          return value.map((tech: any, index: number) => {
            const techName = typeof tech === "string" 
              ? userTechnologies.find((t) => String(t.id) === String(tech))?.title || tech
              : tech?.title || "-";
            return (
              <Tag key={index} color="blue">
                {techName}
              </Tag>
            );
          });
        },
      },
      {
        title: "Dự án",
        dataIndex: "project",
        key: "project",
        render: (value: any) => {
          if (!value) return "-";
          if (typeof value === "string") {
            const proj = userProjects.find((p) => String(p.id) === String(value));
            return proj?.name || value;
          }
          return value?.name || "-";
        },
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (status: string | undefined, record: any) => {
          const currentStatus = status || "pending";
          const isCompletedOrCancelled = currentStatus === "completed" || currentStatus === "cancelled";
          
          if (isCompletedOrCancelled) {
            return (
              <Tag color={statusColorMap[currentStatus]}>
                {statusLabelMap[currentStatus] || currentStatus}
              </Tag>
            );
          }
          
          return (
            <Select
              value={currentStatus}
              onChange={(value) => updateTicketStatus(String(record.id), value)}
              style={{ width: 120 }}
            >
              <Select.Option value="pending">Chờ xử lý</Select.Option>
              <Select.Option value="processing">Đang xử lý</Select.Option>
              <Select.Option value="completed">Đã hoàn thành</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
            </Select>
          );
        },
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
            <Button
              icon={<MessageOutlined />}
              onClick={() => {
                if (record?.id) {
                  router.push(`/my-services-tickets/negotiations/${record.id}`);
                }
              }}
            >
              Trao đổi
            </Button>
          </Space>
        ),
      },
    ],
    [services, userTechnologies, userProjects]
  );

  const dataSource = useMemo(
    () =>
      (tickets || []).map((t) => ({
        key: String((t as any).id || (t as any)._id || Math.random()),
        ...t,
      })),
    [tickets]
  );

  const processingDataSource = useMemo(
    () =>
      (processingTickets || []).map((t) => ({
        key: String((t as any).id || (t as any)._id || Math.random()),
        ...t,
      })),
    [processingTickets]
  );

  const myTicketsTab = (
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
  );

  const processingTicketsTab = (
    <Card
      title="Dịch vụ cần xử lý"
      extra={
        <Space>
          <Input.Search
            placeholder="Tìm theo mô tả"
            allowClear
            onSearch={(val) => {
              setProcessingSearch(val);
              setProcessingPagination((p) => ({ ...p, current: 1 }));
              fetchProcessingTickets(1, processingPagination.pageSize);
            }}
            style={{ width: 260 }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => fetchProcessingTickets(processingPagination.current, processingPagination.pageSize)}>
            Tải lại
          </Button>
        </Space>
      }
    >
      <Table
        columns={processingColumns}
        dataSource={processingDataSource}
        loading={processingLoading}
        pagination={{ current: processingPagination.current, pageSize: processingPagination.pageSize, total: processingPagination.total }}
        onChange={onProcessingTableChange}
        rowKey={(r) => String((r as any).id || (r as any)._id || r.key)}
      />
    </Card>
  );

  return (
    <div style={{ padding: 16 }}>
      <Tabs
        defaultActiveKey="my-tickets"
        items={[
          {
            key: "my-tickets",
            label: "Phiếu dịch vụ của tôi",
            children: myTicketsTab,
          },
          {
            key: "processing-tickets",
            label: "Dịch vụ cần xử lý",
            children: processingTicketsTab,
          },
        ]}
      />

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
          <Form.Item name="technologies" label="Công nghệ của tôi">
            <Select
              mode="multiple"
              placeholder="Chọn công nghệ (tùy chọn)"
              showSearch
              optionFilterProp="label"
              allowClear
              options={userTechnologies.map((t) => ({ label: t.title, value: String(t.id) }))}
            />
          </Form.Item>
          <Form.Item name="project" label="Dự án của tôi">
            <Select
              placeholder="Chọn dự án (tùy chọn)"
              showSearch
              optionFilterProp="label"
              allowClear
              options={userProjects.map((p) => ({ label: p.name, value: String(p.id) }))}
            />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input.TextArea rows={4} placeholder="Mô tả yêu cầu của bạn" />
          </Form.Item>
          <Form.Item name="document" label="Tài liệu đính kèm">
            <FileUpload
              variant="button"
              buttonText="Chọn tài liệu"
              multiple={false}
              maxCount={1}
              allowedTypes={["document", "image"]}
              maxSize={50 * 1024 * 1024} // 50MB
              onChange={useCallback((files: FileUploadItem[]) => {
                // Store the file list in the form, and extract the document ID for the API
                form.setFieldValue('document', files);
                if (files.length > 0 && files[0].uploadStatus === "done") {
                  form.setFieldValue('documentId', String(files[0].id));
                } else {
                  form.setFieldValue('documentId', undefined);
                }
              }, [form])}
              onUploadSuccess={useCallback((file: File, media: any) => {
                message.success(`Đã upload tài liệu: ${file.name}`);
              }, [])}
              onUploadError={useCallback((file: File, error: string) => {
                message.error(`Upload tài liệu thất bại: ${file.name} - ${error}`);
              }, [])}
            />
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
            {current.technologies && Array.isArray(current.technologies) && current.technologies.length > 0 && (
              <div>
                <strong>Công nghệ:</strong> {current.technologies.map((tech: any, index: number) => {
                  const techName = typeof tech === "string" 
                    ? userTechnologies.find((t) => String(t.id) === String(tech))?.title || tech
                    : tech?.title || "-";
                  return (
                    <Tag key={index} color="blue" style={{ margin: '2px' }}>
                      {techName}
                    </Tag>
                  );
                })}
              </div>
            )}
            {current.project && (
              <div>
                <strong>Dự án:</strong> {(() => {
                  const proj = current.project as any;
                  if (!proj) return "-";
                  if (typeof proj === "string") {
                    const project = userProjects.find((p) => String(p.id) === String(proj));
                    return project?.name || proj;
                  }
                  return (proj as any)?.name || "-";
                })()}
              </div>
            )}
            <div>
              <strong>Trạng thái:</strong> {current.status ? statusLabelMap[current.status] || current.status : "Chờ xử lý"}
            </div>
            {Boolean((current as any)?.description) && (
              <div>
                <strong>Mô tả:</strong> {(current as any).description}
              </div>
            )}
            {current.document && (
              <div>
                <strong>Tài liệu đính kèm:</strong> 
                <Button 
                  type="link" 
                  onClick={() => {
                    // You can add logic to download/view the document here
                    // message.info("Tính năng tải xuống tài liệu đang được phát triển");
                    if( typeof current.document === "object" && current.document?.url && current.document?.filename) {
                      downloadService.downloadByUrl(current.document.url, current.document.filename);
                    }
                  }}
                >
                  Tải xuống tài liệu
                </Button>
              </div>
            )}
            <div>
              <strong>Ngày tạo:</strong> {current.createdAt ? dayjs(current.createdAt as any).format("DD/MM/YYYY HH:mm") : "-"}
            </div>
          </Space>
        ): null}
      </Modal>

      <Modal
        title="Sửa phiếu dịch vụ"
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        onOk={onEdit}
        okText="Cập nhật"
        confirmLoading={editing}
        destroyOnClose
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item name="service" label="Dịch vụ" rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}>
            <Select
              placeholder="Chọn dịch vụ"
              showSearch
              optionFilterProp="label"
              options={services.map((s) => ({ label: s.name, value: String(s.id) }))}
            />
          </Form.Item>
          <Form.Item name="technologies" label="Công nghệ của tôi">
            <Select
              mode="multiple"
              placeholder="Chọn công nghệ (tùy chọn)"
              showSearch
              optionFilterProp="label"
              allowClear
              options={userTechnologies.map((t) => ({ label: t.title, value: String(t.id) }))}
            />
          </Form.Item>
          <Form.Item name="project" label="Dự án của tôi">
            <Select
              placeholder="Chọn dự án (tùy chọn)"
              showSearch
              optionFilterProp="label"
              allowClear
              options={userProjects.map((p) => ({ label: p.name, value: String(p.id) }))}
            />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
            <Input.TextArea rows={4} placeholder="Mô tả yêu cầu của bạn" />
          </Form.Item>
          <Form.Item name="document" label="Tài liệu đính kèm">
            <FileUpload
              variant="button"
              buttonText="Chọn tài liệu"
              multiple={false}
              maxCount={1}
              allowedTypes={["document", "image"]}
              maxSize={50 * 1024 * 1024} // 50MB
              onChange={useCallback((files: FileUploadItem[]) => {
                // Store the file list in the form, and extract the document ID for the API
                editForm.setFieldValue('document', files);
                if (files.length > 0 && files[0].uploadStatus === "done") {
                  editForm.setFieldValue('documentId', String(files[0].id));
                } else {
                  editForm.setFieldValue('documentId', undefined);
                }
              }, [editForm])}
              onUploadSuccess={useCallback((file: File, media: any) => {
                message.success(`Đã upload tài liệu: ${file.name}`);
              }, [])}
              onUploadError={useCallback((file: File, error: string) => {
                message.error(`Upload tài liệu thất bại: ${file.name} - ${error}`);
              }, [])}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
