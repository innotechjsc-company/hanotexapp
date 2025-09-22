"use client";

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  Phone, 
  Mail, 
  Globe,
  Search,
  Filter,
  Grid,
  List,
  ArrowLeft,
  Star,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function OrganizationsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - trong thực tế sẽ lấy từ API
  const organizations = [
        {
          id: 1,
          name: "Viện Khoa học và Công nghệ Việt Nam",
          type: "Viện nghiên cứu",
          category: "Khoa học tự nhiên",
          location: "Hà Nội",
          description: "Viện nghiên cứu hàng đầu về khoa học và công nghệ tại Việt Nam",
          website: "https://vast.vn",
          email: "info@vast.vn",
          phone: "024-3791-1234",
          technologies: 45,
          rating: 4.8,
          verified: true,
          logo: "/images/organizations/placeholder.svg"
        },
    {
      id: 2,
      name: "Trường Đại học Bách khoa Hà Nội",
      type: "Trường đại học",
      category: "Kỹ thuật",
      location: "Hà Nội",
      description: "Trường đại học kỹ thuật hàng đầu Việt Nam với nhiều nghiên cứu đột phá",
      website: "https://hust.edu.vn",
      email: "contact@hust.edu.vn",
      phone: "024-3868-1234",
      technologies: 78,
      rating: 4.9,
      verified: true,
          logo: "/images/organizations/placeholder.svg"
    },
    {
      id: 3,
      name: "Tập đoàn FPT",
      type: "Doanh nghiệp",
      category: "Công nghệ thông tin",
      location: "TP. Hồ Chí Minh",
      description: "Tập đoàn công nghệ thông tin hàng đầu Việt Nam",
      website: "https://fpt.vn",
      email: "info@fpt.vn",
      phone: "024-7300-1234",
      technologies: 156,
      rating: 4.7,
      verified: true,
          logo: "/images/organizations/placeholder.svg"
    },
    {
      id: 4,
      name: "Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
      type: "Viện nghiên cứu",
      category: "Khoa học tự nhiên",
      location: "Hà Nội",
      description: "Viện hàn lâm khoa học hàng đầu quốc gia",
      website: "https://vast.ac.vn",
      email: "admin@vast.ac.vn",
      phone: "024-3791-5678",
      technologies: 92,
      rating: 4.9,
      verified: true,
          logo: "/images/organizations/placeholder.svg"
    },
    {
      id: 5,
      name: "Trường Đại học Công nghệ Thông tin",
      type: "Trường đại học",
      category: "Công nghệ thông tin",
      location: "TP. Hồ Chí Minh",
      description: "Trường đại học chuyên về công nghệ thông tin và truyền thông",
      website: "https://uit.edu.vn",
      email: "info@uit.edu.vn",
      phone: "028-3725-1234",
      technologies: 63,
      rating: 4.6,
      verified: true,
          logo: "/images/organizations/placeholder.svg"
    },
    {
      id: 6,
      name: "Viện Nghiên cứu Dầu khí Việt Nam",
      type: "Viện nghiên cứu",
      category: "Năng lượng",
      location: "Vũng Tàu",
      description: "Viện nghiên cứu chuyên sâu về dầu khí và năng lượng",
      website: "https://vpi.pvn.vn",
      email: "info@vpi.pvn.vn",
      phone: "0254-3856-1234",
      technologies: 34,
      rating: 4.5,
      verified: true
    },
    {
      id: 7,
      name: "Trường Đại học Khoa học Tự nhiên - ĐHQG Hà Nội",
      type: "Trường đại học",
      category: "Khoa học tự nhiên",
      location: "Hà Nội",
      description: "Trường đại học hàng đầu về khoa học tự nhiên và công nghệ",
      website: "https://hus.vnu.edu.vn",
      email: "info@hus.vnu.edu.vn",
      phone: "024-3754-1234",
      technologies: 67,
      rating: 4.7,
      verified: true
    },
    {
      id: 8,
      name: "Viện Công nghệ Thông tin - Viện Hàn lâm KHCNVN",
      type: "Viện nghiên cứu",
      category: "Công nghệ thông tin",
      location: "Hà Nội",
      description: "Viện nghiên cứu chuyên sâu về công nghệ thông tin và truyền thông",
      website: "https://ioit.ac.vn",
      email: "info@ioit.ac.vn",
      phone: "024-3791-2345",
      technologies: 89,
      rating: 4.8,
      verified: true
    },
    {
      id: 9,
      name: "Trường Đại học Bách khoa TP.HCM",
      type: "Trường đại học",
      category: "Kỹ thuật",
      location: "TP. Hồ Chí Minh",
      description: "Trường đại học kỹ thuật hàng đầu miền Nam Việt Nam",
      website: "https://hcmut.edu.vn",
      email: "info@hcmut.edu.vn",
      phone: "028-3865-1234",
      technologies: 95,
      rating: 4.8,
      verified: true
    },
    {
      id: 10,
      name: "Công ty Cổ phần Tập đoàn Vingroup",
      type: "Doanh nghiệp",
      category: "Kỹ thuật",
      location: "Hà Nội",
      description: "Tập đoàn đa ngành hàng đầu Việt Nam với nhiều dự án công nghệ",
      website: "https://vingroup.net",
      email: "info@vingroup.net",
      phone: "024-3974-1234",
      technologies: 124,
      rating: 4.6,
      verified: true,
          logo: "/images/organizations/placeholder.svg"
    },
    {
      id: 11,
      name: "Viện Nghiên cứu Hạt nhân Đà Lạt",
      type: "Viện nghiên cứu",
      category: "Năng lượng",
      location: "Đà Lạt",
      description: "Viện nghiên cứu chuyên sâu về công nghệ hạt nhân và ứng dụng",
      website: "https://dalat.vn",
      email: "info@dalat.vn",
      phone: "0263-3821-1234",
      technologies: 28,
      rating: 4.4,
      verified: true
    },
    {
      id: 12,
      name: "Trường Đại học Y Hà Nội",
      type: "Trường đại học",
      category: "Y tế",
      location: "Hà Nội",
      description: "Trường đại học y khoa hàng đầu Việt Nam với nhiều nghiên cứu y học",
      website: "https://hmu.edu.vn",
      email: "info@hmu.edu.vn",
      phone: "024-3852-1234",
      technologies: 52,
      rating: 4.7,
      verified: true
    },
    {
      id: 13,
      name: "Viện Nghiên cứu Nuôi trồng Thủy sản I",
      type: "Viện nghiên cứu",
      category: "Nông nghiệp",
      location: "Hải Phòng",
      description: "Viện nghiên cứu chuyên sâu về nuôi trồng thủy sản và công nghệ sinh học",
      website: "https://ria1.org",
      email: "info@ria1.org",
      phone: "0225-3861-1234",
      technologies: 41,
      rating: 4.5,
      verified: true
    },
    {
      id: 14,
      name: "Trường Đại học Nông Lâm TP.HCM",
      type: "Trường đại học",
      category: "Nông nghiệp",
      location: "TP. Hồ Chí Minh",
      description: "Trường đại học chuyên về nông nghiệp, lâm nghiệp và công nghệ sinh học",
      website: "https://hcmuaf.edu.vn",
      email: "info@hcmuaf.edu.vn",
      phone: "028-3896-1234",
      technologies: 73,
      rating: 4.6,
      verified: true
    },
    {
      id: 15,
      name: "Công ty Cổ phần Đầu tư Công nghệ Bkav",
      type: "Doanh nghiệp",
      category: "Công nghệ thông tin",
      location: "Hà Nội",
      description: "Công ty công nghệ chuyên về bảo mật và an ninh mạng",
      website: "https://bkav.com.vn",
      email: "info@bkav.com.vn",
      phone: "024-3785-1234",
      technologies: 87,
      rating: 4.7,
      verified: true,
          logo: "/images/organizations/placeholder.svg"
    },
    {
      id: 16,
      name: "Viện Khoa học Địa chất và Khoáng sản",
      type: "Viện nghiên cứu",
      category: "Khoa học tự nhiên",
      location: "Hà Nội",
      description: "Viện nghiên cứu chuyên sâu về địa chất, khoáng sản và tài nguyên",
      website: "https://imgm.gov.vn",
      email: "info@imgm.gov.vn",
      phone: "024-3856-1234",
      technologies: 38,
      rating: 4.3,
      verified: true
    },
    {
      id: 17,
      name: "Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQG Hà Nội",
      type: "Trường đại học",
      category: "Khoa học xã hội",
      location: "Hà Nội",
      description: "Trường đại học chuyên về khoa học xã hội và nhân văn",
      website: "https://ussh.edu.vn",
      email: "info@ussh.edu.vn",
      phone: "024-3754-5678",
      technologies: 29,
      rating: 4.2,
      verified: true
    },
    {
      id: 18,
      name: "Viện Nghiên cứu Chăn nuôi",
      type: "Viện nghiên cứu",
      category: "Nông nghiệp",
      location: "Hà Nội",
      description: "Viện nghiên cứu chuyên sâu về chăn nuôi và công nghệ sinh học động vật",
      website: "https://vcn.vn",
      email: "info@vcn.vn",
      phone: "024-3854-1234",
      technologies: 46,
      rating: 4.4,
      verified: true
    },
    {
      id: 19,
      name: "Công ty Cổ phần Tập đoàn Hòa Phát",
      type: "Doanh nghiệp",
      category: "Kỹ thuật",
      location: "Hà Nội",
      description: "Tập đoàn công nghiệp hàng đầu với nhiều dự án công nghệ tiên tiến",
      website: "https://hoaphat.com.vn",
      email: "info@hoaphat.com.vn",
      phone: "024-3868-5678",
      technologies: 112,
      rating: 4.5,
      verified: true
    },
    {
      id: 20,
      name: "Trường Đại học Thủy lợi",
      type: "Trường đại học",
      category: "Kỹ thuật",
      location: "Hà Nội",
      description: "Trường đại học chuyên về thủy lợi, thủy điện và công nghệ môi trường",
      website: "https://tlu.edu.vn",
      email: "info@tlu.edu.vn",
      phone: "024-3854-5678",
      technologies: 58,
      rating: 4.3,
      verified: true
    },
    {
      id: 21,
      name: "Viện Nghiên cứu Lúa ĐBSCL",
      type: "Viện nghiên cứu",
      category: "Nông nghiệp",
      location: "Cần Thơ",
      description: "Viện nghiên cứu chuyên sâu về lúa và công nghệ nông nghiệp vùng ĐBSCL",
      website: "https://clrri.org",
      email: "info@clrri.org",
      phone: "0292-3891-1234",
      technologies: 64,
      rating: 4.6,
      verified: true
    },
    {
      id: 22,
      name: "Trường Đại học Kinh tế Quốc dân",
      type: "Trường đại học",
      category: "Kinh tế",
      location: "Hà Nội",
      description: "Trường đại học kinh tế hàng đầu với nghiên cứu về fintech và công nghệ tài chính",
      website: "https://neu.edu.vn",
      email: "info@neu.edu.vn",
      phone: "024-3869-1234",
      technologies: 35,
      rating: 4.4,
      verified: true
    },
    {
      id: 23,
      name: "Công ty Cổ phần FPT Software",
      type: "Doanh nghiệp",
      category: "Công nghệ thông tin",
      location: "TP. Hồ Chí Minh",
      description: "Công ty phần mềm hàng đầu Việt Nam với nhiều giải pháp công nghệ",
      website: "https://fptsoftware.com",
      email: "info@fptsoftware.com",
      phone: "028-7300-5678",
      technologies: 143,
      rating: 4.8,
      verified: true,
          logo: "/images/organizations/placeholder.svg"
    },
    {
      id: 24,
      name: "Viện Nghiên cứu Cao su Việt Nam",
      type: "Viện nghiên cứu",
      category: "Nông nghiệp",
      location: "TP. Hồ Chí Minh",
      description: "Viện nghiên cứu chuyên sâu về cao su và công nghệ vật liệu polyme",
      website: "https://vrri.vn",
      email: "info@vrri.vn",
      phone: "028-3895-1234",
      technologies: 42,
      rating: 4.3,
      verified: true
    },
    {
      id: 25,
      name: "Trường Đại học Giao thông Vận tải",
      type: "Trường đại học",
      category: "Kỹ thuật",
      location: "Hà Nội",
      description: "Trường đại học chuyên về giao thông vận tải và công nghệ logistics",
      website: "https://utc.edu.vn",
      email: "info@utc.edu.vn",
      phone: "024-3869-5678",
      technologies: 49,
      rating: 4.2,
      verified: true
    },
    {
      id: 26,
      name: "Viện Nghiên cứu Môi trường và Phát triển Bền vững",
      type: "Viện nghiên cứu",
      category: "Môi trường",
      location: "Hà Nội",
      description: "Viện nghiên cứu chuyên sâu về môi trường và công nghệ xanh",
      website: "https://ired.vn",
      email: "info@ired.vn",
      phone: "024-3857-1234",
      technologies: 53,
      rating: 4.5,
      verified: true
    },
    {
      id: 27,
      name: "Công ty Cổ phần Sữa Việt Nam (Vinamilk)",
      type: "Doanh nghiệp",
      category: "Thực phẩm",
      location: "TP. Hồ Chí Minh",
      description: "Tập đoàn sữa hàng đầu với nhiều công nghệ chế biến thực phẩm",
      website: "https://vinamilk.com.vn",
      email: "info@vinamilk.com.vn",
      phone: "028-3894-1234",
      technologies: 67,
      rating: 4.4,
      verified: true,
          logo: "/images/organizations/placeholder.svg"
    },
    {
      id: 28,
      name: "Trường Đại học Bách khoa Đà Nẵng",
      type: "Trường đại học",
      category: "Kỹ thuật",
      location: "Đà Nẵng",
      description: "Trường đại học kỹ thuật hàng đầu miền Trung Việt Nam",
      website: "https://dut.udn.vn",
      email: "info@dut.udn.vn",
      phone: "0236-3841-1234",
      technologies: 71,
      rating: 4.5,
      verified: true
    },
    {
      id: 29,
      name: "Viện Nghiên cứu Hải sản",
      type: "Viện nghiên cứu",
      category: "Nông nghiệp",
      location: "Hải Phòng",
      description: "Viện nghiên cứu chuyên sâu về hải sản và công nghệ thủy sản",
      website: "https://risp.org.vn",
      email: "info@risp.org.vn",
      phone: "0225-3862-1234",
      technologies: 38,
      rating: 4.3,
      verified: true
    },
    {
      id: 30,
      name: "Công ty Cổ phần Tập đoàn Hòa An",
      type: "Doanh nghiệp",
      category: "Vật liệu",
      location: "TP. Hồ Chí Minh",
      description: "Tập đoàn chuyên về vật liệu xây dựng và công nghệ vật liệu tiên tiến",
      website: "https://hoaan.com.vn",
      email: "info@hoaan.com.vn",
      phone: "028-3897-1234",
      technologies: 56,
      rating: 4.4,
      verified: true
    }
  ];

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Khoa học tự nhiên', label: 'Khoa học tự nhiên' },
    { value: 'Kỹ thuật', label: 'Kỹ thuật' },
    { value: 'Công nghệ thông tin', label: 'Công nghệ thông tin' },
    { value: 'Năng lượng', label: 'Năng lượng' },
    { value: 'Y tế', label: 'Y tế' },
    { value: 'Nông nghiệp', label: 'Nông nghiệp' },
    { value: 'Khoa học xã hội', label: 'Khoa học xã hội' },
    { value: 'Kinh tế', label: 'Kinh tế' },
    { value: 'Thực phẩm', label: 'Thực phẩm' },
    { value: 'Môi trường', label: 'Môi trường' },
    { value: 'Vật liệu', label: 'Vật liệu' }
  ];

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || org.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                  <Building2 className="h-8 w-8 mr-3 text-blue-600" />
                  Danh sách Tổ chức/Viện/Trường
                </h1>
                <p className="text-gray-600 mt-1">
                  Khám phá các tổ chức, viện nghiên cứu và trường đại học tham gia sàn giao dịch
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{organizations.length}</div>
              <div className="text-sm text-gray-600">Tổ chức</div>
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
                placeholder="Tìm kiếm tổ chức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
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
            {filteredOrganizations.map((org) => (
              <div key={org.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                {org.logo ? (
                  <img 
                    src={org.logo} 
                    alt={`${org.name} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <span className="text-white font-bold text-xs">
                    {org.name.split(' ').map(word => word[0]).join('').slice(0, 3)}
                  </span>
                </div>
              </div>
                    {org.verified && (
                      <div className="flex items-center text-green-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Xác thực</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {org.name}
                  </h3>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                      {org.type}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {org.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{org.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{org.technologies} công nghệ</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-2 flex-shrink-0 text-yellow-500" />
                      <span>{org.rating}/5.0</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm font-medium text-gray-900">
                      {org.category}
                    </span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredOrganizations.map((org) => (
              <div key={org.id} className="border-b border-gray-100 last:border-b-0 p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mr-4 overflow-hidden">
                      {org.logo ? (
                        <img 
                          src={org.logo} 
                          alt={`${org.name} logo`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <Building2 className={`h-6 w-6 text-blue-600 ${org.logo ? 'hidden' : ''}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {org.name}
                        </h3>
                        {org.verified && (
                          <div className="flex items-center text-green-600">
                            <Award className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Xác thực</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                          {org.type}
                        </span>
                        <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                          {org.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {org.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{org.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{org.technologies} công nghệ</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>{org.rating}/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-6">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredOrganizations.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy tổ chức nào
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
