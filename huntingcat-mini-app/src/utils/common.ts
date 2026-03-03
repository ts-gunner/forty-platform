
import { clsx, type ClassValue } from "clsx";
export function cn(...inputs: ClassValue[]): string {
  // 第一步：扁平化输入并过滤空值（替代 clsx 功能）
  const flattenInputs = (values: ClassValue[]): string[] => {
    return values.reduce<string[]>((acc, val) => {
      if (val == null || val === false) return acc;
      if (typeof val === 'string' || typeof val === 'number') {
        acc.push(val.toString().trim());
      } else if (Array.isArray(val)) {
        acc.push(...flattenInputs(val));
      }
      return acc;
    }, []);
  };

  const rawClasses = flattenInputs(inputs).filter(Boolean);
  
  // 第二步：合并并去重 tailwind 样式（简化版 twMerge 功能）
  const classMap = new Map<string, string>();
  rawClasses.forEach(className => {
    className.split(' ').forEach(cls => {
      if (!cls) return;
      // 匹配 tailwind 样式前缀（如 bg-、text-、w-、h- 等）
      const prefixMatch = cls.match(/^([a-zA-Z-]+)-/);
      if (prefixMatch) {
        const prefix = prefixMatch[1];
        // 移除同前缀的旧样式，保留最后一个
        Array.from(classMap.keys()).forEach(key => {
          if (key.startsWith(`${prefix}-`)) {
            classMap.delete(key);
          }
        });
      }
      classMap.set(cls, cls);
    });
  });

  return Array.from(classMap.values()).join(' ');
}