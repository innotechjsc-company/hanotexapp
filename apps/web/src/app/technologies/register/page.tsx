'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { useMasterData } from '@/hooks/useMasterData';
import { 
  ArrowLeft,
  Save,
  Eye,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  FileText
} from 'lucide-react';

export default function RegisterTechnologyPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { masterData, loading: masterDataLoading, error: masterDataError } = useMasterData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    investmentTransfer: false,
    visibilityNDA: false,
    pricing: false
  });

  const [selectedIPType, setSelectedIPType] = useState('');
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    publicSummary: '',
    confidentialDetail: '',
    trlLevel: '',
    categoryId: '',
    visibilityMode: 'PUBLIC_SUMMARY',
    // Thông tin người đăng
    submitter: {
      submitterType: 'INDIVIDUAL',
      fullName: 'Nguyễn Văn A', // Tự động lấy từ auth
      email: 'user@example.com', // Tự động lấy từ auth
      phone: '',
      organization: '',
      position: '',
      // Trường cho doanh nghiệp
      taxCode: '',
      businessLicense: '',
      legalRepresentative: '',
      productionCapacity: '',
      // Trường cho viện/trường
      unitCode: '',
      managingAgency: '',
      researchTaskCode: '',
      acceptanceReport: '',
      researchTeam: ''
    },
    owners: [{ ownerType: 'INDIVIDUAL', ownerName: '', ownershipPercentage: 100 }],
    ipDetails: [{ ipType: 'PATENT', ipNumber: '', status: '', territory: '' }],
    // Pháp lý & Lãnh thổ
    legalTerritory: {
      protectionTerritories: [],
      certifications: [],
      localCertificationFiles: []
    },
    pricing: {
      pricingType: 'ASK',
      askingPrice: '',
      currency: 'VND',
      priceType: '',
      appraisalPurpose: '',
      appraisalScope: '',
      appraisalDeadline: ''
    },
    investmentTransfer: {
      investmentStage: '',
      commercializationMethods: [],
      transferMethods: [],
      territoryScope: '',
      financialMethods: [],
      usageLimitations: '',
      currentPartners: '',
      potentialPartners: ''
    },
    // Thông tin bổ sung (optional)
    optionalInfo: {
      team: '',
      testResults: '',
      economicSocialImpact: '',
      financialSupport: ''
    },
    // Thông tin phân loại
    classification: {
      field: '',
      industry: '',
      specialty: ''
    },
    // Tài liệu upload
    documents: []
  });

  const [categories, setCategories] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement technology registration API call
      console.log('Submitting technology:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Công nghệ đã được đăng ký thành công! Đang chờ phê duyệt.');
      setFormData({
        title: '',
        publicSummary: '',
        confidentialDetail: '',
        trlLevel: '',
        categoryId: '',
        visibilityMode: 'PUBLIC_SUMMARY',
        submitter: {
          submitterType: 'INDIVIDUAL',
          fullName: '',
          email: '',
          phone: '',
          organization: '',
          position: '',
          taxCode: '',
          businessLicense: '',
          legalRepresentative: '',
          productionCapacity: '',
          unitCode: '',
          managingAgency: '',
          researchTaskCode: '',
          acceptanceReport: '',
          researchTeam: ''
        },
        owners: [{ ownerType: 'INDIVIDUAL', ownerName: '', ownershipPercentage: 100 }],
        ipDetails: [{ ipType: 'PATENT', ipNumber: '', status: '', territory: '' }],
        legalTerritory: {
          protectionTerritories: [],
          certifications: [],
          localCertificationFiles: []
        },
        pricing: {
          pricingType: 'ASK',
          askingPrice: '',
          currency: 'VND',
          priceType: '',
          appraisalPurpose: '',
          appraisalScope: '',
          appraisalDeadline: ''
        },
        investmentTransfer: {
          investmentStage: '',
          commercializationMethods: [],
          transferMethods: [],
          territoryScope: '',
          financialMethods: [],
          usageLimitations: '',
          currentPartners: '',
          potentialPartners: ''
        }
      });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng ký công nghệ');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addOwner = () => {
    setFormData(prev => ({
      ...prev,
      owners: [...prev.owners, { ownerType: 'INDIVIDUAL', ownerName: '', ownershipPercentage: 0 }]
    }));
  };

  const removeOwner = (index: number) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.filter((_, i) => i !== index)
    }));
  };

  const updateOwner = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.map((owner, i) => 
        i === index ? { ...owner, [field]: value } : owner
      )
    }));
  };

  const addIPDetail = () => {
    setFormData(prev => ({
      ...prev,
      ipDetails: [...prev.ipDetails, { ipType: 'PATENT', ipNumber: '', status: '', territory: '' }]
    }));
  };

  const removeIPDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ipDetails: prev.ipDetails.filter((_, i) => i !== index)
    }));
  };

  const updateIPDetail = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      ipDetails: prev.ipDetails.map((ip, i) => 
        i === index ? { ...ip, [field]: value } : ip
      )
    }));
  };

  const handleTerritoryChange = (territory: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      legalTerritory: {
        ...prev.legalTerritory,
        protectionTerritories: checked 
          ? [...prev.legalTerritory.protectionTerritories, territory]
          : prev.legalTerritory.protectionTerritories.filter(t => t !== territory)
      }
    }));
  };

  const handleCertificationChange = (certification: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      legalTerritory: {
        ...prev.legalTerritory,
        certifications: checked 
          ? [...prev.legalTerritory.certifications, certification]
          : prev.legalTerritory.certifications.filter(c => c !== certification)
      }
    }));
  };

  const handleLocalCertificationUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} quá lớn. Kích thước tối đa là 10MB.`);
        continue;
      }

      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      };

      setFormData(prev => ({
        ...prev,
        legalTerritory: {
          ...prev.legalTerritory,
          localCertificationFiles: [...prev.legalTerritory.localCertificationFiles, newFile]
        }
      }));
    }
  };

  const removeLocalCertificationFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      legalTerritory: {
        ...prev.legalTerritory,
        localCertificationFiles: prev.legalTerritory.localCertificationFiles.filter((_, i) => i !== index)
      }
    }));
  };

  const toggleSection = (sectionName: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  const getIPTypeDescription = (ipType: string) => {
    if (!masterData?.ipTypes) return '';
    const ipTypeData = masterData.ipTypes.find(ip => ip.value === ipType);
    return ipTypeData?.description || '';
  };

  const processOCR = async (file: File) => {
    setOcrLoading(true);
    setOcrResult(null);
    try {
      // Tạo FormData để upload file
      const formData = new FormData();
      formData.append('file', file);

      // Gọi API OCR
      const response = await fetch('/api/ocr/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('OCR processing failed');
      }

      const result = await response.json();
      setOcrResult(result);

      // Tự động điền thông tin vào form
      if (result.success && result.extractedData) {
        const { extractedData } = result;
        
        setFormData(prev => ({
          ...prev,
          title: extractedData.title || prev.title,
          trlLevel: extractedData.trlSuggestion || prev.trlLevel,
          classification: {
            ...prev.classification,
            field: extractedData.field || prev.classification.field,
            industry: extractedData.industry || prev.classification.industry,
            specialty: extractedData.specialty || prev.classification.specialty
          }
        }));

        setSuccess(`OCR đã xử lý thành công! Đã tự động điền thông tin từ tài liệu.`);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      setError('Không thể xử lý OCR. Vui lòng thử lại.');
    } finally {
      setOcrLoading(false);
    }
  };

  const suggestTRLFromContent = (content: string) => {
    const lowerContent = content.toLowerCase();
    
    // TRL 1-3: Nguyên lý, khái niệm, bằng chứng thực nghiệm
    if (lowerContent.includes('nguyên lý') || lowerContent.includes('khái niệm') || 
        lowerContent.includes('lý thuyết') || lowerContent.includes('giả thuyết')) {
      return '1';
    }
    
    // TRL 4-6: Mẫu thử, nguyên mẫu
    if (lowerContent.includes('mẫu thử') || lowerContent.includes('nguyên mẫu') || 
        lowerContent.includes('prototype') || lowerContent.includes('demo')) {
      return '5';
    }
    
    // TRL 7-9: Pilot, thương mại hóa
    if (lowerContent.includes('pilot') || lowerContent.includes('thương mại') || 
        lowerContent.includes('sản xuất') || lowerContent.includes('thị trường')) {
      return '8';
    }
    
    return '3'; // Default
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      // Kiểm tra kích thước file (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} quá lớn. Kích thước tối đa là 10MB.`);
        continue;
      }

      // Thêm file vào danh sách
      const newDocument = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      };

      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, newDocument]
      }));

      // Xử lý OCR cho file đầu tiên
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        await processOCR(file);
      }
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };


  const getTRLSuggestions = (trlLevel: string) => {
    const suggestions: Record<string, { title: string; fields: string[] }> = {
      '1': {
        title: 'TRL 1 - Nguyên lý cơ bản',
        fields: ['Giả thuyết khoa học', 'Khung lý thuyết', 'Phương pháp nghiên cứu', 'Kế hoạch R&D']
      },
      '2': {
        title: 'TRL 2 - Khái niệm công nghệ',
        fields: ['Khái niệm công nghệ', 'Phân tích tính khả thi', 'Thiết kế sơ bộ', 'Đánh giá rủi ro']
      },
      '3': {
        title: 'TRL 3 - Bằng chứng thực nghiệm',
        fields: ['Kết quả thử nghiệm cơ sở', 'Bằng chứng khoa học', 'Phân tích dữ liệu', 'Báo cáo nghiên cứu']
      },
      '4': {
        title: 'TRL 4 - Mẫu thử trong lab',
        fields: ['Mẫu thử trong phòng thí nghiệm', 'BOM linh kiện', 'Sơ đồ kỹ thuật', 'Video demo']
      },
      '5': {
        title: 'TRL 5 - Mẫu thử gần điều kiện thực',
        fields: ['Mẫu thử trong môi trường thực tế', 'Kết quả pilot', 'Yêu cầu hạ tầng', 'Đánh giá hiệu suất']
      },
      '6': {
        title: 'TRL 6 - Nguyên mẫu',
        fields: ['Nguyên mẫu hoàn chỉnh', 'Thử nghiệm tích hợp', 'Đánh giá độ tin cậy', 'Tối ưu hóa thiết kế']
      },
      '7': {
        title: 'TRL 7 - Trình diễn quy mô pilot',
        fields: ['Hệ thống pilot', 'Thử nghiệm quy mô lớn', 'Đánh giá thương mại', 'Kế hoạch sản xuất']
      },
      '8': {
        title: 'TRL 8 - Hoàn thiện',
        fields: ['Hệ thống hoàn chỉnh', 'Quy trình sản xuất', 'Tiêu chuẩn chất lượng', 'Đào tạo vận hành']
      },
      '9': {
        title: 'TRL 9 - Thương mại hóa',
        fields: ['Sản phẩm thương mại', 'Case study khách hàng', 'Dữ liệu thị trường', 'Kế hoạch mở rộng']
      }
    };

    return suggestions[trlLevel] || null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Đăng ký công nghệ</h1>
                  <p className="text-gray-600">Đăng ký công nghệ mới lên sàn giao dịch HANOTEX</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trước
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {masterDataError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Lỗi tải dữ liệu: {masterDataError}
            </div>
          )}

          {masterDataLoading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-md flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Đang tải dữ liệu...
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* 1. Thông tin người đăng */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">1. Thông tin người đăng *</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="submitter.submitterType" className="block text-sm font-medium text-gray-700 mb-1">
                    Loại người đăng
                  </label>
                  <select
                    id="submitter.submitterType"
                    name="submitter.submitterType"
                    value={formData.submitter.submitterType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="INDIVIDUAL">Cá nhân</option>
                    <option value="COMPANY">Doanh nghiệp</option>
                    <option value="RESEARCH_INSTITUTION">Viện/Trường</option>
                  </select>
                </div>
                
                {/* Các trường chung */}
                <div>
                  <label htmlFor="submitter.email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="submitter.email"
                    name="submitter.email"
                    required
                    value={formData.submitter.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <label htmlFor="submitter.phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="submitter.phone"
                    name="submitter.phone"
                    value={formData.submitter.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {/* Trường dành cho Cá nhân */}
                {formData.submitter.submitterType === 'INDIVIDUAL' && (
                  <>
                    <div>
                      <label htmlFor="submitter.fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Họ tên *
                      </label>
                      <input
                        type="text"
                        id="submitter.fullName"
                        name="submitter.fullName"
                        required
                        value={formData.submitter.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập họ tên"
                      />
                    </div>
                    <div>
                      <label htmlFor="submitter.position" className="block text-sm font-medium text-gray-700 mb-1">
                        Nghề nghiệp / Chức danh
                      </label>
                      <input
                        type="text"
                        id="submitter.position"
                        name="submitter.position"
                        value={formData.submitter.position}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhà nghiên cứu / Founder"
                      />
                    </div>
                    <div>
                      <label htmlFor="submitter.organization" className="block text-sm font-medium text-gray-700 mb-1">
                        Tổ chức / Công ty
                      </label>
                      <input
                        type="text"
                        id="submitter.organization"
                        name="submitter.organization"
                        value={formData.submitter.organization}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nhập tên tổ chức"
                      />
                    </div>
                  </>
                )}

                {/* Trường dành cho Doanh nghiệp */}
                {formData.submitter.submitterType === 'COMPANY' && (
                  <>
                    <div>
                      <label htmlFor="submitter.fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên doanh nghiệp *
                      </label>
                      <input
                        type="text"
                        id="submitter.fullName"
                        name="submitter.fullName"
                        required
                        value={formData.submitter.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Công ty ABC"
                      />
                    </div>
                    <div>
                      <label htmlFor="submitter.taxCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Mã số thuế
                      </label>
                      <input
                        type="text"
                        id="submitter.taxCode"
                        name="submitter.taxCode"
                        value={formData.submitter.taxCode || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="010xxxxxxx"
                      />
                    </div>
                    <div>
                      <label htmlFor="submitter.businessLicense" className="block text-sm font-medium text-gray-700 mb-1">
                        Giấy ĐKKD
                      </label>
                      <input
                        type="text"
                        id="submitter.businessLicense"
                        name="submitter.businessLicense"
                        value={formData.submitter.businessLicense || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Số/Ngày cấp"
                      />
                    </div>
                    <div>
                      <label htmlFor="submitter.legalRepresentative" className="block text-sm font-medium text-gray-700 mb-1">
                        Người đại diện pháp luật
                      </label>
                      <input
                        type="text"
                        id="submitter.legalRepresentative"
                        name="submitter.legalRepresentative"
                        value={formData.submitter.legalRepresentative || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nguyễn Văn B"
                      />
                    </div>
                  </>
                )}

                {/* Trường dành cho Viện/Trường */}
                {formData.submitter.submitterType === 'RESEARCH_INSTITUTION' && (
                  <>
                    <div>
                      <label htmlFor="submitter.fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên viện/trường *
                      </label>
                      <input
                        type="text"
                        id="submitter.fullName"
                        name="submitter.fullName"
                        required
                        value={formData.submitter.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Trường/Viện XYZ"
                      />
                    </div>
                    <div>
                      <label htmlFor="submitter.unitCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Mã số đơn vị
                      </label>
                      <input
                        type="text"
                        id="submitter.unitCode"
                        name="submitter.unitCode"
                        value={formData.submitter.unitCode || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="..."
                      />
                    </div>
                    <div>
                      <label htmlFor="submitter.managingAgency" className="block text-sm font-medium text-gray-700 mb-1">
                        Cơ quan chủ quản
                      </label>
                      <input
                        type="text"
                        id="submitter.managingAgency"
                        name="submitter.managingAgency"
                        value={formData.submitter.managingAgency || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Bộ/UBND ..."
                      />
                    </div>
                    <div>
                      <label htmlFor="submitter.researchTaskCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Mã số nhiệm vụ KH&CN
                      </label>
                      <input
                        type="text"
                        id="submitter.researchTaskCode"
                        name="submitter.researchTaskCode"
                        value={formData.submitter.researchTaskCode || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="VD: KC.01.xx.yyyy"
                      />
                    </div>
                    <div>
                      <label htmlFor="submitter.researchTeam" className="block text-sm font-medium text-gray-700 mb-1">
                        Nhóm nghiên cứu/Chủ nhiệm
                      </label>
                      <input
                        type="text"
                        id="submitter.researchTeam"
                        name="submitter.researchTeam"
                        value={formData.submitter.researchTeam || ''}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="TS. ..."
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* 2. Thông tin cơ bản */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">2. Thông tin cơ bản *</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm Khoa học/ Công nghệ *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên sản phẩm khoa học/công nghệ"
                />
              </div>


              {/* Upload tài liệu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tài liệu minh chứng (PDF, Ảnh, Video)
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Kéo thả tài liệu vào đây hoặc <span className="text-blue-600">click để chọn file</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Hỗ trợ: PDF, JPG, PNG, MP4 (Tối đa 10MB mỗi file)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.mp4"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                {/* OCR Loading State */}
                {ocrLoading && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Đang xử lý OCR...</p>
                        <p className="text-xs text-blue-600">Vui lòng chờ trong giây lát</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* OCR Result */}
                {ocrResult && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium text-green-800">OCR xử lý thành công!</h4>
                        <div className="mt-2 text-sm text-green-700">
                          <p><strong>File:</strong> {ocrResult.fileInfo?.name}</p>
                          <p><strong>Thời gian xử lý:</strong> {ocrResult.processingTime}</p>
                          {ocrResult.extractedData && (
                            <div className="mt-2">
                              <p><strong>Thông tin đã trích xuất:</strong></p>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {ocrResult.extractedData.title && (
                                  <li>Tên: {ocrResult.extractedData.title}</li>
                                )}
                                {ocrResult.extractedData.field && (
                                  <li>Lĩnh vực: {ocrResult.extractedData.field}</li>
                                )}
                                {ocrResult.extractedData.industry && (
                                  <li>Ngành: {ocrResult.extractedData.industry}</li>
                                )}
                                {ocrResult.extractedData.specialty && (
                                  <li>Chuyên ngành: {ocrResult.extractedData.specialty}</li>
                                )}
                                {ocrResult.extractedData.trlSuggestion && (
                                  <li>TRL gợi ý: {ocrResult.extractedData.trlSuggestion}</li>
                                )}
                                {ocrResult.extractedData.confidence && (
                                  <li>Độ tin cậy: {Math.round(ocrResult.extractedData.confidence * 100)}%</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {formData.documents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-700">{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Thông tin phân loại */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="classification.field" className="block text-sm font-medium text-gray-700 mb-1">
                    Lĩnh vực *
                  </label>
                  <select
                    id="classification.field"
                    name="classification.field"
                    required
                    value={formData.classification.field}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={masterDataLoading}
                  >
                    <option value="">Chọn lĩnh vực</option>
                    {masterData?.fields.map((field) => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="classification.industry" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngành *
                  </label>
                  <select
                    id="classification.industry"
                    name="classification.industry"
                    required
                    value={formData.classification.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={masterDataLoading}
                  >
                    <option value="">Chọn ngành</option>
                    {masterData?.industries.map((industry) => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="classification.specialty" className="block text-sm font-medium text-gray-700 mb-1">
                    Chuyên ngành *
                  </label>
                  <select
                    id="classification.specialty"
                    name="classification.specialty"
                    required
                    value={formData.classification.specialty}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={masterDataLoading}
                  >
                    <option value="">Chọn chuyên ngành</option>
                    {masterData?.specialties.map((specialty) => (
                      <option key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="trlLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Mức độ phát triển (TRL) *
                  </label>
                  <select
                    id="trlLevel"
                    name="trlLevel"
                    required
                    value={formData.trlLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={masterDataLoading}
                  >
                    <option value="">Chọn mức độ TRL</option>
                    {masterData?.trlLevels.map((trl) => (
                      <option key={trl.value} value={trl.value}>
                        {trl.label}
                      </option>
                    ))}
                  </select>
                  
                  {/* Gợi ý TRL */}
                  {formData.trlLevel && getTRLSuggestions(formData.trlLevel) && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Gợi ý:</strong> {getTRLSuggestions(formData.trlLevel)?.fields.join(', ')}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục * <span className="text-xs text-gray-500">(Phân loại chính thức theo hệ thống HANOTEX)</span>
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={masterDataLoading}
                  >
                    <option value="">Chọn danh mục</option>
                    {masterData?.categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Danh mục giúp phân loại và tìm kiếm công nghệ dễ dàng hơn trên sàn giao dịch
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="publicSummary" className="block text-sm font-medium text-gray-700 mb-1">
                  Tóm tắt công khai *
                </label>
                <textarea
                  id="publicSummary"
                  name="publicSummary"
                  required
                  rows={4}
                  value={formData.publicSummary}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả ngắn gọn về công nghệ (sẽ hiển thị công khai)"
                />
              </div>

              <div>
                <label htmlFor="confidentialDetail" className="block text-sm font-medium text-gray-700 mb-1">
                  Chi tiết bảo mật
                </label>
                <textarea
                  id="confidentialDetail"
                  name="confidentialDetail"
                  rows={6}
                  value={formData.confidentialDetail}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết về công nghệ (chỉ hiển thị cho người có quyền truy cập)"
                />
              </div>

              <div>
                <label htmlFor="visibilityMode" className="block text-sm font-medium text-gray-700 mb-1">
                  Chế độ hiển thị
                </label>
                <select
                  id="visibilityMode"
                  name="visibilityMode"
                  value={formData.visibilityMode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PUBLIC_SUMMARY">Chỉ hiển thị tóm tắt</option>
                  <option value="PUBLIC_FULL">Hiển thị đầy đủ</option>
                  <option value="PRIVATE">Riêng tư</option>
                </select>
              </div>

              {/* Thông tin bổ sung (Optional) - Nested trong Basic Info */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-900">Thông tin bổ sung</h3>
                  <button
                    type="button"
                    onClick={() => setShowOptionalFields(!showOptionalFields)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showOptionalFields ? 'Ẩn thông tin bổ sung' : 'Hiển thị thông tin bổ sung'}
                  </button>
                </div>
                {showOptionalFields && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="optionalInfo.team" className="block text-sm font-medium text-gray-700 mb-1">
                        Đội ngũ / Nhân lực/ Cơ sở hạ tầng
                      </label>
                      <textarea
                        id="optionalInfo.team"
                        name="optionalInfo.team"
                        value={formData.optionalInfo.team}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mô tả về đội ngũ phát triển, nhân lực chuyên môn..."
                      />
                    </div>
                    <div>
                      <label htmlFor="optionalInfo.testResults" className="block text-sm font-medium text-gray-700 mb-1">
                        Kết quả thử nghiệm / Triển khai
                      </label>
                      <textarea
                        id="optionalInfo.testResults"
                        name="optionalInfo.testResults"
                        value={formData.optionalInfo.testResults}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mô tả kết quả thử nghiệm, triển khai thực tế..."
                      />
                    </div>
                    <div>
                      <label htmlFor="optionalInfo.economicSocialImpact" className="block text-sm font-medium text-gray-700 mb-1">
                        Hiệu quả kinh tế - xã hội
                      </label>
                      <textarea
                        id="optionalInfo.economicSocialImpact"
                        name="optionalInfo.economicSocialImpact"
                        value={formData.optionalInfo.economicSocialImpact}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Mô tả tác động kinh tế, xã hội, môi trường..."
                      />
                    </div>
                    <div>
                      <label htmlFor="optionalInfo.financialSupport" className="block text-sm font-medium text-gray-700 mb-1">
                        Thông tin quỹ tài chính hỗ trợ
                      </label>
                      <textarea
                        id="optionalInfo.financialSupport"
                        name="optionalInfo.financialSupport"
                        value={formData.optionalInfo.financialSupport}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Thông tin về quỹ hỗ trợ, tài trợ, chương trình khuyến khích..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Technology Owners */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">3. Chủ sở hữu công nghệ *</h2>
                <button
                  type="button"
                  onClick={addOwner}
                  className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm chủ sở hữu
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {formData.owners.map((owner, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Loại chủ sở hữu
                    </label>
                    <select
                      value={owner.ownerType}
                      onChange={(e) => updateOwner(index, 'ownerType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="INDIVIDUAL">Cá nhân</option>
                      <option value="COMPANY">Doanh nghiệp</option>
                      <option value="RESEARCH_INSTITUTION">Viện/Trường</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên chủ sở hữu
                    </label>
                    <input
                      type="text"
                      value={owner.ownerName}
                      onChange={(e) => updateOwner(index, 'ownerName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tên chủ sở hữu"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tỷ lệ sở hữu (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={owner.ownershipPercentage}
                      onChange={(e) => updateOwner(index, 'ownershipPercentage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeOwner(index)}
                      className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Intellectual Property (IP) */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">4. Sở hữu trí tuệ (IP) *</h2>
                <button
                  type="button"
                  onClick={addIPDetail}
                  className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm IP
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {formData.ipDetails.map((ip, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại hình IP
                      </label>
                      <select
                        value={ip.ipType}
                        onChange={(e) => {
                          updateIPDetail(index, 'ipType', e.target.value);
                          setSelectedIPType(e.target.value);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={masterDataLoading}
                      >
                        <option value="">Chọn loại hình IP</option>
                        {masterData?.ipTypes.map((ipType) => (
                          <option key={ipType.value} value={ipType.value}>
                            {ipType.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số đơn/Số bằng
                    </label>
                    <input
                      type="text"
                      value={ip.ipNumber}
                      onChange={(e) => updateIPDetail(index, 'ipNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="VD: VN1-001234"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tình trạng
                    </label>
                    <select
                      value={ip.status}
                      onChange={(e) => updateIPDetail(index, 'status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={masterDataLoading}
                    >
                      <option value="">Chọn tình trạng</option>
                      {masterData?.ipStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeIPDetail(index)}
                        className="flex items-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Xóa
                      </button>
                    </div>
                  </div>
                  
                  {/* Mô tả IP - nằm dưới grid */}
                  {ip.ipType && (
                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                      <strong>💡</strong> {getIPTypeDescription(ip.ipType)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5. Pháp lý & Lãnh thổ */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">5. Pháp lý & Lãnh thổ *</h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Phạm vi bảo hộ/chứng nhận */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phạm vi bảo hộ/chứng nhận (chọn nhiều)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {masterData?.protectionTerritories.map((territory) => (
                      <label key={territory.value} className="flex items-center group">
                        <input
                          type="checkbox"
                          checked={formData.legalTerritory.protectionTerritories.includes(territory.value)}
                          onChange={(e) => handleTerritoryChange(territory.value, e.target.checked)}
                          className="mr-2"
                        />
                        <span 
                          className="text-sm text-gray-700 cursor-help"
                          title={territory.tooltip}
                        >
                          {territory.value}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    *PCT là đơn quốc tế (chưa là bằng); EPO/USPTO/JPO là cơ quan cấp bằng/đơn tương ứng.
                  </p>
                </div>

                {/* Chứng nhận tiêu chuẩn/quy chuẩn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chứng nhận tiêu chuẩn/quy chuẩn (chọn nhiều)
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {masterData?.certifications.map((certification) => (
                      <label key={certification.value} className="flex items-center group">
                        <input
                          type="checkbox"
                          checked={formData.legalTerritory.certifications.includes(certification.value)}
                          onChange={(e) => handleCertificationChange(certification.value, e.target.checked)}
                          className="mr-2"
                        />
                        <span 
                          className="text-sm text-gray-700 cursor-help"
                          title={certification.tooltip}
                        >
                          {certification.value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Upload chứng nhận tiêu chuẩn địa phương */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload chứng nhận tiêu chuẩn địa phương (optional)
                  </label>
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('local-cert-upload')?.click()}
                  >
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-1">
                      Click để upload PDF/Ảnh
                    </p>
                    <p className="text-xs text-gray-500">
                      Tối đa 10MB mỗi file
                    </p>
                    <input
                      id="local-cert-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      onChange={handleLocalCertificationUpload}
                    />
                  </div>
                  
                  {/* Hiển thị danh sách file đã upload */}
                  {formData.legalTerritory.localCertificationFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.legalTerritory.localCertificationFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLocalCertificationFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Hướng dẫn và gợi ý */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-3">
                  <strong>💡 Hướng dẫn chọn lựa:</strong>
                </h4>
                <div className="space-y-2 text-xs text-blue-800">
                  <div>
                    <strong>Phạm vi bảo hộ:</strong> VN (trong nước), PCT (quốc tế), EP/US/CN/JP (từng khu vực)
                  </div>
                  <div>
                    <strong>Chứng nhận tiêu chuẩn:</strong> CE (Châu Âu), FDA (Mỹ), ISO (quốc tế), IEC (điện tử)
                  </div>
                  <div className="text-blue-700 italic">
                    💡 Tip: Hover vào các tùy chọn để xem mô tả chi tiết
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Mong muốn đầu tư & Hình thức chuyển giao */}
          <div className="bg-white shadow rounded-lg">
            <div 
              className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('investmentTransfer')}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">6. Mong muốn đầu tư & Hình thức chuyển giao <span className="text-sm font-normal text-gray-500">(Tùy chọn)</span></h2>
                <div className="flex items-center">
                  {!expandedSections.investmentTransfer && (
                    <span className="text-sm text-gray-500 mr-2">Click để mở rộng</span>
                  )}
                  <div className={`transform transition-transform ${expandedSections.investmentTransfer ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {expandedSections.investmentTransfer && (
              <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="investmentTransfer.investmentStage" className="block text-sm font-medium text-gray-700 mb-1">
                    Giai đoạn đầu tư mong muốn
                  </label>
                  <select
                    id="investmentTransfer.investmentStage"
                    name="investmentTransfer.investmentStage"
                    value={formData.investmentTransfer.investmentStage}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn giai đoạn đầu tư</option>
                    <option value="SEED">Seed (TRL 1-3)</option>
                    <option value="SERIES_A">Series A (TRL 4-6)</option>
                    <option value="SERIES_B">Series B (TRL 7-9)</option>
                    <option value="GROWTH">Growth/Strategic</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="investmentTransfer.territoryScope" className="block text-sm font-medium text-gray-700 mb-1">
                    Phạm vi lãnh thổ
                  </label>
                  <select
                    id="investmentTransfer.territoryScope"
                    name="investmentTransfer.territoryScope"
                    value={formData.investmentTransfer.territoryScope}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn phạm vi</option>
                    <option value="VIETNAM">Trong nước (VN)</option>
                    <option value="ASEAN">Khu vực (ASEAN)</option>
                    <option value="ASIA">Châu Á</option>
                    <option value="GLOBAL">Toàn cầu</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương án thương mại hóa (chọn nhiều)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {masterData?.commercializationMethods.map((method) => (
                    <label key={method.value} className="flex items-center group">
                      <input
                        type="checkbox"
                        checked={formData.investmentTransfer.commercializationMethods.includes(method.value)}
                        onChange={(e) => {
                          const methods = formData.investmentTransfer.commercializationMethods;
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              investmentTransfer: {
                                ...prev.investmentTransfer,
                                commercializationMethods: [...methods, method.value]
                              }
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              investmentTransfer: {
                                ...prev.investmentTransfer,
                                commercializationMethods: methods.filter(m => m !== method.value)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span 
                        className="text-sm text-gray-700 cursor-help"
                        title={method.tooltip}
                      >
                        {method.value}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình thức chuyển quyền (chọn nhiều)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {masterData?.transferMethods.map((method) => (
                    <label key={method.value} className="flex items-center group">
                      <input
                        type="checkbox"
                        checked={formData.investmentTransfer.transferMethods.includes(method.value)}
                        onChange={(e) => {
                          const methods = formData.investmentTransfer.transferMethods;
                          if (e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              investmentTransfer: {
                                ...prev.investmentTransfer,
                                transferMethods: [...methods, method.value]
                              }
                            }));
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              investmentTransfer: {
                                ...prev.investmentTransfer,
                                transferMethods: methods.filter(m => m !== method.value)
                              }
                            }));
                          }
                        }}
                        className="mr-2"
                      />
                      <span 
                        className="text-sm text-gray-700 cursor-help"
                        title={method.tooltip}
                      >
                        {method.value}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="investmentTransfer.currentPartners" className="block text-sm font-medium text-gray-700 mb-1">
                    Đối tác đã/đang hợp tác
                  </label>
                  <textarea
                    id="investmentTransfer.currentPartners"
                    name="investmentTransfer.currentPartners"
                    value={formData.investmentTransfer.currentPartners}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tên đối tác, phạm vi hợp tác, trạng thái..."
                  />
                </div>
                <div>
                  <label htmlFor="investmentTransfer.potentialPartners" className="block text-sm font-medium text-gray-700 mb-1">
                    Đối tác tiềm năng
                  </label>
                  <textarea
                    id="investmentTransfer.potentialPartners"
                    name="investmentTransfer.potentialPartners"
                    value={formData.investmentTransfer.potentialPartners}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Danh sách mục tiêu, kênh tiếp cận..."
                  />
                </div>
              </div>
              </div>
            )}
          </div>

          {/* 7. Định giá & Giá mong muốn */}
          <div className="bg-white shadow rounded-lg">
            <div 
              className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('pricing')}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">7. Định giá & Giá mong muốn <span className="text-sm font-normal text-gray-500">(Tùy chọn)</span></h2>
                <div className="flex items-center">
                  {!expandedSections.pricing && (
                    <span className="text-sm text-gray-500 mr-2">Click để mở rộng</span>
                  )}
                  <div className={`transform transition-transform ${expandedSections.pricing ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {expandedSections.pricing && (
              <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn hình thức
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'APPRAISAL', label: 'Yêu cầu THẨM ĐỊNH' },
                    { value: 'ASK', label: 'Đặt GIÁ MONG MUỐN' },
                    { value: 'AUCTION', label: 'MỞ ĐẤU GIÁ' },
                    { value: 'OFFER', label: 'CHÀO GIÁ (Open to offers)' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        pricing: { ...prev.pricing, pricingType: option.value }
                      }))}
                      className={`px-4 py-3 text-sm font-medium rounded-lg border transition-colors ${
                        formData.pricing.pricingType === option.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                {formData.pricing.pricingType === 'APPRAISAL' && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Thông tin thẩm định</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="pricing.appraisalPurpose" className="block text-sm font-medium text-gray-700 mb-1">
                          Mục đích thẩm định
                        </label>
                        <select
                          id="pricing.appraisalPurpose"
                          name="pricing.appraisalPurpose"
                          value={formData.pricing.appraisalPurpose}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn mục đích</option>
                          <option value="NEGOTIATION">Tham chiếu đàm phán</option>
                          <option value="AUCTION">Phục vụ đấu giá</option>
                          <option value="INVESTOR">Báo cáo cho nhà đầu tư</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="pricing.appraisalDeadline" className="block text-sm font-medium text-gray-700 mb-1">
                          Thời hạn mong muốn
                        </label>
                        <input
                          type="date"
                          id="pricing.appraisalDeadline"
                          name="pricing.appraisalDeadline"
                          value={formData.pricing.appraisalDeadline}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="pricing.appraisalScope" className="block text-sm font-medium text-gray-700 mb-1">
                          Phạm vi thẩm định
                        </label>
                        <select
                          id="pricing.appraisalScope"
                          name="pricing.appraisalScope"
                          value={formData.pricing.appraisalScope}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn phạm vi</option>
                          <option value="IP_ONLY">Chỉ IP</option>
                          <option value="IP_TECHNOLOGY">IP + công nghệ + tài sản kèm</option>
                          <option value="FULL_PROJECT">Toàn bộ dự án</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          Hệ thống sẽ tạo <strong>valuation_request</strong> tới bên thẩm định được phê duyệt.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {formData.pricing.pricingType === 'ASK' && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Thông tin giá mong muốn</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="pricing.askingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                          Giá mong muốn
                        </label>
                        <input
                          type="number"
                          id="pricing.askingPrice"
                          name="pricing.askingPrice"
                          value={formData.pricing.askingPrice}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập số tiền"
                        />
                      </div>
                      <div>
                        <label htmlFor="pricing.currency" className="block text-sm font-medium text-gray-700 mb-1">
                          Tiền tệ
                        </label>
                        <select
                          id="pricing.currency"
                          name="pricing.currency"
                          value={formData.pricing.currency}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="VND">VND</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="pricing.priceType" className="block text-sm font-medium text-gray-700 mb-1">
                          Loại giá
                        </label>
                        <select
                          id="pricing.priceType"
                          name="pricing.priceType"
                          value={formData.pricing.priceType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="INDICATIVE">Indicative (không ràng buộc)</option>
                          <option value="FLOOR">Floor (giá sàn)</option>
                          <option value="FIRM">Firm (cam kết)</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Khuyến nghị kèm thẩm định để tăng độ tin cậy.
                    </p>
                  </div>
                )}

                {formData.pricing.pricingType === 'AUCTION' && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Thông tin đấu giá</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="pricing.auctionType" className="block text-sm font-medium text-gray-700 mb-1">
                          Loại đấu giá
                        </label>
                        <select
                          id="pricing.auctionType"
                          name="pricing.auctionType"
                          value={formData.pricing.auctionType || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn loại đấu giá</option>
                          <option value="ENGLISH">English (tăng dần)</option>
                          <option value="DUTCH">Dutch (giảm dần)</option>
                          <option value="SEALED">Sealed bid</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="pricing.reservePrice" className="block text-sm font-medium text-gray-700 mb-1">
                          Giá khởi điểm / Reserve
                        </label>
                        <input
                          type="number"
                          id="pricing.reservePrice"
                          name="pricing.reservePrice"
                          value={formData.pricing.reservePrice || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0 nếu không có"
                        />
                      </div>
                      <div>
                        <label htmlFor="pricing.auctionStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                          Thời gian bắt đầu
                        </label>
                        <input
                          type="date"
                          id="pricing.auctionStartDate"
                          name="pricing.auctionStartDate"
                          value={formData.pricing.auctionStartDate || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {formData.pricing.pricingType === 'OFFER' && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">Chào giá mở</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-800">
                        Bạn không đặt giá – người mua sẽ gửi đề nghị. Có thể bật "gợi ý khoảng giá" dựa trên dữ liệu thị trường.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              </div>
            )}
          </div>

          {/* 8. Chính sách hiển thị & NDA */}
          <div className="bg-white shadow rounded-lg">
            <div 
              className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('visibilityNDA')}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">8. Chính sách hiển thị & NDA <span className="text-sm font-normal text-gray-500">(Tùy chọn)</span></h2>
                <div className="flex items-center">
                  {!expandedSections.visibilityNDA && (
                    <span className="text-sm text-gray-500 mr-2">Click để mở rộng</span>
                  )}
                  <div className={`transform transition-transform ${expandedSections.visibilityNDA ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {expandedSections.visibilityNDA && (
              <div className="p-6 space-y-4">
              <div>
                <label htmlFor="visibilityMode" className="block text-sm font-medium text-gray-700 mb-1">
                  Chế độ hiển thị
                </label>
                <select
                  id="visibilityMode"
                  name="visibilityMode"
                  value={formData.visibilityMode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="PUBLIC_SUMMARY">Tóm tắt công khai + Chi tiết sau NDA</option>
                  <option value="PUBLIC_FULL">Hoàn toàn công khai</option>
                  <option value="PRIVATE">Riêng tư (chỉ theo lời mời)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Trường công khai</h4>
                  <div className="space-y-2">
                    {[
                      { field: 'title', label: 'Tên công nghệ/sản phẩm' },
                      { field: 'publicSummary', label: 'Mô tả ngắn (2-3 câu)' },
                      { field: 'classification', label: 'Lĩnh vực/Ngành/Chuyên ngành' },
                      { field: 'trlLevel', label: 'TRL' },
                      { field: 'owners', label: 'Chủ sở hữu' },
                      { field: 'ipDetails', label: 'Loại chứng nhận (không hiển thị số)' }
                    ].map((item) => (
                      <label key={item.field} className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Không công khai: số bằng, tài liệu chi tiết, dữ liệu tài chính.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Trường ẩn sau NDA</h4>
                  <div className="space-y-2">
                    {[
                      { field: 'confidentialDetail', label: 'Mô tả chi tiết kỹ thuật' },
                      { field: 'documents', label: 'Tài liệu minh chứng (PDF/Ảnh/Video)' },
                      { field: 'ipNumbers', label: 'Số đơn/Số bằng' },
                      { field: 'financials', label: 'Dữ liệu tài chính/kiểm thử chi tiết' },
                      { field: 'contacts', label: 'Liên hệ trực tiếp nhóm R&D' }
                    ].map((item) => (
                      <label key={item.field} className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Watermark tài liệu</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">🔍 Xem trước phần CÔNG KHAI:</h4>
                <div className="text-sm text-blue-700">
                  Tên, mô tả ngắn, taxonomy, TRL, ứng dụng (theo lựa chọn trường công khai).
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Đăng ký công nghệ
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
