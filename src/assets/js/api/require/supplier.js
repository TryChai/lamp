import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块
const getSupplier = {
  getAddShopsConfig(params) {
    return axios.post(`/mobile/supplier/find_apply`, qs.stringify(params));
  },
  setSupplierApply(params) {
    return axios.post(`/mobile/supplier/apply`, qs.stringify(params));
  },
  getSupplierComplaintTpyes(params) {
    return axios.post(`/mobile/supplier/complaint_tpyes`, qs.stringify(params));
  },
  setSupplierComlpaint(params) {
    return axios.post(`/mobile/supplier/complaint`, qs.stringify(params));
  },
  getSupplierList(params) {
    return axios.post(`/mobile/supplier/product`, qs.stringify(params));
  },
  addSupplierShop(params) {
    return axios.post(`/mobile/supplier/addsave_product`, qs.stringify(params));
  },
  delSupplierShop(params) {
    return axios.post(`/mobile/supplier/del_product`, qs.stringify(params));
  },
  editproductSupplier(params) {
    return axios.post(`/mobile/supplier/editproduct`, qs.stringify(params));
  },
  delImg(params) {
    return axios.post(`/mobile/supplier/del_image`, qs.stringify(params));
  },
  saveEditSupplierShop(params) {
    return axios.post(
      `/mobile/supplier/saveedit_product`,
      qs.stringify(params)
    );
  },
  getSupplierMember(params) {
    // 展业会员首页
    return axios.post(`/mobile/supplier/member`, qs.stringify(params));
  },
  getSuplierOrderList(params) {
    return axios.post(`/mobile/supplier/order`, qs.stringify(params));
  },
  getSupplierOrderDetails(params) {
    return axios.post(`/mobile/supplier/order_details`, qs.stringify(params));
  },
  sendMail(params) {
    return axios.post(`/mobile/supplier/order_ship`, qs.stringify(params));
  },
  getSupplierShopInfo(params) {
    return axios.post(`/mobile/supplier/edit_info`, qs.stringify(params));
  },
  saveEditSupplierShopInfo(params) {
    return axios.post(`/mobile/supplier/saveedit_info`, qs.stringify(params));
  },
  supplierPage(params) {
    return axios.post(`/mobile/supplier/page`, qs.stringify(params));
  },
  getSupplierDetails(params) {
    return axios.post(`/mobile/supplier/details`, qs.stringify(params));
  },
  getSupplierApplication(params) {
    return axios.post(`/mobile/supplier/application`, qs.stringify(params));
  },
  addSupplierApplication(params) {
    return axios.post(
      `/mobile/supplier/confirm_order_return`,
      qs.stringify(params)
    );
  },
  get_pageaddress(params) {
    return axios.post(`/mobile/supplier/page_address`, qs.stringify(params));
  },
  get_address_supplier(params) {
    return axios.post(`/mobile/supplier/page_location`, qs.stringify(params));
  },
  get_mail_company(params) {
    return axios.post(`/mobile/order/mail_company`, qs.stringify(params));
  },
  get_supplier_cate(params) {
    return axios.post(`/mobile/supplier/cate_lists`, qs.stringify(params));
  },
  search_supplier_title(params) {
    return axios.post(`/mobile/supplier/page_title`, qs.stringify(params));
  },
  getPageShop(params) {
    return axios.post(`/mobile/supplier/page_shop`, qs.stringify(params));
  },
  getSupplierSlides(params) {
    return axios.post(`/mobile/supplier/page_slide`, qs.stringify(params));
  },
  getExtractList(params) {
    return axios.post(`/mobile/extract/lists`, qs.stringify(params));
  },
  getExtractTitle(params) {
    return axios.post(`/mobile/extract/lists_title`, qs.stringify(params));
  },
  sendServe(params) {
    return axios.post(`/mobile/supplier/order_serve`, qs.stringify(params));
  },
  get_redbag(params) {
    return axios.post(`/mobile/supplier/packet_list`, qs.stringify(params));
  }
};
export default getSupplier;
