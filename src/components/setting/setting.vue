<template>
  <div class="container con_bg">
    <van-nav-bar :title="$h('设置')" left-text left-arrow class="navbar" @click-left="toBack" />
    <router-link to="/setting/myinfo">
      <div class="list-cell b-b m-t mar_top border_bottom" hover-class="cell-hover" :hover-stay-time="50">
        <img class="left_img" src="../../assets/img/setting/wdsy.png" mode />
        <span class="cell-tit">{{$h('我的资料')}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link>
    <a @click.prevent="bindTel">
      <div class="list-cell m-t b-b border_bottom" hover-class="cell-hover" :hover-stay-time="50">
        <img class="left_img" src="../../assets/img/setting/phone.png" mode />
        <span class="cell-tit">{{$h('绑定手机号码')}}</span>
        <span class="cell-tip">{{user.tel?user.tel:$h("未绑定")}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </a>
    <!-- <router-link to="/setting/alpaywx">
      <div class="list-cell b-b border_bottom" hover-class="cell-hover" :hover-stay-time="50">
        <img class="left_img" src="../../assets/img/setting/wx.png" mode />
        <span class="cell-tit">{{$h('关联微信')}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link> -->
    <!-- <router-link to="/setting/alpaysetting">
      <div class="list-cell b-b border_bottom" hover-class="cell-hover" :hover-stay-time="50">
        <img class="left_img" src="../../assets/img/setting/set_zfb.png" mode />
        <span class="cell-tit">{{$h('关联支付宝')}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link> -->
    <router-link to="/setting/realname" v-if="$store.state.config.plugin && $store.state.config.plugin.gasmrz.is_open==1">
      <div class="list-cell b-b border_bottom" hover-class="cell-hover" :hover-stay-time="50">
        <img class="left_img" src="../../assets/img/setting/smrz.png" mode />
        <span class="cell-tit">{{$h('实名认证')}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link>

    <router-link to="/setting/face" v-if="$store.state.config.plugin &&$store.state.config.plugin.face&& $store.state.config.plugin.face.is_open==1">
      <div class="list-cell " hover-class="cell-hover" :hover-stay-time="50">
        <img class="left_img" src="../../assets/img/setting/face.png" mode />
        <span class="cell-tit">{{$h('人脸识别')}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link>

    <router-link to="/setting/myprofit">
      <div class="list-cell m-t mar_top border_bottom">
        <img class="left_img" src="../../assets/img/setting/aq.png" mode />
        <span class="cell-tit">{{$h('账号安全')}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link>
    <!-- <router-link to="/setting/pay_password">
      <div class="list-cell m-t border_bottom">
        <img class="left_img" src="../../assets/img/setting/aq.png" mode />
        <span class="cell-tit">{{$h('交易密码')}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link> -->
    <router-link to="/setting/information">
      <div class="list-cell m-t b-b border_bottom" hover-class="cell-hover" :hover-stay-time="50">
        <img class="left_img" src="../../assets/img/setting/dz.png" mode />
        <span class="cell-tit">{{$h('功德主管理')}}</span>
        <span class="cell-tip">{{is_have_address?$h('已设置'):$h("未设置")}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link>
    <!-- <router-link to="/setting/skzh">
      <div class="list-cell b-b" hover-class="cell-hover" :hover-stay-time="50">
        <img class="left_img" src="../../assets/img/setting/zh.png" mode />
        <span class="cell-tit">{{$h('收款账号管理')}}</span>
        <span class="cell-tip">{{is_have_bank?$h('已设置'):$h("未设置")}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link> -->
    <!-- <div class="list-cell b-b mar_top "
            @click="navTo('关于我们')"
            hover-class="cell-hover"
            :hover-stay-time="50">
            <img class="left_img"
                src="../../assets/img/setting/gy.png"
                mode="">
            <span class="cell-tit">关于我们</span>
            <van-icon name="arrow"
                class="cell-more " />
    </div>-->
    <router-link :to="'/useragreement?id='+item.id" v-for="(item,i) in article" :key="i">
      <div class="list-cell m-t border_bottom" :class="{mar_top:i==0}">
        <img class="left_img" :src="require('../../assets/img/setting/'+i/1+'.png')" mode />
        <span class="cell-tit">{{$h(item.title)}}</span>
        <van-icon name="arrow" class="cell-more" />
      </div>
    </router-link>
    <!-- <div class="list-cell" :class="{mar_top:article.length==0}" @click="$router.push('/ce')"
        v-if="appusers.uid=='861' && $store.state.user.tel=='test123'">
      <img class="left_img" src="../../assets/img/setting/phone.png" mode />
      <span class="cell-tit">{{$h('当前版本')}}</span>
      <span class="cell-tip"> {{$h('当前版本')}}1.1</span>
      <van-icon name="arrow" class="cell-more" />
    </div>

    <div class="list-cell" :class="{mar_top:article.length==0}" v-else>
      <img class="left_img" src="../../assets/img/setting/phone.png" mode />
      <span class="cell-tit">{{$h('当前版本')}}</span>
      <span class="cell-tip"> 1.1{{$h('当前版本')}}</span>
      <van-icon name="arrow" class="cell-more" />
    </div> -->

    <div class="list-cell log-out-btn" @click="toLogout">
      <span class="cell-tit">{{$h('退出登录')}}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import wx from "weixin-js-sdk";
import Cookies from "js-cookie";
export default {
  name: "settings",
  data () {
    return {
      is_have_address: false,
      is_have_bank: false
    };
  },
  computed: {
    ...mapState({
      loginConfig: state => state.loginConfig,
      user: state => state.user,
    }),
    article () {
      try {
        return this.loginConfig.footer || [];
      } catch (error) {
        return [];
      }
    }
  },
  methods: {
    bindTel () {
      if (this.user.tel) {
        this.$toast(this.$h('已绑定手机号'))
      } else {
        // this.$store.commit("setShowBingPhone", true);
        this.$router.push('/bind?redirect=/setting/setting');
      }
    },
    navTo (url) {
      this.$toast(`跳转到${url}`);
    },
    //退出登录
    toLogout () {
      var that = this;
      that.$dialog
        .confirm({
          title:this.$h("提示"),
          message:this.$h("确定退出吗？")
        })
        .then(() => {
          that.$api.getUser.loginOut({}).then(res => {
            if (res.code == 200) {
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
                        url: `/pages/login/login`
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
        });
    },
    //switch
    switchChange (e) {
      let statusTip = e.detai ? "打开" : "关闭";
      this.$api.msg(`${statusTip}消息推送`);
    },
    isAddressConfig () {
      this.$api.getSetting.isAddressBank({}).then(res => {
        if (res.code == 200) {
          this.is_have_address = res.result.is_have_address;
          this.is_have_bank = res.result.is_have_bank;
          // this.setisSetting(res.result);
        }
      });
    }
  },
  created () {
    this.isAddressConfig();
  }
};
</script>

<style scoped>
.left_img {
  width: 22px;
  height: 22px;
  position: relative;
  top: 6px;
  margin-right: 10px;
}

.border_bottom {
  border-bottom: 1px solid #f4f4f4;
}
.list-cell {
  display: flex;
  align-items: baseline;
  padding: 10px 15px;
  line-height: 30px;
  position: relative;
  background: #ffffff;
  justify-content: center;
}
.log-out-btn {
  margin-top: 10px;
}
.log-out-btn .cell-tit {
  text-align: center;
  color: #f00635;
  font-size: 18px;
  font-weight: 500;
}
.cell-tit {
  color: #fa436a;
  text-align: teft;
  margin-right: 0;
}

.cell-hover {
  background: #fafafa;
}
.b-b:after {
  left: 15px;
}

.cell-more {
  align-self: baseline;
  font-size: 16px;
  color: #909399;
  margin-left: 5px;
  position: relative;
  top: 3px;
}
.cell-tit {
  flex: 1;
  font-size: 15px;
  color: #000000;
  margin-right: 5px;
}
.cell-tip {
  font-size: 14px;
  color: #909399;
}
switch {
  transform: translateX(8px) scale(0.84);
}
</style>

