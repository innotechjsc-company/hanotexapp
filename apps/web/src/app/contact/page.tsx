"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Users, MessageCircle, Rocket, Star } from "lucide-react";
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
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <MessageCircle className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Liên hệ & Hỗ trợ</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Chúng tôi sẵn sàng hỗ trợ và tư vấn cho mọi nhu cầu của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">024 3825 1234</span>
              </div>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">info@hanotex.gov.vn</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-blue-50 text-blue-600 rounded-full px-4 py-2 mb-4">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Thông tin liên hệ</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Thông tin liên hệ
                </h2>
                <p className="text-gray-600">
                  Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardBody className="flex flex-row items-start space-x-4 p-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <info.icon className="h-6 w-6 text-white" />
                      </div>
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
              <Card className="mt-8 group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Vị trí văn phòng
                    </h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-indigo-100/50"></div>
                    <div className="relative text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-gray-600 font-medium">
                        Sở KH&CN Hà Nội
                      </p>
                      <p className="text-gray-500 text-sm">
                        15 Lê Thánh Tông, Hoàn Kiếm, Hà Nội
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-green-50 text-green-600 rounded-full px-4 py-2 mb-4">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Gửi tin nhắn</span>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Gửi tin nhắn
                </h2>
                <p className="text-gray-600">
                  Điền thông tin để chúng tôi có thể hỗ trợ bạn tốt nhất
                </p>
              </div>

              {isSubmitted ? (
                <Card className="shadow-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardBody className="text-center p-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      Tin nhắn đã được gửi thành công!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi lại trong thời gian sớm nhất.
                    </p>
                    <div className="flex items-center justify-center text-green-600">
                      <Star className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">Đánh giá dịch vụ của chúng tôi</span>
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card className="shadow-lg hover:shadow-xl transition-shadow">
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
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:translate-y-0"
                      >
                        <Send className="h-5 w-5" />
                        Gửi tin nhắn
                        <Rocket className="h-4 w-4" />
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
