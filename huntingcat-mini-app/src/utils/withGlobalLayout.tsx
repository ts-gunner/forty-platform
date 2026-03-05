import React from 'react';
import { View } from "@tarojs/components";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "../store";
import AddCustomerModal from "../components/customer/AddCustomerModal";

export function withGlobalLayout<T>(WrappedComponent: React.ComponentType<T>) {
  return (props: T) => {
    const dispatch = useDispatch<Dispatch>();
    const addCustomerModalOpen = useSelector(
      (state: RootState) => state.crmModel.addCustomerModalOpen,
    );

    return (
      <View style={{ height: '100%' }}>
        {/* 渲染原页面内容 */}
        <WrappedComponent {...props} />
        
        {/* 全局注入弹窗 */}
        <AddCustomerModal
          modalOpen={addCustomerModalOpen}
          handleModalOpen={(open) => dispatch.crmModel.setAddCustomerModalOpen(open)}
        />
      </View>
    );
  };
}