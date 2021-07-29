<template>
  <div class="videoDefault">
    <img v-if="video_pic" class="play" :src="video_pic" />
    <!-- 播放暂停按钮 -->
    <img class="icon_play" src="@/assets/img/play.png" @click="playVideo" style="width:48px;height:48px" />
  </div>
</template>

<script>
export default {
  name: "videoDefault",
  props: {
    video_pic: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    },
    direction: {
      type: String,
      default: "vertical"
    },
    autoplay: {
      type: String,
      default: "1"
    },
    full: {
      type: String,
      default: "1"
    },
  },
  data () {
    return {};
  },
  components: {},
  created () { },
  mounted () { },
  methods: {
    playVideo () {
      this.$fnc.appPlayVideo(this.url, this.direction, this.autoplay, this.full)
    }
  }
};
</script>
<style lang='less' scoped>
.videoDefault {
  background: #333;
  height: 100%;
  min-height: 200px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  .icon_play {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 9;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    transform: translate3d(-50%, -50%, 0);
  }
  .play {
    width: 100%;
    max-height: 100%;
  }
}
</style>
