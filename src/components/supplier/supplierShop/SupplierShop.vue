<template>
  <div class="a-z-shop">
    <van-nav-bar title="商户信息" left-text left-arrow class="navbar" @click-left="toBack" />
    <van-cell-group title="商户logo">
      <div class="a-z-imgs">
        <div class="box_img">
          <div class="box_img_img" v-if="params.shop_logo!=''">
            <img width="80" height="80" :src="$fnc.getImgUrl(params.shop_logo)" />
            <span @click="params.shop_logo=''">
              <van-icon name="cross" size="18" color="#fff" />
            </span>
          </div>
          <van-uploader multiple :after-read="afterRead" class="up_img_add" v-if="params.shop_logo==''">
            <div class="up_inp_refund">
              <van-icon name="close" class="fa fa-camera" size="37px" color="#c2c2c2" />
              <p>添加商户logo</p>
            </div>
          </van-uploader>
        </div>
      </div>
    </van-cell-group>

    <van-cell-group title="商户二维码">
      <div class="a-z-imgs">
        <div class="box_img">
          <div class="box_img_img" v-if="params.shop_wechat!=''">
            <img width="80" height="80" :src="$fnc.getImgUrl(params.shop_wechat)" />
            <span @click="params.shop_wechat=''">
              <van-icon name="cross" size="18" color="#fff" />
            </span>
          </div>
          <van-uploader multiple :after-read="afterRead1" class="up_img_add" v-if="params.shop_wechat==''">
            <div class="up_inp_refund">
              <van-icon name="close" class="fa fa-camera" size="37px" color="#c2c2c2" />
              <p>添加商户二维码</p>
            </div>
          </van-uploader>
        </div>
      </div>
    </van-cell-group>

    <van-cell-group class="ad_shop mar-top-8" title="商户基本信息">
      <van-cell class="cell fx" title="商家名称">
        <van-field @blur="windowScorll" class="input_cells" v-model="params.shop_title" size="large" placeholder input-align="right"></van-field>
      </van-cell>

      <van-cell title="商品分类" class="cell" :value="cateTitle || '请选择商品分类'" id="trigger" @click="show=true">
        <van-icon name="arrow" slot="right-icon" size="14px" />
      </van-cell>

      <van-cell title="商家地址" class="cell" :value="cs"  @click="seladdressshow =true">
        <van-icon name="arrow" slot="right-icon" size="14px" />
      </van-cell>

      <van-cell class="cell" title="区域街道">
        <van-field @blur="windowScorll" class="input_cells" v-model="params.shop_address" placeholder="街道门牌等信息" input-align="right"></van-field>
      </van-cell>
      <van-cell class="cell" title="商家电话">
        <van-field @blur="windowScorll" class="input_cells" v-model="params.shop_tel" placeholder type="tel" input-align="right"></van-field>
      </van-cell>
    </van-cell-group>

    <van-button type="primary" size="large" class="pay_order_btn mar-top-8" @click="subSupplier">提交</van-button>
    <ImgCrop :imgSrc="imgSrc" @sendImg="getImg" v-show="showCrop" />

    <van-popup v-model="show" round position="bottom">
      <div class="fx" style="justify-content: space-evenly;">
        <van-button type="default" @click="show=false" style="width:50%">取消</van-button>
        <van-button type="primary" @click="show=false" style="width:50%">确认</van-button>
      </div>
      <van-checkbox-group v-model="result" class="mar-top-8 cate-tree">
        <van-cell-group>
          <van-cell v-for="(item, index) in list" clickable :key="item.id" :title="`${item.title}`" @click="toggle(index)">
            <van-checkbox :name="item.id" ref="checkboxes" slot="right-icon" />
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </van-popup>
    <selAddress :level="4" :show="seladdressshow" @confirm="confirmaddress"></selAddress>
  </div>
</template>

<script>
import { Field, SwitchCell, Checkbox, CheckboxGroup } from "vant";
import ImgCrop from "@/components/currency/ImgCrop/ImgCrop.vue";
import { setTimeout } from "timers";
import PickerExtend from "picker-extend";
import axios from "axios";

import selAddress from "@/components/currency/selAddress/selAddress"

export default {
  data () {
    return {
      seladdressshow: false,
      show: false,
      showCrop: false,
      imgSrc: "",
      isLogo: true,
      params: {
        shop_title: "",
        shop_tel: "",
        shop_province: "",
        shop_logo: "",
        shop_city: "",
        shop_cate: "",
        shop_area: "",
        shop_town: "",
        shop_address: "1",
        shop_wechat: ""
      },

      list: ["a", "b", "c"],
      result: [],
      cateTitle: "",
      cs: "请选择地址"
    };
  },
  components: {
    [Field.name]: Field,
    [SwitchCell.name]: SwitchCell,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    ImgCrop,
    selAddress
  },
  created () {
    this.getCate();
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
    subSupplier () {
      var that = this;
      that.$dialog
        .confirm({
          message: "是否提交商户信息？"
        })
        .then(() => {
          var params = {};
          params = that.params;
          that.$api.getSupplier.saveEditSupplierShopInfo(params).then(res => {
            if (res.code == 200) {
              that.$toast.success("提交成功");
              setTimeout(() => {
                that.toBack();
              }, 1500);
            }
          });
        })
        .catch(() => { });
    },
    getSupplierShopS () {
      this.$api.getSupplier.getSupplierShopInfo({}).then(res => {
        if (res.code == 200) {
          this.params = res.result;
          this.result = res.result.shop_cate.split("@");
          this.cs = this.$fnc.deleteNumber(
            res.result.shop_province +
            res.result.shop_city +
            res.result.shop_town +
            res.result.shop_area
          );
        }
      });
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle();
    },
    getCate () {
      this.$api.getShop.getShopCate({}).then(res => {
        if (res.code == 200) {
          this.list = res.result.cate;
          this.getSupplierShopS();
        }
      });
    },
    getImg (file) {
      var that = this;
      this.$fnc.imgCompress(file, function (src) {
        if (that.isLogo) {
          that.params.shop_logo = src;
        } else {
          that.params.shop_wechat = src;
        }
      });
    },
    afterRead (file) {
      this.showCrop = true;
      this.imgSrc = file.content;
      this.isisLogo = true;
    },
    afterRead1 (file) {
      this.showCrop = true;
      this.imgSrc = file.content;
      this.isLogo = false;
    }
  },
  watch: {
    result (val) {
      var chenk = this.$fnc.getCheck(val, this.list);
      this.params.shop_cate = val.join("@");
      this.cateTitle = "";
      for (var i in chenk) {
        this.cateTitle += " / " + chenk[i].title;
      }
      this.cateTitle = this.cateTitle.slice(2);
    }
  }
};
</script>




<style lang="less" scoped>
.cate-tree {
  height: 350px;
  overflow: auto;
}
.box_img_img_details {
  position: relative;
  > span {
    position: absolute;
    top: 0;
    right: 6px;
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
.box_img_img_details {
  padding: 0 6px;
  display: block;
}
.a-z-shop {
  font-size: 14px;
  line-height: 1;
  font-weight: 400;
  background: #f4f4f4;
  overflow: auto;
  .a-z-imgs {
    margin-top: 13px;
    min-height: 100px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.box_img {
  background: #fff;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 10px;
  > p {
    font-weight: bold;
    line-height: 0.64rem;
    margin-bottom: 10px;
  }
  .box_img_img {
    display: inline-block;
    vertical-align: bottom;
    margin: 0 5px 5px 0;
    position: relative;
    border: 1px dashed #f9f9f9;
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
}
.up_inp_refund {
  p {
    color: #c2c2c2;
    font-size: 13px;
    margin-top: 3px;
  }
}
.up_img_add {
  height: 80.1px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
}
.mar-top-8 {
  margin-top: 8px;
}
.ad_shop2 {
  div:first-child {
    padding: 0.26667rem 0.4rem 0;
  }
  div:last-child {
    padding: 0 0.4rem 0.26667rem;
  }
}
.cell {
  align-items: center;
  color: #323232;
  .van-cell__value {
    justify-content: flex-end;
  }
  .input_cells {
    padding: 0 0rem;
  }
  .custom_right {
    transform: rotateZ(90deg);
  }
  .ren {
    color: #4d4d4d;
    padding-left: 6px;
    i {
      vertical-align: middle;
    }
  }
  .red_cell {
    color: #ff4b32;
  }
  .piclink {
    display: inline-block;
    width: 80px;
    height: 80px;
    vertical-align: bottom;
    position: relative;
    .close {
      position: absolute;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      text-align: center;
      line-height: 20px;
      background: red;
      color: #fff;
    }
    > img {
      width: 80px;
      height: 80px;
    }
  }
  .piclink + div {
    display: inline-block;
  }
}
</style>
