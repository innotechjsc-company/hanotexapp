"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
  ExternalLink,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  MessageCircle,
  Send,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import Map from "@/components/ui/Map";
import CountdownTimer from "@/components/ui/CountdownTimer";
import {
  getEventById,
  getEventAttendeesCount,
  registerForEvent,
  unregisterFromEvent,
  checkUserRegistration,
} from "@/api/events";
import {
  getEventCommentsForDisplay,
  createEventComment,
  CommentDisplay,
} from "@/api/eventComments";
import { Event as ApiEvent } from "@/types/event";
import { useAuth } from "@/store/auth";
import { PAYLOAD_API_BASE_URL } from "@/api/config";

interface EventDisplay extends ApiEvent {
  // Additional UI-specific fields
  description?: string;
  date?: string;
  time?: string;
  location_details?: {
    address: string;
    coordinates: [number, number];
    googleMapsUrl?: string;
  };
  attendees?: string;
  type?: string;
  registration_required?: boolean;
  registration_deadline?: string;
  image_url?: string;
  gallery_images?: string[];
  organizer?: string;
  contact_email?: string;
  contact_phone?: string;
  detailed_content?: string;
  agenda?: Array<{
    time: string;
    title: string;
    speaker?: string;
  }>;
}

// Use CommentDisplay from API instead of local interface

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [event, setEvent] = useState<EventDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [comments, setComments] = useState<CommentDisplay[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState<number>(0);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  // Modal states
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUnregisterModal, setShowUnregisterModal] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Auth state
  const { user, isAuthenticated } = useAuth();

  // Helper function to transform API event to display format
  const transformEventForDisplay = (apiEvent: ApiEvent): EventDisplay => {
    // Extract date and time from start_date and end_date
    const startDate = new Date(apiEvent.start_date);
    const endDate = new Date(apiEvent.end_date);

    // Format date and time
    const date = startDate.toISOString().split("T")[0];
    const startTime = startDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const endTime = endDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const time = `${startTime} - ${endTime}`;

    // Determine status based on dates
    const now = new Date();
    let displayStatus: "pending" | "in_progress" | "completed" | "cancelled";
    if (now < startDate) {
      displayStatus = "pending";
    } else if (now >= startDate && now <= endDate) {
      displayStatus = "in_progress";
    } else {
      displayStatus = "completed";
    }

    return {
      ...apiEvent,
      description: apiEvent.content,
      date,
      time,
      status: displayStatus,
      // Add default location details if location exists
      location_details: apiEvent.location
        ? {
            address: apiEvent.location,
            coordinates: [21.0285, 105.8542] as [number, number], // Default Hanoi coordinates
            googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(apiEvent.location)}`,
          }
        : undefined,
      // Add some default values for UI
      attendees: "Đang cập nhật",
      type: "Sự kiện",
      registration_required: true,
      organizer: "Ban tổ chức",
      contact_email: "contact@hanotex.vn",
      contact_phone: "0848567193",
      image_url:
        typeof apiEvent.image === "object"
          ? apiEvent.image?.url || undefined
          : undefined,
    };
  };

  // Function to fetch comments for the event
  const fetchEventComments = async (eventId: string) => {
    try {
      setLoadingComments(true);
      const response = await getEventCommentsForDisplay(eventId, {
        limit: 50, // Get more comments initially
        sort: "-createdAt", // Newest first
      });
      setComments(response.comments);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  // Function to fetch attendees count
  const fetchAttendeesCount = async (eventId: string) => {
    try {
      setLoadingAttendees(true);
      const count = await getEventAttendeesCount(eventId);
      setAttendeesCount(count);
    } catch (err) {
      console.error("Error fetching attendees count:", err);
      setAttendeesCount(0);
    } finally {
      setLoadingAttendees(false);
    }
  };

  // Function to check if user is registered
  const checkRegistrationStatus = async (eventId: string) => {
    if (!user?.id) return;

    try {
      const isRegistered = await checkUserRegistration(eventId, user.id);
      setIsRegistered(isRegistered);
    } catch (err) {
      console.error("Error checking registration status:", err);
    }
  };

  // Function to show register modal
  const handleRegister = () => {
    setShowRegisterModal(true);
  };

  // Function to show unregister modal
  const handleUnregister = () => {
    setShowUnregisterModal(true);
  };

  // Function to confirm registration
  const confirmRegister = async () => {
    if (!user?.id || !event?.id) return;

    try {
      setRegistering(true);
      await registerForEvent(event.id, user.id);
      setIsRegistered(true);
      setShowRegisterModal(false);

      // Refresh attendees count
      await fetchAttendeesCount(event.id);
    } catch (err) {
      console.error("Error registering for event:", err);
      alert("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
    } finally {
      setRegistering(false);
    }
  };

  // Function to confirm unregistration
  const confirmUnregister = async () => {
    if (!user?.id || !event?.id) return;

    try {
      setRegistering(true);
      await unregisterFromEvent(event.id, user.id);
      setIsRegistered(false);
      setShowUnregisterModal(false);

      // Refresh attendees count
      await fetchAttendeesCount(event.id);
    } catch (err) {
      console.error("Error unregistering from event:", err);
      alert("Có lỗi xảy ra khi hủy đăng ký. Vui lòng thử lại.");
    } finally {
      setRegistering(false);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch event from API
        const apiEvent = await getEventById(params.id);
        const displayEvent = transformEventForDisplay(apiEvent);
        setEvent(displayEvent);

        // Fetch comments for the event
        await fetchEventComments(params.id);

        // Fetch attendees count after getting event details
        await fetchAttendeesCount(params.id);

        // Check if user is registered (if authenticated)
        if (user?.id) {
          await checkRegistrationStatus(params.id);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Không thể tải thông tin sự kiện. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id, user?.id]);

  const getStatusText = (event: any) => {
    // Calculate status based on dates instead of database status
    const now = new Date();
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);

    if (now < startDate) {
      return "Chưa diễn ra";
    } else if (now >= startDate && now <= endDate) {
      return "Đang diễn ra";
    } else {
      return "Đã kết thúc";
    }
  };

  useEffect(() => {
    console.log("event", event);
  }, [event]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    });
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user?.id || !event?.id) return;

    try {
      setSubmittingComment(true);

      // Create comment via API
      const newCommentData = {
        user: user.id,
        event: event.id,
        comment: newComment.trim(),
      };

      await createEventComment(newCommentData);

      // Clear the input first
      setNewComment("");

      // Refresh all comments from API to get the latest data
      await fetchEventComments(event.id);
    } catch (err) {
      console.error("Error creating comment:", err);
      // Show user-friendly error message
      alert("Có lỗi xảy ra khi đăng bình luận. Vui lòng thử lại.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sự kiện...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Lỗi tải sự kiện
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            href="/events"
            className="text-primary-600 hover:text-primary-800"
          >
            Quay lại danh sách sự kiện
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy sự kiện
          </h1>
          <Link
            href="/events"
            className="text-primary-600 hover:text-primary-800"
          >
            Quay lại danh sách sự kiện
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with event image background */}
      <div
        className="relative bg-cover bg-center text-white py-12 md:py-24 lg:py-32"
        style={{
          backgroundImage: `url(${PAYLOAD_API_BASE_URL?.replace("/api", "")}${event.image_url})`,
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/events"
              className="flex items-center text-white hover:text-primary-200 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại danh sách sự kiện
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                {getStatusText(event)}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown Timer */}
            {event.status === "pending" && event.date && event.time && (
              <CountdownTimer
                targetDate={`${event.date}T${event.time.split(" - ")[0]}:00`}
                className="mb-6"
              />
            )}

            {/* Địa điểm với bản đồ */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary-600" />
                Địa điểm
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {event.location || "Địa điểm"}
                  </h3>

                  <div className="flex items-center gap-4 mt-3">
                    {/* {event.location && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors duration-200"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Xem trên Google Maps
                      </a>
                    )} */}
                    {event.location_details?.googleMapsUrl && (
                      <a
                        href={event.location_details.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Chỉ đường
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Thông tin sự kiện card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-primary-600" />
                Thông tin sự kiện
              </h2>
              <div className="space-y-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-primary-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Thời gian bắt đầu
                  </h3>
                  <p className="text-primary-900 font-medium text-lg">
                    {event.start_date && formatDateTime(event.start_date)}
                  </p>
                </div>

                <div className="bg-primary-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-primary-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Thời gian kết thúc
                  </h3>
                  <p className="text-primary-900 font-medium text-lg">
                    {event.end_date && formatDateTime(event.end_date)}
                  </p>
                </div>

                {event.url && (
                  <div className="bg-primary-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-primary-700 mb-2 flex items-center">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Link tham gia
                    </h3>
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-800 font-medium text-lg underline break-all"
                    >
                      {event.url}
                    </a>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Mô tả sự kiện
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {event.description || event.content}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Bình luận ({comments.length})
                </h2>
              </div>

              {/* Comment Input */}
              {isAuthenticated ? (
                <div className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Chia sẻ suy nghĩ của bạn về sự kiện..."
                    className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    disabled={submittingComment}
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!newComment.trim() || submittingComment}
                      className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                    >
                      {submittingComment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Đang đăng...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Đăng bình luận
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-gray-600 mb-3">
                    Bạn cần đăng nhập để bình luận
                  </p>
                  <Link
                    href="/auth/login"
                    className="inline-block bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}

              {/* Comments List */}
              {loadingComments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải bình luận...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {comment.user.initial}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {comment.user.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {comment.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}

                  {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>
                        Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            {event.registration_required && event.status === "pending" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Đăng ký tham gia
                </h3>

                {event.registration_deadline && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        Hạn đăng ký:{" "}
                        {formatDateTime(event.registration_deadline)}
                      </p>
                    </div>
                  </div>
                )}

                {!isAuthenticated ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Bạn cần đăng nhập để đăng ký tham gia sự kiện
                    </p>
                    <Link
                      href="/auth/login"
                      className="inline-block bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
                    >
                      Đăng nhập
                    </Link>
                  </div>
                ) : isRegistered ? (
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-600 font-medium">
                      Đã đăng ký thành công!
                    </p>

                    <button
                      onClick={handleUnregister}
                      disabled={registering}
                      className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {registering ? "Đang xử lý..." : "Hủy đăng ký"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {registering ? "Đang đăng ký..." : "Đăng ký ngay"}
                  </button>
                )}
              </div>
            )}

            {/* Attendees Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary-600" />
                Người tham gia
              </h3>
              <div className="space-y-4">
                <div className="text-center p-6 bg-primary-50 rounded-lg">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {loadingAttendees ? (
                      <div className="animate-pulse bg-primary-200 h-12 w-16 mx-auto rounded"></div>
                    ) : (
                      attendeesCount
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    người đã đăng ký tham gia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Confirmation Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận tham gia
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn tham gia sự kiện này không?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegisterModal(false)}
                  disabled={registering}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                >
                  Thoát
                </button>
                <button
                  onClick={confirmRegister}
                  disabled={registering}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-primary-400 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {registering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    "Đồng ý"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unregister Confirmation Modal */}
      {showUnregisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Xác nhận hủy tham gia
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn hủy tham gia sự kiện này không?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnregisterModal(false)}
                  disabled={registering}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                >
                  Thoát
                </button>
                <button
                  onClick={confirmUnregister}
                  disabled={registering}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-red-400 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {registering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    "Đồng ý"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
