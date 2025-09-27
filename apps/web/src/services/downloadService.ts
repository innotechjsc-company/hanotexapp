import { getFullMediaUrl } from "@/utils/mediaUrl";
import type { Media } from "@/types/media1";

class DownloadService {
  /**
   * Download a file from a URL (relative or absolute).
   * Tries to fetch as Blob for reliable downloads; falls back to anchor click.
   */
  async downloadByUrl(url: string, filename?: string) {
    if (!url) throw new Error("URL is required");

    const fullUrl = getFullMediaUrl(url);

    // Try to fetch the blob first (works best when CORS is configured)
    try {
      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const suggested = this.getFilenameFromUrl(fullUrl);
      const finalName = this.ensureExtension(
        filename || suggested,
        blob.type || undefined
      );
      this.triggerBlobDownload(blob, finalName);
      return;
    } catch (err) {
      // Fallback: best-effort anchor download
      const a = document.createElement("a");
      a.href = fullUrl;
      if (filename) a.download = filename;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  /**
   * Download a file from a Media object provided by CMS.
   */
  async downloadMedia(media: Media) {
    const url = media?.url || "";
    const name = media?.filename || media?.alt || undefined;
    await this.downloadByUrl(url, name || undefined);
  }

  /** Extract file name from URL path */
  private getFilenameFromUrl(url: string): string {
    try {
      const u = new URL(url, typeof window !== "undefined" ? window.location.href : undefined);
      const base = decodeURIComponent(u.pathname.split("/").pop() || "download");
      return base || "download";
    } catch {
      const base = url.split("?")[0].split("#")[0];
      return decodeURIComponent(base.split("/").pop() || "download");
    }
  }

  /** Ensure filename has extension consistent with mime, if possible */
  private ensureExtension(filename: string, mime?: string): string {
    if (!mime) return filename;
    const extFromMime = this.extensionFromMime(mime);
    if (!extFromMime) return filename;

    const hasExt = /\.[a-z0-9]+$/i.test(filename);
    if (hasExt) return filename;
    return `${filename}.${extFromMime}`;
  }

  private extensionFromMime(mime: string): string | null {
    const map: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "application/pdf": "pdf",
      "text/plain": "txt",
      "application/zip": "zip",
      "application/json": "json",
      "video/mp4": "mp4",
      "video/webm": "webm",
    };
    return map[mime] || null;
  }

  private triggerBlobDownload(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "download";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

const downloadService = new DownloadService();
export default downloadService;

