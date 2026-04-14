import { withGlobalLayout } from "@/components/AppLayout";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { ROUTERS } from "@/constant/menus";
import {
  getAuditList,
  updateAudit,
} from "@/services/steins-admin/auditController";
import { RootState } from "@/store";
import { handleResponse, Notify } from "@/utils/common";
import { Button, Text, View } from "@tarojs/components";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const CURRENT_PAGE = ROUTERS.audit;
const AUDIT_STATUS = {
  0: { text: "待审核", color: "bg-yellow-100 text-yellow-700" },
  1: { text: "已通过", color: "bg-green-100 text-green-700" },
  2: { text: "已驳回", color: "bg-red-100 text-red-700" },
};

function AuditPage() {
  const [records, setRecords] = useState<API.AuditAccessRecordVo[]>([]);
  const [loading, setLoading] = useState(false);
  const activeRoute = useSelector(
    (state: RootState) => state.routerModel.activeRoute,
  );
  useEffect(() => {
    if (!activeRoute) {
      return;
    }
    if (CURRENT_PAGE === activeRoute) {
      getAuditInfo();
    } else {
      // 跳转到其他页面时，注销数据
    }
  }, [activeRoute]);
  const getAuditInfo = async () => {
    setLoading(true);
    const resp = await getAuditList({
      pageNum: 1,
      pageSize: 20,
      status: 0,
      bizType: "access_crm",
    });
    handleResponse({
      resp,
      onSuccess: (data) => {
        setRecords(data.list || []);
      },
      onError: () => {
        Notify.fail(resp.msg);
      },
      onFinish: () => {
        setLoading(false);
      },
    });
  };
  const approveAccess = async (
    result: boolean,
    auditId: string,
    remark: string,
  ) => {
    const resp = await updateAudit({
      id: auditId,
      status: result ? 1 : 2,
      remark: remark,
    });
    handleResponse({
      resp,
      onSuccess: () => {
        Notify.ok("审核成功!");
        getAuditInfo();
      },
      onError: () => {
        Notify.fail("审核失败：" + resp.msg);
      },
    });
  };
  return (
    <HeaderBodyFooterLayout title="审核管理">
      <View className="min-h-screen bg-gray-50 p-4">
        {/* 审核列表 */}
        <View className="space-y-3">
          {loading ? (
            <View className="flex justify-center py-10">
              <Text>加载中...</Text>
            </View>
          ) : records.length === 0 ? (
            <View className="flex flex-col items-center justify-center py-10 text-gray-400 gap-6">
              <Text>暂无审核数据</Text>
              <Button className="bg-active text-white" onClick={getAuditInfo}>
                重新加载
              </Button>
            </View>
          ) : (
            records.map((item) => (
              <View
                key={item.id}
                className="w-full bg-white rounded-lg p-3 shadow-sm flex"
              >
                <View className="flex-1">
                  {/* 头部：申请人 + 状态 */}
                  <View className="flex gap-2 items-center mb-2">
                    <Text className="text-gray-800 font-medium">
                      {item.applyUser || "未知申请人"}
                    </Text>
                    <View
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        AUDIT_STATUS[item.status!].color
                      }`}
                    >
                      {AUDIT_STATUS[item.status!].text}
                    </View>
                  </View>

                  {/* 业务信息 */}
                  <View className="mb-2">
                    <Text className="text-sm text-gray-500">
                      业务类型：{item.bizDesc || item.bizType}
                    </Text>
                  </View>

                  {/* 备注 */}
                  {item.applyRemark && (
                    <View className="mb-2">
                      <Text className="text-sm text-gray-600 line-clamp-2">
                        申请备注：{item.applyRemark}
                      </Text>
                    </View>
                  )}

                  {/* 时间 + 操作 */}
                  <View className="flex justify-between items-center mt-1">
                    <Text className="text-xs text-gray-400">
                      {item.createTime}
                    </Text>
                  </View>
                </View>
                <View className="flex flex-col flex-shrink-0 gap-3 w-20">
                  <Button
                    onClick={() => approveAccess(true, item.id, "")}
                    className="flex items-center justify-center w-full h-10 bg-green-500 text-white text-sm font-semibold rounded-lg shadow-sm active:bg-green-600"
                  >
                    允许
                  </Button>
                  <Button
                    onClick={() => approveAccess(false, item.id, "")}
                    className="flex items-center justify-center w-full h-10 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-sm active:bg-red-600"
                  >
                    拒绝
                  </Button>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </HeaderBodyFooterLayout>
  );
}

export default withGlobalLayout(AuditPage);
