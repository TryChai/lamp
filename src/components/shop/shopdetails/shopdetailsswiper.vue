<template>
  <van-swipe :autoplay="0" class="shop_swipe" @change="onChange">
    <van-swipe-item style="height:100%;background:#000" v-if="info.video" class="shop_swipe-item">
      <div>
        <video
          v-show="!isVideoShow"
          v-if="!$fnc.isYkAPP()"
          class="video_box shop_swi_img"
          :class="{play1:iconPlayShow}"
          width="100%"
          id="videoCloud"
          height="100%"
          x5-playsinline
          playsinline
          webkit-playsinline
          x-webkit-airplay="allow"
          preload="auto"
          :src="info.video"
          @click="pauseVideo"
          @ended="onPlayerEnded($event)"
          loop="loop"
        ></video>

        <!-- 播放暂停按钮 -->
        <img
          v-show="iconPlayShow"
          v-if="!$fnc.isYkAPP()"
          class="icon_play"
          @click="playvideo"
          src="../../../assets/img/play.png"
          style="width:48px;height:48px;z-index:1000"
        />
        <!-- 封面 -->
        <img
          v-show="isVideoShow"
          @click="playvideo"
          :src="info.piclink"
          v-if="!$fnc.isYkAPP()"
          class="play play1"
        />
        <video-default
          class="video_box"
          direction="vertical"
          :url="info.video"
          :video_pic="info.piclink"
          v-else
        />
      </div>
    </van-swipe-item>
    <van-swipe-item
      v-for="(item, index) in list"
      :key="index"
      style="position:relative"
      class="shop_swipe-item"
    >
      <img v-lazy="item.piclink" class="shop_swi_img" @click="getindex(index,list.length)" />
      <van-icon
        name="search"
        size="28px"
        color="#999"
        style="position:absolute;bottom:30px;right:5px;z-index:999"
        @click="big_img(index)"
      ></van-icon>
    </van-swipe-item>

    <div
      class="custom-indicator"
      slot="indicator"
    >{{ current + 1 }}/{{info.video?list.length+1:list.length}}</div>
  </van-swipe>
</template>

<script>
import videoDefault from "@/components/currency/videoDefault.vue";
import { Swipe, SwipeItem, Image, ImagePreview } from "vant";

export default {
  components: {
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Image.name]: Image,
    videoDefault
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [0];
      }
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      current: 0,
      isVideoShow: true,
      playOrPause: true,
      video: null,
      iconPlayShow: true
    };
  },
  methods: {
    big_img(index) {
      var arr = [];
      for (var i in this.list) {
        arr.push(this.$fnc.getImgUrl(this.list[i].piclink));
      }
      ImagePreview({ images: arr, startPosition: Number(index) });
    },
    playvideo(event) {
      let video = document.querySelector("video");
      this.isVideoShow = false;
      this.iconPlayShow = false;
      video.play();
      window.onresize = function() {
        // video.style.width = window.innerWidth + "px";
        // video.style.height = window.innerHeight + "px";
      };
    },
    pauseVideo() {
      //暂停\播放
      let video = document.querySelectorAll("video")[this.current];
      if (this.playOrPause) {
        video.pause();
        this.iconPlayShow = true;
      } else {
        video.play();
        this.iconPlayShow = false;
      }
      this.playOrPause = !this.playOrPause;
    },
    onPlayerEnded(player) {
      //视频结束
      this.isVideoShow = true;
      this.current += this.current;
    },
    getindex(i, index) {
      if (i == index - 1) {
        this.$emit("setXq");
      }
    },
    onChange(index) {
      // console.log(index);
      this.current = index;
    }
  }
};
</script>

<style lang="less" scoped>
.custom-indicator {
  position: absolute;
  right: 5px;
  bottom: 5px;
  padding: 2px 5px;
  color: #fff;
  font-size: 12px;
  background: rgba(0, 0, 0, 0.1);
}

.shop_swipe {
  // height: 310px;
  .shop_swipe-item {
    height: 375px !important;
    // position: relative;
  }
  .shop_swi_img {
    width: 100%;
  }
}
.video_container {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // position: relative;
  //     width: 100%;
  //     height: 100%;
}
video {
  // object-position: 0 0;
}

.icon_play {
  position: absolute;
  top: 40%;
  right: 0;
  left: 0;
  bottom: auto;
  margin: auto;
  z-index: 999;
  height: 60px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  opacity: 1;
}

.play,
.platStart {
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
}
.play {
  // height: 100% !important;
  height: auto;
  top: 50%;
  max-height: 100%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0px);
}
.video_box {
  z-index: 999;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow: hidden;
  
}
.play1 {
  opacity: 0.9;
  max-height: 10rem;
}

</style>
