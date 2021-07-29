<template>
  <div class="con_bg">
    <van-nav-bar :title="$h('实名认证')" left-text left-arrow class="navbar" @click-left="toBack" />
    <form>
      <div class="cu-form-group margin-top">
        <div class="title xm hongx">{{$h('真实姓名')}}</div>
        <van-cell-group class :border="false">
          <van-field @blur="windowScorll" v-model="userInfoData.realName" type="text" :placeholder="$h('请使用真实姓名')" clearable />
        </van-cell-group>
      </div>
      <div class="cu-form-group">
        <div class="title xm hongx">{{$h('身份证号')}}</div>
        <van-cell-group class :border="false">
          <van-field @blur="windowScorll" v-model="userInfoData.cardNo" type="text" :placeholder="$h('请输入身份证号')" clearable />
        </van-cell-group>
      </div>
      <div class="cu-form-group">
        <div class="title xm hongx">{{$h('地址')}}</div>
        <van-cell-group class :border="false">
          <van-field @blur="windowScorll" v-model="cateTitle" @click="seladdressshow =true" disabled type="text" :placeholder="$h('请选择地址')"
              right-icon="arrow" clearable />
        </van-cell-group>
      </div>
      <!-- <div class="padding" v-if="userInfo.name">
        <div class="cu-btn bg-gradual-orange block margin-tb-sm lg but" disabled="true">已实名</div>
      </div> -->
      <div class="cu-form-group mar_top">
        <div class="title">
         {{$h('上传身份证证件(选填)')}}
          <span style="color: #999;"></span>
        </div>
      </div>
      <div class="cu-form-group">
        <div class="title beiz">
          <div style="color: #999;">{{$h('温馨提示：请上传身份证正反面的截图，请勿裁剪涂改，保证图片信息清晰显示，否则无法审核通过')}}</div>
        </div>
      </div>
      <div class="bg-gradual-write up_img_con">
        <div class="up_div">
          <div class="up_bor" @click="imagePreview(wximgList)" :style="'background-image:url(' + $fnc.getImgUrl(wximgList) +')'"
              v-show="wximgList!=''"></div>
          <div class="cu-tag close_img bg-red">
            <van-icon name="cross" color="#fff" size="14" @click="closeImg($h('正面'))" />
          </div>

          <van-uploader :after-read="onRead" v-if="wximgList==''">
            <div class="up_bor">
              <div class="up_img"></div>
            </div>
          </van-uploader>
          <div class="up_text tc">{{$h('上传身份证正面')}}</div>
        </div>
        <div class="up_div">
          <div @click="imagePreview(alipyImgList)" class="up_bor" :style="'background-image:url(' + $fnc.getImgUrl(alipyImgList) +')'"
              v-show="alipyImgList!=''"></div>
          <div class="cu-tag close_img bg-red" @click="closeImg($h('反面'))">
            <van-icon name="cross" color="#fff" size="14" @click="closeImg('支付宝')" />
          </div>
          <van-uploader :after-read="onReadA" v-if="alipyImgList==''">
            <div class="up_bor">
              <div class="up_img1"></div>
            </div>
          </van-uploader>
          <div class="up_text tc">{{$h('上传身份证反面')}}</div>
        </div>
      </div>
      <!-- <div class="up_beizhu">
        <div>
          <span>为什么需要上传支付宝/微信收款二维码？</span>
        </div>
        <div class="size_le">
          <span>用户通过C2C交易市场购买您挂卖的{{$store.state.config.shop.coin_title}}时，平台会自动将您的收款码图片提供给买方，买方将根据该收款码信息付款给您，错误信息可能导致无法收到款项，平台保证您的信息安全，绝不对外泄露</span>
        </div>
      </div>-->
      <div class="padding">
        <div class="cu-btn bg-gradual-orange block but margin-tb-sm lg" @click="subInfo"
          :style="$store.state.config.shop.button_bj_color?{background:$store.state.config.shop.button_bj_color}:{}">{{$h('确定')}}</div>
      </div>
    </form>

    <selAddress :level="4" :show="seladdressshow" @confirm="confirmaddress"></selAddress>
  </div>
</template>


<script>
import axios from "axios";
import { Field, ImagePreview } from "vant";

import selAddress from "@/components/currency/selAddress/selAddress"
export default {
  name: "alpaywx",
  data () {
    return {
      seladdressshow: false,
      params: {
        address: "",
        province: "",
        city: "",
        area: "",
        town: ""
      },
      mobileSelect4: false,
      cateTitle: "",
      // index: -1,
      avatar: "",
      wximgList: "",
      alipyImgList: "",
      userInfoData: {
        realName: "",
        cardNo: ""
      },
      iswx: true,
      src: "",
      userInfo: this.$store.state.user
    };
  },
  components: {
    [Field.name]: Field,
    selAddress
  },
  computed: {},
  methods: {
    confirmaddress (data) {
      this.params.province = data[0] || '';
      this.params.city = data[1] || '';
      this.params.area = data[2] || '';
      this.params.town = data[3] || '';
      this.cateTitle = `${data[0] || ''}${data[1] || ''}${data[2] || ''}${data[3] || ''} `
      this.seladdressshow = false;
    },
    sel_address () {
      if (!this.userInfo.name) {
        this.mobileSelect4.show();
      }
    },
    imagePreview (src) {
      ImagePreview([this.$fnc.getImgUrl(src)]);
    },
    closeImg (str) {
      this.$dialog
        .confirm({
          title: this.$h("提示"),
          message: this.$h("确定删除") + str + this.$h("图片吗")
        })
        .then(() => {
          if (str == this.$h("正面") ) {
            this.wximgList = "";
          } else {
            this.alipyImgList = "";
          }
        });
    },

    onRead (file) {
      this.iswx = true;
      this.cpimgOk(file.content);
      // this.crooption.img = file.content;
    },
    onReadA (file) {
      this.iswx = false;
      this.cpimgOk(file.content);
    },
    cpimgOk (file) {
      this.$toast.loading({
        mask: false,
        message:this.$h("上传中..."),
        duration: 0
      });
      let that = this;

      var img = new Image();

      img.src = file;
      // base64地址图片加载完毕后执行
      img.onload = function () {
        // 缩放图片需要的canvas（也可以在DOM中直接定义canvas标签，这样就能把压缩完的图片不转base64也能直接显示出来）
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        // 图片原始尺寸
        var originWidth = img.width;
        var originHeight = img.height;
        // 最大尺寸限制，可通过设置宽高来实现图片压缩程度
        var maxWidth = 750,
          maxHeight = 750;
        // 目标尺寸
        var targetWidth = originWidth,
          targetHeight = originHeight;
        // 图片尺寸超过最大尺寸的限制
        if (originWidth > maxWidth || originHeight > maxHeight) {
          if (originWidth / originHeight > maxWidth / maxHeight) {
            // 更改宽度，按照宽度限定尺寸
            targetWidth = maxWidth;
            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
          } else {
            targetHeight = maxHeight;
            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
          }
        }
        //对图片进行缩放
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // 清除画布
        context.clearRect(0, 0, targetWidth, targetHeight);
        // 图片压缩
        context.drawImage(img, 0, 0, targetWidth, targetHeight);
        /*第一个参数是创建的img对象；第二三个参数是左上角坐标，后面两个是画布区域宽高*/
        //压缩后的base64文件
        var newUrl = canvas.toDataURL("image/jpeg", 0.92);
        let file = that.convertBase64UrlToBlob(newUrl);
        var fd = new FormData();
        fd.append("file", file, "file_" + Date.parse(new Date()) + ".jpg");
        // fd.append("folder", 'product');

        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };

        axios.post("/api/common/upload/index/", fd, config).then(res => {
          if (res.data.code == 200) {
            that.avatar = res.data.result;
            if (that.iswx) {
              that.wximgList = res.data.result;
            } else {
              that.alipyImgList = res.data.result;
            }
            that.$toast.clear();
          } else {
            that.$toast.fail(this.$h("图片上传失败"));
          }
        });
      };
    },
    convertBase64UrlToBlob (urlData) {
      let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    },
    subInfo () {
      if (
        this.userInfoData.realName == "" ||
        this.userInfoData.realName.length > 6
      ) {
        this.$toast.fail(this.$h("姓名不能为空，且最多不超过6个字符"));
        return false;
      } else if (
        this.userInfoData.cardNo == "" ||
        this.userInfoData.cardNo.length > 20
      ) {
        this.$toast.fail(this.$h("身份证不能为空，且最多不超过20个字符"));
        return false;
      }
      var params = {
        cardNo: this.userInfoData.cardNo,
        realName: this.userInfoData.realName,
        card_face: this.wximgList || "",
        card_bg: this.alipyImgList || "",
        province: this.params.province,
        city: this.params.city,
        area: this.params.area,
        town: this.params.town
      };
      this.$api.getSetting.setRealname(params).then(res => {
        if (res.code == 200) {
          this.$toast.success(this.$h("操作成功"));
          setTimeout(() => {
            this.$store.dispatch("getUser");
            this.toBack();
          }, 3000);
        }
      });
    }
  },
  created () {
    var info = this.$store.state.user;
    this.userInfoData = {
      realName: info.name,
      cardNo: info.card
    };

    this.wximgList = info.card_face || "";
    this.alipyImgList = info.card_bg || "";
    if (info.province) {
      this.params.province = info.province;
      this.params.city = info.city;
      this.params.area = info.area;
      this.cateTitle = info.province + "-" + info.city + "-" + info.area;
      if (info.town != "") {
        this.cateTitle = this.cateTitle + "-" + info.town;
        this.params.town = info.town;
      }
    }

  },
  mounted () {

  }
};
</script>


<style scoped>
.up_div {
  position: relative;
  margin: 0 15px;
}
.title {
  font-weight: bold;
  min-height: 30px !important;
}
.title text {
  font-weight: normal;
}
.tishi {
  background: none;
}
.beiz > div {
  min-height: 30px;
  line-height: 1.5;
  height: auto;
  padding-right: 0;
  font-size: 13px;
  padding: 10px 0;
  font-weight: normal !important;
}
.tishi > div {
  color: #999999;
  font-size: 12px;
}
.bg-sub {
  background: #d1d1d1;
  border-radius: 0;
  color: #fff;
  font-size: 12px;
}
.up_img {
  width: 216px;
  height: 148px;
  background: url(../../assets/img/setting/card.png) no-repeat;
  background-size: 100% 100%;
}
.up_img1 {
  width: 216px;
  height: 148px;
  background: url(../../assets/img/setting/card1.png) no-repeat;
  background-size: 100% 100%;
}
.up_view {
  width: 216px;
  height: 148px;
  text-align: center;
  margin: 0 11px;
  position: relative;
  margin-top: 27px;
}
.up_bor {
  border-radius: 2px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  width: 216px;
  height: 148px;
}
.up_text {
  color: #5e6266;
  text-align: center;
  padding: 10px;
  font-size: 12px;
}
.up_img_con {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 15px 0 0px 0;
}
.up_beizhu {
  background: #fffff5;
  padding: 5px 15px;
  font-size: 12px;
}
.up_beizhu > div > span {
  color: #5e6266;
  font-size: 12px;
}
.size_le {
  line-height: 1.5;
}
.close_img {
  position: absolute;
  top: 0;
  right: 0;
}
.title {
  color: #000;
  min-width: 80px;
  font-size: 15px !important;
  font-weight: bold;
}
</style>