<template>
  <div class="shop_recommend">
    <h3>推荐榜单</h3>
    <ul>
      <li v-for="(item,i) in top_list" :key="i">
        <router-link :to="item.links">
          <img :src="$fnc.getImgUrl(item.piclink)" alt>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    top_list: {
      type: Array,
      default:()=>{return []} 
    }
  }
};
</script>


<style lang="less" scoped>
.shop_recommend {
  padding-top: 12px;
  h3 {
    font-size: 19px;
    font-weight: bold;
  }
  > ul {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    flex-wrap: wrap;
    > li {
      width: 49%;
      // height: 80px;

      img {
        max-height: none;
        max-width: none;
        height: 100%;
        width: 100%;
      }
    }
    > li:first-child {
      margin-right: 0% !important;
      width: 100%;
      // margin-bottom: 2%;
    }
    > li:nth-child(3) {
      margin-right: 2% !important;
      width: 49%;
    }
    > li:nth-child(2) {
      width: 100%;
      margin-top: 2%;
      // height: 100px;
    }
    > li:nth-child(4) {
      width: 49%;
      margin-right: 0% !important;
      margin-top: 2%;
    }
    > li:nth-child(5) {
      margin-right: 2%;
      margin-top: 2%;
    }
    > li:nth-of-type(odd) {
      margin-right: 2%;
      margin-top: 2%;
    }
  }
}
</style>
