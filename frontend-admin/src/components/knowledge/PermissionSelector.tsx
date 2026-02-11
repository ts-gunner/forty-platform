type PermissionOption<T extends string> = {
  key: T;
  title: string;
  description: string;
};

type PermissionSelectorProps<T extends string> = {
  value: T;
  onChange: (next: T) => void;
  options: PermissionOption<T>[];
};

const PermissionSelector = <T extends string>({ value, onChange, options }: PermissionSelectorProps<T>) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {options.map((item) => {
        const selected = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={`rounded-2xl border px-4 py-4 text-left transition ${
              selected ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-800">{item.title}</div>
              <span className={`h-4 w-4 rounded-full border ${selected ? "border-blue-500 bg-blue-500" : "border-slate-300"}`} />
            </div>
            <p className="mt-2 text-xs text-slate-500">{item.description}</p>
          </button>
        );
      })}
    </div>
  );
};

export default PermissionSelector;
