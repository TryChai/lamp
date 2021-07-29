import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getGift = {
  //获取礼品卡
  getGiftInfo(params) {
    return axios.post(`/mobile/recharge_card/lists`, qs.stringify(params));
  },
  //购买礼品卡
  buyGiftCard(params) {
    return axios.post(`/mobile/recharge_card/order`, qs.stringify(params));
  },
  //礼品卡充值
  rechargeGiftCard(params) {
    return axios.post(`/mobile/funds/recharge_card`, qs.stringify(params));
  }
}

export default getGift
