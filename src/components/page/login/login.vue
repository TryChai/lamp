<template>
  <div class="minecontainer">
    <div class="main">
      <h3>{{ $h("登录账户") }}</h3>
      <div class="paper">
        <p class="one">{{ active=='1'?$h("请输入邮箱及密码"):$h("请输入手机号或用户名及密码") }}</p>
        <p class="two">{{ $h("没有账号？") }}</p>
        <a @click="toRegister">{{ $h("去注册") }}</a>
      </div>
      <div>
        <van-tabs v-model="active">
          <van-tab name="1" title="邮箱登陆">
            <div class="form">
              <van-form @submit="onSubmit">
                <div class="one">
                  <van-field
                    @blur="windowScorll"
                    v-model="email"
                    :border="false"
                    type="text"
                    class="fx_2"
                    :placeholder="$h('请输入邮箱账号')"
                    clearable
                  >
                  </van-field>
                </div>
                <van-field
                  @blur="windowScorll"
                  v-model="email_password"
                  :border="false"
                  type="password"
                  class="fx_2"
                  :placeholder="$h('请输入密码')"
                  clearable
                />

                <div class="wjmm">
                  <a
                    href="#"
                    @click="$router.push('/ykbxt/create')"
                    v-if="is_wallet_key == 1"
                    >{{ $h("创建钱包") }}</a
                  >
                  <a
                    href="#"
                    @click="$router.push('/ykbxt/import')"
                    v-if="is_wallet_key == 1"
                    >{{ $h("钱包登录") }}</a
                  >
                  <a href="#" @click="toEmailReset">{{ $h("忘记密码") }}</a>
                </div>
                <div class="login_btn">
                  <van-button
                    round
                    block
                    type="info"
                    native-type="submit"
                    @click="toYz"
                    >{{ $h("登录") }}</van-button
                  >
                </div>
              </van-form>
            </div>
          </van-tab>
          <van-tab name="2" title="手机号登陆">
            <div class="form">
              <van-form @submit="onSubmit">
                <div class="one">
                  <van-field
                    @blur="windowScorll"
                    v-model="username"
                    :border="false"
                    type="text"
                    class="fx_2"
                    :placeholder="$h('请输入手机号码或者用户名')"
                    clearable
                  >
                    <template #label>
                      <div class="form_item_my" @click="showgjbtn">
                        <img src="../../../assets/img/gj.png" mode />
                        <div class="f_l gj_left" style="width: 80%">
                          {{ $h(gj) }}
                        </div>
                      </div>
                    </template>
                  </van-field>
                </div>
                <van-field
                  @blur="windowScorll"
                  v-model="password"
                  :border="false"
                  type="password"
                  class="fx_2"
                  :placeholder="$h('请输入密码')"
                  clearable
                />

                <div class="wjmm">
                  <a
                    href="#"
                    @click="$router.push('/ykbxt/create')"
                    v-if="is_wallet_key == 1"
                    >{{ $h("创建钱包") }}</a
                  >
                  <a
                    href="#"
                    @click="$router.push('/ykbxt/import')"
                    v-if="is_wallet_key == 1"
                    >{{ $h("钱包登录") }}</a
                  >
                  <a href="#" @click="toReset">{{ $h("忘记密码") }}</a>
                </div>
                <div class="login_btn">
                  <van-button
                    round
                    block
                    type="info"
                    native-type="submit"
                    @click="toYz"
                    >{{ $h("登录") }}</van-button
                  >
                </div>
              </van-form>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
    <van-popup get-container="body" v-model="showGj" position="right">
      <index-list @clickData="clickData" />
    </van-popup>
  </div>
</template>

<script>
import Vue from "vue";
import { Form } from "vant";
import { Checkbox, CheckboxGroup } from "vant";
import hd from "@/components/currency/hd.vue";
import IndexList from "@/components/currency/IndexList.vue";
import { Field } from "vant";
import { setTimeout } from "timers";
import { mapState } from "vuex";

Vue.use(Form, Checkbox, CheckboxGroup);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);

export default {
  components: {
    hd,
    [Field.name]: Field,
    IndexList,
  },
  computed: {
    ...mapState({
      storeUuid: (state) => state.appUuid,
    }),
    getConfig() {
      return this.$store.state.config;
    },
  },
  props: {
    tshare: {
      type: String,
      default: "",
    },
    str: {
      type: String,
      default: "新加坡(+65)",
    },
    isgj: {
      type: String,
      default: "",
    },
    is_wallet_key: {
      type: [String, Number],
    },
    check: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      active: "1",
      email: "",
      email_password:
        window.location.href.indexOf("mobile.mm80") > 0 ? "test123" : "",
      nickname: "",
      username:
        window.location.href.indexOf("mobile.mm80") > 0 ? "test123" : "",
      password:
        window.location.href.indexOf("mobile.mm80") > 0 ? "test123" : "",
      checked: this.check,
      twopassward: "",
      rex: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
      pas: /^[a-zA-Z0-9]{6,}$/,
      num: 60,
      text: "发送验证码",
      wyz: "",
      code: "",
      modalName: "",
      is_show: true,
      gj: this.str,
      share: this.tshare,
      con: {
        sms: {
          zcdxyz: 0,
        },
      },
      show: false,
      showGj: false,
      text: "获取验证码",
      flag: 60,
      ishow: false,
    };
  },
  watch: {
    check(val) {
      this.checked = val;
    },
  },
  methods: {
    showgjbtn() {
      if (this.$store.state.config.plugin.gjdx.is_open == "1") {
        this.showGj = true;
      }
    },
    toRegister() {
      // 注册
      this.$emit("getIndex", 1);
      this.$emit("getActive",this.active);
    },
    toReset() {
      // 忘记密码
      this.$emit("getIndex", 2);
    },
    toEmailReset() {
      // 忘记密码
      this.$emit("getIndex", 3);
    },
    onSubmit(values) {},
    clickData(item) {
      this.gj = item.label + "(+" + item.code + ")";
      this.quhao = item.code;
      this.showGj = false;
    },
    toYz() {
      if(this.active=='1'){
        if (this.email_password == "") {
        this.$toast.fail(this.$h("密码输入不合法"));
      } else {
        this.show = true;
        this.toEmailLogin();
      }
      }else{
        if (this.password == "") {
        this.$toast.fail(this.$h("密码输入不合法"));
      } else {
        this.show = true;  
        this.toLogin();
      }
      }
      
    },
    toLogin() {
      this.show = false;
      if (this.username == "") {
        this.$toast.fail(this.$h("手机号不能为空"));
        return false;
      } else if (this.password == "") {
        this.$toast.fail(this.$h("密码不能为空"));
        return false;
      } else if (this.checked == false) {
        this.$toast.fail(this.$h("请先勾选服务条款"));
        return false;
      } else {
        var params = {};
        params.username = this.username;
        params.password = this.$getCode(this.password);
        params.quhao = this.gj.replace(/[^0-9]/gi, "");
        this.$api.getUser.login(params).then((res) => {
          if (res.code == 200) {
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
              if (redirect.indexOf("http") < 0) {
                this.$router.replace({
                  path: redirect,
                });
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
                this.$router.replace({
                  path: url,
                });
              } else {
                window.location = url;
              }
            } else {
              this.$router.replace({
                path: "/index",
              });
            }
          }
        });
      }
    },
    toEmailLogin() {
      this.show = false;
      if (this.email == "") {
        this.$toast.fail(this.$h("邮箱不能为空"));
        return false;
      } else if (this.email_password == "") {
        this.$toast.fail(this.$h("密码不能为空"));
        return false;
      } else if (this.checked == false) {
        this.$toast.fail(this.$h("请先勾选服务条款"));
        return false;
      } else {
        var params = {};
        params.email = this.email;
        params.password = this.$getCode(this.email_password);
        this.$api.getUser.emailLogin(params).then((res) => {
          if (res.code == 200) {
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
              if (redirect.indexOf("http") < 0) {
                this.$router.replace({
                  path: redirect,
                });
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
                this.$router.replace({
                  path: url,
                });
              } else {
                window.location = url;
              }
            } else {
              this.$router.replace({
                path: "/index",
              });
            }
          }
        });
      }
    },
  },
  created() {
    var str = window.location.host;
    if (
      str.indexOf("inexcn") >= 0 &&
      (str.indexOf("hy") >= 0 || str.indexOf("ys") >= 0)
    ) {
      this.username = "test123";
      this.password = "test123";
    }
  },
};
</script>
<style lang="less" scoped>
.minecontainer {
  overflow: auto;
  background-color: #ffffff;
  opacity: 1;
  margin: 0;
  padding: 0 38px;
}

.header {
  width: 375px;
  height: 175px;
}

.logo {
  width: 335px;
  height: 175px;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
}

.logo img {
  max-width: 100%;
  max-height: 100%;
}

.main {
  width: 100%;
  height: auto;

  h3 {
    font-size: 22px;
  }
}

.select {
  width: auto;
  border-bottom: 1px solid #eeeeeeff;
  border-top: none;
  border-left: none;
  border-right: none;
  background-color: #fff;
  text-align: center;
  text-align-last: right;
}

.paper {
  padding: 0;
  line-height: 20px;
  margin-top: 5px;
}

.paper .one {
  font-size: 16px;
  color: rgb(92, 92, 92);
}

.paper .two {
  font-size: 14px;
  color: rgb(106, 106, 106);
  display: inline;
}

.paper a {
  font-size: 14px;
  color: #1ba2ff;
}

.form {
  width: 100%;
  height: auto;
  margin-top: 10px;

  .van-cell {
    border-bottom: 1px solid #eeeeee;
    height: 48px;
    padding: 0;
  }

  .wjmm {
    text-align: right;
    font-size: 12px;
    margin: 10px 0 15px 0;

    a {
      color: #1ba2ff;
      padding-left: 10px;
    }
  }

  .one {
    display: flex;

    .van-cell {
      padding: 0;
    }
  }

  .two {
    display: flex;
    position: relative;

    .mybtn {
      width: 20%;
      height: 100%;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 55;
      border: none;
      font-size: 12px;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .code {
        border: 1px solid #c8c9cc;
        color: #c8c9cc;
        padding: 2px;
        border-radius: 5px;
      }
    }
  }
}

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

.footer {
  height: auto;
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

.others .left {
  width: 110px;
}

.tupiao {
  display: flex;
  width: 110px;
  justify-content: space-between;
}

.others .right {
  width: 110px;
}

.others a img {
  width: 35px;
  height: 35px;
}

.condition {
  display: flex;
  margin-left: 10px;
}
/deep/.van-tabs__line{
  width: 80px;
  background-color: #1ba2ff;
}
/deep/.van-tabs__wrap{
  margin-left: -40px;
}
</style>
