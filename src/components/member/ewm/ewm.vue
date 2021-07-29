<template>
  <div class="ewm-con">
    <van-nav-bar :title="$h('分享')" left-text left-arrow class="navbar" @click-left="backLeft" />
    <div class="successNav">
      <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
        <swiper-slide v-for="(item, i) in ewm.banner" :key="i">
          <img class="img_ban" :src="item.piclink" alt />
        </swiper-slide>
      </swiper>
    </div>
    <div class="ewm-text-con">
      <!-- <p class="ewm-text-p1">
        <img src="../../../assets/img/member/dp.png" alt />
        <span>{{ $h("成功邀请的好友每下一单，你都能从中获得利益") }}</span>
      </p> -->

      <van-button type="primary" size="large" class="but" @click="showPop">{{
        $h("分享专属海报")
      }}</van-button>
      <!-- <van-button type="primary" size="large" class="but" @click="showPop1">分享专属二维码</van-button> -->
      <p class="ewm-share">
        <span>{{ $h("我的功德码：") }}{{ $store.state.user.username }}</span>
        <span class="copy" style="cursor: pointer" onclick :data-clipboard-text="userInfo.username" data-clipboard-action="copy"
            @click="copy">{{ $h("复制") }}</span>
      </p>
      <p class="ewm-num">
        {{ $h("累计成功邀请") }}
        <span>{{ $store.state.user.ynumber }}</span>
        <!-- <van-icon name="arrow" color="#8a8a8a" /> -->
        <span v-if="ewm.content" @click="show_news = true">【规则介绍】</span>
      </p>
    </div>

    <van-popup v-model="show_news" closeable class="dialogNewDetaild">
      <div class="dialogNewDetaildCon">
        <p>规则介绍</p>
        <div class="shop_details_in" v-lazy-container="{ selector: 'img' }" v-html="letslazyload(ewm.content)"></div>
      </div>
    </van-popup>
    <!-- <div class="ewm-footer">
      <h4>邀请规则</h4>
      <p class="ewm-footer-line"></p>
      <ul class="ewm-footer-list">
        <li>
          <span>1</span>
          <span>好友通过你的二维码下载app，并在24小时内登陆app领取新人红包，则算邀请成功</span>
        </li>
        <li>
          <span>2</span>
          <span>邀请成功的好友将成为你的粉丝</span>
        </li>
        <li>
          <span>3</span>
          <span>你成为创客后，你的粉丝通过超级淘网购或分享商品每成交一单，你可以获得一定的淘米奖励</span>
        </li>
        <li>
          <span>4</span>
          <span>禁止通过作弊手段进行虚假邀请注册骗取奖励，如有发现，将取消其奖励并酌情处罚</span>
        </li>
        <li>
          <span>5</span>
          <span>本活动最终解释权归超级淘所有</span>
        </li>
      </ul>
    </div>-->
    <van-popup v-model="show" :close-on-click-overlay="false" class="upload_shaer" get-container="body">
      <div class="upload_shaer_img">
        <img :src="imgUrl" class="imgUrl" crossorigin="anonymous" alt />
        <span class="close-span" @click="show = false"><img src="../../../assets/img/member/close1.png" alt="" /></span>
        <!-- <van-icon name="clear" size="28px" color="rgba(0,0,0,.6)" @click="show=false" /> -->
      </div>
      <div class="upload_shaer_btn">
        <div class="tc" @click="uploadShare(isWx)">
          <img src="../../../assets/img/member/uplodeimg.png" class="upload_img_ewm" alt />
          <span>{{
              isWx == 3 ? $h("长按保存到系统相册") : $h("点击保存到系统相册")
            }}
            {{ savetip }}
          </span>
        </div>
      </div>
    </van-popup>

    <div style="width: 100%" class="container" ref="imageDom">
      <img :src="ewm_top_img" alt style="width: 100%" crossorigin="anonymous" />
      <div class="container_foot">
        <div class="bg_text fx">
          <div class="fx left_emw">
            <img :src="avatar" class="avatar" crossorigin="anonymous" mode />
            <div class="fx ewm_footer_text">
              <div class="text_c">
                {{
                  ewm.user.title1.length >= 12
                    ? ewm.user.title1.slice(0, 12)
                    : ewm.user.title1
                }}
              </div>
              <div class="text_c2">{{ ewm.user.title2 }}</div>
            </div>
          </div>
          <div class="tc">
            <img :src="ewm.wy_ewm" class="ewm ewmdz" mode />
            <div class="ewm ewmdz">
              <div class="user-bh-bp">
                <img :src="avatar" class="user-bh" alt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container container-ewm" style="width: 100%; z-index: 1" ref="imageDom1">
      <div class="my-user-info-ewm">
        <div class="fx">
          <div class="fx left_emw">
            <img :src="avatar" class="avatar" mode />
            <div class="fx ewm_footer_text">
              <div class="text_c">
                {{
                  ewm.user.title1.length >= 12
                    ? ewm.user.title1.slice(0, 12)
                    : ewm.user.title1
                }}
              </div>
              <div class="text_c2">{{ ewm.user.title2 }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="tc my-user-info-ewm1">
        <img :src="ewm.wy_ewm" class="ewm1" mode />
        <div class="my-user-info-ewm2">
          <img :src="avatar" class alt />
        </div>
      </div>
      <p v-if="headTitle" class="text-head-title">{{ headTitle }}</p>
    </div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import html2canvas from "html2canvas";

import Cookies from "js-cookie";
import { mapState } from "vuex";
import wx from "weixin-js-sdk";
export default {
  name: "ewm",
  components: {
    swiper,
    swiperSlide,
  },
  data () {
    const self = this;
    return {
      ewm_top_img: "",
      userInfo: this.$store.state.user,
      avtiveImgIndex: 0,
      show: false,
      show1: false,
      swiperOption: {
        // some swiper options/callbacks
        // 所有的参数同 swiper 官方 api 参数
        // ...
        initialSlide: 0,
        autoplay: false, //可选选项，自动滑动
        effect: "coverflow",
        slidesPerView: 2,
        centeredSlides: true,

        coverflowEffect: {
          rotate: 30,
          stretch: 10,
          depth: 60,
          modifier: 2,
          slideShadows: true,
        },
        on: {
          transitionEnd: function () {
            self.avtiveImgIndex = this.activeIndex;
          },
        },
      },
      ewm: {
        wy_ewm: "",
        banner: [{ piclink: "" }],
        user: {
          title1: "",
          title2: "",
          avatar: "",
        },
      },
      popImg: "",
      imgUrl: null,
      isWx: "0",
      show_news: false,
    };
  },
  computed: {
    ...mapState({
      sex: (state) => state.user.sex,
      headTitle: (state) => state.config.shop.head,
    }),
    swiper () {
      return this.$refs.mySwiper.swiper;
    },
    savetip () {
      if (this.$fnc.isapp() || this.$fnc.isYkAPP()) {
        return "点击保存到系统相册";
      } else {
        return "长按图片保存到系统相册";
      }
    },
    avatar () {
      if (this.ewm.user.avatar) {
        return this.ewm.user.avatar;
      } else if (this.sex == 2) {
        return require("../../../assets/img/member/sex2.png");
      } else {
        return require("../../../assets/img/member/sex1.png");
      }
    },
  },
  created () {
    this.$store.dispatch("getUser");
  },
  mounted () {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      //第一个微信端
      this.$fnc.isXcx().then((res) => {
        if (res == "true" || res == true) {
          this.isWx = "4"; //小程序
          this.getEwm(this.isWx);
        } else {
          this.isWx = "3"; //公众号
          this.getEwm(this.isWx);
        }
      });
    } else if (ua.match(/ykapp/i) == "ykapp") {
      this.isWx = "1"; //第二个app
      this.getEwm(this.isWx);
    } else {
      this.isWx = "2"; //剩下的网页
      this.getEwm(this.isWx);
    }
  },
  methods: {
    letslazyload (contentp) {
      if (!contentp) {
        return true;
      }
      let regexp1 = new RegExp(
        /(\<img )([^>]*)(src=")([^"]*")([^>]*)(\>)/,
        "g"
      );
      contentp = contentp.replace(
        regexp1,
        function (match, p1, p2, p3, p4, p5, p6) {
          return p1 + p2 + 'data-src="' + p4 + p5 + p6;
        }
      );
      return contentp;
    },
    getImageBlob (url) {
      var xhr = new XMLHttpRequest();
      xhr.open("get", url, true);
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status == 200) {
          // imgResponse = this.response;
          //这里面可以直接通过URL的api将其转换，然后赋值给img.src
          //也可以使用下面的preView方法将其转换成base64之后再赋值
          // img.src = URL.createObjectURL(this.response);
        }
      };
      xhr.send();
    },
    preView (url) {
      let reader = new FileReader();
      this.getImageBlob(url, function (blob) {
        reader.readAsDataURL(blob);
      });
      reader.onload = function () { };
    },
    showPop () {
      var that = this;
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        message: "加载中...",
      });

      try {
        if (that.ewm_top_img.indexOf("http") >= 0) {
          that.$fnc.getImageBase64(that.ewm_top_img, (img) => {
            if (img) {
              that.$set(that, "ewm_top_img", img);
              that.getEwmHaiBao(toast);
            }
          });
        } else {
          that.getEwmHaiBao(toast);
        }
      } catch (error) {
        alert(3);
        that.getEwmHaiBao(toast);
      }
    },
    showPop1 () {
      var that = this;
      const toast = this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: "spinner",
        message: "加载中...",
      });
      try {
        if (that.ewm_top_img.indexOf("http") >= 0) {
          that.$fnc.getImageBase64(that.ewm_top_img, (img) => {
            if (img) {
              that.$set(that, "ewm_top_img", img);
              that.getEwmHaiBao(toast);
            }
          });
        } else {
          that.getEwmHaiBao(toast);
        }
      } catch (error) {
        that.getEwmHaiBao(toast);
      }
    },
    getEwmHaiBao (toast) {
      html2canvas(this.$refs.imageDom, { useCORS: true, logging: true }).then(
        (canvas) => {
          // 转成图片，生成图片地址
          this.imgUrl = canvas.toDataURL("image/png");
          if (this.imgUrl) {
            this.show = true;
            toast.clear();
          }
        }
      );
    },
    uploadShare () {
      this.show = false;
      this.$fnc.ykAppUpImage(this.imgUrl);
    },
    backLeft () {
      this.toBack();
    },
    callback () { },
    copy () {
      let _this = this;
      let value = this.$store.state.user.share || "";
      let clipboard = new this.clipboard(".copy");

      clipboard.on("success", function (e) {
        _this.$toast.success(_this.$h("复制成功"));
        e.clearSelection();
      });
      clipboard.on("error", function () {
        _this.$fnc.ykAPPCopy(value);
      });
    },
    getEwm (iswx) {
      var type = null;
      var that = this;
      if (iswx == 1 || iswx == 2) {
        type = 1;
      } else {
        type = iswx == 3 ? 2 : 3;
      }

      var users = Cookies.get("user")
        ? JSON.parse(Cookies.get("user"))
        : {
          uid: 0,
        };
      var id =
        this.appusers.uid || this.$store.state.user.uid || users.uid || "";
      this.$api.getUser.getEwm({ id: id, ewm_type: type }).then((res) => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.ewm = res.result;
            var img = this.ewm.banner[0].piclink;
            if (img.indexOf("http") >= 0) {
              that.$fnc.getImageBase64(img, (imgs) => {
                if (imgs) {
                  that.$set(that, "ewm_top_img", imgs);
                }
              });
            } else {
              that.$set(that, "ewm_top_img", img);
            }

            var obj = {};
            obj.title = this.$store.state.config.shop.head || "";
            obj.desc = "";
            try {
              obj.imgUrl =
                this.$store.state.config.shop.logo &&
                this.$store.state.config.shop.logo.indexOf("http") >= 0
                  ? this.$store.state.config.shop.logo
                  : location.origin +
                    this.$fnc.getImgUrl(this.$store.state.config.shop.logo);
            } catch (error) {
              obj.imgUrl = location.href;
            }

            var username = this.$store.state.user.username || "";
            obj.link =
              res.result.is_tgm_locking == 1 && username
                ? `${location.origin}/member/ewm?tid=${this.$store.state.user.uid}&tshare=${username}`
                : window.location.href;

            try {
              this.$fnc.isXcx().then((ress) => {
                if (ress == "true" || ress == true) {
                  var obj2 = {};
                  obj2.title = obj.title;
                  obj2.desc = obj.desc;
                  obj2.piclink = obj.imgUrl;
                  obj2.url = obj.link;
                  wx.miniProgram.postMessage({
                    data: obj2,
                  });
                }
              });
            } catch (error) {
              new Error("小程序判断失败");
            }
            this.$store.commit("setAppShareObj", obj);
            this.$wxshare(obj);
          });
        }
      });
    },
  },
  watch: {
    avtiveImgIndex (old) {
      var that = this;
      var img = this.ewm.banner[old].piclink;
      if (img.indexOf("http") >= 0) {
        that.$fnc.getImageBase64(img, (imgs) => {
          if (imgs) {
            that.$set(that, "ewm_top_img", imgs);
          }
        });
      } else {
        that.$set(that, "ewm_top_img", img);
      }
    },
  },
};
</script>


<style lang="less" scoped>
@import "../../../assets/css/quill.css";
.text-head-title {
  text-align: center;
  color: #000000;
  font-weight: bold;
  font-size: 15px;
  padding: 6px 0 12px;
}
.container-ewm {
  background: #fff !important;
  border-radius: 5px;
  overflow: hidden;
  padding: 0 0 10px;
  .avatar {
    border-radius: 3px;
    background: transparent;
  }
  .ewm_footer_text {
    min-height: 40px;
  }
  .text_c,
  .text_c2 {
    color: #000000;
    font-weight: bold;
  }
}
.my-user-info-ewm {
  margin: 10px 0;
}
.my-user-info-ewm1 {
  position: relative;
  width: 260px;
  height: 260px;
  margin: 0 auto;
  .ewm1 {
    width: 260px;
    height: 260px;
  }
  .my-user-info-ewm2 {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 60px;
    height: 60px;
    background: #fff;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 56px;
      height: 56px;
      border-radius: 5px;
    }
  }
}
.user-bh-bp {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  padding: 2px;
  width: 24px;
  height: 24px;
  background: #fff;
}
.user-bh {
  max-width: 100%;
}
.ewm_footer_text {
  flex-direction: column;
  align-items: flex-start;
  flex-wrap: nowrap;
}
.upload_shaer_img {
  position: relative;
  width: 75%;
  margin: 0 auto;
  .close-span {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    img {
      width: 100%;
      height: 100%;
    }
    // opacity: 0.4;
  }
}
.imgUrl {
  display: block;
  max-width: 100%;
  margin: 0 auto;
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
.sao {
  color: #606060;
  font-size: 14px;
  margin-top: 4px;
}
.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #a9c5ea;
  margin-left: 13px;
  margin-right: 13px;
}

.bg_text {
  width: 100%;
  height: 100%;
  background: url(../../../assets/img/member/ewm_bg.png) no-repeat;
  background-size: 100% 100%;
  border-top: 1px solid #f9f9f9;
  padding: 10px 0;
}
.left_emw {
  justify-content: flex-start;
}
.text_c {
  color: #333;
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 4px;
  // width: 200px;
}
.text_c2 {
  color: #666;
  font-size: 13px;
}
.upload_shaer {
  width: 100%;
  background-color: transparent;
}
.container {
  width: 100%;
  position: fixed;
  top: -200%;
  overflow: auto;
  // height: 100%;
  background: transparent;
  > img {
    width: 100%;
  }
}
.ewm {
  width: 62px;
  height: 62px;
  vertical-align: middle;
}
.ewm-con {
  background: #f3f3f3;
  font-size: 14px;
  line-height: 1;
  overflow: auto;
  .ewm-text-con {
    padding: 0 16px;
    overflow: auto;
    background: #fff;
    .ewm-text-p1 {
      > img {
        width: 11px;
        height: 16px;
        margin-right: 8px;
      }
      margin-top: 30px;
      text-align: center;
      color: #4d4d4d;
    }
    .but {
      border-radius: 27px;
      line-height: 1.06667rem;
      margin-top: 17px;
    }
    .ewm-share {
      text-align: center;
      margin-top: 18px;
      font-size: 16px;
      color: #333333;
      font-weight: 400;
      .copy {
        color: #f34d0d;
        border-radius: 4px;
        border: 1px solid #f34d0d;
        padding: 4px 8px;
        margin-left: 12px;
      }
    }
    .ewm-num {
      text-align: center;
      vertical-align: middle;
      margin: 20px 0 25px;
      color: #8a8a8a;
      > span {
        color: #f34d0d;
        &:nth-of-type(2) {
          color: #48a2ff;
        }
      }
      > i {
        vertical-align: bottom;
      }
    }
  }
  .ewm-footer {
    background: #fff;
    margin-top: 10px;
    padding: 0 16px;
    overflow: hidden;
    > h4 {
      text-align: center;
      margin-top: 39px;
      font-size: 19px;
      font-weight: 500;
    }
    > .ewm-footer-line {
      width: 50px;
      height: 4px;
      border-radius: 27px;
      background: #f4f4f4;
      margin: 9px auto 20px auto;
    }
    > .ewm-footer-list {
      padding-bottom: 64px;
      > li {
        line-height: 1.4;
        color: #292929;
        margin-bottom: 9px;
        > span:first-child {
          display: inline-block;
          margin-right: 10px;
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          color: #fff;
          border-radius: 50%;
          background: linear-gradient(to top, #ff9242, #ff6f41);
        }
      }
    }
  }
}
.img_ban {
  width: 100%;
  height: 350px;
  border-radius: 10px;
}
.successNav {
  padding: 30px 0;
  background: #f3f3f3;
}
.successNav .swiper-slide.swiper-slide-active img {
  //   transform: scaleX(1.6);
  border-radius: 10px;
}
.successNav .swiper-slide.swiper-slide-duplicate-prev img,
.successNav .swiper-slide.swiper-slide-next img,
.successNav .swiper-container-3d .swiper-slide-shadow-right,
.successNav .swiper-container-3d .swiper-slide-shadow-left,
.successNav .swiper-slide.swiper-slide-prev img,
.successNav .swiper-slide.swiper-slide-prev {
  border-radius: 10px !important;
  overflow: hidden;
}
.successNav .swiper-slide {
  border-radius: 10px !important;
  overflow: hidden;
}
.container_foot {
  // height: 120px;
  height: 170px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
}

.dialogNewDetaild {
  width: 86%;
  max-height: 80%;
  min-height: 50%;
  .dialogNewDetaildCon {
    width: 100%;
    height: 100%;
    padding: 12px;
    overflow: auto;
    > p {
      padding: 10px 0;
      width: 100%;
      text-align: center;
      font-size: 17px;
    }
    > div {
      font-size: 14px;
    }
  }
}
</style>
