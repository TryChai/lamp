<template>
  <div class='shops-swiper'>
      <van-swipe :autoplay="0" indicator-color="white">
        <van-swipe-item  v-for="(item,i) in slide" :key="i" >
            <div class="shops-swiper-item">
                <img :src='item.piclink' @click="$fnc.toLinks(item.links)" alt="">
            </div>
        </van-swipe-item>

      </van-swipe>
  </div>
</template>

<script>
export default {
  name: 'shops-swiper',
  props:{
    slide:{
      type:Array,
      default:()=>{return[]}
    }
  },
  data(){
    return {}
  },
  components: {},
  created(){},
  mounted(){},
  methods: {}
}
</script>
<style lang='less' scoped>
.shops-swiper{
        padding: 3px 0 10px;
    // background: #fff;
    position: relative;
    .shops-swiper-item{
        margin: 0px 10px;
        height: 150px;
        overflow: hidden;
        border-radius: 10px;
            // background: #fff;
        img{
            max-width: 100%;
        }

    }
}
</style>
