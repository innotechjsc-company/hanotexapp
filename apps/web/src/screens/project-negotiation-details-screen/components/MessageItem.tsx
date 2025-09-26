import React, { useState } from "react";
import { Avatar, Typography, Button, Tooltip, Tag, Popconfirm, message as antdMessage } from "antd";
import { Download, CheckCircle2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import type { ApiNegotiatingMessage } from "@/api/negotiating-messages";
import { negotiatingMessageApi } from "@/api/negotiating-messages";
import { useUser } from "@/store/auth";
import { OfferStatus } from "@/types/offer";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const { Text } = Typography;

interface MessageItemProps {
  message: ApiNegotiatingMessage;
  formatFileSize: (bytes: number) => string;
}

// Avatar component
const MessageAvatar: React.FC<{
  message: ApiNegotiatingMessage;
  isRightSide: boolean;
}> = ({ message, isRightSide }) => {
  const getUserName = () => {
    if (!message.user) return "Unknown User";
    if (typeof message.user === "object") {
      return message.user.full_name || message.user.email || "Unknown User";
    }
    return message.user as unknown as string;
  };

  const getUserAvatar = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex-shrink-0 relative">
      <Avatar
        size={32}
        className={`${isRightSide ? "bg-blue-500" : "bg-blue-500"} text-white font-medium`}
      >
        {getUserAvatar()}
      </Avatar>
    </div>
  );
};

// Sender name
const SenderName: React.FC<{
  message: ApiNegotiatingMessage;
  isRightSide: boolean;
}> = ({ message, isRightSide }) => {
  const getUserName = () => {
    if (!message.user) return "Unknown User";
    if (typeof message.user === "object") {
      return message.user.full_name || message.user.email || "Unknown User";
    }
    return message.user as unknown as string;
  };

  return (
    <div className={`mb-1 ${isRightSide ? "text-right" : "text-left"}`}>
      <Text
        className={`text-sm font-medium ${isRightSide ? "text-blue-600" : "text-gray-700"}`}
      >
        {isRightSide ? "Bạn" : getUserName()}
      </Text>
    </div>
  );
};

// File attachment
const FileAttachment: React.FC<{
  attachment: any;
  isRightSide: boolean;
  formatFileSize: (bytes: number) => string;
}> = ({ attachment, isRightSide, formatFileSize }) => {
  const getFileName = () => {
    if (typeof attachment === "string") {
      return "Document";
    }
    return attachment.filename || attachment.alt || "Tài liệu";
  };

  const getFileSize = () => {
    if (typeof attachment === "string") {
      return 0;
    }
    return attachment.filesize || 0;
  };

  const getFileUrl = () => {
    if (typeof attachment === "string") {
      return "#";
    }
    return attachment.url || "#";
  };

  const getMimeType = () => {
    if (typeof attachment === "string") {
      return "";
    }
    return attachment.mimeType || "";
  };

  const getFileIcon = () => {
    const mimeType = getMimeType();
    const fileName = getFileName().toLowerCase();
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word") || fileName.includes(".doc")) return "📝";
    if (mimeType.includes("excel") || fileName.includes(".xls")) return "📊";
    if (mimeType.includes("powerpoint") || fileName.includes(".ppt")) return "📋";
    if (mimeType.includes("image")) return "🖼️";
    if (mimeType.includes("video")) return "🎥";
    if (mimeType.includes("audio")) return "🎵";
    return "📎";
  };

  const handleDownload = () => {
    const url = getFileUrl();
    if (url && url !== "#") {
      const link = document.createElement("a");
      link.href = url;
      link.download = getFileName();
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg mt-2 transition-all hover:shadow-sm
        ${isRightSide ? "bg-white/20 hover:bg-white/30" : "bg-gray-50 border border-gray-200 hover:border-gray-300"}
      `}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg ${isRightSide ? "bg-white/20" : "bg-blue-50"}`}
      >
        <span className="text-sm">{getFileIcon()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <Text
          className={`text-sm font-medium block truncate ${isRightSide ? "text-white" : "text-gray-800"}`}
        >
          {getFileName()}
        </Text>
        <Text
          className={`text-xs ${isRightSide ? "text-white/80" : "text-gray-500"}`}
        >
          {formatFileSize(getFileSize())}
        </Text>
      </div>

      <Tooltip title="Tải xuống" color="gray">
        <Button
          type="text"
          size="small"
          icon={<Download size={14} />}
          onClick={handleDownload}
          disabled={getFileUrl() === "#"}
          className={`
            border-none rounded-lg p-2 transition-colors
            ${
              isRightSide
                ? "text-white bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/50"
                : "text-blue-500 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
            }
          `}
        />
      </Tooltip>
    </div>
  );
};

// Message bubble including offer block
const MessageBubble: React.FC<{
  message: ApiNegotiatingMessage;
  isRightSide: boolean;
  formatFileSize: (bytes: number) => string;
}> = ({ message, isRightSide, formatFileSize }) => {
  const hasMessage = message.message && message.message.trim().length > 0;
  const hasDocuments = message.documents && message.documents.length > 0;
  const hasOffer = !!message.is_offer && !!message.offer;

  const initialOfferStatus =
    (hasOffer && typeof message.offer === "object"
      ? (message.offer.status as OfferStatus | undefined)
      : undefined) || undefined;

  const [offerStatus, setOfferStatus] = useState<OfferStatus | undefined>(
    initialOfferStatus
  );
  const [actionLoading, setActionLoading] = useState<"accept" | "reject" | null>(
    null
  );

  const formatCurrency = (value?: number) => {
    if (value == null) return "-";
    try {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(value);
    } catch {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫";
    }
  };

  const getOfferStatusTag = (status?: OfferStatus) => {
    if (!status) return null;
    const color =
      status === OfferStatus.PENDING
        ? "gold"
        : status === OfferStatus.ACCEPTED
          ? "green"
          : "red";
    const label =
      status === OfferStatus.PENDING
        ? "Chờ xác nhận"
        : status === OfferStatus.ACCEPTED
          ? "Đã chấp nhận"
          : "Đã từ chối";
    return <Tag color={color}>{label}</Tag>;
  };

  const canActOnOffer =
    hasOffer &&
    typeof message.offer === "object" &&
    offerStatus === OfferStatus.PENDING &&
    !isRightSide;

  const handleAcceptOffer = async () => {
    try {
      if (!hasOffer || typeof message.offer !== "object") return;
      setActionLoading("accept");
      await negotiatingMessageApi.acceptOffer((message.offer as any).id);
      setOfferStatus(OfferStatus.ACCEPTED);
      antdMessage.success("Đđề xuất ã chấp nhận giá");
      setTimeout(() => {
        try {
          window.location.reload();
        } catch {}
      }, 800);
    } catch (e) {
      antdMessage.error("Không thể chấp nhận đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectOffer = async () => {
    try {
      if (!hasOffer || typeof message.offer !== "object") return;
      setActionLoading("reject");
      await negotiatingMessageApi.rejectOffer((message.offer as any).id);
      setOfferStatus(OfferStatus.REJECTED);
      antdMessage.success("Đã từ chối đề xuất giá");
    } catch (e) {
      antdMessage.error("Không thể từ chối đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className={`flex ${isRightSide ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          px-3 py-2 rounded-2xl max-w-full
          ${
            isRightSide
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
          }
        `}
      >
        {/* Offer block */}
        {hasOffer && typeof message.offer === "object" && (
          <div
            className={`rounded-xl p-3 mb-2 ${
              isRightSide ? "bg-white/20" : "bg-blue-50 border border-blue-100"
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <Text
                className={`${isRightSide ? "text-white" : "text-blue-700"} font-medium`}
              >
                Đề xuất giá
              </Text>
              {getOfferStatusTag(offerStatus)}
            </div>
            <div className="text-sm">
              <Text
                className={`${isRightSide ? "text-white" : "text-gray-800"} font-semibold`}
              >
                {formatCurrency((message.offer as any).price)}
              </Text>
            </div>
            {message.offer.content && (
              <div className="mt-1">
                <Text
                  className={`${isRightSide ? "text-white/90" : "text-gray-700"}`}
                >
                  {message.offer.content}
                </Text>
              </div>
            )}

            {canActOnOffer && (
              <div className="mt-3 flex items-center gap-2">
                <Popconfirm
                  title="Xác nhận chấp nhận đề xuất"
                  description="Bạn có chắc chắn muốn chấp nhận đề xuất này? Hệ thống sẽ tạo hợp đồng và chuyển sang bước ký hợp đồng."
                  okText="Đồng ý"
                  cancelText="Hủy"
                  onConfirm={handleAcceptOffer}
                >
                  <Button
                    size="small"
                    type="primary"
                    loading={actionLoading === "accept"}
                    className="bg-green-500 hover:bg-green-600 border-none"
                  >
                    Đồng ý
                  </Button>
                </Popconfirm>
                <Button
                  size="small"
                  danger
                  onClick={handleRejectOffer}
                  loading={actionLoading === "reject"}
                >
                  Từ chối
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Message text */}
        {hasMessage && (
          <Text
            className={`text-sm leading-relaxed`}
            style={{ color: isRightSide ? "white" : "black" }}
          >
            {message.message}
          </Text>
        )}

        {/* File attachments */}
        {hasDocuments && (
          <div className={hasMessage ? "mt-2" : ""}>
            {message.documents?.map((doc, index) => (
              <FileAttachment
                key={
                  typeof doc === "string"
                    ? doc
                    : (doc as any).id?.toString() || `doc-${index}`
                }
                attachment={doc}
                isRightSide={isRightSide}
                formatFileSize={formatFileSize}
              />
            ))}
          </div>
        )}

        {/* Placeholder when empty */}
        {!hasMessage && !hasDocuments && (
          <Text
            className={`text-sm italic ${isRightSide ? "text-white/70" : "text-gray-500"}`}
          >
            Tin nhắn trống
          </Text>
        )}
      </div>
    </div>
  );
};

// Timestamp
const MessageTimestamp: React.FC<{
  message: ApiNegotiatingMessage;
  isRightSide: boolean;
}> = ({ message, isRightSide }) => (
  <div
    className={`flex items-center gap-1 mt-1 ${isRightSide ? "justify-end" : "justify-start"}`}
  >
    <Text className="text-xs text-gray-400">
      {dayjs(message.createdAt || new Date().toISOString()).fromNow()}
    </Text>
    {isRightSide && <CheckCircle2 size={10} className="text-blue-400" />}
  </div>
);

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  formatFileSize,
}) => {
  const currentUser = useUser();

  const isCurrentUser =
    message.user && typeof message.user === "object"
      ? message.user.id === currentUser?.id
      : false;
  const isRightSide = isCurrentUser;

  return (
    <div
      className={`flex gap-2 mb-3 ${isRightSide ? "flex-row-reverse" : "flex-row"}`}
    >
      <MessageAvatar message={message} isRightSide={isRightSide} />

      <div className="flex-1 max-w-[75%]">
        <SenderName message={message} isRightSide={isRightSide} />
        <MessageBubble
          message={message}
          isRightSide={isRightSide}
          formatFileSize={formatFileSize}
        />
        <MessageTimestamp
          message={message}
          isRightSide={isRightSide}
        />
      </div>
    </div>
  );
};
