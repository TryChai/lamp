<template>

  <div>
    <!-- <van-button type="primary"
            @click="appletsLogin">小程序登录测试</van-button> -->
    <div id="app_wxlogin" v-show="showload == true">
      <div class="text-wrapper">
        <div class="text part1">
          <div>
            <span class="letter">
              <div class="character">L</div> <span></span>
            </span>
            <span class="letter">
              <div class="character">o</div> <span></span>
            </span>
            <span class="letter">
              <div class="character">a</div> <span></span>
            </span>
            <span class="letter">
              <div class="character">d</div> <span></span>
            </span>
            <span class="letter">
              <div class="character">i</div> <span></span>
            </span>
            <span class="letter">
              <div class="character">n</div> <span></span>
            </span>
            <span class="letter">
              <div class="character">g</div> <span></span>
            </span>
          </div>
        </div>
        <div class="how-to"><span>正在加载中，请您耐心等待...</span></div>
      </div>
    </div>

  </div>
</template>


<script>
export default {
  data () {
    return {
      showload: false,
      redirect_url: "",
      share: "",
      text: "",
      toast: null,
      url: "",
      res: '',
    }
  },
  created () {

    if (localStorage.getItem('applets_uid') && localStorage.getItem('applets_user_key') && !this.$route.query.code) {
      //applets_uid 和  applets_user_key 存在 则登录

      //!this.$route.query.code 如果用户已登录状态，存在applet_uid,applets_user_key 扫描推荐人二维码，小程序端返回的url存在code参数则重新登录
      var params = {
        id: localStorage.getItem('applets_uid'),
        user_key: localStorage.getItem('applets_user_key'),
      }
      this.$api.getUser.applets_login2(params).then(res => {
        if (res.code == 200) {
          if (res.result.im) {
            this.$store.dispatch('login', { userID: res.result.im, userSig: res.result.im_sig })
          }
          var obj = res.result;
          obj.xcxCookies = true;
          this.$store.commit("setUser", obj);

          //---------------------------------------
          // 如果是小程序
          // 登录后记录uid和 user_key记录浏览器
          // 如果小程序判断cookie丢失要重新登陆，先去判断uid是否存在，如果存在，接口mobile/power/applets_login2 直接发送id(uid)和user_key走登陆的流程
          // 如果小程序点击退出就清空浏览器记住的uid和user_key
          localStorage.setItem('applets_uid', obj.uid)
          localStorage.setItem('applets_user_key', obj.user_key)
          //---------------------------------------

          var u = localStorage.getItem('login-url');
          if (u == null || u == undefined || u == '' || u == 'undefined') {
            this.$router.replace({ path: "/" })
          } else if (u.indexOf('applets') == -1) {
            // this.$toast(u)
            this.$router.replace(u)
          } else {
            this.$router.replace({ path: "/" })
          }
        } else {


        }
      })
    } else {
      this.showload = true;
      sessionStorage.setItem('is_announ', JSON.stringify(true))     //弹出框
      this.appletsLogin();
    }

  },
  methods: {
    appletsLogin () {
      this.share = this.$route.query.tshare || '';
      var loginUrl = localStorage.getItem('login-url') || '';
      if (loginUrl && loginUrl.indexOf('&tshare=') >= 0) {
        var tshareUrlReg = new RegExp("(^|&?)tshare=([^&]*)(&)");
        var t = loginUrl.substr(1).match(tshareUrlReg)
        if (t != null) {
          this.share = unescape(t[2]);
        }
      }
      if (this.$route.query.appletshare && this.$route.query.appletshare != undefined && this.$route.query.appletshare != '' && this.$route.query.appletshare != 'undefined' && this.$route.query.appletshare != null) {
        this.share = this.$route.query.appletshare;
      }
      var params = {};

      params.code = this.$route.query.code;
      params.extra = 'applets';

      var nickname = this.$route.query.nickname;
      var headimgurl = this.$route.query.headimgurl;
      var iv = this.$route.query.iv;
      var encryptedData = this.$route.query.encryptedData;

      if (this.share != '' && this.share != undefined && this.share != null) {
        params.tshare = this.share
      }
      if (this.redirect_url != '' && this.redirect_url != undefined && this.redirect_url != null) {
        params.final_link = this.redirect_url
      }
      if (nickname != '' && nickname != undefined && nickname != null) {
        params.nickname = nickname;
      }
      if (headimgurl != '' && headimgurl != undefined && headimgurl != null) {
        params.headimgurl = headimgurl;
      }
      if (iv != '' && iv != undefined && iv != null) {
        params.iv = iv;
      }
      if (encryptedData != '' && encryptedData != undefined && encryptedData != null) {
        params.encryptedData = encryptedData;
      }

      this.$api.getUser.applets_login(params).then(res => {
        this.text = res;

        if (res.code == 200) {

          this.res = res.result;
          var val = res.result;
          if (val.im) {
            this.$store.dispatch('login', { userID: val.im, userSig: val.im_sig })
          }
          var obj = res.result;
          obj.xcxCookies = true;
          this.$store.commit("setUser", obj);


          //---------------------------------------
          // 如果是小程序
          // 登录后记录uid和 user_key记录浏览器
          // 如果小程序判断cookie丢失要重新登陆，先去判断uid是否存在，如果存在，接口mobile/power/applets_login2 直接发送id(uid)和user_key走登陆的流程
          // 如果小程序点击退出就清空浏览器记住的uid和user_key
          localStorage.setItem('applets_uid', obj.uid)
          localStorage.setItem('applets_user_key', obj.user_key)
          //---------------------------------------



          var u = localStorage.getItem('login-url');
          if (u == null || u == undefined || u == '' || u == 'undefined') {
            this.$router.replace({ path: "/" })
          } else if (u.indexOf('applets') == -1) {
            // this.$toast(u)
            this.$router.replace(u)
          } else {
            this.$router.replace({ path: "/" })
          }

        }
      })
    },

  },
}
</script>


<style lang="less" scoped>
@import "../../assets/css/wxloginLoding.css";
.load_login {
  position: fixed;
  margin: auto;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    background: #062734;
    // width:120px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
