import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Notify } from "@/utils/common";
import CoverUploader from "./CoverUploader";
import PermissionSelector from "./PermissionSelector";
import TagSelector from "./TagSelector";
import { listCategories } from "@/services/steins-admin/aigcAgentCategoryController";

type CreateKnowledgeModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: {
    name: string;
    identifier?: string;
    description: string;
    tags: string[];
    visibility:"commercial";
    coverUrl?: string;
    categoryId?: string;
    previewImgId?: string;
  }) => Promise<boolean> | boolean;
  onUpdate?: (values: {
    kbId: string;
    name: string;
    description: string;
    previewImgId?: string;
  }) => Promise<boolean> | boolean;
  mode?: "create" | "edit";
  initialValues?: {
    kbId: string;
    name: string;
    description?: string;
    previewImgId?: string;
    coverUrl?: string;
  } | null;
};

type VisibilityType ="commercial";

type FormState = {
  name: string;
  identifier: string;
  description: string;
  selectedTags: string[];
  visibility: VisibilityType;
  coverUrl?: string;
  previewImgId?: string;
};

const initialFormState: FormState = {
  name: "",
  identifier: "",
  description: "",
  selectedTags: [],
  visibility: "commercial",
  coverUrl: undefined,
  previewImgId: undefined,
};

const KnowledgeCreateModal: React.FC<CreateKnowledgeModalProps> = ({
  open,
  onClose,
  onCreate,
  onUpdate,
  mode = "create",
  initialValues = null,
}) => {
  const [form, setForm] = useState<FormState>(initialFormState);
  // const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  // const [categoryIdMap, setCategoryIdMap] = useState<Map<string, string>>(new Map());
  const isEdit = mode === "edit";

  // 更新表单字段的辅助函数
  const updateForm = (updates: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    if (isEdit && initialValues) {
      setForm({
        ...initialFormState,
        name: initialValues.name || "",
        description: initialValues.description || "",
        coverUrl: initialValues.coverUrl,
        previewImgId: initialValues.previewImgId,
      });
      return;
    }
    setForm(initialFormState);
    // const fetchCategories = async () => {
    //   const resp = (await listCategories()) as any;
    //   const rawList: any[] = Array.isArray(resp?.data)
    //     ? resp.data
    //     : Array.isArray(resp?.data?.list)
    //       ? resp.data.list
    //       : [];
    //   const options = rawList
    //     .map((item: any) => {
    //       const name = item?.categoryName || item?.name;
    //       const id = item?.categoryId ?? item?.id;
    //       return name ? { name: String(name), id: id ? String(id) : "" } : null;
    //     })
    //     .filter((item: { name: string; id: string } | null): item is { name: string; id: string } => Boolean(item));
    //   const nameList = options.map((item) => item.name);
    //   const idMap = new Map<string, string>(options.map((item) => [item.name, item.id]));
    //   setCategoryIdMap(idMap);
    //   setCategoryOptions(nameList);
    // };
    // fetchCategories();
  }, [open, isEdit, initialValues]);

  //   useEffect(() => {
  //   if (open && !isEdit && categoryOptions.length === 0) {
  //     const fetchCategories = async () => {
  //       const resp = (await listCategories()) as any;
  //       const rawList: any[] = Array.isArray(resp?.data)
  //         ? resp.data
  //         : Array.isArray(resp?.data?.list)
  //           ? resp.data.list
  //           : [];
  //       const options = rawList
  //         .map((item: any) => {
  //           const name = item?.categoryName || item?.name;
  //           const id = item?.categoryId ?? item?.id;
  //           return name ? { name: String(name), id: id ? String(id) : "" } : null;
  //         })
  //         .filter((item: { name: string; id: string } | null): item is { name: string; id: string } => Boolean(item));
  //       const nameList = options.map((item) => item.name);
  //       const idMap = new Map<string, string>(options.map((item) => [item.name, item.id]));
  //       setCategoryIdMap(idMap);
  //       setCategoryOptions(nameList);
  //     };
  //     fetchCategories();
  //   }
  // }, [open, categoryOptions.length, isEdit]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isEdit) {
      if (!initialValues?.kbId) {
        Notify.fail("缺少知识库ID");
        return;
      }
      const invalidPattern = /[a-zA-Z0-9_]/;
        if (invalidPattern.test(form.name.trim())) {
          Notify.fail("名称不能包含英文、数字或下划线");
          return;
        }
      const result = await onUpdate?.({
        kbId: initialValues.kbId,
        name: form.name.trim(),
        description: form.description.trim(),
        previewImgId: form.previewImgId,
      });
      if (result !== false) {
        Notify.ok("更新成功");
      }
      return;
    }
    if (form.visibility === "commercial" && form.identifier.trim().length === 0) {
      Notify.fail("请填写知识库标识");
      return;
    }
    // const selectedCategoryName = form.selectedTags[0];
    // const selectedCategoryId = selectedCategoryName ? categoryIdMap.get(selectedCategoryName) : undefined;
    // if (!selectedCategoryId) {
    //   Notify.fail("请选择分类标签");
    //   return;
    // }
    const result = await onCreate({
      name: form.name.trim(),
      identifier: form.identifier.trim() || undefined,
      description: form.description.trim(),
      tags: form.selectedTags,
      visibility: form.visibility,
      coverUrl: form.coverUrl,
      categoryId: '1',
      previewImgId: form.previewImgId,
    });
    if (result !== false) {
      Notify.ok("创建成功");
    }
  };

  const isInvalid = form.name.trim().length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
      <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-8 py-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{isEdit ? "更新知识库" : "创建新知识库"}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isEdit ? "更新知识库名称、描述与封面" : "请填写以下信息以初始化您的档案数据库空间"}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[90vh] overflow-y-auto space-y-6 px-8 py-6">
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">1</span>
              基本信息
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    知识库名称 <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(event) => updateForm({ name: event.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="例如：深海生态系统研究"
                  />
                </div>
                {!isEdit && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      知识库标识 {form.visibility === "commercial" && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      value={form.identifier}
                      onChange={(event) => updateForm({ identifier: event.target.value })}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="例如：kb_commercial_001"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">描述</label>
                  <textarea
                    value={form.description}
                    onChange={(event) => updateForm({ description: event.target.value })}
                    className="h-28 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="简要描述该知识库的主要内容、用途及目标受众..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">封面图片</label>
                <CoverUploader
                  initialUrl={form.coverUrl}
                  onFileChange={(_, uploadedUrl, resourceId) => {
                    updateForm({
                      coverUrl: uploadedUrl,
                      previewImgId: resourceId,
                    });
                  }}
                />
              </div>
            </div>
          </section>

          {/* <div className="h-px bg-slate-100" /> */}

          {/* {!isEdit &&
               (
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">2</span>
                分类标签
              </div>
              <TagSelector
                initialOptions={categoryOptions}
                value={form.selectedTags}
                onChange={(tags) => updateForm({ selectedTags: tags })}
                allowCustom={false}
                singleSelect
              />
            </section>
          )          
          } */}

          <div className="h-px bg-slate-100" />

          {!isEdit && (
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-blue-600">2</span>
                隐私与权限
              </div>
              <PermissionSelector
                value={form.visibility}
                onChange={(visibility) => updateForm({ visibility })}
                options={[
                  {
                    key: "commercial",
                    title: "商业/公开",
                    description: "全校公开或对外发布，需审核后方可上线。",
                  },
                ]}
              />
            </section>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button type="button" onClick={onClose} className="rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
              取消
            </button>
            <button
              type="submit"
              disabled={isInvalid}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isEdit ? "保存修改 →" : "创建知识库 →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KnowledgeCreateModal;
