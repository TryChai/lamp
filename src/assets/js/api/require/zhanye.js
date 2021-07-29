import axios from '../http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块
const getZhanYe = {
  addShopTp(params) {
    return axios.post(`/mobile/drag/come`, qs.stringify(params))
  },
  endShopTp(params) {
    return axios.post(`/mobile/drag/come_over`, qs.stringify(params))
  },
  getZhanYeList(params) {
    return axios.post(`/mobile/drag/promote_business`, qs.stringify(params))
  },
  getZhanYeList1(params) {
    return axios.post(`/mobile/drag/promote_business_mini`, qs.stringify(params))
  },
  getZhanYeListHead(params) {
    return axios.post(
      `/mobile/drag/promote_business_head`,
      qs.stringify(params)
    )
  },
  getZhanYeListHead1(params) {
    return axios.post(
      `/mobile/drag/promote_business_head_mini`,
      qs.stringify(params)
    )
  },
  getMyCustomList(params) {
    return axios.post(`/mobile/drag_follow/my_custom`, qs.stringify(params))
  },
  addFollow(params) {
    return axios.post(`/mobile/drag_follow/follow`, qs.stringify(params))
  },
  getFollowUser(params) {
    return axios.post(`/mobile/drag/custom_info`, qs.stringify(params))
  },
  getDataBoard(params) {
    return axios.post(`/mobile/drag/databoard`, qs.stringify(params))
  },
  getDataList(params) {
    return axios.post(`/mobile/drag/custom_list`, qs.stringify(params))
  },
  getHitWeek(params) {
    return axios.post(`/mobile/drag/hit_week`, qs.stringify(params))
  },
  addType(params) {
    return axios.post(`/mobile/drag_follow/follow_type`, qs.stringify(params))
  },
  getShopBrowseList(params) {
    return axios.post(`/mobile/drag/mini_share`, qs.stringify(params))
  },
  getProductInfo(params) {
    return axios.post(`/mobile/drag/product_custom_info`, qs.stringify(params))
  },
  getHistoryFollow(params) {
    return axios.post(`/mobile/drag_follow/follow_log`, qs.stringify(params))
  },
  submit_zhanye_pay(params) {
    return axios.post(`/mobile/supplier/pay`, qs.stringify(params))
  },
  getNewCome(params){ //被分享人访问新闻页
    return axios.post(`/mobile/drag/come_news`, qs.stringify(params))
  },
  getNewComeOver(params){ //被分享人访问时间
    return axios.post(`/mobile/drag/come_over_news`, qs.stringify(params))
  },
  getWzyNewLists(params){
    return axios.post(`/mobile/drag/mini_share_news`, qs.stringify(params))
  },
  getWzyListHead(params){
    return axios.post(`/mobile/drag/promote_business_head_mini_news `, qs.stringify(params))
  },
  getWzyListUser(params){
    return axios.post(`/mobile/drag/promote_business_mini_news`, qs.stringify(params))
  },
  getNewsCustom(params){
    return axios.post(`/mobile/drag/news_custom_info`, qs.stringify(params))
  },
  getPayInfo(params){
    return axios.post(`/mobile/supplier/pay_info`, qs.stringify(params))
  }
}

export default getZhanYe
