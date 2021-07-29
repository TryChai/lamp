<template>
  <div class="new_login">
    <div class="header">
      <div class="logo">
        <img :src="config.shop.logo || require('@/assets/img/logo.png')" alt />
      </div>
      <span class="backIndex" @click="$router.push(getConfig.footer[0].links)"><van-icon name="arrow-left"></van-icon>返回首页</span>
      <span class="languagebox" @click="languageshow = true"
          v-if="$store.state.config.plugin && $store.state.config.plugin.dyy && $store.state.config.plugin.dyy.is_open == 1 ">
        {{$store.state.nowlanguage.iden || 'CN'}}
        <van-icon name="arrow-down" />
      </span>
    </div>

    <login v-if="index == '0'" @getIndex="getIndex" @getActive="getActive" :isgj="isgj" :check="checked" :is_wallet_key="is_wallet_key"></login>
    <register v-else-if="index == '1'" @getIndex="getIndex" :active="active" :is_reg_nick="is_reg_nick" :isgj="isgj" :tshare="share" :check="checked"></register>
    <reset v-else-if="index == '2'" @getIndex="getIndex" :isgj="isgj" :check="checked"></reset>
    <emailReset v-else-if="index == '3'" @getIndex="getIndex" :isgj="isgj" :check="checked"></emailReset>

    <div style="margin: 25px; 0">
      <div class="condition">
        <van-checkbox v-model="checked" shape="square">
          <span class="van-checkbox__label">
            {{$h('我已阅读并同意')}}

            <a @click="$router.push({path:'/useragreement',query:{id:item.id}})" v-for="(item,k) in article" :key="k">《{{$h(item.title)}}》</a>
          </span>
        </van-checkbox>
      </div>

      <div class="footer"
          v-if="$fnc.isYkAPP() && (isNewAppWxlogin=='1' || isNewAppAlipaylogin=='1'|| isNewAppDouyinlogin=='1' || isNewAppApplelogin=='1' ||isNewAppSinalogin=='1') && index == '0'">
        <van-divider>{{$h('第三方账号登录')}}</van-divider>
        <div class="others">
          <div class="tupiao">
            <div>
              <a href="#" id="qq" @click="appLogin(1)" v-if="isNewAppWxlogin=='1'">
                <img src="@/assets/img/login/wx-login.jpg" alt />
              </a>
            </div>
            <div>
              <a href="#" id="wx" @click="appLogin(2)" v-if="isNewAppAlipaylogin=='1'">
                <img src="@/assets/img/login/alipay-login.jpg" alt />
              </a>
            </div>
            <div>
              <a href="#" id="wx" @click="appLogin(4)" v-if="isNewAppDouyinlogin=='1'">
                <img src="@/assets/img/login/douyin.png" alt />
              </a>
            </div>
            <div>
              <a href="#" id="wx" @click="appLogin(5)" v-if="isNewAppApplelogin=='1'">
                <img src="@/assets/img/login/ios.png" alt />
              </a>
            </div>
            <div>
              <a href="#" id="wx" @click="appLogin(6)" v-if="isNewAppSinalogin=='1'">
                <img src="@/assets/img/login/sina.png" alt />
              </a>
            </div>
          </div>
        </div>
      </div>

      <selLanguage :show="languageshow" @close="languageshow = false"></selLanguage>
    </div>
  </div>
</template>

<script>
var configAuthLoginResult = function (type, data) {
  /*
     备注：
    type 1 微信 2 支付宝  3qq  4抖音  5apple  6新浪
    data 授权信息(json串)
     */
  if (type == 1) {
    if (typeof data == "string") {
      window.vue.jsWxLogin(JSON.parse(data));
    } else {
      window.vue.jsWxLogin(data);
    }
  }
  if (type == 2) {
    if (typeof data == "string") {
      window.vue.jsAlipayLogin(JSON.parse(data));
    } else {
      window.vue.jsAlipayLogin(data);
    }
  }
  if (type == 4) {
    if (typeof data == "string") {
      window.vue.jsdouyinLogin(JSON.parse(data));
    } else {
      window.vue.jsdouyinLogin(data);
    }
  }
  if (type == 5) {
    if (typeof data == "string") {
      window.vue.jsIosLogin(JSON.parse(data));
    } else {
      window.vue.jsIosLogin(data);
    }
  }
  if (type == 6) {
    if (typeof data == "string") {
      window.vue.jsSinaLogin(JSON.parse(data));
    } else {
      window.vue.jsSinaLogin(data);
    }
  }
};
window.configAuthLoginResult = configAuthLoginResult;

import login from "@/components/page/login/login.vue";
import register from "@/components/page/login/register.vue";
import reset from "@/components/page/login/reset.vue";
import emailReset from "@/components/page/login/emailReset.vue";

import Cookies from "js-cookie";

import selLanguage from "@/components/currency/selLanguage/selLanguage"
import { Divider } from "vant";
import { mapState } from "vuex";
export default {
  components: {
    login,
    register,
    reset,
    emailReset,
    [Divider.name]: Divider,
    // mapState
    selLanguage
  },
  data () {
    return {
      languageshow: false,
      index: "0",
      config: this.$store.state.config || {},
      is_reg_nick: 0,
      isgj: "0",
      share: "",
      article: [],
      checked: false,
      is_wallet_key: 0,
      active:"",
    };
  },
  methods: {
    jsSinaLogin (data) {
      // var params = {};
      // params.openid = data.alipay_open_id;
      // params.auth_code = data.auth_code;
      // this.$api.getUser.appSinaLogin(params).then((res) => {
      //   if (res.code == 200) {
      //     this.toLogin(res);
      //   }
      // });
    },
    jsIosLogin (data) {
      var params = {};
      params.openid = data.uid;
      params.auth_code = data.authCode;
      params.nickname = data.nickname;
      this.$api.getUser.appIosLogin(params).then((res) => {
        if (res.code == 200) {
          this.toLogin(res);
        }
      });
    },
    jsdouyinLogin (data) {
      data = data.originalResponse;
      var params = {};
      params.openid = data.open_id;
      params.nickname = data.nickname;
      params.headimgurl = data.avatar;
      params.province = data.province;
      params.city = data.city;
      params.unionid = data.union_id;
      this.$api.getUser.appdouyinLogin(params).then((res) => {
        if (res.code == 200) {
          this.toLogin(res);
        }
      });
    },
    jsAlipayLogin (data) {
      var params = {};
      params.openid = data.alipay_open_id;
      params.auth_code = data.auth_code;
      if (this.storeUuid) {
        params.device = this.storeUuid;
      }
      this.$api.getUser.appAlipayLogin(params).then((res) => {
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

      this.$api.getUser.appWxLogin(params).then((res) => {
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
          userSig: val.im_sig,
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
        var foot = Cookies.get("foot")
          ? JSON.parse(Cookies.get("foot"))
          : { link: "/" };
        this.$router.replace({ path: foot.links });
      }
    },
    getIndex (index) {
      this.index = index;
    },
    getActive(active){
      this.active=active;
    },
    getLoginBg () {
      this.$api.getUser
        .getLoginBg({
          cate: "vue_login_bg",
        })
        .then((res) => {
          if (res.code == 200) {
            // this.bgUrl = res.result.piclink || require('../assets/img/login/login_bg1.png');
            document.title = res.result.title;
            this.article = res.result.footer;
            this.is_reg_nick = res.result.is_reg_nick;
            this.$store.commit("setAppTitle", res.result.title);
            this.$store.commit("setLoginConfig", res.result);
            this.is_wallet_key = res.result.is_wallet_key;
          }
        });
    },
    appLogin (type) {
      switch (true) {
        //微信登录
        case type == 1:
          console.log('微信')
          try {
            this.$fnc.appWxLogin();
          } catch (error) {
            this.$toast("请在app里打开");
          }
          break;
        //支付宝登录
        case type == 2:
          console.log('支付宝登录')
          try {
            var { app_id, username, app_secret } = this.alipayConfig;
            this.$fnc.appAlipayLogin(app_id, username, app_secret);
          } catch (error) {
            this.$toast("请在app里打开");
          }
          break;
        //qq登录
        case type == 3:

          break;
        //抖音登录
        case type == 4:
          console.log('抖音登录')
          try {
            this.$fnc.appdouyinLogin();
          } catch (error) {
            this.$toast("请在app里打开");
          }
          break;
        //苹果登录
        case type == 5:
          console.log('苹果登录')
          try {
            this.$fnc.appIosLogin();
          } catch (error) {
            this.$toast("请在app里打开");
          }
          break;
        //新浪登录
        case type == 6:
          console.log('新浪登录')
          try {
            this.$fnc.appSinaLogin();
          } catch (error) {
            this.$toast("请在app里打开");
          }
          break;
        default:
          break;
      }
    },

  },
  computed: {
    ...mapState({
      loginConfig: (state) => state.loginConfig,
      configs: (state) => state.config,
      storeUuid: (state) => state.appUuid,
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
    isNewAppDouyinlogin () {
      if (this.loginConfig.is_app_douyin_login == undefined) {
        return "0";
      } else {
        return this.loginConfig.is_app_douyin_login;
      }
    },
    isNewAppSinalogin () {
      if (this.loginConfig.is_app_sina_login == undefined) {
        return "0";
      } else {
        return this.loginConfig.is_app_sina_login;
      }
    },
    isNewAppApplelogin () {
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (!isiOS || this.loginConfig.is_app_Apple_login == undefined) {
        return "0";
      } else {
        return this.loginConfig.is_app_Apple_login;
      }
    },
  },
  created () {
    this.getLoginBg();
    this.$store.commit("loginOut");
    this.$store.dispatch("getconfig");
    //判断是否获取到 rk 的值，获取到就直接跳转注册
    if (
      this.$route.query.rk ||
      this.$route.query.tshare ||
      this.$route.query.share
    ) {
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
  mounted () {
    window.vue = this

  },
  watch: {
    getConfig (val) {
      this.config = val || {};
      this.isgj = this.config.plugin
        ? this.config.plugin.gjdx.is_open + ""
        : "";
    },
  },
};
</script>

<style lang="less" scoped>
.new_login {
  height: 100%;
  overflow: auto;
  // padding: 40px 0;
  .back{
    margin-left: 20px;
    // padding-top: 20px;
    font-size: 16px;
    color: rgb(92, 92, 92);
  }
  .header {
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo img {
    max-width: 87.5px;
    max-height: 87.5px;
    border-radius: 50%;
    box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.1);
  }
}

.condition {
  .van-checkbox {
    justify-content: center;
  }

  .van-checkbox__label {
    display: flex;
    align-items: center;
  }

  span {
    color: #e7e6eb;
    font-size: 13px;

    a {
      color: #1ba2ff;
      padding-left: 5px;
    }
  }
}

.footer {
  margin: 30px 38px 0;

  .con {
    position: relative;
    height: 20px;
    line-height: 20px;
    margin: 40px auto;
    text-align: center;
  }

  .con i {
    display: block;
    height: 0.5px;
    line-height: 0.5px;
    background: #e1e1e1;
    position: absolute;
    top: 12px;
    width: 100%;
  }

  .con p {
    display: inline-block;
    font-size: 12px;
    color: #c1c1c1;
    background: #ffffff;
    text-align: center;
    padding: 0 20px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .others {
    display: flex;
    justify-content: space-around;
  }

  .tupiao {
    display: flex;
    width: 110px;
    justify-content: center;
  }

  .others a img {
    width: 35px;
    height: 35px;
    // margin-left: 90px;
    margin: 0 10px;
  }
}
.languagebox {
  font-size: 18px;
  position: absolute;
  right: 15px;
  top: 15px;
}
.backIndex {
  font-size: 14px;
  position: absolute;
  display: flex;
  align-items: center;
  left: 15px;
  top: 15px;
  color: #1ba2ff;
}
</style>
