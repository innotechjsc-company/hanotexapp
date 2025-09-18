"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Textarea,
  Select,
  SelectItem,
  Avatar,
} from "@heroui/react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
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

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      details: [
        "Sở KH&CN Hà Nội",
        "15 Lê Thánh Tông, Hoàn Kiếm",
        "Hà Nội, Việt Nam",
      ],
    },
    {
      icon: Phone,
      title: "Điện thoại",
      details: ["024 3825 1234", "Hotline: 1900 1234"],
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@hanotex.gov.vn", "support@hanotex.gov.vn"],
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      details: [
        "Thứ 2 - Thứ 6: 8:00 - 17:00",
        "Thứ 7: 8:00 - 12:00",
        "Chủ nhật: Nghỉ",
      ],
    },
  ];

  const subjects = [
    "Tư vấn chuyển giao công nghệ",
    "Định giá công nghệ",
    "Hỗ trợ pháp lý",
    "Kết nối đầu tư",
    "Đăng ký công nghệ",
    "Đăng nhu cầu công nghệ",
    "Hỗ trợ kỹ thuật",
    "Khác",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Chúng tôi sẵn sàng hỗ trợ và tư vấn cho mọi nhu cầu của bạn
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Thông tin liên hệ
              </h2>

              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardBody className="flex flex-row items-start space-x-4 p-6">
                      <Avatar
                        icon={<info.icon className="h-6 w-6" />}
                        className="w-12 h-12 bg-primary-100 text-primary-600"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {info.title}
                        </h3>
                        {info.details.map((detail, detailIndex) => (
                          <p
                            key={detailIndex}
                            className="text-default-600 text-sm"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Map placeholder */}
              <Card className="mt-8 shadow-sm">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">
                    Bản đồ
                  </h3>
                </CardHeader>
                <CardBody>
                  <div className="bg-default-100 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-default-500">
                      Bản đồ sẽ được tích hợp tại đây
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Gửi tin nhắn
              </h2>

              {isSubmitted ? (
                <Card className="shadow-sm">
                  <CardBody className="text-center p-8">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Tin nhắn đã được gửi!
                    </h3>
                    <p className="text-default-600">
                      Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                    </p>
                  </CardBody>
                </Card>
              ) : (
                <Card className="shadow-sm">
                  <CardBody className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          type="text"
                          name="name"
                          label="Họ và tên *"
                          placeholder="Nhập họ và tên"
                          value={formData.name}
                          onChange={handleChange}
                          isRequired
                          variant="bordered"
                          classNames={{
                            label: "text-sm font-medium text-foreground",
                          }}
                        />

                        <Input
                          type="email"
                          name="email"
                          label="Email *"
                          placeholder="Nhập email"
                          value={formData.email}
                          onChange={handleChange}
                          isRequired
                          variant="bordered"
                          classNames={{
                            label: "text-sm font-medium text-foreground",
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          type="tel"
                          name="phone"
                          label="Số điện thoại"
                          placeholder="Nhập số điện thoại"
                          value={formData.phone}
                          onChange={handleChange}
                          variant="bordered"
                          classNames={{
                            label: "text-sm font-medium text-foreground",
                          }}
                        />

                        <Select
                          name="subject"
                          label="Chủ đề *"
                          placeholder="Chọn chủ đề"
                          selectedKeys={
                            formData.subject ? [formData.subject] : []
                          }
                          onSelectionChange={(keys) => {
                            const selectedKey = Array.from(keys)[0] as string;
                            setFormData((prev) => ({
                              ...prev,
                              subject: selectedKey,
                            }));
                          }}
                          isRequired
                          variant="bordered"
                          classNames={{
                            label: "text-sm font-medium text-foreground",
                          }}
                        >
                          {subjects.map((subject) => (
                            <SelectItem key={subject}>{subject}</SelectItem>
                          ))}
                        </Select>
                      </div>

                      <Textarea
                        name="message"
                        label="Nội dung tin nhắn *"
                        placeholder="Nhập nội dung tin nhắn của bạn"
                        value={formData.message}
                        onChange={handleChange}
                        isRequired
                        minRows={6}
                        variant="bordered"
                        classNames={{
                          label: "text-sm font-medium text-foreground",
                        }}
                      />

                      <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-800 text-white px-8 py-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          border: "none",
                          minHeight: "56px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <Send className="h-5 w-5" />
                        Gửi tin nhắn
                      </button>
                    </form>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
