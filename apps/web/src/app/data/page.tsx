"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Database, 
  Building2, 
  Users, 
  Lightbulb,
  ArrowRight,
  TrendingUp,
  Globe,
  Search
} from 'lucide-react';

export default function DataPage() {
  const dataSections = [
    {
      title: "Danh sách Tổ chức/Viện/Trường",
      description: "Khám phá danh sách các tổ chức, viện nghiên cứu và trường đại học tham gia sàn giao dịch công nghệ",
      href: "/data/organizations",
      icon: Building2,
      stats: "150+ Tổ chức",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Danh sách Nhà sáng chế/Phát minh",
      description: "Tìm hiểu về các nhà sáng chế, phát minh và chuyên gia trong lĩnh vực công nghệ",
      href: "/data/inventors",
      icon: Users,
      stats: "500+ Nhà sáng chế",
      color: "from-green-500 to-green-600"
    },
    {
      title: "Danh sách Công Nghệ & Nhu cầu",
      description: "Xem danh sách chi tiết các công nghệ và nhu cầu công nghệ trên sàn giao dịch",
      href: "/data/technologies",
      icon: Lightbulb,
      stats: "1000+ Công nghệ",
      color: "from-purple-500 to-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Database className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Dữ Liệu CKCN
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá và truy cập các dữ liệu quan trọng về công nghệ, tổ chức và nhà sáng chế trên sàn giao dịch HANOTEX
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng số dữ liệu</p>
                <p className="text-2xl font-bold text-gray-900">1,650+</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lĩnh vực công nghệ</p>
                <p className="text-2xl font-bold text-gray-900">25+</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Truy cập hàng ngày</p>
                <p className="text-2xl font-bold text-gray-900">500+</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {dataSections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-2"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <section.icon className="h-8 w-8 text-white" />
                </div>
                <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-2 transition-all duration-300" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {section.title}
              </h3>
              
              <p className="text-gray-600 mb-4 leading-relaxed">
                {section.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {section.stats}
                </span>
                <span className="text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-300">
                  Xem chi tiết →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Cần hỗ trợ tìm kiếm dữ liệu?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Liên hệ với chúng tôi để được hỗ trợ tìm kiếm và truy cập các dữ liệu chuyên sâu
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-300 shadow-lg"
              >
                Liên hệ hỗ trợ
              </Link>
              <Link
                href="/user-guide"
                className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-300"
              >
                Hướng dẫn sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
