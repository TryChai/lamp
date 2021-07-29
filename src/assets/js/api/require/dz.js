import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getDz = {
  // 参与动态
  get_product_dynamic(params){
    return axios.post(`/mobile/product/dynamic`, qs.stringify(params));
  },
  // 功德榜
  get_product_ranking(params){
    return axios.post(`/mobile/product/ranking`, qs.stringify(params));
  },
  // 随机金额
  get_random_amount(params){
    return axios.post(`/mobile/supplier/random_amount`, qs.stringify(params));
  },   
  change_nickname(params) {
    return axios.post(`/mobile/ucenter/change_nickname`, qs.stringify(params));
  },
  get_donation_record(params) {
    return axios.post(`/mobile/supplier/donation_record`, qs.stringify(params));
  },
  get_random_content(params) {
    return axios.post(`/mobile/supplier/random_content`, qs.stringify(params));
  },
  // 
  
}

export default getDz