import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getPdd = {
    get_ddk_lists(params) {
        return axios.post(
            `/mobile/plugin_ddk/ddk_lists`,
            qs.stringify(params)
        );
    },
    get_ddk_search(params) {
        return axios.post(
            `/mobile/plugin_ddk/ddk_search`,
            qs.stringify(params)
        );
    },
    get_ddk_one(params) {
        return axios.post(
            `/mobile/plugin_ddk/ddk_one`,
            qs.stringify(params)
        );
    },
    get_ddk_search_one(params) {
        return axios.post(
            `/mobile/plugin_ddk/ddk_search_one`,
            qs.stringify(params)
        );
    },
    get_ddk_link(params) {
        return axios.post(
            `/mobile/plugin_ddk/ddk_link`,
            qs.stringify(params)
        );
    },
    get_ddk_cate(params) {
        return axios.post(
            `/mobile/plugin_ddk/ddk_cate`,
            qs.stringify(params)
        );
    },

}

export default getPdd