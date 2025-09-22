"use client";

import React, { useEffect, useMemo, useState } from "react";
import MediaApi from "@/api/media";
import { Media } from "@/types/media1";
import { getStoredToken } from "@/api/auth";

type MediaType = Media["type"];

export default function MediaTestPage() {
  const mediaApi = useMemo(() => new MediaApi(), []);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Check token presence for convenience
    try {
      const t = getStoredToken();
      setHasToken(!!t);
    } catch {
      setHasToken(false);
    }
  }, []);

  // Single upload state
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [singleAlt, setSingleAlt] = useState("");
  const [singleCaption, setSingleCaption] = useState("");
  const [singleType, setSingleType] = useState<MediaType>(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [singleResult, setSingleResult] = useState<Media | null>(null);

  // Multi upload state
  const [multiFiles, setMultiFiles] = useState<FileList | null>(null);
  const [multiAlt, setMultiAlt] = useState("");
  const [multiCaption, setMultiCaption] = useState("");
  const [multiType, setMultiType] = useState<MediaType>(null);
  const [multiLoading, setMultiLoading] = useState(false);
  const [multiError, setMultiError] = useState<string | null>(null);
  const [multiResults, setMultiResults] = useState<Media[] | null>(null);

  const handleSingleUpload = async () => {
    if (!singleFile) {
      setSingleError("Vui lòng chọn 1 file");
      return;
    }
    setSingleLoading(true);
    setSingleError(null);
    setSingleResult(null);
    try {
      const res = await mediaApi.upload(singleFile, {
        alt: singleAlt || undefined,
        caption: singleCaption || undefined,
        type: singleType || undefined,
      });
      setSingleResult(res);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Upload thất bại";
      setSingleError(msg);
    } finally {
      setSingleLoading(false);
    }
  };

  const handleMultiUpload = async () => {
    if (!multiFiles || multiFiles.length === 0) {
      setMultiError("Vui lòng chọn ít nhất 1 file");
      return;
    }
    setMultiLoading(true);
    setMultiError(null);
    setMultiResults(null);
    try {
      const res = await mediaApi.uploadMulti(multiFiles, {
        alt: multiAlt || undefined,
        caption: multiCaption || undefined,
        type: multiType || undefined,
      });
      setMultiResults(res);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Upload thất bại";
      setMultiError(msg);
    } finally {
      setMultiLoading(false);
    }
  };

  const TypeSelect = ({
    value,
    onChange,
  }: {
    value: MediaType;
    onChange: (v: MediaType) => void;
  }) => (
    <select
      value={value ?? ""}
      onChange={(e) => onChange((e.target.value || null) as MediaType)}
      className="border rounded px-2 py-1"
    >
      <option value="">(Không đặt)</option>
      <option value="image">image</option>
      <option value="video">video</option>
      <option value="document">document</option>
      <option value="other">other</option>
    </select>
  );

  const MediaCard = ({ item }: { item: Media }) => (
    <div className="border rounded p-3 flex gap-3 items-start">
      {item.thumbnailURL || item.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={(item.thumbnailURL || item.url) as string}
          alt={item.alt || item.filename || "media"}
          className="w-24 h-24 object-cover rounded border"
        />
      ) : (
        <div className="w-24 h-24 flex items-center justify-center bg-gray-100 text-gray-500 rounded border">
          N/A
        </div>
      )}
      <div className="text-sm">
        <div>
          <b>ID:</b> {String(item.id)}
        </div>
        <div>
          <b>Filename:</b> {item.filename || "-"}
        </div>
        <div>
          <b>MIME:</b> {item.mimeType || "-"}
        </div>
        <div>
          <b>Alt:</b> {item.alt || "-"}
        </div>
        <div>
          <b>Caption:</b> {item.caption || "-"}
        </div>
        <div>
          <b>Type:</b> {item.type || "-"}
        </div>
        <div>
          <b>URL:</b> {item.url || "-"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">MediaApi Test</h1>
      <div className="mb-6 text-sm">
        Trạng thái xác thực:{" "}
        {hasToken ? (
          <span className="text-green-700">Đã có token</span>
        ) : (
          <span className="text-red-700">Chưa có token (cần đăng nhập)</span>
        )}
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-medium mb-3">Upload đơn</h2>
        <div className="flex flex-col gap-3 p-4 border rounded-md">
          <input
            type="file"
            onChange={(e) => setSingleFile(e.target.files?.[0] || null)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border rounded px-2 py-1"
              placeholder="alt (mô tả)"
              value={singleAlt}
              onChange={(e) => setSingleAlt(e.target.value)}
            />
            <input
              className="border rounded px-2 py-1"
              placeholder="caption (chú thích)"
              value={singleCaption}
              onChange={(e) => setSingleCaption(e.target.value)}
            />
            <TypeSelect value={singleType} onChange={setSingleType} />
          </div>
          <div className="flex gap-2 items-center mt-1">
            <button
              onClick={handleSingleUpload}
              disabled={singleLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {singleLoading ? "Đang upload..." : "Upload"}
            </button>
            {singleError && <span className="text-red-600">{singleError}</span>}
          </div>

          {singleResult && (
            <div className="mt-3">
              <MediaCard item={singleResult} />
              <pre className="mt-3 bg-gray-50 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(singleResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-3">Upload nhiều</h2>
        <div className="flex flex-col gap-3 p-4 border rounded-md">
          <input
            type="file"
            multiple
            onChange={(e) => setMultiFiles(e.target.files)}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border rounded px-2 py-1"
              placeholder="alt (mô tả) cho tất cả"
              value={multiAlt}
              onChange={(e) => setMultiAlt(e.target.value)}
            />
            <input
              className="border rounded px-2 py-1"
              placeholder="caption (chú thích) cho tất cả"
              value={multiCaption}
              onChange={(e) => setMultiCaption(e.target.value)}
            />
            <TypeSelect value={multiType} onChange={setMultiType} />
          </div>
          <div className="flex gap-2 items-center mt-1">
            <button
              onClick={handleMultiUpload}
              disabled={multiLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {multiLoading ? "Đang upload..." : "Upload tất cả"}
            </button>
            {multiError && <span className="text-red-600">{multiError}</span>}
          </div>

          {!!multiResults?.length && (
            <div className="mt-3 space-y-3">
              {multiResults.map((m) => (
                <MediaCard key={`${m.id}-${m.filename}`} item={m} />
              ))}
              <pre className="mt-3 bg-gray-50 p-3 rounded text-xs overflow-auto">
                {JSON.stringify(multiResults, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
