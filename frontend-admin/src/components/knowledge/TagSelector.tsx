import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

type TagSelectorProps = {
  initialOptions: string[];
  value: string[];
  onChange: (next: string[]) => void;
  allowCustom?: boolean;
  singleSelect?: boolean;
};

const TagSelector: React.FC<TagSelectorProps> = ({
  initialOptions,
  value,
  onChange,
  allowCustom = true,
  singleSelect = false,
}) => {
  const [options, setOptions] = useState<string[]>(initialOptions);
  const [customOptions, setCustomOptions] = useState<string[]>([]);
  const [isCustomInputOpen, setIsCustomInputOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    if (allowCustom) {
      setOptions(Array.from(new Set([...initialOptions, ...customOptions])));
      return;
    }
    setOptions(initialOptions);
    if (customOptions.length) {
      setCustomOptions([]);
    }
  }, [allowCustom, customOptions, initialOptions]);

  const commitCustomTag = () => {
    const next = customValue.trim();
    if (!next) {
      setIsCustomInputOpen(false);
      setCustomValue("");
      return;
    }
    if (!options.includes(next)) {
      setOptions((prev) => Array.from(new Set([...prev, next])));
    }
    if (!customOptions.includes(next)) {
      setCustomOptions((prev) => Array.from(new Set([...prev, next])));
    }
    if (!value.includes(next)) {
      onChange([...value, next]);
    }
    setIsCustomInputOpen(false);
    setCustomValue("");
  };

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const selected = value.includes(option);
        const isCustom = customOptions.includes(option);
        return (
          <div
            key={option}
            className={`group inline-flex items-center gap-1 rounded-xl border px-4 py-2 text-xs font-semibold transition ${
              selected ? "border-blue-500 bg-blue-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                if (selected) {
                  onChange(value.filter((tag) => tag !== option));
                  return;
                }
                onChange(singleSelect ? [option] : [...value, option]);
              }}
            >
              {option}
            </button>
            {isCustom && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setOptions((prev) => prev.filter((tag) => tag !== option));
                  setCustomOptions((prev) => prev.filter((tag) => tag !== option));
                  onChange(value.filter((tag) => tag !== option));
                }}
                className={`rounded-full p-0.5 transition ${selected ? "hover:bg-white/20" : "hover:bg-slate-100"}`}
                aria-label={`删除标签 ${option}`}
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      })}
      {allowCustom &&
        (isCustomInputOpen ? (
          <input
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            onBlur={commitCustomTag}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitCustomTag();
              }
            }}
            className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="输入标签"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsCustomInputOpen(true)}
            className="flex items-center gap-1 rounded-xl border border-dashed border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 hover:border-slate-300"
          >
            <Plus size={14} />
            自定义
          </button>
        ))}
    </div>
  );
};

export default TagSelector;
