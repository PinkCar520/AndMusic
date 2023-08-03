import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import { ElMessage } from "element-plus";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL,'API_BASE_URL');

// 创建axios对象
const request = axios.create({
  baseURL: API_BASE_URL,
  // 用于允许跨域请求时携带认证信息（例如 Cookie）
  withCredentials: true,
  timeout: 10000, // 请求超时-->10000ms,
});
// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 在发送请求之前做些什么
    // console.log(config);
    if (!config.params) config.params = {};
    // 设置cookie
    config.params.cookie = window.localStorage.getItem("cookie");
    return config;
  },
  (error: AxiosError) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);
// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 在2xx范围内的任何状态代码都会触发此功能
    // 处理响应数据
    const code = response.status;
    const data = response.data;
    if (code === 200) {
      return data;
    }
  },
  (error: AxiosError) => {
    // 任何超出2xx范围的状态代码都会触发此功能
    // 处理响应错误
    // 网络异常处理
    if (
      error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      error.message.includes("timeout")
    ) {
      ElMessage({
        message: "请求超时,请稍后再试",
        type: "error",
        duration: 3 * 1000,
      });
    } else if (error.code === "ERR_BAD_REQUEST") {
      ElMessage({
        message: "操作频繁,请稍候再试",
        type: "error",
        duration: 3 * 1000,
      });
    }
    return Promise.reject(error);
  }
);
export default request; // 导出自定义创建的 axios 对象
