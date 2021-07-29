<template>
  <div class="s-a-con supplier_sq">
    <van-nav-bar title="寺庙入驻" left-text left-arrow class="navbar" @click-left="$router.back()" />
    <van-notice-bar v-show="params.is_check == 2" :text="`审核不通过！${params.shop_remark || ''}`" color="#fff" wrapable background="#ff6a6a"
        left-icon="bulb-o" />
    <div class="s-a-box" v-show="info.supplier_company_title.value==1 || info.supplier_company_region.value==1 || info.supplier_company_add.value==1">
      <h2>填写寺庙管理人信息</h2>
      <van-cell-group :border="false">
        <van-field @blur="windowScorll" v-model="params.title" required clearable
            :disabled="params.is_check == '0' || params.is_check == 1 ? true :false " label="寺庙名称" v-if="info.supplier_company_title.value==1" />

        <van-cell title="所属区域" style="height:56px" required is-link :disabled="params.is_check == '0' || params.is_check == 1 ? true :false "
            :value="cs" v-show="info.supplier_company_region.value==1" @click="seladdressshow = true" />

        <van-field @blur="windowScorll" v-model="params.add" required clearable
            :disabled="params.is_check == '0' || params.is_check == 1 ? true :false " label="寺庙地址" v-if="info.supplier_company_add.value==1" />
      </van-cell-group>
    </div>
    <div class="s-a-box" v-if="info.supplier_company_name.value==1 || info.supplier_company_card.value==1">
      <h2>填写寺庙代表人信息</h2>
      <van-cell-group :border="false">
        <van-field @blur="windowScorll" v-model="params.name" required :disabled="params.is_check == '0' || params.is_check == 1 ? true :false "
            clearable label="姓名" v-if="info.supplier_company_name.value==1" />
        <van-field @blur="windowScorll" v-model="params.supplier_company_tel" required
            :disabled="params.is_check == '0' || params.is_check == 1 ? true :false " clearable label="电话"
            v-if="info.supplier_company_tel.value==1" />
        <van-field @blur="windowScorll" v-model="params.card" required :disabled="params.is_check == '0' || params.is_check == 1 ? true :false "
            clearable label="身份证号" v-if="info.supplier_company_card.value==1" />
      </van-cell-group>
    </div>
    <div class="s-a-box" v-if="(info.xxzfintegral && info.xxzfintegral.value==1) || (info.xxzffxyjb && info.xxzffxyjb.value==1)">
      <h2>线下支付</h2>
      <van-cell-group :border="false">
        <van-field @blur="windowScorll" v-model="params.xxzfintegral" required
            :disabled="params.is_check == '0' || params.is_check == 1 ? true :false " clearable :label="`线下支付送${integral}比例`"
            v-if="info.xxzfintegral.value==1" label-width="150px" />
        <van-field @blur="windowScorll" v-model="params.xxzffxyjb" required :disabled="params.is_check == '0' || params.is_check == 1 ? true :false "
            clearable label="收款码支付折扣比例" v-if="info.xxzffxyjb.value==1" label-width="150px" />
      </van-cell-group>
    </div>
    <div class="s-a-box"
        v-if="info.supplier_company_cardpositive.value==1 || info.supplier_company_cardnegative.value==1 || info.supplier_company_license.value==1">
      <h2>上传资质信息</h2>

      <div class="s-a-box-card fx" v-if="info.supplier_company_cardpositive.value==1">
        <div>
          <p>负责人身份证头像图</p>
          <div class="s-a-box-card-up">
            <van-uploader multiple :after-read="afterRead1" class="up_img_add">
              <img :src="params.cardpositive || require('../../../assets/img/supplier/card_z1.png')" alt />
            </van-uploader>
          </div>
        </div>
        <div>
          <p>示例</p>
          <img src="../../../assets/img/supplier/card_z.png" alt />
        </div>
      </div>
      <div class="s-a-box-card fx" v-if="info.supplier_company_cardnegative.value==1">
        <div>
          <p>负责人身份证国徽图</p>
          <div class="s-a-box-card-up">
            <van-uploader multiple :after-read="afterRead2" class="up_img_add">
              <img :src="params.cardnegative || require('../../../assets/img/supplier/card_f1.png')" alt />
            </van-uploader>
          </div>
        </div>
        <div>
          <p>示例</p>
          <img src="../../../assets/img/supplier/card_f.png" alt />
        </div>
      </div>
      <div class="s-a-box-card fx" v-if="info.supplier_company_license.value==1">
        <div>
          <p>上传营业执照</p>
          <div class="s-a-box-card-up">
            <van-uploader multiple :after-read="afterRead3" class="up_img_add">
              <img :src="params.license || require('../../../assets/img/supplier/card_f1.png')" alt />
            </van-uploader>
          </div>
        </div>
        <div>
          <p>示例</p>
          <img src="../../../assets/img/supplier/card_y.png" alt />
        </div>
      </div>
      <div class="s-a-box-card fx" v-if="info.supplier_company_check.value==1">
        <div>
          <p>上传厂家授权</p>
          <div class="s-a-box-card-up">
            <van-uploader multiple :after-read="afterRead5" class="up_img_add">
              <img :src="params.supplier_company_check || require('../../../assets/img/supplier/card_f1.png')" alt />
            </van-uploader>
          </div>
        </div>
        <div>
          <p>示例</p>
          <img style="padding-left: 50px;" src="../../../assets/img/supplier/card_cj.png" alt />
        </div>
      </div>
    </div>

    <div class="s-a-box" v-if="info.supplier_company_product.value==1">
      <h2>上传主营商品样图</h2>
      <div class="s-a-imgs">
        <div class>
          <div v-for="(item,i) in image" :key="i" class="box_img_img_details">
            <img width="100%" :src="item" />
            <span @click="closeImg(i)" v-if="params.is_check == null || params.is_check == '0'|| params.is_check == '' || params.is_check == 2">
              <van-icon name="cross" size="18" color="#fff" />
            </span>
          </div>
          <van-uploader multiple :after-read="afterRead4" class="up_img_add"
              v-if="params.is_check == null || params.is_check == '0' || params.is_check == '' || params.is_check == 2">
            <div class="up_inp_refund van-uploader__upload">
              <van-icon name="plus" size="37px" color="#c2c2c2" />
            </div>
          </van-uploader>
        </div>
      </div>
    </div>
    <div class="s-a-box" v-if="protocol && protocol.id > 0">
      <div class="check_box">
        <van-checkbox icon-size="18px" v-model="is_protocol">
          我已经阅读并了解了
          <span @click="$router.push('/useragreement?id=' + protocol.id)">【{{protocol.title}}】</span>
        </van-checkbox>
      </div>
    </div>
    <van-button v-if="load" type="primary" size="large" class="pay_order_btn" @click="subAppliy"
        :disabled="params.is_check==1 || params.is_check=='0'">{{params.is_check==1?'申请通过':params.is_check=='0'?'审核中':"确认申请"}}</van-button>
    <!-- <van-popup v-model="show" style="height:100%;width:100%"> -->
    <ImgCrop :imgSrc="imgSrc" @sendImg="getImg" v-show="show" />
    <!-- </van-popup> -->

    <selAddress :level="4" :show="seladdressshow" @confirm="confirmaddress"></selAddress>
  </div>
</template>


<script>
import { NoticeBar } from "vant";
import { Field, Area, Checkbox, CheckboxGroup } from "vant";
import ImgCrop from "@/components/currency/ImgCrop/ImgCrop.vue";
import { setTimeout } from "timers";

import axios from "axios";
import selAddress from "@/components/currency/selAddress/selAddress"
import { mapState } from "vuex";
export default {
  name: "supplierapply",
  components: {
    [Field.name]: Field,
    [Area.name]: Area,
    [NoticeBar.name]: NoticeBar,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    ImgCrop,
    selAddress
  },
  data () {
    return {
      seladdressshow: false,
      is_protocol: false,
      protocol: null,
      username: "",
      load: false,
      tel: "",
      sms: "",
      pic: [],
      imgSrc: "",
      show: false,
      image: [],
      cs: "请选择地址",
      address: false,
      info: {
        supplier_company_title: { value: "0" },
        supplier_company_region: { value: "0" },
        supplier_company_add: { value: "0" },
        supplier_company_name: { value: "0" },
        supplier_company_check: { value: "0" },
        supplier_company_card: { value: "0" },
        supplier_company_cardpositive: { value: "0" },
        supplier_company_cardnegative: { value: "0" },
        supplier_company_license: { value: "0" },
        supplier_company_product: { value: "0" },
        xxzffxyjb: { value: "0" },
        xxzfintegral: { value: "0" },
        supplier_company_tel: { value: '0' }
      },
      params: {
        is_check: "",
        supplier_company_check: "", //上传厂家授权
        title: "", //寺庙名称
        province: "", //省
        city: "", //市
        area: "", //区
        add: "", //寺庙地址
        name: "", //姓名
        card: "", //身份证号
        town: "",
        cardpositive: "", //身份证正面
        cardnegative: "", //身份证反面
        license: "", //营业执照
        image: "", //图片
        tel: ""
      }
    };
  },
  created () {
    this.getAddShopsConfig();
  },
  computed: {
    ...mapState({
      integral: state => state.config.shop.integral_cn
    })
  },
  mounted () {

  },
  methods: {
    confirmaddress (data) {
      this.params.province = data[0] || '';
      this.params.city = data[1] || '';
      this.params.area = data[2] || '';
      this.params.town = data[3] || '';
      this.cs = `${data[0] || ''}${data[1] || ''}${data[2] || ''}${data[3] || ''} `
      this.seladdressshow = false;
    },
    closeImg (i) {
      this.image.splice(i, 1);
    },
    afterRead1 (file) {
      //负责人身份证头像图
      var that = this;
      this.$fnc.imgCompress(file.content, function (src) {
        that.params.cardpositive = src;
      });
    },
    afterRead2 (file) {
      //负责人身份证头像图
      var that = this;
      this.$fnc.imgCompress(file.content, function (src) {
        that.params.cardnegative = src;
      });
    },
    afterRead3 (file) {
      //负责人身份证头像图
      var that = this;
      this.$fnc.imgCompress(file.content, function (src) {
        that.params.license = src;
      });
    },
    afterRead4 (file) {
      this.show = true;
      this.imgSrc = file.content;
    },
    afterRead5 (file) {
      //上传厂家授权
      var that = this;
      this.$fnc.imgCompress(file.content, function (src) {
        that.params.supplier_company_check = src;
      });
    },
    getImg (file) {
      var that = this;
      this.$fnc.imgCompress(file, function (src) {
        that.image.push(src);
      });
    },
    getAddShopsConfig () {
      this.$api.getSupplier.getAddShopsConfig({}).then(res => {
        if (res.code == 200) {
          this.load = true;
          this.info = res.result.config;
          this.protocol = res.result.protocol;
          if (res.result.content.title) {
            this.params = res.result.content;
            this.cs = this.$fnc.deleteNumber(
              this.params.province +
              this.params.city +
              this.params.area +
              this.params.town
            );
            this.image = [];
            for (var i in this.params.image) {
              this.image.push(this.params.image[i].piclink);
            }
          }
        }
      });
    },
    subAppliy () {
      if (this.protocol && this.protocol.id > 0 && this.is_protocol == false) {
        this.$toast.fail("请阅读并同意" + this.protocol.title);
        return;
      }
      if (this.info.xxzffxyjb.value == 1 && this.params.xxzffxyjb == "") {
        this.$toast.fail("请填写线下支付送" + this.integral + "比例");
      } else if (
        this.info.xxzfintegral.value == 1 &&
        this.params.xxzfintegral == ""
      ) {
        this.$toast.fail("收款码支付折扣比例");
      } else {
        var that = this;
        that.$dialog
          .confirm({
            message: "是否提交申请"
          })
          .then(() => {
            var params = that.params;
            params.image = that.image.join("@");
            that.$api.getSupplier.setSupplierApply(params).then(res => {
              if (res.code == 200) {
                that.$toast.success("申请已提交，等待审核");
                setTimeout(() => {
                  that.toBack();
                }, 1500);
              }
            });
          })
          .catch(() => { });
      }
    }
  }
};
</script>


<style lang="less" scoped>
.box_img_img_details {
  position: relative;
  > span {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ff2f57;
  }
}
.pay_order_btn {
  background: linear-gradient(to right top, #ff0204, #ff2f60);
  border: none !important;
  // position: absolute;
  width: 100%;
  bottom: 0;
}
.s-a-con {
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  background: #f3f3f3;
  overflow: auto;
  > .s-a-box {
    background: #fff;
    margin-bottom: 10px;
    h2 {
      margin: 0;
      font-size: 14px;
      color: rgba(69, 90, 100, 0.6);
      padding: 19px 15px 15px;
    }
    > .s-a-box-card {
      padding: 0 15px 32px;
      align-items: flex-start;
      > div {
        width: 145px;
        > p {
          color: #141414;
          margin-bottom: 15px;
        }
        > img {
          height: 90px;
          max-width: 100%;
        }
      }
      .s-a-box-card-up {
        border: 2px solid #fd7041;
      }
    }
  }
}
.up_img_add {
  width: 100%;
  height: 90px;
  img {
    width: 100%;
    height: 90px;
  }
}
.s-a-imgs {
  padding: 0 15px;
}
.check_box {
  width: 100%;
  padding: 10px 15px;
  font-size: 14px;
}
.check_box span {
  color: red;
}
</style>

