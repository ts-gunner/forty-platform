import React from 'react';
import { View, Text, Image, Button } from '@tarojs/components';

interface EmptyStateProps {
  /** 提示图标，支持 URL 或本地资源 */
  icon?: string;
  /** 主标题文字 */
  title?: string;
  /** 副标题/描述文字 */
  description?: string;
  /** 按钮文字 */
  btnText?: string;
  /** 按钮点击回调 */
  onBtnClick?: () => void;
  /** 自定义容器样式 */
  className?: string;
  /** 是否垂直居中，默认 true */
  centered?: boolean;
}

const EmptyComponent: React.FC<EmptyStateProps> = ({
  icon = '', 
  title = '暂无数据',
  description = '这里空空如也，去别处看看吧',
  btnText,
  onBtnClick,
  className = '',
  centered = true
}) => {
  return (
    <View className={`flex flex-col items-center justify-center p-8 ${centered ? 'min-h-[60vh]' : ''} ${className}`}>
      {/* 图标部分 */}
      <Image 
        src={icon} 
        className="w-40 h-40 mb-4 opacity-80"
        mode="aspectFit"
      />

      {/* 文字部分 */}
      <View className="flex flex-col items-center mb-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </Text>
        <Text className="text-sm text-gray-400 text-center px-4">
          {description}
        </Text>
      </View>

      {/* 底部操作按钮 */}
      {btnText && (
        <Button 
          onClick={onBtnClick}
          className="bg-active text-white rounded-full px-10 py-0 h-10 flex items-center justify-center border-none active:opacity-80 transition-opacity"
        >
          <Text className="text-sm">{btnText}</Text>
        </Button>
      )}
    </View>
  );
};

export default EmptyComponent;