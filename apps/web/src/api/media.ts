import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { API_ENDPOINTS, PAYLOAD_API_BASE_URL } from "./config";
import { getStoredToken } from "./auth";
import { Media } from "@/types/media";

class MediaApi {
  private axios: AxiosInstance;

  constructor(axiosInstance?: AxiosInstance) {
    this.axios =
      axiosInstance ||
      axios.create({
        baseURL: PAYLOAD_API_BASE_URL,
        timeout: 10000,
        headers: {
          Accept: "application/json",
        },
      });

    // Attach token if available
    const token = getStoredToken();
    if (token) {
      this.axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }

  /**
   * Upload a single file to Payload CMS `/api/media`.
   * Accepts optional fields such as `alt`, `caption`, `type`.
   */
  async upload(
    file: File | Blob,
    fields?: Partial<Pick<Media, "alt" | "caption" | "type">>
  ): Promise<Media> {
    const formData = new FormData();
    formData.append("file", file);
    if (fields?.alt != null) formData.append("alt", String(fields.alt));
    if (fields?.caption != null)
      formData.append("caption", String(fields.caption));
    if (fields?.type != null) formData.append("type", String(fields.type));

    const config: AxiosRequestConfig = {
      method: "POST",
      url: API_ENDPOINTS.MEDIA,
      data: formData,
      // Do not set Content-Type explicitly; let the browser set boundary
    };

    const res = await this.axios.request(config);
    const payload = res.data as any;
    // PayloadCMS may return the created doc directly or under `doc`/`data`
    const doc = (payload?.doc || payload?.data || payload) as Media;
    return doc;
  }

  /**
   * Upload multiple files to Payload CMS `/api/media`.
   * Returns array of uploaded Media documents in the same order as input.
   */
  async uploadMulti(
    files: Array<File | Blob> | FileList,
    fields?: Partial<Pick<Media, "alt" | "caption" | "type">>
  ): Promise<Media[]> {
    const list: Array<File | Blob> = Array.isArray(files)
      ? files
      : Array.from(files);
    const uploads = list.map((f) => this.upload(f, fields));
    return Promise.all(uploads);
  }

  /**
   * Delete a media file by ID from Payload CMS `/api/media/{id}`.
   */
  async delete(id: number | string): Promise<void> {
    const config: AxiosRequestConfig = {
      method: "DELETE",
      url: `${API_ENDPOINTS.MEDIA}/${id}`,
    };

    await this.axios.request(config);
  }
}

// Create and export a singleton instance
const mediaApiInstance = new MediaApi();

export default MediaApi;

// Export convenient functions
export const uploadFile = (
  file: File | Blob,
  fields?: Partial<Pick<Media, "alt" | "caption" | "type">>
) => mediaApiInstance.upload(file, fields);

export const uploadFiles = (
  files: Array<File | Blob> | FileList,
  fields?: Partial<Pick<Media, "alt" | "caption" | "type">>
) => mediaApiInstance.uploadMulti(files, fields);

export const deleteFile = (id: number | string) => mediaApiInstance.delete(id);
