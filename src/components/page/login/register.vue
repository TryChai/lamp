<template>
  <div class="minecontainer">
    <div class="main">
      <h3>{{ $h("注册账号") }}</h3>
      <div class="paper">
        <p class="one">{{ active=="1"?$h("请输入邮箱账号验证后重置"): $h("请输入手机号码验证后重置") }}</p>
        <p class="two">{{ $h("已有账号") }}？</p>
        <a @click="toLogin">{{ $h("去登录") }}</a>
      </div>
      <div class="form" v-if="active=='1'">
        <van-form>
          <div class="one">
           <van-field
              @blur="windowScorll"
              v-model="username"
              :border="false"
              type="text"
              class="fx_2"
              :placeholder="$h('请输入手机号码')"
              clearable
            >
              <template #label>
                <div class="form_item_my" @click="showgjbtn">
                  <img
                    src="../../../assets/img/gj.png"
                    mode
                    class="input_icon"
                  />
                  <div class="f_l input_icon gj_left" style="width: 80%">
                    {{ $h(gj) }}
                  </div>
                </div>
              </template>
            </van-field>
          </div>
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
           
          <div class="two" v-if="config.sms && config.sms.zcdxyz == '1'">
            <van-field
              @blur="windowScorll"
              v-model="code"
              :border="false"
              type="text"
              class="fx_2"
              :placeholder="$h('验证码')"
              clearable
            />
            <div class="mybtn" @click="getCODE" v-if="num == 60">
              <span class="code_bule">{{ $h(text) }}</span>
            </div>
            <div class="mybtn" v-if="num != 60">
              <span class="code">{{ $h(text) }}</span>
            </div>
          </div>
          <div class="form_item_my" v-if="is_reg_nick == '1'">
            <van-field
              @blur="windowScorll"
              v-model="nickname"
              :border="false"
              type="text"
              class="fx_2"
              :placeholder="$h('请输入用户昵称')"
              clearable
            />
          </div>
          <van-field
            @blur="windowScorll"
            v-model="email_password"
            :border="false"
            type="password"
            class="fx_2"
            :placeholder="$h('密码长度至少6位，且同时包含字母和数字')"
            clearable
          />

          <div class="form_item_my">
            <van-field
              @blur="windowScorll"
              v-model="share"
              :border="false"
              type="text"
              class="fx_2"
              :placeholder="$h('请输入功德码，获得更多功德')"
              clearable
            >
              <template #left-icon>
                <img
                  src="../../../assets/img/man.png"
                  mode
                  class="input_icon"
                />
              </template>
            </van-field>
          </div>
          <div class="login_btn">
            <van-button
              round
              block
              type="info"
              native-type="submit"
              @click="toEmailRegister"
              >{{ $h("注册") }}</van-button
            >
          </div>
        </van-form>
      </div>
      <div class="form" v-else>
        <van-form>
          <div class="one">
            <van-field
              @blur="windowScorll"
              v-model="username"
              :border="false"
              type="text"
              class="fx_2"
              :placeholder="$h('请输入手机号码')"
              clearable
            >
              <template #label>
                <div class="form_item_my" @click="showgjbtn">
                  <img
                    src="../../../assets/img/gj.png"
                    mode
                    class="input_icon"
                  />
                  <div class="f_l input_icon gj_left" style="width: 80%">
                    {{ $h(gj) }}
                  </div>
                </div>
              </template>
            </van-field>
          </div>
          <div class="two" v-if="config.sms && config.sms.zcdxyz == '1'">
            <van-field
              @blur="windowScorll"
              v-model="code"
              :border="false"
              type="text"
              class="fx_2"
              :placeholder="$h('验证码')"
              clearable
            />
            <div class="mybtn" @click="getCODE" v-if="num == 60">
              <span class="code_bule">{{ $h(text) }}</span>
            </div>
            <div class="mybtn" v-if="num != 60">
              <span class="code">{{ $h(text) }}</span>
            </div>
          </div>
          <div class="form_item_my" v-if="is_reg_nick == '1'">
            <van-field
              @blur="windowScorll"
              v-model="nickname"
              :border="false"
              type="text"
              class="fx_2"
              :placeholder="$h('请输入用户昵称')"
              clearable
            />
          </div>
          <van-field
            @blur="windowScorll"
            v-model="password"
            :border="false"
            type="password"
            class="fx_2"
            :placeholder="$h('密码长度至少6位，且同时包含字母和数字')"
            clearable
          />

          <div class="form_item_my">
            <van-field
              @blur="windowScorll"
              v-model="share"
              :border="false"
              type="text"
              class="fx_2"
              :placeholder="$h('请输入功德码，获得更多功德')"
              clearable
            >
              <template #left-icon>
                <img
                  src="../../../assets/img/man.png"
                  mode
                  class="input_icon"
                />
              </template>
            </van-field>
          </div>
          <div class="login_btn">
            <van-button
              round
              block
              type="info"
              native-type="submit"
              @click="toRegister"
              >{{ $h("注册") }}</van-button
            >
          </div>
        </van-form>
      </div>
    </div>
    <van-popup v-model="showGj" position="right">
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
    is_reg_nick: {
      type: [String, Number],
    },
    check: {
      type: Boolean,
      default: false,
    },
    active:{
      type: String,
      default: "",
    }
  },
  data() {
    return {
      nickname: "",
      username: "",
      password: "",
      checked: this.check,
      email:"",
      tel:"",
      email_password:"",
      rex: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
      pas: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
      num: 60,
      wyz: "",
      code: "",
      gj: this.str,
      share: this.tshare,
      con: {
        sms: {
          zcdxyz: 0,
        },
      },
      showGj: false,
      text: this.$h("获取验证码"),
      config: this.$store.state.config || {},
      quhao:'65',
    };
  },
  watch: {
    check(val) {
      this.checked = val;
    },
  },
  created() {
    if (this.$route.query.share) {
      this.share = this.$route.query.share || "";
    }
    if (this.$route.query.tshare) {
      if (Array.isArray(this.$route.query.tshare)) {
        this.share = this.$route.query.tshare[0] || "";
      } else {
        this.share = this.$route.query.tshare || "";
      }
    }
    if (this.share == undefined || this.share == "undefined") {
      this.share = "";
    }
  },
  methods: {
    showgjbtn() {
      if (this.$store.state.config.plugin.gjdx.is_open == "1") {
        this.showGj = true;
      }
    },
    toLogin() {
      this.$emit("getIndex", 0);
    },
    clickData(item) {
      this.gj = item.label + "(+" + item.code + ")";
      this.quhao = item.code;
      this.showGj = false;
    },
    getCODE() {
      if (this.username == "") {
        this.$toast.fail(this.$h("手机号码不能为空"));
        return false;
      }
      this.sendcode();
    },
    sendcode() {
      var value = this.username;
      if (value == "") {
        this.$toast.fail(this.$h("手机号码不能为空"));
        return false;
      }
      this.$api.getUser
        .is_have_user({
          username: value,
        })
        .then((res) => {
          if (res.status == 0) {
            this.$toast.fail("用户已存在");
            return false;
          } else {
            this.sendduan();
          }
        });
    },
    sendduan() {
      var _this = this;
      this.$api.getUser
        .sendCode({
          tel: this.username,
          quhao: this.quhao,
        })
        .then((res) => {
          if (res.status === 1) {
            this.$toast.success(this.$h("发送成功"));
            this.wyz = res.result;
            var temar = setInterval(function () {
              if (_this.num <= 0) {
                clearInterval(temar);
                _this.text = _this.$h("发送验证码");
                _this.num = 60;
              } else {
                _this.num--;
                _this.text = +_this.num + _this.$h("秒");
              }
            }, 1000);
          }
        });
    },
    toRegister() {
      const { username, password } = this;
      if (username == "") {
        this.$toast.fail(this.$h("手机号不能为空"));
        return false;
      } else if (password == "") {
        this.$toast.fail(this.$h("密码不能为空"));
        return false;
      } else if (!this.$fnc.regexp(this.pas, password)) {
        this.$toast.fail(this.$h("密码输入不合法"));
        return false;
      } else if (this.checked == false) {
        this.$toast.fail(this.$h("请先勾选服务条款"));
        return false;
      } else {
        const sendData = {
          code: this.code,
          unicode: this.wyz,
          username: username,
          tshare: this.share,
          password: this.$getCode(password),
          quhao: this.gj.replace(/[^0-9]/gi, ""),
        };
        if (this.is_reg_nick == 1) {
          sendData.nickname = this.nickname;
        }
        if (this.storeUuid) {
          sendData.device = this.storeUuid;
        }
        this.$api.getUser.regUser(sendData).then((res) => {
          if (res.code == 200) {
            this.$store.commit("setIsLogin", true);
            this.$store.commit("setUser", res.result);
            var ua = window.navigator.userAgent.toLowerCase(); //极光推送
            if (
              ua.match(/ykapp/i) == "ykapp" &&
              this.$store.state.config.shop.is_aurora == 1 &&
              this.$store.state.config.plugin.appbbxt.is_open == 1
            ) {
              try {
                var aurora_id = ykAPP.getApplicationId();
                if (aurora_id != res.result.aurora_id) {
                  this.$store.dispatch("getAurora", aurora_id);
                }
              } catch (error) {
                new Error(this.$h("失败了"));
              }
            }
            if (
              this.$route.query.redirect &&
              this.$route.query.redirect.indexOf("/login") < 0
            ) {
              let redirect = this.$route.query.redirect;
              this.$router.replace(redirect);
            } else {
              if (
                this.$store.state.config.plugin.appbbxt.is_open == 1 &&
                !this.$fnc.isYkAPP()
              ) {
                this.$router.replace({
                  path: "/toappupload",
                });
              } else {
                this.$router.replace({
                  path: "/index",
                });
              }
            }
          }
        });
      }
    },
    toEmailRegister() {
      const { email, email_password,username } = this;
      if ( username == "") {
        this.$toast.fail(this.$h("手机号不能为空"));
        return false;
      } else if ( email== "") {
        this.$toast.fail(this.$h("邮箱不能为空"));
        return false;
      } else  if (email_password == "") {
        this.$toast.fail(this.$h("密码不能为空"));
        return false;
      } else if (!this.$fnc.regexp(this.pas, email_password)) {
        this.$toast.fail(this.$h("密码输入不合法"));
        return false;
      } else if (this.checked == false) {
        this.$toast.fail(this.$h("请先勾选服务条款"));
        return false;
      } else {
        const sendData = {
          email: email,
          tel:username,
          password: this.$getCode(email_password),
          code: this.code,
          unicode: this.wyz,
          tshare: this.share,
          quhao: this.gj.replace(/[^0-9]/gi, ""),
        };
        if (this.is_reg_nick == 1) {
          sendData.nickname = this.nickname;
        }
        if (this.storeUuid) {
          sendData.device = this.storeUuid;
        }
        this.$api.getUser.reg_emailLogin(sendData).then((res) => {
          if (res.code == 200) {
            this.$store.commit("setIsLogin", true);
            this.$store.commit("setUser", res.result);
            var ua = window.navigator.userAgent.toLowerCase(); //极光推送
            if (
              ua.match(/ykapp/i) == "ykapp" &&
              this.$store.state.config.shop.is_aurora == 1 &&
              this.$store.state.config.plugin.appbbxt.is_open == 1
            ) {
              try {
                var aurora_id = ykAPP.getApplicationId();
                if (aurora_id != res.result.aurora_id) {
                  this.$store.dispatch("getAurora", aurora_id);
                }
              } catch (error) {
                new Error(this.$h("失败了"));
              }
            }
            if (
              this.$route.query.redirect &&
              this.$route.query.redirect.indexOf("/login") < 0
            ) {
              let redirect = this.$route.query.redirect;
              this.$router.replace(redirect);
            } else {
              if (
                this.$store.state.config.plugin.appbbxt.is_open == 1 &&
                !this.$fnc.isYkAPP()
              ) {
                this.$router.replace({
                  path: "/toappupload",
                });
              } else {
                this.$router.replace({
                  path: "/index",
                });
              }
            }
          }
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.minecontainer {
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

.one {
  display: flex;
  position: relative;

  .van-cell {
    padding: 0;
  }
}

.two {
  display: flex;
  position: relative;

  .mybtn {
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
      padding: 2px 10px;
      border-radius: 5px;
    }

    .code_bule {
      border: 1px solid #1ba2ff;
      color: #1ba2ff;
      padding: 2px 10px;
      border-radius: 5px;
    }
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

  .login_btn {
    margin-top: 30px;
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
  background: rgba(240, 240, 240, 1);
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
</style>
