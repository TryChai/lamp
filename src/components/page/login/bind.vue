<template>
  <div class="minecontainer">
    <div class="header">
      <div class="logo">
        <img :src="config.shop.logo || require('@/assets/img/logo.png')" alt />
      </div>
    </div>
    <div class="main">
      <h3>{{ $h("绑定手机号码") }}</h3>
      <div class="paper">
        <p class="one">{{ $h("请输入您的手机号码验证信息") }}</p>
        <p class="two">{{ $h("暂不绑定") }}？</p>
        <a href="#" @click="$router.push('/index')">{{ $h("返回") }}</a>
      </div>
      <div class="form">
        <van-form>
          <div class="one">
            <van-field @blur="windowScorll" v-model="username" :border="false" type="text" class="fx_2" :placeholder="$h('请输入手机号码')" clearable>
              <template #label>
                <div class="form_item_my" @click="showgjbtn">
                  <img src="../../../assets/img/gj.png" mode class="input_icon" />
                  <div class="f_l input_icon gj_left" style="width: 80%">
                    {{ $h(gj) }}
                  </div>
                </div>
              </template>
            </van-field>
          </div>
          <div class="two" v-if="config.sms.bdsjhdx == '1'">
            <van-field @blur="windowScorll" v-model="code" :border="false" type="text" class="fx_2" :placeholder="$h('验证码')" clearable />
            <div class="mybtn" @click="getCODE" v-if="num == 60">
              <span class="code_bule">{{ text }}</span>
            </div>
            <div class="mybtn" v-if="num != 60">
              <span class="code">{{ text }}</span>
            </div>
          </div>
          <div class="sign_out_login">
            <a @click="toLogout">{{ $h("退出登录") }}</a>
          </div>
          <div class="login_btn">
            <van-button type="info" @click="bindPhone">
              {{ $h("立即绑定") }}
            </van-button>
          </div>
        </van-form>
        <div class="condition">
          <van-checkbox icon-size="12px" v-model="checked" shape="square">
            <span>
              {{ $h("我已阅读并同意") }}
              <a @click="
                  $router.push({
                    path: '/useragreement',
                    query: { id: item.id },
                  })
                " v-for="(item, k) in article" :key="k">《{{ item.title }}》</a>
            </span>
          </van-checkbox>
        </div>
      </div>
      <van-popup v-model="showGj" position="right">
        <index-list @clickData="clickData" />
      </van-popup>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Form, Checkbox, CheckboxGroup, Field } from "vant";
import { mapState } from "vuex";
import IndexList from "@/components/currency/IndexList.vue";
export default {
  components: {
    [Field.name]: Field,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Form.name]: Form,
    IndexList,
  },
  computed: {},
  created () {
    this.getLoginBg();
    this.$store.dispatch("getconfig");
  },
  data () {
    return {
      username: "",
      checked: true,
      num: 60,
      code: "",
      gj: "新加坡(+65)",
      showGj: false,
      text: this.$h("获取验证码"),
      unicode: "",
      config: this.$store.state.config || {},
      article: [],
    };
  },
  methods: {
    showgjbtn () {
      if (this.$store.state.config.plugin.gjdx.is_open == "1") {
        this.showGj = true;
      }
    },
    clickData (item) {
      this.gj = item.label + "(+" + item.code + ")";
      this.quhao = item.code;
      this.showGj = false;
    },
    getCODE () {
      if (this.username == "") {
        this.$toast.fail($h("手机号码不能为空"));
        return false;
      }
      this.sendduan();
    },
    sendduan () {
      var _this = this;
      this.$api.getUser
        .bindPhoneCode({
          tel: this.username,
          quhao: this.gj.replace(/[^0-9]/gi, "") || 86,
        })
        .then((res) => {
          if (res.code == 200) {
            this.$toast.success(this.$h("发送成功"));
            this.unicode = res.result;
            var temar = setInterval(function () {
              if (_this.num <= 0) {
                clearInterval(temar);
                _this.text = _this.$h("获取验证码");
                _this.num = 60;
              } else {
                _this.num--;
                _this.text = +_this.num + _this.$h("秒");
              }
            }, 1000);
          } else if (res.code == 404) {
            _this.text = _this.$h("获取验证码");
            _this.num = 60;
          }
        });
    },
    getLoginBg () {
      this.$api.getUser
        .getLoginBg({
          cate: "vue_login_bg",
        })
        .then((res) => {
          if (res.code == 200) {
            document.title = res.result.title;
            this.article = res.result.footer;
            this.$store.commit("setAppTitle", res.result.title);
            this.$store.commit("setLoginConfig", res.result);
          }
        });
    },
    bindPhone () {
      if (this.checked == false) {
        this.$toast.fail(this.$h("请先勾选服务条款"));
        return false;
      } else if (this.config.sms.bdsjhdx == '1' &&  this.code == "") {
        this.$toast.fail(this.$h("请输入验证码"));
        return false;
      }
      var params = {};
      params.tel = this.username;
      params.code = this.code;
      params.unicode = this.unicode;

      this.$api.getUser.bindPhone(params).then((res) => {
        if (res.code == 200) {
          this.$toast.success(this.$h("绑定成功"));

          if (res.result == true) {
            this.$store.dispatch("getUser");
          } else {
            this.$store.commit("setUser", res.result);
            this.$store.dispatch("getUser");
          }
          if (
            this.$store.state.user.tid == 0 &&
            this.$store.state.config.shop.reg_permission == "1"
          ) {
            this.$store.commit("setTsShare", true);
          }
          setTimeout(() => {
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
          }, 1500);
        } else {
          this.$toast.fail(res.result);
          this.username = "";
          this.code = "";
        }
      });
    },
    //退出登录
    toLogout () {
      var that = this;
      that.$dialog
        .confirm({
          title: this.$h("提示"),
          message: this.$h("确定退出吗？"),
        })
        .then(() => {
          that.$api.getUser.loginOut({}).then((res) => {
            if (res.code == 200) {
              try {
                that.$store.commit("loginOut");
                that.$store.dispatch("logout");
                that.$fnc
                  .isXcx()
                  .then((ress) => {
                    if (ress == "true" || ress == true) {
                      var foot = Cookies.get("foot")
                        ? JSON.parse(Cookies.get("foot"))
                        : {
                          link: "/",
                        };
                      localStorage.setItem("login-url", foot.link);
                      wx.miniProgram.navigateTo({
                        url: `/pages/login/login`,
                      });
                    } else {
                      that.$router.replace({
                        path: "/login",
                      });
                    }
                  })
                  .catch((err) => {
                    if (err == "web") {
                      that.$router.replace({
                        path: "/login",
                      });
                    }
                  });
              } catch (error) {
                that.$router.replace({
                  path: "/login",
                });
              }
            }
          });
        });
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
  text-align: center;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo img {
  max-width: 87.5px;
  max-height: 87.5px;
  border-radius: 50%;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
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

  .sign_out_login {
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
  margin: 25px 0;

  .van-checkbox {
    justify-content: center;
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
</style>
