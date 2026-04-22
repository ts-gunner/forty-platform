
import { ArrowDownIcon, BoxIcon, GroupIcon } from "lucide-react";
import Badge from "../ui/badge/Badge";
import { getBasicCount } from "@/services/steins-admin/analysisController";
import { useEffect, useState } from "react";
import { handleResponse, Notify } from "@/utils/common";

export default function EcommerceMetrics() {
  const [basicCount, setBasicCount]=useState<API.BasicIndicator>({})
  useEffect(() => {
getData()
  }, [])
  const getData = async () => {

    const resp = await getBasicCount()
    handleResponse({
      resp,
      onSuccess:(data) => {
        setBasicCount(data)
      },
      onError: ()=> {
        Notify.fail(resp.msg || "")
      }
    })
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              业务员总数
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {basicCount?.businessCount}
            </h4>
          </div>
          {/* <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge> */}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              客户数量
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {basicCount?.customerCount}
            </h4>
          </div>

          {/* <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge> */}
        </div>
      </div>
    </div>
  );
}
