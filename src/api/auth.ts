import request from "@/utils/request";
import { getLoginStatusAPI } from "./user";
/**
 * @description:
 * @return {*}
 * 二维码登录
 * 说明: 二维码登录涉及到 3 个接口,调用务必带上时间戳,防止缓存
 * 1. 二维码 key 生成接口
 * 说明: 调用此接口可生成一个 key
 * 接口地址 : /login/qr/key
 */
export function getLoginQrCodeKeyAPI() {
  return request({
    method: "get",
    url: "/login/qr/key",
    params: {
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 2. 二维码生成接口
 * 说明: 调用此接口传入上一个接口生成的 key 可生成二维码图片的 base64 和二维码信息,可使用 base64 展示图片,或者使用二维码信息内容自行使用第三方二维码生成库渲染二维码
 * 必选参数: key,由第一个接口生成
 * 可选参数: qrimg 传入后会额外返回二维码图片 base64 编码
 * 接口地址 : /login/qr/create
 * 调用例子 : /login/qr/create?key=xxx
 */
export function getLoginQrCodeCreateAPI(params: object) {
  return request({
    method: "get",
    url: "/login/qr/create",
    params: {
      ...params,
      timestamp: new Date().getTime(),
    },
  });
}

/**
 * @description:
 * @return {*}
 * 3. 二维码检测扫码状态接口
 * 说明: 轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies)
 * 必选参数: key,由第一个接口生成
 * 接口地址 : /login/qr/check
 * 调用例子 : /login/qr/check?key=xxx
 */
export interface LoginStatus {
  code: number;
  message: string;
  cookie: string;
}
export function getLoginQrCodeCheckAPI(key: string): Promise<LoginStatus> {
  return request({
    method: "get",
    url: "/login/qr/check",
    params: {
      key,
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 退出登录
 */
export function getLogoutAPI() {
  return request({
    method: "get",
    url: "/logout",
    params: {
      timestamp: new Date().getTime(),
    },
  });
}
