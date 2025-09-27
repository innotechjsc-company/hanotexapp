"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  Upload,
  Button,
  message,
  Progress,
  Card,
  Typography,
  Space,
  Tooltip,
} from "antd";
import {
  UploadOutlined,
  InboxOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FileOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { uploadFile, uploadFiles, deleteFile } from "@/api/media";
import type { Media, MediaType } from "@/types/media1";

const { Text, Title } = Typography;
const { Dragger } = Upload;

// File type configurations
export const FILE_TYPE_CONFIG = {
  image: {
    icon: FileImageOutlined,
    color: "#52c41a",
    accept: "image/*",
    mimeTypes: [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  video: {
    icon: VideoCameraOutlined,
    color: "#1890ff",
    accept: "video/*",
    mimeTypes: ["video/mp4", "video/webm", "video/ogg"],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  document: {
    icon: FileTextOutlined,
    color: "#fa8c16",
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt",
    mimeTypes: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
  },
  archive: {
    icon: FileOutlined,
    color: "#722ed1",
    accept: ".zip,.rar,.7z",
    mimeTypes: [
      "application/zip",
      "application/x-rar-compressed",
      "application/x-7z-compressed",
    ],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  all: {
    icon: FileOutlined,
    color: "#666666",
    accept: "*",
    mimeTypes: [],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
};

export interface FileUploadItem extends Media {
  uploadProgress?: number;
  uploadStatus?: "uploading" | "done" | "error";
  uploadError?: string;
}

export interface FileUploadProps {
  // Basic props
  value?: FileUploadItem[];
  defaultValue?: FileUploadItem[];
  onChange?: (files: FileUploadItem[]) => void;

  // Upload configuration
  multiple?: boolean;
  maxCount?: number;
  maxSize?: number; // in bytes
  allowedTypes?: (keyof typeof FILE_TYPE_CONFIG)[];
  accept?: string;

  // UI configuration
  variant?: "dragger" | "button" | "picture";
  size?: "small" | "default" | "large";
  disabled?: boolean;

  // Labels and messages
  title?: string;
  description?: string;
  buttonText?: string;
  placeholder?: string;

  // Upload behavior
  autoUpload?: boolean;
  uploadOnAdd?: boolean;

  // Media API options
  mediaFields?: Partial<Pick<Media, "alt" | "caption" | "type">>;

  // Callbacks
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (file: File, progress: number) => void;
  onUploadSuccess?: (file: File, media: Media) => void;
  onUploadError?: (file: File, error: string) => void;
  onRemove?: (file: FileUploadItem) => void;
  onPreview?: (file: FileUploadItem) => void;

  // Validation
  beforeUpload?: (file: File) => boolean | Promise<boolean>;

  // Styling
  className?: string;
  style?: React.CSSProperties;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getFileTypeFromMime = (
  mimeType: string
): keyof typeof FILE_TYPE_CONFIG => {
  for (const [type, config] of Object.entries(FILE_TYPE_CONFIG)) {
    if (config.mimeTypes.includes(mimeType)) {
      return type as keyof typeof FILE_TYPE_CONFIG;
    }
  }
  return "all";
};

const validateFile = (
  file: File,
  allowedTypes: (keyof typeof FILE_TYPE_CONFIG)[],
  maxSize: number
): { valid: boolean; error?: string } => {
  // Check if file exists and has content
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: "File không hợp lệ hoặc rỗng",
    };
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Kích thước file vượt quá giới hạn ${formatFileSize(maxSize)}`,
    };
  }

  // Check minimum file size (1KB)
  if (file.size < 1024) {
    return {
      valid: false,
      error: "File quá nhỏ (tối thiểu 1KB)",
    };
  }

  // Check file name length
  if (file.name.length > 255) {
    return {
      valid: false,
      error: "Tên file quá dài (tối đa 255 ký tự)",
    };
  }

  // Check for invalid characters in filename
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(file.name)) {
    return {
      valid: false,
      error: "Tên file chứa ký tự không hợp lệ",
    };
  }

  // Check file type if specific types are allowed
  if (allowedTypes.length > 0 && !allowedTypes.includes("all")) {
    const fileType = getFileTypeFromMime(file.type);
    if (!allowedTypes.includes(fileType)) {
      const allowedNames = allowedTypes
        .map((t) =>
          t === "image"
            ? "Hình ảnh"
            : t === "video"
              ? "Video"
              : t === "document"
                ? "Tài liệu"
                : t === "archive"
                  ? "File nén"
                  : "File"
        )
        .join(", ");
      return {
        valid: false,
        error: `Loại file không được hỗ trợ. Chỉ chấp nhận: ${allowedNames}`,
      };
    }
  }

  return { valid: true };
};

// Additional validation utilities
const isDuplicateFile = (
  file: File,
  existingFiles: FileUploadItem[]
): boolean => {
  return existingFiles.some(
    (existing) =>
      existing.filename === file.name &&
      existing.filesize === file.size &&
      existing.uploadStatus !== "error"
  );
};

const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

const isValidFileExtension = (
  filename: string,
  allowedTypes: (keyof typeof FILE_TYPE_CONFIG)[]
): boolean => {
  // If all types are allowed, skip extension validation
  if (allowedTypes.includes("all")) return true;

  // If any allowed type uses wildcard MIME (e.g. image/* or video/*),
  // do not enforce extension here; MIME validation will handle it.
  const hasWildcardMime = allowedTypes.some((type) => {
    const accept = FILE_TYPE_CONFIG[type]?.accept || "";
    return accept.includes("/*") || accept === "*";
  });
  if (hasWildcardMime) return true;

  const extension = getFileExtension(filename);
  const allowedExtensions: string[] = [];

  // Collect only explicit extension patterns from accept strings
  // Ignore MIME patterns like "image/*" or "video/*" — MIME will be validated separately
  allowedTypes.forEach((type) => {
    const config = FILE_TYPE_CONFIG[type];
    if (config.accept && config.accept !== "*") {
      const parts = config.accept.split(",").map((s) => s.trim());
      for (const part of parts) {
        if (part.startsWith(".")) {
          allowedExtensions.push(part.slice(1).toLowerCase());
        }
        // If part is a MIME (e.g. image/*), do not push as extension
      }
    }
  });

  // If there are no explicit extensions configured, do not block by extension
  if (allowedExtensions.length === 0) return true;

  return allowedExtensions.includes(extension);
};

export default function FileUpload({
  value,
  defaultValue = [],
  onChange,
  multiple = false,
  maxCount = multiple ? 10 : 1,
  maxSize = 10 * 1024 * 1024, // 10MB default
  allowedTypes = ["all"],
  accept,
  variant = "dragger",
  size = "default",
  disabled = false,
  title,
  description,
  buttonText,
  placeholder,
  autoUpload = true,
  uploadOnAdd = true,
  mediaFields,
  onUploadStart,
  onUploadProgress,
  onUploadSuccess,
  onUploadError,
  onRemove,
  onPreview,
  beforeUpload,
  className,
  style,
}: FileUploadProps) {
  const isControlled = value !== undefined;
  const [fileList, setFileList] = useState<FileUploadItem[]>(
    isControlled ? value : defaultValue
  );

  const uploadingFiles = useRef<Set<string>>(new Set());

  // Sync controlled value
  React.useEffect(() => {
    if (isControlled && value) {
      setFileList(value);
    }
  }, [isControlled, value]);

  const updateFileList = useCallback(
    (newFileList: FileUploadItem[]) => {
      if (!isControlled) {
        setFileList(newFileList);
      }
      onChange?.(newFileList);
    },
    [isControlled, onChange]
  );

  // Generate accept string from allowed types
  const acceptString =
    accept ||
    (allowedTypes.length > 0 && !allowedTypes.includes("all")
      ? allowedTypes.map((type) => FILE_TYPE_CONFIG[type].accept).join(",")
      : undefined);

  const handleUpload = useCallback(
    async (file: File): Promise<Media | null> => {
      const fileId = `${file.name}-${file.size}-${file.lastModified}`;

      if (uploadingFiles.current.has(fileId)) {
        return null; // Already uploading
      }

      uploadingFiles.current.add(fileId);

      try {
        onUploadStart?.(file);

        // Create temporary file item
        const tempItem: FileUploadItem = {
          id: Date.now(),
          alt: file.name,
          filename: file.name,
          mimeType: file.type,
          filesize: file.size,
          type: getFileTypeFromMime(file.type) as MediaType,
          uploadProgress: 0,
          uploadStatus: "uploading",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Add to file list immediately
        const currentList = isControlled ? value || [] : fileList;
        updateFileList([...currentList, tempItem]);

        // Simulate progress (since we don't have real progress from the API)
        const progressInterval = setInterval(() => {
          tempItem.uploadProgress = Math.min(
            (tempItem.uploadProgress || 0) + 10,
            90
          );
          onUploadProgress?.(file, tempItem.uploadProgress);
          updateFileList([
            ...currentList.filter((f) => f.id !== tempItem.id),
            tempItem,
          ]);
        }, 200);

        // Upload file
        const uploadedMedia = await uploadFile(file, {
          alt: file.name,
          type: getFileTypeFromMime(file.type) as MediaType,
          ...mediaFields,
        });

        clearInterval(progressInterval);

        // Update with real media data
        const finalItem: FileUploadItem = {
          ...uploadedMedia,
          uploadProgress: 100,
          uploadStatus: "done",
        };

        const finalList = [
          ...currentList.filter((f) => f.id !== tempItem.id),
          finalItem,
        ];
        updateFileList(finalList);

        onUploadSuccess?.(file, uploadedMedia);
        message.success(`Tải lên thành công: ${file.name}`);

        return uploadedMedia;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Lỗi không xác định";

        // Update with error status
        const currentList = isControlled ? value || [] : fileList;
        const errorItem: FileUploadItem = {
          ...(currentList.find((f) => f.filename === file.name) || {
            id: Date.now(),
            alt: file.name,
            filename: file.name,
            mimeType: file.type,
            filesize: file.size,
            type: getFileTypeFromMime(file.type) as MediaType,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
          uploadProgress: 0,
          uploadStatus: "error",
          uploadError: errorMessage,
        };

        updateFileList([
          ...currentList.filter((f) => f.filename !== file.name),
          errorItem,
        ]);

        onUploadError?.(file, errorMessage);
        message.error(`Tải lên thất bại: ${file.name} - ${errorMessage}`);

        return null;
      } finally {
        uploadingFiles.current.delete(fileId);
      }
    },
    [
      fileList,
      isControlled,
      value,
      updateFileList,
      mediaFields,
      onUploadStart,
      onUploadProgress,
      onUploadSuccess,
      onUploadError,
    ]
  );

  const handleBeforeUpload = useCallback(
    (file: File): boolean => {
      const currentList = isControlled ? value || [] : fileList;

      // Check max count
      const currentCount = currentList.length;
      if (currentCount >= maxCount) {
        message.error(`Chỉ được phép tải lên tối đa ${maxCount} file`);
        return false;
      }

      // Check for duplicate files
      if (isDuplicateFile(file, currentList)) {
        message.warning(`File "${file.name}" đã tồn tại`);
        return false;
      }

      // Validate file extension
      if (!isValidFileExtension(file.name, allowedTypes)) {
        message.error(
          `Phần mở rộng file "${getFileExtension(file.name)}" không được hỗ trợ`
        );
        return false;
      }

      // Validate file
      const validation = validateFile(file, allowedTypes, maxSize);
      if (!validation.valid) {
        message.error(validation.error);
        return false;
      }

      // Custom validation
      if (beforeUpload) {
        const result = beforeUpload(file);
        if (result instanceof Promise) {
          result
            .then((valid) => {
              if (valid && autoUpload && uploadOnAdd) {
                handleUpload(file);
              }
            })
            .catch((error) => {
              message.error(
                `Validation error: ${error.message || "Unknown error"}`
              );
            });
          return false; // Prevent default upload
        } else if (!result) {
          return false;
        }
      }

      // Auto upload if enabled
      if (autoUpload && uploadOnAdd) {
        handleUpload(file);
        return false; // Prevent default upload
      }

      return false; // Always prevent default upload, we handle it manually
    },
    [
      isControlled,
      value,
      fileList,
      maxCount,
      allowedTypes,
      maxSize,
      beforeUpload,
      autoUpload,
      uploadOnAdd,
      handleUpload,
    ]
  );

  const handleRemove = useCallback(
    async (file: FileUploadItem) => {
      try {
        // Delete from server if it has an ID
        if (
          file.id &&
          typeof file.id === "string" &&
          file.uploadStatus === "done"
        ) {
          await deleteFile(file.id);
        }

        const currentList = isControlled ? value || [] : fileList;
        const newList = currentList.filter((f) => f.id !== file.id);
        updateFileList(newList);

        onRemove?.(file);
        message.success(`Đã xóa file: ${file.filename}`);
      } catch (error) {
        message.error(`Không thể xóa file: ${file.filename}`);
      }
    },
    [isControlled, value, fileList, updateFileList, onRemove]
  );

  const handlePreview = useCallback(
    (file: FileUploadItem) => {
      if (onPreview) {
        onPreview(file);
      } else if (file.url) {
        window.open(file.url, "_blank");
      }
    },
    [onPreview]
  );

  // Convert to Ant Design UploadFile format for display
  const antdFileList: UploadFile[] =
    (isControlled ? value : fileList)?.map((file) => ({
      uid: String(file.id),
      name: file.filename || file.alt,
      status:
        file.uploadStatus === "uploading"
          ? "uploading"
          : file.uploadStatus === "error"
            ? "error"
            : "done",
      url: file.url,
      percent: file.uploadProgress,
      response: file,
    })) || [];

  const uploadProps: UploadProps = {
    multiple,
    accept: acceptString,
    beforeUpload: handleBeforeUpload,
    onRemove: (file) => {
      const fileItem = (file.response || file) as FileUploadItem;
      handleRemove(fileItem);
    },
    onPreview: (file) => {
      const fileItem = (file.response || file) as FileUploadItem;
      handlePreview(fileItem);
    },
    fileList: antdFileList,
    disabled,
    className,
    style,
  };

  const defaultTitle = title || (multiple ? "Tải lên file" : "Tải lên file");
  const defaultDescription =
    description ||
    `${multiple ? "Chọn hoặc kéo thả" : "Chọn hoặc kéo thả"} file vào đây. ` +
      `Tối đa ${formatFileSize(maxSize)}${multiple ? `, ${maxCount} file` : ""}`;

  if (variant === "dragger") {
    return (
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{defaultTitle}</p>
        <p className="ant-upload-hint">{defaultDescription}</p>
      </Dragger>
    );
  }

  if (variant === "button") {
    return (
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} size={size} disabled={disabled}>
          {buttonText || defaultTitle}
        </Button>
      </Upload>
    );
  }

  // Default variant with custom file list display
  return (
    <div className={className} style={style}>
      <Upload {...uploadProps} showUploadList={false}>
        <Button icon={<UploadOutlined />} size={size} disabled={disabled}>
          {buttonText || defaultTitle}
        </Button>
      </Upload>

      {antdFileList.length > 0 && (
        <div className="mt-4 space-y-2">
          {antdFileList.map((file) => {
            const fileItem = file.response as FileUploadItem;
            const FileIcon =
              FILE_TYPE_CONFIG[getFileTypeFromMime(fileItem?.mimeType || "")]
                .icon;

            return (
              <Card key={file.uid} size="small" className="file-upload-item">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="relative">
                      <FileIcon
                        className="text-lg flex-shrink-0"
                        style={{
                          color:
                            FILE_TYPE_CONFIG[
                              getFileTypeFromMime(fileItem?.mimeType || "")
                            ].color,
                        }}
                      />
                      {/* Status indicator overlay */}
                      {fileItem?.uploadStatus === "uploading" && (
                        <LoadingOutlined
                          className="absolute -top-1 -right-1 text-blue-500 text-xs"
                          spin
                        />
                      )}
                      {fileItem?.uploadStatus === "done" && (
                        <CheckCircleOutlined className="absolute -top-1 -right-1 text-green-500 text-xs" />
                      )}
                      {fileItem?.uploadStatus === "error" && (
                        <ExclamationCircleOutlined className="absolute -top-1 -right-1 text-red-500 text-xs" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <Text className="block truncate font-medium">
                          {file.name}
                        </Text>
                        {fileItem?.uploadStatus === "uploading" && (
                          <Text type="secondary" className="text-xs">
                            Đang tải lên...
                          </Text>
                        )}
                        {fileItem?.uploadStatus === "done" && (
                          <Text type="success" className="text-xs">
                            Hoàn thành
                          </Text>
                        )}
                        {fileItem?.uploadStatus === "error" && (
                          <Text type="danger" className="text-xs">
                            Lỗi
                          </Text>
                        )}
                      </div>
                      <Text type="secondary" className="text-xs">
                        {fileItem?.filesize
                          ? formatFileSize(fileItem.filesize)
                          : ""}
                        {fileItem?.uploadStatus === "error" &&
                          fileItem.uploadError &&
                          ` • ${fileItem.uploadError}`}
                      </Text>
                      {file.status === "uploading" && (
                        <Progress
                          percent={file.percent}
                          size="small"
                          className="mt-1"
                          status="active"
                          strokeColor={{
                            "0%": "#108ee9",
                            "100%": "#87d068",
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {fileItem?.uploadStatus === "error" && (
                      <Tooltip title="Thử lại">
                        <Button
                          type="text"
                          size="small"
                          icon={<ReloadOutlined />}
                          onClick={() => {
                            // Re-upload the file
                            const originalFile = new File([], file.name, {
                              type: fileItem.mimeType || "",
                            });
                            handleUpload(originalFile);
                          }}
                        />
                      </Tooltip>
                    )}
                    {file.url && fileItem?.uploadStatus === "done" && (
                      <Tooltip title="Xem trước">
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handlePreview(fileItem)}
                        />
                      </Tooltip>
                    )}
                    <Tooltip title="Xóa">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemove(fileItem)}
                        disabled={fileItem?.uploadStatus === "uploading"}
                      />
                    </Tooltip>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
