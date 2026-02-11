import { Image } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { uploadPreviewImage } from "@/services/steins-admin/aigcKnowledgeBaseController";

type CoverUploaderProps = {
  helperText?: string;
  hintText?: string;
  maxSizeMb?: number;
  onFileChange?: (file: File | null, uploadedUrl?: string, resourceId?: string) => void;
  initialUrl?: string | null;
};

const CoverUploader: React.FC<CoverUploaderProps> = ({
  helperText = "拖拽上传封面或点击选择",
  hintText = "支持 JPG/PNG，最大 5MB",
  maxSizeMb = 5,
  onFileChange,
  initialUrl,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    if (initialUrl) {
      setPreviewUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleCoverFile = async (file: File | null) => {
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrorText("封面仅支持图片格式");
      return;
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setErrorText(`封面图片不能超过 ${maxSizeMb}MB`);
      return;
    }
    setErrorText(null);
    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) {
        URL.revokeObjectURL(prev);
      }
      return nextUrl;
    });
    try {
      const resp = await uploadPreviewImage({}, file);
      if (resp?.code !== 200) {
        setErrorText(resp?.msg || "封面上传失败");
        return;
      }
      const resourceId = resp?.data?.resourceId;
      const rawUrl = typeof resp?.data?.url === "string" ? resp.data.url : undefined;
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const previewUrl = resourceId
        ? `${origin}/steins/file/resource/preview/${resourceId}`
        : rawUrl && /^https?:\/\//.test(rawUrl)
          ? rawUrl
          : rawUrl
            ? `${origin}${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`
            : rawUrl;
      if (previewUrl) {
        const normalizedUrl = previewUrl.replace(/\/preview(?=\d)/, "/preview/");
        onFileChange?.(file, normalizedUrl, resourceId ? String(resourceId) : undefined);
        setPreviewUrl((prev) => {
          if (prev && prev.startsWith("blob:")) {
            URL.revokeObjectURL(prev);
          }
          return normalizedUrl;
        });
      }
    } catch (error) {
      setErrorText("封面上传失败");
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        className={`relative flex h-40 items-center justify-center rounded-2xl border-2 border-dashed transition ${
          isDragging ? "border-blue-400 bg-blue-50/60" : "border-slate-200 bg-slate-50"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleCoverFile(event.dataTransfer.files?.[0] || null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="封面预览" className="h-full w-full rounded-2xl object-cover" />
        ) : (
          <div className="text-center text-sm text-slate-500">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
              <Image size={20} />
            </div>
            <div className="font-medium text-slate-600">{helperText}</div>
            <div className="mt-1 text-xs text-slate-400">{hintText}</div>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => handleCoverFile(event.target.files?.[0] || null)}
        />
      </div>
      {previewUrl && (
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-2 text-xs font-semibold text-blue-600">
          重新选择封面
        </button>
      )}
      {errorText && <div className="mt-2 text-xs text-rose-500">{errorText}</div>}
    </div>
  );
};

export default CoverUploader;
