import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getPunch={
    getPunchInfo(params){
        return axios.post(
            `/mobile/plugin_early/info`,
            qs.stringify(params)
        );
    },
    addPunch(params) {
        return axios.post(
            `/mobile/plugin_early/sign_in`,
            qs.stringify(params)
        );
    },
    tzPunch(params){
        return axios.post(
            `/mobile/plugin_early/buy`,
            qs.stringify(params)
        );
    },
    punchHistory(params){
        return axios.post(
            `/mobile/plugin_early/history`,
            qs.stringify(params)
        );
    },
    getPunchSeason(params) {
        return axios.post(
            `/mobile/plugin_early/month_red`,
            qs.stringify(params)
        );
    }
}

export default getPunch