import { X } from "lucide-react";
import React from "react";

type TagChipsInputProps = {
  value: string[];
  onChange: (next: string[]) => void;
  recommended?: string[];
  placeholder?: string;
};

const TagChipsInput: React.FC<TagChipsInputProps> = ({ value, onChange, recommended = [], placeholder = "添加或搜索标签..." }) => {
  const [inputValue, setInputValue] = React.useState("");

  const commit = () => {
    const next = inputValue.trim();
    if (!next) {
      return;
    }
    onChange(value.includes(next) ? value : [...value, next]);
    setInputValue("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
            #{tag}
            <button type="button" onClick={() => onChange(value.filter((item) => item !== tag))}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
          className="min-w-[120px] flex-1 border-none text-sm text-slate-600 outline-none"
          placeholder={placeholder}
        />
      </div>
      {recommended.length > 0 && (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          推荐：
          {recommended.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onChange(value.includes(tag) ? value : [...value, tag])}
              className="rounded-full border border-slate-200 px-2 py-0.5 text-slate-500 hover:border-slate-300"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagChipsInput;
