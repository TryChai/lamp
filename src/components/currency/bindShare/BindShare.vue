<template>
  <div>
    <van-dialog v-model="show" title="绑定推荐码" show-cancel-button @confirm="bindShare" @cancel='closeShare'>
      <div class="exit" @click="exitbtn">
        退出
      </div>
      <van-cell-group :border="false" class="zy-cl">
        <van-field @blur="windowScorll" v-model="tshare" placeholder="请输入推荐码" />
      </van-cell-group>
    </van-dialog>
  </div>
</template>


<script>
import { Field } from "vant";
import { setTimeout } from 'timers';

import wx from "weixin-js-sdk";
import Cookies from "js-cookie";
export default {
  components: {
    [Field.name]: Field
  },
  data () {
    return {
      show: this.$store.state.isTsShare || false,
      tshare: ""
    }
  },
  methods: {
    exitbtn () {
      var that = this;
      that.$api.getUser.loginOut({}).then(res => {
        if (res.code == 200) {
          this.$store.commit('setTsShare', false)
          try {
            that.$store.commit("loginOut");
            that.$store.dispatch("logout");
            that.$fnc
              .isXcx()
              .then(ress => {
                if (ress == "true" || ress == true) {
                  var foot = Cookies.get("foot")
                    ? JSON.parse(Cookies.get("foot"))
                    : { link: "/" };
                  localStorage.setItem("login-url", foot.link);
                  localStorage.removeItem("applets_uid");
                  localStorage.removeItem("applets_user_key");
                  wx.miniProgram.navigateTo({
                    url: `/pages/login/login`,
                  });
                } else {
                  that.$router.replace({ path: "/login" });
                }
              })
              .catch(err => {
                if (err == "web") {
                  that.$router.replace({ path: "/login" });
                }
              });
          } catch (error) {
            that.$router.replace({ path: "/login" });
          }
        }
      });
    },
    bindShare () {
      this.$api.getUser.bindShaer({ tshare: this.tshare }).then(res => {
        if (res.code == 200) {
          this.$store.dispatch("getUser");
          this.$store.commit('setTsShare', false)
        } else if (res.result != '已绑定推荐人') {
          setTimeout(() => {
            this.show = true;
          }, 1500)
        }
      })
    },
    closeShare () {
      this.$dialog.confirm({
        message: "是否退出绑定，退出绑定将跳转到首页？"
      }).then(() => {
        this.$store.commit('setTsShare', false)
        this.$router.push('/')
      }).catch(() => {
        this.show = true;
      })
    }
  }
}
</script>
<style lang="less" scope>
.exit {
  font-size: 14px;
  color: #333;
  position: absolute;
  right: 12px;
  top: 20px;
}
</style>
