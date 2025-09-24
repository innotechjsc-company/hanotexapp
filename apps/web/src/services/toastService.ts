import { notification } from "antd";
import type { ArgsProps } from "antd/es/notification/interface";

class ToastService {
  private defaultDuration = 4.5;

  // Success notification
  success(
    message: string,
    description?: string,
    duration?: number,
    onClose?: () => void
  ) {
    notification.success({
      message,
      description,
      duration: duration !== undefined ? duration : this.defaultDuration,
      onClose,
      placement: "topRight",
    });
  }

  // Error notification
  error(
    message: string,
    description?: string,
    duration?: number,
    onClose?: () => void
  ) {
    notification.error({
      message,
      description,
      duration: duration !== undefined ? duration : this.defaultDuration,
      onClose,
      placement: "topRight",
    });
  }

  // Warning notification
  warning(
    message: string,
    description?: string,
    duration?: number,
    onClose?: () => void
  ) {
    notification.warning({
      message,
      description,
      duration: duration !== undefined ? duration : this.defaultDuration,
      onClose,
      placement: "topRight",
    });
  }

  // Info notification
  info(
    message: string,
    description?: string,
    duration?: number,
    onClose?: () => void
  ) {
    notification.info({
      message,
      description,
      duration: duration !== undefined ? duration : this.defaultDuration,
      onClose,
      placement: "topRight",
    });
  }

  // Custom notification with full control
  custom(args: ArgsProps) {
    notification.open(args);
  }

  // Close a specific notification by key
  close(key: string) {
    notification.destroy(key);
  }

  // Close all notifications
  closeAll() {
    notification.destroy();
  }

  // Set default configuration
  config(options: any) {
    notification.config(options);
  }
}

// Create singleton instance
const toastService = new ToastService();

export default toastService;
