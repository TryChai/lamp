<template>
  <div class="line bgwrite">
    <div class="z-y-l-user">
      <a @click.prevent="toWzyInfo" class="fx">
        <div class="fx">
          <img :src="item.avatar" v-lazy="item.avatar" width="40px" alt />
          <div>
            <p class="van-ellipsis">{{item.nickname || '----'}}</p>
            <p class="fx">
              <span style="width:60%">
                浏览时长：
                <van-count-down
                  style="display:inline"
                  :time="parseInt(item.view_time_num*1000)"
                  format="mm,ss"
                  :auto-start="false"
                />
              </span>
              <span>浏览次数：{{item.hit_num}}</span>
            </p>
          </div>
        </div>

        <van-icon name="arrow" color="#d8d8d8" />
      </a>
    </div>
    <div class="lin-bo" v-if="isLine"></div>
  </div>
</template>

<script>
import { CountDown } from "vant";
export default {
  props: {
    isLine: {
      type: Boolean,
      default: true
    },
    item: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    [CountDown.name]: CountDown
  },
  methods: {
    toWzyInfo() {
      var str =
        "/zhanye/zhanyeinfo?id=" +
        this.item.uid +
        "&time=" +
        this.item.view_time_num +
        "&hit=" +
        this.item.hit_num +
        "&pid=" +
        this.$route.query.id;
      if (this.$route.query.types1 == "news") {
        str += "&types=news";
      }
      this.$router.push(str);
    }
  }
};
</script>



<style lang="less" scoped>
.line {
  border-radius: 0.13333rem;
  > .lin-bo {
    margin: 0 10px 0 52px;
    border-top: 1px solid #f9f9f9;
  }
}
.z-y-l-user {
  height: 80px;
  padding: 0 10px 0 14px;
  font-weight: normal;
  a {
    height: 100%;
  }
  div.fx {
    height: 100%;
    justify-content: flex-start;
    width: 85%;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      display: block;
    }
    > div {
      color: #9f9f9f;
      width: 80%;
      margin-left: 12px;
      p {
        font-size: 13px;
        width: 100%;
      }
      > p:first-child {
        font-size: 15px;
        color: #292929;
        margin-bottom: 10px;
        line-height: 1.2;
      }
    }
  }
}
</style>
