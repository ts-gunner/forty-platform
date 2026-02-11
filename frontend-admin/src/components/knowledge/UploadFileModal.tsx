import { CheckCircle2, FileImage, FileSpreadsheet, FileText, Folder, Trash2, CloudUpload, Settings, Image, FileType, SlidersHorizontal, Eye, Download } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Progress } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { vectorizeFile } from "@/services/steins-admin/aigcFileProcessingController";

type UploadFileModalProps = {
  open: boolean;
  onClose: () => void;
  destinationPath: string[];
  destinationOptions?: string[][];
  defaultTags?: string[];
  recommendedTags?: string[];
  acceptedExtensions?: string[];
  maxFileSizeMb?: number;
  docTypeOptions?: string[];
  defaultDocType?: string;
  defaultSecurity?: "internal" | "public" | "confidential";
  /** 当前文件夹 ID，用于上传接口 folderId */
  folderId?: string;
  /** 上传成功后回调 */
  onUploadSuccess?: () => void;
  /** 开始上传回调，传递文件列表和目标路径 */
  onStartUpload?: (files: File[], destinationPath: string) => void;
};

type UploadStatus = "queued" | "uploading" | "done";

type UploadItem = {
  id: string;
  name: string;
  sizeLabel: string;
  progress: number;
  status: UploadStatus;
  typeLabel: string;
  file: File;
};

type SplitType = "DEFAULT" | "IMAGE" | "WHOLE" | "CUSTOM";

const DEFAULT_ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".pptx", ".xlsx", ".png", ".jpg", ".jpeg"];

const formatFileSize = (size: number) => {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
  if (size >= 1024) {
    return `${Math.round(size / 1024)} KB`;
  }
  return `${size} B`;
};

const getExtensionLabel = (fileName: string) => {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".pdf")) return "PDF";
  if (lower.endsWith(".docx")) return "DOCX";
  if (lower.endsWith(".pptx")) return "PPTX";
  if (lower.endsWith(".xlsx")) return "XLSX";
  if (lower.endsWith(".png")) return "PNG";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "JPG";
  return "FILE";
};

const getFileIcon = (typeLabel: string) => {
  if (typeLabel === "PDF") {
    return <FileText size={16} className="text-rose-500" />;
  }
  if (typeLabel === "XLSX") {
    return <FileSpreadsheet size={16} className="text-emerald-500" />;
  }
  if (typeLabel === "PNG" || typeLabel === "JPG") {
    return <FileImage size={16} className="text-purple-500" />;
  }
  if (typeLabel === "DOCX" || typeLabel === "PPTX") {
    return <FileText size={16} className="text-blue-500" />;
  }
  return <Folder size={16} className="text-slate-500" />;
};

const SPLIT_OPTIONS: { key: SplitType; label: string; desc: string; icon: React.ReactNode }[] = [
  { key: "DEFAULT", label: "默认切片", desc: "智能分析文件类型", icon: <Settings size={20} /> },
  { key: "IMAGE", label: "图片切片", desc: "针对图片优化处理", icon: <Image size={20} /> },
  { key: "WHOLE", label: "文档切片", desc: "保持文档结构完整", icon: <FileType size={20} /> },
  { key: "CUSTOM", label: "自定义切片", desc: "手动设置切片参数", icon: <SlidersHorizontal size={20} /> },
];

const UploadFileModal: React.FC<UploadFileModalProps> = ({
  open,
  onClose,
  destinationPath,
  acceptedExtensions = DEFAULT_ACCEPTED_EXTENSIONS,
  maxFileSizeMb = 50,
  folderId,
  onUploadSuccess,
  onStartUpload,
}) => {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [splitType, setSplitType] = useState<SplitType>("DEFAULT");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const progressTimer = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setItems([]);
      setErrorMessage(null);
      setIsDragging(false);
      setSplitType("DEFAULT");
    }
  }, [open]);

  useEffect(() => {
    const hasUploading = items.some((item) => item.status === "uploading");
    if (!hasUploading) {
      if (progressTimer.current) {
        window.clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
      return;
    }
    if (progressTimer.current) {
      return;
    }
    progressTimer.current = window.setInterval(() => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.status !== "uploading") {
            return item;
          }
          const nextProgress = Math.min(100, item.progress + Math.floor(Math.random() * 12 + 6));
          return {
            ...item,
            progress: nextProgress,
            status: nextProgress >= 100 ? "done" : "uploading",
          };
        })
      );
    }, 600);
    return () => {
      if (progressTimer.current) {
        window.clearInterval(progressTimer.current);
        progressTimer.current = null;
      }
    };
  }, [items]);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }
    const nextItems: UploadItem[] = [];
    const errors: string[] = [];
    Array.from(fileList).forEach((file) => {
      const lower = file.name.toLowerCase();
      const extMatch = acceptedExtensions.some((ext) => lower.endsWith(ext));
      if (!extMatch) {
        errors.push(`${file.name} 格式不支持`);
        return;
      }
      if (file.size > maxFileSizeMb * 1024 * 1024) {
        errors.push(`${file.name} 超过 ${maxFileSizeMb}MB`);
        return;
      }
      nextItems.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        progress: 0,
        status: "uploading",
        typeLabel: getExtensionLabel(file.name),
        file,
      });
    });
    setItems((prev) => [...nextItems, ...prev]);
    setErrorMessage(errors.length ? errors[0] : null);
  };

  const handleStartUpload = async () => {
    const filesToUpload = items.filter((item) => item.status !== "done");

    if (filesToUpload.length === 0) {
      return;
    }

    if (onStartUpload) {
      // 使用外部上传逻辑（传输队列）
      onStartUpload(
        filesToUpload.map((item) => item.file),
        destinationPath?.join("/") || ""
      );
      onClose();
      return;
    }

    // 调用上传接口 POST /steins/aigc/vectorize
    // 接口参数: folderId, file
    if (folderId !== undefined) {
      try {
        // 逐个文件上传
        for (const item of filesToUpload) {
          await vectorizeFile({
            request: {
              folderId,
              splitConfig: { split_type: splitType, custom_split_config: undefined },
            },
          }, item.file);
        }
        onUploadSuccess?.();
      } catch (error) {
        console.error("上传失败", error);
      }
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      closable={false}
      styles={{
        body: { padding: 0 },
      }}
      className="[&_.ant-modal-content]:!rounded-xl [&_.ant-modal-content]:!overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">批量拖拽上传文件及文件夹</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <CloseOutlined />
        </button>
      </div>

      <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
        {/* Supported formats */}
        <div className="text-sm text-gray-500 mb-4">
          支持 PDF、DOCX、PPTX、XLSX、PNG、JPG 等多种格式
        </div>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-12 px-6 cursor-pointer transition-all ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 bg-gray-50 hover:border-gray-300"
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
            addFiles(event.dataTransfer.files);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <CloudUpload size={24} className="text-blue-500" />
          </div>
          <div className="text-sm text-gray-700 mb-1">
            拖拽文件或文件夹到此处，或<span className="text-blue-500">点击上传</span>
          </div>
          <div className="text-xs text-gray-400">支持批量上传多个文件和文件夹</div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={acceptedExtensions.join(",")}
            className="hidden"
            onChange={(event) => addFiles(event.target.files)}
          />
        </div>

        {errorMessage && <div className="mt-3 text-xs text-red-500">{errorMessage}</div>}

        {/* Advanced settings */}
        <div className="mt-6">
          <div className="text-sm font-medium text-gray-900 mb-2">高级设置</div>
          <div className="text-xs text-gray-500 mb-3">文件切片处理方式</div>
          <div className="grid grid-cols-4 gap-3">
            {SPLIT_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setSplitType(option.key)}
                className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
                  splitType === option.key
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`mb-2 ${
                    splitType === option.key ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  {option.icon}
                </div>
                <div
                  className={`text-sm font-medium ${
                    splitType === option.key ? "text-blue-600" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </div>
                <div className="text-xs text-gray-400 mt-1">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* File list */}
        {items.length > 0 && (
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-900 mb-3">文件上传列表</div>
            <div className="space-y-2">
              {items.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-lg"
                >
                  <div className="flex-shrink-0">{getFileIcon(file.typeLabel)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-800 truncate">{file.name}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{file.sizeLabel}</span>
                    </div>
                    {file.status !== "done" && (
                      <Progress
                        percent={file.progress}
                        size="small"
                        showInfo={false}
                        strokeColor="#6366f1"
                        className="mt-1 [&_.ant-progress-inner]:!h-1.5"
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {file.status === "done" ? (
                      <span className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        已完成
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">{file.progress}%</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setItems((prev) => prev.filter((item) => item.id !== file.id))}
                      className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
        <Button onClick={onClose} className="!rounded-lg !px-6">
          取消
        </Button>
        <Button
          type="primary"
          onClick={handleStartUpload}
          className="!rounded-lg !px-6 !bg-indigo-500 hover:!bg-indigo-600"
        >
          开始上传
        </Button>
      </div>
    </Modal>
  );
};

export default UploadFileModal;
