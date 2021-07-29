<template>
  <div class="login">
    <div class="fx_3">
      <div class="login_bg" :style="{'background-image':'url('+$fnc.getImgUrl(bgUrl)+')'}">
        <div class="star_liu comet starss" id="star_"></div>
        <div :class="[i % 20 == 0 ? 'star star--big' : i % 9 == 0 ? 'star star--medium' : 'star']"
            :style="{top:Math.round(Math.random() * wH) +'px',left:Math.round(Math.random() * wW) + 'px','animation-duration':(Math.round(Math.random() * 3000) + 3000)+'ms','animation-delay':Math.round(Math.random() * 3000) +'ms'}"
            v-for="i in num" :key="i"></div>
      </div>
      <div class="login_form">
        <div class="login_text">
          <span class="text_a" :class="{text_active:index=='0'}" @click="toggle('0')">登录</span>
          <span class="text_a" :class="{text2_active:index=='1'}" @click="toggle('1')">注册</span>
          <span class="text_a" :class="{text2_active:index=='2'}" v-if="config.sms && config.sms.zhmmkg==1" @click="toggle('2')">忘记密码</span>
          <div class="box" :style="{left:index*2.88+'rem'}"></div>
        </div>
        <div class="login_con">
          <div class="s1s1s1">
            <phoneLogin :isgj="isgj" :str="index==0?item : '中国(+86)'" @isLoad="getIsload" :style="{left:index*-8.65+'rem'}" class="shou_item">
            </phoneLogin>
            <reg :isgj="isgj" :tshare="share" :is_reg_nick="is_reg_nick" :str="index==1?item : '中国(+86)'" class="shou_item"
                :style="{left:index*-8.65+'rem'}"></reg>
            <wjmm @suss="getsuss" :data-key="config.sms.zhmmkg" v-if="config.sms && config.sms.zhmmkg=='1'" :isgj="isgj"
                :str="index==2?item : '中国(+86)'" class="shou_item" :style="{left:index*-8.65+'rem'}"></wjmm>
            <div class="app-login" :style="{left:index*-8.65+'rem'}" v-if="$fnc.isYkAPP() && (isNewAppAlipaylogin=='1' || isNewAppWxlogin=='1')">
              <van-divider :style="{ color: '#e1e1e1', borderColor: '#e1e1e1' }">使用第三方账号登录</van-divider>
              <div class="fx app-stylm">
                <img src="../assets/img/login/wx-login.jpg" @click="appWxLogin" v-if="isNewAppWxlogin=='1'" />
                <img src="../assets/img/login/alipay-login.jpg" @click="appAlipayLogin" v-if="isNewAppAlipaylogin=='1'" />
              </div>
            </div>
          </div>
          <!-- <hd></hd> -->
        </div>
      </div>
    </div>
    <div class="login_footer_text">
      <p>
        注册即代表您已阅读并同意
        <a @click="$router.push({path:'/useragreement',query:{id:item.id}})" v-for="(item,k) in article" :key="k"
            style="padding-left:5px">{{item.title}}</a>
      </p>
    </div>
  </div>
</template>
<script>
var configAuthLoginResult = function (type, data) {
  /*
     备注：
    type 1 微信 2 支付宝
    data 授权信息(json串)
     */
  if (type == 1) {
    if (typeof data == "string") {
      window.jsWxLogin(JSON.parse(data));
    } else {
      window.jsWxLogin(data);
    }
  }
  if (type == 2) {
    if (typeof data == "string") {
      window.jsAlipayLogin(JSON.parse(data));
    } else {
      window.jsAlipayLogin(data);
    }
  }
};
window.configAuthLoginResult = configAuthLoginResult;
import phoneLogin from "@/components/login/phoneLogin.vue";
import reg from "@/components/login/reg.vue";
import wjmm from "@/components/login/wjmm.vue";
import { mapState } from "vuex";
import { Divider, Image, Loading } from "vant";
import Cookies from "js-cookie";
export default {
  name: "logins",
  components: {
    phoneLogin,
    reg,
    wjmm,
    [Divider.name]: Divider,
    [Image.name]: Image,
    [Loading.name]: Loading
  },
  data () {
    return {
      is_reg_nick: 0,
      article: [],
      share: "",
      tog: true,
      bgUrl: "",
      index: "0",
      indicatorDots: true,
      autoplay: false,
      interval: 2000,
      duration: 500,
      loadModal: false,
      title: "",
      div: "",
      num: 0,
      wH: 250,
      wW: 750,
      winheight: "650",
      item: "中国(+86)",
      isgj: "0",
      isguolei: "0",
      url: "",
      config: this.$store.state.config || {}
    };
  },
  created () {
    // this.getconfig();
    this.getLoginBg();
    this.$store.commit("loginOut");
    this.$store.dispatch("getconfig");
    sessionStorage.setItem("is_announ", JSON.stringify(true)); //弹出框
    if (this.$route.query.rk) {
      this.index = 1;
    }

    if (this.$route.query.redirect) {
      if (this.$route.query.redirect.indexOf("&tshare=")) {
        let reg = new RegExp("(^|&?)tshare=([^&]*)(&)");
        let r = this.$route.query.redirect.substr(1).match(reg);
        if (r != null && unescape(r[2]) != undefined) {
          this.share = unescape(r[2]);
          this.index = "1";
        }
      }
    }
  },
  computed: {
    ...mapState({
      loginConfig: state => state.loginConfig,
      configs: state => state.config,
      storeUuid: state => state.appUuid
    }),
    getConfig () {
      return this.$store.state.config;
    },
    isNewAppWxlogin () {
      if (this.loginConfig.is_app_wx_login == undefined) {
        return "0";
      } else {
        return this.loginConfig.is_app_wx_login;
      }
    },
    isNewAppAlipaylogin () {
      if (this.loginConfig.is_app_zfb_login == undefined) {
        return "0";
      } else {
        return this.loginConfig.is_app_zfb_login;
      }
    },
    alipayConfig () {
      if (this.loginConfig.alipay_login != undefined) {
        return this.loginConfig.alipay_login
      } else {
        return { app_id: '', app_secret: '', username: '' }
      }
    }
  },
  watch: {
    getConfig (val) {
      this.config = val || {};
      this.isgj = this.config.plugin
        ? this.config.plugin.gjdx.is_open + ""
        : "";
    }
  },
  mounted () {
    window.jsWxLogin = this.jsWxLogin; // app登录回调方法得到结果执行的函数
    window.jsAlipayLogin = this.jsAlipayLogin; // 支付宝登录回调方法得到结果执行的函数
  },
  methods: {
    jsAlipayLogin (data) {
      var params = {};
      params.openid = data.alipay_open_id;
      params.auth_code = data.auth_code;
      if (this.storeUuid) {
        params.device = this.storeUuid;
      }
      this.$api.getUser.appAlipayLogin(params).then(res => {
        if (res.code == 200) {
          this.toLogin(res);
        }
      });
    },
    jsWxLogin (data) {
      var params = {};
      params.openid = data.openid;
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (this.storeUuid) {
        params.device = this.storeUuid;
      }
      if (isiOS) {
        params.nickname = data.originalResponse.nickname;
        params.headimgurl = data.originalResponse.headimgurl;
        params.province = data.originalResponse.province;
        params.city = data.originalResponse.city;
        params.unionid = data.originalResponse.unionid;
      } else {
        params.nickname = data.screen_name;
        params.headimgurl = data.profile_image_url;
        params.province = data.province;
        params.city = data.city;
        params.unionid = data.unionid;
      }

      this.$api.getUser.appWxLogin(params).then(res => {
        if (res.code == 200) {
          this.toLogin(res);
        }
      });
    },
    toLogin (res) {
      var val = res.result;
      this.$store.commit("setUser", res.result);
      if (val.im) {
        this.$store.dispatch("login", {
          userID: val.im,
          userSig: val.im_sig
        });
      }

      // this.$store.commit("setIsLogin", true);
      var ua = window.navigator.userAgent.toLowerCase(); //极光推送
      // eslint-disable-next-line no-empty

      if (
        ua.match(/ykapp/i) == "ykapp" &&
        this.$store.state.config.shop.is_aurora == 1 &&
        this.$store.state.config.plugin.appbbxt.is_open == 1
      ) {
        try {
          // eslint-disable-next-line no-empty
          // eslint-disable-next-line no-undef
          var aurora_id = ykAPP.getApplicationId();
          if (aurora_id != res.result.aurora_id) {
            this.$store.dispatch("getAurora", aurora_id);
          }
        } catch (error) {
          new Error("失败了");
        }
      }

      if (
        this.$route.query.redirect &&
        this.$route.query.redirect.indexOf("/login") < 0
      ) {
        let redirect = this.$route.query.redirect;
        this.$router.replace(redirect);
      } else {
        var foot = Cookies.get("foot") ? JSON.parse(Cookies.get("foot")) : { link: '/' };
        this.$router.replace({ path: foot.links });
      }
    },
    appAlipayLogin () {
      try {
        var { app_id, username, app_secret } = this.alipayConfig;
        this.$fnc.appAlipayLogin(app_id, username, app_secret);
      } catch (error) {
        this.$toast("请在app里打开");
      }
    },
    appWxLogin () {
      try {
        this.$fnc.appWxLogin();
      } catch (error) {
        this.$toast("请在app里打开");
      }
    },
    getsuss () {
      this.index = 0;
    },
    // getconfig(){
    //     this.$api.getUser.getConfig({}).then(res=>{
    //         if(res.code==200){
    //             this.config=res.result

    //             this.isgj=res.result.plugin['gjdx'].is_open+'';

    //             this.$store.commit("setConfig", res.result);
    //         }
    //     });
    // },
    getIsload (obg) {
      this.loadModal = obg.isLoad;
      this.title = obg.title;
    },
    getLoginBg () {
      this.$api.getUser.getLoginBg({ cate: "vue_login_bg" }).then(res => {
        if (res.code == 200) {
          this.bgUrl = res.result.piclink || require('../assets/img/login/login_bg1.png');
          document.title = res.result.title;
          this.article = res.result.footer;
          this.is_reg_nick = res.result.is_reg_nick;
          this.$store.commit("setAppTitle", res.result.title);
          this.$store.commit("setLoginConfig", res.result);
        }
      });
    },
    toggle (index) {
      this.index = index;
    }
  }
};
</script>


<style lang='less'>
.s1s1s1 {
  width: 3500px;
  overflow: hidden;
  padding-bottom: 50px;
  position: relative;
}
.app-login {
  position: absolute;
  bottom: 0;
  width: 325px;
  font-size: 13px;
  transition: all 0.5s linear;
  > div:first-child {
    padding: 0 18px;
  }
  .app-stylm {
    justify-content: center;
    padding-bottom: 12px;
    img {
      width: 34px;
      height: 34px;
      margin: 0 10px;
    }
  }
}
.login {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.login_bg {
  background-repeat: no-repeat;
  background-size: 100%;
  height: 250px;
  position: relative;
}
.login_form {
  width: 324px;
  /* height: 690px; */
  min-height: 427px;
  // position: absolute;
  margin: -90px auto 0 auto;
  left: 0;
  right: 0;
  /* border-radius: 5px; */
}
.login_con {
  // position: absolute;
  border-radius: 0 0 5px 5px;
  overflow: hidden;
  background: #fff;
  // padding-top: 10px;
  width: 324px;
  left: 0;
}
.shou_item {
  position: relative;
  float: left;
  width: 325px;
  height: 100%;
  background: #fff;
  transition: all 0.5s linear;
}

.login_text {
  height: 40px;
  position: relative;
}
.login_text > span {
  float: left;
  width: 2.88rem;
  text-align: center;
  line-height: 40px;
  color: #fff;
  position: relative;
  z-index: 2;
  font-size: 16px;
  font-weight: bold;
}
.login_text > span {
  position: relative;
  z-index: 10;
}
.box {
  width: 2.88rem;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  transition: all 0.5s linear;
  background: #fff;
  z-index: 1;
  border-radius: 5px 5px 0 0;
}
.text_a {
  position: relative;
  z-index: 10;
}
.text_active {
  z-index: 5;
  color: #333 !important;
  transition: all 0.1s linear;
}
.text2_active {
  z-index: 5;
  color: #333 !important;
  transition: all 0.1s linear;
}
.login_footer_text {
  text-align: center;
  width: 100%;
  margin: 10px 0;
  // position: absolute;
  bottom: 0;
  color: #ababab !important;
  font-size: 12px;
  a {
    color: red;
    font-weight: bold;
  }
}
.hx {
  width: 16px;
  height: 10px;
  vertical-align: middle;
  margin-left: 12.5px;
}
</style>
