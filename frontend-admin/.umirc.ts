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
     '/steins': {
      target: process.env.UMI_APP_PROXY_BACKEND_URL,
    },
  },
  routes: [
    { path: "/", component: "./Dashboard/Home" },
    { path: "/profile", component: "./UserProfiles" },
    { path: "/calendar", component: "./Calendar" },
    { path: "/user-management", component: "./UserManagement" },
  
    { path: "/question/example", component: "./QuestionExample" },

    { path: "/blank", component: "./Blank" },
    { path: "/signin", component: "./AuthPages/SignIn", layout: false },
    {
      path: "/",
      redirect: "/",
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
