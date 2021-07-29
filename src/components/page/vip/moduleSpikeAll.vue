<template>
  <div class="module_part_body" :style="{ backgroundColor: background }">
    <moduleTitle :info="info"> </moduleTitle>
    <div class="fx spike_all_top" v-if="info.banner && info.banner.length > 0">
      <van-tabs
        type="card"
        id="van-tabs-spike-all"
        background="transparent"
        title-active-color="#f2402b"
        title-inactive-color="#222222"
      >
        <van-tab v-for="(item, i) in info.banner" :key="i">
          <div
            slot="title"
            class="fx spike_title"
            :class="active == item.id ? 'active' : 'no-active'"
            @click="active = item.id"
          >
            <p>{{ $fnc.getTimeHour(item.begin_time) }}</p>
            <p>{{ item.types_cn }}</p>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="spike_all_content" v-if="productList && productList.length > 0">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div v-for="(item, index) in productList" :key="index">
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
                    <b>{{ $fnc.get_int_dec(Number(item.price), "int") }}</b>
                    <i>{{ $fnc.get_int_dec(Number(item.price), "dec") }}</i>
                  </span>
                </p>
                <span @click="$router.push('/shop/shopdetails?id=' + item.id)">
                  去抢购
                </span>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { CountDown } from "vant";
import moduleTitle from "@/components/page/vip/moduleTitle";
import { Swipe, SwipeItem } from "vant";
export default {
  name: "",
  computed: {},
  props: {
    info: {
      type: Object,
      default: () => {
        return {
          banner: [],
        };
      },
    },
    background: {
      type: String,
      default: "transparent",
    },
  },
  data() {
    return {
      active: "",
      productList: [],
      loading: false,
      finished: false,
    };
  },
  components: {
    moduleTitle,
    [CountDown.name]: CountDown,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
  },
  created() {
    if (this.info.banner && this.info.banner.length > 0) {
      this.active = this.info.banner[0].id;
    }
  },
  mounted() {},
  methods: {
    onLoad() {
      var params = {};
      params.page_size = 100;
      params.id = this.active;
      this.$api.getShop.get_limitshop_new(params).then((res) => {
        if (res.code == 200) {
          this.productList = res.result;
          this.finished = true;
          this.loading = false;
        }
      });
    },
    href_inspect(val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);
    },
  },
  watch: {
    active() {
      this.loading = true;
      this.finished = false;
      this.productList = [];
      this.onLoad();
    },
  },
};
</script>
<style lang='less' scoped>
.spike_all_top {
  width: 100%;
  padding: 0 0 10px;
  font-size: 14px;
  .frist {
    // width: 65px;
    font-size: 18px;
    font-weight: bold;
    font-style: italic;
    line-height: 1;
    text-align: center;
  }
  .spike_title {
    flex-direction: column;
    justify-content: flex-start;
    line-height: 1;
  }
  .active {
    text-align: center;
    > p:nth-of-type(1) {
      font-weight: bold;
      font-size: 18px;
      color: #f2402b;
    }
    > p:nth-of-type(2) {
      min-width: 60px;
      font-size: 12px;
      border-radius: 20px;
      color: #ffffff;
      padding: 3px 6px;
      background: linear-gradient(to right, #fe144b, #fe4207);
      margin-top: 2px;
    }
  }
  .no-active {
    text-align: center;
    > p:nth-of-type(1) {
      font-weight: bold;
      font-size: 18px;
      color: #222222;
    }
    > p:nth-of-type(2) {
      min-width: 60px;
      font-size: 12px;
      color: #999999;
      padding: 3px 6px;
      margin-top: 2px;
    }
  }
}
.spike_all_content {
  width: 100%;
  background: transparent;
  padding: 0 16px;
}
.spike_item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 15px;
  background: #ffffff;
  border-radius: 10px;
  padding: 10px;
  .spike_item_left {
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 15px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .spike_item_right {
    flex: 1;
    height: 100px;
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
      text-overflow: ellipsis;
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
        border-radius: 15px;
        padding: 8px 20px;
        line-height: 1;
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
