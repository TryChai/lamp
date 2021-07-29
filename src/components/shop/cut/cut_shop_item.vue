<template>
  <div class="cut_item">
    <div class="cut_item_left" @click="cut_btn(info.id)">
      <img :src="$fnc.getImgUrl(info.piclink)" alt="">
    </div>
    <div class="cut_item_right" @click="cut_btn(info.id)">
      <p>{{info.title}}</p>
      <p><span>限{{info.bargain_time}}小时</span> <span>仅需{{info.bargain_number}}人</span></p>
      <div class="cut_item_right_price1">
        <p>最低价:<span>￥{{$fnc.toFixedZ(price)}}</span></p>
        <p @click="cut_btn(info.id)">
          发起砍价</p>
      </div>
      <div class="cut_item_right_price2">
        <p>零售价:￥{{info.price}}</p>
        <p>{{info.bargain_all_num}}人砍价成功</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "cut_shop_item",
  data () {
    return {
    };
  },
  computed: {
    price () {
      return this.info.price - (Number(this.info.bargain_end) * Number(this.info.bargain_number)) > 0 ? this.info.price - (Number(this.info.bargain_end) * Number(this.info.bargain_number)) : 0
    },
  },
  props: {
    info: {
      type: Object,

    }
  },
  components: {
  },
  methods: {
    cut_btn (id) {
      this.$router.push({ path: '/shop/cut/detail', query: { uid: this.$store.state.user.id, pid: id } })
    },
  },
}
</script>
<style  scoped>
.cut_item {
  width: 92%;
  height: 140px;
  padding: 10px 10px 5px 10px;
  margin: 10px auto 0 auto;
  background-color: #ffffff;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
}
.cut_item_left {
  width: 35%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding-right: 10px; */
}
.cut_item_left img {
  width: 100%;
}
.cut_item_right {
  width: 62%;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: flex-start;
}
.cut_item_right > p:nth-of-type(1) {
  font-size: 14px;
  height: 36px;
  line-height: 18px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.cut_item_right > p:nth-of-type(2) {
  width: 100%;
  /* height: 40px; */
  margin-top: 5px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}
.cut_item_right > p:nth-of-type(2) span {
  font-size: 10px;
  color: #ff2043;
  /* background-color: #fdebeb; */
  border: 1px solid #ff2043;
  border-radius: 3px;
  padding: 0px 10px;
  margin-right: 10px;
}
.cut_item_right_price1 {
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
}
.cut_item_right_price1 > p:nth-of-type(1) {
  width: 130px;
  font-size: 12px;
  font-weight: bold;
  color: #000000;
  line-height: 14px;
}
.cut_item_right_price1 > p:nth-of-type(1) span {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  color: #ff2043;
}
.cut_item_right_price1 > p:nth-of-type(2) {
  font-size: 12px;
  font-weight: bold;
  color: #ffffff;
  background-color: #ff3a63;
  background: -webkit-linear-gradient(
    to left,
    #ff3a63,
    #ff7d5e
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    to left,
    #ff3a63,
    #ff7d5e
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    to left,
    #ff3a63,
    #ff7d5e
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to left, #ff3a63, #ff7d5e); /* 标准的语法 */
  border-radius: 10px;
  padding: 2px 10px;
  border-radius: 20px;
}
.cut_item_right_price2 {
  width: 100%;
  height: 30px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
}
.cut_item_right_price2 > p:nth-of-type(1) {
  font-size: 12px;
  color: #999999;
}
.cut_item_right_price2 > p:nth-of-type(2) {
  font-size: 12px;
  color: #333333;
  font-weight: bold;
}
</style>