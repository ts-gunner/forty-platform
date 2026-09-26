import pcaData from 'china-division/dist/pca-code.json';
import provinces from 'china-division/dist/provinces.json';
import cities from 'china-division/dist/cities.json';
import areas from 'china-division/dist/areas.json';
interface DataNode {
  code: string;
  name: string;
  children?: DataNode[];
}
interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
}
const formatOptions = (data: DataNode[]): CascaderOption[] => {
  return data.map(item => ({
    value: item.code,
    label: item.name,
    children: item.children ? formatOptions(item.children) : undefined,
  }));
};

export const findSelectedNodes = (valueStr: string, sep: string=" / ") => {
  if (!valueStr) return "";

  // 1. 分割字符串
  const [pCode, cCode, aCode] = valueStr.split(',');

  // 2. 分别在三个平铺数组中查找（非递归，直接筛选）
  const province = provinces.find(p => p.code === pCode);
  const city = cities.find(c => c.code === cCode);
  const area = areas.find(a => a.code === aCode);

  // 3. 提取名称并过滤掉未找到的情况
  const names = [
    province?.name,
    city?.name,
    area?.name
  ].filter(Boolean); // 过滤掉 undefined

  // 4. 返回拼接后的字符串
  return names.join(sep);
};


// 获取省市辖区的options选择数据
export const regionOptions = formatOptions(pcaData);