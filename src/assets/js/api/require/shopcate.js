import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getShopCate ={
    getShopCate(params) {
        return axios.post(
            `/mobile/page/cate`,
            qs.stringify(params)
          );
    },
    getSupplierCate(params){
        return axios.post(
            `/mobile/page/cate_only_sid`,
            qs.stringify(params)
          );
    }
}
export default getShopCate;