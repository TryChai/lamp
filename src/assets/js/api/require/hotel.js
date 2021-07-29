import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getHotel = {
    hotel_lists(params) {
        return axios.post(`/mobile/hotel/lists`, qs.stringify(params));
    },
    hotel_details(params) {
        return axios.post(`/mobile/hotel/details`, qs.stringify(params));
    },
    hotel_confirm_order(params) {
        return axios.post(`/mobile/hotel/confirm_order`, qs.stringify(params));
    },
    hotel_hotel_data(params) {
        return axios.post(`/mobile/hotel/hotel_data`, qs.stringify(params));
    },
    hotel_save(params) {
        return axios.post(`/mobile/hotel/save`, qs.stringify(params));
    },
    hotel_hotel_integral(params) {
        return axios.post(`/mobile/hotel/hotel_integral`, qs.stringify(params));
    },
    hotel_hotel_integral_data(params) {
        return axios.post(`/mobile/hotel/hotel_integral_data`, qs.stringify(params));
    },
}
export default getHotel