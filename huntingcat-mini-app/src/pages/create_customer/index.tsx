import {
  COOPERATION_TYPE_LIST,
  CUSTOMER_CATEGORY_LIST,
  CUSTOMER_SOURCE_LIST,
  CUSTOMER_TYPE_LIST,
} from "../../constant/mock";
import { THEME_CONFIG } from "../../constant/global";
import {
  Button,
  Input,
  Picker,
  ScrollView,
  Text,
  View,
} from "@tarojs/components";
import { useState, useCallback } from "react";
import {
  AtIcon,
  AtInput,
  AtList,
  AtListItem,
  AtModal,
  AtModalAction,
  AtModalContent,
  AtTextarea,
} from "taro-ui";
import "./index.scss";
import { useNavbar } from "../../context/NavbarContext";
import Taro from "@tarojs/taro";
import HeaderBodyFooterLayout from "../../components/layout/HeaderFooterLayout";

export default function CreateCustomerPage() {
  const { navBarHeight, headerHeight } = useNavbar();
  // 基本信息 State
  const [baseInfo, setBaseInfo] = useState({
    companyName: "",
    contractName: "",
    phoneNumber: "",
    jobTitle: "",
    originAddr: "",
  });

  // 项目基本信息 State
  const [projectInfo, setProjectInfo] = useState({
    projectName: "",
    region: [],
    detailAddr: "",
    cooperationType: "",
    customerType: "",
    customerSource: "",
    customerCategory: "",
  });

  // 备注 State
  const [remark, setRemark] = useState("");

  // --- 更新函数 (使用 useCallback 优化性能，减少重绘导致的光标丢失) ---

  const updateBaseInfo = useCallback(
    (field: keyof typeof baseInfo, value: any) => {
      setBaseInfo((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const updateProjectInfo = useCallback(
    (field: keyof typeof projectInfo, value: any) => {
      setProjectInfo((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // 提交逻辑：组合原本的数据结构
  const handleSubmit = () => {
    const finalData = {
      remark,
      baseInfo,
      projectInfo,
    };
    console.log("提交的数据:", finalData);
    // 这里执行你的 API 请求
  };

  return (
    <HeaderBodyFooterLayout
      FooterRender={
        <View className="w-full flex items-center">
          <Button className="text-gray-500 bg-transparent border-none flex-1">
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="font-bold bg-transparent border-none flex-1"
            style={{ color: THEME_CONFIG.active }}
          >
            确认提交
          </Button>
        </View>
      }
    >
      <>
        {/* 头部：保持原本的 UI */}
        <View className="flex justify-between items-center p-4 border-b border-gray-100">
          <Text className="text-lg font-bold text-gray-800">创建客户</Text>
        </View>

        <View className="space-y-6 px-4">
          {/* Section: 基本信息 */}
          <View>
            <View className="flex items-center gap-2 mb-3">
              <View className="w-1 h-4 bg-amber-400 rounded-full" />
              <Text className="font-bold text-gray-700">基本信息</Text>
            </View>
            <View className="bg-white rounded-lg overflow-hidden border border-gray-100">
              <AtInput
                cursor={-1}
                name="companyName"
                title="公司名称"
                placeholder="请输入"
                value={baseInfo.companyName}
                onChange={(v) => updateBaseInfo("companyName", v)}
              />
              <AtInput
                cursor={-1}
                name="contractName"
                title="联系人"
                placeholder="请输入"
                value={baseInfo.contractName}
                onChange={(v) => updateBaseInfo("contractName", v)}
              />
              <AtInput
                cursor={-1}
                name="phoneNumber"
                title="手机号"
                type="phone"
                placeholder="请输入"
                value={baseInfo.phoneNumber}
                onChange={(v) => updateBaseInfo("phoneNumber", v)}
              />
              <AtInput
                cursor={-1}
                name="jobTitle"
                title="职位"
                placeholder="请输入"
                value={baseInfo.jobTitle}
                onChange={(v) => updateBaseInfo("jobTitle", v)}
              />
              <AtInput
                cursor={-1}
                name="originAddr"
                title="籍贯"
                placeholder="请输入"
                value={baseInfo.originAddr}
                onChange={(v) => updateBaseInfo("originAddr", v)}
                border={false}
              />
            </View>
          </View>

          {/* Section: 项目基本信息 */}
          <View>
            <View className="flex items-center gap-2 mb-3">
              <View className="w-1 h-4 bg-amber-400 rounded-full" />
              <Text className="font-bold text-gray-700">项目基本信息</Text>
            </View>
            <View className="bg-white rounded-lg overflow-hidden border border-gray-100">
              <AtInput
                cursor={-1}
                name="projectName"
                title="主营项目"
                placeholder="请输入"
                value={projectInfo.projectName}
                onChange={(v) => updateProjectInfo("projectName", v)}
              />
              <Picker
                mode="region"
                onChange={(e) => updateProjectInfo("region", e.detail.value)}
              >
                <AtListItem
                  title="区域地址"
                  note={projectInfo.region.join(" / ") || "请选择"}
                  arrow="right"
                />
              </Picker>

              <View className="p-[24px] bg-white border-b border-gray-50">
                <View className="text-[1.1em] mb-2">详细地址</View>
                <AtTextarea
                  className="bg-gray-50 rounded-md p-2 border-none"
                  value={projectInfo.detailAddr}
                  onChange={(v) => updateProjectInfo("detailAddr", v)}
                  maxLength={100}
                  placeholder="请输入街道、门牌号等详细信息"
                  height={120} // 可以根据需要调整高度
                  count={false} // 隐藏计数器保持简洁
                />
              </View>
              <AtList hasBorder={false}>
                <Picker
                  mode="selector"
                  range={COOPERATION_TYPE_LIST}
                  onChange={(e) =>
                    updateProjectInfo(
                      "cooperationType",
                      COOPERATION_TYPE_LIST[e.detail.value],
                    )
                  }
                >
                  <AtListItem
                    title="合作类型"
                    extraText={projectInfo.cooperationType || "请选择"}
                    arrow="right"
                  />
                </Picker>
                <Picker
                  mode="selector"
                  range={CUSTOMER_TYPE_LIST}
                  onChange={(e) =>
                    updateProjectInfo(
                      "customerType",
                      CUSTOMER_TYPE_LIST[e.detail.value],
                    )
                  }
                >
                  <AtListItem
                    title="客户类型"
                    extraText={projectInfo.customerType || "请选择"}
                    arrow="right"
                  />
                </Picker>
                <Picker
                  mode="selector"
                  range={CUSTOMER_CATEGORY_LIST}
                  onChange={(e) =>
                    updateProjectInfo(
                      "customerCategory",
                      CUSTOMER_CATEGORY_LIST[e.detail.value],
                    )
                  }
                >
                  <AtListItem
                    title="客户分类"
                    extraText={projectInfo.customerCategory || "请选择"}
                    arrow="right"
                  />
                </Picker>
                <Picker
                  mode="selector"
                  range={CUSTOMER_SOURCE_LIST}
                  onChange={(e) =>
                    updateProjectInfo(
                      "customerSource",
                      CUSTOMER_SOURCE_LIST[e.detail.value],
                    )
                  }
                >
                  <AtListItem
                    title="客户来源"
                    extraText={projectInfo.customerSource || "请选择"}
                    arrow="right"
                  />
                </Picker>
              </AtList>
            </View>
          </View>

          {/* Section: 备注 */}
          <View className="pb-4">
            <View className="flex items-center gap-2 mb-3">
              <View className="w-1 h-4 bg-amber-400 rounded-full" />
              <Text className="font-bold text-gray-700">备注</Text>
            </View>
            <AtTextarea
              className="bg-gray-50 border-none rounded-md"
              value={remark}
              onChange={(v) => setRemark(v)}
              maxLength={200}
              placeholder="请输入备注"
            />
          </View>
        </View>
      </>
    </HeaderBodyFooterLayout>
  );
}
