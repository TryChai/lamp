//房产插件
import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getEstate={
    getFormField(params){
        return axios.post(
            `/mobile/bd_msg/field`,
            qs.stringify(params)
        );
    },
    addFormField(params){
        return axios.post(
            `/mobile/bd_msg/saveadd`,
            qs.stringify(params)
        ); 
    },
    getFormFieldHistory(params){
        return axios.post(
            `/mobile/bd_msg/lists`,
            qs.stringify(params)
        ); 
    },
    //获取表格列表
    getTableList(params) {
      return axios.post("/mobile/bd_msg/table", qs.stringify(params));
    }

}

export default getEstate