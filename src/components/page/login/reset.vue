<template>
  <div class="minecontainer">
    <div class="main">
      <h3>重置密码</h3>
      <div class="paper">
        <p class="one">请输入手机号码验证后重置</p>
        <p class="two">没有账号？</p>
        <a href="#" @click="toRegister">去注册</a>
      </div>
      <div class="form">
        <van-form @submit="onSubmit">
          <div class="one">
            <van-field
              @blur="windowScorll"
              v-model="username"
              :border="false"
              type="text"
              class="fx_2"
              placeholder="请输入手机号码"
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
                    {{ gj }}
                  </div>
                </div>
              </template>
            </van-field>
          </div>
          <div class="two">
            <van-field
              @blur="windowScorll"
              v-model="code"
              :border="false"
              type="text"
              class="fx_2"
              placeholder="验证码"
              clearable
            />
            <div class="mybtn" @click="getCODE" v-if="num == 60">
              <span class="code_bule">{{ $h(text) }}</span>
            </div>
            <div class="mybtn" v-if="num != 60">
              <span class="code">{{ $h(text) }}</span>
            </div>
          </div>
          <van-field
            @blur="windowScorll"
            v-model="password"
            :border="false"
            type="password"
            class="fx_2"
            placeholder="密码长度至少6位，且同时包含字母和数字"
            clearable
          />
          <div class="to_login"><a href="#" @click="toLogin">返回登录</a></div>
          <div class="login_btn">
            <van-button type="info" @click="toYz">立即重置</van-button>
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
  },
  data() {
    return {
      nickname: "",
      username: "",
      password: "",
      checked: this.check,
      rex: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
      pas: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
      num: 60,
      text: "发送验证码",
      wyz: "",
      code: "",
      gj: this.str,
      con: {
        sms: {
          zcdxyz: 0,
        },
      },
      showGj: false,
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
    toLogin() {
      this.$emit("getIndex", 0);
    },
    toRegister() {
      this.$emit("getIndex", 1);
    },
    onSubmit(values) {
      console.log("submit", values);
    },
    clickData(item) {
      console.log("哈哈哈哈哈哈哈哈哈哈或或：", item);
      this.gj = item.label + "(+" + item.code + ")";
      this.quhao = item.code;
      this.showGj = false;
    },
    getCODE() {
      if (this.username == "") {
        this.$toast.fail("手机号码不能为空");
        return false;
      }
      this.sendcode();
    },
    sendcode() {
      var value = this.username;
      if (value == "") {
        this.$toast.fail("手机号码不能为空");
        return false;
      }
      this.$api.getUser
        .is_have_user({
          username: value,
        })
        .then((res) => {
          if (res.status == 1) {
            this.$toast.fail("用户未注册");
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
            this.$toast.success("发送成功");
            this.wyz = res.result;
            var temar = setInterval(function () {
              if (_this.num <= 0) {
                clearInterval(temar);
                _this.text = "发送验证码";
                _this.num = 60;
              } else {
                _this.num--;
                _this.text = +_this.num + "秒";
              }
            }, 1000);
          }
        });
    },
    toYz() {
      if (this.password == "" || !this.$fnc.regexp(this.pas, this.password)) {
        this.$toast.fail("密码输入不合法");
      } else {
        this.toReg();
      }
    },
    toReg() {
      const { username, password, checked } = this;
      if (username == "") {
        this.$toast.fail("用户名不能为空");
        return false;
      } else if (password == "") {
        this.$toast.fail("密码不能为空");
        return false;
      } else if (checked == false) {
        this.$toast.fail(this.$h("请先勾选服务条款"));
        return false;
      } else {
        const sendData = {
          code: this.code,
          unicode: this.wyz,
          username: username,
          password: this.$getCode(password),
          quhao: this.gj.replace(/[^0-9]/gi, ""),
        };
        this.$api.getUser.changePssword(sendData).then((res) => {
          if (res.code == 200) {
            this.$toast.success("修改成功");
            this.username = "";
            this.password = "";
            this.code = "";
            // this.$router.push("/login");
            this.$emit("getIndex", 0);
          }
        });
      }
    },
  },
};
</script>

  <style lang="less" scoped>
.minecontainer {
  // height: 100%;
  // overflow: hidden;
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
  /* opacity: 0.3; */
  border-top: none;
  border-left: none;
  // border-right: node;
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

  .to_login {
    text-align: right;
    font-size: 12px;
    margin: 10px 0 15px 0;

    a {
      color: #1ba2ff;
    }
  }
}

.van-checkbox__label {
  margin-left: 0.21333rem;
  color: #323233;
  line-height: 0.33333rem;
  font-size: 16px;
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
  // width: 375px;
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
  // margin-left: 90px;
}

.condition {
  display: flex;
  margin-left: 10px;
}
</style>
