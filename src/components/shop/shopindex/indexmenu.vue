<template>
  <div class="shop_menu">
    <ul class="fx">
      <li v-for="(item,n) in top_menu" :key="n">
          <router-link :to="item.links">
            <img :src="$fnc.getImgUrl(item.piclink)"  alt>
            <p>{{item.title}}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 10
    };
  },
  props:{
    top_menu:{
      type:Array,
      default:[]
    }
  }
};
</script>


<style lang="less" scoped>
.shop_menu {
    margin-top: 13px;
  > ul {
    flex-wrap: wrap;
    > li {
      width: 20%;
      text-align: center;
      img {
        width: 46px;
      }
      p{
          font-size: 10px;
          color: #585858;
          padding: 10px 0;
      }
    }
  }
}
</style>

