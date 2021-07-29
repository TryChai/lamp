<template>
  <div class="shops-head">
    <div class="fx shops-head-coty" @click="showHead">
      <span :style="{ color: size_color }">
        {{ address }}
      </span>
      <van-icon name="arrow-down" :color="size_color" />
    </div>
    <van-search
      v-model="search"
      @search="search_btn"
      placeholder="请输入搜索关键词"
    />
    <div class="fx shops-head-icon" v-if="headers && headers.length > 0">
      <div v-for="(item, i) in headers" :key="i">
        <van-icon
          v-if="item.piclink"
          :name="item.piclink"
          :color="size_color"
          @click="$fnc.toLinks(item.links)"
        ></van-icon>
      </div>
    </div>

    <van-popup
      class="city-con-pop"
      get-container="body"
      v-model="show"
      position="top"
      :overlay="false"
    >
      <shops-head-citys
        @emitAddress="getemitAddress"
        :paramsCity="paramsCity"
      />
    </van-popup>
  </div>
</template>

<script>
import { Search } from "vant";
import shopsHeadCitys from "./shops-head-citys";
export default {
  name: "",
  props: {
    dia_show: {
      type: Boolean,
      default: false,
    },
    paramsCity: {
      type: Object,
      default: () => {},
    },
    placeholder: {
      type: String,
      default: "请输入店铺名",
    },
    size_color: [String],
    size_color1: [String],
    headers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      show: false,
      params: {
        province: "",
        city: "",
        area: "",
      },
      search: "",
    };
  },
  computed: {
    address() {
      var params = this.params;
      if (params.area) {
        return params.area;
      } else if (params.city) {
        if (params.city == "直辖区") {
          return this.sliceCity(params.province);
        } else {
          return this.sliceCity(params.city);
        }
      } else {
        return "未知";
      }
    },
  },
  components: {
    shopsHeadCitys,
    [Search.name]: Search,
  },
  created() {
    this.params = this.paramsCity;
    if (this.dia_show) {
      this.show = true;
    }
  },
  mounted() {},
  methods: {
    checkTabs(tabs) {
      this.$emit("hidePop", tabs);
    },
    showHead() {
      this.show = !this.show;
      this.$emit("hidePop", this.show);
      this.$bus.$emit("toggleHead");
    },
    search_btn() {
      this.$emit("searchTitle", this.search);
    },
    sliceCity(str) {
      return str.slice(0, str.indexOf("市"));
    },
    getemitAddress(params) {
      this.show = false;
      this.params = params;
      this.$emit("hidePop", this.show);
      this.$emit("emitAddress", params);
    },
  },
  watch: {
    dia_show(val) {
      this.show = val;
    },
    show(val) {
      this.$emit("showTabs", val);
    },
    paramsCity(val) {
      this.params = val;
    },
  },
};
</script>
<style lang='less' scoped>
.shops-head {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;

  .shops-head-coty {
    margin-right: 10px;
    > span {
      font-weight: bold;
      font-size: 17px;
      text-align: center;
      padding: 3px 0 0;
    }
    .van-icon {
      font-size: 12px;
      margin-left: 4px;
      font-weight: bold;
      vertical-align: middle;
    }
  }

  .van-search {
    flex: 1;
    padding: 0;
    background: transparent;
    .van-search__content {
      border-radius: 8px;
    }
  }

  .shops-head-icon .van-icon {
    font-size: 24px;
    margin-left: 10px;
    vertical-align: middle;
  }
}
.city-con-pop {
  top: 50px;
  max-height: 100%;
  height: ceil(100%-13px);
  border-radius: 0;
}
</style>
