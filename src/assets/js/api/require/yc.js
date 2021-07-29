//房产插件
import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
// 云仓
const getYc={
    getMarket(params){
        return axios.post(
            `/mobile/yuncang/market`,
            qs.stringify(params)
        );
    },
    getYcLists(params){
        return axios.post(
            `/mobile/yuncang/lists`,
            qs.stringify(params)
        );
    },
    getYcOrderList(params){
        return axios.post(
            `/mobile/yuncang/order_lists`,
            qs.stringify(params)
        );
    },
    ocConfirmOrder(params){
        return axios.post(
            `/mobile/yuncang/order_confirm`,
            qs.stringify(params)
        ); 
    },
    representation(params){
        return axios.post(
            `/mobile/yuncang/representation`,
            qs.stringify(params)
        ); 
    },
    orderCollection(params){
        return axios.post(
            `/mobile/yuncang/order_collection`,
            qs.stringify(params)
        );
    },
    cancelRepresentation(params){
        return axios.post(
            `/mobile/yuncang/cancel_representation`,
            qs.stringify(params)
        );
    },
    orderCancel(params){
        return axios.post(
            `/mobile/yuncang/order_cancel`,
            qs.stringify(params)
        );
    },
    orderPayment(params){
        return axios.post(
            `/mobile/yuncang/order_payment`,
            qs.stringify(params)
        );
    },
    getYcZhiTuiRen(params){
        return axios.post(
            `/mobile/yuncang/zhituiren`,
            qs.stringify(params)
        );
    },
    getMyYc(params){
        return axios.post(
            `/mobile/yuncang/my_yuncang`,
            qs.stringify(params)
        );
    },
    subLifting(params){
        return axios.post(
            `/mobile/yuncang/lifting`,
            qs.stringify(params)
        );
    },
    subExchange(params){
        return axios.post(
            `/mobile/yuncang/exchange`,
            qs.stringify(params)
        );
    },
    getAuthorization(params){
        return axios.post(
            `/mobile/yuncang/authorization`,
            qs.stringify(params)
        );
    }
}

export default getYc