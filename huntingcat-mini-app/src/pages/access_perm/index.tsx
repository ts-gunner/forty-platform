import { View, Input, Text, Button, Textarea } from "@tarojs/components";
import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import HeaderBodyFooterLayout from "@/components/layout/HeaderFooterLayout";
import { useDispatch } from "react-redux";
import { Dispatch } from "@/store";

export default function AccessPermissionPage() {
    const dispatch = useDispatch<Dispatch>()
  // 表单状态管理
  const [auditCode, setAuditCode] = useState(""); // 审核随机码
  const [applicant, setApplicant] = useState(""); // 申请人
  const [remark, setRemark] = useState(""); // 备注

  // 生成随机审核码（6位，字母+数字）
  const generateRandomCode = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // 页面加载时生成审核码
  useEffect(() => {
    const code = generateRandomCode();
    setAuditCode(code);
  }, []);

  // 提交审核申请
  const handleSubmit = () => {
    // 表单校验
    if (!applicant.trim()) {
      Taro.showToast({
        title: "请填写申请人",
        icon: "none",
      });
      return;
    }

    // 构造提交数据
    const submitData = {
      auditCode,
      name: applicant,
      remark,
    };

    dispatch.authModel.applyAccessPermission(submitData)

    setApplicant('')
    setRemark('')
  };

  return (
    <HeaderBodyFooterLayout>
      {/* 页面标题 */}
      <View className="text-lg font-bold text-gray-800 mb-6 text-center">
        提交审核申请
      </View>

      {/* 表单容器 */}
      <View className="bg-white rounded-lg p-4 shadow-sm space-y-4">
        {/* 审核随机码 - 不可修改 */}
        <View className="space-y-1">
          <View className="text-sm text-gray-600">审核申请码</View>
          <Input
            value={auditCode}
            disabled
            className="h-10 px-3 bg-gray-100 rounded border border-gray-200 text-gray-700"
            placeholder="自动生成"
          />
        </View>

        {/* 申请人输入框 */}
        <View className="space-y-1">
          <View className="text-sm text-gray-600">
            申请人 <Text className="text-red-500">*</Text>
          </View>
          <Input
            value={applicant}
            onInput={(e) => setApplicant(e.detail.value)}
            className="h-10 px-3 rounded border border-gray-300 focus:border-active"
            placeholder="请输入申请人姓名"
          />
        </View>

        {/* 备注输入框 */}
        <View className="space-y-1">
          <View className="text-sm text-gray-600">备注</View>
          <Textarea
            value={remark}
            onInput={(e) => setRemark(e.detail.value)}
            className="h-24 p-3 rounded border border-gray-300 resize-none"
            placeholder="请输入备注信息（选填）"
          />
        </View>

        {/* 提交按钮 */}
        <Button
          onClick={handleSubmit}
          className="w-full h-11 bg-active text-white rounded-lg font-medium mt-2"
        >
          提交申请
        </Button>
      </View>
    </HeaderBodyFooterLayout>
  );
}
