"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Upload, Copy, Trash2, X, Check, Image as ImageIcon } from "lucide-react";

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export default function MediaAdminPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    const res = await fetch("/api/media");
    const data = await res.json();
    setFiles(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);

      await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
    }

    await fetchFiles();
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除该文件?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    await fetchFiles();
  };

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">媒体库</h1>
          <p className="text-gray-400 text-sm mt-0.5">{files.length} 个文件</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] hover:bg-[#E8C96A] text-black font-semibold text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          <Upload size={16} />
          {uploading ? "上传中..." : "上传文件"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files);
        }}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragOver
            ? "border-[#C9A84C] bg-[#C9A84C]/5"
            : "border-gray-700 hover:border-gray-500"
        }`}
      >
        <ImageIcon size={32} className="text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400 text-sm">
          拖拽图片到此处，或{" "}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-[#C9A84C] hover:underline"
          >
            点击选择
          </button>
        </p>
        <p className="text-gray-600 text-xs mt-1">支持 PNG, JPG, GIF, WebP</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-400">加载中...</div>
      ) : files.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          暂无媒体文件
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative bg-[#1A1D26] border border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-500 transition-all"
            >
              {/* Image */}
              <div className="relative aspect-square bg-[#0F1117]">
                <Image
                  src={file.url}
                  alt={file.filename}
                  fill
                  className="object-cover"
                  sizes="200px"
                />
              </div>

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => copyUrl(file.id, file.url)}
                  className="p-2 bg-[#1A1D26] rounded-lg hover:bg-[#C9A84C]/20 transition-colors"
                  title="复制链接"
                >
                  {copiedId === file.id ? (
                    <Check size={14} className="text-green-400" />
                  ) : (
                    <Copy size={14} className="text-gray-300" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="p-2 bg-[#1A1D26] rounded-lg hover:bg-red-400/20 transition-colors"
                  title="删除"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-gray-300 text-xs truncate">{file.filename}</p>
                <p className="text-gray-500 text-xs">{formatSize(file.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
