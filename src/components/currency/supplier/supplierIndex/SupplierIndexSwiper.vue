<template>
  <div>
    <div class="commodity">
      <div class="container">
        <swiper class="swiImgs" :options="swiperOption" v-if="slide.length!=0">
          <swiper-slide
            v-for="(item,i) in slide"
            :key="i"
            data-index="index"
           
            class="item"
          > 
          <a :href="item.links">
            <img class="swiImg" :src="item.piclink" v-lazy='item.piclink' />
            </a>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>


<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
export default {
  components: {
    swiper,
    swiperSlide
  },
  props:{
    slide:{
      type:Array,
      default:()=>{return[]}
    }
  },
  data() {
    return {
      commodity: [],

      imgIndex: 1,

      swiperOption: {
        //是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true

        notNextTick: true,

        //循环

        loop: true,

        //设定初始化时slide的索引

        initialSlide: 0,

        //自动播放

        autoplay: {
          delay: 1500,

          stopOnLastSlide: false,

          disableOnInteraction: false
        },

        //滑动速度

        speed: 800,

        //滑动方向

        direction: "horizontal",

        //小手掌抓取滑动

        grabCursor: true,

        //滑动之后回调函数

        on: {
          slideChangeTransitionStart: function() {
            // that.imgIndex = this.realIndex + 1; //获取轮播图片下标索引；这里有一个坑，之前网上找到的是用activeIndex，但后来网上说的是这个realIndex，原来activeIndex是swiper2.0的；而realIndex是swiper3.0的，（使用realIndex才实现了下标索引）
          }
        },

        //分页器设置

        pagination: {
          el: ".swiper-pagination",

          clickable: true,

          type: "bullets"
        }
      }
    };
  },
  created() {
    this.swiperOption.autoplay =
      this.slide.length != 1
        ? {
            //控制只有一张图片的时候不自动轮播

            delay: 1500,

            stopOnLastSlide: false,

            disableOnInteraction: false
          }
        : false;
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  }
};
</script>


<style lang="less" scoped>
.commodity {
    margin:0 10px;
    border-radius: 10px;
    overflow: hidden;
  .container {
    position: relative;
    .swiImgs {
      width: 100%;
      .item {
         border-radius: 10px;
    overflow: hidden;
        .swiImg {
          width: 100%;
        }
      }
    }
  }
}
</style>
