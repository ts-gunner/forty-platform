import { extend } from "./api";

const request = extend({
  prefix: "/ft",
  timeout: 300000,
  errorHandler: (error) => {
    console.log(error)
  },
});
// // 请求拦截器
// request.interceptors.request.use((url, options) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     options.headers = {
//       ...options.headers,
//       Authorization: token,
//     };
//   }
//   return { url, options };
// });

// // 响应拦截器
// request.interceptors.response.use(async (response) => {
  

//   return response;
// });

export default request;