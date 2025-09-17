/**
 * Media Types for Hanotex CMS
 * Định nghĩa các interface cho Media collection
 */

// Main Media Interface
export interface Media {
  id: string
  alt: string
  filename?: string
  mimeType?: string
  filesize?: number
  width?: number
  height?: number
  url?: string

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Types for form data and API responses
export interface MediaCreateData extends Omit<Media, 'id' | 'createdAt' | 'updatedAt'> {}
export interface MediaUpdateData extends Partial<Pick<Media, 'alt'>> {}

// Media summary for lists
export interface MediaSummary {
  id: string
  alt: string
  filename?: string
  mimeType?: string
  filesize?: number
  url?: string
  createdAt: string
}

// File upload response
export interface FileUploadResponse {
  media: Media
  success: boolean
  error?: string
}
