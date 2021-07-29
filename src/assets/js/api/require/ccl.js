import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getCcl={
    getCclInfo(params) {
        return axios.post(
            `/mobile/plugin_guess/guess_info`,
            qs.stringify(params)
        );
    },
    getCclList(params) {
        return axios.post(
            `/mobile/plugin_guess/ranking_list`,
            qs.stringify(params)
        );
    },
    getVictor(params) {
        return axios.post(
            `/mobile/plugin_guess/victor`,
            qs.stringify(params)
        );
    },
    addCcl(params) {
        return axios.post(
            `/mobile/plugin_guess/buy`,
            qs.stringify(params)
        );
    },
    cclMyHistory(params) {
        return axios.post(
            `/mobile/plugin_guess/history`,
            qs.stringify(params)
        );
    }
}

export default getCcl