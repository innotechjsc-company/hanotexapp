// Document types for HANOTEX platform

// Document interface
export interface Document {
  id: string;
  technology_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size?: number;
  mime_type?: string;
  is_public: boolean;
  uploaded_by?: string;
  created_at: Date;
}

// File upload interface
export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
}
