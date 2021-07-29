<template>
  <div class="shop_find">
    <h3>发现品牌</h3>
    <ul class="find_list">
      <li v-for="(item,i) in top_find" :key="i">
        <router-link :to='item.links'>
          <img :src="$fnc.getImgUrl(item.piclink)" alt>
        </router-link>
      </li>    
    </ul>
  </div>
</template>


<script>
export default {
  props:{
        top_find:{
            type:Array,
            default:[]
        }
    }
}
</script>

<style lang="less" scoped>
.shop_find {
  padding-top: 12px;
  h3 {
    font-size: 19px;
    font-weight: bold;
  }
  .find_list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    > li {
      width: 23.5%;
      img {
        max-width: none;
        max-height: none;
        width: 100%;
      }
    }
    > li:nth-child(1),
    li:nth-child(2),
    li:nth-child(3) {
      width: 32%;
    }
    li:nth-child(2) {
      margin: 0 2% 0;
    }
    li:nth-child(4),
    li:nth-child(5) {
      width: 49%;
          margin-top: 2%;

    }
    li:nth-child(4) {
      margin-right: 2%;
     margin-top: 2%;

    }
    li:nth-child(5) ~ li {
      margin-right: 2%;
      margin-top: 2%;

    }
    li:nth-child(9),
    li:nth-child(13),
    li:nth-child(17),
    li:nth-child(21),
    li:nth-child(24),
    li:nth-child(27),
    li:nth-child(30) {
      margin-right: 0 !important;
    }
  }
}
</style>
