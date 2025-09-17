'use client';

import { useState } from 'react';
import { Download, Copy, FileText, Eye, CheckCircle } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  content: string;
  fields: TemplateField[];
}

interface TemplateField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'date';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface TemplateGeneratorProps {
  templates: Template[];
  onGenerate?: (template: Template, data: Record<string, any>) => void;
  onDownload?: (template: Template, data: Record<string, any>) => void;
}

export default function TemplateGenerator({ templates, onGenerate, onDownload }: TemplateGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({});
    setGeneratedContent('');
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const generateContent = () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    
    // Simulate content generation
    setTimeout(() => {
      let content = selectedTemplate.content;
      
      // Replace placeholders with form data
      selectedTemplate.fields.forEach(field => {
        const placeholder = `{{${field.name}}}`;
        const value = formData[field.name] || '';
        content = content.replace(new RegExp(placeholder, 'g'), value);
      });
      
      setGeneratedContent(content);
      setIsGenerating(false);
      onGenerate?.(selectedTemplate, formData);
    }, 1000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      // You could show a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadTemplate = () => {
    if (!selectedTemplate) return;

    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onDownload?.(selectedTemplate, formData);
  };

  const renderField = (field: TemplateField) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn {field.label.toLowerCase()}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'file':
        return (
          <input
            type="file"
            onChange={(e) => handleFieldChange(field.name, e.target.files?.[0])}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tạo mẫu biểu mẫu</h3>
      
      {!selectedTemplate ? (
        <div className="space-y-3">
          <p className="text-gray-600 mb-4">Chọn mẫu biểu mẫu phù hợp:</p>
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{template.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Template Info */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{selectedTemplate.title}</h4>
              <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
            </div>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Chọn mẫu khác
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {selectedTemplate.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Generate Button */}
          <button
            onClick={generateContent}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Tạo mẫu biểu mẫu
              </>
            )}
          </button>

          {/* Generated Content */}
          {generatedContent && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-medium text-gray-900">Nội dung đã tạo:</h5>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Sao chép
                  </button>
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Tải xuống
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">{generatedContent}</pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
