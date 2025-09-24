"use client";

import {
  Button,
  Space,
  Card,
  Typography,
  Divider,
  Row,
  Col,
  Input,
  Select,
  Switch,
  Alert,
} from "antd";
import toastService from "@/services/toastService";
import { useState } from "react";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function ToastTestPage() {
  const [loading, setLoading] = useState(false);
  const [customMessage, setCustomMessage] = useState("Custom Notification");
  const [customDescription, setCustomDescription] = useState(
    "This is a custom notification with custom styling"
  );
  const [customDuration, setCustomDuration] = useState(4.5);
  const [autoClose, setAutoClose] = useState(true);

  // Basic notification examples
  const showSuccess = () => {
    toastService.success("Success!", "This is a success message");
  };

  const showError = () => {
    toastService.error("Error!", "This is an error message");
  };

  const showWarning = () => {
    toastService.warning("Warning!", "This is a warning message");
  };

  const showInfo = () => {
    toastService.info("Info!", "This is an info message");
  };

  // Advanced examples
  const showCustom = () => {
    toastService.custom({
      message: customMessage,
      description: customDescription,
      duration: autoClose ? customDuration : 0,
      btn: (
        <Button
          type="primary"
          size="small"
          onClick={() => toastService.close("custom-key")}
        >
          Confirm
        </Button>
      ),
      key: "custom-key",
      onClose: () => console.log("Custom notification closed"),
    });
  };

  const showLoading = () => {
    setLoading(true);
    toastService.info(
      "Loading...",
      "Please wait while we process your request",
      0
    );

    // Simulate async operation
    setTimeout(() => {
      toastService.closeAll();
      toastService.success("Success!", "Operation completed successfully");
      setLoading(false);
    }, 3000);
  };

  const showMultiple = () => {
    toastService.success("First notification", "This will appear first");
    setTimeout(() => {
      toastService.info("Second notification", "This appears after 1 second");
    }, 1000);
    setTimeout(() => {
      toastService.warning(
        "Third notification",
        "This appears after 2 seconds"
      );
    }, 2000);
  };

  const showWithCallback = () => {
    toastService.success(
      "Action completed!",
      "This notification has a callback",
      3,
      () => {
        toastService.info("Callback executed!", "The notification was closed");
      }
    );
  };

  const closeAll = () => {
    toastService.closeAll();
  };

  // Realistic use cases
  const simulateApiCall = async (type: "success" | "error") => {
    toastService.info("Processing...", "Please wait", 0);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toastService.closeAll();

    if (type === "success") {
      toastService.success(
        "Data saved!",
        "Your changes have been saved successfully"
      );
    } else {
      toastService.error(
        "Save failed!",
        "Please check your connection and try again"
      );
    }
  };

  const simulateLogin = async (success: boolean) => {
    toastService.info("Logging in...", "Please wait", 0);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toastService.closeAll();

    if (success) {
      toastService.success("Welcome back!", "You have successfully logged in");
    } else {
      toastService.error("Login failed!", "Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <Title level={2} className="text-center mb-2">
            Toast Service Test Page
          </Title>
          <Paragraph className="text-center text-gray-600">
            Comprehensive testing page for the ToastService using Ant Design
            notifications. Test different notification types, configurations,
            and real-world scenarios.
          </Paragraph>
        </Card>

        {/* Basic Notifications */}
        <Card title="Basic Notifications" bordered={false}>
          <Paragraph className="mb-4">
            Test the four basic notification types with default settings.
          </Paragraph>
          <Space wrap size="middle">
            <Button type="primary" onClick={showSuccess} size="large">
              Show Success
            </Button>
            <Button danger onClick={showError} size="large">
              Show Error
            </Button>
            <Button onClick={showWarning} size="large">
              Show Warning
            </Button>
            <Button onClick={showInfo} size="large">
              Show Info
            </Button>
          </Space>
        </Card>

        {/* Advanced Features */}
        <Card title="Advanced Features" bordered={false}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Space direction="vertical" className="w-full">
                <Button type="dashed" onClick={showCustom} size="large" block>
                  Show Custom Notification
                </Button>
                <Button
                  type="primary"
                  loading={loading}
                  onClick={showLoading}
                  size="large"
                  block
                >
                  Show Loading Sequence
                </Button>
                <Button onClick={showMultiple} size="large" block>
                  Show Multiple Notifications
                </Button>
                <Button onClick={showWithCallback} size="large" block>
                  Show with Callback
                </Button>
                <Button onClick={closeAll} size="large" block>
                  Close All Notifications
                </Button>
              </Space>
            </Col>
            <Col xs={24} lg={12}>
              <Card size="small" title="Custom Notification Config">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text strong>Message:</Text>
                    <Input
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      placeholder="Enter message"
                    />
                  </div>
                  <div>
                    <Text strong>Description:</Text>
                    <TextArea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Enter description"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Text strong>Duration (seconds):</Text>
                    <Input
                      type="number"
                      value={customDuration}
                      onChange={(e) =>
                        setCustomDuration(Number(e.target.value))
                      }
                      min={0}
                      step={0.5}
                    />
                  </div>
                  <div>
                    <Space>
                      <Text strong>Auto-close:</Text>
                      <Switch checked={autoClose} onChange={setAutoClose} />
                    </Space>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Real-world Scenarios */}
        <Card title="Real-world Scenarios" bordered={false}>
          <Paragraph className="mb-4">
            Simulate common application scenarios where notifications are used.
          </Paragraph>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" title="API Success">
                <Button
                  type="primary"
                  onClick={() => simulateApiCall("success")}
                  block
                >
                  Simulate Save Success
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" title="API Error">
                <Button danger onClick={() => simulateApiCall("error")} block>
                  Simulate Save Error
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" title="Login Success">
                <Button
                  type="primary"
                  onClick={() => simulateLogin(true)}
                  block
                >
                  Simulate Login Success
                </Button>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card size="small" title="Login Error">
                <Button danger onClick={() => simulateLogin(false)} block>
                  Simulate Login Error
                </Button>
              </Card>
            </Col>
          </Row>
        </Card>

        {/* Usage Examples */}
        <Card title="Usage Examples" bordered={false}>
          <Alert
            message="Import Statement"
            description="import toastService from '@/services/toastService';"
            type="info"
            showIcon
            className="mb-4"
          />
        </Card>

        {/* API Reference */}
        <Card title="API Reference" bordered={false}>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Title level={4}>Methods</Title>
              <ul className="space-y-2">
                <li>
                  <code>
                    success(message, description?, duration?, onClose?)
                  </code>
                </li>
                <li>
                  <code>error(message, description?, duration?, onClose?)</code>
                </li>
                <li>
                  <code>
                    warning(message, description?, duration?, onClose?)
                  </code>
                </li>
                <li>
                  <code>info(message, description?, duration?, onClose?)</code>
                </li>
                <li>
                  <code>custom(args: ArgsProps)</code>
                </li>
                <li>
                  <code>close(key: string)</code>
                </li>
                <li>
                  <code>closeAll()</code>
                </li>
                <li>
                  <code>config(options: any)</code>
                </li>
              </ul>
            </Col>
            <Col xs={24} lg={12}>
              <Title level={4}>Parameters</Title>
              <ul className="space-y-2">
                <li>
                  <strong>message:</strong> Main notification text
                </li>
                <li>
                  <strong>description:</strong> Secondary text (optional)
                </li>
                <li>
                  <strong>duration:</strong> Auto-close time in seconds (0 =
                  never)
                </li>
                <li>
                  <strong>onClose:</strong> Callback when notification closes
                </li>
                <li>
                  <strong>key:</strong> Unique identifier for the notification
                </li>
              </ul>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}
