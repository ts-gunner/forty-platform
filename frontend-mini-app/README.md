
# 社区服务项目



## 微信小程序开发踩的坑

### 使用taro-ui的AtSearchBar组件，无法点击与输入

解决方案：

在`config/index.ts`中，替换以下代码

```ts
compiler: {
      type: 'webpack5',
      prebundle: {
        exclude: ['taro-ui']
      }
    },
```

墨刀