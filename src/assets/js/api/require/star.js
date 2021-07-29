import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getStar = {
  getStarInfo(params) {
    return axios.post(`/mobile/coin/index`, qs.stringify(params));
  },
  getStarjy(params) {
    return axios.post(`/mobile/c2c/index`, qs.stringify(params));
  },
  addC2c(params) {
    return axios.post(`/mobile/c2c/buy`, qs.stringify(params));
  },
  getStarJy(params) {
    //星球交易市场
    return axios.post(`/mobile/c2c/lists`, qs.stringify(params));
  },
  sellC2c(params) {
    return axios.post(`/mobile/c2c/sell`, qs.stringify(params));
  },
  getSellOrder(params) {
    return axios.post(`/mobile/c2c/order`, qs.stringify(params));
  },
  getMyBuy(params) {
    return axios.post(`/mobile/c2c/mybuy`, qs.stringify(params));
  },
  delMyBuy(params) {
    return axios.post(`/mobile/c2c/delbuy`, qs.stringify(params));
  },
  c2cOrderDetails(params) {
    return axios.post(`/mobile/c2c/order_detail`, qs.stringify(params));
  },
  c2cPayment(params) {
    return axios.post(
      //确认付款
      `/mobile/c2c/payment`,
      qs.stringify(params)
    );
  },
  c2cConfirm(params) {
    //确认收款
    return axios.post(`/mobile/c2c/confirm`, qs.stringify(params));
  },
  endC2c(params) {
    //拒绝打款
    return axios.post(`/mobile/c2c/cancel`, qs.stringify(params));
  },
  c2cappeal(params) {
    //申诉详情
    return axios.post(`/mobile/c2c/state`, qs.stringify(params));
  },
  addAppeal(params) {
    //提交申诉
    return axios.post(`/mobile/c2c/add_state`, qs.stringify(params));
  },
  submsg(params) {
    return axios.post(`/mobile/c2c/content`, qs.stringify(params));
  },
  delAppeal(params) {
    //提交申诉
    return axios.post(`/mobile/c2c/del_state`, qs.stringify(params));
  },
  getStar(params) {
    //矿机
    return axios.post(`/mobile/coin/star`, qs.stringify(params));
  },
  getMyStar(params) {
    //我的矿机
    return axios.post(`/mobile/coin/mystar`, qs.stringify(params));
  },
  exchangeStar(params) {
    return axios.post(`/mobile/coin/saveadd`, qs.stringify(params));
  },
  getStarDetails(params) {
    return axios.post(`/mobile/coin/stardetails`, qs.stringify(params));
  },
  saleC2c(params) {
    //发布卖
    return axios.post(`mobile/c2c/sale`, qs.stringify(params));
  },
  buyC2c(params) {
    //点击购买
    return axios.post(`/mobile/c2c/pay`, qs.stringify(params));
  },
  cancel_order(params) {
    return axios.post(`/mobile/c2c/cancel_order`, qs.stringify(params));
  }
};
export default getStar;
