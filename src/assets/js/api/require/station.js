import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getStation = {
    gas_station_setting(params) {
        return axios.post(`/mobile/gas_station/setting`, qs.stringify(params));
    },
    gas_station_oil_id(params) {
        return axios.post(`/mobile/gas_station/oil_id`, qs.stringify(params));
    },
    gas_station_lists(params) {
        return axios.post(`/mobile/gas_station/lists`, qs.stringify(params));
    },
    gas_station_get_code(params) {
        return axios.post(`/mobile/gas_station/get_code`, qs.stringify(params));
    },
    gas_station_info(params) {
        return axios.post(`/mobile/gas_station/info`, qs.stringify(params));
    },
    oil_card_lists(params) {
        return axios.post(`/mobile/oil_card/lists`, qs.stringify(params));
    },
    oil_card_save_order(params) {
        return axios.post(`/mobile/oil_card/save_order`, qs.stringify(params));
    },
    oil_card_order_lists(params) {
        return axios.post(`/mobile/oil_card/order_lists`, qs.stringify(params));
    },
    oil_card_detail(params) {
        return axios.post(`/mobile/oil_card/detail`, qs.stringify(params));
    },
}
export default getStation