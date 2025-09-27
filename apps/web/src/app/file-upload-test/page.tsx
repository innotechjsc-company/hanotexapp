"use client";

import React, { useState } from "react";
import { Card, Typography, Space, Divider, Row, Col, Button, message, Tag } from "antd";
import { FileUpload, type FileUploadItem } from "@/components/input";

const { Title, Text, Paragraph } = Typography;

export default function FileUploadTestPage() {
  const [singleFile, setSingleFile] = useState<FileUploadItem[]>([]);
  const [multipleFiles, setMultipleFiles] = useState<FileUploadItem[]>([]);
  const [imageFiles, setImageFiles] = useState<FileUploadItem[]>([]);
  const [documentFiles, setDocumentFiles] = useState<FileUploadItem[]>([]);
  const [customFiles, setCustomFiles] = useState<FileUploadItem[]>([]);

  const handleCustomValidation = (file: File): boolean => {
    if (file.name.includes('test')) {
      message.warning('File có chứa từ "test" sẽ bị từ chối');
      return false;
    }
    return true;
  };

  const handleUploadSuccess = (file: File, media: any) => {
    message.success(`Upload thành công: ${file.name}`);
    console.log('Upload success:', { file, media });
  };

  const handleUploadError = (file: File, error: string) => {
    message.error(`Upload thất bại: ${file.name} - ${error}`);
    console.log('Upload error:', { file, error });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <Title level={1}>FileUpload Component Test</Title>
        <Paragraph>
          Trang test toàn diện cho component FileUpload với các tính năng và cấu hình khác nhau.
        </Paragraph>
      </div>

      <Space direction="vertical" size="large" className="w-full">
        {/* Single File Upload */}
        <Card title="1. Upload File Đơn" size="small">
          <Space direction="vertical" className="w-full">
            <Text type="secondary">
              Upload một file duy nhất với variant dragger mặc định
            </Text>
            <FileUpload
              value={singleFile}
              onChange={setSingleFile}
              multiple={false}
              maxSize={5 * 1024 * 1024} // 5MB
              title="Chọn một file"
              description="Kéo thả hoặc click để chọn file (tối đa 5MB)"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
            <Text type="secondary">
              Files đã chọn: {singleFile.length}
            </Text>
          </Space>
        </Card>

        {/* Multiple Files Upload */}
        <Card title="2. Upload Nhiều File" size="small">
          <Space direction="vertical" className="w-full">
            <Text type="secondary">
              Upload nhiều file cùng lúc với giới hạn 5 file
            </Text>
            <FileUpload
              value={multipleFiles}
              onChange={setMultipleFiles}
              multiple={true}
              maxCount={5}
              maxSize={10 * 1024 * 1024} // 10MB
              title="Chọn nhiều file"
              description="Kéo thả hoặc click để chọn tối đa 5 file (mỗi file tối đa 10MB)"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
            <Text type="secondary">
              Files đã chọn: {multipleFiles.length}/5
            </Text>
          </Space>
        </Card>

        {/* Image Only Upload */}
        <Card title="3. Upload Chỉ Hình Ảnh" size="small">
          <Space direction="vertical" className="w-full">
            <Text type="secondary">
              Chỉ chấp nhận file hình ảnh với variant button
            </Text>
            <FileUpload
              value={imageFiles}
              onChange={setImageFiles}
              multiple={true}
              maxCount={3}
              allowedTypes={['image']}
              variant="button"
              buttonText="Chọn hình ảnh"
              maxSize={5 * 1024 * 1024} // 5MB
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {imageFiles.map((file, index) => (
                <Tag key={index} color="blue">
                  {file.filename}
                </Tag>
              ))}
            </div>
          </Space>
        </Card>

        {/* Document Only Upload */}
        <Card title="4. Upload Chỉ Tài Liệu" size="small">
          <Space direction="vertical" className="w-full">
            <Text type="secondary">
              Chỉ chấp nhận file tài liệu (PDF, Word, Excel, PowerPoint)
            </Text>
            <FileUpload
              value={documentFiles}
              onChange={setDocumentFiles}
              multiple={true}
              maxCount={10}
              allowedTypes={['document']}
              maxSize={50 * 1024 * 1024} // 50MB
              title="Chọn tài liệu"
              description="Chỉ chấp nhận PDF, Word, Excel, PowerPoint (tối đa 50MB mỗi file)"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
            <Text type="secondary">
              Tài liệu đã chọn: {documentFiles.length}/10
            </Text>
          </Space>
        </Card>

        {/* Custom Validation Upload */}
        <Card title="5. Upload với Validation Tùy Chỉnh" size="small">
          <Space direction="vertical" className="w-full">
            <Text type="secondary">
              Upload với validation tùy chỉnh (từ chối file có tên chứa "test")
            </Text>
            <FileUpload
              value={customFiles}
              onChange={setCustomFiles}
              multiple={true}
              maxCount={3}
              beforeUpload={handleCustomValidation}
              title="Upload với validation"
              description="File có tên chứa 'test' sẽ bị từ chối"
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
            <Text type="secondary">
              Files hợp lệ: {customFiles.length}/3
            </Text>
          </Space>
        </Card>

        {/* Different Variants */}
        <Card title="6. Các Variant Khác Nhau" size="small">
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Space direction="vertical" className="w-full">
                <Text strong>Dragger Variant</Text>
                <FileUpload
                  variant="dragger"
                  multiple={false}
                  title="Dragger"
                  description="Kéo thả file vào đây"
                />
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" className="w-full">
                <Text strong>Button Variant</Text>
                <FileUpload
                  variant="button"
                  multiple={false}
                  buttonText="Chọn File"
                />
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" className="w-full">
                <Text strong>Picture Variant</Text>
                <FileUpload
                  variant="picture"
                  multiple={false}
                  allowedTypes={['image']}
                />
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Configuration Summary */}
        <Card title="7. Tóm Tắt Cấu Hình" size="small">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Space direction="vertical">
                <Text strong>Tính năng chính:</Text>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Upload đơn và nhiều file</li>
                  <li>Validation kích thước và loại file</li>
                  <li>Progress tracking</li>
                  <li>Error handling</li>
                  <li>Preview và xóa file</li>
                  <li>Retry upload khi lỗi</li>
                </ul>
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical">
                <Text strong>Loại file hỗ trợ:</Text>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Hình ảnh: JPG, PNG, GIF, WebP, SVG</li>
                  <li>Video: MP4, WebM, OGG</li>
                  <li>Tài liệu: PDF, Word, Excel, PowerPoint</li>
                  <li>File nén: ZIP, RAR, 7Z</li>
                </ul>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Action Buttons */}
        <Card title="8. Thao Tác" size="small">
          <Space>
            <Button 
              onClick={() => {
                setSingleFile([]);
                setMultipleFiles([]);
                setImageFiles([]);
                setDocumentFiles([]);
                setCustomFiles([]);
                message.success('Đã xóa tất cả file');
              }}
            >
              Xóa Tất Cả File
            </Button>
            <Button 
              type="primary"
              onClick={() => {
                const totalFiles = singleFile.length + multipleFiles.length + 
                                 imageFiles.length + documentFiles.length + customFiles.length;
                message.info(`Tổng cộng ${totalFiles} file đã được chọn`);
              }}
            >
              Kiểm Tra Tổng File
            </Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
