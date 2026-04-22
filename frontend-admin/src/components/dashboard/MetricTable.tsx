import { getCustomerCountByUser } from "@/services/steins-admin/analysisController";
import { handleResponse, Notify } from "@/utils/common";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

const MetricTable = () => {
  const [tableData, setTableData] = useState<API.CustomerIndicator[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const resp = await getCustomerCountByUser();
    handleResponse({
      resp,
      onSuccess: (data) => setTableData(data),
      onError: () => Notify.fail(resp.msg || "获取数据失败"),
    });
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ">
      {/* 简洁标题栏 */}
      <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">
          业务员客户量统计
        </h3>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div className=" overflow-y-auto custom-scrollbar">
        <table className="w-full border-collapse ">
          <thead className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm shadow-sm">
            <tr className="bg-gray-50/50 dark:bg-white/[0.02] text-[11px] uppercase tracking-[0.15em] text-gray-400 font-bold">
              <th className="px-6 py-4 text-center font-semibold">业务员名称</th>
              <th className="px-6 py-4 text-center font-semibold">具体数值</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.map((item, index) => {
              return (
                <motion.tr
                  key={item.userName || index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors"
                >
                  <td className="px-6 py-4 flex justify-center items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {item.userName}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col items-center">
                      <span className="text-md font-mono font-bold text-gray-800 dark:text-white/90">
                        {(item?.customerCount || 0).toLocaleString()}
                      </span>
                  
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricTable;