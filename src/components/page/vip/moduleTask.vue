<template>
  <div class="module_part_body" :style="{backgroundColor:background}">
    <div class="task_box">
      <div class="task_report" v-if="express && express.length > 0">
        <div class="task_report_item">
          <div class="task_left">
            <img src="./../../../assets/img/plugin/task/task_title.png" alt="">
          </div>
          <van-swipe style="flex: 1;height: 32px;" vertical :show-indicators="false" loop :autoplay="3000">
            <van-swipe-item v-for="(item, index) in express" :key="index">
              <p>
                <!-- <img :src="$fnc.getImgUrl(item.avatar)" alt=""> -->
                {{item.nickname || item.username}}完成任务，获得奖励
                <span>{{$fnc.toFixedZ(item.price)}}</span> 元
              </p>
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <div class="task_title">
        <span></span>推荐任务
        <span @click="$router.push('/task/list')">更多推荐</span>
      </div>
      <div class="task_body">
        <van-list v-model="loading" :finished="finished" finished-text="推荐任务已完成" @load="onLoad">
          <div class="mission_item" v-for="(item,i) in datalist" :key="i" style="margin-bottom:10px">

          </div>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script>
import moduleTitle from '@/components/page/vip/moduleTitle'
import { Swipe, SwipeItem, List } from 'vant';
export default {
  name: "",
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
      page_size: 10,
      page: 1,
      loading: false,
      finished: false,
      express: [],
      datalist: [],
      active: '',
      catelist: [],
      bannerHeight: "",
    };
  },
  components: {
    moduleTitle,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [List.name]: List,

  },
  created () {
    this.getexpress();
    // this.getrecommend();
  },
  mounted () { },
  methods: {
    onLoad () {
      var params = {
        iden: 'recommend',
        page: this.page,
        page_size: this.page_size,
      }
      this.$api.getTask.get_tasklist(params).then(res => {
        if (res.code == 200) {
          if (this.page === 1) this.datalist = [];
          let arr = res.result;
          this.datalist = this.datalist.concat(arr);
          if (res.result && res.result.length == this.page_size) {
            this.page++;
          } else {
            this.finished = true;
          }
          this.loading = false;
        }
      })
    },
    getrecommend () {
      var params = {
        iden: 'recommend',
        page: 1,
        page_size: 50,
      }
      this.$api.getTask.get_tasklist(params).then(res => {
        if (res.code == 200) {
          this.datalist = res.result;
        }
      })
    },
    getexpress () {
      this.$api.getTask.get_taskexpress({}).then(res => {
        if (res.code == 200) {
          this.express = res.result;
        }
      })
    },
    href_inspect (val) {
      if (val == "/plugin/turntable") {
        this.$store.commit("set_turnshow", true);
        return;
      }
      this.$fnc.goLink(val);

    }
  },
  watch: {

  },
};
</script>
<style lang='less' scoped>
.righttitlte {
  //   width: 50% !important;
  font-size: 16px;
  color: #313131;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.assemble-item {
  padding: 13px 10px 17px;
  > div:not(:first-child) {
    margin-top: 10px;
  }
}
.groupbuy_cate {
  width: 100%;
  height: 100%;
  background: #ffffff;
  padding: 0 10px 0 3px;
}
.cityinfotabbox {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;
  > div {
    width: 100%;
    background-color: #fff;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
}
.task_box {
  width: 95%;
  margin: 0 auto;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: center;

  .task_report {
    width: 100%;
    height: 32px;
    background-color: #ffffff;
    padding: 0 10px;
    .task_report_item {
      width: 100%;
      height: 32px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: flex-start;
      align-items: center;
      .task_left {
        width: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        > img {
          width: 100%;
        }
      }
      .seamless-warp {
        flex: 1;
        height: 32px;
        line-height: 32px;
        overflow: hidden;
      }
      p {
        // flex: 1;
        width: 100%;
        font-size: 14px;
        padding-left: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 32px;
        display: flex;
        flex-wrap: nowrap;
        justify-content: flex-start;
        align-items: center;
        > img {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 5px;
        }
        > span {
          color: #ff4759;
        }
      }
    }
  }
  .task_title {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    color: #f2b415;
    height: 50px;
    > span:nth-of-type(1) {
      width: 3px;
      height: 20px;
      background-color: #f2b415;
      font-size: 16px;
      margin-right: 5px;
      font-weight: bold;
    }
    > span:nth-of-type(2) {
      background-color: #f2b415;
      font-size: 12px;
      color: #48576c;
      background-color: #ececec;
      margin-left: auto;
      padding: 2px 5px;
      border-radius: 5px;
    }
  }
  .task_body {
    width: 100%;
  }
}
</style>
