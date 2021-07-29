import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getRider ={
    getRiderReceiveLists(params) {
        return axios.post(
            `/mobile/rider/receive_lists`,
            qs.stringify(params)
          );
    },
    subRider(params){
        return axios.post(
            `/mobile/rider/receive`,
            qs.stringify(params)
          );
    },
    getRiderMyReceive(params){
        return axios.post(
            `/mobile/rider/my_receive`,
            qs.stringify(params)
          );
    },
    confirmReceive(params){
        return axios.post(
            `/mobile/rider/confirm_receive`,
            qs.stringify(params)
          );
    },
    delivery(params){
        return axios.post(
            `/mobile/product/delivery_area`,
            qs.stringify(params)
          );
    },
}
export default getRider;