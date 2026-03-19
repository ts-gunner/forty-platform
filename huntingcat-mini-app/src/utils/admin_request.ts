import { API_PREFIX_URL } from "@/constant/global";
import { extend } from "./api";

const request = extend({
  prefix: API_PREFIX_URL,
});


export default request;