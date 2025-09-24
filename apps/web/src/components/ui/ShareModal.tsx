"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Facebook,
  Twitter,
  MessageCircle,
  Mail,
  Link2,
  Check,
} from "lucide-react";
import Toast, { useToast } from "./Toast";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  description?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
  description = "",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}${url}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      color: "bg-gray-100 hover:bg-gray-200 text-gray-700",
      action: async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          showToast("Đã sao chép liên kết!", "success");
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy:", err);
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopied(true);
          showToast("Đã sao chép liên kết!", "success");
          setTimeout(() => setCopied(false), 2000);
        }
      },
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      action: () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`;
        window.open(facebookUrl, "_blank", "width=600,height=400");
      },
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-500 hover:bg-sky-600 text-white",
      action: () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        window.open(twitterUrl, "_blank", "width=600,height=400");
      },
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600 text-white",
      action: () => {
        const whatsappUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        window.open(whatsappUrl, "_blank");
      },
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-red-500 hover:bg-red-600 text-white",
      action: () => {
        const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
        window.location.href = emailUrl;
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Link2 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Chia sẻ bài viết
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Article Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-600 break-all">{shareUrl}</p>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.name}
                  onClick={option.action}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${option.color}`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">
                    {option.name === "Copy Link" && copied
                      ? "Đã sao chép!"
                      : option.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}
