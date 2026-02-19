import dotenv from "dotenv";
import { defineConfig } from "umi";

if (process.env.UMI_ENV) {
  dotenv.config({ path: ".env" + "." + process.env.UMI_ENV, override: true });
} else {
  dotenv.config({ path: ".env", override: true });
}

export default defineConfig({
  base: process.env.UMI_APP_PREFIX_ROUTER,
  publicPath: process.env.NODE_ENV === "production" ? "." + process.env.UMI_APP_PREFIX_ROUTER : process.env.UMI_APP_PREFIX_ROUTER, // electron打包必备配置
  title: process.env.UMI_APP_PROJECT_TITLE,
  history: {
    type: (process.env.UMI_APP_HISTORY_MODE as "browser" | "hash") || "browser",
  }, // electron打包必备配置
  favicons: [`${process.env.UMI_APP_PREFIX_ROUTER}favicon.ico`],
  proxy: {
     '/ft': {
      target: process.env.UMI_APP_PROXY_BACKEND_URL || "http://127.0.0.1:18000",
    },
  },
  routes: [
    { path: "/user_manage", component: "./UserManagement" },
    { path: "/role_manage", component: "./RoleManagement" },
    { path: "/permission_manage", component: "./PermissionManagement" },
    { path: "/user_authorization", component: "./UserAuthorization" },
    { path: "/role_authorization", component: "./RoleAuthorization" },
    { path: "/blank", component: "./Blank" },
    { path: "/signin", component: "./AuthPages/SignIn", layout: false },
    {
      path: "/",
      redirect: "/user_manage",
    },

    {
      path: "*",
      layout: false,
      component: "./404",
    },
  ],
  npmClient: "yarn",
  outputPath: "build",

  codeSplitting: {
    jsStrategy: "granularChunks",
  },
  extraPostCSSPlugins: [require("@tailwindcss/postcss")],
  esbuildMinifyIIFE: true,
});
