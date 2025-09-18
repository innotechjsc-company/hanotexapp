"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Send,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Divider,
} from "@heroui/react";

export default function EventRegisterPage() {
  const [formData, setFormData] = useState({
    eventName: "",
    eventType: "",
    description: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: "",
    contactEmail: "",
    contactPhone: "",
    requirements: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const eventTypes = [
    "Hội thảo",
    "Triển lãm",
    "Workshop",
    "Hội nghị",
    "Sự kiện networking",
    "Khác",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Event registration:", formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        eventName: "",
        eventType: "",
        description: "",
        date: "",
        time: "",
        location: "",
        maxParticipants: "",
        contactEmail: "",
        contactPhone: "",
        requirements: "",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Đăng ký sự kiện
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Đăng ký tổ chức sự kiện trên nền tảng HANOTEX
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSubmitted ? (
            <Card className="shadow-lg">
              <CardBody className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Đăng ký thành công!
                </h2>
                <p className="text-gray-600 mb-6">
                  Chúng tôi đã nhận được thông tin đăng ký sự kiện của bạn. Đội
                  ngũ của chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                </p>
                <p className="text-sm text-gray-500">
                  Thời gian xử lý: 3-5 ngày làm việc
                </p>
              </CardBody>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-0">
                <div className="w-full">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Thông tin sự kiện
                  </h2>
                  <p className="text-gray-600">
                    Điền đầy đủ thông tin để đăng ký sự kiện của bạn
                  </p>
                </div>
              </CardHeader>
              <CardBody className="p-8 pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Event Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="text"
                      name="eventName"
                      label="Tên sự kiện *"
                      placeholder="Nhập tên sự kiện"
                      value={formData.eventName}
                      onChange={handleChange}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    />

                    <Select
                      name="eventType"
                      label="Loại sự kiện *"
                      placeholder="Chọn loại sự kiện"
                      selectedKeys={
                        formData.eventType ? [formData.eventType] : []
                      }
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        setFormData({ ...formData, eventType: selected });
                      }}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    >
                      {eventTypes.map((type, index) => (
                        <SelectItem key={type}>{type}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <Textarea
                    name="description"
                    label="Mô tả sự kiện *"
                    placeholder="Mô tả chi tiết về sự kiện, mục tiêu, nội dung..."
                    value={formData.description}
                    onChange={handleChange}
                    variant="bordered"
                    isRequired
                    minRows={4}
                    className="w-full"
                  />

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      type="date"
                      name="date"
                      label="Ngày tổ chức *"
                      value={formData.date}
                      onChange={handleChange}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    />

                    <Input
                      type="time"
                      name="time"
                      label="Thời gian *"
                      value={formData.time}
                      onChange={handleChange}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    />

                    <Input
                      type="number"
                      name="maxParticipants"
                      label="Số lượng tham gia tối đa"
                      placeholder="100"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      variant="bordered"
                      className="w-full"
                    />
                  </div>

                  <Input
                    type="text"
                    name="location"
                    label="Địa điểm tổ chức *"
                    placeholder="Địa chỉ chi tiết nơi tổ chức sự kiện"
                    value={formData.location}
                    onChange={handleChange}
                    variant="bordered"
                    isRequired
                    className="w-full"
                  />

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      type="email"
                      name="contactEmail"
                      label="Email liên hệ *"
                      placeholder="contact@company.com"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    />

                    <Input
                      type="tel"
                      name="contactPhone"
                      label="Số điện thoại liên hệ *"
                      placeholder="0123456789"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      variant="bordered"
                      isRequired
                      className="w-full"
                    />
                  </div>

                  <Textarea
                    name="requirements"
                    label="Yêu cầu đặc biệt"
                    placeholder="Các yêu cầu đặc biệt về thiết bị, không gian, hỗ trợ..."
                    value={formData.requirements}
                    onChange={handleChange}
                    variant="bordered"
                    minRows={3}
                    className="w-full"
                  />

                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button
                      type="button"
                      variant="bordered"
                      size="lg"
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setFormData({
                          eventName: "",
                          eventType: "",
                          description: "",
                          date: "",
                          time: "",
                          location: "",
                          maxParticipants: "",
                          contactEmail: "",
                          contactPhone: "",
                          requirements: "",
                        });
                      }}
                    >
                      Đặt lại
                    </Button>
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      startContent={<Send className="h-5 w-5" />}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md"
                    >
                      Đăng ký sự kiện
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quy trình xử lý
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình đơn giản để đăng ký và tổ chức sự kiện trên HANOTEX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đăng ký
              </h3>
              <p className="text-gray-600">
                Điền thông tin và gửi yêu cầu đăng ký
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xét duyệt
              </h3>
              <p className="text-gray-600">
                Chúng tôi sẽ xem xét và phản hồi trong 3-5 ngày
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Công bố
              </h3>
              <p className="text-gray-600">
                Sự kiện được công bố và mở đăng ký tham gia
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tổ chức
              </h3>
              <p className="text-gray-600">Hỗ trợ tổ chức và quản lý sự kiện</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
