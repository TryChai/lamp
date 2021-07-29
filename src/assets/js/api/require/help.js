import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getHelp = {
  //判断是否参与
  getparketInfo(params) {
    return axios.post(`/mobile/assist_gold/is_attend`, qs.stringify(params));
  },

  getactionList(params) {
    return axios.post(`/mobile/assist_gold/edit`, qs.stringify(params));
  },
  getactionId(params) {
    return axios.post(`/mobile/assist_gold/attend`, qs.stringify(params));
  },
//   助力
gethelp(params) {
    return axios.post(`/mobile/assist_gold/help`, qs.stringify(params));
  },
//   助力列表
gethelpList(params) {
    return axios.post(`/mobile/assist_gold/help_lists`, qs.stringify(params));
  },

//  提现
getcashOut(params) {
    return axios.post(`/mobile/assist_gold/help`, qs.stringify(params));
  },
// 提现记录
getcashOutLists(params) {
    return axios.post(`/mobile/assist_gold/cash_out_lists`, qs.stringify(params));
  },
  // 提现攻略
  getattack(params) {
    return axios.post(`/mobile/news/news_info
    `, qs.stringify(params));
  },
  // 链接
  getlink(params) {
    return axios.post(`/mobile/config/lists
    `, qs.stringify(params));
  },
  //判断助力
  getis_help(params) {
    return axios.post(`/mobile/assist_gold/is_help
    `, qs.stringify(params));
  },
  gettx(params) {
    return axios.post(`/mobile/assist_gold/cash_out
    `, qs.stringify(params));
  },
}

export default getHelp
