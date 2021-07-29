<template>
  <div>
    <div class="hid_mar">
      <div class="form_item_my" @click="showGj=true" v-if="isgj=='1'">
        <img src="../../assets/img/gj.png" mode class="input_icon">
        <div class="f_l input_icon gj_left" style="width: 60%;">{{gj}}</div>
      </div>
      <div class="form_item_my">
        <img src="../../assets/img/phone.png" mode class="input_icon">
        <van-field  @blur="windowScorll"
          v-model="username"
          :border="false"
          type="text"
          class="uni-input u_inputs fx_2"
          placeholder="请输入手机号码"
          clearable
        />
        <div
          v-if="num=='60'" class="cu-btn bg-green shadow f_r icon_f_r" @click="sendcode"
        >{{text}}</div>
        <div  v-else  class="cu-btn bg-green shadow f_r icon_f_r"  style="background:#ddd !important;">{{text}}</div>
      </div>
      <div class="form_item_my" >
        <img src="../../assets/img/yzm.png" mode class="input_icon">
        <van-field  @blur="windowScorll"
          v-model="code"
          :border="false"
          type="text"
          maxlength='4'
          class="uni-input u_inputs fx_2"
          placeholder="请输入手机收到的验证码"
          clearable
        />
      </div>
      <div class="form_item_my">
        <img src="../../assets/img/lock.png" mode class="input_icon">
        <van-field  @blur="windowScorll" v-model="password" :type="is_show?'password':'text'" :right-icon="is_show?'eye':'closed-eye'" @click-right-icon="is_show=!is_show" placeholder="输入6-15位数字+字母密" clearable/>
      </div>

      <div class="uni-btn-v form_sub">
        <div @click="toYz">提交</div>
      </div>
    </div>
    <van-popup v-model="show">
      <div class="con_hd">
        <div class="fx hd">
          <div class="tc fx_3 hd_title">按住滑块往右</div>
          <div>
            <van-icon name="cross" color="red" @click="show=false" size="14"/>
          </div>
        </div>
        <div>
          <hd @is_yz="getYz" v-if="show"/>
        </div>
        
      </div>
    </van-popup>
     <van-popup v-model="showGj" position="right">
          <index-list @clickData="clickData" />
        </van-popup>
  </div>
</template>
<script>
import hd from "@/components/currency/hd.vue";
import IndexList from "@/components/currency/IndexList.vue";
import { Field } from "vant";
export default {
  components: {
    hd,
    [Field.name]: Field,
    IndexList
  },
  computed: {
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
  data() {
    return {
      username: "",
      password: "",
      twopassward: "",
      rex: /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
      pas: /^[a-zA-Z0-9]{6,15}$/,
      num: 60,
      text: "发送验证码",
      wyz: "",
      code: "",
      modalName: "",
      is_show: true,
      gj: this.str,
      share: "",
      show: false,
      showGj:false
    };
  },
  methods: {
    toYz() {
      if (this.password == "" || !this.$fnc.regexp(this.pas, this.password)) {
        this.$toast.fail("密码输入不合法");
      } else {
        this.show = true;
      }
    },
    clickData(item){
        this.gj=item.label+"(+"+item.code+")";
        this.quhao=item.code;
        this.showGj=false;
      },
    getYz(bool) {
      if (bool) {
        this.toReg();
        this.show = false;
      }
    },
    sendcode() {
      var value = this.username;
      if (value == "") {
        this.$toast.fail("手机号码不能为空");
        return false;
      }
      this.$api.getUser.is_have_user({ username: value }).then(res => {
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

      this.$api.getUser.sendCode({ tel: this.username,quhao:this.quhao }).then(res => {
        if (res.status === 1) {
          this.$toast.success("发送成功");
          this.wyz = res.result;
          var temar = setInterval(function() {
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
    toReg() {
         this.show=false;
      const { username, password } = this;
      if (username == "") {
        this.$toast.fail("用户名不能为空");
        return false;
      } else if (password == "") {
        this.$toast.fail("密码不能为空");
        return false;
      } else {
        const sendData = {
          code: this.code,
          unicode: this.wyz,
          username: username,
          password: this.$getCode(password),
          quhao: this.gj.replace(/[^0-9]/gi, "")
        };
        this.$api.getUser.changePssword(sendData).then(res => {
          if (res.code == 200) {
            this.$toast.success("修改成功");
            this.username='';
            this.password='';
            this.code='';
            this.$emit("suss")
          }
        });
      }
    }
  },
  watch: {
  }
};
</script>


<style scoped>
.form_sub > div {
  background: #2d2f3b;
  text-align: center;
  color: #fff;
  font-weight: bold;
  margin: 0;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  border-radius: 5px;
}
.hid_mar {
  display: block;
  height: 100%;
  overflow: hidden;
}
.form_items {
  position: relative;
  width: 300px;
  height: 50px;
  display: block;
  border-bottom: 1PX solid #ddd;
  margin: 0 auto;
  box-sizing: border-box;
  margin-top: 14px;
}
.form_sub {
  box-sizing: border-box;
  width: 300px;
  margin: 0 auto;
  display: block;
  margin-top:32.5pxpx;
}
.form_sub > div {
  background: #2d2f3b;
  color: #fff;
  font-weight: bold;
  margin: 0;
  height: 50px;
  line-height: 50px;
}
.icon_input {
  position: absolute;
  top: 20px;
  z-index: 2;
  left: 5px;
  color: #7f7f7f;
}
</style>
