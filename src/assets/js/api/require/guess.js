import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getGuess={
    getGuessInfo(params) {
        return axios.post(
            `/mobile/plugin_finger/finger_lists`,
            qs.stringify(params)
        );
    },
    getTz(params){
        return axios.post(
            `/mobile/plugin_finger/info`,
            qs.stringify(params)
        );
    },
    getOther(params) {
        return axios.post(
            `/mobile/plugin_finger/glory`,
            qs.stringify(params)
        );
    },
    addGuess(params) {
        return axios.post(
            `/mobile/plugin_finger/challenge`,
            qs.stringify(params)
        );
    },
    faqiGuess(params){
        return axios.post(
            `/mobile/plugin_finger/publish`,
            qs.stringify(params)
        );
    },
    outGuess(params){
        return axios.post(
            `/mobile/plugin_finger/outgame`,
            qs.stringify(params)
        );
    },
    guessHistory(params){
        return axios.post(
            `/mobile/plugin_finger/finger_history`,
            qs.stringify(params)
        );
    },
    getGuessSeason(params){
        return axios.post(
            `/mobile/plugin_finger/month_red`,
            qs.stringify(params)
        );
    },
    cancel_guess(params){
      //取消猜拳争霸
      return axios.post(
          `/mobile/plugin_finger/del_publish`,
          qs.stringify(params)
      );
    }
}

export default getGuess