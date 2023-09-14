import { getLoginStatusAPI, LoginStatus } from "@/api/user";
import { ElMessage } from "element-plus";
// 验证用户的cookie时效性
async function isLoggedIn() {
  const { profile } = (await getLoginStatusAPI()) as LoginStatus;
  if (!profile) {
    // 匿名用户、未登录
    ElMessage({
      message: "当前是游客模式",
      type: "warning",
      duration: 3 * 1000,
    });
    return false;
  } else {
    // 已登录
    // store.$patch((state) => {
    //   state.userInfo = profile;
    //   state.userId = profile.userId;
    // });
    // store.onLoginChange(true);
    return true;
  }
}

export default isLoggedIn;
