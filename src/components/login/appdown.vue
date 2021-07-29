<template>
  <div class="appdown">
    <van-nav-bar left-text :border="false" left-arrow class="navbar " @click-left="$router.push('/member/member')"></van-nav-bar>
    <div class="appdown_top">
      <img :src="$fnc.getImgUrl(info.logo)" alt="">
      <div>
        <p>{{info.title}}</p>
        <p>
          <van-icon name="star" />
          <van-icon name="star" />
          <van-icon name="star" />
          <van-icon name="star" />
          <van-icon name="star" />
          <span>9.5分</span>
        </p>
        <p>APP发布时间&nbsp {{$fnc.getTimeFormat(info.update_time)}}</p>
      </div>
    </div>
    <div class="appdown_body">
      <div class="app_down_box">
        <div>
          <div class="appdown_img" v-for="(item,i) in info.banner" :key="i">
            <img :src="$fnc.getImgUrl(item)" alt="">
          </div>
        </div>
      </div>

      <p>应用简介</p>
      <p>{{info.introduce}}</p>
      <div class="appdownbtn">
        <span class="" @click="down">立即下载</span>
      </div>
      <p class="copyright">{{info.copyright}}</p>
      <div class="footerbtn">
        <span @click="openinfo(0)">公司简介</span>
        <span @click="openinfo(1)">联系方式</span>
        <span @click="openinfo(2)">公司地址 </span>
      </div>
    </div>
    <van-popup v-model="showLoad" position="top" get-container="body" class="share-zd" style=" height: 100%;background-color: transparent;"
        @click="showLoad=false">
      <img src="../../assets/img/shop/share-wx1.png" alt style="width:100%" />
    </van-popup>
    <van-popup v-model="showInfo" :style="{ width: '80%' }">
      <div class="introduct">
        <p v-if="active == 0">公司简介</p>
        <p v-else-if="active == 1">联系方式</p>
        <p v-else-if="active == 2">公司地址</p>
        <div v-if="active == 0">
          {{info.app_download_company}}
        </div>
        <div v-else-if="active == 1">
          {{info.app_download_call}}
        </div>
        <div v-else-if="active == 2">
          {{info.app_download_address}}
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  name: "appdown",
  data () {
    return {
      showInfo: false,
      showLoad: false,
      info: {
        banner: [],
      }
    };
  },
  components: {
  },
  created () {
    this.getinfo();
  },
  methods: {
    openinfo (val) {
      this.active = val;
      this.showInfo = true;
    },
    down () {
      var url = ''
      if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
        console.log('android终端')
        url = this.info.droidapp
      } else {

        console.log('ios终端')
        url = this.info.iphoneapp
      }

      if (url + ' '.indexOf('apps.apple.com') >= 0) {
        window.location.href = url;
      } else if (this.$fnc.isWx()) {
        this.showLoad = true;
      } else {
        window.location.href = url;
      }

    },
    getinfo () {
      this.$api.getPage.get_down({}).then(res => {
        if (res.code == 200) {
          this.info = res.result;
        }
      })
    },
  },
}
</script>
<style lang="less" scoped>
.appdown {
  width: 100%;
  height: 100%;
  background-color: #0e7de5;
  overflow: auto;
  .appdown_top {
    width: 100%;
    display: flex;
    background-color: #ffffff;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    padding: 20px 37.5px 20px 37.5px;
    > img {
      width: 70px;
      height: 70px;
      border-radius: 10px;
      -moz-box-shadow: 2px 2px 14px #a3a3a3;
      -webkit-box-shadow: 2px 2px 14px #a3a3a3;
      box-shadow: 2px 2px 14px #a3a3a3;
      margin-right: 15px;
    }
    > div {
      flex: 1;
      display: flex;
      flex-flow: column;
      justify-content: center;
      align-items: flex-start;
      > p:nth-of-type(1) {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
      }
      > p:nth-of-type(2) {
        font-size: 12px;
        color: #333333;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        .van-icon {
          font-size: 16px;
          color: #ffc600;
        }
        > span {
          padding-top: 2px;
          padding-left: 10px;
        }
      }
      > p:nth-of-type(3) {
        font-size: 12px;
        color: #333333;
      }
    }
  }
  .appdown_body {
    width: 100%;
    min-height: 500px;
    background: url("./../../assets/img/appdown.png") no-repeat;
    background-size: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: flex-start;
    > p:nth-of-type(1) {
      margin-top: 20px;
      padding: 0 13px;
      font-size: 18px;
      font-weight: bold;
      color: #ffffff;
      text-align: left;
    }
    > p:nth-of-type(2) {
      padding: 0 13px;
      font-size: 12px;
      color: #ffffff;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      text-align: justify;
    }
    .app_down_box {
      width: 100%;
      min-width: 100%;
      margin-top: 20px;
      overflow: hidden;
      padding: 0 13px;
      > div {
        width: auto;
        display: -webkit-box;
        flex-wrap: nowrap;
        justify-content: flex-start;
        overflow: auto;

        .appdown_img {
          width: 130px;
          height: 265px;
          background: url("./../../assets/img/down_phone.png") no-repeat;
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 15px;
          > img {
            width: 115px;
            height: 206px;
          }
        }
      }
    }
  }

  .appdownbtn {
    width: 100%;
    margin-top: 20px;
    > span {
      width: 73%;
      height: 45px;
      margin: 0 auto;
      font-size: 16px;
      color: #0e7de5;
      background-color: #ffffff;
      border-radius: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      -moz-box-shadow: 2px 2px 14px #666666;
      -webkit-box-shadow: 2px 2px 14px #666666;
      box-shadow: 2px 2px 14px #666666;
    }
  }
}
.copyright {
  font-size: 14px;
  color: #ffffff;
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
.footerbtn {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: auto;
  margin-bottom: 20px;
  > span {
    width: 25%;
    height: 30px;
    margin: 0 auto;
    font-size: 14px;
    color: #0e7de5;
    background-color: #ffffff;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
}
.introduct {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  font-size: 14px;
  padding: 0 20px;
  > p {
    font-size: 24px;
    font-weight: bold;
    padding: 10px 0;
  }
  > div {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
    min-height: 200px;
    font-size: 14px;
  }
}
</style>