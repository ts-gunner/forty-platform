import React, { useEffect } from 'react';
import { View } from "@tarojs/components";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Taro from '@tarojs/taro';
import { ROUTERS } from '../constant/menus';


export function withGlobalLayout<T>(WrappedComponent: React.ComponentType<T>) {

  return (props: T) => {
    const isAuth = useSelector((state: RootState) => state.authModel.isAuth)
    useEffect(() => {
        if (!isAuth) {
            Taro.navigateTo({url: ROUTERS.login})
        }
    }, [])

    return (
      <View style={{ height: '100%' }}>
        {/* 渲染原页面内容 */}
        <WrappedComponent {...props} />
 
      </View>
    );
  };
}