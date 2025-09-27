"use client";

import { useState } from "react";
import { Card, Typography, Space, Input, Button, Divider, Row, Col, Alert } from "antd";
import downloadService from "@/services/downloadService";
import toastService from "@/services/toastService";
import type { Media } from "@/types/media1";

const { Title, Paragraph, Text } = Typography;

export default function DownloadTestPage() {
  const [url, setUrl] = useState<string>("");
  const [filename, setFilename] = useState<string>("");

  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaFilename, setMediaFilename] = useState<string>("");
  const [mediaMime, setMediaMime] = useState<string>("");

  const handleDownloadByUrl = async () => {
    if (!url) {
      toastService.warning("Thiếu URL", "Vui lòng nhập URL của file");
      return;
    }
    try {
      toastService.info("Đang tải...", "Bắt đầu tải file", 2);
      await downloadService.downloadByUrl(url, filename || undefined);
      toastService.success("Hoàn tất", "Đã gửi yêu cầu tải xuống");
    } catch (e: any) {
      toastService.error("Lỗi tải xuống", e?.message || "Không thể tải file");
    }
  };

  const handleDownloadByMedia = async () => {
    if (!mediaUrl) {
      toastService.warning("Thiếu Media URL", "Vui lòng nhập media.url");
      return;
    }
    const media: Media = {
      id: 0,
      alt: mediaFilename || "media",
      url: mediaUrl,
      filename: mediaFilename || null,
      mimeType: mediaMime || null,
      caption: null,
      type: null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      thumbnailURL: null,
      filesize: null,
      width: null,
      height: null,
      focalX: null,
      focalY: null,
    };

    try {
      toastService.info("Đang tải...", "Bắt đầu tải file (Media)", 2);
      await downloadService.downloadMedia(media);
      toastService.success("Hoàn tất", "Đã gửi yêu cầu tải xuống (Media)");
    } catch (e: any) {
      toastService.error("Lỗi tải xuống", e?.message || "Không thể tải file");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <Title level={2} className="text-center mb-2">
            Download Service Test Page
          </Title>
          <Paragraph className="text-center text-gray-600">
            Trang thử nghiệm cho dịch vụ tải xuống file từ Media của CMS.
            Bạn có thể nhập URL media (tương đối hoặc tuyệt đối) để thử tải.
          </Paragraph>
          <Alert
            className="mt-4"
            type="info"
            showIcon
            message="Gợi ý"
            description={
              <div>
                <div>URL có thể là đường dẫn tương đối trả về từ CMS, ví dụ: <code>/media/your-file.pdf</code></div>
                <div>Hoặc URL đầy đủ: <code>http://localhost:4000/media/your-file.pdf</code></div>
              </div>
            }
          />
        </Card>

        <Card title="Tải theo URL" bordered={false}>
          <Space direction="vertical" className="w-full" size="middle">
            <div>
              <Text strong>Media URL</Text>
              <Input
                placeholder="Nhập URL (vd: /media/file.pdf hoặc https://api.hanotex.vn/media/file.pdf)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <div>
              <Text strong>Tên file (tùy chọn)</Text>
              <Input
                placeholder="filename.ext (nếu để trống sẽ tự suy đoán)"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
              />
            </div>
            <Button type="primary" onClick={handleDownloadByUrl}>
              Download (URL)
            </Button>
          </Space>
        </Card>

        <Card title="Tải theo Media object" bordered={false}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Space direction="vertical" className="w-full" size="small">
                <Text strong>media.url</Text>
                <Input
                  placeholder="/media/file.pdf hoặc URL đầy đủ"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
                <Text strong>media.filename (tùy chọn)</Text>
                <Input
                  placeholder="filename.ext"
                  value={mediaFilename}
                  onChange={(e) => setMediaFilename(e.target.value)}
                />
                <Text strong>media.mimeType (tùy chọn)</Text>
                <Input
                  placeholder="vd: application/pdf, image/png"
                  value={mediaMime}
                  onChange={(e) => setMediaMime(e.target.value)}
                />
                <Button onClick={handleDownloadByMedia}>Download (Media)</Button>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <Alert
                type="success"
                showIcon
                message="Cách hoạt động"
                description={
                  <div className="text-sm text-gray-700 space-y-1">
                    <div>- Ưu tiên tải bằng Blob (CORS cho phép) để đặt tên file chuẩn.</div>
                    <div>- Nếu thất bại, sẽ fallback mở liên kết để trình duyệt tải.</div>
                    <div>- Chấp nhận cả URL tương đối từ CMS và URL đầy đủ.</div>
                  </div>
                }
              />
            </Col>
          </Row>
        </Card>

        <Divider />
        <div className="text-center text-gray-500 text-sm">
          Lưu ý: Với file riêng tư (private/restricted), cần cấu hình CORS/Authorization phù hợp phía CMS.
        </div>
      </div>
    </div>
  );
}

