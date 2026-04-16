
export default {

    title: process.env.UMI_APP_PROJECT_TITLE,
   
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
