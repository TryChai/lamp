import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
// 门店
const getStore = {
    get_store_lists1(params) {
        return axios.post(`/mobile/reserve_store/lists1`, qs.stringify(params));
    },
    get_store_order_lists1(params) {
        return axios.post(`mobile/order/store_lists`, qs.stringify(params));
    },
    store_order_serve(params) {
        return axios.post(`/mobile/reserve_store/order_serve`, qs.stringify(params));
    },
}
export default getStore