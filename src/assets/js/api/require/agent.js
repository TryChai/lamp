import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getAgent = {
  getgetAgentConfig(params) {
    return axios.post(`/mobile/agent/find_apply`, qs.stringify(params));
  },
  setAgentApply(params) {
    return axios.post(`/mobile/agent/apply`, qs.stringify(params));
  },
  getAgentMember(params) {
    return axios.post(`/mobile/agent/member`, qs.stringify(params));
  },
  getAgentList(params) {
    return axios.post(`/mobile/agent/running_water`, qs.stringify(params));
  },
  searchAgentArea(params) {
    return axios.post(`/mobile/agent/cx_agent`, qs.stringify(params));
  },
};

export default getAgent;
