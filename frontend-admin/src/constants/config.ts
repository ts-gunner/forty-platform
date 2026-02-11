
export default {

    title: process.env.UMI_APP_PROJECT_TITLE,
    description: `
    以 “智脑” 为核心技术内核，构建覆盖企业全业务场景的 AI 驱动管理体系。
    深度整合数据洞察、流程自动化、决策辅助三大核心能力，通过精准的算法模型解析业务数据规律，
    实时联动人、事、物管理节点，实现从 “被动响应” 到 “主动预判” 的管理升级
    `
}

// 登录路由
export const SIGN_IN = "/signin"

export const ICONS_MAP = {
    navbarLogo: `${process.env.UMI_APP_PREFIX_ROUTER}static/navbar_logo.png`,
    navbarLogoDark: `${process.env.UMI_APP_PREFIX_ROUTER}static/navbar_logo_dark.png`,
    grid_01: `${process.env.UMI_APP_PREFIX_ROUTER}static/shape/grid-01.svg`,
    logo: `${process.env.UMI_APP_PREFIX_ROUTER}favicon.ico`,
    app: {
        feishu: `${process.env.UMI_APP_PREFIX_ROUTER}static/app/feishu.svg`,
        phone: `${process.env.UMI_APP_PREFIX_ROUTER}static/app/phone.svg`,
    },
    
}
