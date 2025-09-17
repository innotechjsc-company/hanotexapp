/**
 * LocalStorageService
 * Trình bao (wrapper) đơn giản để quản lý localStorage an toàn với SSR.
 * - Tự động thêm prefix để tránh xung đột key
 * - Hỗ trợ lưu/đọc dữ liệu JSON (generic)
 * - Tùy chọn TTL (hết hạn) cho mỗi key
 */

type Serializable = unknown;

interface SetOptions {
  // TTL theo mili-giây. Ví dụ 24h = 24 * 60 * 60 * 1000
  ttl?: number;
}

interface StoredPayload<T = Serializable> {
  v: T; // value
  e?: number; // expiresAt (timestamp ms)
}

export class LocalStorageService {
  private prefix: string;

  constructor(prefix = 'hanotex') {
    this.prefix = prefix;
  }

  /**
   * Kiểm tra có đang chạy trên trình duyệt và localStorage khả dụng không
   */
  private get storage(): Storage | null {
    if (typeof window === 'undefined') return null;
    try {
      const testKey = '__ls_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return window.localStorage;
    } catch {
      return null;
    }
  }

  private buildKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  /**
   * Lưu giá trị (tự động stringify) với tùy chọn TTL
   */
  set<T = Serializable>(key: string, value: T, options?: SetOptions): boolean {
    const store = this.storage;
    if (!store) return false;

    const payload: StoredPayload<T> = { v: value };
    if (options?.ttl && options.ttl > 0) {
      payload.e = Date.now() + options.ttl;
    }

    try {
      store.setItem(this.buildKey(key), JSON.stringify(payload));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Đọc giá trị; nếu hết hạn sẽ xóa và trả về defaultValue/null
   */
  get<T = Serializable>(key: string, defaultValue: T | null = null): T | null {
    const store = this.storage;
    if (!store) return defaultValue;

    const raw = store.getItem(this.buildKey(key));
    if (raw == null) return defaultValue;

    try {
      const payload = JSON.parse(raw) as StoredPayload<T>;
      if (payload && typeof payload === 'object') {
        if (payload.e && Date.now() > payload.e) {
          // expired
          store.removeItem(this.buildKey(key));
          return defaultValue;
        }
        return payload.v as T;
      }
      // Trường hợp dữ liệu cũ không theo định dạng mới
      return (raw as unknown) as T;
    } catch {
      // Nếu không phải JSON hợp lệ, trả về chuỗi thô
      return (raw as unknown) as T;
    }
  }

  /**
   * Xóa 1 key
   */
  remove(key: string): void {
    const store = this.storage;
    if (!store) return;
    try {
      store.removeItem(this.buildKey(key));
    } catch {
      // ignore
    }
  }

  /**
   * Xóa tất cả các key theo prefix
   */
  clear(): void {
    const store = this.storage;
    if (!store) return;
    try {
      const keys: string[] = [];
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        if (k && k.startsWith(`${this.prefix}:`)) keys.push(k);
      }
      keys.forEach((k) => store.removeItem(k));
    } catch {
      // ignore
    }
  }

  /**
   * Liệt kê các key theo prefix
   */
  keys(): string[] {
    const store = this.storage;
    if (!store) return [];
    const result: string[] = [];
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (k && k.startsWith(`${this.prefix}:`)) {
        result.push(k.replace(`${this.prefix}:`, ''));
      }
    }
    return result;
  }
}

// Instance mặc định dùng cho toàn hệ thống
export const localStorageService = new LocalStorageService('hanotex');
