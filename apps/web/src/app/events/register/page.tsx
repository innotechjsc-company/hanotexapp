'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, Send, CheckCircle } from 'lucide-react';

export default function EventRegisterPage() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: '',
    contactEmail: '',
    contactPhone: '',
    requirements: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const eventTypes = [
    'Hội thảo',
    'Triển lãm',
    'Workshop',
    'Hội nghị',
    'Sự kiện networking',
    'Khác'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event registration:', formData);
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        eventName: '',
        eventType: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: '',
        contactEmail: '',
        contactPhone: '',
        requirements: ''
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Đăng ký thành công!
              </h2>
              <p className="text-gray-600 mb-6">
                Chúng tôi đã nhận được thông tin đăng ký sự kiện của bạn. 
                Đội ngũ của chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
              </p>
              <p className="text-sm text-gray-500">
                Thời gian xử lý: 3-5 ngày làm việc
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Thông tin sự kiện
                </h2>
                <p className="text-gray-600">
                  Điền đầy đủ thông tin để đăng ký sự kiện của bạn
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                      Tên sự kiện *
                    </label>
                    <input
                      type="text"
                      id="eventName"
                      name="eventName"
                      required
                      value={formData.eventName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tên sự kiện"
                    />
                  </div>

                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                      Loại sự kiện *
                    </label>
                    <select
                      id="eventType"
                      name="eventType"
                      required
                      value={formData.eventType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn loại sự kiện</option>
                      {eventTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả sự kiện *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mô tả chi tiết về sự kiện, mục tiêu, nội dung..."
                  />
                </div>

                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Ngày tổ chức *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Thời gian *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-2">
                      Số lượng tham gia tối đa
                    </label>
                    <input
                      type="number"
                      id="maxParticipants"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Địa điểm tổ chức *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Địa chỉ chi tiết nơi tổ chức sự kiện"
                  />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email liên hệ *
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      required
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="contact@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại liên hệ *
                    </label>
                    <input
                      type="tel"
                      id="contactPhone"
                      name="contactPhone"
                      required
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0123456789"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                    Yêu cầu đặc biệt
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    rows={3}
                    value={formData.requirements}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Các yêu cầu đặc biệt về thiết bị, không gian, hỗ trợ..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Đăng ký sự kiện
                </button>
              </form>
            </div>
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
              <p className="text-gray-600">
                Hỗ trợ tổ chức và quản lý sự kiện
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
