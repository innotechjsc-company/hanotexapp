"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, ArrowLeft, Eye, MessageSquare } from "lucide-react";
import { Card, CardBody, Button, Chip } from "@heroui/react";

export default function ProposalSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-default-50 flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardBody className="p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-100 mb-6">
            <CheckCircle className="h-8 w-8 text-success-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Đề xuất đã được gửi thành công!
          </h1>

          <p className="text-default-600 mb-6">
            Đề xuất của bạn đã được gửi đến người đăng nhu cầu. Họ sẽ xem xét và
            phản hồi trong thời gian sớm nhất.
          </p>

          {/* What's Next */}
          <Card className="bg-primary-50 mb-6">
            <CardBody className="p-4 text-left">
              <h3 className="font-semibold text-primary-900 mb-2">
                Những bước tiếp theo:
              </h3>
              <ul className="text-sm text-primary-800 space-y-1">
                <li>• Người mua sẽ xem xét đề xuất của bạn</li>
                <li>• Bạn sẽ nhận được thông báo khi có phản hồi</li>
                <li>• Có thể trao đổi thêm thông tin qua tin nhắn</li>
                <li>• Tiến hành đàm phán và ký hợp đồng nếu phù hợp</li>
              </ul>
            </CardBody>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              color="primary"
              className="w-full"
              onPress={() => router.push("/my-demands")}
              startContent={<Eye className="h-4 w-4" />}
            >
              Xem đề xuất của tôi
            </Button>

            <Button
              variant="bordered"
              className="w-full"
              onPress={() => router.push("/messages")}
              startContent={<MessageSquare className="h-4 w-4" />}
            >
              Tin nhắn
            </Button>

            <Button
              variant="bordered"
              className="w-full"
              onPress={() => router.push("/demands")}
              startContent={<ArrowLeft className="h-4 w-4" />}
            >
              Quay lại danh sách nhu cầu
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
