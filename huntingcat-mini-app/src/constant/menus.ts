



export const ROUTERS = {
    customer: "/pages/customer/index",
    all_customer: "/pages/all_customer/index",
    collection: "/pages/collection/index",
    mine: "/pages/user/index",
    settings: "/pages/settings/index"
}

export default [
     {
        text: "我的客户",
        iconPath: "/static/customer.png",
        selectedIconPath: "/static/customer_active.png",
        pagePath: ROUTERS.customer
    },
    {
        text: "全部客户",
        iconPath: "/static/all_customer.png",
        selectedIconPath: "/static/all_customer_active.png",
        pagePath: ROUTERS.all_customer
    },
     {
        text: "收藏",
        iconPath: "/static/collection.png",
        selectedIconPath: "/static/collection_active.png",
        pagePath: ROUTERS.collection
    },
  
    {
        text: "我的",
        iconPath: "/static/user.png",
        selectedIconPath: "/static/user_active.png",
        pagePath: ROUTERS.mine
    },
]