<template>
  <!-- 买家秀评价 -->
  <div class="show_item">
    <div class="show_item_remark">
      <p class ref="remark_p">
        {{ info.content || "" }}
      </p>
    </div>
    <div class="show_item_more">
      <span @click="open_more($event)" v-if="info.content.length >= 60"
        >全文</span
      >
    </div>
    <div
      class="show_item_pic_two"
      v-if="
        Number(info.piclink.length) +
          Number(info.video && info.video != '' ? 1 : 0) ==
        2
      "
    >
      <div
        class="show_item_pic_two_img show_item_video"
        v-if="info.video && info.video != ''"
        @click="open_detail('video')"
      >
        <!-- 显示视频封面 -->
        <!-- 播放暂停按钮 -->
        <img
          class="icon_play"
          src="./../../../assets/img/play.png"
          style="width: 48px; height: 48px; min-height: 48px; z-index: 1000"
        />
        <img :src="$fnc.getImgUrl(info.video_piclink)" alt />
      </div>
      <div
        class="imglist"
        v-for="(img, i) in info.piclink"
        :key="i"
        @click="open_detail(i)"
      >
        <img  :src="$fnc.getImgUrl(img.piclink)"  alt />
      </div>
    </div>
    <div class="show_item_pic" v-else >
      <div
        class="show_item_pic_img show_item_video"
        v-if="info.video && info.video != ''"
      >
        <!-- 显示视频封面 -->
        <!-- 播放暂停按钮 -->
        <img
         @click="open_detail('video')"
          class="icon_play"
          src="./../../../assets/img/play.png"
          style="width: 48px; height: 48px; min-height: 48px; z-index: 1000"
        />
        <img :src="$fnc.getImgUrl(info.video_piclink)" alt />
      </div>
      <div class="show_item_pic_img" v-for="(img, i) in info.piclink" @click="open_detail(i)" :key="i">
        <img :src="$fnc.getImgUrl(img.piclink)" alt />
      </div>
    </div>
    <p class="time">{{ $fnc.getTimeFormat(info.created_time) }}</p>
  </div>
</template>
<script>
import { Field } from "vant";
import share from "./buyers_share";
export default {
  name: "show_item",
  data() {
    return {
      num: false,
      is_awesome: 0,
      is_app:
        window.navigator.userAgent.toLowerCase().match(/ykapp/i) == "ykapp",
      comment: "",
      showComment: false,
      shareInfo: {
        avatar: "",
        images: [],
        piclink: "",
      },
    };
  },
  props: {
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    [Field.name]: Field,
    share,
  },
  mounted() {
    if (this.info.avatar.indexOf("http") >= 0) {
      this.$fnc.getImageBase64(this.info.avatar, (img) => {
        if (img) {
          this.$set(this.shareInfo, "avatar", img);
        } else {
          this.$set(this.shareInfo, "avatar", this.info.avatar);
        }
      });
    } else {
      this.$set(this.shareInfo, "avatar", this.info.avatar);
    }

    if (this.info.video != "" && this.info.video_piclink != "") {
      if (this.info.video_piclink.indexOf("http") >= 0) {
        this.$fnc.getImageBase64(this.info.video_piclink, (img) => {
          if (img) {
            this.shareInfo.images.push(img);
          } else {
            this.shareInfo.images.push(this.info.video_piclink);
          }
        });
      } else {
        this.shareInfo.images.push(this.info.video_piclink);
      }
    }

    if (this.info.product && this.info.pid > 0) {
      if (this.info.types == 2) {
        if (this.info.product.img.indexOf("http") >= 0) {
          this.$fnc.getImageBase64(this.info.product.img, (img) => {
            if (img) {
              this.$set(this.shareInfo, "piclink", img);
            } else {
              this.$set(this.shareInfo, "piclink", this.info.product.img);
            }
          });
        } else {
          this.$set(this.shareInfo, "piclink", this.info.product.img);
        }
      } else {
        if (this.info.product.piclink.indexOf("http") >= 0) {
          this.$fnc.getImageBase64(this.info.product.piclink, (img) => {
            if (img) {
              this.$set(this.shareInfo, "piclink", img);
            } else {
              this.$set(this.shareInfo, "piclink", this.info.product.piclink);
            }
          });
        } else {
          this.$set(this.shareInfo, "piclink", this.info.product.piclink);
        }
      }
    }

    if (this.info.piclink && this.info.piclink.length > 0) {
      for (let i of this.info.piclink) {
        if (i.piclink.indexOf("http") >= 0) {
          this.$fnc.getImageBase64(i.piclink, (img) => {
            if (img) {
              this.shareInfo.images.push(img);
            } else {
              this.shareInfo.images.push(i.piclink);
            }
          });
        } else {
          this.shareInfo.images.push(i.piclink);
        }
      }
    }
    this.is_awesome = this.info.is_awesome;
    if (this.info.is_awesome == 0) {
      this.num = this.info.awesome;
    } else {
      this.num = this.info.awesome - 1;
    }
  },
  methods: {
    toReport() {
      var that = this;
      that.$dialog
        .confirm({ title: "提示", message: "是否确认举报该条信息？" })
        .then(() => {
          var params = {};
          params.id = that.info.id;
          that.$api.getShop.product_review_report(params).then((res) => {
            if (res.code == 200) {
              that.$toast.success(res.result);
            }
          });
        });
    },
    toPoster() {
      this.$refs.buyersShare.getimg();
    },
    toDh1() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        this.isApp = true;
      }
      var that = this;
      if (that.isApp) {
        try {
          that.$fnc.appNav(this.info.latitude, this.info.longitude);
        } catch (error) {
          that.$toast.fail("App地图跳转失败");
        }
      } else if (that.$fnc.isWx()) {
        var obj = {};
        obj.latitude = parseFloat(this.info.latitude);
        obj.longitude = parseFloat(this.info.longitude);
        obj.name = this.info.address;
        obj.address = this.info.address;
        obj.scale = 14;
        obj.infoUrl = location.origin + "/shop/buyers";

        if (
          sessionStorage.getItem("is_XcX") == true ||
          sessionStorage.getItem("is_XcX") == "true"
        ) {
          wx.miniProgram.navigateTo({
            url: `/pages/map/map?latitude=${obj.latitude}&longitude=${obj.longitude}&name=${obj.name}&address=${obj.address}`,
          });
        } else {
          this.wxApi.ToLocation(obj);
        }
      } else {
        that.$toast.fail("请在微信或者app打开");
      }
    },
    toDh() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        this.isApp = true;
      }
      var that = this;
      if (that.isApp) {
        try {
          that.$fnc.appNav(
            this.info.product.latitude,
            this.info.product.longitude
          );
        } catch (error) {
          that.$toast.fail("App地图跳转失败");
        }
      } else if (that.$fnc.isWx()) {
        var obj = {};
        obj.latitude = parseFloat(this.info.product.latitude);
        obj.longitude = parseFloat(this.info.product.longitude);
        obj.name = this.info.product.title;
        obj.address =
          this.info.product.province +
          this.info.product.city +
          this.info.product.area +
          this.info.product.town +
          this.info.product.address;
        obj.scale = 14;
        obj.infoUrl = location.origin + "/shop/buyers";

        if (
          sessionStorage.getItem("is_XcX") == true ||
          sessionStorage.getItem("is_XcX") == "true"
        ) {
          wx.miniProgram.navigateTo({
            url: `/pages/map/map?latitude=${obj.latitude}&longitude=${obj.longitude}&name=${obj.name}&address=${obj.address}`,
          });
        } else {
          this.wxApi.ToLocation(obj);
        }
      } else {
        that.$toast.fail("请在微信或者app打开");
      }
    },
    send_comment() {
      var params = {};
      params.id = this.info.id;
      params.reply_info = this.comment;
      this.$api.getShop.product_review_hotel_reply(params).then((res) => {
        if (res.code == 200) {
          this.showComment = false;
          this.$toast.success("评论成功");
          setTimeout(() => {
            this.$emit("getSearch");
          }, 1500);
        }
      });
    },
    comment_click() {
      this.showComment = true;
      this.comment = "";
    },
    download() {
      this.$fnc.ykAppUpImage(this.info.piclink);
    },
    copy_btn(val, link) {
      let clipboard = new this.clipboard(val);
      clipboard.on("success", () => {
        this.$toast.success("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        // 不支持复制
        this.$fnc.ykAPPCopy(link);
      });
    },
    open_more(e) {
      if (e.target.innerText == "全文") {
        this.$refs.remark_p.classList.add("show_item_remark_more");
        e.target.innerText = "收回";
      } else {
        this.$refs.remark_p.classList.remove("show_item_remark_more");
        e.target.innerText = "全文";
      }
    },
    open_detail(str) {
       var obj={
          str:str,
          is_video:false
        } 
      if(this.info.video && this.info.video != ''){
        if(str=='video'){
          obj.is_video=true;
          this.$emit("open_str",obj);
        }else{
          obj.is_video=true;
          this.$emit("open_str",obj);
        }
      }else{
        this.$emit("open_str",obj);
      }
      this.$emit("open_detail", this.info);
    },
    job_click(e) {
      this.$api.getShop.enjoy_remark({ id: this.info.id }).then((res) => {
        if (res.code == 200) {
          this.is_awesome = this.is_awesome == 1 ? 0 : 1;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.show_item {
  width: 100%;
  background-color: #ffffff;
  font-size: 14px;
  .show_item_top {
    width: 100%;
    height: 45px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .show_item_top_ava {
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 6px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        overflow: hidden;
      }
    }
    .show_item_top_name {
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: flex-start;
      p {
        font-size: 16px;
        font-weight: bold;
        color: #000000;
        line-height: 1;
        background: linear-gradient(to top, #ffd500 0%, #ffffff 5px);
      }
    }
  }
  .show_item_remark {
    width: 100%;
    line-height: 20px;
    font-size: 14px;
    color: #424242;
    margin: 5px 0;
    text-align: justify;
    p {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Bold;
      font-weight: 700;
      color: #333333;
      line-height: 15px;
      span {
        font-size: 10px;
        background: #ffd500;
        border-radius: 3px;
        padding: 2px 5px;
        margin-right: 5px;
      }
    }
    > .show_item_remark_more {
      display: inline;
    }
  }
  .show_item_more {
    width: 100%;
    font-size: 12px;
    color: #ffaa01;
    line-height: 1;
    padding-bottom: 6px;
  }
  .show_item_pic {
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    .show_item_pic_img {
      width: 86px;
      height: 86px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 5px 5px 2px;
      overflow: hidden;
       border-radius: 5px;
      img {
        width: 100%;
        min-height: 100%;
        object-fit: cover;
      }
    }
  }
  // 两张图样式
  .show_item_pic_two {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 15px;
    .show_item_pic_two_img {
      width: 159px;
      height: 159px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 4px;
      overflow: hidden;
      img {
        width: 100%;
        width: 100%;
        min-height: 100%;
      }
    }
  }
  .show_item_video {
    position: relative;
    .icon_play {
      position: absolute;
      width: 50px;
      height: 50px;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
    }
  }
  .show_item_pic:after {
    content: "";
    width: 32.6%;
  }
  .show_item_shop {
    width: 94%;
    height: 64px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background-color: #fafafa;
    margin: 0 auto 10px auto;
    padding: 0 5px 0 0;
    border-radius: 2px;
    overflow: hidden;
    .show_item_shop_left {
      width: 64px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: 100%;
      }
    }
    .show_item_shop_center {
      flex: 1;
      padding-left: 10px;
      min-width: 175px;
      p:nth-of-type(1) {
        font-size: 14px;
        color: #5c5c5c;
        width: 100%;
        //溢出隐藏
        overflow: hidden;
        //隐藏部分显示为省略号
        text-overflow: ellipsis;
        //禁止文本自动换行
        white-space: nowrap;

        line-height: 20px;
      }
      p:nth-of-type(2) {
        font-size: 14px;
        color: #5c5c5c;
        line-height: 18px;
      }
    }
    .van-icon {
      font-size: 22px;
      color: #d2d2d2;
    }
  }
  .show_item_look {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    line-height: 1;
    margin: 5px auto;
    span {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
    .show_item_look_left {
      font-size: 12px;
      color: #ababab;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > span {
        margin-right: 10px;
      }
      i {
        font-size: 12px;
        vertical-align: middle;
        margin-right: 3px;
      }
    }
    .show_item_look_right {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      > span:nth-of-type(1) {
        margin-right: 10px;
      }
      .van-icon {
        display: flex;
        font-size: 17px;
        align-items: center;
        small {
          font-size: 12px;
          margin-left: 2px;
          line-height: 1;
        }
      }
    }
    .job_active {
      color: #ff5a00 !important;
      .van-icon {
        color: #ff5a00 !important;
      }
    }
  }
  .show_item_hotel {
    width: 100%;
    padding-bottom: 5px;
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    > p {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      line-height: 1;
      font-size: 12px;
      .van-icon {
        font-size: 14px;
      }
    }
  }
  .show_item_comment {
    width: 100%;
    margin: 10px auto;
    position: relative;
    > div {
      flex-direction: column;
      background: #f8f8f8;
      padding: 0 10px;
      line-height: 1.4;
      > p {
        width: 100%;
        font-size: 13px;
        padding: 5px 0;
        > span {
          color: #ffaa01;
        }
      }
    }
  }
  .show_item_comment_btn {
    position: fixed;
    width: 100%;
    bottom: 0;
    background: #ffffff;
    padding: 6px 10px;
    z-index: 10;
    .van-field {
      padding: 5px;
      border: 1px solid #dddddd;
      border-radius: 5px;
    }
    .van-button {
      width: 60px;
      margin-left: 10px;
      border-radius: 20px;
    }
  }
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
.time {
  position: relative;
  margin-top: 8px;
  font-size: 13px;
  font-family: PingFang SC, PingFang SC-Regular;
  font-weight: 400;
  color: #666666;
  line-height: 13px;
}
.time::before {
  content: "";
  position: absolute;
  z-index: 10;
  bottom: -4px;
  left: -40px;
  width: 28px;
  height: 20px;
  background-image: url(../../../assets/img/project/Lotus.png);
  background-repeat: no-repeat;
  background-size: 28px 20px;
}

</style>