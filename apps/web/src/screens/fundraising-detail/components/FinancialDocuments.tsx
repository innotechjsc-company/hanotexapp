import {
  Card,
  Col,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
  Button,
  message,
} from "antd";
import { DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import type { Project } from "@/types/project";
import downloadService from "@/services/downloadService";
import { getFileExtension, getFileIconColor } from "../utils";

const { Text } = Typography;

interface FinancialDocumentsProps {
  project: Project;
}

export function FinancialDocuments({ project }: FinancialDocumentsProps) {
  if (
    !Array.isArray(project?.documents_finance) ||
    project.documents_finance.length === 0
  ) {
    return null;
  }

  return (
    <Card
      title={
        <Space>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          <span>Tài liệu tài chính</span>
        </Space>
      }
      className="mb-6"
      bodyStyle={{ padding: 24 }}
    >
      <Row gutter={[16, 16]}>
        {project.documents_finance.map((doc: any, index: number) => {
          if (!doc?.url || !doc?.filename) return null;

          const handleDownload = async (e: React.MouseEvent) => {
            e.stopPropagation();
            try {
              if (doc.url) {
                message.loading({
                  content: "Đang tải xuống...",
                  key: `download-${index}`,
                });
                await downloadService.downloadByUrl(doc.url, doc.filename);
                message.success({
                  content: "Tải xuống thành công!",
                  key: `download-${index}`,
                  duration: 2,
                });
              }
            } catch (error) {
              message.error({
                content: "Tải xuống thất bại!",
                key: `download-${index}`,
                duration: 3,
              });
              console.error("Download error:", error);
            }
          };

          return (
            <Col xs={24} sm={12} md={8} key={`doc-${doc.id || index}`}>
              <Card
                size="small"
                className="hover:shadow-md transition-all"
                bodyStyle={{ padding: 20 }}
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: "100%" }}
                  align="center"
                >
                  {/* File Icon */}
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 12,
                      backgroundColor: getFileIconColor(doc.filename),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <FileTextOutlined
                      style={{ fontSize: 28, color: "white" }}
                    />
                  </div>

                  {/* File Info */}
                  <div
                    style={{
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    <Tooltip title={doc.filename} color="blue">
                      <Text
                        strong
                        style={{
                          display: "block",
                          marginBottom: 8,
                          fontSize: 14,
                        }}
                        ellipsis
                      >
                        {doc.filename || `Tài liệu ${index + 1}`}
                      </Text>
                    </Tooltip>
                    <Tag
                      color={getFileIconColor(doc.filename)}
                      style={{ margin: 0 }}
                    >
                      {getFileExtension(doc.filename).toUpperCase()}
                    </Tag>
                  </div>

                  {/* Download Button */}
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    size="middle"
                    block
                    onClick={handleDownload}
                    style={{
                      marginTop: 8,
                      fontWeight: 500,
                    }}
                  >
                    Tải xuống
                  </Button>
                </Space>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Card>
  );
}
