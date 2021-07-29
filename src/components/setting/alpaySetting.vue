<template>
  <div class="con_bg">
    <van-nav-bar
    :title="$h('关联支付宝')"
      left-text=""
      left-arrow
      class="navbar"
       @click-left="toBack"
    />
    <form>
      <div class="cu-form-group margin-top">
        <div class="title hongx sx">{{$h('支付宝姓名')}}</div>
        <van-cell-group class :border="false">
          <van-field  @blur="windowScorll" 
            v-model="userInfoData.alipay_name"
            type="text"
            :placeholder="$h('请使用真实姓名')"
            clearable
          />
        </van-cell-group>
      </div>
      <div class="cu-form-group">
        <div class="title sx hongx">{{$h('支付宝账号')}}</div>
        <van-cell-group class :border="false">
          <van-field  @blur="windowScorll" 
            v-model="userInfoData.alipay"
            type="text"
            :placeholder="$h('请填写正确的支付宝账号(将加密保存)')"
            clearable
          />
        </van-cell-group>
      </div>

      <div class="cu-form-group mar_top">
        <div class="title hongx">
          {{$h('上传支付宝收款码截图')}}
          <span style="color: #999;"></span>
        </div>
      </div>
      <div class="cu-form-group" style="border:none">
        <div class="title beiz">
          <div style="color: #999;">{{$h('温馨提示：请上传支付宝收款二维码的截图，请勿裁剪涂改，保证图片信息清晰显示，否则无法审核通过')}}</div>
        </div>
      </div>
      <div class="bg-gradual-write up_img_con">
        <div  class="box_alea">
          <div class="up_bor" @click="imagePreview(alipyImgList)" :style="'background-image:url(' + $fnc.getImgUrl(alipyImgList) +')'" v-show="alipyImgList" > </div>
          <div class="cu-tag close_img bg-red" v-show="alipyImgList">
              <van-icon
                name="cross"
                color="#fff"
                
                size="14"
                @click="closeImg('支付宝')"
              />
            </div>
          <van-uploader :after-read="onReadA">
            <div class="up_bor" v-show="alipyImgList==''">
              <div class="wx_up_img wx_up_img_zfb"></div>
              <div class="up_text">{{$h('上传支付宝收款码')}}</div>
            </div>
          </van-uploader>
        </div>
      </div>
      <!-- <div class="up_beizhu">
        <div>
          <span>为什么需要上传支付宝/微信收款二维码？</span>
        </div>
        <div class="size_le">
          <span>用户通过C2C交易市场购买您挂卖的{{$store.state.config.shop.coin_title}}时，平台会自动将您的收款码图片提供给买方，买方将根据该收款码信息付款给您，错误信息可能导致无法收到款项，平台保证您的信息安全，绝不对外泄露</span>
        </div>
      </div> -->
      <div class="padding" >
        <div class="cu-btn but bg-gradual-orange block margin-tb-sm lg" @click="subInfo" 
          :style="$store.state.config.shop.button_bj_color?{background:$store.state.config.shop.button_bj_color}:{}">{{$h('确定')}}</div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from "axios";
import { Field, ImagePreview } from "vant";
export default {
  name: "alpaywx",
  data() {
    return {
      // index: -1,
      avatar: "",
      wximgList: "",
      alipyImgList: "",
      userInfoData: {
        alipay_name: "",
        alipay: "",
        wechat: ""
      },
      loadModal: false,
      iswx: true,
      src: "",
      userInfo: this.$store.state.user
    };
  },
  components: {
    [Field.name]: Field
  },
  computed: {},
  methods: {
    imagePreview(src) {
      ImagePreview([this.$fnc.getImgUrl(src)]);
    },
    closeImg(str) {
      this.$dialog
        .confirm({
          title: "提示",
          message: "确定删除" + str + "图片吗"
        })
        .then(() => {
          if (str == "微信") {
            this.wximgList = "";
          } else {
            this.alipyImgList = "";
          }
        });
    },

    onRead(file) {
      this.iswx = true;
      this.cpimgOk(file.content);
    },
    onReadA(file) {
      this.iswx = false;
      this.cpimgOk(file.content);
    },
    cpimgOk(file) {
      this.$toast.loading({
            mask: false,
            message: '上传中...',
            duration:0
      }); 
      let that = this;

      var img = new Image();

      img.src = file;
      // base64地址图片加载完毕后执行
      img.onload = function() {
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
            that.$toast.fail("图片上传失败");
          }
        });
      };
    },
    convertBase64UrlToBlob(urlData) {
      let bytes = window.atob(urlData.split(",")[1]); //去掉url的头，并转换为byte
      //处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length);
      let ia = new Uint8Array(ab);
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
      }
      return new Blob([ab], { type: "image/png" });
    },
    subInfo() {
      if (
        this.userInfoData.alipay_name == "" ||
        this.userInfoData.alipay_name.length > 6
      ) {
        this.$toast.fail("支付宝姓名不能为空，且最多不超过6个字符");
        return false;
      } else if (
        this.userInfoData.alipay == "" ||
        this.userInfoData.alipay.length > 25
      ) {
        this.$toast.fail("支付宝账号不能为空，且最多不超过25个字符");
        return false;
      } else {
        var params = {
          alipay_name: this.userInfoData.alipay_name,
          alipay: this.userInfoData.alipay,
          alipay_pic: this.alipyImgList || "",
        };

        this.$api.getSetting.setAlipySetting(params).then(res=>{
            if(res.code==200){
                this.$toast.success(this.$h('操作成功'));
                 setTimeout(()=>{
                  this.$store.dispatch("getUser");
                  this.toBack();
                },1500)
            }
        })
      }
    }
  },
  created() {
      var info=this.$store.state.user
    this.userInfoData={
    		alipay_name:info.alipay_name,
    		alipay:info.alipay,

      }
      this.alipyImgList=info.alipay_pic || '';

  }
};
</script>

<style scoped>
.box_alea{
  position:relative;margin:0 30px;
  height: 120px;
}
.wx_up_img_zfb {
  width: 40px !important;
  height: 40px !important;
  background: url("../../assets/img/setting/zfb.png") no-repeat !important;
  background-size: 100% 100% !important;
}
.title {
  font-weight: bold;
}
.wx_up_img {
  width: 48px;
  height: 39px;
  background: url("../../assets/img/setting/weixin.png") no-repeat;
  background-size: 100% 100%;
}
.sx {
  width: 100px;
  text-align: left;
  padding-right: 10px !important;
}
.title text {
  font-weight: normal !important;
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
  font-weight: normal !important;
  padding: 10px 0;
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
  width: 40px;
  height: 40px;
}
.up_view {
  width: 148px;
  height: 132px;
  text-align: center;
  margin: 0 11px;
  position: relative;
  margin-top: 27px;
}
.up_bor {
  width: 120px;
  height: 120px;
  border: 1PX solid #cccccc;
  border-radius: 2px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.up_text {
  position: relative;
  color: #5e6266;
  font-size: 12px;
}
.up_img_con {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  padding: 20px 0 20px;
}
.up_beizhu {
  background: #fffff5;
  padding: 5px 15px;
  line-height: 1.2;
}
.up_beizhu > div > span {
  display: block;
  color: #5e6266;
  font-size: 12px;
  line-height: 1.8;
}
.size_le {
  line-height: 1;
}
.close_img {
  position: absolute;
  top: 0;
  right: 0;
  color: red;
}
.title {
    color: #000;
    min-width: 80px;
    font-size: 15px!important;
    font-weight: bold;
}
</style>
