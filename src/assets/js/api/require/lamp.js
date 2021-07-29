import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const lamp = {
  getBanner(params) {
    return axios.post(`/mobile/banner/banner_list`, qs.stringify(params));
  },
  getCity(params) {
    return axios.post(`/mobile/temple_buddhism_lamp/temple_city_list`, qs.stringify(params));
  },
  getArtical(params) {
    return axios.post(`/mobile/temple_buddhism_lamp/get_temple_arcticle_info`, qs.stringify(params));
  },
  getLampDetail(params) {
    return axios.post(`/mobile/temple_buddhism_lamp/get_temple_buddhism_lamp_info`, qs.stringify(params));
  },
  getLampPosition(params) {
    return axios.post(`/mobile/temple_buddhism_lamp/get_temple_buddhism_lamp_location`, qs.stringify(params));
  },
  getOrder(params) {
    return axios.post(`/mobile/temple_buddhism_lamp/get_temple_buddhism_lamp_order`, qs.stringify(params));
  },
  submitOrder(params){
    return axios.post(`/mobile/temple_buddhism_lamp/add_temple_buddhism_lamp_order`, qs.stringify(params));
  },
  payOrder(params){
    return axios.post(`/mobile/supplier/gd_pay`, qs.stringify(params));
  }
};

export default lamp;
