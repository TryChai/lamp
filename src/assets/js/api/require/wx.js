import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getWx={
    wxConfig(params) {
        return axios.post(
            `/mobile/weixin/config`,
            qs.stringify(params)
        );
    },
}

export default getWx