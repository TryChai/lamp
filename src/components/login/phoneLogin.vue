<template>
  <div>
    <div class="hid_mar">
      <div class="form_item_my" @click="showGj=true" v-if="isgj=='1'">
        <img src="../../assets/img/gj.png" mode class="input_icon" />
        <div class="f_l input_icon gj_left" style="width: 60%;">{{gj}}</div>
      </div>

      <div class="form_item_my">
        <img src="../../assets/img/phone.png" mode class="input_icon" />
        <van-field @blur="windowScorll" v-model="username" :border="false" type="text" placeholder="手机号" clearable />
        <span class="icon-close f_r icon_f_r" v-if="username!=''" @click="username=''"></span>
      </div>
      <div class="form_item_my">
        <img src="../../assets/img/lock.png" mode class="input_icon" />
        <van-field @blur="windowScorll" v-model="password" :type="is_show?'password':'text'" :right-icon="is_show?'eye':'closed-eye'"
            @click-right-icon="is_show=!is_show" placeholder="输入6-15位数字+字母密" clearable />
      </div>
      <div class="uni-btn-v form_sub">
        <div @click.prevent="toYz">登录</div>
      </div>
    </div>
    <van-popup v-model="show" get-container="body">
      <div class="con_hd">
        <div class="fx hd">
          <div class="tc fx_3 hd_title">按住滑块往右</div>
          <div>
            <van-icon name="cross" color="red" @click="show=false" size="14" />
          </div>
        </div>
        <div style="display:flex">
          <hd @is_yz="getYz" v-if="show" />
        </div>
      </div>
    </van-popup>
    <van-popup v-model="showGj" position="right">
      <index-list @clickData="clickData" />
    </van-popup>
  </div>
</template>

<script>
import { Field } from "vant";
import hd from "@/components/currency/hd.vue";
import IndexList from "@/components/currency/IndexList.vue";
export default {
  name: "phoneLogin",
  components: {
    [Field.name]: Field,
    hd,
    IndexList
  },
  props: {
    str: {
      type: String,
      default: "中国(+86)"
    },
    isgj: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      is_show: true,
      username: "",
      password: "",
      logining: false,
      rex: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
      pas: /^[a-zA-Z0-9]{6,15}$/,
      showClearIcon: false,
      closePhobe: false,
      type: "",
      shows: false,
      modalName: null,
      gj: this.str,
      islog: false,
      show: false,
      showGj: false
    };
  },
  created () {
    var str = window.location.host
    if (str.indexOf('inexcn') >= 0 && (str.indexOf('hy') >= 0 || str.indexOf('ys') >= 0)) {
      this.username = "test123"
      this.password = "test123"
    }
  },
  methods: {
    toYz () {
      if (this.password == "" || !this.$fnc.regexp(this.pas, this.password)) {
        this.$toast.fail("密码输入不合法");
      } else {
        // if ((process.env.NODE_ENV == "development") || sessionStorage.getItem('passreg') == 1) {
        //     this.toLogin();
        // } else {
        //     this.show = true;
        // }
        this.toLogin();
      }
    },
    getYz (bool) {
      if (bool) {
        this.toLogin();
      }
    },
    clickData (item) {
      this.gj = item.label + "(+" + item.code + ")";
      this.quhao = item.code;
      this.showGj = false;
    },
    toLogin () {
      this.show = false;
      if (this.username == "") {
        this.$toast.fail("用户名不能为空");
        return false;
      } else if (this.password == "") {
        this.$toast.fail("密码不能为空");
        return false;
      } else {
        var params = {};
        params.username = this.username;
        params.password = this.$getCode(this.password);
        params.quhao = this.gj.replace(/[^0-9]/gi, "");
        this.$api.getUser.login(params).then(res => {
          if (res.code == 200) {
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
              if (redirect.indexOf("http") < 0) {
                this.$router.replace({ path: redirect });
              } else {
                window.location = redirect;
              }
              this.$router.replace(redirect);
            } else if (
              this.$route.query.url &&
              this.$route.query.url.indexOf("/login") < 0
            ) {
              let url = this.$route.query.url;
              if (url.indexOf("http") < 0) {
                this.$router.replace({ path: url });
              } else {
                window.location = url;
              }
            } else {
              this.$router.replace({ path: "/index" });
            }
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.hid_mar {
  display: block;
  height: 100%;
  overflow: hidden;
}

.form_sub {
  box-sizing: border-box;
  width: 300px;
  margin: 0 auto;
  display: block;
  margin-top: 32.5px;
}
.form_sub > div {
  background: #2d2f3b;
  text-align: center;
  color: #fff;
  font-weight: bold;
  margin: 0;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  border-radius: 10px;
}
.icon_input {
  position: absolute;
  top: 20px;
  z-index: 2;
  left: 4px;
  color: #7f7f7f;
  width: 30px;
}
</style>