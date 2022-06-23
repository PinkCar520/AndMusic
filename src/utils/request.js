import axios from 'axios' // 引入axios
import {
    Message
} from 'element-ui';
// 创建axios对象
const request = axios.create({
    // https://netease-cloud-music-api-binaryify.vercel.app/album/newest
    // baseURL: '/',
    baseURL: 'http://127.0.0.1:3000',
    // 允许携带cookie
    withCredentials: true,
    timeout: 10000 // 请求超时-->5000ms,
})
// 请求拦截器
request.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    if (!config.params) config.params = {};
    // 设置cookie
    config.params.cookie = window.sessionStorage.getItem('cookie');
    return config;
}, function (error) {
    // 处理请求错误
    return Promise.reject(error);
});
// 响应拦截器
request.interceptors.response.use(response => {
    // 在2xx范围内的任何状态代码都会触发此功能
    // 处理响应数据
    return response;
}, function (error) {
    // 任何超出2xx范围的状态代码都会触发此功能
    // 处理响应错误
    // 网络异常处理
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.message.includes("timeout")) {
        Message({
            message: '请求超时,请稍后再试',
            type: 'error',
            duration: 3 * 1000
        })
    } else if (error.code === "ERR_BAD_REQUEST") {
        Message({
            message: "操作频繁,请稍候再试",
            type: 'error',
            duration: 3 * 1000
        })
    }
    return Promise.reject(error);
});
export default request // 导出自定义创建的 axios 对象