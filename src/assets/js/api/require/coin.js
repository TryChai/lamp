import axios from '../http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const getCoin = {
  getCoinInfo(params) {
    return axios.post(`/mobile/coin_funds/index`, qs.stringify(params))
  },
  getCoinHistory(params) {
    return axios.post(`/mobile/coin_funds/running_water`, qs.stringify(params))
  },
  getTb(params) {
    //提币
    return axios.post(`/mobile/coin_funds/withdraw`, qs.stringify(params))
  },
  addTb(params) {
    return axios.post(`/mobile/coin_funds/withdraw_add`, qs.stringify(params))
  },
  getTbHistory(params) {
    return axios.post(`/mobile/coin_funds/withdraw_lists`, qs.stringify(params))
  },
  getDb(params) {
    return axios.post(`/mobile/coin_funds/exchange`, qs.stringify(params))
  },
  addDb(params) {
    return axios.post(`/mobile/coin_funds/exchange_add`, qs.stringify(params))
  },
  getDbHistory(params) {
    return axios.post(`/mobile/coin_funds/exchange_lists`, qs.stringify(params))
  },
  getHz(params) {
    return axios.post(`/mobile/transfer/index`, qs.stringify(params))
  },
  get_newhz(params) {
    return axios.post(`/mobile/transfer/transfer_index`, qs.stringify(params))
  },
  addHz(params) {
    return axios.post(`/mobile/transfer/saveadd`, qs.stringify(params))
  },
  getHzHistory(params) {
    return axios.post(`/mobile/transfer/lists`, qs.stringify(params))
  },
  getReward(params) {
    return axios.post(`/mobile/coin/reward`, qs.stringify(params))
  },
  getCclConfigInfo(params) {
    return axios.post(`/mobile/config/lists`, qs.stringify(params))
  },
  getCclSeasonList(params) {
    return axios.post(`/mobile/plugin_guess/month_red`, qs.stringify(params))
  },
  get_recharge_ewm(params) {
    //充值二维码
    return axios.post(`/mobile/block/recharge`, qs.stringify(params))
  },  
  get_recharge_index(params) {
    //充值二维码
    return axios.post(`/mobile/block/index`, qs.stringify(params))
  },

  check_recharge(params) {
    // 充值是否成功
    return axios.post(`/mobile/block/is_success`, qs.stringify(params))
  },
  get_recharge_history(params) {
    //充值流水
    return axios.post(`/mobile/block/recharge_lists`, qs.stringify(params))
  },
  get_ava(params) {
    //获取用户头像 传username
    return axios.post(`/mobile/transfer/userinfo`, qs.stringify(params))
  },
  getCoinList(params) {
    return axios.post(`/mobile/coin_currency/lists`, qs.stringify(params))
  },
  getCoinPage(params) {
    return axios.post(`/mobile/coin_currency/index`, qs.stringify(params))
  },
  getPtbInfo(params) {
    return axios.post(`/mobile/coin_currency/kline`, qs.stringify(params))
  },
  getZjdh(params) {
    return axios.post(`/mobile/transfer1/transfer1_index`, qs.stringify(params))
  },
  subNumber(params) {
    return axios.post(`/mobile/transfer1/saveadd`, qs.stringify(params))
  },
  getZjdhHistoryList(params) {
    return axios.post(`/mobile/transfer1/lists`, qs.stringify(params))
  },
  get_c2c_coin(params) {
    return axios.post(`/mobile/c2c/coin`, qs.stringify(params))
  },
  get_coin_currency_edit(params) {
    return axios.post(`/mobile/coin_currency/edit`, qs.stringify(params))
  },

  get_coin_lever_futures(params) {
    return axios.post(`/mobile/coin_lever/futures`, qs.stringify(params))
  },
  get_coin_lever_maifall(params) {
    return axios.post(`/mobile/coin_lever/maifall`, qs.stringify(params))
  },
  get_coin_lever_lists(params) {
    return axios.post(`/mobile/coin_lever/lists`, qs.stringify(params))
  },
  get_coin_lever_delivery(params) {
    return axios.post(`/mobile/coin_lever/delivery`, qs.stringify(params))
  },
  is_userexit(params) {
    return axios.post(`/mobile/power/is_tshare`, qs.stringify(params));
  },
  mnemonic_login(params) {
    return axios.post(`/mobile/power/block_mnemonic_login`, qs.stringify(params));
  },
  privatekey_login(params) {
    return axios.post(`/mobile/power/block_privatekey_login`, qs.stringify(params));
  },
  get_word(params) {
    return axios.post(`/mobile/power/block_mnemonic`, qs.stringify(params));
  },
  reg(params) {
    return axios.post(`/mobile/power/block_reg`, qs.stringify(params));
  },
  export_privatekey(params) {
    return axios.post(`/mobile/ucenter/user_privatekey`, qs.stringify(params));
  },
}
export default getCoin
