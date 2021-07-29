import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getCrm = {
  // 查看公海客户
  public_client(params){
    return axios.post(`/mobile/staff/public_user`, qs.stringify(params));
  },
  // 修改备注信息
  setUserContent(params){
    return axios.post(`/mobile/staff/content`, qs.stringify(params));
  },
  // 查看负责用户
  mineClient(params){
    return axios.post(`/mobile/staff/user_lists`, qs.stringify(params));
  },
  // 拉取用户
  pullClient(params){
    return axios.post(`/mobile/staff/staff_add_user`, qs.stringify(params));
  },
  // 查看跟单记录
  seeRecord(params){
    return axios.post(`/mobile/staff/users_order`, qs.stringify(params));
  },
  // 足迹记录
  footType(params){
    return axios.post(`/mobile/footprint/footprint_type`, qs.stringify(params));
  },
  footRecord(params){
    return axios.post(`/mobile/staff/footprint_lists`, qs.stringify(params));
  },
  // 删除客户
  delClient(params){
    return axios.post(`/mobile/staff/del_user`, qs.stringify(params));
  }
  
}

export default getCrm