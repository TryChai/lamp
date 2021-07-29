import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getOrder = {
  addOrder(params) {
    return axios.post(`/mobile/order/confirm_order`, qs.stringify(params));
  },
  setOrder(params) {
    return axios.post(`/mobile/order/save`, qs.stringify(params));
  },
  payOrder(params) {
    return axios.post(`/mobile/order_pay/lists`, qs.stringify(params));
  },
  subPayOrder(params) {
    return axios.post(`/mobile/order_pay/pay`, qs.stringify(params));
  },
  IsSuccessOrder(params) {
    return axios.post(`/mobile/order_pay/success`, qs.stringify(params));
  },
  getOrderProduct(params) {
    return axios.post(`/mobile/order_pay/product`, qs.stringify(params));
  },
  getOrderList(params) {
    return axios.post(`/mobile/order/lists`, qs.stringify(params));
  },
  getOrderDetails(params) {
    return axios.post(`/mobile/order/detail`, qs.stringify(params));
  },
  getMailInfo(params) {
    return axios.post(`/mobile/order/mail`, qs.stringify(params));
  },
  getOrderRefund(params) {
    return axios.post(`/mobile/order_return/application`, qs.stringify(params));
  },
  setOrderRefund(params) {
    return axios.post(`/mobile/order_return/save`, qs.stringify(params));
  },
  setOrderMail(params) {
    return axios.post(`/mobile/order_return/mail`, qs.stringify(params));
  },
  closeOrder(params) {
    //确认收货
    return axios.post(`/mobile/order/confirm`, qs.stringify(params));
  },
  getIsPay(params) {
    return axios.post(`/common/wx/is_pay`, qs.stringify(params));
  },
  closeOrderCancel(params) {
    return axios.post(
      `/mobile/order_return/cancel_return`,
      qs.stringify(params)
    );
  },
  get_order_tail(params) {
    return axios.post(
      `/mobile/activity/get_second_money`,
      qs.stringify(params)
    );
  },
  get_presale_order(params) {
    return axios.post(`/mobile/order/order_lists`, qs.stringify(params));
  },
  pay_presale_order(params) {
    return axios.post(`/mobile/activity/second_pay`, qs.stringify(params));
  },
  cancel_pay(params) {
    return axios.post(`/mobile/order/close_order`, qs.stringify(params));
  },

  // 自提
  get_mention_list(params) {
    return axios.post(`mobile/mention/lists`, qs.stringify(params));
  },
  confirm_mention(params) {
    return axios.post(`mobile/mention/confirm`, qs.stringify(params));
  },
  //预约商品下单
  order_pre_save(params) {
    return axios.post(`/mobile/order/pre_save`, qs.stringify(params));
  },

  //门店自提
  get_apply_mention(params) {
    return axios.post(`/mobile/extract/apply`, qs.stringify(params));
  },
  save_apply_mention(params) {
    //申请团长
    return axios.post(`/mobile/extract/apply_save`, qs.stringify(params));
  },
  edit_apply_mention(params) {
    //修改团长信息
    return axios.post(`/mobile/extract/editsave`, qs.stringify(params));
  },
  get_nearstore(params) {
    return axios.post(`/mobile/page/extract`, qs.stringify(params));
  },
  get_mentionlist(params) {
    return axios.post(`/mobile/extract/lifting_lists`, qs.stringify(params));
  },
  complect_mention(params) {
    return axios.post(`/mobile/extract/complete_lifting`, qs.stringify(params));
  },
  group_buy_order_lists(params) {
    return axios.post(`mobile/group_buy/order_lists`, qs.stringify(params));
  },
  //获取消费红包领取列表
  getCoupon(params) {
    return axios.post(`/mobile/coupon/coupon_xf`, qs.stringify(params));
  },
  //领取红包
  receiveCoupon(params) {
    return axios.post(`/mobile/coupon/consumer_coupon`, qs.stringify(params));
  },
  start_reserve(params) {
    //扫描预约二维码开始预约服务
    return axios.post(
      `/mobile/reserve_store/order_serve`,
      qs.stringify(params)
    );
  },
  order_pay_new_lists(params) {
    return axios.post(`/mobile/order_pay/new_lists`, qs.stringify(params));
  },
};
export default getOrder;
