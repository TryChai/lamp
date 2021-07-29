<template>
  <div style="height:100%;overflow:auto">

    <div>
      <p>回调： {{contacts}}</p>
      <van-button type="info" size="large" @click="get_contacts">获取通讯录</van-button>
    </div>

    <p>持续导航</p>
    <div>
      <p>回调： {{nowval}}</p>
      <van-button type="info" size="large" @click="startAutoGPS">开始定时导航</van-button>
      <van-button type="info" size="large" @click="endAutoGPS">结束定时导航</van-button>
    </div>

    <p>音视频通话</p>
    <div>
      <p>当前用户:{{user1}}</p>
      <van-button type="info" size="large" @click="selShow1 = true">选择当前用户</van-button>
      <van-button type="info" size="large" @click="login">登录</van-button>
      <van-button type="info" size="large" @click="logout">登出</van-button>
      <br>
      <!-- <p>视频通话用户:{{user2}}</p>
      <van-button type="info" size="large" @click="selShow2 = true">选择视频通话</van-button> -->

      <p>选择用户:{{radio}}</p>
      <van-checkbox-group v-model="radio" direction="horizontal">
        <van-checkbox :name="item.val" v-for="(item,i) in userlist" :key="i"><small style="font-size:14px">{{item.name}}</small></van-checkbox>
      </van-checkbox-group>

      <van-button type="info" size="large" @click="videocall">视频通话</van-button>
      <p>视频通话回调:{{status1}}</p>
      <br>

      <van-button type="info" size="large" @click="audiocall">语音通话</van-button>
      <p>语音通话回调:{{status2}}</p>

    </div>

    <br>
    <br>
    <div>
      <van-field v-model="form.naviType" label="导航模式(1驾车2步行3骑行)" clearable placeholder />
      <van-field v-model="form.startLon" label="起点经度lon" clearable placeholder />
      <van-field v-model="form.startLai" label="起点纬度lai" clearable placeholder />
      <van-field v-model="form.endLon" label="终点经度lon" clearable placeholder />
      <van-field v-model="form.endLai" label="终点纬度lai" clearable placeholder />
      <van-field v-model="form.isNight" label="导航模式(0白天1黑夜)" clearable placeholder />
      <van-field v-model="form.url" label="蒙板页面地址" clearable placeholder />
    </div>
    <div>
      <van-button type="info" size="large" @click="startDriver">开始导航</van-button>
      <van-button type="info" size="large" @click="gotohome">返回首页</van-button>
      <van-button type="info" size="large" @click="gotoenv">测试环境</van-button>
      <van-button type="info" size="large" @click="$router.push('/ce2')">ce2</van-button>
    </div>
    <p>导航路径信息： {{backlist}}</p>
    a
    <hr>
    <p>错误信息： {{errmsg}}</p>
    <van-action-sheet v-model="selShow1" :actions="userlist" @select="onSelect1" />
    <van-action-sheet v-model="selShow2" :actions="userlist" @select="onSelect2" />

    <div style="display:none">
      <getaddress ref="getaddress" @sendAddress="recaddress" :isDetail="false" :isturnGAODE="true"></getaddress>
    </div>
  </div>
</template>
<script>

var naviPath = function (pathStr) {
  var arr = JSON.parse(pathStr);
  // window.vue.backlist = arr[0] + window.vue.backlist
  window.vue.backlist.push(arr[0])
};
var naviError = function (errorstr) {
  window.vue.errmsg = errorstr
};
var naviFinish = function () {
  alert(11)
  window.vue.$toast('退出导航');
}
var videoCallStatus = function (status) {
  window.vue.status1 = status;
  window.vue.$toast(status);
}
var audioCallStatus = function (status) {
  window.vue.status2 = status;
  window.vue.$toast(status);
}

var setUserContacts = function (str) {
  window.vue.contacts = str
};
window.naviPath = naviPath;
window.naviError = naviError;
window.naviFinish = naviFinish;
window.videoCallStatus = videoCallStatus;
window.audioCallStatus = audioCallStatus;
window.setUserContacts = setUserContacts;

import Cookies from "js-cookie";
import { Field, } from "vant";
import { ActionSheet } from 'vant'
import { Checkbox, CheckboxGroup } from 'vant';
import getaddress from "@/components/currency/getaddress"
import driver from '@/assets/js/fnc/driver.js'
export default {
  name: "component_name",
  data () {
    return {
      contacts: '',
      nowval: {},
      radio: [],
      status1: '',
      status2: '',
      user1: {},
      user2: {},
      selShow1: false,
      selShow2: false,

      userlist: [
        {
          name: '用户1',
          val: {
            id: "356",
            userName: "用户1",
            // headerUrl: window.location.origin,
            avatar: "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yingke/resource/image/default/202007/f5f99a6f5a80824bd50839c5ace14c8c.jpg"
          },
        },
        {
          name: '用户2',
          val: {
            id: "357",
            userName: "用户2",
            // headerUrl: window.location.origin,
            avatar: "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yingke/resource/image/default/202007/adeb8ac9dc167d30cc267a2be3af9db4.jpg"
          },
        },
        {
          name: '用户3',
          val: {
            id: "358",
            userName: "用户3",
            // headerUrl: window.location.origin,
            avatar: "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yingke/resource/image/default/202007/551086fd041b39b16573abb7f6c1302c.jpg"
          },
        },
        {
          name: '用户4',
          val: {
            id: "361",
            userName: "用户4",
            // headerUrl: window.location.origin,
            avatar: "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yingke/resource/image/default/202007/0cc4e71e0cfccf41738538e2ac05247d.jpg"
          },
        },

        {
          name: '用户5',
          val: {
            id: "362",
            userName: "用户5",
            // headerUrl: window.location.origin,
            avatar: "https://inexweb.oss-cn-shenzhen.aliyuncs.com/yingke/resource/image/default/202007/494d4b27ed41674df8358856a37cf157.jpg"
          },
        },


      ],
      speed: '',
      course: '',
      errmsg: '',
      backlist: [],
      form: {
        naviType: '1',
        startLai: '26.059904',
        startLon: '119.346407',
        endLai: '26.119803',
        endLon: '119.326581',
        isNight: '0',
        url: 'https://mobile.mm80.cn/driver/motor_mask',
      },
    };
  },
  components: {
    [Field.name]: Field,
    [ActionSheet.name]: ActionSheet,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    getaddress
  },
  computed: {
    nowuser () {
      return {
        id: this.$store.state.user.id,
        userName: this.$store.state.user.nickname || this.$store.state.user.username,
        headerUrl: window.location.origin,
      }
    },
    href () {
      return window.location.origin;
    },
  },
  created () {
    this.$once('hook:beforeDestroy', () => {
      if (this.$refs.getaddress) {
        this.$refs.getaddress.endContinuous();
      }
    })
  },
  mounted () {
    window.vue = this;
  },
  methods: {
    get_contacts () {
      var isnewapp;
      try {
        isnewapp = Cookies.get("newapp") || "0";
      } catch (error) {
        isnewapp = "0";
      }
      if (isnewapp == undefined) {
        isnewapp = "0";
      }
      console.log('contacts')
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        if (isnewapp == "0") {
          // eslint-disable-next-line no-undef
          try {
            // eslint-disable-next-line no-undef
            ykAPP.getUserContacts();
          } catch (error) { }
        } else {
          var data = {
            type: "getUserContacts",
          };
          this.postData(data);
        }
      }
    },
    gotohome () {
      if (this.$refs.getaddress) {
        this.$refs.getaddress.endContinuous();
        this.$router.push('/')
      }

    },
    recaddress (val) {
      console.log(val)
      this.nowval = val;
    },
    endAutoGPS () {
      this.$nextTick(() => {
        this.$refs.getaddress.endContinuous();
      })
    },
    startAutoGPS () {
      this.$nextTick(() => {
        this.$refs.getaddress.startContinuous(5);
      })
    },
    audiocall () {
      var json_str = JSON.stringify(this.radio);
      var isnewapp;
      try {
        isnewapp = Cookies.get("newapp") || "0";
      } catch (error) {
        isnewapp = "0";
      }
      if (isnewapp == undefined) {
        isnewapp = "0";
      }
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/ykapp/i) == "ykapp") {
        if (isnewapp == "0") {
          // eslint-disable-next-line no-undef
          try {
            // eslint-disable-next-line no-undef
            ykAPP.audioCall(json_str);
          } catch (error) { }
        } else {
          var data = {
            type: "audioCall",
            data: json_str,
          };
          this.postData(data);
        }
      }
    },
    videocall () {
      var json_str = JSON.stringify(this.radio);
      console.log(json_str)
      var isnewapp;
      try {
        isnewapp = Cookies.get("newapp") || "0";
      } catch (error) {
        isnewapp = "0";
      }
      if (isnewapp == undefined) {
        isnewapp = "0";
      }
      var ua = window.navigator.userAgent.toLowerCase();

      if (ua.match(/ykapp/i) == "ykapp") {
        if (isnewapp == "0") {
          // eslint-disable-next-line no-undef
          try {
            // eslint-disable-next-line no-undef
            ykAPP.videoCall(json_str);
          } catch (error) { }
        } else {
          var data = {
            type: "videoCall",
            data: json_str,
          };
          this.postData(data);
        }
      }
    },
    onSelect2 (val) {
      this.user2 = val.val;
      this.selShow2 = false;
    },
    onSelect1 (val) {
      console.log(val)
      this.user1 = val.val;
      this.selShow1 = false;
    },
    logout () {
      var isnewapp;
      try {
        isnewapp = Cookies.get("newapp") || "0";
      } catch (error) {
        isnewapp = "0";
      }
      if (isnewapp == undefined) {
        isnewapp = "0";
      }
      var ua = window.navigator.userAgent.toLowerCase();

      if (ua.match(/ykapp/i) == "ykapp") {
        if (isnewapp == "0") {
          // eslint-disable-next-line no-undef
          try {
            // eslint-disable-next-line no-undef
            ykAPP.logout();
          } catch (error) { }
        } else {
          var data = {
            type: "logout",
          };
          this.postData(data);
        }
      }
    },
    login () {
      var json_str = JSON.stringify(this.user1);
      var isnewapp;
      try {
        isnewapp = Cookies.get("newapp") || "0";
      } catch (error) {
        isnewapp = "0";
      }
      if (isnewapp == undefined) {
        isnewapp = "0";
      }
      var ua = window.navigator.userAgent.toLowerCase();
      console.log(json_str)
      if (ua.match(/ykapp/i) == "ykapp") {
        if (isnewapp == "0") {
          // eslint-disable-next-line no-undef
          try {
            // eslint-disable-next-line no-undef
            ykAPP.loginWithUser(json_str);
          } catch (error) { }
        } else {
          var data = {
            type: "loginWithUser",
            data: json_str,
          };
          this.postData(data);
        }
      }
    },
    gotoenv () {
      window.location.href = "http://192.168.50.140:82/"
    },
    startDriver () {
      var isnewapp;
      try {
        isnewapp = Cookies.get("newapp") || "0";
      } catch (error) {
        isnewapp = "0";
      }
      if (isnewapp == undefined) {
        isnewapp = "0";
      }
      var ua = window.navigator.userAgent.toLowerCase();

      if (ua.match(/ykapp/i) == "ykapp") {
        if (isnewapp == "0") {
          // eslint-disable-next-line no-undef
          try {
            // eslint-disable-next-line no-undef
            ykAPP.startGPSNavi(Number(this.form.naviType), Number(this.form.startLai), Number(this.form.startLon), Number(this.form.endLai), Number(this.form.endLon), Number(this.form.isNight), this.form.url);
          } catch (error) { }
        } else {
          var data = this.form;
          data.type = "startGPSNavi";
          this.postData(data);
        }
      }
    },
    postData (data) {
      window.webkit.messageHandlers.ykApp.postMessage({ data });
    }
  },
}
</script>
<style lang="less" scoped>
p {
  font-size: 14px;
}
</style>