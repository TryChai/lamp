import axios from '../http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块
const getConfig = {
  getConfigInfo(params) {
    return axios.post(`/mobile/config/lists`, qs.stringify(params))
  },
  getAppConfig(params) {
    return axios.post(`/mobile/app/down`, qs.stringify(params))
  },
  get_iden(params) {
    return axios.post(`/mobile/config/find_iden`, qs.stringify(params))
  }
}

export default getConfig
