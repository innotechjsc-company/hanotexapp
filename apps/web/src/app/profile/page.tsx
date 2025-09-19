"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
  Chip,
  Avatar,
  Divider,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tabs,
  Tab,
  Form,
} from "@heroui/react";
import { Alert } from "@heroui/react";
import {
  User as UserIcon,
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  Award,
  FileText,
  Plus,
} from "lucide-react";

// Import API functions and types
import { updateUser, getUserOrganizations } from "@/api/user";
import { createCompany, updateCompany } from "@/api/company";
import {
  createResearchInstitution,
  updateResearchInstitution,
} from "@/api/research-institution";
import type { User } from "@/types/users";
import type { Company } from "@/types/companies";
import type { ResearchInstitution } from "@/types/research-institutions";

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser: updateAuthUser } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("personal");
  const [alertState, setAlertState] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
    visible: boolean;
  }>({ type: "info", message: "", visible: false });

  const showAlert = (
    type: "success" | "error" | "warning" | "info",
    message: string
  ) => {
    setAlertState({ type, message, visible: true });
    setTimeout(() => {
      setAlertState((prev) => ({ ...prev, visible: false }));
    }, 4000);
  };
  const [organizationData, setOrganizationData] = useState<{
    company: Company | null;
    researchInstitution: ResearchInstitution | null;
  }>({ company: null, researchInstitution: null });

  // Modals for organization forms
  const {
    isOpen: isCompanyModalOpen,
    onOpen: onCompanyModalOpen,
    onOpenChange: onCompanyModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isResearchModalOpen,
    onOpen: onResearchModalOpen,
    onOpenChange: onResearchModalOpenChange,
  } = useDisclosure();

  // User profile data
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    idNumber: "",
    bankAccount: "",
  });

  // Company form data
  const [companyData, setCompanyData] = useState<Partial<Company>>({
    company_name: "",
    tax_code: "",
    legal_representative: "",
    contact_email: "",
    contact_phone: "",
    business_license: "",
    website: "",
    production_capacity: "",
    employee_count: 0,
    established_year: new Date().getFullYear(),
    address: {
      street: "",
      city: "",
      state: "",
      country: "Vietnam",
      postal_code: "",
    },
    business_sectors: [],
    is_active: true,
  });
  const [companyErrors, setCompanyErrors] = useState<{
    [K in keyof Partial<Company>]?: string;
  }>({});

  // Research Institution form data
  const [researchData, setResearchData] = useState<
    Partial<ResearchInstitution>
  >({
    institution_name: "",
    institution_code: "",
    governing_body: "",
    institution_type: "UNIVERSITY",
    contact_info: {
      contact_email: "",
      contact_phone: "",
      website: "",
    },
    address: {
      street: "",
      city: "",
      state: "",
      country: "Vietnam",
      postal_code: "",
    },
    research_areas: [],
    research_task_code: "",
    acceptance_report: "",
    research_group: "",
    established_year: new Date().getFullYear(),
    staff_count: 0,
    accreditation_info: {
      accreditation_body: "",
      accreditation_level: "",
      accreditation_date: "",
      accreditation_expiry: "",
    },
    is_active: true,
  });
  const [researchErrors, setResearchErrors] = useState<{
    [K in keyof Partial<ResearchInstitution>]?: string;
  }>({});

  // Validators
  const validateCompany = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!companyData.company_name)
      errors.company_name = "Tên công ty là bắt buộc";
    if (!companyData.tax_code) errors.tax_code = "Mã số thuế là bắt buộc";
    if (!companyData.legal_representative)
      errors.legal_representative = "Người đại diện là bắt buộc";
    setCompanyErrors(errors as any);
    return Object.keys(errors).length === 0;
  };

  const validateResearch = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!researchData.institution_name)
      errors.institution_name = "Tên viện nghiên cứu là bắt buộc";
    if (!researchData.institution_code)
      errors.institution_code = "Mã viện nghiên cứu là bắt buộc";
    if (!researchData.governing_body)
      errors.governing_body = "Cơ quan chủ quản là bắt buộc";
    if (!researchData.institution_type)
      errors.institution_type = "Loại hình là bắt buộc";
    setResearchErrors(errors as any);
    return Object.keys(errors).length === 0;
  };

  // Load organization data
  const loadOrganizationData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getUserOrganizations(user.id);
      setOrganizationData(data);
      // Pre-fill forms with existing data
      if (data.company) {
        setCompanyData(data.company);
      }
      if (data.researchInstitution) {
        setResearchData(data.researchInstitution);
      }
    } catch (error) {
      console.error("Error loading organization data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Load user profile data
    if (user) {
      setProfileData({
        fullName: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        profession: user.profession || "",
        idNumber: user.id_number || "",
        bankAccount: user.bank_account || "",
      });

      // Load organization data
      loadOrganizationData();
    }
  }, [user, isAuthenticated, router]);

  // Handle user profile save
  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const updateData: Partial<User> = {
        full_name: profileData.fullName,
        phone: profileData.phone,
        profession: profileData.profession,
        id_number: profileData.idNumber,
        bank_account: profileData.bankAccount,
      };

      await updateUser(user.id, updateData);
      setIsEditing(false);
      showAlert("success", "Cập nhật thông tin cá nhân thành công.");
      // Update auth store locally to reflect latest user data
      updateAuthUser(updateData);
    } catch (error) {
      console.error("Error saving profile:", error);
      showAlert("error", "Lỗi khi lưu thông tin cá nhân. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (user) {
      setProfileData({
        fullName: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        profession: user.profession || "",
        idNumber: user.id_number || "",
        bankAccount: user.bank_account || "",
      });
    }
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle company save
  const handleCompanySave = async () => {
    if (!user?.id) return;

    try {
      // Validate required fields
      if (!validateCompany()) {
        showAlert(
          "warning",
          "Vui lòng điền đầy đủ các trường bắt buộc của công ty."
        );
        return;
      }
      setLoading(true);
      let company;

      if (organizationData.company?.id) {
        // Update existing company
        company = await updateCompany(organizationData.company.id, companyData);
      } else {
        // Create new company
        company = await createCompany(companyData);
        // Link company to user
        await updateUser(user.id, { company: company.id });
      }

      setOrganizationData((prev) => ({ ...prev, company }));
      onCompanyModalOpenChange();
      showAlert("success", "Lưu thông tin công ty thành công.");
    } catch (error) {
      console.error("Error saving company:", error);
      showAlert("error", "Lỗi khi lưu thông tin công ty. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Handle research institution save
  const handleResearchSave = async () => {
    if (!user?.id) return;

    try {
      // Validate required fields
      if (!validateResearch()) {
        showAlert(
          "warning",
          "Vui lòng điền đầy đủ các trường bắt buộc của viện nghiên cứu."
        );
        return;
      }
      setLoading(true);
      let researchInstitution;

      if (organizationData.researchInstitution?.id) {
        // Update existing research institution
        researchInstitution = await updateResearchInstitution(
          organizationData.researchInstitution.id,
          researchData
        );
      } else {
        // Create new research institution
        researchInstitution = await createResearchInstitution(researchData);
        // Link research institution to user
        await updateUser(user.id, {
          research_institution: researchInstitution.id,
        });
      }

      setOrganizationData((prev) => ({ ...prev, researchInstitution }));
      onResearchModalOpenChange();
      showAlert("success", "Lưu thông tin viện nghiên cứu thành công.");
    } catch (error) {
      console.error("Error saving research institution:", error);
      showAlert(
        "error",
        "Lỗi khi lưu thông tin viện nghiên cứu. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-default-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "INDIVIDUAL":
        return "Cá nhân";
      case "COMPANY":
        return "Doanh nghiệp";
      case "RESEARCH_INSTITUTION":
        return "Viện/Trường";
      default:
        return type;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "USER":
        return "Người dùng";
      case "ADMIN":
        return "Quản trị viên";
      case "MODERATOR":
        return "Điều hành viên";
      case "SUPPORT":
        return "Hỗ trợ";
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-default-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Hồ sơ cá nhân</h1>
              <p className="text-default-500 mt-1">
                Quản lý thông tin cá nhân và tổ chức của bạn
              </p>
            </div>
            <div className="flex gap-3 items-center flex-wrap">
              {activeTab === "personal" &&
                (isEditing ? (
                  <>
                    <Button
                      variant="bordered"
                      onPress={handleCancel}
                      startContent={<X className="h-4 w-4" />}
                      isDisabled={loading}
                    >
                      Hủy
                    </Button>
                    <Button
                      color="primary"
                      variant="bordered"
                      onPress={handleSave}
                      startContent={<Save className="h-4 w-4" />}
                      isLoading={loading}
                    >
                      Lưu
                    </Button>
                  </>
                ) : (
                  <Button
                    color="primary"
                    variant="bordered"
                    onPress={() => setIsEditing(true)}
                    startContent={<Edit className="h-4 w-4" />}
                  >
                    Chỉnh sửa
                  </Button>
                ))}
            </div>
          </CardHeader>
        </Card>

        {alertState.visible && (
          <Alert
            className="mb-6"
            color={
              alertState.type === "success"
                ? "success"
                : alertState.type === "error"
                  ? "danger"
                  : alertState.type === "warning"
                    ? "warning"
                    : "primary"
            }
            variant="flat"
            isClosable
            onClose={() =>
              setAlertState((prev) => ({ ...prev, visible: false }))
            }
            title={
              alertState.type === "success"
                ? "Thành công"
                : alertState.type === "error"
                  ? "Lỗi"
                  : alertState.type === "warning"
                    ? "Cảnh báo"
                    : "Thông báo"
            }
          >
            {alertState.message}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardBody>
                <div className="text-center">
                  <Avatar
                    size="lg"
                    name={profileData.fullName || user.email}
                    className="mx-auto mb-4"
                    color="primary"
                    icon={<UserIcon className="h-8 w-8" />}
                  />
                  <h2 className="text-xl font-semibold">
                    {profileData.fullName || user.email}
                  </h2>
                  <p className="text-default-500">{user.email}</p>

                  <div className="mt-4 space-y-3">
                    <Chip
                      startContent={<Shield className="h-4 w-4" />}
                      variant="flat"
                      color="primary"
                    >
                      {getUserTypeLabel(user.user_type)}
                    </Chip>
                    <Chip
                      startContent={<Award className="h-4 w-4" />}
                      variant="flat"
                      color="secondary"
                    >
                      {getRoleLabel(user.role)}
                    </Chip>
                    <div className="flex items-center justify-center text-sm text-default-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      Tham gia:{" "}
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Thống kê</h3>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">
                    Công nghệ đã đăng
                  </span>
                  <Chip size="sm" variant="flat">
                    0
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">
                    Nhu cầu đã đăng
                  </span>
                  <Chip size="sm" variant="flat">
                    0
                  </Chip>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-500">
                    Đấu giá tham gia
                  </span>
                  <Chip size="sm" variant="flat">
                    0
                  </Chip>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardBody>
                <Tabs
                  aria-label="Profile sections"
                  className="w-full"
                  selectedKey={activeTab}
                  onSelectionChange={(key) => {
                    if (key !== "all") setActiveTab(key as string);
                  }}
                >
                  <Tab key="personal" title="Thông tin cá nhân">
                    <div className="space-y-6 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <UserIcon className="h-5 w-5" />
                        <h4 className="text-lg font-medium">
                          Thông tin cơ bản
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Họ và tên"
                          value={profileData.fullName}
                          onValueChange={(value) =>
                            handleChange("fullName", value)
                          }
                          variant="bordered"
                          isReadOnly={!isEditing}
                          onClear={
                            isEditing
                              ? () => console.log("input cleared")
                              : undefined
                          }
                          placeholder="Nhập họ và tên"
                        />

                        <Input
                          label="Email"
                          value={profileData.email}
                          variant="bordered"
                          isReadOnly
                          disabled
                          onClear={
                            isEditing
                              ? () => console.log("input cleared")
                              : undefined
                          }
                          startContent={
                            <Mail className="h-4 w-4 text-default-400" />
                          }
                        />

                        <Input
                          label="Số điện thoại"
                          value={profileData.phone}
                          onValueChange={(value) =>
                            handleChange("phone", value)
                          }
                          variant="bordered"
                          isReadOnly={!isEditing}
                          onClear={
                            isEditing
                              ? () => console.log("input cleared")
                              : undefined
                          }
                          placeholder="Nhập số điện thoại"
                          startContent={
                            <Phone className="h-4 w-4 text-default-400" />
                          }
                        />

                        {user.user_type === "INDIVIDUAL" && (
                          <>
                            <Input
                              label="Nghề nghiệp"
                              value={profileData.profession}
                              onValueChange={(value) =>
                                handleChange("profession", value)
                              }
                              variant="bordered"
                              isReadOnly={!isEditing}
                              onClear={
                                isEditing
                                  ? () => console.log("input cleared")
                                  : undefined
                              }
                              placeholder="Nhập nghề nghiệp"
                            />

                            <Input
                              label="Số CMND/CCCD"
                              value={profileData.idNumber}
                              onValueChange={(value) =>
                                handleChange("idNumber", value)
                              }
                              variant="bordered"
                              isReadOnly={!isEditing}
                              onClear={
                                isEditing
                                  ? () => console.log("input cleared")
                                  : undefined
                              }
                              placeholder="Nhập số CMND/CCCD"
                            />

                            <Input
                              label="Tài khoản ngân hàng"
                              value={profileData.bankAccount}
                              onValueChange={(value) =>
                                handleChange("bankAccount", value)
                              }
                              variant="bordered"
                              isReadOnly={!isEditing}
                              onClear={
                                isEditing
                                  ? () => console.log("input cleared")
                                  : undefined
                              }
                              placeholder="Nhập tài khoản ngân hàng"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </Tab>

                  {user.user_type === "COMPANY" && (
                    <Tab key="company" title="Thông tin công ty">
                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            <h4 className="text-lg font-medium">
                              Thông tin công ty
                            </h4>
                          </div>
                          <Button
                            color={
                              organizationData.company ? "primary" : "success"
                            }
                            variant={
                              organizationData.company ? "bordered" : "solid"
                            }
                            onPress={onCompanyModalOpen}
                            startContent={
                              organizationData.company ? (
                                <Edit className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )
                            }
                          >
                            {organizationData.company
                              ? "Chỉnh sửa"
                              : "Thêm mới"}
                          </Button>
                        </div>

                        {organizationData.company ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Tên công ty
                              </p>
                              <p className="text-sm">
                                {organizationData.company.company_name}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Mã số thuế
                              </p>
                              <p className="text-sm">
                                {organizationData.company.tax_code}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Người đại diện
                              </p>
                              <p className="text-sm">
                                {organizationData.company.legal_representative}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Email liên hệ
                              </p>
                              <p className="text-sm">
                                {organizationData.company.contact_email ||
                                  "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Số điện thoại liên hệ
                              </p>
                              <p className="text-sm">
                                {organizationData.company.contact_phone ||
                                  "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Website
                              </p>
                              <p className="text-sm">
                                {organizationData.company.website ||
                                  "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <p className="text-sm font-medium text-default-500">
                                Địa chỉ
                              </p>
                              <p className="text-sm">
                                {[
                                  organizationData.company.address?.street,
                                  organizationData.company.address?.city,
                                  organizationData.company.address?.state,
                                  organizationData.company.address?.country,
                                  organizationData.company.address?.postal_code,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Số lượng nhân viên
                              </p>
                              <p className="text-sm">
                                {organizationData.company.employee_count ??
                                  "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Năm thành lập
                              </p>
                              <p className="text-sm">
                                {organizationData.company.established_year ??
                                  "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <p className="text-sm font-medium text-default-500">
                                Lĩnh vực kinh doanh
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {(
                                  organizationData.company.business_sectors ||
                                  []
                                ).length > 0 ? (
                                  organizationData.company.business_sectors!.map(
                                    (s, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 text-xs rounded bg-default-100"
                                      >
                                        {s.sector}
                                      </span>
                                    )
                                  )
                                ) : (
                                  <span className="text-sm">Chưa cập nhật</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Building2 className="h-12 w-12 mx-auto text-default-300 mb-4" />
                            <p className="text-default-500">
                              Chưa có thông tin công ty
                            </p>
                            <p className="text-sm text-default-400 mt-1">
                              Nhấn "Thêm mới" để thêm thông tin công ty
                            </p>
                          </div>
                        )}
                      </div>
                    </Tab>
                  )}

                  {user.user_type === "RESEARCH_INSTITUTION" && (
                    <Tab key="research" title="Thông tin viện nghiên cứu">
                      <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            <h4 className="text-lg font-medium">
                              Thông tin viện nghiên cứu
                            </h4>
                          </div>
                          <Button
                            color={
                              organizationData.researchInstitution
                                ? "primary"
                                : "success"
                            }
                            variant={
                              organizationData.researchInstitution
                                ? "bordered"
                                : "solid"
                            }
                            onPress={onResearchModalOpen}
                            startContent={
                              organizationData.researchInstitution ? (
                                <Edit className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )
                            }
                          >
                            {organizationData.researchInstitution
                              ? "Chỉnh sửa"
                              : "Thêm mới"}
                          </Button>
                        </div>

                        {organizationData.researchInstitution ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Tên viện/trường
                              </p>
                              <p className="text-sm">
                                {
                                  organizationData.researchInstitution
                                    .institution_name
                                }
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Mã viện/trường
                              </p>
                              <p className="text-sm">
                                {
                                  organizationData.researchInstitution
                                    .institution_code
                                }
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Cơ quan chủ quản
                              </p>
                              <p className="text-sm">
                                {
                                  organizationData.researchInstitution
                                    .governing_body
                                }
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Loại hình
                              </p>
                              <p className="text-sm">
                                {
                                  organizationData.researchInstitution
                                    .institution_type
                                }
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Email liên hệ
                              </p>
                              <p className="text-sm">
                                {organizationData.researchInstitution
                                  .contact_info?.contact_email ||
                                  "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Số điện thoại liên hệ
                              </p>
                              <p className="text-sm">
                                {organizationData.researchInstitution
                                  .contact_info?.contact_phone ||
                                  "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Website
                              </p>
                              <p className="text-sm">
                                {organizationData.researchInstitution
                                  .contact_info?.website || "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <p className="text-sm font-medium text-default-500">
                                Địa chỉ
                              </p>
                              <p className="text-sm">
                                {[
                                  organizationData.researchInstitution.address
                                    ?.street,
                                  organizationData.researchInstitution.address
                                    ?.city,
                                  organizationData.researchInstitution.address
                                    ?.state,
                                  organizationData.researchInstitution.address
                                    ?.country,
                                  organizationData.researchInstitution.address
                                    ?.postal_code,
                                ]
                                  .filter(Boolean)
                                  .join(", ") || "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Số lượng nhân viên
                              </p>
                              <p className="text-sm">
                                {organizationData.researchInstitution
                                  .staff_count ?? "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-default-500">
                                Năm thành lập
                              </p>
                              <p className="text-sm">
                                {organizationData.researchInstitution
                                  .established_year ?? "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <p className="text-sm font-medium text-default-500">
                                Lĩnh vực nghiên cứu
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {(
                                  organizationData.researchInstitution
                                    .research_areas || []
                                ).length > 0 ? (
                                  organizationData.researchInstitution.research_areas!.map(
                                    (a, i) => (
                                      <span
                                        key={i}
                                        className="px-2 py-1 text-xs rounded bg-default-100"
                                      >
                                        {a.area}
                                      </span>
                                    )
                                  )
                                ) : (
                                  <span className="text-sm">Chưa cập nhật</span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <p className="text-sm font-medium text-default-500">
                                Mã số đề tài nghiên cứu
                              </p>
                              <p className="text-sm">
                                {organizationData.researchInstitution
                                  .research_task_code || "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <p className="text-sm font-medium text-default-500">
                                Báo cáo nghiệm thu
                              </p>
                              <p className="text-sm">
                                {organizationData.researchInstitution
                                  .acceptance_report || "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <p className="text-sm font-medium text-default-500">
                                Nhóm nghiên cứu
                              </p>
                              <p className="text-sm">
                                {organizationData.researchInstitution
                                  .research_group || "Chưa cập nhật"}
                              </p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <p className="text-sm font-medium text-default-500">
                                Thông tin chứng nhận
                              </p>
                              <div className="text-sm space-y-1">
                                <div>
                                  <span className="font-medium">Cơ quan:</span>{" "}
                                  {organizationData.researchInstitution
                                    .accreditation_info?.accreditation_body ||
                                    "Chưa cập nhật"}
                                </div>
                                <div>
                                  <span className="font-medium">Cấp độ:</span>{" "}
                                  {organizationData.researchInstitution
                                    .accreditation_info?.accreditation_level ||
                                    "Chưa cập nhật"}
                                </div>
                                <div>
                                  <span className="font-medium">Ngày cấp:</span>{" "}
                                  {organizationData.researchInstitution
                                    .accreditation_info?.accreditation_date ||
                                    "Chưa cập nhật"}
                                </div>
                                <div>
                                  <span className="font-medium">
                                    Ngày hết hạn:
                                  </span>{" "}
                                  {organizationData.researchInstitution
                                    .accreditation_info?.accreditation_expiry ||
                                    "Chưa cập nhật"}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <FileText className="h-12 w-12 mx-auto text-default-300 mb-4" />
                            <p className="text-default-500">
                              Chưa có thông tin viện nghiên cứu
                            </p>
                            <p className="text-sm text-default-400 mt-1">
                              Nhấn "Thêm mới" để thêm thông tin viện nghiên cứu
                            </p>
                          </div>
                        )}
                      </div>
                    </Tab>
                  )}
                </Tabs>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Company Modal */}
        <CompanyModal
          isOpen={isCompanyModalOpen}
          onOpenChange={onCompanyModalOpenChange}
          companyData={companyData}
          setCompanyData={setCompanyData}
          companyErrors={companyErrors}
          setCompanyErrors={setCompanyErrors}
          onSave={handleCompanySave}
          loading={loading}
          originalCompanyData={organizationData.company}
        />

        {/* Research Institution Modal */}
        <ResearchInstitutionModal
          isOpen={isResearchModalOpen}
          onOpenChange={onResearchModalOpenChange}
          researchData={researchData}
          setResearchData={setResearchData}
          researchErrors={researchErrors}
          setResearchErrors={setResearchErrors}
          onSave={handleResearchSave}
          loading={loading}
          originalResearchData={organizationData.researchInstitution}
        />
      </div>
    </div>
  );
}

// Company Modal Component
function CompanyModal({
  isOpen,
  onOpenChange,
  companyData,
  setCompanyData,
  companyErrors,
  setCompanyErrors,
  onSave,
  loading,
  originalCompanyData,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  companyData: Partial<Company>;
  setCompanyData: React.Dispatch<React.SetStateAction<Partial<Company>>>;
  companyErrors: { [K in keyof Partial<Company>]?: string };
  setCompanyErrors: React.Dispatch<
    React.SetStateAction<{ [K in keyof Partial<Company>]?: string }>
  >;
  onSave: () => void;
  loading: boolean;
  originalCompanyData?: Company | null;
}) {
  const handleChange = (field: string, value: string | number) => {
    setCompanyData((prev) => ({ ...prev, [field]: value }));
    setCompanyErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleReset = () => {
    if (originalCompanyData) {
      // Reset to original data
      setCompanyData(originalCompanyData);
    } else {
      // Reset to default values
      setCompanyData({
        company_name: "",
        tax_code: "",
        legal_representative: "",
        contact_email: "",
        contact_phone: "",
        business_license: "",
        website: "",
        production_capacity: "",
        employee_count: 0,
        established_year: new Date().getFullYear(),
        address: {
          street: "",
          city: "",
          state: "",
          country: "Vietnam",
          postal_code: "",
        },
        business_sectors: [],
        is_active: true,
      });
    }
    setCompanyErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const handleAddressChange = (field: string, value: string) => {
    setCompanyData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const addBusinessSector = () => {
    setCompanyData((prev) => ({
      ...prev,
      business_sectors: [...(prev.business_sectors || []), { sector: "" }],
    }));
  };

  const updateBusinessSector = (index: number, value: string) => {
    setCompanyData((prev) => ({
      ...prev,
      business_sectors:
        prev.business_sectors?.map((sector, i) =>
          i === index ? { sector: value } : sector
        ) || [],
    }));
  };

  const removeBusinessSector = (index: number) => {
    setCompanyData((prev) => ({
      ...prev,
      business_sectors:
        prev.business_sectors?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Thông tin công ty
              </div>
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={handleSubmit}
                className="space-y-6 w-full"
                validationErrors={companyErrors as any}
              >
                {/* Basic Information */}
                <div className="w-full">
                  <h4 className="text-md font-medium mb-4">Thông tin cơ bản</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="company_name"
                      label="Tên công ty"
                      value={companyData.company_name || ""}
                      onValueChange={(value) =>
                        handleChange("company_name", value)
                      }
                      variant="bordered"
                      isRequired
                      isInvalid={!!companyErrors.company_name}
                      errorMessage={companyErrors.company_name}
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      name="tax_code"
                      label="Mã số thuế"
                      value={companyData.tax_code || ""}
                      onValueChange={(value) => handleChange("tax_code", value)}
                      variant="bordered"
                      isRequired
                      isInvalid={!!companyErrors.tax_code}
                      errorMessage={companyErrors.tax_code}
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      name="legal_representative"
                      label="Người đại diện pháp luật"
                      value={companyData.legal_representative || ""}
                      onValueChange={(value) =>
                        handleChange("legal_representative", value)
                      }
                      variant="bordered"
                      isRequired
                      isInvalid={!!companyErrors.legal_representative}
                      errorMessage={companyErrors.legal_representative}
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Giấy phép kinh doanh"
                      value={companyData.business_license || ""}
                      onValueChange={(value) =>
                        handleChange("business_license", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Email liên hệ"
                      type="email"
                      value={companyData.contact_email || ""}
                      onValueChange={(value) =>
                        handleChange("contact_email", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Số điện thoại liên hệ"
                      value={companyData.contact_phone || ""}
                      onValueChange={(value) =>
                        handleChange("contact_phone", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Website"
                      value={companyData.website || ""}
                      onValueChange={(value) => handleChange("website", value)}
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Số lượng nhân viên"
                      type="number"
                      value={companyData.employee_count?.toString() || ""}
                      onValueChange={(value) =>
                        handleChange("employee_count", parseInt(value) || 0)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Năm thành lập"
                      type="number"
                      value={companyData.established_year?.toString() || ""}
                      onValueChange={(value) =>
                        handleChange(
                          "established_year",
                          parseInt(value) || new Date().getFullYear()
                        )
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="w-full">
                  <h4 className="text-md font-medium mb-4">Địa chỉ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Địa chỉ đường"
                      value={companyData.address?.street || ""}
                      onValueChange={(value) =>
                        handleAddressChange("street", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Thành phố"
                      value={companyData.address?.city || ""}
                      onValueChange={(value) =>
                        handleAddressChange("city", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Tỉnh/Bang"
                      value={companyData.address?.state || ""}
                      onValueChange={(value) =>
                        handleAddressChange("state", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Quốc gia"
                      value={companyData.address?.country || ""}
                      onValueChange={(value) =>
                        handleAddressChange("country", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                    <Input
                      label="Mã bưu chính"
                      value={companyData.address?.postal_code || ""}
                      onValueChange={(value) =>
                        handleAddressChange("postal_code", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Production Capacity */}
                {/* <div>
                  <h4 className="text-md font-medium mb-4">
                    Năng lực sản xuất
                  </h4>
                  <Textarea
                    label="Mô tả năng lực sản xuất"
                    value={companyData.production_capacity || ""}
                    onValueChange={(value) =>
                      handleChange("production_capacity", value)
                    }
                    variant="bordered"
                    minRows={3}
                  />
                </div> */}

                {/* Business Sectors */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium">Lĩnh vực kinh doanh</h4>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={addBusinessSector}
                      startContent={<Plus className="h-4 w-4" />}
                    >
                      Thêm lĩnh vực
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {companyData.business_sectors?.map((sector, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={sector.sector}
                          onValueChange={(value) =>
                            updateBusinessSector(index, value)
                          }
                          variant="bordered"
                          placeholder="Nhập lĩnh vực kinh doanh"
                        />
                        <Button
                          isIconOnly
                          color="danger"
                          variant="flat"
                          onPress={() => removeBusinessSector(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Form>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button
                variant="flat"
                color="secondary"
                onPress={handleReset}
                isDisabled={loading}
                startContent={<X className="h-4 w-4" />}
              >
                Reset
              </Button>
              <div className="flex gap-2">
                <Button variant="flat" onPress={onClose} isDisabled={loading}>
                  Hủy
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  type="submit"
                  onPress={onSave}
                  isLoading={loading}
                >
                  Lưu
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// Research Institution Modal Component
function ResearchInstitutionModal({
  isOpen,
  onOpenChange,
  researchData,
  setResearchData,
  researchErrors,
  setResearchErrors,
  onSave,
  loading,
  originalResearchData,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  researchData: Partial<ResearchInstitution>;
  setResearchData: React.Dispatch<
    React.SetStateAction<Partial<ResearchInstitution>>
  >;
  researchErrors: { [K in keyof Partial<ResearchInstitution>]?: string };
  setResearchErrors: React.Dispatch<
    React.SetStateAction<{ [K in keyof Partial<ResearchInstitution>]?: string }>
  >;
  onSave: () => void;
  loading: boolean;
  originalResearchData?: ResearchInstitution | null;
}) {
  const handleChange = (field: string, value: string | number) => {
    setResearchData((prev) => ({ ...prev, [field]: value }));
    setResearchErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleReset = () => {
    if (originalResearchData) {
      // Reset to original data
      setResearchData(originalResearchData);
    } else {
      // Reset to default values
      setResearchData({
        institution_name: "",
        institution_code: "",
        governing_body: "",
        institution_type: "UNIVERSITY",
        contact_info: {
          contact_email: "",
          contact_phone: "",
          website: "",
        },
        address: {
          street: "",
          city: "",
          state: "",
          country: "Vietnam",
          postal_code: "",
        },
        research_areas: [],
        research_task_code: "",
        acceptance_report: "",
        research_group: "",
        established_year: new Date().getFullYear(),
        staff_count: 0,
        accreditation_info: {
          accreditation_body: "",
          accreditation_level: "",
          accreditation_date: "",
          accreditation_expiry: "",
        },
        is_active: true,
      });
    }
    setResearchErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  const handleContactChange = (field: string, value: string) => {
    setResearchData((prev) => ({
      ...prev,
      contact_info: { ...prev.contact_info, [field]: value },
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setResearchData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleAccreditationChange = (field: string, value: string) => {
    setResearchData((prev) => ({
      ...prev,
      accreditation_info: { ...prev.accreditation_info, [field]: value },
    }));
  };

  const addResearchArea = () => {
    setResearchData((prev) => ({
      ...prev,
      research_areas: [...(prev.research_areas || []), { area: "" }],
    }));
  };

  const updateResearchArea = (index: number, value: string) => {
    setResearchData((prev) => ({
      ...prev,
      research_areas:
        prev.research_areas?.map((area, i) =>
          i === index ? { area: value } : area
        ) || [],
    }));
  };

  const removeResearchArea = (index: number) => {
    setResearchData((prev) => ({
      ...prev,
      research_areas: prev.research_areas?.filter((_, i) => i !== index) || [],
    }));
  };

  const institutionTypeOptions = [
    { key: "UNIVERSITY", label: "Đại học" },
    { key: "RESEARCH_INSTITUTE", label: "Viện nghiên cứu" },
    { key: "GOVERNMENT_LAB", label: "Phòng thí nghiệm chính phủ" },
    { key: "PRIVATE_RND", label: "Trung tâm R&D tư nhân" },
    { key: "INTERNATIONAL_ORG", label: "Tổ chức quốc tế" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Thông tin viện nghiên cứu
              </div>
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={handleSubmit}
                className="space-y-6 w-full"
                validationErrors={researchErrors as any}
              >
                {/* Basic Information */}
                <div className="w-full">
                  <h4 className="text-md font-medium mb-4">Thông tin cơ bản</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="institution_name"
                      label="Tên viện nghiên cứu"
                      value={researchData.institution_name || ""}
                      onValueChange={(value) =>
                        handleChange("institution_name", value)
                      }
                      variant="bordered"
                      isRequired
                      isInvalid={!!researchErrors.institution_name}
                      errorMessage={researchErrors.institution_name}
                      className="w-full"
                    />
                    <Input
                      name="institution_code"
                      label="Mã viện nghiên cứu"
                      value={researchData.institution_code || ""}
                      onValueChange={(value) =>
                        handleChange("institution_code", value)
                      }
                      variant="bordered"
                      isRequired
                      isInvalid={!!researchErrors.institution_code}
                      errorMessage={researchErrors.institution_code}
                      className="w-full"
                    />
                    <Input
                      name="governing_body"
                      label="Cơ quan chủ quản"
                      value={researchData.governing_body || ""}
                      onValueChange={(value) =>
                        handleChange("governing_body", value)
                      }
                      variant="bordered"
                      isRequired
                      isInvalid={!!researchErrors.governing_body}
                      errorMessage={researchErrors.governing_body}
                      className="w-full"
                    />
                    <Select
                      label="Loại hình viện nghiên cứu"
                      selectedKeys={
                        researchData.institution_type
                          ? [researchData.institution_type]
                          : []
                      }
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        if (selectedKey)
                          handleChange("institution_type", selectedKey);
                      }}
                      variant="bordered"
                      className="w-full"
                      isInvalid={!!researchErrors.institution_type}
                    >
                      {institutionTypeOptions.map((option) => (
                        <SelectItem key={option.key}>{option.label}</SelectItem>
                      ))}
                    </Select>
                    <Input
                      label="Số lượng nhân viên"
                      type="number"
                      value={researchData.staff_count?.toString() || ""}
                      onValueChange={(value) =>
                        handleChange("staff_count", parseInt(value) || 0)
                      }
                      variant="bordered"
                    />
                    <Input
                      label="Năm thành lập"
                      type="number"
                      value={researchData.established_year?.toString() || ""}
                      onValueChange={(value) =>
                        handleChange(
                          "established_year",
                          parseInt(value) || new Date().getFullYear()
                        )
                      }
                      variant="bordered"
                    />
                    <Input
                      label="Mã số đề tài nghiên cứu"
                      value={researchData.research_task_code || ""}
                      onValueChange={(value) =>
                        handleChange("research_task_code", value)
                      }
                      variant="bordered"
                    />
                    <Input
                      label="Nhóm nghiên cứu"
                      value={researchData.research_group || ""}
                      onValueChange={(value) =>
                        handleChange("research_group", value)
                      }
                      variant="bordered"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="w-full">
                  <h4 className="text-md font-medium mb-4">
                    Thông tin liên hệ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Email liên hệ"
                      type="email"
                      value={researchData.contact_info?.contact_email || ""}
                      onValueChange={(value) =>
                        handleContactChange("contact_email", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                    />
                    <Input
                      label="Số điện thoại liên hệ"
                      value={researchData.contact_info?.contact_phone || ""}
                      onValueChange={(value) =>
                        handleContactChange("contact_phone", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                    />
                    <Input
                      label="Website"
                      value={researchData.contact_info?.website || ""}
                      onValueChange={(value) =>
                        handleContactChange("website", value)
                      }
                      variant="bordered"
                      className="md:col-span-2"
                      onClear={() => console.log("input cleared")}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="w-full">
                  <h4 className="text-md font-medium mb-4">Địa chỉ</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Địa chỉ đường"
                      value={researchData.address?.street || ""}
                      onValueChange={(value) =>
                        handleAddressChange("street", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                    />
                    <Input
                      label="Thành phố"
                      value={researchData.address?.city || ""}
                      onValueChange={(value) =>
                        handleAddressChange("city", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                    />
                    <Input
                      label="Tỉnh/Bang"
                      value={researchData.address?.state || ""}
                      onValueChange={(value) =>
                        handleAddressChange("state", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                    />
                    <Input
                      label="Quốc gia"
                      value={researchData.address?.country || ""}
                      onValueChange={(value) =>
                        handleAddressChange("country", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                    />
                    <Input
                      label="Mã bưu chính"
                      value={researchData.address?.postal_code || ""}
                      onValueChange={(value) =>
                        handleAddressChange("postal_code", value)
                      }
                      variant="bordered"
                      onClear={() => console.log("input cleared")}
                    />
                  </div>
                </div>

                {/* Research Areas */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium">Lĩnh vực nghiên cứu</h4>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      onPress={addResearchArea}
                      startContent={<Plus className="h-4 w-4" />}
                    >
                      Thêm lĩnh vực
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {researchData.research_areas?.map((area, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={area.area}
                          onValueChange={(value) =>
                            updateResearchArea(index, value)
                          }
                          variant="bordered"
                          placeholder="Nhập lĩnh vực nghiên cứu"
                          onClear={() => console.log("input cleared")}
                        />
                        <Button
                          isIconOnly
                          color="danger"
                          variant="flat"
                          onPress={() => removeResearchArea(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Information */}
                <div className="w-full">
                  <h4 className="text-md font-medium mb-4">
                    Thông tin bổ sung
                  </h4>
                  <div className="space-y-4">
                    <Textarea
                      label="Báo cáo nghiệm thu"
                      value={researchData.acceptance_report || ""}
                      onValueChange={(value) =>
                        handleChange("acceptance_report", value)
                      }
                      variant="bordered"
                      minRows={2}
                    />
                  </div>
                </div>

                {/* Accreditation Information */}
                <div className="w-full">
                  <h4 className="text-md font-medium mb-4">
                    Thông tin chứng nhận
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Cơ quan cấp chứng nhận"
                      value={
                        researchData.accreditation_info?.accreditation_body ||
                        ""
                      }
                      onValueChange={(value) =>
                        handleAccreditationChange("accreditation_body", value)
                      }
                      variant="bordered"
                    />
                    <Input
                      label="Cấp độ chứng nhận"
                      value={
                        researchData.accreditation_info?.accreditation_level ||
                        ""
                      }
                      onValueChange={(value) =>
                        handleAccreditationChange("accreditation_level", value)
                      }
                      variant="bordered"
                    />
                    <Input
                      label="Ngày cấp chứng nhận"
                      type="date"
                      value={
                        researchData.accreditation_info?.accreditation_date ||
                        ""
                      }
                      onValueChange={(value) =>
                        handleAccreditationChange("accreditation_date", value)
                      }
                      variant="bordered"
                    />
                    <Input
                      label="Ngày hết hạn chứng nhận"
                      type="date"
                      value={
                        researchData.accreditation_info?.accreditation_expiry ||
                        ""
                      }
                      onValueChange={(value) =>
                        handleAccreditationChange("accreditation_expiry", value)
                      }
                      variant="bordered"
                    />
                  </div>
                </div>
              </Form>
            </ModalBody>
            <ModalFooter className="flex justify-between">
              <Button
                variant="flat"
                color="secondary"
                onPress={handleReset}
                isDisabled={loading}
                startContent={<X className="h-4 w-4" />}
              >
                Reset
              </Button>
              <div className="flex gap-2">
                <Button variant="flat" onPress={onClose} isDisabled={loading}>
                  Hủy
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  type="submit"
                  onPress={onSave}
                  isLoading={loading}
                >
                  Lưu
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
