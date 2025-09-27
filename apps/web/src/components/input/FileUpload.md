# FileUpload Component

Một component upload file linh hoạt và mạnh mẽ được xây dựng với Ant Design, hỗ trợ upload đơn/nhiều file với validation toàn diện và tích hợp sẵn với Media API.

## Tính năng chính

- ✅ Upload đơn và nhiều file
- ✅ Validation kích thước và loại file
- ✅ Progress tracking với UI trực quan
- ✅ Error handling và retry mechanism
- ✅ Preview và quản lý file
- ✅ Tích hợp với PayloadCMS Media API
- ✅ Hỗ trợ drag & drop
- ✅ Responsive design
- ✅ TypeScript support

## Cài đặt và Import

```typescript
import { FileUpload, type FileUploadProps, type FileUploadItem } from '@/components/input';
```

## Sử dụng cơ bản

### Upload file đơn

```typescript
import React, { useState } from 'react';
import { FileUpload, type FileUploadItem } from '@/components/input';

function SingleFileUpload() {
  const [files, setFiles] = useState<FileUploadItem[]>([]);

  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      multiple={false}
      maxSize={10 * 1024 * 1024} // 10MB
      title="Chọn file"
      description="Kéo thả hoặc click để chọn file"
    />
  );
}
```

### Upload nhiều file

```typescript
function MultipleFileUpload() {
  const [files, setFiles] = useState<FileUploadItem[]>([]);

  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      multiple={true}
      maxCount={5}
      maxSize={50 * 1024 * 1024} // 50MB
      title="Chọn nhiều file"
      description="Tối đa 5 file, mỗi file tối đa 50MB"
    />
  );
}
```

### Upload chỉ hình ảnh

```typescript
function ImageUpload() {
  const [images, setImages] = useState<FileUploadItem[]>([]);

  return (
    <FileUpload
      value={images}
      onChange={setImages}
      multiple={true}
      allowedTypes={['image']}
      variant="button"
      buttonText="Chọn hình ảnh"
      maxSize={5 * 1024 * 1024} // 5MB
    />
  );
}
```

## Props API

### FileUploadProps

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `value` | `FileUploadItem[]` | - | Danh sách file hiện tại (controlled) |
| `defaultValue` | `FileUploadItem[]` | `[]` | Giá trị mặc định (uncontrolled) |
| `onChange` | `(files: FileUploadItem[]) => void` | - | Callback khi danh sách file thay đổi |
| `multiple` | `boolean` | `false` | Cho phép chọn nhiều file |
| `maxCount` | `number` | `multiple ? 10 : 1` | Số lượng file tối đa |
| `maxSize` | `number` | `10MB` | Kích thước file tối đa (bytes) |
| `allowedTypes` | `('image' \| 'video' \| 'document' \| 'archive' \| 'all')[]` | `['all']` | Loại file được phép |
| `accept` | `string` | - | MIME types được chấp nhận |
| `variant` | `'dragger' \| 'button' \| 'picture'` | `'dragger'` | Kiểu hiển thị |
| `size` | `'small' \| 'default' \| 'large'` | `'default'` | Kích thước component |
| `disabled` | `boolean` | `false` | Vô hiệu hóa component |
| `title` | `string` | - | Tiêu đề hiển thị |
| `description` | `string` | - | Mô tả hiển thị |
| `buttonText` | `string` | - | Text cho button (variant='button') |
| `autoUpload` | `boolean` | `true` | Tự động upload khi chọn file |
| `uploadOnAdd` | `boolean` | `true` | Upload ngay khi thêm file |

### Callbacks

| Prop | Type | Mô tả |
|------|------|-------|
| `onUploadStart` | `(file: File) => void` | Callback khi bắt đầu upload |
| `onUploadProgress` | `(file: File, progress: number) => void` | Callback theo dõi tiến trình |
| `onUploadSuccess` | `(file: File, media: Media) => void` | Callback khi upload thành công |
| `onUploadError` | `(file: File, error: string) => void` | Callback khi upload lỗi |
| `onRemove` | `(file: FileUploadItem) => void` | Callback khi xóa file |
| `onPreview` | `(file: FileUploadItem) => void` | Callback khi preview file |
| `beforeUpload` | `(file: File) => boolean \| Promise<boolean>` | Validation tùy chỉnh |

## Loại file hỗ trợ

### Image (`allowedTypes: ['image']`)
- JPEG, JPG, PNG, GIF, WebP, SVG
- Kích thước mặc định: 10MB

### Video (`allowedTypes: ['video']`)
- MP4, WebM, OGG
- Kích thước mặc định: 100MB

### Document (`allowedTypes: ['document']`)
- PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), Text (.txt)
- Kích thước mặc định: 50MB

### Archive (`allowedTypes: ['archive']`)
- ZIP, RAR, 7Z
- Kích thước mặc định: 100MB

## Ví dụ nâng cao

### Custom validation

```typescript
function CustomValidationUpload() {
  const [files, setFiles] = useState<FileUploadItem[]>([]);

  const handleValidation = (file: File): boolean => {
    if (file.name.includes('temp')) {
      message.error('Không được upload file tạm thời');
      return false;
    }
    return true;
  };

  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      beforeUpload={handleValidation}
      onUploadSuccess={(file, media) => {
        console.log('Upload success:', { file, media });
      }}
      onUploadError={(file, error) => {
        console.error('Upload error:', { file, error });
      }}
    />
  );
}
```

### Với Media API fields

```typescript
function MediaFieldsUpload() {
  const [files, setFiles] = useState<FileUploadItem[]>([]);

  return (
    <FileUpload
      value={files}
      onChange={setFiles}
      mediaFields={{
        type: 'document',
        caption: 'Tài liệu quan trọng'
      }}
    />
  );
}
```

## Styling

Component sử dụng Tailwind CSS và Ant Design theme. Bạn có thể tùy chỉnh thêm:

```typescript
<FileUpload
  className="custom-upload"
  style={{ border: '2px dashed #1890ff' }}
  // ... other props
/>
```

## Test Page

Để xem tất cả tính năng của component, truy cập:
```
http://localhost:3000/file-upload-test
```

## Lưu ý

1. Component tự động tích hợp với PayloadCMS Media API
2. File được upload sẽ được lưu trữ theo cấu hình của Media collection
3. Progress tracking là mô phỏng vì API không hỗ trợ real-time progress
4. Component hỗ trợ retry upload khi gặp lỗi
5. Validation được thực hiện ở cả client và server side

## Troubleshooting

### File không upload được
- Kiểm tra kích thước file có vượt quá `maxSize`
- Kiểm tra loại file có trong `allowedTypes`
- Kiểm tra kết nối mạng và API endpoint

### Progress không hiển thị
- Đảm bảo `autoUpload` và `uploadOnAdd` được set `true`
- Kiểm tra console để xem lỗi API

### Validation không hoạt động
- Đảm bảo `beforeUpload` function return đúng boolean
- Kiểm tra logic validation trong function
