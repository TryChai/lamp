import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getAssemble={
    getAssembleList(params) { 
        return axios.post(
            `/mobile/group/lists`,
            qs.stringify(params)
        );
    },
    getAssembleBanner(params){
        return axios.post(
            `/mobile/group/banner`,
            qs.stringify(params)
        );
    }

}

export default getAssemble