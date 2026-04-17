import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from "react";
import { AtIcon } from "taro-ui";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { withGlobalLayout } from "@/components/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@/store";
import { handleCrmValueByField } from "@/utils/crm";
import ValueBoxGenerator from "@/components/crm/ValueBoxGenerator";
import "./index.scss"
import { updateEntityValue } from "@/services/steins-admin/crmEntityValueController";
import { addCustomerFavorite, checkCustomerFavorite, removeCustomerFavorite } from "@/services/steins-admin/crmCustomerFavoriteController";
import { handleResponse, Notify } from "@/utils/common";
import { ROUTERS } from "@/constant/menus";
const CURRENT_PAGE = ROUTERS.customerDetail;
function CustomerDetailPage() {
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const dispatch = useDispatch<Dispatch>()
  const selectedEntityValue = useSelector((state: RootState) => state.crmModel.selectedEntityValue)
  const tableFields = useSelector((state: RootState) => state.crmModel.tableFields)
  const [valueObject, setValueObject] = useState<any>(JSON.parse(selectedEntityValue.values))
  
  // 检查收藏状态
  useEffect(() => {
    setValueObject(JSON.parse(selectedEntityValue.values))
    checkFavoriteStatus();
  }, [selectedEntityValue])
  
  // 检查收藏状态
  const checkFavoriteStatus = async () => {
    if (selectedEntityValue.id && selectedEntityValue.entityId) {
      const resp = await checkCustomerFavorite({
        entityId: selectedEntityValue.entityId,
        valueId: selectedEntityValue.id,
      });
      handleResponse({
        resp,
        onSuccess: (data) => {
          setIsFavorite(data);
        },
        onError: () => {
          console.error("检查收藏状态失败");
        },
      });
    }
  };
  return (
    <HeaderBodyFooterLayout
      FooterRender={
        isEdit ? (
          <View className="w-full p-4 bg-white/80 backdrop-blur-md flex gap-4">
            <View
              onClick={() => setIsEdit(false)}
              className="flex-1 py-3 bg-white border border-gray-200 rounded-full text-center text-sm font-bold text-gray-600 active:bg-gray-100">
              取消
            </View>
            <View
              className="bg-active flex-1 py-3 rounded-full text-center text-sm font-bold text-white shadow-lg active:opacity-80"
              onClick={async () => {
                Notify.loading("更新中...")
                const resp = await updateEntityValue({
                  id: selectedEntityValue.id,
                  customerName: valueObject?.["customer_name"],
                  remark: valueObject?.["remark"],
                  values: JSON.stringify(valueObject)
                })
                handleResponse({
                  resp,
                  onSuccess: () => {
                    Notify.ok("更新成功")
                    setIsEdit(false)
                  },
                  onError: () => {
                    Notify.fail("更新失败：" + resp.msg)
                  }
                })
              }}
            >
              保存
            </View>
          </View>
        ) : (
          <View className="w-full p-4 bg-white/80 backdrop-blur-md flex gap-4">
            <View
              onClick={() => setIsEdit(true)}
              className="flex-1 py-3 bg-white border border-gray-200 rounded-full text-center text-sm font-bold text-gray-600 active:bg-gray-100">
              编辑信息
            </View>
            <View
              className="bg-active flex-1 py-3 rounded-full text-center text-sm font-bold text-white shadow-lg active:opacity-80"
              onClick={() =>
                Taro.makePhoneCall({ phoneNumber: valueObject["contract_phone"] })
              }
            >
              立即联系
            </View>
          </View>
        )

      }
    >
      <>
        {/* 顶部 Header：公司大标题 */}
        <View className="p-6">
          <View className="flex justify-between items-center">
            <View>
              {
                isEdit ? <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "customer_name")} valueObject={valueObject} setValueObject={setValueObject} /> : (
                  <Text className="text-2xl font-bold text-gray-800">
                    {valueObject["customer_name"]}
                  </Text>
                )
              }
            </View>
            <View className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center shadow-sm" onClick={async () => {
              if (selectedEntityValue.id && selectedEntityValue.entityId) {
                if (isFavorite) {
                  // 取消收藏
                  const resp = await removeCustomerFavorite({
                    entityId: selectedEntityValue.entityId,
                    valueId: selectedEntityValue.id,
                  });
                  handleResponse({
                    resp,
                    onSuccess: () => {
                      setIsFavorite(false);
                      Notify.ok("已取消收藏");
                    },
                    onError: () => {
                      Notify.fail("取消收藏失败");
                    },
                  });
                } else {
                  // 添加收藏
                  const resp = await addCustomerFavorite({
                    entityId: selectedEntityValue.entityId,
                    valueId: selectedEntityValue.id,
                  });
                  handleResponse({
                    resp,
                    onSuccess: () => {
                      setIsFavorite(true);
                    },
                    onError: () => {
                      Notify.fail("收藏失败");
                    },
                  });
                }
              }
            }}>
              <AtIcon value={isFavorite ? "star-2" : "star"} size="24" className="text-yellow-500" />
            </View>
          </View>
        </View>

        <View className="px-4 space-y-4">
          {
            tableFields.filter(it => it.fieldKey !== "customer_name").map(field => (
              <InfoRow isEdit={isEdit} field={field} valueObject={valueObject} setValueObject={setValueObject} />
            ))
          }
          {/* Section: 基本信息 */}
          {/* <DetailSection title="基本信息" iconColor="bg-amber-400">
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "contract_name")} valueObject={valueObject} setValueObject={setValueObject} />
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "contract_phone")} valueObject={valueObject} setValueObject={setValueObject} />
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "job_title")} valueObject={valueObject} setValueObject={setValueObject} />
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "origin_addr")} valueObject={valueObject} setValueObject={setValueObject} />
          </DetailSection> */}

          {/* Section: 项目基本信息 */}
          {/* <DetailSection title="项目基本信息" iconColor="bg-blue-400">
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "project_name")} valueObject={valueObject} setValueObject={setValueObject} />
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "region")} valueObject={valueObject} setValueObject={setValueObject} />
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "detail_addr")} valueObject={valueObject} setValueObject={setValueObject} />
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "cooperate_type")} valueObject={valueObject} setValueObject={setValueObject} />
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "customer_type")} valueObject={valueObject} setValueObject={setValueObject} />
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "customer_category")} valueObject={valueObject} setValueObject={setValueObject} />
            <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "customer_source")} valueObject={valueObject} setValueObject={setValueObject} />
          </DetailSection> */}

          {/* Section: 备注 */}
          {/* <DetailSection title={dispatch.crmModel.getFieldName("remark")} iconColor="bg-green-400">
            <View className="p-3 bg-gray-50/50 rounded-lg">
              {
                isEdit ? <InfoRow isEdit={isEdit} field={tableFields.find(it => it.fieldKey === "remark")} valueObject={valueObject} setValueObject={setValueObject} /> : (
                  <Text className="text-sm text-gray-600 leading-relaxed">
                    {valueObject["remark"] || "暂无备注信息..."}
                  </Text>
                )
              }

            </View>
          </DetailSection> */}
        </View>
      </>
    </HeaderBodyFooterLayout>
  );
}

/** 详情区块容器 */
const DetailSection = ({ title, iconColor, children }) => (
  <View className="bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-sm border border-gray-100">
    <View className="flex items-center gap-2 mb-4">
      <View className={`w-1 h-4 ${iconColor} rounded-full`} />
      <Text className="font-bold text-gray-800 text-sm">{title}</Text>
    </View>
    <View>{children}</View>
  </View>
);


const InfoRow: React.FC<{
  isEdit: boolean
  field: API.CrmEntityFieldVo
  valueObject: any
  setValueObject: (obj: any) => void
  onClick?: () => void
}> = ({ isEdit, field, valueObject, onClick, setValueObject }) => {
  return isEdit ? (
    <View>
      <ValueBoxGenerator field={field} value={valueObject[field.fieldKey]} onChange={(val) => {
        setValueObject((prev: any) => ({
          ...prev,
          [field.fieldKey]: val
        }))
      }} />
    </View>
  ) : (
    <View
      onClick={onClick}
      className={`flex py-3 border-b border-gray-100/50`}
    >
      <Text className="w-24 text-sm text-gray-400 flex-shrink-0">{field.fieldName}</Text>
      <View className="flex-1 flex items-center justify-end">
        <Text className={`text-sm font-medium text-right`}>
          {handleCrmValueByField(field, valueObject) || "-"}
        </Text>
      </View>
    </View>
  )
}

export default withGlobalLayout(CustomerDetailPage);
