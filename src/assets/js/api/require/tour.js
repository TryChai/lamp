import axios from '../http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块
const getTour = {
  get_tourperson(params) {
    //添加出行人
    return axios.post(`/mobile/tour_person/lists`, qs.stringify(params))
  },
  add_tourperson(params) {
    //添加出行人
    return axios.post(`/mobile/tour_person/saveadd`, qs.stringify(params))
  },
  edit_tourperson(params) {
    //修改出行人
    return axios.post(`/mobile/tour_person/saveedit`, qs.stringify(params))
  },
  del_tourperson(params) {
    //修改出行人
    return axios.post(`/mobile/tour_person/saveedit`, qs.stringify(params))
  },
  single_tourperson(params) {
    return axios.post(`/mobile/tour_person/person`, qs.stringify(params))
  },
  get_triplist(params) {
    return axios.post(`/mobile/tour_trip/lists`, qs.stringify(params))
  },
  get_tourdate(params) {
    return axios.post(`/mobile/tour_price/lists`, qs.stringify(params))
  },
  buy_tripshop(params) {
    return axios.post(`/mobile/cart/add_cart`, qs.stringify(params))
  },
  save_triporder(params) {
    return axios.post(`/mobile/order/save`, qs.stringify(params))
  },
  get_tour_lists(params) {
    return axios.post(`/mobile/tour_trip/tour_lists`, qs.stringify(params))
  }
}

export default getTour
