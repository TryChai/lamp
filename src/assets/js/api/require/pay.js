import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getPay = {
  getincome_index(params) {
    return axios.post(`/mobile/funds/index`, qs.stringify(params));
  },
  getFundsCate(params) {
    return axios.post(`/mobile/funds/cate`, qs.stringify(params));
  },
  get_running_water(params) {
    return axios.post(`/mobile/funds/running_water`, qs.stringify(params));
  },
  get_recharge_item(params) {
    return axios.post(`/mobile/funds/recharge`, qs.stringify(params));
  },
  submit_recharge(params) {
    return axios.post(`/mobile/funds/recharge_add`, qs.stringify(params));
  },
  get_recharge_list(params) {
    return axios.post(`/mobile/funds/recharge_lists`, qs.stringify(params));
  },
  getdraw_index(params) {
    return axios.post(`/mobile/funds/withdraw`, qs.stringify(params));
  },
  submit_draw(params) {
    return axios.post(`/mobile/funds/withdraw_add`, qs.stringify(params));
  },
  get_draw_list(params) {
    return axios.post(`/mobile/funds/withdraw_lists`, qs.stringify(params));
  },
  isRechargePay(params) {
    return axios.post(`/mobile/funds/success`, qs.stringify(params));
  },
  get_liferecharge(params) {
    //话费/流量/油卡 充值
    return axios.post(`/mobile/juhe_recharge/init`, qs.stringify(params));
  },
  get_lifeorder(params) {
    //生成订单
    return axios.post(`/mobile/juhe_recharge/saveadd`, qs.stringify(params));
  },
  get_lifepay(params) {
    //支付列表
    return axios.post(`/mobile/juhe_recharge/lists`, qs.stringify(params));
  },
  submit_lifepay(params) {
    //提交支付
    return axios.post(`/mobile/juhe_recharge/pay`, qs.stringify(params));
  },
  get_life_success(params) {
    //支付成功
    return axios.post(
      `/mobile/juhe_recharge/pay_success`,
      qs.stringify(params)
    );
  },
  get_liferecord(params) {
    //前台 充值记录列表
    return axios.post(`/mobile/juhe_recharge/logs`, qs.stringify(params));
  },

  get_funds_running(params) {
    return axios.post(`/mobile/funds/running_iden`, qs.stringify(params));
  },
};
export default getPay;
