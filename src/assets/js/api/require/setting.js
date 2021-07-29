import axios from '../http' // 导入http中创建的axios实例
import qs from 'qs' // 根据需求是否导入qs模块

const getSetting = {
  isAddressBank(params) {
    //提交申诉
    return axios.post(`/mobile/ucenter/address_bank`, qs.stringify(params))
  },
  //我的资料
  findReward(params) {
    return axios.post(`/mobile/power/find_iden`, qs.stringify(params))
  },
  setMyInfo(params) {
    return axios.post(`/mobile/ucenter/complete_info`, qs.stringify(params))
  },
  addAppealWx(params) {
    return axios.post(
      `/mobile/ucenter/alipay_wechat_saveedit`,
      qs.stringify(params)
    )
  },
  setRealname(params) {
    return axios.post(`/mobile/ucenter/sfrz`, qs.stringify(params))
  },
  changePassword(params) {
    return axios.post(`/mobile/ucenter/change_password`, qs.stringify(params))
  },
  changePayPassword(params) {
    return axios.post(`/mobile/ucenter/pay_password`, qs.stringify(params))
  },
  getAppEwm(params) {
    return axios.post(`/mobile/qr/app`, qs.stringify(params))
  },
  setSkzh(params) {
    return axios.post(`/mobile/ucenter/bind_account`, qs.stringify(params))
  },
  getAddres(params) {
    return axios.post(`/mobile/address/show_address`, qs.stringify(params))
  },
  addAress(params) {
    return axios.post(`/mobile/address/add_address`, qs.stringify(params))
  },
  setDefaultAddress(params) {
    return axios.post(`/mobile/address/edit_address`, qs.stringify(params))
  },
  delAddres(params) {
    return axios.post(`/mobile/address/del_address`, qs.stringify(params))
  },
  setWxSetting(params) {
    return axios.post(`/mobile/ucenter/wechat_saveedit`, qs.stringify(params))
  },
  setAlipySetting(params) {
    return axios.post(`/mobile/ucenter/alipay_saveedit`, qs.stringify(params))
  },
  set_default_address(params) {
    return axios.post(`/mobile/address/edit_show`, qs.stringify(params))
  },
  //我的资料
  findMyInfoReward(params) {
    return axios.post(`/mobile/power/my_info_iden`, qs.stringify(params))
  },
}
export default getSetting
