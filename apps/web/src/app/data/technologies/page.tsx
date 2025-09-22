"use client";

import React, { useState } from 'react';
import { 
  Lightbulb, 
  MapPin, 
  Calendar, 
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
  Zap,
  Target,
  Eye,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function TechnologiesDataPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Mock data - trong thực tế sẽ lấy từ API
  const technologies = [
    {
      id: 1,
      name: "Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế",
      type: "Công nghệ",
      category: "Trí tuệ nhân tạo",
      organization: "Viện Khoa học và Công nghệ Việt Nam",
      inventor: "GS.TS. Nguyễn Văn An",
      location: "Hà Nội",
      description: "Hệ thống sử dụng deep learning để phân tích hình ảnh y tế và chẩn đoán bệnh lý tự động",
      status: "Đã thương mại hóa",
      trl: 8,
      price: "Liên hệ",
      views: 1250,
      rating: 4.8,
      verified: true,
      createdAt: "2024-01-15",
      tags: ["AI", "Y tế", "Deep Learning", "Chẩn đoán"]
    },
    {
      id: 2,
      name: "Vật liệu composite từ sợi tre",
      type: "Công nghệ",
      category: "Vật liệu",
      organization: "Trường Đại học Bách khoa Hà Nội",
      inventor: "TS. Trần Thị Bình",
      location: "Hà Nội",
      description: "Vật liệu composite mới từ sợi tre tự nhiên, có độ bền cao và thân thiện môi trường",
      status: "Sẵn sàng chuyển giao",
      trl: 7,
      price: "500,000,000 VNĐ",
      views: 890,
      rating: 4.6,
      verified: true,
      createdAt: "2024-02-20",
      tags: ["Vật liệu", "Composite", "Tre", "Thân thiện môi trường"]
    },
    {
      id: 3,
      name: "Hệ thống IoT giám sát chất lượng nước",
      type: "Công nghệ",
      category: "Internet of Things",
      organization: "Tập đoàn FPT",
      inventor: "KS. Lê Minh Cường",
      location: "TP. Hồ Chí Minh",
      description: "Hệ thống IoT thời gian thực để giám sát và phân tích chất lượng nước",
      status: "Đang phát triển",
      trl: 6,
      price: "Liên hệ",
      views: 750,
      rating: 4.5,
      verified: true,
      createdAt: "2024-03-10",
      tags: ["IoT", "Nước", "Giám sát", "Thời gian thực"]
    },
    {
      id: 4,
      name: "Nhu cầu về công nghệ xử lý rác thải nhựa",
      type: "Nhu cầu",
      category: "Môi trường",
      organization: "Công ty Môi trường Xanh",
      inventor: "PGS.TS. Phạm Thị Dung",
      location: "TP. Hồ Chí Minh",
      description: "Tìm kiếm công nghệ tiên tiến để xử lý và tái chế rác thải nhựa hiệu quả",
      status: "Đang tìm kiếm",
      budget: "2,000,000,000 VNĐ",
      deadline: "2024-12-31",
      views: 420,
      rating: 4.7,
      verified: true,
      createdAt: "2024-04-05",
      tags: ["Rác thải", "Nhựa", "Tái chế", "Môi trường"]
    },
    {
      id: 5,
      name: "Thuốc điều trị ung thư từ cây dược liệu",
      type: "Công nghệ",
      category: "Dược phẩm",
      organization: "Viện Hàn lâm Khoa học và Công nghệ Việt Nam",
      inventor: "TS. Hoàng Văn Em",
      location: "Hà Nội",
      description: "Chiết xuất hoạt chất từ cây dược liệu Việt Nam để điều trị ung thư",
      status: "Thử nghiệm lâm sàng",
      trl: 4,
      price: "Liên hệ",
      views: 1100,
      rating: 4.9,
      verified: true,
      createdAt: "2024-01-30",
      tags: ["Dược phẩm", "Ung thư", "Dược liệu", "Y tế"]
    },
    {
      id: 6,
      name: "Nhu cầu về công nghệ năng lượng mặt trời",
      type: "Nhu cầu",
      category: "Năng lượng",
      organization: "Nhà máy Điện Xanh",
      inventor: "KS. Vũ Thị Phương",
      location: "Ninh Thuận",
      description: "Tìm kiếm công nghệ pin mặt trời hiệu suất cao cho dự án năng lượng tái tạo",
      status: "Đang tìm kiếm",
      budget: "5,000,000,000 VNĐ",
      deadline: "2025-06-30",
      views: 680,
      rating: 4.6,
      verified: true,
      createdAt: "2024-05-12",
      tags: ["Năng lượng", "Mặt trời", "Pin", "Tái tạo"]
    },
    {
      id: 7,
      name: "Robot phẫu thuật tự động",
      type: "Công nghệ",
      category: "Y tế",
      organization: "Trường Đại học Bách khoa Hà Nội",
      inventor: "GS.TS. Đỗ Văn Giang",
      location: "Hà Nội",
      description: "Robot phẫu thuật với độ chính xác cao và khả năng học tập AI",
      status: "Sẵn sàng chuyển giao",
      trl: 8,
      price: "2,500,000,000 VNĐ",
      views: 980,
      rating: 4.8,
      verified: true,
      createdAt: "2024-02-15",
      tags: ["Robot", "Phẫu thuật", "AI", "Y tế"]
    },
    {
      id: 8,
      name: "Nhu cầu về công nghệ sản xuất dược phẩm",
      type: "Nhu cầu",
      category: "Dược phẩm",
      organization: "Công ty Dược phẩm Hà Nội",
      inventor: "TS. Lê Thị Hương",
      location: "Hà Nội",
      description: "Tìm kiếm công nghệ sản xuất dược phẩm hiện đại và tự động hóa",
      status: "Đang tìm kiếm",
      budget: "3,500,000,000 VNĐ",
      deadline: "2025-03-31",
      views: 520,
      rating: 4.7,
      verified: true,
      createdAt: "2024-04-20",
      tags: ["Dược phẩm", "Sản xuất", "Tự động hóa", "Y tế"]
    },
    {
      id: 9,
      name: "Laser công suất cao ứng dụng công nghiệp",
      type: "Công nghệ",
      category: "Vật lý",
      organization: "Viện Công nghệ Thông tin - Viện Hàn lâm KHCNVN",
      inventor: "PGS.TS. Nguyễn Văn Khoa",
      location: "Hà Nội",
      description: "Hệ thống laser công suất cao cho ứng dụng cắt, hàn trong công nghiệp",
      status: "Đã thương mại hóa",
      trl: 9,
      price: "1,800,000,000 VNĐ",
      views: 750,
      rating: 4.6,
      verified: true,
      createdAt: "2024-01-25",
      tags: ["Laser", "Công nghiệp", "Cắt", "Hàn"]
    },
    {
      id: 10,
      name: "Nhu cầu về vật liệu xây dựng thông minh",
      type: "Nhu cầu",
      category: "Vật liệu",
      organization: "Tập đoàn Vingroup",
      inventor: "KS. Trần Minh Long",
      location: "Hà Nội",
      description: "Tìm kiếm vật liệu xây dựng có khả năng tự phục hồi và thích ứng với môi trường",
      status: "Đang tìm kiếm",
      budget: "4,000,000,000 VNĐ",
      deadline: "2025-08-31",
      views: 650,
      rating: 4.5,
      verified: true,
      createdAt: "2024-05-08",
      tags: ["Vật liệu", "Xây dựng", "Thông minh", "Tự phục hồi"]
    },
    {
      id: 11,
      name: "Hệ thống điều trị ung thư bằng hạt nhân",
      type: "Công nghệ",
      category: "Y tế",
      organization: "Viện Nghiên cứu Hạt nhân Đà Lạt",
      inventor: "TS. Phạm Thị Mai",
      location: "Đà Lạt",
      description: "Công nghệ điều trị ung thư bằng phóng xạ có độ chính xác cao",
      status: "Thử nghiệm lâm sàng",
      trl: 6,
      price: "Liên hệ",
      views: 890,
      rating: 4.4,
      verified: true,
      createdAt: "2024-03-05",
      tags: ["Hạt nhân", "Ung thư", "Phóng xạ", "Y tế"]
    },
    {
      id: 12,
      name: "Nhu cầu về thiết bị y tế di động",
      type: "Nhu cầu",
      category: "Y tế",
      organization: "Bệnh viện Bạch Mai",
      inventor: "GS.TS. Vũ Văn Nam",
      location: "Hà Nội",
      description: "Tìm kiếm thiết bị y tế di động có khả năng chẩn đoán nhanh và chính xác",
      status: "Đang tìm kiếm",
      budget: "1,500,000,000 VNĐ",
      deadline: "2024-11-30",
      views: 720,
      rating: 4.9,
      verified: true,
      createdAt: "2024-04-10",
      tags: ["Thiết bị y tế", "Di động", "Chẩn đoán", "Y tế"]
    },
    {
      id: 13,
      name: "Công nghệ nuôi tôm thông minh",
      type: "Công nghệ",
      category: "Thủy sản",
      organization: "Viện Nghiên cứu Nuôi trồng Thủy sản I",
      inventor: "TS. Nguyễn Thị Oanh",
      location: "Hải Phòng",
      description: "Hệ thống nuôi tôm tự động với AI giám sát sức khỏe và chất lượng nước",
      status: "Sẵn sàng chuyển giao",
      trl: 7,
      price: "800,000,000 VNĐ",
      views: 680,
      rating: 4.6,
      verified: true,
      createdAt: "2024-02-28",
      tags: ["Nuôi tôm", "AI", "Tự động", "Thủy sản"]
    },
    {
      id: 14,
      name: "Nhu cầu về công nghệ nông nghiệp thông minh",
      type: "Nhu cầu",
      category: "Nông nghiệp",
      organization: "Nông trại Thông minh ĐBSCL",
      inventor: "PGS.TS. Lê Văn Phúc",
      location: "Cần Thơ",
      description: "Tìm kiếm công nghệ IoT và AI cho nông nghiệp thông minh",
      status: "Đang tìm kiếm",
      budget: "2,800,000,000 VNĐ",
      deadline: "2025-05-15",
      views: 590,
      rating: 4.7,
      verified: true,
      createdAt: "2024-04-25",
      tags: ["Nông nghiệp", "IoT", "AI", "Thông minh"]
    },
    {
      id: 15,
      name: "Hệ thống bảo mật mạng thế hệ mới",
      type: "Công nghệ",
      category: "Công nghệ thông tin",
      organization: "Công ty Cổ phần Đầu tư Công nghệ Bkav",
      inventor: "KS. Hoàng Minh Quân",
      location: "Hà Nội",
      description: "Hệ thống bảo mật mạng sử dụng AI để phát hiện và ngăn chặn tấn công",
      status: "Đã thương mại hóa",
      trl: 8,
      price: "1,200,000,000 VNĐ",
      views: 920,
      rating: 4.8,
      verified: true,
      createdAt: "2024-01-20",
      tags: ["Bảo mật", "Mạng", "AI", "An ninh"]
    },
    {
      id: 16,
      name: "Nhu cầu về công nghệ khai thác khoáng sản",
      type: "Nhu cầu",
      category: "Khoáng sản",
      organization: "Công ty Khai thác Than Quảng Ninh",
      inventor: "TS. Trần Thị Rạng",
      location: "Quảng Ninh",
      description: "Tìm kiếm công nghệ khai thác khoáng sản an toàn và hiệu quả",
      status: "Đang tìm kiếm",
      budget: "6,000,000,000 VNĐ",
      deadline: "2025-12-31",
      views: 480,
      rating: 4.3,
      verified: true,
      createdAt: "2024-05-01",
      tags: ["Khai thác", "Khoáng sản", "An toàn", "Hiệu quả"]
    },
    {
      id: 17,
      name: "Nền tảng giáo dục trực tuyến AI",
      type: "Công nghệ",
      category: "Giáo dục",
      organization: "Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQG Hà Nội",
      inventor: "GS.TS. Phạm Văn Sơn",
      location: "Hà Nội",
      description: "Nền tảng giáo dục sử dụng AI để cá nhân hóa học tập",
      status: "Đang phát triển",
      trl: 6,
      price: "Liên hệ",
      views: 650,
      rating: 4.2,
      verified: true,
      createdAt: "2024-03-15",
      tags: ["Giáo dục", "AI", "Trực tuyến", "Cá nhân hóa"]
    },
    {
      id: 18,
      name: "Nhu cầu về công nghệ chăn nuôi bò sữa",
      type: "Nhu cầu",
      category: "Chăn nuôi",
      organization: "Nông trại Bò sữa Mộc Châu",
      inventor: "TS. Nguyễn Thị Tuyết",
      location: "Sơn La",
      description: "Tìm kiếm công nghệ tự động hóa trong chăn nuôi bò sữa",
      status: "Đang tìm kiếm",
      budget: "1,800,000,000 VNĐ",
      deadline: "2024-10-31",
      views: 420,
      rating: 4.4,
      verified: true,
      createdAt: "2024-04-18",
      tags: ["Chăn nuôi", "Bò sữa", "Tự động", "Nông nghiệp"]
    },
    {
      id: 19,
      name: "Công nghệ luyện thép xanh",
      type: "Công nghệ",
      category: "Luyện kim",
      organization: "Công ty Cổ phần Tập đoàn Hòa Phát",
      inventor: "KS. Vũ Văn Uyên",
      location: "Hà Nội",
      description: "Công nghệ luyện thép sử dụng năng lượng tái tạo và giảm phát thải CO2",
      status: "Sẵn sàng chuyển giao",
      trl: 8,
      price: "5,500,000,000 VNĐ",
      views: 780,
      rating: 4.5,
      verified: true,
      createdAt: "2024-02-10",
      tags: ["Luyện kim", "Thép", "Xanh", "CO2"]
    },
    {
      id: 20,
      name: "Nhu cầu về hệ thống thủy lợi thông minh",
      type: "Nhu cầu",
      category: "Thủy lợi",
      organization: "Công ty Thủy lợi ĐBSCL",
      inventor: "PGS.TS. Lê Thị Vân",
      location: "An Giang",
      description: "Tìm kiếm hệ thống thủy lợi tự động và thông minh",
      status: "Đang tìm kiếm",
      budget: "3,200,000,000 VNĐ",
      deadline: "2025-04-30",
      views: 550,
      rating: 4.3,
      verified: true,
      createdAt: "2024-05-05",
      tags: ["Thủy lợi", "Tự động", "Thông minh", "Nông nghiệp"]
    },
    {
      id: 21,
      name: "Giống lúa chịu mặn cao sản",
      type: "Công nghệ",
      category: "Nông nghiệp",
      organization: "Viện Nghiên cứu Lúa ĐBSCL",
      inventor: "TS. Trần Văn Xanh",
      location: "Cần Thơ",
      description: "Giống lúa có khả năng chịu mặn cao và năng suất vượt trội",
      status: "Sẵn sàng chuyển giao",
      trl: 8,
      price: "300,000,000 VNĐ",
      views: 820,
      rating: 4.6,
      verified: true,
      createdAt: "2024-01-18",
      tags: ["Lúa", "Chịu mặn", "Năng suất", "Nông nghiệp"]
    },
    {
      id: 22,
      name: "Nhu cầu về fintech và blockchain",
      type: "Nhu cầu",
      category: "Tài chính",
      organization: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
      inventor: "GS.TS. Nguyễn Thị Yến",
      location: "Hà Nội",
      description: "Tìm kiếm công nghệ fintech và blockchain cho ngân hàng",
      status: "Đang tìm kiếm",
      budget: "4,500,000,000 VNĐ",
      deadline: "2025-07-31",
      views: 680,
      rating: 4.4,
      verified: true,
      createdAt: "2024-04-12",
      tags: ["Fintech", "Blockchain", "Ngân hàng", "Tài chính"]
    },
    {
      id: 23,
      name: "Nền tảng AI cho doanh nghiệp",
      type: "Công nghệ",
      category: "Trí tuệ nhân tạo",
      organization: "Công ty Cổ phần FPT Software",
      inventor: "KS. Phạm Văn Zũng",
      location: "TP. Hồ Chí Minh",
      description: "Nền tảng AI tổng hợp cho doanh nghiệp với nhiều ứng dụng",
      status: "Đã thương mại hóa",
      trl: 8,
      price: "2,000,000,000 VNĐ",
      views: 1100,
      rating: 4.8,
      verified: true,
      createdAt: "2024-01-12",
      tags: ["AI", "Doanh nghiệp", "Nền tảng", "Tổng hợp"]
    },
    {
      id: 24,
      name: "Nhu cầu về cao su tự nhiên chất lượng cao",
      type: "Nhu cầu",
      category: "Cao su",
      organization: "Công ty Cao su Đồng Nai",
      inventor: "TS. Lê Thị Anh",
      location: "Đồng Nai",
      description: "Tìm kiếm công nghệ sản xuất cao su tự nhiên chất lượng cao",
      status: "Đang tìm kiếm",
      budget: "2,200,000,000 VNĐ",
      deadline: "2024-12-15",
      views: 380,
      rating: 4.3,
      verified: true,
      createdAt: "2024-04-28",
      tags: ["Cao su", "Tự nhiên", "Chất lượng", "Sản xuất"]
    },
    {
      id: 25,
      name: "Hệ thống giao thông thông minh",
      type: "Công nghệ",
      category: "Giao thông",
      organization: "Trường Đại học Giao thông Vận tải",
      inventor: "PGS.TS. Trần Văn Bình",
      location: "Hà Nội",
      description: "Hệ thống quản lý giao thông thông minh sử dụng AI và IoT",
      status: "Đang phát triển",
      trl: 6,
      price: "Liên hệ",
      views: 720,
      rating: 4.2,
      verified: true,
      createdAt: "2024-03-20",
      tags: ["Giao thông", "AI", "IoT", "Quản lý"]
    },
    {
      id: 26,
      name: "Nhu cầu về công nghệ xử lý nước thải",
      type: "Nhu cầu",
      category: "Môi trường",
      organization: "Công ty Môi trường Đô thị Hà Nội",
      inventor: "TS. Nguyễn Thị Cúc",
      location: "Hà Nội",
      description: "Tìm kiếm công nghệ xử lý nước thải hiệu quả và tiết kiệm năng lượng",
      status: "Đang tìm kiếm",
      budget: "2,500,000,000 VNĐ",
      deadline: "2025-02-28",
      views: 590,
      rating: 4.5,
      verified: true,
      createdAt: "2024-05-10",
      tags: ["Nước thải", "Xử lý", "Tiết kiệm", "Môi trường"]
    },
    {
      id: 27,
      name: "Công nghệ sản xuất sữa tươi tiệt trùng",
      type: "Công nghệ",
      category: "Thực phẩm",
      organization: "Công ty Cổ phần Sữa Việt Nam (Vinamilk)",
      inventor: "KS. Vũ Văn Dũng",
      location: "TP. Hồ Chí Minh",
      description: "Công nghệ sản xuất sữa tươi tiệt trùng với chất lượng cao",
      status: "Đã thương mại hóa",
      trl: 9,
      price: "1,500,000,000 VNĐ",
      views: 680,
      rating: 4.4,
      verified: true,
      createdAt: "2024-01-08",
      tags: ["Sữa", "Tiệt trùng", "Thực phẩm", "Chất lượng"]
    },
    {
      id: 28,
      name: "Nhu cầu về robot công nghiệp",
      type: "Nhu cầu",
      category: "Cơ khí",
      organization: "Nhà máy Ô tô VinFast",
      inventor: "GS.TS. Phạm Thị Em",
      location: "Hải Phòng",
      description: "Tìm kiếm robot công nghiệp cho dây chuyền sản xuất ô tô",
      status: "Đang tìm kiếm",
      budget: "8,000,000,000 VNĐ",
      deadline: "2025-09-30",
      views: 780,
      rating: 4.5,
      verified: true,
      createdAt: "2024-04-15",
      tags: ["Robot", "Công nghiệp", "Ô tô", "Sản xuất"]
    },
    {
      id: 29,
      name: "Công nghệ nuôi cá biển sâu",
      type: "Công nghệ",
      category: "Thủy sản",
      organization: "Viện Nghiên cứu Hải sản",
      inventor: "TS. Lê Văn Phong",
      location: "Hải Phòng",
      description: "Công nghệ nuôi cá biển sâu với hệ thống tự động",
      status: "Sẵn sàng chuyển giao",
      trl: 7,
      price: "900,000,000 VNĐ",
      views: 520,
      rating: 4.3,
      verified: true,
      createdAt: "2024-02-25",
      tags: ["Cá biển", "Sâu", "Tự động", "Thủy sản"]
    },
    {
      id: 30,
      name: "Nhu cầu về bê tông tự phục hồi",
      type: "Nhu cầu",
      category: "Vật liệu",
      organization: "Tập đoàn Hòa An",
      inventor: "KS. Trần Thị Quỳnh",
      location: "TP. Hồ Chí Minh",
      description: "Tìm kiếm công nghệ bê tông có khả năng tự phục hồi vết nứt",
      status: "Đang tìm kiếm",
      budget: "1,200,000,000 VNĐ",
      deadline: "2024-11-15",
      views: 450,
      rating: 4.4,
      verified: true,
      createdAt: "2024-04-22",
      tags: ["Bê tông", "Tự phục hồi", "Vật liệu", "Xây dựng"]
    }
  ];

  const categories = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Trí tuệ nhân tạo', label: 'Trí tuệ nhân tạo' },
    { value: 'Vật liệu', label: 'Vật liệu' },
    { value: 'Internet of Things', label: 'Internet of Things' },
    { value: 'Môi trường', label: 'Môi trường' },
    { value: 'Dược phẩm', label: 'Dược phẩm' },
    { value: 'Năng lượng', label: 'Năng lượng' },
    { value: 'Y tế', label: 'Y tế' },
    { value: 'Vật lý', label: 'Vật lý' },
    { value: 'Thủy sản', label: 'Thủy sản' },
    { value: 'Nông nghiệp', label: 'Nông nghiệp' },
    { value: 'Công nghệ thông tin', label: 'Công nghệ thông tin' },
    { value: 'Khoáng sản', label: 'Khoáng sản' },
    { value: 'Giáo dục', label: 'Giáo dục' },
    { value: 'Chăn nuôi', label: 'Chăn nuôi' },
    { value: 'Luyện kim', label: 'Luyện kim' },
    { value: 'Thủy lợi', label: 'Thủy lợi' },
    { value: 'Tài chính', label: 'Tài chính' },
    { value: 'Cao su', label: 'Cao su' },
    { value: 'Giao thông', label: 'Giao thông' },
    { value: 'Thực phẩm', label: 'Thực phẩm' },
    { value: 'Cơ khí', label: 'Cơ khí' }
  ];

  const types = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Công nghệ', label: 'Công nghệ' },
    { value: 'Nhu cầu', label: 'Nhu cầu' }
  ];

  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tech.inventor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
    const matchesType = selectedType === 'all' || tech.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã thương mại hóa':
        return 'bg-green-100 text-green-800';
      case 'Sẵn sàng chuyển giao':
        return 'bg-blue-100 text-blue-800';
      case 'Đang phát triển':
        return 'bg-yellow-100 text-yellow-800';
      case 'Thử nghiệm lâm sàng':
        return 'bg-purple-100 text-purple-800';
      case 'Đang tìm kiếm':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                  <Lightbulb className="h-8 w-8 mr-3 text-purple-600" />
                  Danh sách Công Nghệ & Nhu cầu
                </h1>
                <p className="text-gray-600 mt-1">
                  Khám phá các công nghệ và nhu cầu công nghệ trên sàn giao dịch
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{technologies.length}</div>
              <div className="text-sm text-gray-600">Công nghệ & Nhu cầu</div>
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
                placeholder="Tìm kiếm công nghệ/nhu cầu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'
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
            {filteredTechnologies.map((tech) => (
              <div key={tech.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      tech.type === 'Công nghệ' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      {tech.type === 'Công nghệ' ? (
                        <Zap className="h-6 w-6 text-blue-600" />
                      ) : (
                        <Target className="h-6 w-6 text-orange-600" />
                      )}
                    </div>
                    {tech.verified && (
                      <div className="flex items-center text-green-600">
                        <Award className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Xác thực</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {tech.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(tech.status)}`}>
                      {tech.status}
                    </span>
                    <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                      {tech.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {tech.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{tech.inventor}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{tech.location}</span>
                    </div>
                    {tech.type === 'Công nghệ' && (
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>TRL {tech.trl}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{tech.views} lượt xem</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">{tech.rating}/5.0</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {tech.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                    {tech.tags.length > 3 && (
                      <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded text-xs">
                        +{tech.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      {tech.type === 'Công nghệ' ? tech.price : `Ngân sách: ${tech.budget}`}
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredTechnologies.map((tech) => (
              <div key={tech.id} className="border-b border-gray-100 last:border-b-0 p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 mr-4 ${
                      tech.type === 'Công nghệ' ? 'bg-blue-100' : 'bg-orange-100'
                    }`}>
                      {tech.type === 'Công nghệ' ? (
                        <Zap className="h-6 w-6 text-blue-600" />
                      ) : (
                        <Target className="h-6 w-6 text-orange-600" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {tech.name}
                        </h3>
                        {tech.verified && (
                          <div className="flex items-center text-green-600">
                            <Award className="h-4 w-4 mr-1" />
                            <span className="text-xs font-medium">Xác thực</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(tech.status)}`}>
                          {tech.status}
                        </span>
                        <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                          {tech.category}
                        </span>
                        {tech.type === 'Công nghệ' && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                            TRL {tech.trl}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {tech.description}
                      </p>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="truncate">{tech.inventor}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{tech.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{tech.views} lượt xem</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          <span>{tech.rating}/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 ml-6">
                    <div className="text-right text-sm">
                      <div className="text-gray-900 font-medium">
                        {tech.type === 'Công nghệ' ? tech.price : tech.budget}
                      </div>
                      {tech.type === 'Nhu cầu' && (
                        <div className="text-gray-500">
                          Hạn: {new Date(tech.deadline!).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                    <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredTechnologies.length === 0 && (
          <div className="text-center py-12">
            <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy công nghệ/nhu cầu nào
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
