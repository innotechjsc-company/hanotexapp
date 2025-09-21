"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useUser } from "@/store/auth";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  File,
  X,
} from "lucide-react";
import { Demand } from "@/types/demand";
import { useCategories } from "@/hooks/useCategories";
import { createDemand } from "@/api/demands";
import { uploadFile, deleteFile } from "@/api/media";
import { Media } from "@/types/media";

export default function RegisterDemandPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<Media[]>([]);
  // New state to store selected files (not uploaded yet)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const user = useUser();

  // Fetch categories from API
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [formData, setFormData] = useState<
    Partial<Demand> & {
      categoryId: string;
      from_price_display: string;
      to_price_display: string;
    }
  >({
    title: "",
    description: "",
    categoryId: "", // For form handling, will map to category
    user: user?.id || "", // Will be set from authenticated user
    trl_level: 1,
    option: "",
    option_technology: "",
    option_rule: "",
    from_price: 0,
    to_price: 0,
    from_price_display: "",
    to_price_display: "",
    cooperation: "",
    documents: [],
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.categoryId) {
        setError("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      // Validate user authentication and get user ID
      if (!user || !user.id) {
        setError(
          "Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại."
        );
        return;
      }

      // Step 1: Upload selected files first
      let uploadedMediaData: Media[] = [];

      if (selectedFiles.length > 0) {
        console.log("Uploading selected files before creating demand...");
        setUploadingFiles(true);

        try {
          const uploadPromises = selectedFiles.map(async (file) => {
            // Determine file type based on MIME type
            let fileType: Media["type"] = "other";
            if (file.type.startsWith("image/")) {
              fileType = "image";
            } else if (file.type.startsWith("video/")) {
              fileType = "video";
            } else if (
              file.type.includes("pdf") ||
              file.type.includes("document") ||
              file.type.includes("text") ||
              file.type.includes("application")
            ) {
              fileType = "document";
            }

            return await uploadFile(file, {
              alt: file.name,
              type: fileType,
              caption: `Tài liệu đính kèm: ${file.name}`,
            });
          });

          uploadedMediaData = await Promise.all(uploadPromises);
          console.log(
            "Files uploaded successfully:",
            uploadedMediaData.map((f) => ({ id: f.id, filename: f.filename }))
          );
        } catch (err: any) {
          console.error("Error uploading files:", err);
          setError(`Lỗi tải file: ${err.message || "Vui lòng thử lại"}`);
          return;
        } finally {
          setUploadingFiles(false);
        }
      }

      // Step 2: Prepare demand data with uploaded media IDs
      const documentIds = uploadedMediaData.map((media) => media.id);

      const demandData: Partial<Demand> = {
        title: formData.title,
        description: formData.description,
        category: formData.categoryId, // This will be mapped to category relationship
        user: user.id as string, // Get user ID from authenticated user
        trl_level: formData.trl_level || 1,
        option: formData.option || "",
        option_technology: formData.option_technology || "",
        option_rule: formData.option_rule || "",
        from_price: formData.from_price || 0,
        to_price: formData.to_price || 0,
        cooperation: formData.cooperation || "",
        documents: documentIds as any, // Send uploaded media IDs
      };

      console.log("Creating demand with uploaded media:", {
        documentIds,
        uploadedMediaData: uploadedMediaData.length,
      });

      // Step 3: Call API to create demand
      const createdDemand = await createDemand(demandData);

      // Show success message and keep loading overlay visible for transition
      setSuccess(`Nhu cầu "${formData.title}" đã được đăng ký thành công!`);

      // Reset form after successful submission
      setFormData({
        title: "",
        description: "",
        categoryId: "",
        user: user.id as string, // User ID is already validated above
        trl_level: 1,
        option: "",
        option_technology: "",
        option_rule: "",
        from_price: 0,
        to_price: 0,
        from_price_display: "",
        to_price_display: "",
        cooperation: "",
        documents: [],
      });

      // Reset file states
      setSelectedFiles([]);
      setUploadedDocuments([]);

      // Keep loading state to show success animation, then go back to previous page
      setTimeout(() => {
        setLoading(false);
        setSuccess("");
        router.back();
      }, 2000);
    } catch (err: any) {
      console.error("Error creating demand:", err);

      // Handle different types of errors
      if (err.status === 400) {
        setError("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.");
      } else if (err.status === 401) {
        setError("Bạn cần đăng nhập để thực hiện chức năng này.");
      } else if (err.status === 403) {
        setError("Bạn không có quyền thực hiện chức năng này.");
      } else if (err.status === 500) {
        setError("Lỗi hệ thống. Vui lòng thử lại sau.");
      } else {
        setError(
          err.message || "Có lỗi xảy ra khi đăng ký nhu cầu. Vui lòng thử lại."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Update formData user field when user changes
    if (user?.id) {
      setFormData((prev) => ({
        ...prev,
        user: user.id as string,
      }));
    }
  }, [user]);

  // No longer need cleanup since files are only uploaded on successful form submission

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Handle trl_level as number
    if (name === "trl_level") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 1,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // No longer need to sync uploadedDocuments to formData since we upload on submit

  // Handle file selection (not upload yet)
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError("");

    // Add selected files to state
    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    console.log(
      "Files selected:",
      newFiles.map((f) => ({ name: f.name, size: f.size }))
    );

    // Reset file input
    event.target.value = "";
  };

  // Remove selected file (before upload)
  const handleRemoveSelectedFile = (fileIndex: number) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((_, index) => index !== fileIndex);
      console.log(
        "File removed, remaining:",
        newFiles.map((f) => ({ name: f.name, size: f.size }))
      );
      return newFiles;
    });
  };

  // No longer need handleRemoveDocument since we only work with selected files before upload

  // Get file size in readable format
  const formatFileSize = (bytes: number | null | undefined): string => {
    if (!bytes) return "Unknown size";

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Loading Overlay */}
      {(loading || uploadingFiles || success) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center space-y-4">
              {success ? (
                // Success state
                <>
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Thành công!
                    </h3>
                    <p className="text-sm text-gray-500">
                      Đang quay lại trang trước...
                    </p>
                  </div>
                </>
              ) : (
                // Loading state
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {uploadingFiles
                        ? "Đang tải file lên..."
                        : "Đang tạo nhu cầu..."}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {uploadingFiles
                        ? `Đang xử lý ${selectedFiles.length} file`
                        : "Vui lòng chờ trong giây lát"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Đăng nhu cầu công nghệ
                  </h1>
                  <p className="text-gray-600">
                    Đăng nhu cầu tìm kiếm công nghệ lên sàn giao dịch HANOTEX
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trước
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Disable form when loading */}
          <fieldset disabled={loading || uploadingFiles}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            {categoriesError && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                Lỗi tải danh mục: {categoriesError}
              </div>
            )}

            {success && !loading && !uploadingFiles && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                {success}
              </div>
            )}

            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Thông tin cơ bản
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tiêu đề nhu cầu *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tiêu đề nhu cầu"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mô tả chi tiết *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả chi tiết về nhu cầu công nghệ của bạn"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="categoryId"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Danh mục *
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      required
                      value={formData.categoryId}
                      onChange={handleChange}
                      disabled={categoriesLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {categoriesLoading
                          ? "Đang tải danh mục..."
                          : "Chọn danh mục"}
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="trl_level"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mức độ phát triển (TRL) *
                    </label>
                    <select
                      id="trl_level"
                      name="trl_level"
                      required
                      value={formData.trl_level}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={1}>TRL 1 - Nguyên lý cơ bản</option>
                      <option value={2}>TRL 2 - Khái niệm công nghệ</option>
                      <option value={3}>TRL 3 - Bằng chứng khái niệm</option>
                      <option value={4}>
                        TRL 4 - Xác thực trong phòng thí nghiệm
                      </option>
                      <option value={5}>
                        TRL 5 - Xác thực trong môi trường liên quan
                      </option>
                      <option value={6}>
                        TRL 6 - Trình diễn trong môi trường liên quan
                      </option>
                      <option value={7}>
                        TRL 7 - Trình diễn trong môi trường vận hành
                      </option>
                      <option value={8}>
                        TRL 8 - Hệ thống hoàn chỉnh và đủ điều kiện
                      </option>
                      <option value={9}>
                        TRL 9 - Hệ thống thực tế được chứng minh
                      </option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="from_price_display"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Giá từ (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="from_price_display"
                      name="from_price_display"
                      value={formData.from_price_display}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          from_price_display: value,
                          from_price: value ? parseInt(value) : 0,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập giá từ"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="to_price_display"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Giá đến (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="to_price_display"
                      name="to_price_display"
                      value={formData.to_price_display}
                      onChange={(e) => {
                        const value = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          to_price_display: value,
                          to_price: value ? parseInt(value) : 0,
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập giá đến"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="cooperation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Hình thức hợp tác
                  </label>
                  <input
                    type="text"
                    id="cooperation"
                    name="cooperation"
                    value={formData.cooperation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ví dụ: Hợp tác phát triển, Chuyển giao công nghệ, Thuê bao dịch vụ"
                  />
                </div>
              </div>
            </div>

            {/* Yêu cầu mong muốn */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Yêu cầu mong muốn
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="option"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mô tả yêu cầu mong muốn
                  </label>
                  <textarea
                    id="option"
                    name="option"
                    rows={4}
                    value={formData.option}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả chi tiết về yêu cầu mong muốn của bạn"
                  />
                </div>

                <div>
                  <label
                    htmlFor="option_technology"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mô tả yêu cầu công nghệ
                  </label>
                  <textarea
                    id="option_technology"
                    name="option_technology"
                    rows={4}
                    value={formData.option_technology}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả các yêu cầu kỹ thuật cụ thể"
                  />
                </div>

                <div>
                  <label
                    htmlFor="option_rule"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mô tả yêu cầu quy tắc
                  </label>
                  <textarea
                    id="option_rule"
                    name="option_rule"
                    rows={4}
                    value={formData.option_rule}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả các quy tắc, tiêu chuẩn cần tuân thủ"
                  />
                </div>
              </div>
            </div>

            {/* Tài liệu đính kèm */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tài liệu đính kèm
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Thêm các tài liệu liên quan đến nhu cầu của bạn (PDF, DOC,
                  hình ảnh, v.v.)
                </p>
              </div>
              <div className="p-6 space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif,.mp4,.avi,.mov"
                    onChange={handleFileSelection}
                    className="hidden"
                    disabled={uploadingFiles}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`cursor-pointer flex flex-col items-center space-y-2 ${
                      uploadingFiles ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Upload className="h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      {uploadingFiles ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                          <span>Đang tải file...</span>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium text-blue-600 hover:text-blue-500">
                            Nhấn để chọn file
                          </span>{" "}
                          hoặc kéo thả file vào đây
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Hỗ trợ: PDF, DOC, TXT, hình ảnh, video (tối đa 10MB mỗi
                      file)
                    </div>
                  </label>
                </div>

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">
                      Tài liệu đã chọn ({selectedFiles.length})
                    </h3>
                    <div className="grid gap-3">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {file.type.startsWith("image/") ? (
                                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <File className="h-5 w-5 text-blue-600" />
                                </div>
                              ) : file.type.startsWith("video/") ? (
                                <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <File className="h-5 w-5 text-purple-600" />
                                </div>
                              ) : (
                                <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <File className="h-5 w-5 text-gray-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>{formatFileSize(file.size)}</span>
                                <span>•</span>
                                <span>{file.type}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSelectedFile(index)}
                            className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 transition-colors"
                            title="Xóa tài liệu"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500">
                      <strong>Lưu ý:</strong> Các file sẽ được tải lên khi bạn
                      ấn "Đăng nhu cầu"
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading || uploadingFiles}
                className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingFiles ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tải file...
                  </>
                ) : loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tạo nhu cầu...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Đăng nhu cầu
                    {selectedFiles.length > 0 && (
                      <span className="ml-1 text-xs bg-blue-500 px-2 py-0.5 rounded-full">
                        +{selectedFiles.length} file
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}
