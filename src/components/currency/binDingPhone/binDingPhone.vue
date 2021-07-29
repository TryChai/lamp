<template>
  <div>
    <van-popup v-model="show" :close-on-click-overlay="false" class="click-me-con animated bounceInDown">
      <div class="bindin-con">
        <div class="bindin-head fx">
          <p class="fx_3">绑定手机号码</p>
          <van-icon name="cross" color="#adb4be" size="15px" class @click="closeBinPhone('tel')" />
        </div>
        <div class="form_item_my" @click="showGj=true" v-if="$store.state.config.plugin.gjdx.is_open=='1'">
          <img src="./../../../assets/img/gj.png" mode class="input_icon" />
          <div class="f_l input_icon gj_left" style="width: 60%;">{{gj}}</div>
        </div>

        <div class="bindin-input">
          <van-field @blur="windowScorll" v-model="tel" type="tel" size="27px" max-length="13" placeholder="请输入手机号" />
        </div>
        <div class="bindin-btn">
          <van-button type="danger" :disabled="tel==''" @click="toCode" max="13" size="large">{{isBdsjhdx?'下一步':'提交'}}</van-button>
        </div>
        <div class="bindin-text">
          <p>
            为了给您提供更优质的服务，绑定则代表您同意
            <a @click="showAgren" to="/useragreement">《{{$store.state.appTitle}}用户协议》</a>
          </p>
        </div>
      </div>
    </van-popup>

    <van-popup v-model="showCode" :close-on-click-overlay="false">
      <div class="bindin-con">
        <div class="bindin-head fx">
          <van-icon name="arrow-left" color="#adb4be" size="15px" @click="toLeft" />
          <p class="fx_3">输入验证码</p>
          <van-icon name="cross" color="#adb4be" size="15px" @click="closeBinPhone" />
        </div>
        <div class="bindin-tel">
          <p>验证码已发送至{{tel}}</p>
          <p class="bindin-tel-p2" v-if="num<60">{{num}}s后重发</p>
          <van-button v-else @click="sendduan" plain hairline size="small" type="danger">再次发送</van-button>
        </div>
        <div class="bindin-password">
          <van-field @blur="windowScorll" type="number" maxlength="4" v-model="code" placeholder="请输入验证码" />
          <van-button type="danger" @click="bindPhone" :disabled="code && code != '' && code.length >= 4 ? false:true" style="margin-top:16px"
              size="large">确定</van-button>
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
import { mapState } from "vuex";
import IndexList from "@/components/currency/IndexList.vue";
export default {
  name: "binDingPhone",
  data () {
    return {
      quhao: "",
      showGj: false,
      gj: '中国(+86)',
      show: this.$store.state.showBingPhone || false,
      showCode: false,
      tel: "",
      code: "",
      showKeyboard: true,
      num: 60,
      unicode: ""
    };
  },
  computed: {
    ...mapState({
      plugin: state => state.config.sms,
    }),
    isBdsjhdx () {
      if (this.sms && this.sms.bdsjhdx == undefined) {
        return false;
      } if (this.sms && this.sms.bdsjhdx == '0') {
        return false;
      } else {
        return true;
      }
    }
  },
  components: {
    [Field.name]: Field,
    IndexList
  },
  created () {
    this.getPhone();
  },
  methods: {
    clickData (item) {
      this.gj = item.label + "(+" + item.code + ")";
      this.quhao = item.code;
      this.showGj = false;
    },
    showAgren () {
      this.show = false;
      this.$store.commit("setShowBingPhone", false);
      this.$router.push("/useragreement");
    },
    closeBinPhone () {
      this.$dialog
        .confirm({
          message: "是否退出绑定，退出绑定将跳转到首页"
        })
        .then(() => {
          this.$store.commit("setShowBingPhone", false);
          this.$router.push("/index");
        })
        .catch(() => { });
    },
    toLeft () {
      this.showCode = false;
      this.show = true;
    },
    getPhone (val) {
      val = val || this.$store.state.showBingPhone;
      this.show = val;
    },
    toCode () {
      if (this.isBdsjhdx) {
        this.sendduan();
      } else {
        this.bindPhone();
      }

    },
    sendduan () {
      var _this = this;
      var apiStr = "bindPhoneCode";
      this.$api.getUser[apiStr]({
        tel: this.tel,
        quhao: this.gj.replace(/[^0-9]/gi, "") || 86
      }).then(res => {
        if (res.status === 1) {
          this.$toast.success("发送成功");
          this.show = false;
          this.showCode = true;
          this.unicode = res.result;
          var temar = setInterval(function () {
            if (_this.num <= 0) {
              clearInterval(temar);
              _this.num = 60;
            } else {
              _this.num--;
            }
          }, 1000);
        } else if (res.code == 404) {
          this.show = true;
        }
      });
    },
    bindPhone () {
      if (this.code == '') {
        this.$toast.fail('请输入验证码')
        return false
      }
      var params = {};
      params.tel = this.tel;
      params.code = this.code;
      params.unicode = this.unicode;

      var apiStr = "bindPhone";

      this.$api.getUser[apiStr](params).then(res => {
        if (res.code == 200) {

          this.$toast.success("绑定成功");
          this.showCode = false;
          this.show = false;

          if (res.result == true) {
            this.$store.dispatch("getUser");
          } else {
            this.$store.commit("setUser", res.result);
            this.$store.dispatch("getUser");
          }
          this.$store.commit("setShowBingPhone", false);
          if (
            this.$store.state.user.tid == 0 &&
            this.$store.state.config.shop.reg_permission == "1"
          ) {
            this.$store.commit("setTsShare", true);
          }
        } else {
          this.$toast.fail(res.result)
          this.show = true;
          this.showCode = false;
          this.tel = "";
          this.code = "";
        }
      });
    }
  }
};
</script>


<style lang="less" scoped>
.binKey {
  position: relative !important;
}
.bounceInDown {
  top: 25%;
  left: 13%;
}
.showHeight {
  height: 70%;
}
.bindin-con {
  background: #fff;
  padding: 0 15px 15px;
  font-size: 14px;
  line-height: 1;
  width: 280px;
  .bindin-head {
    height: 50px;
    line-height: 50px;
    color: #252830;
    text-align: center;
    font-weight: 500;
    font-size: 18px;
    > i {
      text-align: right;
    }
  }
  .bindin-input {
    border: 1px solid #f3f3f5;
    border-radius: 5px;
    margin: 16px 0 14px;
    height: 46px;
    line-height: 46px;
    display: flex;
    justify-content: center;
    align-items: center;
    > .van-cell {
      padding: 3px 16px;
      > .van-field__body {
        input.van-field__control {
          color: red;
        }
      }
    }
  }
  > .bindin-btn {
    > button {
      height: 46px;
      line-height: 46px;
      border-radius: 5px;
    }
  }
  > .bindin-text {
    margin: 17px 0 15px;
    font-size: 13px;
    > p {
      color: #727b8a;
      margin-bottom: 5px;
      line-height: 1.4;
      > a {
        color: #bd8e60;
      }
    }
    > a {
      color: #bd8e60;
    }
  }
  > .bindin-tel {
    > p {
      height: 30px;
      line-height: 30px;
      font-size: 18px;
    }
    > .bindin-tel-p2 {
      color: #b2b8c3;
      font-size: 15px;
    }
  }
  > .bindin-password {
    margin-top: 27px;
    padding-bottom: 27px;
  }
}
.bindin-con .van-password-input__security > li {
  border: 1px solid #e8eaed;
}
.bindin-con .van-password-input {
  margin: 0;
}
</style>
