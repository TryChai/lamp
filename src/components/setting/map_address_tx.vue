<template>
  <div class="map_address">
    <van-nav-bar :title="navtitle" left-text left-arrow class="navbar" @click-left="close" />

    <div class="map_body" v-if="isxcx == false" style="width:100%;flex:1;">
      <iframe id="mapPage" width="100%" height="100%" frameborder=0
          :src="`${src}${spe_location.lat != 0 && spe_location.lng != 0 ? '&coord=' +spe_location.lat + ',' + spe_location.lng  : ''}`">
      </iframe>
    </div>

  </div>
</template>


<script>
import wx from "weixin-js-sdk";
export default {
  data () {
    return {
      isxcx: true,
      src: "https://apis.map.qq.com/tools/locpicker?search=1&policy=1&type=1&key=QUEBZ-7FO3W-EBQRR-RRCFM-6DUC3-ZYBHX&referer=myapp",
      AK: 'QUEBZ-7FO3W-EBQRR-RRCFM-6DUC3-ZYBHX',
      search: '',
    };
  },

  props: {
    navtitle: {
      type: String,
      default: '确认收货地址'
    },
    //小程序回调前需要存储的值
    form: {
      type: Object,
      default: () => ({

      })
    },
    spe_location: {
      type: Object,
      default: () => ({

      })
    },
  },
  components: {

  },
  created () {
    this.isxcx = navigator.userAgent.indexOf("miniProgram") !== -1 ? true : false;
    if (this.isxcx == true) {
      var url = `/pages/selection/selection?latitude=${this.spe_location.lat}&longitude=${this.spe_location.lng}&url=${this.$route.path}`
      localStorage.setItem('map_address_form', JSON.stringify(this.form));          //存储到浏览器中
      wx.miniProgram.navigateTo({
        url: url,
      });
    }
  },
  mounted () {
    var that = this;
    window.addEventListener('message', function (event) {
      // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
      var loc = event.data;
      if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        that.$emit('sendPosition', loc)
      }
    }, false);
  },
  methods: {
    close () {
      this.$emit('closemap')
    },

  }
};
</script>

<style lang='less' >
.map_address {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  justify-content: flex-start;
}
</style>
