<template>
  <div class="con_bg">
    <van-nav-bar
      :title="$h(is_szzfmm ? '设置交易密码' : '修改交易密码')"
      left-text
      left-arrow
      class="navbar"
      @click-left="toBackUrl"
    />
    <form>
      <div class="cu-form-group margin-top">
        {{ $h("") }}
        <div class="title">{{ $h("交易密码") }}</div>
        <van-cell-group class :border="false">
          <van-field
            @blur="windowScorll"
            v-model="newpassword"
            type="password"
            :placeholder="$h('请输入交易密码')"
            clearable
          />
        </van-cell-group>
      </div>
      <div class="cu-form-group">
        <div class="title">{{ $h("确认密码") }}</div>
        <van-cell-group class="fx_2" :border="false">
          <van-field
            @blur="windowScorll"
            v-model="password"
            type="password"
            :placeholder="$h('确认新交易密码')"
            clearable
          />
        </van-cell-group>
      </div>
      <div
        v-if="$store.state.config.sms && $store.state.config.sms.zfmmdxyz == 1"
      >
        <div class="cu-form-group">
          <div class="title">{{ $h("手机号") }}</div>

          <van-cell-group class="fx_2" :border="false">
            <van-field
              @blur="windowScorll"
              v-model="tel"
              type="text"
              :disabled="tel ? true : false"
              :placeholder="$h('点击获取验证码')"
              clearable
            />
          </van-cell-group>

          <div
            v-if="num == '60'"
            class="cu-btn bg-green shadow f_r icon_f_r"
            @click="sendcode"
          >
            {{ text }}
          </div>
          <div
            v-else-if="num != '60'"
            class="cu-btn bg-green shadow f_r icon_f_r"
            style="background: #ddd !important"
          >
            {{ text }}
          </div>
        </div>
        <div class="cu-form-group">
          <div class="title">{{ $h("验证码") }}</div>
          <van-cell-group class="fx_2" :border="false">
            <van-field
              @blur="windowScorll"
              v-model="code"
              type="number"
              maxlength="4"
              :placeholder="$h('请输入验证码')"
              clearable
            />
          </van-cell-group>
        </div>
      </div>
      <div v-else>
        <div class="cu-form-group" v-if="!is_szzfmm">
          <div class="title">原交易密码</div>
          <van-cell-group class="fx_2" :border="false">
            <van-field
              @blur="windowScorll"
              v-model="oldpassword"
              type="password"
              :placeholder="$h('请输入原交易密码')"
              clearable
            />
          </van-cell-group>
        </div>
      </div>

      <div class="cu-form-group tishi">
        <div class="title">
          {{ $h("密码至少六个字符，且同时包含字母和数字") }}
        </div>
      </div>
      <div class="padding">
        <div
          class="cu-btn bg-gradual-orange block but margin-tb-sm lg"
          @click="subInfo"
          :style="$store.state.config.shop.button_bj_color?{background:$store.state.config.shop.button_bj_color}:{}"
        >
          {{ $h("确定") }}
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { Field } from "vant";
export default {
  name: "myprofit",
  components: {
    [Field.name]: Field,
  },
  data() {
    return {
      index: -1,
      imgList: [],
      tel: "" || this.$store.state.user.tel,
      rex: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
      pas: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/,
      wyz: "",
      password: "",
      newpassword: "",
      code: "",
      loadModal: false,
      text: this.$h("发送验证码"),
      modalName: "",
      num: 60,
      quhao: this.$store.state.user.quhao,
      isguolei: "0",
      config: {
        sms: {
          zfmmdxyz: "1",
        },
      },
      oldpassword: "",
      is_szzfmm: false,
    };
  },
  created() {},
  methods: {
    toBackUrl() {
      if (this.$route.query.redirect) {
        var str = this.$route.query.redirect;
        this.$router.push(str);
      } else {
        this.toBack();
      }
    },
    sendcode() {
      var _this = this;
      this.$api.getUser
        .sendCode({ tel: this.tel, quhao: this.quhao })
        .then((res) => {
          if (res.code === 200) {
            this.$toast.success("发送成功");
            this.wyz = res.result;
            var temar = setInterval(function () {
              if (_this.num <= 0) {
                clearInterval(temar);
                _this.text = "发送验证码";
                _this.num = 60;
              } else {
                _this.num--;
                _this.text = "（" + _this.num + "）秒";
              }
            }, 1000);
          }
        });
    },
    subInfo() {
      if (this.password == "") {
        this.$toast.fail("密码不能为空");
        return false;
      } else if (!this.$fnc.regexp(this.pas, this.password)) {
        this.$toast.fail("密码非法,请重新输入");
        return false;
      } else if (this.newpassword != this.password) {
        this.$toast.fail("两次输入的不一致,请重新输入");
        return false;
      }
      var params = {};
      params.pay_password = this.$getCode(this.password);
      params.code = this.code;
      params.unicode = this.wyz;
      params.tel = this.tel;
      params.quhao = this.quhao;
      params.old_password = this.$getCode(this.oldpassword);
      this.$api.getSetting.changePayPassword(params).then((res) => {
        if (res.code == 200) {
          this.$toast.success("操作成功");
          setTimeout(() => {
            this.$store.dispatch("getUser");
            if (this.$route.query.redirect) {
              var str = this.$route.query.redirect;
              this.$router.push(str);
            } else {
              this.toBack();
            }
          }, 3000);
        }
      });
    },
    get_account_state() {
      this.$api.getUser.get_account_state({}).then((res) => {
        if (res.code == 200) {
          this.is_szzfmm = res.result.is_szzfmm;
        }
      });
    },
  },
  mounted() {
    this.get_account_state();
  },
};
</script>

<style scoped>
.title {
  color: #000000;
  min-width: 80px;
}

.bg-sub {
  background: #d1d1d1;
  border-radius: 0;
  color: #fff;
}
</style>
