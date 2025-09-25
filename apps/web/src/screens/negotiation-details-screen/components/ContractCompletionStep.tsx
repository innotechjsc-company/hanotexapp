import React, { useMemo, useState } from "react";
import {
  Card,
  Typography,
  Steps,
  Upload,
  Button,
  Input,
  DatePicker,
  Space,
  message as antdMessage,
} from "antd";
import {
  UploadCloud,
  ClipboardList,
  CheckCircle,
  Paperclip,
} from "lucide-react";
import type { TechnologyPropose } from "@/types/technology-propose";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ContractCompletionStepProps {
  proposal: TechnologyPropose;
  onCompleteContract: (data: {
    contractFile?: File | null;
    attachments?: File[];
    notes?: string;
    startDate?: string | null;
  }) => Promise<void>;
}

export const ContractCompletionStep: React.FC<ContractCompletionStepProps> = ({
  proposal,
  onCompleteContract,
}) => {
  const [current, setCurrent] = useState(0);
  const [contractFile, setContractFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const steps = useMemo(
    () => [
      { title: "Tải hợp đồng đã ký" },
      { title: "Tài liệu kèm theo" },
      { title: "Hoàn tất" },
    ],
    []
  );

  const next = () => setCurrent((c) => Math.min(c + 1, steps.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const beforeUploadSingle = (file: File) => {
    setContractFile(file);
    antdMessage.success(`Đã chọn hợp đồng: ${file.name}`);
    return false; // prevent auto upload
  };

  const beforeUploadMultiple = (file: File) => {
    setAttachments((prev) => [...prev, file]);
    return false; // prevent auto upload
  };

  const removeAttachment = (file: File) => {
    setAttachments((prev) => prev.filter((f) => f !== file));
  };

  const handleComplete = async () => {
    try {
      setSubmitting(true);
      await onCompleteContract({
        contractFile,
        attachments,
        notes,
        startDate,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-sm">
        <div className="mb-6">
          <Title level={3} className="mb-1">
            Hoàn thiện hợp đồng
          </Title>
          <Text className="text-gray-600">
            Vui lòng hoàn thành các bước dưới đây để hoàn tất hợp đồng cho đề
            xuất này.
          </Text>
        </div>

        <Steps
          current={current}
          size="small"
          items={steps.map((s) => ({ title: s.title }))}
          className="mb-6"
        />

        {/* Step content */}
        <div className="min-h-[260px]">
          {current === 0 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <ClipboardList size={20} className="text-blue-500 mt-1" />
                <div>
                  <Title level={4} className="mb-1">
                    Tải lên hợp đồng đã ký
                  </Title>
                  <Text className="text-gray-600">
                    Chỉ nhận file PDF/Doc. Dung lượng tối đa 10MB.
                  </Text>
                </div>
              </div>
              <Upload.Dragger
                multiple={false}
                beforeUpload={beforeUploadSingle}
                showUploadList={!!contractFile}
                maxCount={1}
                onRemove={() => setContractFile(null)}
                accept=".pdf,.doc,.docx"
              >
                <p className="ant-upload-drag-icon">
                  <UploadCloud />
                </p>
                <p className="ant-upload-text">
                  Kéo thả file vào đây hoặc bấm để chọn file
                </p>
                <p className="ant-upload-hint">Hỗ trợ PDF, Word</p>
              </Upload.Dragger>
              <div>
                <Title level={5} className="mb-2">
                  Ghi chú (tuỳ chọn)
                </Title>
                <TextArea
                  rows={3}
                  placeholder="Ghi chú thêm về hợp đồng..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          {current === 1 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Paperclip size={20} className="text-blue-500 mt-1" />
                <div>
                  <Title level={4} className="mb-1">
                    Tài liệu kèm theo (tuỳ chọn)
                  </Title>
                  <Text className="text-gray-600">
                    Thêm các tài liệu phụ lục, biên bản, hoặc hồ sơ liên quan.
                  </Text>
                </div>
              </div>
              <Upload
                multiple
                beforeUpload={beforeUploadMultiple}
                showUploadList
                fileList={attachments.map(
                  (f) => ({ uid: f.name, name: f.name }) as any
                )}
                onRemove={(file) => {
                  const target = attachments.find((f) => f.name === file.name);
                  if (target) removeAttachment(target);
                }}
              >
                <Button>Thêm tài liệu</Button>
              </Upload>
              <div>
                <Title level={5} className="mb-2">
                  Ngày bắt đầu dự kiến (tuỳ chọn)
                </Title>
                <DatePicker
                  format="DD/MM/YYYY"
                  onChange={(d) => setStartDate(d ? d.toISOString() : null)}
                />
              </div>
            </div>
          )}

          {current === 2 && (
            <div className="space-y-4">
              <Title level={4}>Xác nhận hoàn tất</Title>
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex justify-between py-1">
                  <Text strong>Công nghệ:</Text>
                  <Text>{proposal.technology?.title || "-"}</Text>
                </div>
                <div className="flex justify-between py-1">
                  <Text strong>Hợp đồng đã chọn:</Text>
                  <Text>{contractFile?.name || "Chưa tải lên"}</Text>
                </div>
                <div className="flex justify-between py-1">
                  <Text strong>Số tài liệu kèm:</Text>
                  <Text>{attachments.length}</Text>
                </div>
                <div className="flex justify-between py-1">
                  <Text strong>Ngày bắt đầu:</Text>
                  <Text>
                    {startDate
                      ? new Date(startDate).toLocaleDateString("vi-VN")
                      : "-"}
                  </Text>
                </div>
              </div>
              <Text className="text-gray-600">
                Nhấn "Hoàn tất hợp đồng" để đánh dấu hợp đồng đã hoàn thiện và
                kết thúc quy trình đàm phán.
              </Text>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-between">
          <Space>
            <Button disabled={current === 0} onClick={prev}>
              Trở lại
            </Button>
            {current < steps.length - 1 && (
              <Button type="primary" onClick={next}>
                Tiếp tục
              </Button>
            )}
          </Space>

          {current === steps.length - 1 && (
            <Button
              type="primary"
              icon={<CheckCircle size={16} />}
              loading={submitting}
              className="bg-green-600 hover:bg-green-700"
              onClick={handleComplete}
            >
              Hoàn tất hợp đồng
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};
