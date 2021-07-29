import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getDapp={
    getDappIndex(params) {
        return axios.post(
            `/mobile/dapp/index`,
            qs.stringify(params)
        );
    },
    subEth(params){
        return axios.post(
            `/mobile/dapp/recharge`,
            qs.stringify(params)
        );  
    },
    getWaterList(params){
        return axios.post(
            `/mobile/dapp/running_water`,
            qs.stringify(params)
        ); 
    },
    addEntryOrder(params){
        return axios.post(
            `/mobile/dapp/entry_order`,
            qs.stringify(params)
        );
    },
    payDapp(params){
        return axios.post(
            `/mobile/dapp/pay`,
            qs.stringify(params)
        );
    },
    toLogin(params){
        return axios.post(
            `/mobile/power/imtoken_login`,
            qs.stringify(params)
        );
    },
    toReg(params){
        return axios.post(
            `/mobile/power/imtoken_reg`,
            qs.stringify(params)
        );
    },
    //欧翠入单
    getEntry(params){
        return axios.post(
            `/mobile/vip/star`,
            qs.stringify(params)
        );
    },
    addEntry(params){
        return axios.post(
            `/mobile/vip/saveadd`,
            qs.stringify(params)
        ); 
    },
    getMstar(params){
        return axios.post(
            `/mobile/mxq/star`,
            qs.stringify(params)
        ); 
    },
    addMstar(params){
        return axios.post(
            `/mobile/mxq/saveadd`,
            qs.stringify(params)
        ); 
    },
    getMyMstar(params){
        return axios.post(
            `/mobile/mxq/mystar`,
            qs.stringify(params)
        );
    },
    delMyMstar(params){
        return axios.post(
            `/mobile/mxq/savedel`,
            qs.stringify(params)
        );
    },
    getAttackStarList(params){
        return axios.post(
            `/mobile/gdxq/star`,
            qs.stringify(params)
        ); 
    },
    getTransaction(params){
        return axios.post(
            `/mobile/transaction/index`,
            qs.stringify(params)
        );
    },
    addTransaction(params){
        return axios.post(
            `/mobile/transaction/buy`,
            qs.stringify(params)
        );
    },
    sellTransaction(params){
        return axios.post(
            `/mobile/transaction/sell`,
            qs.stringify(params)
        );
    },
    getNewTransaction(params){
        return axios.post(
            `/mobile/transaction/recent_transaction`,
            qs.stringify(params)
        );
    },
    getPrice(params){
        return axios.post(
            `/mobile/transaction/price`,
            qs.stringify(params)
        );
    },
    getMyOrder(params){
        return axios.post(
            `/mobile/transaction/my_order`,
            qs.stringify(params)
        );
    },
    closeOrder(params){
        return axios.post(
            `/mobile/transaction/withdrawal_order`,
            qs.stringify(params)
        );
    },
    getMyHistory(params){
        return axios.post(
            `/mobile/transaction/order_lists`,
            qs.stringify(params)
        );
    },
    getEntryRecoed(params){
        return axios.post(
            `/mobile/vip/mystar`,
            qs.stringify(params)
        );
    },
    addAttackStar(params){
        return axios.post(
            `/mobile/gdxq/saveadd`,
            qs.stringify(params)
        );
    },
    getAttackHis(params){
        return axios.post(
            `/mobile/gdxq/mystar`,
            qs.stringify(params)
        );
    },
    addDappRecharge(params){
        return axios.post(
            `/mobile/dapp/recharge`,
            qs.stringify(params)
        );
    },
    getASIndex(params){
        return axios.post(
            `/mobile/bbdh/index`,
            qs.stringify(params)
        );
    },
    subAs(params){
        return axios.post(
            `/mobile/bbdh/saveadd`,
            qs.stringify(params)
        );
    },
    getAsHistory(params){
        return axios.post(
            `/mobile/bbdh/lists`,
            qs.stringify(params)
        );
    },
    getWarshipIndex(params){
        return axios.post(
            `/mobile/hjzj/index`,
            qs.stringify(params)
        );
    },
    addWarship(params){
        return axios.post(
            `/mobile/hjzj/saveadd`,
            qs.stringify(params)
        );
    },
    addFh(params){
        return axios.post(
            `/mobile/hjzj/savedel`,
            qs.stringify(params)
        );
    },
    getWarshipHistory(params){
        return axios.post(
            `/mobile/hjzj/lists`,
            qs.stringify(params)
        );
    }

}

export default getDapp