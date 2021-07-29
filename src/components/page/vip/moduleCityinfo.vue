<template>
  <div class="module_part_body" :style="{backgroundColor:background}">

    <moduleTitle :info="info" background="#fff"></moduleTitle>
    <div class="active_box cityinfotab">
      <van-tabs class="groupbuy_cate" color="#51BF4D" title-active-color="#3A4658" title-inactive-color="#3A4658" v-model="tabactive" :border="false"
          @change="tabchange">
        <van-tab title="最新信息" name="最新消息"></van-tab>
        <van-tab title="附近信息" name="附近信息"></van-tab>
        <van-tab v-for="(item,i) in catelist" :title="item.title" :key="i" :name="i">
        </van-tab>
      </van-tabs>
      <div class="cityinfotabbox">
        <van-list v-model="loading" :finished="finished" finished-text="信息推荐已完成" @load="onLoad">
          <div v-for="(item,i) in datalist" :key="i" class="news_item">
            <!-- <newsitem :info="item"></newsitem> -->
          </div>
        </van-list>
      </div>
    </div>
    <div style="display:none">
      <getaddress></getaddress>
    </div>
  </div>
</template>

<script>
import moduleTitle from '@/components/page/vip/moduleTitle'
import { Tab, Tabs, List } from 'vant';
import getaddress from '@/components/currency/getaddress'
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
      tabactive: '最新消息',
      page_size: 10,
      page: 1,
      loading: false,
      finished: false,
      datalist: [],
      catelist: [],
      bannerHeight: "",
    };
  },
  components: {
    moduleTitle,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    getaddress

  },
  created () {
    this.getcate();
    // this.getcityinfo({ order_type: 1 });
  },
  mounted () { },
  methods: {
    onLoad (e) {
      var params = {};

      switch (true) {
        case this.tabactive == '最新消息':
          params.order_type = 1;
          break;
        case this.tabactive == '附近信息':
          params.latitude = this.$store.state.nowposition.latitude || ''
          params.longitude = this.$store.state.nowposition.longitude || ''
          break;
        default:
          params.id = this.catelist[e].id
          break;
      }
      params.page = this.page;
      params.page_size = this.page_size;

      this.$api.getPage.get_cityinfo_list_nologin(params).then(res => {
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
    tabchange (e) {
      this.page = 1;
      this.onLoad(e)
    },
    getcityinfo (obj) {
      // id 分类id
      // title 名称搜索
      // type 传1就是查看自己的信息
      // order_type 1最新 2最热
      // longitude 经度
      // latitude 纬度 经纬度来获取最近的信息
      obj.page_size = 50;
      obj.page = 1;
      this.$api.getPage.get_cityinfo_list_nologin(obj).then(res => {
        if (res.code == 200) {
          this.datalist = res.result;
        }
      })
    },
    getcate () {
      this.$api.getPage.get_cityinfo_cate_nologin({}).then(res => {
        if (res.code == 200) {

          this.catelist = res.result;
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
  border-bottom: 1px solid #fff;
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
</style>
