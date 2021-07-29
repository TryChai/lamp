<template>
  <div>
    <div class="cityinfo_share" ref="imageDom">
      <div class="share_content">
        <div class="share_top">
          <img :src="share.avatar || require('@/assets/img/member/sex1.png')" />
          <div class="fx">
            <p>{{info.nickname && info.nickname != '' ? info.nickname : info.username}}</p>
            <p>{{$fnc.getTimeFormat(info.created_time)}}</p>
          </div>
        </div>
        <div class="detail">
          <div class="imgs" v-if="share.images && share.images.length > 0">
            <div v-for="(item,i) in share.images" :key="i">
              <img :src="$fnc.getImgUrl(item)" alt @click="openimg(i)" />
            </div>
          </div>
        </div>
        <div class="time">
          <p>{{info.content}}</p>
        </div>
        <div class="fx product" v-if="info.pid>0 && info.product">
          <img :src="$fnc.getImgUrl(share.piclink)" />
          <div>
            <p class="van-ellipsis">{{info.product.title || ''}}</p>
            <p class="price_regular">
              <small>￥</small>
              <b>{{$fnc.get_int_dec(info.product.price,'int')}}</b>
              <i>{{$fnc.get_int_dec(info.product.price,'dec')}}</i>
            </p>
          </div>
        </div>
        <p class="fx location" v-if="info.types==3 && info.address!=''">
          <van-icon name="location-o" />
          {{info.address}}
        </p>
      </div>
      <div class="share_bottom">
        <div>
          <p>随手拍</p>
          <p>分享我的生活</p>
        </div>
        <div :id="'cityinfo_qrcode'+info.id"></div>
      </div>
    </div>
    <van-popup
      v-model="showShare"
      class="animated show-share-pop"
      position
      :class="[showShare?'bounceInDown':'bounceOutUp']"
    >
      <div class="live_share">
        <div style="position:relative">
          <img :src="imgUrl" style="    width: 100%;" crossorigin="anonymous" alt />
          <van-icon name="cross" @click="showShare =false"></van-icon>
        </div>
        <div class="upload_shaer_btn">
          <div class="tc" @click="uploadShare()">
            <img src="../../../assets/img/member/uplodeimg.png" class="upload_img_ewm" alt />
            <span>{{isWx==0?'长按保存':"保存到系统相册"}}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import html2canvas from "html2canvas";
import QRCode from "qrcodejs2";
import { Popup } from "vant";
export default {
  name: "cityinfoshare",
  data() {
    return {
      isWx: "",
      imgUrl: "",
      showShare: false
    };
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    share: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {},
  components: {
    [Popup.name]: Popup
  },
  created() {
    this.$nextTick(() => {
      this.qrcode();
    });
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.isWx = "0"; //第一个微信端
    } else if (ua.match(/ykapp/i) == "ykapp") {
      this.isWx = "1"; //第二个app
    } else {
      this.isWx = "2"; //剩下的网页
    }
  },
  methods: {
    uploadShare() {
      this.showShare = false;
      this.$fnc.ykAppUpImage(this.imgUrl);
    },
    getimg(type) {
      this.imgUrl = "";
      if (
        document.readyState == "complete" &&
        html2canvas &&
        this.$refs.imageDom
      ) {
        const toast = this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: "spinner",
          message: "加载中..."
        });
        html2canvas(this.$refs.imageDom, {
          height: this.$refs.imageDom.offsetHeight - 2,
          width: this.$refs.imageDom.offsetWidth - 2,
          useCORS: true,
          logging: true
        }).then(canvas => {
          // 转成图片，生成图片地址
          this.imgUrl = canvas.toDataURL("image/png");
          if (this.imgUrl) {
            this.showShare = true;
            toast.clear();
          }
        });
      }
    },
    qrcode() {
      document.getElementById("cityinfo_qrcode"+this.info.id).innerHTML = "";
      let qrcode = new QRCode("cityinfo_qrcode"+this.info.id, {
        width: 70,
        height: 70,
        text: location.origin + "/shop/buyers", // 二维码地址
        colorDark: "#000", //前景色
        colorLight: "#fff" //背景色
      });
    }
  }
};
</script>
<style lang="less" scoped>
.cityinfo_share {
  width: 100%;
  background-color: #ffdc00;
  margin-bottom: 500px;
  padding: 10px;
  position: fixed;
  top: 500%;
  left: 0;
  .share_content {
    border-radius: 5px;
    padding: 12.5px;
    background-color: #ffffff;
    .share_top {
      width: 100%;
      height: 45px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      > img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        margin-right: 8px;
      }

      > div {
        flex: 1;
        line-height: 1.4;
        flex-direction: column;
        > p {
          width: 100%;
          font-size: 15px;
          color: #323232;
          font-weight: bold;
          &:nth-of-type(2) {
            font-size: 12px;
            color: #cecece;
            font-weight: normal;
          }
        }
      }
    }
    > p {
      font-size: 14px;
      padding-top: 10px;
      color: #bdbdbd;
    }
    .time {
      width: 100%;
      background-color: #fff;
      font-size: 14px;
      > p {
        color: #40444f;
      }
    }
    .detail {
      width: 100%;
      background-color: #fff;
      margin-top: 10px;
      .imgs {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0;
        > div {
          width: 105px;
          height: 80px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 7px;
          > img {
            width: 100%;
            min-height: 80px;
          }
        }
      }
      .imgs::after {
        content: "";
        width: 105px;
      }
    }
    .product {
      width: 100%;
      height: 50px;
      background: #fafafa;
      border-radius: 5px;
      margin: 5px auto;
      justify-content: flex-start;
      img {
        width: 50px;
        margin-right: 10px;
      }
      p {
        width: 260px;
      }
      .price_regular > small {
        font-size: 12px;
        font-weight: bold;
      }
      .price_regular > b {
        font-size: 14px;
      }
      .price_regular > i {
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
      }
    }
    .location {
      font-size: 12px;
      justify-content: flex-start;
      line-height: 1;
      color: #3a4658;
      padding: 5px 0 0;
      .van-icon {
        font-size: 14px;
        margin-right: 3px;
      }
    }
  }
  .share_bottom {
    width: 100%;
    height: 90px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div:nth-of-type(1) {
      width: 230px;
      line-height: 1.5;

      > p:nth-of-type(1) {
        font-size: 16px;
        font-weight: bold;
        color: #ffffff;
      }
      > p:nth-of-type(2) {
        font-size: 14px;
        font-weight: bold;
        color: #333333;
      }
    }
  }
}
#cityinfo_qrcode {
  border: 2px solid #fff;
  display: inline-block;
  img {
    width: 100%;
    height: 100%;
    background-color: #fff; //设置白色背景色
    padding: 2px; // 利用padding的特性，挤出白边
  }
}
.show-share-pop {
  width: auto;
  height: 100%;
  background-color: transparent;
  border-radius: 0;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.live_share {
  width: 80%;
  margin: 0 auto;
  .van-icon {
    position: absolute;
    font-size: 20px;
    color: #333333;
    border-radius: 50%;
    top: 10px;
    right: 10px;
    border: 2px solid #333333;
  }
}
.upload_shaer_btn {
  padding-top: 10px;
  color: #fff;
  font-size: 14px;
  position: relative;
  text-align: center;
  .upload_img_ewm {
    display: block;
    width: 34px;
    margin: 0 auto;
  }
  span {
    display: inline-block;
    margin-top: 20px;
  }
}
</style>