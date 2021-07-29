<template>
  <div class="shop_params">
    <div class="params_tit">
      <p>产品参数</p>
    </div>

    <div class="params_item">
      <div v-for="(list,index) in params_list" :key="index" class="van-hairline--bottom">
        <p>{{list.title}}</p>
        <p>{{list.desc}}</p>
      </div>
    </div>

    <div class="params_btn">
      <van-button class="btn_team" type="default" @click="closePop">确定</van-button>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    shopInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    closePop() {
      this.$emit("closePop");
    }
  },
  computed: {
    params_list() {
      return JSON.parse(this.shopInfo.pro_params);
    }
  }
};
</script>


<style lang="less" scoped>
.shop_params {
  padding: 20px 0 65px;
  line-height: 1;
  position: relative;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .params_tit {
    width: 100%;
    text-align: center;
    font-size: 16px;
    padding: 0 16px;
    padding-bottom: 8px;
  }
  .params_item {
    width: 100%;
    font-size: 14px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 16px;
    div {
      width: 100%;
      padding: 12px 0;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      > p:nth-of-type(1) {
        width: 30%;
        color: #9d9d9d;
      }
      > p:nth-of-type(2) {
        width: 70%;
      }
    }
  }
  .params_btn {
    width: 100%;
    position: fixed;
    bottom: 0;
    background: #fff;
    .btn_team {
      width: 340px;
      height: 46px;
      line-height: 46px;
      display: block;
      margin: 0 auto;
      background: linear-gradient(to right top, #f2140c, #f34a0c);
      color: #fff;
      border-radius: 27px;
      margin-bottom: 10px;
    }
  }
}
</style>
