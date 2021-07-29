<template>
  <div class="module_part_body" :style="{backgroundColor:background}">
    <moduleTitle :info="info" background="#fff">

      <div slot="righttitle" class="righttitlte" v-if="nowtype && nowtype!=3 ">
        {{nowtype == 1 ?'距离开始：':'距离结束：'}}
        <p>
          <span></span>
          <van-count-down :time="counttime * 1000" style="color:#70b92c" />
        </p>
      </div>
    </moduleTitle>
    <div class="module_part_content">
      <van-swipe :autoplay="5000" class="modulecarousel" :show-indicators='false'>
        <van-swipe-item v-for="(item, index) in info.banner" :key="index">
          <div class="spike_item">
            <div class="spike_item_left">
              <img :src="$fnc.getImgUrl(item.piclink)" alt="" />
            </div>
            <div class="spike_item_right">
              <p>{{ item.title }}</p>
              <p>{{ item.sub_title || "" }}</p>
              <div>
                <p>
                  <span class="price_regular">
                    <small>￥</small>
                    <b>{{$fnc.get_int_dec(Number(item.price),'int')}}</b>
                    <i>{{$fnc.get_int_dec(Number(item.price),'dec')}}</i>
                  </span>
                </p>
                <span @click=" $router.push( '/shop/shopdetails?id=' + item.id )">去抢购</span>
              </div>
            </div>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<script>
import { CountDown } from 'vant';
import moduleTitle from '@/components/page/vip/moduleTitle'
import { Swipe, SwipeItem } from "vant";
export default {
  name: "",
  computed: {
    nowtype () {
      //   distance_types 1未开始 2进行中 3结束中
      if (this.info.banner[0].activity.distance_types) {
        return this.info.banner[0].activity.distance_types
      } else {
        return 0
      }
    },
    counttime () {
      if (this.info.banner[0]) {
        if (this.info.banner[0].activity.distance_types == 1) {
          return this.info.banner[0].activity.distance_open_time || 0;
        } else if (this.info.banner[0].activity.distance_types == 2) {
          return this.info.banner[0].activity.distance_end_time || 0;
        } else {
          return 0;
        }
      } else {
        return 0
      }
    },
  },
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          banner: [],
        };
      }
    },
    background: {
      type: String,
      default: "transparent"
    }
  },
  data () {
    return {

      bannerHeight: "",
    };
  },
  components: {
    moduleTitle,
    [CountDown.name]: CountDown,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,

  },
  created () { },
  mounted () { },
  methods: {

    href_inspect (val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);

    }
  }
};
</script>
<style lang='less' scoped>
.righttitlte {
  //   width: 50% !important;
  font-size: 14px;
  font-weight: bold;
  color: #313131;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  > .van-count-down {
    font-size: 20px;
    font-weight: bold;
  }
}
.spike_item {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // margin-bottom: 15px;
  .spike_item_left {
    width: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    img {
      width: 100%;
    }
  }
  .spike_item_right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;
    > p {
      width: 100%;
      color: #000000;
      font-size: 16px;
      font-weight: bold;
      overflow: hidden;
      //隐藏部分显示为省略号
      text-overflow: ellipsis;
      //禁止文本自动换行
      white-space: nowrap;
      line-height: 1.5;
    }
    > p:nth-of-type(2) {
      font-size: 12px;
      color: #696969;
      margin-bottom: auto;
    }
    > div {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      > p {
        color: #e53a40;
        line-height: 1;
        b {
          font-weight: bold;
        }
      }
      > span {
        font-size: 14px;
        color: #ffffff;
        background-color: #6fb92e;
        border-radius: 15px;
        padding: 8px 20px;
        line-height: 1;
        background: -webkit-linear-gradient(to left, #ff3a63, #ff7d5e);
        background: -o-linear-gradient(to left, #ff3a63, #ff7d5e);
        background: -moz-linear-gradient(to left, #ff3a63, #ff7d5e);
        background: linear-gradient(to left, #ff3a63, #ff7d5e);
      }
    }
  }
}
.price_regular {
  > small {
    font-size: 10px;
    font-weight: bold;
  }
  > b {
    font-size: 16px;
  }
  > i {
    font-size: 10px;
    font-weight: normal;
    font-style: normal;
  }
  > span {
    font-weight: normal;
  }
}
</style>
