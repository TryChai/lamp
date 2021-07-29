<template>
  <!-- 新手任务的积分商品 -->
  <div>
    <div class="integral_box_item">
      <div class="integral_box_item_top">
        <img :src="$fnc.getImgUrl(shop.piclink)" alt="">
      </div>
      <div class="integral_box_item_title">
        <p>{{shop.title}}
        </p>
        <p>积分：<span>{{$fnc.toFixedZ(shop.score_rob)}}</span></p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "component_name",
    data() {
      return {

      };
    },
    props: {
      shop: {
        type: Object,

      }
    },
    components: {},
    methods: {

    },
    created() {

    },
  }
</script>
<style scoped>
  .integral_box_item {
    width: 100%;
    display: flex;
    flex-flow: column;
    justify-content: flex-start;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
    background: #ffffff;
  }

  .integral_box_item_top {
    width: 100%;
  }

  .integral_box_item_top img {
    width: 100%;
  }

  .integral_box_item_title {
    width: 92%;
    margin: 0 auto;
    padding: 5px 0;
  }

  .integral_box_item_title p:nth-of-type(1) {
    width: 100%;
    font-size: 14px;
    height: 40px;
    color: #000000;
    text-align: justify;
    line-height: 20px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .integral_box_item_title p:nth-of-type(2) {
    font-size: 14px;
    color: #999999;
    line-height: 36px;
  }

  .integral_box_item_title p:nth-of-type(2) span {
    font-size: 16px;
    color: #f70134;
    font-weight: bold;
  }
</style>
