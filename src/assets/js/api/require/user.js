import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getUser = {
  getUserInfo(params) {
    //提交申诉
    return axios.post(`/mobile/ucenter/user_all`, qs.stringify(params));
  },
  sendCode(params) {
    return axios.post(`/mobile/power/sendcode`, qs.stringify(params));
  },
  sendEmailCode(params) {
    return axios.post(`/mobile/power/sendcode2`, qs.stringify(params));
  },
  getConfig(params) {
    return axios.post(`/mobile/power/plugin_open_all`, qs.stringify(params));
  },
  getLoginBg(params) {
    return axios.post(`/mobile/power/find_by_cate`, qs.stringify(params));
  },
  login(params) {
    return axios.post(`/mobile/power/user_login`, qs.stringify(params));
  },
  emailLogin(params) {
    return axios.post(`/mobile/power/user_login_email`, qs.stringify(params));
  },
  reg_emailLogin(params) {
    return axios.post(`/mobile/power/user_reg_email `, qs.stringify(params));
  },
  is_have_user(params) {
    return axios.post(`/mobile/power/is_have_user`, qs.stringify(params));
  },
  regUser(params) {
    return axios.post(`/mobile/power/user_reg`, qs.stringify(params));
  },
  changePssword(params) {
    return axios.post(`/mobile/power/change_password`, qs.stringify(params));
  },
  changeEmailPssword(params) {
    return axios.post(`/mobile/power/change_password_email`, qs.stringify(params));
  },
  getGuoJiPhone(params) {
    return axios.post(`/admin/country/lists`, qs.stringify(params));
  },
  loginOut(params) {
    return axios.post(`/mobile/user/logout`, qs.stringify(params));
  },
  getZhiTui(params) {
    return axios.post(`/mobile/plugin_im/zhituiren`, qs.stringify(params));
  },
  getKfList(params) {
    return axios.post(`/mobile/plugin_im/service`, qs.stringify(params));
  },
  ceshiUrl(params) {
    return axios.post(`/common/url/index`, qs.stringify(params));
  },
  wxLogin(params) {
    return axios.post(`/mobile/power/weixin_login`, qs.stringify(params));
  },
  wxphone_login(params) {
    return axios.post(`/mobile/power/wx_reg`, qs.stringify(params));
  },
  getEwm(params) {
    return axios.post(`/mobile/qr/entrance`, qs.stringify(params));
  },
  bindPhone(params) {
    return axios.post(`/mobile/ucenter/bind_mobile`, qs.stringify(params));
  },
  bindPhoneCode(params) {
    return axios.post(`/mobile/ucenter/sendcode`, qs.stringify(params));
  },
  getUserAgreement(params) {
    return axios.post(`/mobile/power/contact`, qs.stringify(params));
  },
  bindShaer(params) {
    return axios.post(`/mobile/ucenter/bind_share`, qs.stringify(params));
  },
  getAuroraId(params) {
    return axios.post(`/mobile/ucenter/aurora`, qs.stringify(params));
  },
  submit_complaint(params) {
    return axios.post(`/mobile/feedback/saveadd`, qs.stringify(params));
  },
  get_complaint_pro(params) {
    return axios.post(`/mobile/feedback/feedback_type`, qs.stringify(params));
  },
  selectUsername(params) {
    return axios.post(`/mobile/user/info`, qs.stringify(params));
  },
  applets_login(params) {
    return axios.post(`/mobile/power/applets`, qs.stringify(params));
  },
  applets_login2(params) {
    return axios.post(`/mobile/power/applets_login2`, qs.stringify(params));
  },
  appWxLogin(params) {
    return axios.post(`/mobile/power/app_wx_login`, qs.stringify(params));
  },
  bindAppPhone(params) {
    return axios.post(`/mobile/ucenter/bind_mobile_app`, qs.stringify(params));
  },
  bindSendAppCode(params) {
    return axios.post(`/mobile/ucenter/sendcode_app`, qs.stringify(params));
  },
  get_account_state(params) {
    return axios.post(
      `/mobile/ucenter/get_account_state`,
      qs.stringify(params)
    );
  },
  appAlipayLogin(params) {
    return axios.post(`/mobile/power/app_zfb_login`, qs.stringify(params));
  },
  xcx_shop_ewm(params) {
    return axios.post(`/mobile/qr/product`, qs.stringify(params));
  },
  xcx_lesson_ewm(params) {
    return axios.post(`/mobile/qr/lesson`, qs.stringify(params));
  },
  xcx_live_ewm(params) {
    return axios.post(`/mobile/qr/live`, qs.stringify(params));
  },
  xcx_reply_ewm(params) {
    return axios.post(`/mobile/qr/live_video`, qs.stringify(params));
  },
  appdouyinLogin(params) {
    return axios.post(`/mobile/power/app_douyin_login`, qs.stringify(params));
  },
  appIosLogin(params) {
    return axios.post(`/mobile/power/app_Apple_login`, qs.stringify(params));
  },
  appSinaLogin(params) {
    return axios.post(`/mobile/power/app_sina_login`, qs.stringify(params));
  },
};
export default getUser;
