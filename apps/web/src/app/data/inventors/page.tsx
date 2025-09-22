"use client";

import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Award, 
  Phone, 
  Mail, 
  Globe,
  Search,
  Filter,
  Grid,
  List,
  ArrowLeft,
  Star,
  Lightbulb,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';

export default function InventorsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - trong thực tế sẽ lấy từ API
  const inventors = [
    {
      id: 1,
      name: "GS.TS. Nguyễn Văn An",
      title: "Giáo sư, Tiến sĩ",
      specialization: "Trí tuệ nhân tạo",
      organization: "Viện Khoa học và Công nghệ Việt Nam",
      location: "Hà Nội",
      description: "Chuyên gia hàng đầu về trí tuệ nhân tạo và machine learning tại Việt Nam",
      email: "nguyen.van.an@vast.vn",
      phone: "024-3791-1234",
      inventions: 12,
      patents: 8,
      rating: 4.9,
      verified: true,
      avatar: "/avatars/inventor1.jpg"
    },
    {
      id: 2,
      name: "TS. Trần Thị Bình",
      title: "Tiến sĩ",
      specialization: "Công nghệ sinh học",
      organization: "Trường Đại học Bách khoa Hà Nội",
      location: "Hà Nội",
      description: "Nhà nghiên cứu xuất sắc trong lĩnh vực công nghệ sinh học và y học",
      email: "tran.thi.binh@hust.edu.vn",
      phone: "024-3868-5678",
      inventions: 15,
      patents: 11,
      rating: 4.8,
      verified: true,
      avatar: "/avatars/inventor2.jpg"
    },
    {
      id: 3,
      name: "KS. Lê Minh Cường",
      title: "Kỹ sư",
      specialization: "Công nghệ thông tin",
      organization: "Tập đoàn FPT",
      location: "TP. Hồ Chí Minh",
      description: "Kỹ sư phần mềm với nhiều sáng chế trong lĩnh vực blockchain và fintech",
      email: "le.minh.cuong@fpt.vn",
      phone: "024-7300-9012",
      inventions: 8,
      patents: 5,
      rating: 4.7,
      verified: true,
      avatar: "/avatars/inventor3.jpg"
    },
    {
      id: 4,
      name: "PGS.TS. Phạm Thị Dung",
      title: "Phó Giáo sư, Tiến sĩ",
      specialization: "Vật liệu nano",
      organization: "Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
      location: "Hà Nội",
      description: "Chuyên gia về vật liệu nano và ứng dụng trong y học",
      email: "pham.thi.dung@vast.ac.vn",
      phone: "024-3791-3456",
      inventions: 20,
      patents: 14,
      rating: 4.9,
      verified: true,
      avatar: "/avatars/inventor4.jpg"
    },
    {
      id: 5,
      name: "TS. Hoàng Văn Em",
      title: "Tiến sĩ",
      specialization: "Năng lượng tái tạo",
      organization: "Trường Đại học Công nghệ Thông tin",
      location: "TP. Hồ Chí Minh",
      description: "Nhà nghiên cứu về năng lượng mặt trời và hệ thống lưu trữ năng lượng",
      email: "hoang.van.em@uit.edu.vn",
      phone: "028-3725-7890",
      inventions: 10,
      patents: 7,
      rating: 4.6,
      verified: true,
      avatar: "/avatars/inventor5.jpg"
    },
    {
      id: 6,
      name: "KS. Vũ Thị Phương",
      title: "Kỹ sư",
      specialization: "Điện tử viễn thông",
      organization: "Viện Nghiên cứu Dầu khí Việt Nam",
      location: "Vũng Tàu",
      description: "Kỹ sư chuyên về hệ thống viễn thông và IoT trong ngành dầu khí",
      email: "vu.thi.phuong@vpi.pvn.vn",
      phone: "0254-3856-1234",
      inventions: 6,
      patents: 4,
      rating: 4.5,
      verified: true,
      avatar: "/avatars/inventor6.jpg"
    },
    {
      id: 7,
      name: "GS.TS. Đỗ Văn Giang",
      title: "Giáo sư, Tiến sĩ",
      specialization: "Cơ khí chính xác",
      organization: "Trường Đại học Bách khoa Hà Nội",
      location: "Hà Nội",
      description: "Chuyên gia hàng đầu về cơ khí chính xác và tự động hóa",
      email: "do.van.giang@hust.edu.vn",
      phone: "024-3868-1234",
      inventions: 18,
      patents: 12,
      rating: 4.8,
      verified: true,
      avatar: "/avatars/inventor7.jpg"
    },
    {
      id: 8,
      name: "TS. Lê Thị Hương",
      title: "Tiến sĩ",
      specialization: "Hóa học hữu cơ",
      organization: "Trường Đại học Khoa học Tự nhiên - ĐHQG Hà Nội",
      location: "Hà Nội",
      description: "Nhà nghiên cứu về hóa học hữu cơ và tổng hợp dược phẩm",
      email: "le.thi.huong@hus.vnu.edu.vn",
      phone: "024-3754-1234",
      inventions: 14,
      patents: 9,
      rating: 4.7,
      verified: true,
      avatar: "/avatars/inventor8.jpg"
    },
    {
      id: 9,
      name: "PGS.TS. Nguyễn Văn Khoa",
      title: "Phó Giáo sư, Tiến sĩ",
      specialization: "Vật lý ứng dụng",
      organization: "Viện Công nghệ Thông tin - Viện Hàn lâm KHCNVN",
      location: "Hà Nội",
      description: "Chuyên gia về vật lý ứng dụng và công nghệ laser",
      email: "nguyen.van.khoa@ioit.ac.vn",
      phone: "024-3791-2345",
      inventions: 16,
      patents: 11,
      rating: 4.6,
      verified: true,
      avatar: "/avatars/inventor9.jpg"
    },
    {
      id: 10,
      name: "KS. Trần Minh Long",
      title: "Kỹ sư",
      specialization: "Xây dựng",
      organization: "Công ty Cổ phần Tập đoàn Vingroup",
      location: "Hà Nội",
      description: "Kỹ sư xây dựng với nhiều sáng chế về vật liệu xây dựng thông minh",
      email: "tran.minh.long@vingroup.net",
      phone: "024-3974-1234",
      inventions: 9,
      patents: 6,
      rating: 4.5,
      verified: true,
      avatar: "/avatars/inventor10.jpg"
    },
    {
      id: 11,
      name: "TS. Phạm Thị Mai",
      title: "Tiến sĩ",
      specialization: "Năng lượng hạt nhân",
      organization: "Viện Nghiên cứu Hạt nhân Đà Lạt",
      location: "Đà Lạt",
      description: "Nhà nghiên cứu về năng lượng hạt nhân và ứng dụng y tế",
      email: "pham.thi.mai@dalat.vn",
      phone: "0263-3821-1234",
      inventions: 11,
      patents: 8,
      rating: 4.4,
      verified: true,
      avatar: "/avatars/inventor11.jpg"
    },
    {
      id: 12,
      name: "GS.TS. Vũ Văn Nam",
      title: "Giáo sư, Tiến sĩ",
      specialization: "Y học",
      organization: "Trường Đại học Y Hà Nội",
      location: "Hà Nội",
      description: "Chuyên gia hàng đầu về y học và công nghệ y tế",
      email: "vu.van.nam@hmu.edu.vn",
      phone: "024-3852-1234",
      inventions: 22,
      patents: 16,
      rating: 4.9,
      verified: true,
      avatar: "/avatars/inventor12.jpg"
    },
    {
      id: 13,
      name: "TS. Nguyễn Thị Oanh",
      title: "Tiến sĩ",
      specialization: "Thủy sản",
      organization: "Viện Nghiên cứu Nuôi trồng Thủy sản I",
      location: "Hải Phòng",
      description: "Nhà nghiên cứu về nuôi trồng thủy sản và công nghệ sinh học",
      email: "nguyen.thi.oanh@ria1.org",
      phone: "0225-3861-1234",
      inventions: 13,
      patents: 9,
      rating: 4.6,
      verified: true,
      avatar: "/avatars/inventor13.jpg"
    },
    {
      id: 14,
      name: "PGS.TS. Lê Văn Phúc",
      title: "Phó Giáo sư, Tiến sĩ",
      specialization: "Nông nghiệp",
      organization: "Trường Đại học Nông Lâm TP.HCM",
      location: "TP. Hồ Chí Minh",
      description: "Chuyên gia về nông nghiệp thông minh và công nghệ sinh học",
      email: "le.van.phuc@hcmuaf.edu.vn",
      phone: "028-3896-1234",
      inventions: 17,
      patents: 12,
      rating: 4.7,
      verified: true,
      avatar: "/avatars/inventor14.jpg"
    },
    {
      id: 15,
      name: "KS. Hoàng Minh Quân",
      title: "Kỹ sư",
      specialization: "Bảo mật thông tin",
      organization: "Công ty Cổ phần Đầu tư Công nghệ Bkav",
      location: "Hà Nội",
      description: "Kỹ sư bảo mật với nhiều sáng chế về an ninh mạng",
      email: "hoang.minh.quan@bkav.com.vn",
      phone: "024-3785-1234",
      inventions: 7,
      patents: 5,
      rating: 4.8,
      verified: true,
      avatar: "/avatars/inventor15.jpg"
    },
    {
      id: 16,
      name: "TS. Trần Thị Rạng",
      title: "Tiến sĩ",
      specialization: "Địa chất",
      organization: "Viện Khoa học Địa chất và Khoáng sản",
      location: "Hà Nội",
      description: "Nhà nghiên cứu về địa chất và công nghệ khai thác khoáng sản",
      email: "tran.thi.rang@imgm.gov.vn",
      phone: "024-3856-1234",
      inventions: 10,
      patents: 7,
      rating: 4.3,
      verified: true,
      avatar: "/avatars/inventor16.jpg"
    },
    {
      id: 17,
      name: "GS.TS. Phạm Văn Sơn",
      title: "Giáo sư, Tiến sĩ",
      specialization: "Khoa học xã hội",
      organization: "Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQG Hà Nội",
      location: "Hà Nội",
      description: "Chuyên gia về khoa học xã hội và công nghệ giáo dục",
      email: "pham.van.son@ussh.edu.vn",
      phone: "024-3754-5678",
      inventions: 8,
      patents: 6,
      rating: 4.2,
      verified: true,
      avatar: "/avatars/inventor17.jpg"
    },
    {
      id: 18,
      name: "TS. Nguyễn Thị Tuyết",
      title: "Tiến sĩ",
      specialization: "Chăn nuôi",
      organization: "Viện Nghiên cứu Chăn nuôi",
      location: "Hà Nội",
      description: "Nhà nghiên cứu về chăn nuôi và công nghệ sinh học động vật",
      email: "nguyen.thi.tuyet@vcn.vn",
      phone: "024-3854-1234",
      inventions: 12,
      patents: 8,
      rating: 4.4,
      verified: true,
      avatar: "/avatars/inventor18.jpg"
    },
    {
      id: 19,
      name: "KS. Vũ Văn Uyên",
      title: "Kỹ sư",
      specialization: "Luyện kim",
      organization: "Công ty Cổ phần Tập đoàn Hòa Phát",
      location: "Hà Nội",
      description: "Kỹ sư luyện kim với nhiều sáng chế về vật liệu thép",
      email: "vu.van.uyen@hoaphat.com.vn",
      phone: "024-3868-5678",
      inventions: 11,
      patents: 8,
      rating: 4.5,
      verified: true,
      avatar: "/avatars/inventor19.jpg"
    },
    {
      id: 20,
      name: "PGS.TS. Lê Thị Vân",
      title: "Phó Giáo sư, Tiến sĩ",
      specialization: "Thủy lợi",
      organization: "Trường Đại học Thủy lợi",
      location: "Hà Nội",
      description: "Chuyên gia về thủy lợi và công nghệ môi trường",
      email: "le.thi.van@tlu.edu.vn",
      phone: "024-3854-5678",
      inventions: 14,
      patents: 10,
      rating: 4.3,
      verified: true,
      avatar: "/avatars/inventor20.jpg"
    },
    {
      id: 21,
      name: "TS. Trần Văn Xanh",
      title: "Tiến sĩ",
      specialization: "Lúa",
      organization: "Viện Nghiên cứu Lúa ĐBSCL",
      location: "Cần Thơ",
      description: "Nhà nghiên cứu về giống lúa và công nghệ nông nghiệp",
      email: "tran.van.xanh@clrri.org",
      phone: "0292-3891-1234",
      inventions: 16,
      patents: 12,
      rating: 4.6,
      verified: true,
      avatar: "/avatars/inventor21.jpg"
    },
    {
      id: 22,
      name: "GS.TS. Nguyễn Thị Yến",
      title: "Giáo sư, Tiến sĩ",
      specialization: "Kinh tế",
      organization: "Trường Đại học Kinh tế Quốc dân",
      location: "Hà Nội",
      description: "Chuyên gia về kinh tế và công nghệ tài chính",
      email: "nguyen.thi.yen@neu.edu.vn",
      phone: "024-3869-1234",
      inventions: 9,
      patents: 7,
      rating: 4.4,
      verified: true,
      avatar: "/avatars/inventor22.jpg"
    },
    {
      id: 23,
      name: "KS. Phạm Văn Zũng",
      title: "Kỹ sư",
      specialization: "Phần mềm",
      organization: "Công ty Cổ phần FPT Software",
      location: "TP. Hồ Chí Minh",
      description: "Kỹ sư phần mềm với nhiều sáng chế về AI và machine learning",
      email: "pham.van.zung@fptsoftware.com",
      phone: "028-7300-5678",
      inventions: 13,
      patents: 9,
      rating: 4.8,
      verified: true,
      avatar: "/avatars/inventor23.jpg"
    },
    {
      id: 24,
      name: "TS. Lê Thị Anh",
      title: "Tiến sĩ",
      specialization: "Cao su",
      organization: "Viện Nghiên cứu Cao su Việt Nam",
      location: "TP. Hồ Chí Minh",
      description: "Nhà nghiên cứu về cao su và công nghệ polyme",
      email: "le.thi.anh@vrri.vn",
      phone: "028-3895-1234",
      inventions: 11,
      patents: 8,
      rating: 4.3,
      verified: true,
      avatar: "/avatars/inventor24.jpg"
    },
    {
      id: 25,
      name: "PGS.TS. Trần Văn Bình",
      title: "Phó Giáo sư, Tiến sĩ",
      specialization: "Giao thông",
      organization: "Trường Đại học Giao thông Vận tải",
      location: "Hà Nội",
      description: "Chuyên gia về giao thông vận tải và công nghệ logistics",
      email: "tran.van.binh@utc.edu.vn",
      phone: "024-3869-5678",
      inventions: 12,
      patents: 9,
      rating: 4.2,
      verified: true,
      avatar: "/avatars/inventor25.jpg"
    },
    {
      id: 26,
      name: "TS. Nguyễn Thị Cúc",
      title: "Tiến sĩ",
      specialization: "Môi trường",
      organization: "Viện Nghiên cứu Môi trường và Phát triển Bền vững",
      location: "Hà Nội",
      description: "Nhà nghiên cứu về môi trường và công nghệ xanh",
      email: "nguyen.thi.cuc@ired.vn",
      phone: "024-3857-1234",
      inventions: 15,
      patents: 11,
      rating: 4.5,
      verified: true,
      avatar: "/avatars/inventor26.jpg"
    },
    {
      id: 27,
      name: "KS. Vũ Văn Dũng",
      title: "Kỹ sư",
      specialization: "Thực phẩm",
      organization: "Công ty Cổ phần Sữa Việt Nam (Vinamilk)",
      location: "TP. Hồ Chí Minh",
      description: "Kỹ sư thực phẩm với nhiều sáng chế về chế biến sữa",
      email: "vu.van.dung@vinamilk.com.vn",
      phone: "028-3894-1234",
      inventions: 10,
      patents: 7,
      rating: 4.4,
      verified: true,
      avatar: "/avatars/inventor27.jpg"
    },
    {
      id: 28,
      name: "GS.TS. Phạm Thị Em",
      title: "Giáo sư, Tiến sĩ",
      specialization: "Cơ khí",
      organization: "Trường Đại học Bách khoa Đà Nẵng",
      location: "Đà Nẵng",
      description: "Chuyên gia về cơ khí và tự động hóa sản xuất",
      email: "pham.thi.em@dut.udn.vn",
      phone: "0236-3841-1234",
      inventions: 19,
      patents: 14,
      rating: 4.5,
      verified: true,
      avatar: "/avatars/inventor28.jpg"
    },
    {
      id: 29,
      name: "TS. Lê Văn Phong",
      title: "Tiến sĩ",
      specialization: "Hải sản",
      organization: "Viện Nghiên cứu Hải sản",
      location: "Hải Phòng",
      description: "Nhà nghiên cứu về hải sản và công nghệ thủy sản",
      email: "le.van.phong@risp.org.vn",
      phone: "0225-3862-1234",
      inventions: 9,
      patents: 6,
      rating: 4.3,
      verified: true,
      avatar: "/avatars/inventor29.jpg"
    },
    {
      id: 30,
      name: "KS. Trần Thị Quỳnh",
      title: "Kỹ sư",
      specialization: "Vật liệu xây dựng",
      organization: "Công ty Cổ phần Tập đoàn Hòa An",
      location: "TP. Hồ Chí Minh",
      description: "Kỹ sư vật liệu với nhiều sáng chế về bê tông thông minh",
      email: "tran.thi.quynh@hoaan.com.vn",
      phone: "028-3897-1234",
      inventions: 8,
      patents: 5,
      rating: 4.4,
      verified: true,
      avatar: "/avatars/inventor30.jpg"
    }
  ];

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Trí tuệ nhân tạo', label: 'Trí tuệ nhân tạo' },
    { value: 'Công nghệ sinh học', label: 'Công nghệ sinh học' },
    { value: 'Công nghệ thông tin', label: 'Công nghệ thông tin' },
    { value: 'Vật liệu nano', label: 'Vật liệu nano' },
    { value: 'Năng lượng tái tạo', label: 'Năng lượng tái tạo' },
    { value: 'Điện tử viễn thông', label: 'Điện tử viễn thông' },
    { value: 'Cơ khí chính xác', label: 'Cơ khí chính xác' },
    { value: 'Hóa học hữu cơ', label: 'Hóa học hữu cơ' },
    { value: 'Vật lý ứng dụng', label: 'Vật lý ứng dụng' },
    { value: 'Xây dựng', label: 'Xây dựng' },
    { value: 'Năng lượng hạt nhân', label: 'Năng lượng hạt nhân' },
    { value: 'Y học', label: 'Y học' },
    { value: 'Thủy sản', label: 'Thủy sản' },
    { value: 'Nông nghiệp', label: 'Nông nghiệp' },
    { value: 'Bảo mật thông tin', label: 'Bảo mật thông tin' },
    { value: 'Địa chất', label: 'Địa chất' },
    { value: 'Khoa học xã hội', label: 'Khoa học xã hội' },
    { value: 'Chăn nuôi', label: 'Chăn nuôi' },
    { value: 'Luyện kim', label: 'Luyện kim' },
    { value: 'Thủy lợi', label: 'Thủy lợi' },
    { value: 'Lúa', label: 'Lúa' },
    { value: 'Kinh tế', label: 'Kinh tế' },
    { value: 'Phần mềm', label: 'Phần mềm' },
    { value: 'Cao su', label: 'Cao su' },
    { value: 'Giao thông', label: 'Giao thông' },
    { value: 'Môi trường', label: 'Môi trường' },
    { value: 'Thực phẩm', label: 'Thực phẩm' },
    { value: 'Cơ khí', label: 'Cơ khí' },
    { value: 'Hải sản', label: 'Hải sản' },
    { value: 'Vật liệu xây dựng', label: 'Vật liệu xây dựng' }
  ];

  const filteredInventors = inventors.filter(inventor => {
    const matchesSearch = inventor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inventor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inventor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inventor.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || inventor.specialization === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTitleIcon = (title: string) => {
    if (title.includes('Giáo sư') || title.includes('Phó Giáo sư')) {
      return GraduationCap;
    } else if (title.includes('Tiến sĩ')) {
      return Award;
    } else {
      return Briefcase;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/data" 
                className="mr-4 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Users className="h-8 w-8 mr-3 text-green-600" />
                  Danh sách Nhà sáng chế/Phát minh
                </h1>
                <p className="text-gray-600 mt-1">
                  Khám phá các nhà sáng chế, phát minh và chuyên gia công nghệ hàng đầu
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{inventors.length}</div>
              <div className="text-sm text-gray-600">Nhà sáng chế</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm nhà sáng chế..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventors.map((inventor) => {
              const TitleIcon = getTitleIcon(inventor.title);
              return (
                <div key={inventor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <TitleIcon className="h-8 w-8 text-green-600" />
                      </div>
                      {inventor.verified && (
                        <div className="flex items-center text-green-600">
                          <Award className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Xác thực</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {inventor.name}
                    </h3>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                        {inventor.title}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {inventor.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{inventor.specialization}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{inventor.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{inventor.organization}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Lightbulb className="h-4 w-4 mr-1" />
                        <span>{inventor.inventions} sáng chế</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span>{inventor.patents} bằng sáng chế</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-1 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-900">{inventor.rating}/5.0</span>
                      </div>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredInventors.map((inventor) => {
              const TitleIcon = getTitleIcon(inventor.title);
              return (
                <div key={inventor.id} className="border-b border-gray-100 last:border-b-0 p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                        <TitleIcon className="h-8 w-8 text-green-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {inventor.name}
                          </h3>
                          {inventor.verified && (
                            <div className="flex items-center text-green-600">
                              <Award className="h-4 w-4 mr-1" />
                              <span className="text-xs font-medium">Xác thực</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                            {inventor.title}
                          </span>
                          <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                            {inventor.specialization}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {inventor.description}
                        </p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{inventor.location}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1" />
                            <span className="truncate">{inventor.organization}</span>
                          </div>
                          <div className="flex items-center">
                            <Lightbulb className="h-4 w-4 mr-1" />
                            <span>{inventor.inventions} sáng chế</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            <span>{inventor.rating}/5.0</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-6">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {filteredInventors.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy nhà sáng chế nào
            </h3>
            <p className="text-gray-600">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
