import React from "react";
import {
  FileImage,
  FileSpreadsheet,
  FileText,
  Folder,
} from "lucide-react";

export type FileBadgeType = "folder" | "pdf" | "xlsx" | "docx" | "png" | "file";

export const fileBadgeMap: Record<FileBadgeType, { label: string; className: string; icon: React.ReactNode }> = {
  folder: { label: "文件夹", className: "bg-amber-50 text-amber-600", icon: <Folder className="text-amber-500" size={18} /> },
  pdf: { label: "PDF", className: "bg-rose-50 text-rose-600", icon: <FileText className="text-rose-500" size={18} /> },
  xlsx: { label: "XLSX", className: "bg-emerald-50 text-emerald-600", icon: <FileSpreadsheet className="text-emerald-500" size={18} /> },
  docx: { label: "DOCX", className: "bg-blue-50 text-blue-600", icon: <FileText className="text-blue-500" size={18} /> },
  png: { label: "PNG", className: "bg-purple-50 text-purple-600", icon: <FileImage className="text-purple-500" size={18} /> },
  file: { label: "文件", className: "bg-slate-100 text-slate-600", icon: <FileText className="text-slate-500" size={18} /> },
};

export function getFileBadgeType(nodeType?: string, fileSuffix?: string): FileBadgeType {
  if (nodeType === "folder") {
    return "folder";
  }
  
  if (fileSuffix) {
    const suffix = fileSuffix.replace(/^\./, "").toLowerCase();
    if (suffix === "pdf") return "pdf";
    if (suffix === "xlsx") return "xlsx";
    if (suffix === "docx") return "docx";
    if (suffix === "png") return "png";
  }
  
  return "file";
}
