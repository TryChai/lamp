//房产插件
 import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getEstate={
    getEstateIndex(params){
        return axios.post(
            `/mobile/estate_page/index`,
            qs.stringify(params)
        );
    },
    getEstateList(params){
        return axios.post(
            `/mobile/estate/lists`,
            qs.stringify(params)
        );
    },
    getEstateDetails(params){
        return axios.post(
            `/mobile/estate/info`,
            qs.stringify(params)
        );
    },
}

export default getEstate